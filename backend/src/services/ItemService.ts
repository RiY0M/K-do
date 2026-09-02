import { PrismaClient } from '@prisma/client';
import { ItemServiceError } from '../errors/ItemServiceError';
import { KdoDto, toKdoDto } from './itemMapper';

/**
 * Handles individual KDo (gift idea) mutations. Backs the routes under
 * /api/kdo/* - see backend/src/routes/kdo.
 *
 * NOTE: this file previously referenced a `Group` model / `groupId` field
 * that no longer exists in prisma/schema.prisma (it's `List` / `listId`
 * now) - it looks like a rename happened at some point and this service was
 * never updated to match, which would have failed to compile against the
 * current generated Prisma client. Everything below has been rewritten
 * against the actual current schema.
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
        await this.assertListAccess(userId, listId);

        const lastItem = await this.prisma.kDo.findFirst({
            where: {
                authorId: userId,
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

        return toKdoDto(kDo);
    }

    /**
     * Backs POST /kdo/friend/create (createFriendKdo in
     * frontend/src/services/api/kdos.ts).
     *
     * TODO / known limitation: there is no column on `k_dos` that says "this
     * is a surprise idea I (the author) added while browsing someone else's
     * wishlist" as opposed to "this is genuinely my own wishlist item" - the
     * schema can't tell the two apart. ListService.getListByFriendId works
     * around this by merging in the caller's own items on the shared list
     * when building a friend's page, but if the same caller looks at their
     * OWN list afterwards, this item will show up there too, mixed in with
     * their real wishlist. A cleaner fix would add something like a
     * `recipientId` column to `k_dos` to record who the idea is actually for.
     */
    async createSurpriseItem(userId: string, listId: string, value = ''): Promise<KdoDto> {
        return this.createItem(userId, listId, value);
    }

    async updateItem(userId: string, itemId: string, value: string): Promise<KdoDto> {
        await this.assertOwnedItem(userId, itemId);

        const kDo = await this.prisma.kDo.update({
            where: { id: itemId },
            data: { label: value },
        });

        await this.touchLastSave(userId);

        return toKdoDto(kDo);
    }

    /**
     * Sets (not toggles) the item author's own "done/planned" flag
     * (KDo.isChecked - "Is checked by author, not by other people", per the
     * schema comment). Matches checkMyKdo(id, isChecked) in
     * frontend/src/services/api/kdos.ts, which now sends the desired state
     * explicitly rather than relying on the server to flip it.
     */
    async checkItem(userId: string, itemId: string, isChecked: boolean): Promise<KdoDto> {
        await this.assertOwnedItem(userId, itemId);

        const kDo = await this.prisma.kDo.update({
            where: { id: itemId },
            data: { isChecked },
        });

        await this.touchLastSave(userId);

        return toKdoDto(kDo);
    }

    /**
     * Sets (not toggles) whether the caller has reserved/taken one of a
     * friend's gift ideas (UserKDo). Deliberately separate from `isChecked`
     * above: the whole point is that the item's own author must never see
     * who has claimed it, or it would spoil the surprise. See
     * prisma/migrations/20260829120000_move_haschecked_to_user_k_dos - the
     * previously-applied migration actually put `hasChecked` on the wrong
     * table for this to work; that migration fixes it.
     */
    async setTaken(userId: string, itemId: string, isChecked: boolean): Promise<KdoDto> {
        const item = await this.assertAccessibleItem(userId, itemId);

        if (item.authorId === userId) {
            throw new ItemServiceError('You cannot reserve your own item', 403);
        }

        const existing = await this.prisma.userKDo.findFirst({
            where: { userId, kDoId: itemId },
        });

        if (isChecked && !existing) {
            await this.prisma.userKDo.create({
                data: { userId, kDoId: itemId, hasChecked: true },
            });
        } else if (!isChecked && existing) {
            await this.prisma.userKDo.delete({ where: { id: existing.id } });
        }

        const takenBy = await this.getTakenBy(itemId);

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

    async getTakenBy(itemId: string) {
        const userKDos = await this.prisma.userKDo.findMany({
            where: { kDoId: itemId, hasChecked: true },
            include: { user: true },
        });

        return userKDos.map((userKDo) => ({
            id: userKDo.user.id,
            name: userKDo.user.username,
            isFriend: true,
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

    /** Any non-deleted item on a list the caller is a member (or author) of. */
    private async assertAccessibleItem(userId: string, itemId: string) {
        const item = await this.prisma.kDo.findFirst({
            where: {
                id: itemId,
                deletedAt: null,
                listKDos: {
                    some: {
                        list: {
                            deletedAt: null,
                            OR: [{ authorId: userId }, { userLists: { some: { userId } } }],
                        },
                    },
                },
            },
        });

        if (!item) {
            throw new ItemServiceError('Item not found', 404);
        }

        return item;
    }

    private async assertListAccess(userId: string, listId: string): Promise<void> {
        const list = await this.prisma.list.findFirst({
            where: {
                id: listId,
                deletedAt: null,
                OR: [{ authorId: userId }, { userLists: { some: { userId } } }],
            },
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
