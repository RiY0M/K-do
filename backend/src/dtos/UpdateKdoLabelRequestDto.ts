import { z } from 'zod';

// NOTE: there is already an UpdateItemRequestDto.ts with a `value` field, but
// nothing uses it (it predates the KDo/List naming used elsewhere) and the
// frontend sends `{ label }` (see frontend/src/services/api/kdos.ts
// updateKdoLabel), so this DTO matches that instead of reusing/renaming the
// old one.
//
// An empty label is allowed: items are created blank and the frontend saves
// the label while the user types, including when they erase everything.
export const UpdateKdoLabelRequestDto = z.object({
    label: z.string().max(255),
});

export type UpdateKdoLabelRequestDtoType = z.infer<typeof UpdateKdoLabelRequestDto>;
