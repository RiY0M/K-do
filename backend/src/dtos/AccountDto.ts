import { z } from 'zod';

// GET /user/me and PATCH /user/me
export const AccountResponseDto = z.object({
    id: z.uuid(),
    name: z.string(),
    email: z.string().nullable(),
});

// Body for PATCH /user/me: the whole form of the account page. Same rules as
// RegisterUserRequestDto for the name, e-mail and password.
export const UpdateAccountRequestDto = z.object({
    name: z.string().trim().min(2).max(32),
    // "" removes the e-mail address
    email: z
        .union([z.literal(''), z.string().trim().email().max(255)])
        .transform((value) => (value ? value : null)),
    // "" = keep the current password
    newPassword: z.union([z.literal(''), z.string().min(4)]).optional(),
    // Required to change the e-mail address or the password
    currentPassword: z.string().max(255).optional(),
});

export type UpdateAccountRequestDtoType = z.infer<typeof UpdateAccountRequestDto>;

export const UpdateAccountResponseDto = AccountResponseDto.extend({
    // Masked address the "undo" e-mail was sent to, null if none was sent
    undoEmailSentTo: z.string().nullable(),
});

// Body for POST /auth/revertAccountChange
export const RevertAccountChangeRequestDto = z.object({
    token: z.string().min(1).max(255),
});

export type RevertAccountChangeRequestDtoType = z.infer<typeof RevertAccountChangeRequestDto>;
