import { z } from 'zod';

// Body for POST /kdo/link/:id. Only http(s) links: they are rendered as
// clickable links for the author's friends.
export const CreateLinkRequestDto = z.object({
    href: z.url({ protocol: /^https?$/, error: 'Invalid link' }).max(2048),
});

export type CreateLinkRequestDtoType = z.infer<typeof CreateLinkRequestDto>;
