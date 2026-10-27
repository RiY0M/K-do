import { PrismaClient } from '@prisma/client';
import { ItemServiceError } from '../errors/ItemServiceError';
import { KdoDto, LinkDto, toKdoDto, toLinkDto } from './itemMapper';
import { areFriends, getFriendIds } from './friendshipQueries';

// Maximum number of links on one item
export const MAX_LINKS_PER_ITEM = 20;

/**
 * Handles individual KDo (gift idea) mutations. Backs the routes under
 * /api/kdo/*.
 */
export class ItemService {
    constructor(private prisma: PrismaClient) {}

    /**
     * Creates a new (blank) item on one of the caller's own lists. The
     * frontend creates the row first via this endpoint and lets the user
     * fill in the label afterwards through PATCH /kdo/updateLabel/:id (see
     * EditableCheckLine.tsx), so `value` is optional / blank by default.
     */
    async createItem(userId: string, listId: string, value = ''): Promise<KdoDto> {
        await this.assertOwnedList(userId, listId);

        const lastItem = await this.prisma.kDo.findFirst({
            where: {
                authorId: userId,
                recipientId: null,
                deletedAt: null,
                listKDos: { some: { listId } },
            },
            orderBy: { position: 'desc' },
        });

        const kDo = await this.prisma.kDo.create({
            data: {
                label: value,
                authorId: userId,
                position: (lastItem?.position ?? 0) + 1,
                listKDos: { create: { listId } },
            },
        });

        await this.touchLastSave(userId);

        return { ...toKdoDto(kDo), authorId: kDo.authorId };
    }

    /**
     * Backs POST /kdo/friend/create: adds a "surprise" gift idea for a friend
     * (KDo.recipientId). It shows up on that friend's page for everyone but
     * them, and never on the author's own list.
     */
    async createSurpriseItem(userId: string, friendId: string, value = ''): Promise<KdoDto> {
        if (!(await areFriends(this.prisma, userId, friendId))) {
            throw new ItemServiceError('You are not friends with this user', 403);
        }

        const lastItem = await this.prisma.kDo.findFirst({
            where: { recipientId: friendId, deletedAt: null },
            orderBy: { position: 'desc' },
        });

        const kDo = await this.prisma.kDo.create({
            data: {
                label: value,
                authorId: userId,
                recipientId: friendId,
                position: (lastItem?.position ?? 0) + 1,
            },
        });

        await this.touchLastSave(userId);

        return { ...toKdoDto(kDo), authorId: kDo.authorId };
    }

    async updateItem(userId: string, itemId: string, value: string): Promise<KdoDto> {
        await this.assertOwnedItem(userId, itemId);

        const kDo = await this.prisma.kDo.update({
            where: { id: itemId },
            data: { label: value },
        });

        await this.touchLastSave(userId);

        return { ...toKdoDto(kDo), authorId: kDo.authorId };
    }

    /**
     * Sets (not toggles) the item author's own "done/planned" flag
     * (KDo.isChecked - "Is checked by author, not by other people", per the
     * schema comment). Matches checkMyKdo(id, isChecked) in
     * frontend/src/services/api/kdos.ts.
     */
    async checkItem(userId: string, itemId: string, isChecked: boolean): Promise<KdoDto> {
        await this.assertOwnedItem(userId, itemId);

        const kDo = await this.prisma.kDo.update({
            where: { id: itemId },
            data: { isChecked },
        });

        await this.touchLastSave(userId);

        return { ...toKdoDto(kDo), authorId: kDo.authorId };
    }

    /**
     * Sets (not toggles) whether the caller has reserved/taken one of a
     * friend's gift ideas (UserKDo). Deliberately separate from `isChecked`
     * above: the item's recipient must never see who has claimed it, or it
     * would spoil the surprise.
     */
    async setTaken(userId: string, itemId: string, isChecked: boolean): Promise<KdoDto> {
        const item = await this.assertAccessibleItem(userId, itemId);

        if (item.authorId === userId) {
            throw new ItemServiceError('You cannot reserve your own item', 403);
        }

        if (isChecked) {
            await this.prisma.userKDo.upsert({
                where: { userId_kDoId: { userId, kDoId: itemId } },
                create: { userId, kDoId: itemId, hasChecked: true },
                update: { hasChecked: true },
            });
        } else {
            await this.prisma.userKDo.deleteMany({ where: { userId, kDoId: itemId } });
        }

        const takenBy = await this.getTakenBy(userId, itemId);

        return { ...toKdoDto(item), takenBy };
    }

