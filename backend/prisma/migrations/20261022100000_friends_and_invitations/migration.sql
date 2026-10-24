-- Friends & invitations.
--
-- * "friendships": friend requests (PENDING) and friendships (ACCEPTED).
-- * "invitations": shareable /invite/:id links to join one of the inviter's
--   lists (replaces the old /invite/:userId flow).
-- * "k_dos"."recipientId": who a surprise gift idea is for. Null for the
--   author's own wishes, so surprise ideas no longer leak into the author's
--   own list nor into the recipient's.
-- * Unique (userId, listId) on "users_lists" and (userId, kDoId) on
--   "users_k_dos", so concurrent requests can't create duplicates.

-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('PENDING', 'ACCEPTED');

-- AlterTable
ALTER TABLE "k_dos" ADD COLUMN "recipientId" TEXT;

-- CreateTable
CREATE TABLE "friendships" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "addresseeId" TEXT NOT NULL,
    "status" "FriendshipStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "friendships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitations" (
    "id" TEXT NOT NULL,
    "inviterId" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- Remove possible duplicates before adding the unique indexes
DELETE FROM "users_lists" a USING "users_lists" b
WHERE a."userId" = b."userId" AND a."listId" = b."listId" AND a."id" > b."id";

DELETE FROM "users_k_dos" a USING "users_k_dos" b
WHERE a."userId" = b."userId" AND a."kDoId" = b."kDoId" AND a."id" > b."id";

-- CreateIndex
CREATE UNIQUE INDEX "users_lists_userId_listId_key" ON "users_lists"("userId", "listId");

-- CreateIndex
CREATE UNIQUE INDEX "users_k_dos_userId_kDoId_key" ON "users_k_dos"("userId", "kDoId");

-- CreateIndex
CREATE UNIQUE INDEX "friendships_requesterId_addresseeId_key" ON "friendships"("requesterId", "addresseeId");

-- AddForeignKey
ALTER TABLE "k_dos" ADD CONSTRAINT "k_dos_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_addresseeId_fkey" FOREIGN KEY ("addresseeId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_listId_fkey" FOREIGN KEY ("listId") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Data: people who already joined someone's list through the old invite
-- flow become friends...
INSERT INTO "friendships" ("id", "requesterId", "addresseeId", "status", "createdAt", "updatedAt")
SELECT DISTINCT ON (LEAST(l."authorId", ul."userId"), GREATEST(l."authorId", ul."userId"))
    gen_random_uuid()::text, l."authorId", ul."userId", 'ACCEPTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "users_lists" ul
JOIN "lists" l ON l."id" = ul."listId"
WHERE ul."userId" <> l."authorId" AND l."deletedAt" IS NULL
ORDER BY LEAST(l."authorId", ul."userId"), GREATEST(l."authorId", ul."userId")
ON CONFLICT DO NOTHING;

-- ...and, like new friends, each one joins the other's default (oldest) list.
INSERT INTO "users_lists" ("id", "userId", "listId")
SELECT gen_random_uuid()::text, f."requesterId", dl."id"
FROM "friendships" f
JOIN LATERAL (
    SELECT "id" FROM "lists"
    WHERE "authorId" = f."addresseeId" AND "deletedAt" IS NULL
    ORDER BY "createdAt" ASC LIMIT 1
) dl ON TRUE
WHERE f."status" = 'ACCEPTED'
ON CONFLICT DO NOTHING;

INSERT INTO "users_lists" ("id", "userId", "listId")
SELECT gen_random_uuid()::text, f."addresseeId", dl."id"
FROM "friendships" f
JOIN LATERAL (
    SELECT "id" FROM "lists"
    WHERE "authorId" = f."requesterId" AND "deletedAt" IS NULL
    ORDER BY "createdAt" ASC LIMIT 1
) dl ON TRUE
WHERE f."status" = 'ACCEPTED'
ON CONFLICT DO NOTHING;
