import { z } from 'zod';

// Body for POST /auth/resetPassword. Same password rule as RegisterUserRequestDto.
export const ResetPasswordRequestDto = z.object({
    token: z.string().min(1).max(255),
    password: z.string().min(4),
});

export type ResetPasswordRequestDtoType = z.infer<typeof ResetPasswordRequestDto>;
