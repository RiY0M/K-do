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

    async getMyListByGroupId(userId: string, groupId: string): Promise<ListDto> {
        const group = await this.prisma.group.findFirst({
            where: {
                id: groupId,
                deletedAt: null,
                OR: [{ authorId: userId }, { userGroups: { some: { userId } } }],
            },
        });

        if (!group) {
            throw new ListServiceError('Group not found', 404);
        }

        const items = await this.prisma.kDo.findMany({
            where: {
                authorId: userId,
                deletedAt: null,
                groupKDos: { some: { groupId } },
            },
            orderBy: { position: 'asc' },
        });

        return this.buildListDto(groupId, items);
    }

    async getListByFriendId(userId: string, friendId: string): Promise<ListDto> {
        const sharedGroupIds = await this.getSharedGroupIds(userId, friendId);

        if (sharedGroupIds.length === 0) {
            throw new ListServiceError('Friend not found', 404);
        }

        const items = await this.prisma.kDo.findMany({
            where: {
                authorId: friendId,
                deletedAt: null,
                groupKDos: { some: { groupId: { in: sharedGroupIds } } },
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

    private async getSharedGroupIds(userId: string, otherUserId: string): Promise<string[]> {
        const myGroups = await this.prisma.group.findMany({
            where: {
                deletedAt: null,
                OR: [{ authorId: userId }, { userGroups: { some: { userId } } }],
            },
            select: { id: true },
        });

        if (myGroups.length === 0) {
            return [];
        }

        const sharedGroups = await this.prisma.group.findMany({
            where: {
                id: { in: myGroups.map((g) => g.id) },
                deletedAt: null,
                OR: [
                    { authorId: otherUserId },
                    { userGroups: { some: { userId: otherUserId } } },
                ],
            },
            select: { id: true },
        });

        return sharedGroups.map((g) => g.id);
    }
}
