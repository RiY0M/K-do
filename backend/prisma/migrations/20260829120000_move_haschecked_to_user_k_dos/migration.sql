-- Reconciles the database with prisma/schema.prisma.
--
-- The init migration (20260823064852_init) put "hasChecked" on
-- "lists_k_dos" (the ListKDo join table), but schema.prisma has always
-- modeled it on "users_k_dos" (the UserKDo join table) instead - i.e. "has
-- this user marked this KDo as taken/reserved for its author", not
-- "is this KDo associated with this list checked". The two had drifted
-- apart; this migration moves the column to match schema.prisma, which is
-- also what the new /kdo/friend/check/:id route (see
-- src/services/ItemService.ts#toggleTaken) relies on.
--
-- NOTE: this does not attempt to preserve any existing "hasChecked" values
-- on lists_k_dos - as far as we could tell nothing ever read/wrote that
-- column (no route used it), so there should be no real data to migrate.
-- Double-check that assumption against production data before running this
-- against a real database.
ALTER TABLE "lists_k_dos" DROP COLUMN "hasChecked";

ALTER TABLE "users_k_dos" ADD COLUMN "hasChecked" BOOLEAN NOT NULL DEFAULT true;
