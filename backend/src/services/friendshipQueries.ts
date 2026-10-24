import { PrismaClient } from '@prisma/client';

// Small shared read helpers around the Friendship model, used by several
// services (same idea as itemMapper.ts).

/** The single Friendship row between two users, whatever its direction. */
export function findFriendshipBetween(prisma: PrismaClient, userId: string, otherUserId: string) {
    return prisma.friendship.findFirst({
        where: {
            OR: [
                { requesterId: userId, addresseeId: otherUserId },
                { requesterId: otherUserId, addresseeId: userId },
            ],
        },
    });
}

export async function areFriends(prisma: PrismaClient, userId: string, otherUserId: string): Promise<boolean> {
    const friendship = await findFriendshipBetween(prisma, userId, otherUserId);
    return friendship?.status === 'ACCEPTED';
}

/** Ids of every accepted friend of the given user. */
export async function getFriendIds(prisma: PrismaClient, userId: string): Promise<Set<string>> {
    const friendships = await prisma.friendship.findMany({
        where: {
            status: 'ACCEPTED',
            OR: [{ requesterId: userId }, { addresseeId: userId }],
        },
        select: { requesterId: true, addresseeId: true },
    });

    return new Set(
        friendships.map((friendship) =>
            friendship.requesterId === userId ? friendship.addresseeId : friendship.requesterId
        )
    );
}
