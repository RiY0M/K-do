import { Friendship, PrismaClient, User } from '@prisma/client';
import { FriendServiceError } from '../errors/FriendServiceError';
import { findFriendshipBetween } from './friendshipQueries';
import { ListService, UserSummary } from './ListService';

export interface FriendshipDto {
    id: string;
    user: UserSummary;
    status: 'PENDING' | 'ACCEPTED';
    createdAt: string;
}

export interface FriendRequestsDto {
    received: FriendshipDto[];
    sent: FriendshipDto[];
}

type FriendshipWithUsers = Friendship & { requester: User; addressee: User };

/**
 * Friend requests and friendships. Backs the routes under /api/friend/*.
 *
 * Being friends means each user is a member of the other's default list
 * (ListService.ensureDefaultList), so both can see each other's wishes and
 * reserve them. Removing a friend undoes that.
 */
export class FriendService {
    private listService: ListService;

    constructor(private prisma: PrismaClient) {
        this.listService = new ListService(prisma);
    }

    async getFriends(userId: string): Promise<UserSummary[]> {
        const friendships = await this.prisma.friendship.findMany({
            where: {
                status: 'ACCEPTED',
                OR: [{ requesterId: userId }, { addresseeId: userId }],
            },
            include: { requester: true, addressee: true },
        });

        return friendships
            .map((friendship) => this.toFriendshipDto(friendship, userId).user)
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    async getRequests(userId: string): Promise<FriendRequestsDto> {
        const friendships = await this.prisma.friendship.findMany({
            where: {
                status: 'PENDING',
                OR: [{ requesterId: userId }, { addresseeId: userId }],
            },
            include: { requester: true, addressee: true },
            orderBy: { createdAt: 'desc' },
        });

        return {
            received: friendships
                .filter((friendship) => friendship.addresseeId === userId)
                .map((friendship) => this.toFriendshipDto(friendship, userId)),
            sent: friendships
                .filter((friendship) => friendship.requesterId === userId)
                .map((friendship) => this.toFriendshipDto(friendship, userId)),
        };
    }

    /**
     * Sends a friend request to the user with this exact username. If they
     * had already sent me one, it is accepted instead.
     */
    async sendRequest(userId: string, username: string): Promise<FriendshipDto> {
        const target = await this.prisma.user.findFirst({
            where: { username, deletedAt: null },
        });

        if (!target) {
            throw new FriendServiceError('User not found', 404);
        }

        if (target.id === userId) {
            throw new FriendServiceError('You cannot add yourself as a friend', 400);
        }

        const existing = await findFriendshipBetween(this.prisma, userId, target.id);

        if (existing?.status === 'ACCEPTED') {
            throw new FriendServiceError('You are already friends', 409);
        }

        if (existing && existing.requesterId === userId) {
            throw new FriendServiceError('Friend request already sent', 409);
        }

        if (existing) {
            return this.acceptRequest(userId, existing.id);
        }

        const friendship = await this.prisma.friendship.create({
            data: { requesterId: userId, addresseeId: target.id },
            include: { requester: true, addressee: true },
        });

        return this.toFriendshipDto(friendship, userId);
    }

    /** Accepts a request I received. */
    async acceptRequest(userId: string, requestId: string): Promise<FriendshipDto> {
        const request = await this.prisma.friendship.findFirst({
            where: { id: requestId, addresseeId: userId, status: 'PENDING' },
        });

        if (!request) {
            throw new FriendServiceError('Friend request not found', 404);
        }

        await this.addFriend(request.requesterId, userId);

        const friendship = await this.prisma.friendship.findUniqueOrThrow({
            where: { id: request.id },
            include: { requester: true, addressee: true },
        });

        return this.toFriendshipDto(friendship, userId);
    }

    /** Declines a request I received, or cancels one I sent. */
    async deleteRequest(userId: string, requestId: string): Promise<boolean> {
        const { count } = await this.prisma.friendship.deleteMany({
            where: {
                id: requestId,
                status: 'PENDING',
                OR: [{ requesterId: userId }, { addresseeId: userId }],
            },
        });

        if (count === 0) {
            throw new FriendServiceError('Friend request not found', 404);
        }

        return true;
    }

    /**
     * Makes two users friends (creating or accepting the Friendship row) and
     * adds each one to the other's default list. Idempotent - also used when
     * an invitation is accepted (see InvitationService).
     */
    async addFriend(userId: string, otherUserId: string): Promise<void> {
        if (userId === otherUserId) {
            throw new FriendServiceError('You cannot add yourself as a friend', 400);
        }

        await this.prisma.$transaction(async (tx) => {
            const existing = await tx.friendship.findFirst({
                where: {
                    OR: [
                        { requesterId: userId, addresseeId: otherUserId },
                        { requesterId: otherUserId, addresseeId: userId },
                    ],
                },
            });

            if (!existing) {
                await tx.friendship.create({
                    data: { requesterId: userId, addresseeId: otherUserId, status: 'ACCEPTED' },
                });
            } else if (existing.status !== 'ACCEPTED') {
                await tx.friendship.update({
                    where: { id: existing.id },
                    data: { status: 'ACCEPTED' },
                });
            }

            // Always lock in the same order to avoid deadlocks between two
            // concurrent transactions on the same pair of users.
            const [firstId, secondId] = [userId, otherUserId].sort();
            const firstList = await this.listService.ensureDefaultList(firstId!, tx);
            const secondList = await this.listService.ensureDefaultList(secondId!, tx);

            await tx.userList.createMany({
                data: [
                    { userId: secondId!, listId: firstList.id },
                    { userId: firstId!, listId: secondList.id },
                ],
                skipDuplicates: true,
            });
        });
    }

    /**
     * Ends a friendship: removes the list memberships between both users,
     * their reservations on each other's items and the surprise ideas they
     * added for each other.
     */
    async removeFriend(userId: string, friendId: string): Promise<boolean> {
        const friendship = await findFriendshipBetween(this.prisma, userId, friendId);

        if (!friendship || friendship.status !== 'ACCEPTED') {
            throw new FriendServiceError('Friend not found', 404);
        }

        const itemsVisibleBy = (ownerId: string) => ({
            OR: [{ authorId: ownerId, recipientId: null }, { recipientId: ownerId }],
        });

        await this.prisma.$transaction([
            this.prisma.friendship.delete({ where: { id: friendship.id } }),
            this.prisma.userList.deleteMany({
                where: {
                    OR: [
                        { userId, list: { authorId: friendId } },
                        { userId: friendId, list: { authorId: userId } },
                    ],
                },
            }),
            this.prisma.userKDo.deleteMany({
                where: {
                    OR: [
                        { userId, kDo: itemsVisibleBy(friendId) },
                        { userId: friendId, kDo: itemsVisibleBy(userId) },
                    ],
                },
            }),
            this.prisma.kDo.updateMany({
                where: {
                    deletedAt: null,
                    OR: [
                        { authorId: userId, recipientId: friendId },
                        { authorId: friendId, recipientId: userId },
                    ],
                },
                data: { deletedAt: new Date() },
            }),
        ]);

        return true;
    }

    private toFriendshipDto(friendship: FriendshipWithUsers, userId: string): FriendshipDto {
        const other = friendship.requesterId === userId ? friendship.addressee : friendship.requester;

        return {
            id: friendship.id,
            user: {
                id: other.id,
                name: other.username,
                isFriend: friendship.status === 'ACCEPTED',
            },
            status: friendship.status,
            createdAt: friendship.createdAt.toISOString(),
        };
    }
}
