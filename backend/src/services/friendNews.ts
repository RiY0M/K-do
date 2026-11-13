import { Prisma, PrismaClient } from '@prisma/client';

export interface FriendNewsDto {
    added: number;
    edited: number;
    deleted: number;
    taken: number;
}

export interface NotificationSettings {
    added: boolean;
    edited: boolean;
    deleted: boolean;
    taken: boolean;
}

export interface TakenKdoDto {
    id: string;
    label: string;
}

// What changed on one gift since my last visit of the friend's list (friend
// page). A new gift is only `added`, never also label/links.
export interface KdoNewsDto {
    added: boolean;
    label: boolean;
    links: boolean;
    taken: boolean;
}

// Opening a friend's list again within this delay is still the same visit:
// its markers stay (and React StrictMode's double request in development
// doesn't wipe them)
const VISIT_GAP_MS = 5 * 60 * 1000;

/**
 * The gifts of `friendId`'s list as `viewerId` sees it on the friend page
 * (ListService.getListByFriendId): the friend's own wishes on their lists the
 * viewer is a member of, and the surprise ideas other people added for them.
 * The viewer's own surprise ideas are left out: they made them.
 */
export function friendListItems(viewerId: string, friendId: string, sharedListIds: string[]): Prisma.KDoWhereInput {
    return {
        OR: [
            { authorId: friendId, recipientId: null, listKDos: { some: { listId: { in: sharedListIds } } } },
            { recipientId: friendId, authorId: { not: viewerId } },
        ],
    };
}

/**
 * What changed on a friend's list since `since` (the last time the viewer
 * opened it), for the home page. Kinds turned off in `settings` count 0.
 * The viewer's own actions never count (their surprise ideas, their
 * reservations). A gift added then deleted in between counts for nothing,
 * and a new gift counts as added only, not also as edited.
 */
export async function getFriendNews(
    prisma: PrismaClient,
    viewerId: string,
    friendId: string,
    sharedListIds: string[],
    since: Date,
    settings: NotificationSettings
): Promise<FriendNewsDto> {
    const items = friendListItems(viewerId, friendId, sharedListIds);

    const [added, edited, deleted, taken] = await Promise.all([
        settings.added
            ? prisma.kDo.count({ where: { AND: [items, { deletedAt: null, createdAt: { gt: since } }] } })
            : 0,
        settings.edited
            ? prisma.kDo.count({
                  where: {
                      AND: [
                          items,
                          { deletedAt: null, createdAt: { lte: since } },
                          { OR: [{ labelEditedAt: { gt: since } }, { linksEditedAt: { gt: since } }] },
                      ],
                  },
              })
            : 0,
        settings.deleted
            ? prisma.kDo.count({ where: { AND: [items, { createdAt: { lte: since }, deletedAt: { gt: since } }] } })
            : 0,
        settings.taken
            ? prisma.userKDo.count({
                  where: {
                      userId: { not: viewerId },
                      hasChecked: true,
                      createdAt: { gt: since },
                      kDo: { AND: [items, { deletedAt: null }] },
                  },
              })
            : 0,
    ]);

    return { added, edited, deleted, taken };
}

/** The gifts of a friend's list the viewer has taken, oldest first. */
export async function getTakenByMe(
    prisma: PrismaClient,
    viewerId: string,
    friendId: string,
    sharedListIds: string[]
): Promise<TakenKdoDto[]> {
    const reservations = await prisma.userKDo.findMany({
        where: {
            userId: viewerId,
            hasChecked: true,
            kDo: { AND: [friendListItems(viewerId, friendId, sharedListIds), { deletedAt: null }] },
        },
        include: { kDo: true },
        orderBy: { createdAt: 'asc' },
    });

    return reservations.map((reservation) => ({ id: reservation.kDo.id, label: reservation.kDo.label }));
}

/** Ids of the friend's lists the viewer is a member of. */
export async function getSharedListIds(prisma: PrismaClient, viewerId: string, friendId: string): Promise<string[]> {
    const lists = await prisma.list.findMany({
        where: { authorId: friendId, deletedAt: null, userLists: { some: { userId: viewerId } } },
        select: { id: true },
    });

    return lists.map((list) => list.id);
}

/**
 * Records that the viewer opened the friend's list: its news on the home page
 * start over from now. Returns since when the friend page should mark what
 * changed: the previous visit (an earlier view within VISIT_GAP_MS is the
 * same visit), never before the friendship started.
 */
export async function recordFriendListVisit(
    prisma: PrismaClient,
    viewerId: string,
    friendId: string,
    friendshipStart: Date
): Promise<Date> {
    const now = new Date();
    const view = await prisma.friendListView.findUnique({
        where: { viewerId_friendId: { viewerId, friendId } },
    });

    const isNewVisit = !view || now.getTime() - view.seenAt.getTime() > VISIT_GAP_MS;
    const previousSeenAt = isNewVisit ? (view?.seenAt ?? null) : view.previousSeenAt;

    await prisma.friendListView.upsert({
        where: { viewerId_friendId: { viewerId, friendId } },
        create: { viewerId, friendId, seenAt: now, previousSeenAt },
        update: { seenAt: now, previousSeenAt },
    });

    return previousSeenAt && previousSeenAt > friendshipStart ? previousSeenAt : friendshipStart;
}

export async function getNotificationSettings(prisma: PrismaClient, userId: string): Promise<NotificationSettings> {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

    return {
        added: user.notifyAdded,
        edited: user.notifyEdited,
        deleted: user.notifyDeleted,
        taken: user.notifyTaken,
    };
}

/** Markers of one gift on the friend page, undefined if nothing changed. */
export function getItemNews(
    item: { createdAt: Date; labelEditedAt: Date | null; linksEditedAt: Date | null },
    since: Date,
    settings: NotificationSettings,
    isNewlyTaken: boolean
): KdoNewsDto | undefined {
    const isNew = item.createdAt > since;

    const news = {
        added: settings.added && isNew,
        label: settings.edited && !isNew && !!item.labelEditedAt && item.labelEditedAt > since,
        links: settings.edited && !isNew && !!item.linksEditedAt && item.linksEditedAt > since,
        taken: settings.taken && isNewlyTaken,
    };

    return news.added || news.label || news.links || news.taken ? news : undefined;
}
