import { PrismaClient } from '@prisma/client';
import { UserServiceError } from '../errors/UserServiceError';

/**
 * Backs the routes under /api/user/*.
 *
 * NOTE: the old acceptInvite (join the inviter's oldest list from an
 * /invite/:userId link) has been replaced by InvitationService, which uses
 * real invitation links and makes both users friends.
 */
export class UserService {
    constructor(private prisma: PrismaClient) {}

    async getUsername(userId: string): Promise<string> {
        const user = await this.prisma.user.findFirst({
            where: { id: userId, deletedAt: null },
        });

        if (!user) {
            throw new UserServiceError('User not found', 404);
        }

        return user.username;
    }
}
