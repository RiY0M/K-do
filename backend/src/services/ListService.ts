import { Prisma, PrismaClient } from '@prisma/client';
import { ListServiceError } from '../errors/ListServiceError';
import { KdoDto, toKdoDto } from './itemMapper';
import { areFriends, getFriendIds } from './friendshipQueries';

export interface UserSummary {
    id: string;
    name: string;
    isFriend: boolean;
}

export interface ListSummaryDto {
    id: string;
    label: string;
    description: string;
    position: number;
    friends: UserSummary[];
}

export interface ListDetailDto {
    id: string;
    label: string;
    description: string;
    position: number;
    uncheckedKdos: KdoDto[];
    checkedKdos: KdoDto[];
}

type ListMeta = { id: string; label: string; description: string | null; position: number };

// Label of the list every user gets automatically (see ensureDefaultList).
export const DEFAULT_LIST_LABEL = 'Tous';

/**
 * Handles List reads/writes. Backs the routes under /api/list/*.
 *
 * A List belongs to its author (List.authorId) and is shared with its members
 * (UserList). Becoming friends adds each user to the other's default list
 * (see FriendService), which is what lets friends see each other's wishes.
 */
export class ListService {
    constructor(private prisma: PrismaClient) {}

    /** The lists I own, with their members. */
    async getMyLists(userId: string): Promise<ListSummaryDto[]> {
        await this.ensureDefaultList(userId);

        const lists = await this.prisma.list.findMany({
            where: { authorId: userId, deletedAt: null },
            orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
            include: {
                userLists: { include: { user: true } },
            },
        });

        const friendIds = await getFriendIds(this.prisma, userId);

        return lists.map((list) => this.toListSummary(list, userId, friendIds));
    }

    async createList(userId: string, label: string): Promise<ListSummaryDto> {
        const lastList = await this.prisma.list.findFirst({
            where: { authorId: userId, deletedAt: null },
            orderBy: { position: 'desc' },
        });

        const list = await this.prisma.list.create({
            data: {
                label,
                authorId: userId,
                position: (lastList?.position ?? 0) + 1,
            },
        });

        return {
            id: list.id,
            label: list.label,
            description: list.description ?? '',
            position: list.position,
            friends: [],
        };
    }

