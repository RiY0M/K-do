import { z } from 'zod';

// Body for PATCH /kdo/me/reorder: the new order of my items on one of my
// lists (drag & drop, see frontend/src/components/list/SortableKdos.tsx).
export const ReorderKdosRequestDto = z.object({
    listId: z.uuid(),
    kdoIds: z.array(z.uuid()).min(1).max(1000),
});

export type ReorderKdosRequestDtoType = z.infer<typeof ReorderKdosRequestDto>;
