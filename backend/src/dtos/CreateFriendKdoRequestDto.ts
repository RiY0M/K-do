import { z } from 'zod';

// Body for POST /kdo/friend/create: the friend the surprise idea is for (see
// ItemService.createSurpriseItem).
export const CreateFriendKdoRequestDto = z.object({
    friendId: z.uuid(),
});

export type CreateFriendKdoRequestDtoType = z.infer<typeof CreateFriendKdoRequestDto>;
