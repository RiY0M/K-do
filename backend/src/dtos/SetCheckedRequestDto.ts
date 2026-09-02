import { z } from 'zod';

// Body for PATCH /kdo/me/check/:id and PATCH /kdo/friend/check/:id. These set
// the checked/taken state explicitly (idempotent) rather than toggling it,
// matching frontend/src/services/api/kdos.ts checkMyKdo(id, isChecked) /
// checkFriendKdo(id, isChecked).
export const SetCheckedRequestDto = z.object({
    isChecked: z.boolean(),
});

export type SetCheckedRequestDtoType = z.infer<typeof SetCheckedRequestDto>;
