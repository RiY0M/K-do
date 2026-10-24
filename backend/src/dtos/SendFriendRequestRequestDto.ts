import { z } from 'zod';

// Body for POST /friend/request: the exact username of the person to add.
export const SendFriendRequestRequestDto = z.object({
    name: z.string().trim().min(1).max(32),
});

export type SendFriendRequestRequestDtoType = z.infer<typeof SendFriendRequestRequestDto>;
