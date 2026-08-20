import { PrismaClient } from '@prisma/client';
import { ItemServiceError } from '../errors/ItemServiceError';
import { ItemDto, toItemDto } from './itemMapper';

export class ItemService {
    constructor(private prisma: PrismaClient) {}

    async createItem(userId: string, groupId: string, value: string): Promise<ItemDto> {
        const group = await this.prisma.group.findFirst({
            where: {
                id: groupId,
                deletedAt: null,
                OR: [{ authorId: userId }, { userGroups: { some: { userId } } }],
            },
        });

        if (!group) {
            throw new ItemServiceError('Group not found', 404);
        }

        const lastItem = await this.prisma.kDo.findFirst({
            where: {
                authorId: userId,
                deletedAt: null,
                groupKDos: { some: { groupId } },
            },
            orderBy: { position: 'desc' },
        });

        const kDo = await this.prisma.kDo.create({
            data: {
                label: value,
                authorId: userId,
                position: (lastItem?.position ?? 0) + 1,
                groupKDos: { create: { groupId } },
            },
        });

        await this.touchLastSave(userId);

        return toItemDto(kDo);
    }

    async updateItem(userId: string, itemId: string, value: string): Promise<ItemDto> {
        await this.assertOwnedItem(userId, itemId);

        const kDo = await this.prisma.kDo.update({
            where: { id: itemId },
            data: { label: value },
        });

        await this.touchLastSave(userId);

        return toItemDto(kDo);
    }

    async checkItem(userId: string, itemId: string): Promise<ItemDto> {
        const item = await this.assertOwnedItem(userId, itemId);

        const kDo = await this.prisma.kDo.update({
            where: { id: itemId },
            data: { isChecked: !item.isChecked },
        });

        await this.touchLastSave(userId);

        return toItemDto(kDo);
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

    private async touchLastSave(userId: string): Promise<void> {
        await this.prisma.user.update({
            where: { id: userId },
            data: { lastSave: new Date() },
        });
    }
}
