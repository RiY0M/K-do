-- Links attached to a gift idea: now also store their author (only the
-- gift's author can manage them) and creation date, and are deleted with
-- their gift.

-- AlterTable
ALTER TABLE "links" ADD COLUMN "authorId" TEXT;
ALTER TABLE "links" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Existing links (if any) belong to the author of their gift
UPDATE "links" l SET "authorId" = k."authorId" FROM "k_dos" k WHERE k."id" = l."kDoId";
ALTER TABLE "links" ALTER COLUMN "authorId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "links_kDoId_idx" ON "links"("kDoId");

-- DropForeignKey
ALTER TABLE "links" DROP CONSTRAINT "links_kDoId_fkey";

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "links" ADD CONSTRAINT "links_kDoId_fkey" FOREIGN KEY ("kDoId") REFERENCES "k_dos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