    /**
     * Returns the user's default list (their oldest one), creating it if they
     * don't have any yet. Users registered before lists were created at
     * registration may not have one.
     *
     * The advisory lock serializes concurrent calls for the same user (e.g.
     * React StrictMode firing the same request twice in dev), so we never end
     * up with two default lists.
     */
    async ensureDefaultList(userId: string, client?: Prisma.TransactionClient): Promise<ListMeta> {
        const run = async (tx: Prisma.TransactionClient) => {
            await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${userId}))`;

            const existing = await tx.list.findFirst({
                where: { authorId: userId, deletedAt: null },
                orderBy: { createdAt: 'asc' },
            });

            if (existing) {
                return existing;
            }

            return tx.list.create({
                data: { label: DEFAULT_LIST_LABEL, authorId: userId, position: 1 },
            });
        };

        const list = client ? await run(client) : await this.prisma.$transaction(run);

        return { id: list.id, label: list.label, description: list.description, position: list.position };
    }

    async updateDescription(userId: string, listId: string, description: string) {
        // Only the list author can edit the description: Description.tsx is
        // only rendered from MyFullListSection (i.e. your own list).
        const list = await this.prisma.list.findFirst({
            where: { id: listId, authorId: userId, deletedAt: null },
        });

        if (!list) {
            throw new ListServiceError('List not found', 404);
        }

        const updated = await this.prisma.list.update({
            where: { id: listId },
            data: { description },
        });

        return {
            id: updated.id,
            label: updated.label,
            description: updated.description ?? '',
            position: updated.position,
        };
    }

    /** One of my own lists, with my own wishes (never surprise ideas). */
    async getMyListByListId(userId: string, listId: string): Promise<ListDetailDto> {
        const list = await this.prisma.list.findFirst({
            where: { id: listId, authorId: userId, deletedAt: null },
        });

        if (!list) {
            throw new ListServiceError('List not found', 404);
        }

        const items = await this.prisma.kDo.findMany({
            where: {
                authorId: userId,
                recipientId: null,
                deletedAt: null,
                listKDos: { some: { listId } },
            },
            orderBy: { position: 'asc' },
        });

        return this.buildListDetail(
            list,
            items.map((item) => ({ ...toKdoDto(item), authorId: item.authorId }))
        );
    }

    /**
     * Builds a friend's list as seen from their page (FriendFullListSection):
     * - the friend's own wishes on their lists I'm a member of. authorId is
     *   omitted so the frontend renders them as reservable FriendCheckLine
     *   rows, with the `takenBy` list;
     * - surprise ideas added for this friend (KDo.recipientId). Mine keep
     *   their authorId so the frontend renders them as editable
     *   EditableCheckLine rows; other people's are reservable like the rest.
     *
     * The friend never sees any of this: their own page only shows their own
     * wishes, without takenBy and without surprise ideas.
     */
    async getListByFriendId(userId: string, friendId: string): Promise<ListDetailDto> {
        if (userId === friendId) {
            throw new ListServiceError('Cannot view your own list as a friend', 400);
        }

        if (!(await areFriends(this.prisma, userId, friendId))) {
            throw new ListServiceError('You are not friends with this user', 403);
        }

        const sharedLists = await this.prisma.list.findMany({
            where: {
                authorId: friendId,
                deletedAt: null,
                userLists: { some: { userId } },
            },
            orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
            select: { id: true, label: true, description: true, position: true },
        });

        const listMeta = sharedLists[0] ?? (await this.ensureDefaultList(friendId));
        const sharedListIds = sharedLists.map((list) => list.id);

        const friendItems = await this.prisma.kDo.findMany({
            where: {
                authorId: friendId,
                recipientId: null,
                deletedAt: null,
                listKDos: { some: { listId: { in: sharedListIds } } },
            },
            orderBy: { position: 'asc' },
        });

        const surpriseItems = await this.prisma.kDo.findMany({
            where: { recipientId: friendId, deletedAt: null },
            orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
        });

        const friendIds = await getFriendIds(this.prisma, userId);
        const reservableItems = [...friendItems, ...surpriseItems.filter((item) => item.authorId !== userId)];
        const takenBy = await this.getTakenBy(
            reservableItems.map((item) => item.id),
            friendIds
        );

        const allItems: KdoDto[] = [...friendItems, ...surpriseItems].map((item) =>
            item.authorId === userId
                ? { ...toKdoDto(item), authorId: item.authorId }
                : { ...toKdoDto(item), takenBy: takenBy.get(item.id) ?? [] }
        );

        return this.buildListDetail(listMeta, allItems);
    }

    /** Who reserved each of the given items, keyed by item id. */
    private async getTakenBy(kDoIds: string[], viewerFriendIds: Set<string>): Promise<Map<string, UserSummary[]>> {
        const result = new Map<string, UserSummary[]>();

        if (kDoIds.length === 0) {
            return result;
        }

        const userKDos = await this.prisma.userKDo.findMany({
            where: { kDoId: { in: kDoIds }, hasChecked: true },
            include: { user: true },
        });

        for (const userKDo of userKDos) {
            const users = result.get(userKDo.kDoId) ?? [];
            users.push({
                id: userKDo.user.id,
                name: userKDo.user.username,
                isFriend: viewerFriendIds.has(userKDo.user.id),
            });
            result.set(userKDo.kDoId, users);
        }

        return result;
    }

    private buildListDetail(list: ListMeta, items: KdoDto[]): ListDetailDto {
        return {
            id: list.id,
            label: list.label,
            description: list.description ?? '',
            position: list.position,
            uncheckedKdos: items.filter((item) => !item.isChecked),
            checkedKdos: items.filter((item) => item.isChecked),
        };
    }

    private toListSummary(
        list: {
            id: string;
            label: string;
            description: string | null;
            position: number;
            userLists: { user: { id: string; username: string; deletedAt: Date | null } }[];
        },
        userId: string,
        friendIds: Set<string>
    ): ListSummaryDto {
        const members = new Map<string, UserSummary>();

        for (const userList of list.userLists) {
            if (userList.user.id !== userId && !userList.user.deletedAt) {
                members.set(userList.user.id, {
                    id: userList.user.id,
                    name: userList.user.username,
                    isFriend: friendIds.has(userList.user.id),
                });
            }
        }

        return {
            id: list.id,
            label: list.label,
            description: list.description ?? '',
            position: list.position,
            friends: Array.from(members.values()),
        };
    }
}
