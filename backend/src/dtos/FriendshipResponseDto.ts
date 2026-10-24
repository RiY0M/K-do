import { z } from 'zod';
import { UserSummaryDto } from './KdoResponseDto';

// Mirrors frontend/src/interfaces/Friendship.ts. `user` is always the other
// person, whichever side sent the request.
export const FriendshipResponseDto = z.object({
    id: z.uuid(),
    user: UserSummaryDto,
    status: z.enum(['PENDING', 'ACCEPTED']),
    createdAt: z.string(),
});

export type FriendshipResponseDtoType = z.infer<typeof FriendshipResponseDto>;

// GET /friend/requests
export const FriendRequestsResponseDto = z.object({
    received: z.array(FriendshipResponseDto),
    sent: z.array(FriendshipResponseDto),
});

export type FriendRequestsResponseDtoType = z.infer<typeof FriendRequestsResponseDto>;
