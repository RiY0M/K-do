import { z } from 'zod';

export const UpdateListDescriptionRequestDto = z.object({
    description: z.string().max(2000),
});

export type UpdateListDescriptionRequestDtoType = z.infer<typeof UpdateListDescriptionRequestDto>;
