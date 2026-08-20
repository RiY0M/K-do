import { z } from 'zod';

export const CreateItemRequestDto = z.object({
    groupId: z.string().uuid(),
    value: z.string().min(1).max(255),
});

export type CreateItemRequestDtoType = z.infer<typeof CreateItemRequestDto>;
