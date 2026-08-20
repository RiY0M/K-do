import { z } from 'zod';

export const RegisterUserRequestDto = z.object({
    name: z.string().min(2).max(32),
    email: z
        .union([z.literal(''), z.string().email()])
        .optional()
        .transform((value) => (value ? value : undefined)),
    password: z.string().min(4),
});

export type RegisterUserRequestDtoType = z.infer<typeof RegisterUserRequestDto>;
