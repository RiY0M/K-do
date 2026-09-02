import { z } from 'zod';

export const CreateListRequestDto = z.object({
    label: z.string().min(1).max(64),
});

export type CreateListRequestDtoType = z.infer<typeof CreateListRequestDto>;
