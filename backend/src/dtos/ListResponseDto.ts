import { z } from 'zod';
import { KdoResponseDto, UserSummaryDto } from './KdoResponseDto';

// GET /list/lists and POST /list/create - mirrors
// frontend/src/interfaces/List.ts (minus uncheckedKdos/checkedKdos, which only
// come back from the detail endpoints below). `friends` are the list's
// members.
export const ListSummaryResponseDto = z.object({
    id: z.string().uuid(),
    label: z.string(),
    description: z.string(),
    position: z.number(),
    friends: z.array(UserSummaryDto),
});

export type ListSummaryResponseDtoType = z.infer<typeof ListSummaryResponseDto>;

// GET /list/me/:listId and GET /list/friend/:friendId.
export const ListDetailResponseDto = z.object({
    id: z.string().uuid(),
    label: z.string(),
    description: z.string(),
    position: z.number(),
    uncheckedKdos: z.array(KdoResponseDto),
    checkedKdos: z.array(KdoResponseDto),
});

export type ListDetailResponseDtoType = z.infer<typeof ListDetailResponseDto>;
