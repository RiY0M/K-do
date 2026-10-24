import { z } from 'zod';

// Body for POST /auth/forgotPassword: username or e-mail address
export const ForgotPasswordRequestDto = z.object({
    identifier: z.string().trim().min(1).max(255),
});

export type ForgotPasswordRequestDtoType = z.infer<typeof ForgotPasswordRequestDto>;
