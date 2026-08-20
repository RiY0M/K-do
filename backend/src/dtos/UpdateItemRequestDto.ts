import { z } from 'zod';

export const UpdateItemRequestDto = z.object({
    value: z.string().min(1).max(255),
});

export type UpdateItemRequestDtoType = z.infer<typeof UpdateItemRequestDto>;
