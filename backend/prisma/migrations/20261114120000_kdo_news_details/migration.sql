-- The friend page shows which gifts changed since my last visit, and whether
-- it was the label or the links: "editedAt" is split in two.

-- AlterTable
ALTER TABLE "k_dos" ADD COLUMN "labelEditedAt" TIMESTAMP(3),
ADD COLUMN "linksEditedAt" TIMESTAMP(3);

-- "editedAt" didn't say what changed: counted as a label change
UPDATE "k_dos" SET "labelEditedAt" = "editedAt" WHERE "editedAt" IS NOT NULL;

ALTER TABLE "k_dos" DROP COLUMN "editedAt";

-- AlterTable
ALTER TABLE "friend_list_views" ADD COLUMN "previousSeenAt" TIMESTAMP(3);
