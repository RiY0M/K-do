-- News on the home page: what changed on each friend's list since I last
-- opened it (gifts added, edited, deleted, taken), each kind can be turned off.

-- AlterTable
ALTER TABLE "users" ADD COLUMN "notifyAdded" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "notifyEdited" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "notifyDeleted" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "notifyTaken" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "k_dos" ADD COLUMN "editedAt" TIMESTAMP(3);

-- AlterTable: existing reservations get the migration time, same as the
-- views created below, so they don't all show up as news
ALTER TABLE "users_k_dos" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "friend_list_views" (
    "id" TEXT NOT NULL,
    "viewerId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,
    "seenAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "friend_list_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "friend_list_views_viewerId_friendId_key" ON "friend_list_views"("viewerId", "friendId");

-- AddForeignKey
ALTER TABLE "friend_list_views" ADD CONSTRAINT "friend_list_views_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_list_views" ADD CONSTRAINT "friend_list_views_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Starts every existing friendship "up to date": without this, everything
-- since the friendship began would show up as news once the feature ships.
-- CURRENT_TIMESTAMP is the transaction's start time, the same value as the
-- users_k_dos default above. gen_random_uuid() is built into Postgres 13+.
INSERT INTO "friend_list_views" ("id", "viewerId", "friendId", "seenAt")
SELECT gen_random_uuid()::text, pair.viewer, pair.friend, CURRENT_TIMESTAMP
FROM "friendships" f
CROSS JOIN LATERAL (VALUES (f."requesterId", f."addresseeId"), (f."addresseeId", f."requesterId")) AS pair(viewer, friend)
WHERE f."status" = 'ACCEPTED';
