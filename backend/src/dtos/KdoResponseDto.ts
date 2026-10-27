import { z } from 'zod';

// User summary embedded in Kdo responses (e.g. who has reserved a friend's
// gift idea so far). Mirrors frontend/src/interfaces/User.ts.
export const UserSummaryDto = z.object({
    id: z.string().uuid(),
    name: z.string(),
    isFriend: z.boolean(),
});

export type UserSummaryDtoType = z.infer<typeof UserSummaryDto>;

// Mirrors frontend/src/interfaces/Link.ts.
export const LinkResponseDto = z.object({
    id: z.uuid(),
    href: z.string(),
});

export type LinkResponseDtoType = z.infer<typeof LinkResponseDto>;

// Mirrors frontend/src/interfaces/Kdo.ts.
export const KdoResponseDto = z.object({
    id: z.string().uuid(),
    label: z.string(),
    isChecked: z.boolean(),
    position: z.number(),
    // Present only when the item was authored by the requesting user - their
    // own wish, or a "surprise" idea they added for a friend (see
    // ItemService.createSurpriseItem). Omitted for items
    // authored by someone else, which is how the frontend (see
    // frontend/src/components/list/ListKdos.tsx) decides whether to render an
    // editable row (EditableCheckLine) or a reservable one (FriendCheckLine).
    authorId: z.string().uuid().optional(),
    // Present only on items that are NOT the viewer's own, listing who has
    // reserved/taken this gift idea so far (UserKDo). Never sent to the
    // person the gift is for - that's the whole point, it stays a surprise.
    takenBy: z.array(UserSummaryDto).optional(),
    // Links attached by the item's author (where to buy it...). Sent with
    // lists; may be omitted from the responses of the /kdo mutations.
    links: z.array(LinkResponseDto).optional(),
});

export type KdoResponseDtoType = z.infer<typeof KdoResponseDto>;
