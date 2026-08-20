import { z } from 'zod';

export const ItemResponseDto = z.object({
    id: z.string().uuid(),
    value: z.string(),
    isChecked: z.boolean(),
    position: z.number(),
});
