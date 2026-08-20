import { z } from 'zod';

export const LoginUserRequestDto = z.object({
    name: z.string().min(1),
    password: z.string().min(1),
});

export type LoginUserRequestDtoType = z.infer<typeof LoginUserRequestDto>;
