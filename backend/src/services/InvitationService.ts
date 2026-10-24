import { PrismaClient } from '@prisma/client';
import { InvitationServiceError } from '../errors/InvitationServiceError';
import { areFriends } from './friendshipQueries';
import { FriendService } from './FriendService';
import { UserSummary } from './ListService';

// How long a shared invitation link stays valid.
export const INVITATION_TTL_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface InvitationDto {
    id: string;
    inviter: UserSummary;
    list: { id: string; label: string };
    expiresAt: string;
}

/**
 * Shareable invitation links (/invite/:id, see CopyLinkButton.tsx and
 * Invite.tsx). Backs the routes under /api/invitation/*.
 *
 * A link can be used by several people until it expires. Accepting it makes
 * the invitee a friend of the inviter (FriendService.addFriend) and a member
 * of the list the link was created for.
 */
export class InvitationService {
    private friendService: FriendService;

    constructor(private prisma: PrismaClient) {
        this.friendService = new FriendService(prisma);
    }

    /**
     * Returns an invitation link to one of my lists. An existing link that is
     * still valid for at least a day is reused rather than creating a new one
     * on every click.
     */
    async createInvitation(userId: string, listId: string): Promise<InvitationDto> {
        const list = await this.prisma.list.findFirst({
            where: { id: listId, authorId: userId, deletedAt: null },
        });

        if (!list) {
            throw new InvitationServiceError('List not found', 404);
        }

        const now = Date.now();

        const reusable = await this.prisma.invitation.findFirst({
            where: {
                inviterId: userId,
                listId,
                deletedAt: null,
                expiresAt: { gt: new Date(now + DAY_MS) },
            },
            orderBy: { expiresAt: 'desc' },
        });

        const invitation =
            reusable ??
            (await this.prisma.invitation.create({
                data: {
                    inviterId: userId,
                    listId,
                    expiresAt: new Date(now + INVITATION_TTL_DAYS * DAY_MS),
                },
            }));

        const inviter = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });

        return {
            id: invitation.id,
            inviter: { id: inviter.id, name: inviter.username, isFriend: false },
            list: { id: list.id, label: list.label },
            expiresAt: invitation.expiresAt.toISOString(),
        };
    }

    async getInvitation(userId: string, invitationId: string): Promise<InvitationDto> {
        const invitation = await this.getValidInvitation(invitationId);

        return {
            id: invitation.id,
            inviter: {
                id: invitation.inviter.id,
                name: invitation.inviter.username,
                isFriend: await areFriends(this.prisma, userId, invitation.inviterId),
            },
            list: { id: invitation.list.id, label: invitation.list.label },
            expiresAt: invitation.expiresAt.toISOString(),
        };
    }

    /** Returns the inviter's id, so the frontend can open their list. */
    async acceptInvitation(userId: string, invitationId: string): Promise<string> {
        const invitation = await this.getValidInvitation(invitationId);

        if (invitation.inviterId === userId) {
            throw new InvitationServiceError('You cannot accept your own invitation', 400);
        }

        await this.friendService.addFriend(invitation.inviterId, userId);

        await this.prisma.userList.createMany({
            data: [{ userId, listId: invitation.listId }],
            skipDuplicates: true,
        });

        return invitation.inviterId;
    }

    private async getValidInvitation(invitationId: string) {
        const invitation = await this.prisma.invitation.findFirst({
            where: {
                id: invitationId,
                deletedAt: null,
                list: { deletedAt: null },
                inviter: { deletedAt: null },
            },
            include: { inviter: true, list: true },
        });

        if (!invitation) {
            throw new InvitationServiceError('Invitation not found', 404);
        }

        if (invitation.expiresAt.getTime() <= Date.now()) {
            throw new InvitationServiceError('This invitation has expired', 410);
        }

        return invitation;
    }
}
