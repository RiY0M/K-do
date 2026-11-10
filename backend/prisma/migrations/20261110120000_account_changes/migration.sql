-- Account page: e-mail / password changes that can be undone for 7 days from
-- the e-mail sent to the previous address, and "users"."tokenVersion" to log
-- out every session at once.

-- AlterTable
ALTER TABLE "users" ADD COLUMN "tokenVersion" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "account_changes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "previousEmail" TEXT,
    "previousPasswordHash" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_changes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_changes_tokenHash_key" ON "account_changes"("tokenHash");

-- AddForeignKey
ALTER TABLE "account_changes" ADD CONSTRAINT "account_changes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
