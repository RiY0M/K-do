import { z } from 'zod';
import { UserSummaryDto } from './KdoResponseDto';

// GET /friend/friends: each friend, with what changed on their list since I
// last opened it and the gifts I took for them (see friendNews.ts).
// Mirrors frontend/src/interfaces/FriendOverview.ts.
export const FriendOverviewDto = UserSummaryDto.extend({
    news: z.object({
        added: z.number(),
        edited: z.number(),
        deleted: z.number(),
        taken: z.number(),
    }),
    takenByMe: z.array(z.object({ id: z.uuid(), label: z.string() })),
});
