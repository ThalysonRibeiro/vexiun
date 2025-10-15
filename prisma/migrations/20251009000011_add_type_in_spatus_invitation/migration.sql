/*
  Warnings:

  - The values [REJECTED] on the enum `SpatusInvitation` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SpatusInvitation_new" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'CANCELLED');
ALTER TABLE "public"."WorkspaceInvitation" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "WorkspaceInvitation" ALTER COLUMN "status" TYPE "SpatusInvitation_new" USING ("status"::text::"SpatusInvitation_new");
ALTER TYPE "SpatusInvitation" RENAME TO "SpatusInvitation_old";
ALTER TYPE "SpatusInvitation_new" RENAME TO "SpatusInvitation";
DROP TYPE "public"."SpatusInvitation_old";
ALTER TABLE "WorkspaceInvitation" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
