import { PrismaClient } from '@prisma/client';

export interface GroupFriendDto {
    id: string;
    name: string;
    isFriend: boolean;
}

export interface GroupDto {
    id: string;
    label: string;
    position: number;
    friends: GroupFriendDto[];
}

export class GroupService {
    constructor(private prisma: PrismaClient) {}

    async getMyGroups(userId: string): Promise<GroupDto[]> {
        const groups = await this.prisma.group.findMany({
            where: {
                deletedAt: null,
                OR: [{ authorId: userId }, { userGroups: { some: { userId } } }],
            },
            orderBy: { createdAt: 'asc' },
            include: {
                user: true,
                userGroups: { include: { user: true } },
            },
        });

        return groups.map((group, index) => {
            const members = [group.user, ...group.userGroups.map((ug) => ug.user)];
            const uniqueFriends = new Map<string, GroupFriendDto>();

            for (const member of members) {
                if (member.id === userId) continue;
                uniqueFriends.set(member.id, {
                    id: member.id,
                    name: member.username,
                    isFriend: true,
                });
            }

            return {
                id: group.id,
                label: group.description ?? '',
                position: index + 1,
                friends: Array.from(uniqueFriends.values()),
            };
        });
    }
}
