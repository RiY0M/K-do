import { PrismaClient } from '@prisma/client';
import { ListServiceError } from '../errors/ListServiceError';
import { KdoDto, toKdoDto } from './itemMapper';

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

/**
 * Handles List (gift-exchange group) reads/writes. Backs GET/POST /api/lists
 * and the routes under /list/* - see backend/src/routes/list.
 *
 * NOTE: like ItemService, this file previously referenced a `Group` model
 * that doesn't exist in prisma/schema.prisma - it's been rewritten against
 * the current `List` / `UserList` / `ListKDo` models.
 */
export class ListService {
    constructor(private prisma: PrismaClient) {}

    async getMyLists(userId: string): Promise<ListSummaryDto[]> {
        const lists = await this.prisma.list.findMany({
            where: {
                deletedAt: null,
                OR: [{ authorId: userId }, { userLists: { some: { userId } } }],
            },
            orderBy: { position: 'asc' },
            include: {
                user: true,
                userLists: { include: { user: true } },
            },
        });

        return lists.map((list) => this.toListSummary(list, userId));
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

    async updateDescription(userId: string, listId: string, description: string) {
        // TODO: only the list author can edit the description for now.
        // Description.tsx is only ever rendered from MyFullListSection (i.e.
        // your own list), so this matches current usage, but if this is
        // meant to become a shared/collaborative note, members (UserList)
        // would need write access too - unclear from the frontend alone.
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

    async getMyListByListId(userId: string, listId: string): Promise<ListDetailDto> {
        const list = await this.prisma.list.findFirst({
            where: {
                id: listId,
                deletedAt: null,
                OR: [{ authorId: userId }, { userLists: { some: { userId } } }],
            },
        });

        if (!list) {
            throw new ListServiceError('List not found', 404);
        }

        const items = await this.prisma.kDo.findMany({
            where: {
                authorId: userId,
                deletedAt: null,
                listKDos: { some: { listId } },
            },
            orderBy: { position: 'asc' },
        });

        return this.buildListDetail(list, items.map(toKdoDto));
    }

    /**
     * Builds the list as seen from a friend's page (FriendFullListSection):
     * the friend's own wishlist items (author omitted, so the frontend shows
     * them as reservable FriendCheckLine rows with a `takenBy` list) plus any
     * "surprise" ideas the caller has added to the same shared list(s) (see
     * ItemService.createSurpriseItem) - those keep their authorId so the
     * frontend renders them as an editable EditableCheckLine row instead.
     *
     * TODO: a friendId can be a member of several lists shared with the
     * caller (e.g. a "Tous" list and a separate "Noël" list). We merge KDos
     * across ALL shared lists, but only return the id/label/description/
     * position of the first shared one (by position) as "the" list, since
     * getListByFriendId's return type is a single ListDetailDto, matching
     * what the frontend currently expects for one friendId. This may need
     * revisiting if multiple lists per friend pair become a real use case.
     */
    async getListByFriendId(userId: string, friendId: string): Promise<ListDetailDto> {
        if (userId === friendId) {
            throw new ListServiceError('Cannot view your own list as a friend', 400);
        }

        const sharedLists = await this.getSharedLists(userId, friendId);

        if (sharedLists.length === 0) {
            throw new ListServiceError('Friend not found', 404);
        }

        const sharedListIds = sharedLists.map((list) => list.id);

        const friendItems = await this.prisma.kDo.findMany({
            where: {
                authorId: friendId,
                deletedAt: null,
                listKDos: { some: { listId: { in: sharedListIds } } },
            },
            orderBy: { position: 'asc' },
        });

        const surpriseItems = await this.prisma.kDo.findMany({
            where: {
                authorId: userId,
                deletedAt: null,
                listKDos: { some: { listId: { in: sharedListIds } } },
            },
            orderBy: { position: 'asc' },
        });

        const friendDtos: KdoDto[] = await Promise.all(
            friendItems.map(async (item) => ({
                ...toKdoDto(item),
                takenBy: await this.getTakenBy(item.id),
            }))
        );

        const surpriseDtos: KdoDto[] = surpriseItems.map((item) => ({
            ...toKdoDto(item),
            authorId: item.authorId,
        }));

        const allItems = [...friendDtos, ...surpriseDtos].sort((a, b) => a.position - b.position);

        return this.buildListDetail(sharedLists[0], allItems);
    }

    private async getTakenBy(kDoId: string): Promise<UserSummary[]> {
        const userKDos = await this.prisma.userKDo.findMany({
            where: { kDoId, hasChecked: true },
            include: { user: true },
        });

        return userKDos.map((userKDo) => ({
            id: userKDo.user.id,
            name: userKDo.user.username,
            isFriend: true,
        }));
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

    private async getSharedLists(userId: string, otherUserId: string): Promise<ListMeta[]> {
        const myLists = await this.prisma.list.findMany({
            where: {
                deletedAt: null,
                OR: [{ authorId: userId }, { userLists: { some: { userId } } }],
            },
            select: { id: true },
        });

        if (myLists.length === 0) {
            return [];
        }

        return this.prisma.list.findMany({
            where: {
                id: { in: myLists.map((list) => list.id) },
                deletedAt: null,
                OR: [
                    { authorId: otherUserId },
                    { userLists: { some: { userId: otherUserId } } },
                ],
            },
            orderBy: { position: 'asc' },
            select: { id: true, label: true, description: true, position: true },
        });
    }

    private toListSummary(
        list: {
            id: string;
            label: string;
            description: string | null;
            position: number;
            user: { id: string; username: string };
            userLists: { user: { id: string; username: string } }[];
        },
        userId: string
    ): ListSummaryDto {
        const members = new Map<string, UserSummary>();

        if (list.user.id !== userId) {
            members.set(list.user.id, { id: list.user.id, name: list.user.username, isFriend: true });
        }

        for (const userList of list.userLists) {
            if (userList.user.id !== userId) {
                members.set(userList.user.id, {
                    id: userList.user.id,
                    name: userList.user.username,
                    isFriend: true,
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
