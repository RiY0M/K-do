import { PrismaClient } from '@prisma/client';
import { ListServiceError } from '../errors/ListServiceError';
import { ItemDto, toItemDto } from './itemMapper';

export interface ListDto {
    id: string;
    description: string;
    uncheckedItems: ItemDto[];
    checkedItems: ItemDto[];
}

export class ListService {
    constructor(private prisma: PrismaClient) {}

    async getMyListByListId(userId: string, listId: string): Promise<ListDto> {
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

        return this.buildListDto(listId, items);
    }

    async getListByFriendId(userId: string, friendId: string): Promise<ListDto> {
        const sharedListIds = await this.getSharedListIds(userId, friendId);

        if (sharedListIds.length === 0) {
            throw new ListServiceError('Friend not found', 404);
        }

        const items = await this.prisma.kDo.findMany({
            where: {
                authorId: friendId,
                deletedAt: null,
                listKDos: { some: { listId: { in: sharedListIds } } },
            },
            orderBy: { position: 'asc' },
        });

        return this.buildListDto(friendId, items);
    }

    private buildListDto(
        id: string,
        items: Awaited<ReturnType<PrismaClient['kDo']['findMany']>>
    ): ListDto {
        const dtos = items.map(toItemDto);

        return {
            id,
            description: '',
            uncheckedItems: dtos.filter((item) => !item.isChecked),
            checkedItems: dtos.filter((item) => item.isChecked),
        };
    }

    private async getSharedListIds(userId: string, otherUserId: string): Promise<string[]> {
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

        const sharedLists = await this.prisma.list.findMany({
            where: {
                id: { in: myLists.map((g) => g.id) },
                deletedAt: null,
                OR: [
                    { authorId: otherUserId },
                    { userLists: { some: { userId: otherUserId } } },
                ],
            },
            select: { id: true },
        });

        return sharedLists.map((g) => g.id);
    }
}
