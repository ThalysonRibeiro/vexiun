-- CreateEnum
CREATE TYPE "EntityStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'DELETED');

-- CreateEnum
CREATE TYPE "WorkspaceCategory" AS ENUM ('PERSONAL', 'WORK', 'EDUCATION', 'HEALTH', 'FINANCE', 'CREATIVE', 'TECHNOLOGY', 'MARKETING', 'SALES', 'SUPPORT', 'OTHER');

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "status" "EntityStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "entityStatus" "EntityStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "categories" "WorkspaceCategory"[],
ADD COLUMN     "description" TEXT,
ADD COLUMN     "status" "EntityStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "statusChangedAt" TIMESTAMP(3),
ADD COLUMN     "statusChangedBy" TEXT;

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_statusChangedBy_fkey" FOREIGN KEY ("statusChangedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
