import { z } from 'zod';

// NOTE: there is already an UpdateItemRequestDto.ts with a `value` field, but
// nothing uses it (it predates the KDo/List naming used elsewhere) and the
// frontend sends `{ label }` (see frontend/src/services/api/kdos.ts
// updateKdoLabel), so this DTO matches that instead of reusing/renaming the
// old one.
export const UpdateKdoLabelRequestDto = z.object({
    label: z.string().min(1).max(255),
});

export type UpdateKdoLabelRequestDtoType = z.infer<typeof UpdateKdoLabelRequestDto>;
