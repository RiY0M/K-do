import { z } from 'zod';
import { KdoResponseDto, UserSummaryDto } from './KdoResponseDto';

// GET /api/lists and POST /api/lists - mirrors frontend/src/interfaces/List.ts
// (minus uncheckedKdos/checkedKdos, which only come back from the detail
// endpoints below).
//
// TODO: see the id-type TODO in KdoResponseDto.ts - the same string-vs-number
// mismatch applies to List.id on the frontend.
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
