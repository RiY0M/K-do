import { z } from 'zod';
import { UserSummaryDto } from './KdoResponseDto';

// Mirrors frontend/src/interfaces/Invitation.ts.
export const InvitationResponseDto = z.object({
    id: z.uuid(),
    inviter: UserSummaryDto,
    list: z.object({
        id: z.uuid(),
        label: z.string(),
    }),
    expiresAt: z.string(),
});

export type InvitationResponseDtoType = z.infer<typeof InvitationResponseDto>;
