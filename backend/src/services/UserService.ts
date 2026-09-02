import { PrismaClient } from '@prisma/client';
import { UserServiceError } from '../errors/UserServiceError';

/**
 * Backs the routes under /users/* - see backend/src/routes/users.
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

    /**
     * Adds the caller to the inviter's shared list. Mirrors the invite flow
     * in frontend/src/pages/Invite.tsx and CopyLinkButton.tsx, where the
     * generated link is `/invite/:userId` pointing at the *inviter's* user
     * id (not a list id).
     *
     * TODO: a user can technically own several lists (List.authorId), but
     * the rest of the app (see MyHome.tsx, which auto-creates a single
     * "Tous" list the first time getMyLists() comes back empty) only ever
     * seems to use one list per user. We assume that here too and join the
     * inviter's oldest list. If multi-list support is ever added, this
     * endpoint will need the invite link to say which list it's for (e.g. a
     * listId encoded in the link) rather than just a userId.
     */
    async acceptInvite(currentUserId: string, inviterUserId: string): Promise<void> {
        if (currentUserId === inviterUserId) {
            throw new UserServiceError('You cannot accept your own invite', 400);
        }

        const inviter = await this.prisma.user.findFirst({
            where: { id: inviterUserId, deletedAt: null },
        });

        if (!inviter) {
            throw new UserServiceError('User not found', 404);
        }

        const inviterList = await this.prisma.list.findFirst({
            where: { authorId: inviterUserId, deletedAt: null },
            orderBy: { createdAt: 'asc' },
        });

        if (!inviterList) {
            throw new UserServiceError('Inviter has no list to join', 404);
        }

        const alreadyMember = await this.prisma.userList.findFirst({
            where: { userId: currentUserId, listId: inviterList.id },
        });

        if (alreadyMember) {
            return;
        }

        await this.prisma.userList.create({
            data: { userId: currentUserId, listId: inviterList.id },
        });
    }
}
