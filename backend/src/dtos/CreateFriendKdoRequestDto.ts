import { z } from 'zod';

// TODO: frontend/src/services/api/kdos.ts `createFriendKdo()` currently takes
// no arguments and sends no body at all, so this route can't be reached
// successfully until that function (and whatever calls it) is updated to
// know which shared list the idea belongs to and send `{ listId }`. See
// src/services/ItemService.ts `createSurpriseItem` for more context.
export const CreateFriendKdoRequestDto = z.object({
    listId: z.string().uuid(),
});

export type CreateFriendKdoRequestDtoType = z.infer<typeof CreateFriendKdoRequestDto>;
