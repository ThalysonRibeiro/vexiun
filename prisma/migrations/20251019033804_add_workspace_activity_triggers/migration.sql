-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Migration: Add workspace activity triggers

-- ================================================
-- 1. FUNÇÃO: Atualizar lastActivityAt via Group
-- ================================================
CREATE OR REPLACE FUNCTION update_workspace_activity_from_group()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualiza lastActivityAt da workspace relacionada
  UPDATE "Workspace"
  SET "lastActivityAt" = NOW()
  WHERE id = NEW."workspaceId";
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- 2. FUNÇÃO: Atualizar lastActivityAt via Item
-- ================================================
CREATE OR REPLACE FUNCTION update_workspace_activity_from_item()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualiza lastActivityAt através do Group
  UPDATE "Workspace"
  SET "lastActivityAt" = NOW()
  WHERE id IN (
    SELECT "workspaceId" 
    FROM "Group" 
    WHERE id = NEW."groupId"
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- 3. FUNÇÃO: Atualizar lastActivityAt via Member
-- ================================================
CREATE OR REPLACE FUNCTION update_workspace_activity_from_member()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualiza quando membro entra/sai
  UPDATE "Workspace"
  SET "lastActivityAt" = NOW()
  WHERE id = NEW."workspaceId";
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- 4. FUNÇÃO: Atualizar lastActivityAt via Chat
-- ================================================
CREATE OR REPLACE FUNCTION update_workspace_activity_from_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualiza através do Chat
  UPDATE "Workspace"
  SET "lastActivityAt" = NOW()
  WHERE id IN (
    SELECT "workspaceId" 
    FROM "Chat" 
    WHERE id = NEW."chatId"
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- 5. TRIGGERS: Group (INSERT/UPDATE)
-- ================================================
CREATE TRIGGER trigger_group_activity
AFTER INSERT OR UPDATE ON "Group"
FOR EACH ROW
EXECUTE FUNCTION update_workspace_activity_from_group();

-- ================================================
-- 6. TRIGGERS: Item (INSERT/UPDATE)
-- ================================================
CREATE TRIGGER trigger_item_activity
AFTER INSERT OR UPDATE ON "Item"
FOR EACH ROW
EXECUTE FUNCTION update_workspace_activity_from_item();

-- ================================================
-- 7. TRIGGERS: WorkspaceMember (INSERT/DELETE)
-- ================================================
CREATE TRIGGER trigger_member_activity_insert
AFTER INSERT ON "WorkspaceMember"
FOR EACH ROW
EXECUTE FUNCTION update_workspace_activity_from_member();

-- ================================================
-- 8. TRIGGERS: Message (INSERT)
-- ================================================
CREATE TRIGGER trigger_message_activity
AFTER INSERT ON "Message"
FOR EACH ROW
EXECUTE FUNCTION update_workspace_activity_from_message();

-- ================================================
-- 9. Atualizar workspaces existentes
-- ================================================
-- Define lastActivityAt para workspaces existentes
UPDATE "Workspace" w
SET "lastActivityAt" = COALESCE(
  (
    SELECT MAX(updated)
    FROM (
      SELECT MAX(g."updatedAt") as updated
      FROM "Group" g
      WHERE g."workspaceId" = w.id
      UNION ALL
      SELECT MAX(i."updatedAt")
      FROM "Item" i
      INNER JOIN "Group" g ON i."groupId" = g.id
      WHERE g."workspaceId" = w.id
    ) activities
  ),
  w."updatedAt"
);