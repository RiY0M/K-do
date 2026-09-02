import { z } from 'zod';

// User summary embedded in Kdo responses (e.g. who has reserved a friend's
// gift idea so far). Mirrors frontend/src/interfaces/User.ts.
export const UserSummaryDto = z.object({
    id: z.string().uuid(),
    name: z.string(),
    isFriend: z.boolean(),
});

export type UserSummaryDtoType = z.infer<typeof UserSummaryDto>;

// Mirrors frontend/src/interfaces/Kdo.ts.
//
// TODO: the frontend's `Kdo.id` (and `List.id`, see ListResponseDto.ts) is
// typed as `number`, but every id in this database is a UUID string
// (see prisma/schema.prisma - all models use `@id @default(uuid())`).
// Sending a string here is correct for the actual data, but the frontend
// interfaces/services/api stub functions (which currently return hardcoded
// numeric placeholder ids) will need their types updated to `string` before
// they're wired up to these routes, or requests/renders relying on numeric
// ids will break.
export const KdoResponseDto = z.object({
    id: z.string().uuid(),
    label: z.string(),
    isChecked: z.boolean(),
    position: z.number(),
    // Present only when the item was authored by the requesting user - their
    // own wishlist item, or a "surprise" idea they added while browsing a
    // friend's list (see ItemService.createSurpriseItem). Omitted for items
    // authored by someone else, which is how the frontend (see
    // frontend/src/components/list/ListKdos.tsx) decides whether to render an
    // editable row (EditableCheckLine) or a reservable one (FriendCheckLine).
    authorId: z.string().uuid().optional(),
    // Present only on items that are NOT the viewer's own, listing who has
    // reserved/taken this gift idea so far (UserKDo). Never populated for the
    // item's own author - that's the whole point, it stays a surprise.
    takenBy: z.array(UserSummaryDto).optional(),
});

export type KdoResponseDtoType = z.infer<typeof KdoResponseDto>;