    async deleteItem(userId: string, itemId: string): Promise<boolean> {
        await this.assertOwnedItem(userId, itemId);

        await this.prisma.kDo.update({
            where: { id: itemId },
            data: { deletedAt: new Date() },
        });

        await this.touchLastSave(userId);

        return true;
    }

    /**
     * Attaches a link to one of the caller's own items. Friends can see and
     * open the links, only the author can add or remove them.
     */
    async addLink(userId: string, itemId: string, href: string): Promise<LinkDto> {
        await this.assertOwnedItem(userId, itemId);

        const count = await this.prisma.link.count({ where: { kDoId: itemId } });
        if (count >= MAX_LINKS_PER_ITEM) {
            throw new ItemServiceError('Too many links on this item', 400);
        }

        const link = await this.prisma.link.create({
            data: { href, kDoId: itemId, authorId: userId },
        });

        await this.touchLastSave(userId);

        return toLinkDto(link);
    }

    async deleteLink(userId: string, linkId: string): Promise<boolean> {
        const link = await this.prisma.link.findFirst({
            where: { id: linkId, kDo: { deletedAt: null } },
        });

        if (!link) {
            throw new ItemServiceError('Link not found', 404);
        }

        if (link.authorId !== userId) {
            throw new ItemServiceError('You do not own this link', 403);
        }

        await this.prisma.link.delete({ where: { id: linkId } });
        await this.touchLastSave(userId);

        return true;
    }

    /** Who reserved this item, as seen by `viewerId` (isFriend is relative to them). */
    async getTakenBy(viewerId: string, itemId: string) {
        const [userKDos, friendIds] = await Promise.all([
            this.prisma.userKDo.findMany({
                where: { kDoId: itemId, hasChecked: true },
                include: { user: true },
            }),
            getFriendIds(this.prisma, viewerId),
        ]);

        return userKDos.map((userKDo) => ({
            id: userKDo.user.id,
            name: userKDo.user.username,
            isFriend: friendIds.has(userKDo.user.id),
        }));
    }

    private async assertOwnedItem(userId: string, itemId: string) {
        const item = await this.prisma.kDo.findFirst({
            where: { id: itemId, deletedAt: null },
        });

        if (!item) {
            throw new ItemServiceError('Item not found', 404);
        }

        if (item.authorId !== userId) {
            throw new ItemServiceError('You do not own this item', 403);
        }

        return item;
    }

    /**
     * An item the caller is allowed to see on a friend's page:
     * - a wish of a friend, on one of that friend's lists the caller is a
     *   member of;
     * - a surprise idea for one of the caller's friends (never for the caller
     *   themself).
     */
    private async assertAccessibleItem(userId: string, itemId: string) {
        const item = await this.prisma.kDo.findFirst({
            where: { id: itemId, deletedAt: null },
            include: {
                listKDos: {
                    where: { list: { deletedAt: null, userLists: { some: { userId } } } },
                    select: { id: true },
                },
            },
        });

        if (!item) {
            throw new ItemServiceError('Item not found', 404);
        }

        const { listKDos, ...kDo } = item;

        if (kDo.recipientId) {
            if (kDo.recipientId !== userId && (await areFriends(this.prisma, userId, kDo.recipientId))) {
                return kDo;
            }
        } else if (
            kDo.authorId === userId ||
            (listKDos.length > 0 && (await areFriends(this.prisma, userId, kDo.authorId)))
        ) {
            return kDo;
        }

        throw new ItemServiceError('Item not found', 404);
    }

    private async assertOwnedList(userId: string, listId: string): Promise<void> {
        const list = await this.prisma.list.findFirst({
            where: { id: listId, authorId: userId, deletedAt: null },
        });

        if (!list) {
            throw new ItemServiceError('List not found', 404);
        }
    }

    private async touchLastSave(userId: string): Promise<void> {
        await this.prisma.user.update({
            where: { id: userId },
            data: { lastSave: new Date() },
        });
    }
}
