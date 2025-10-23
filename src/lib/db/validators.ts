import { WorkspaceRole } from "@/generated/prisma";
import prisma from "../prisma";
import { NotFoundError, PermissionError } from "../errors/custom-errors";
import { ERROR_MESSAGES } from "@/lib/errors/messages";

/**
 * Verifica se o usuário existe
 * @throws Error se não existir
*/
export async function validateUserExists(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, image: true, email: true },
  });
  if (!user) {
    throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.USER);
  }
  return user;
}

/**
 * Verifica se um grupo existe
 * @throws Error se não existir
 */
export async function validateGroupExists(groupId: string) {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    select: { id: true },
  });

  if (!group) {
    throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.GROUP);
  }

  return group;
}

/**
 * Verifica se um workspace existe
 * @throws Error se não existir
 */
export async function validateWorkspaceExists(workspaceId: string) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: { id: true, title: true, status: true, userId: true },
  });

  if (!workspace) {
    throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.WORKSPACE);
  }

  return workspace;
}

/**
 * Verifica se um item existe
 * @throws Error se não existir
 */
export async function validateItemExists(itemId: string) {
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    select: { id: true },
  });

  if (!item) {
    throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.ITEM);
  }

  return item;
}

/**
 * Verifica se usuário tem acesso ao workspace
 */
export async function validateWorkspaceAccess(
  workspaceId: string,
  userId: string
) {
  const member = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: { // ✅ Chave composta
        workspaceId,
        userId,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          role: true, // Role global
        },
      },
    },
  });

  if (!member) {
    throw new PermissionError(ERROR_MESSAGES.PERMISSION.NO_ACCESS);
  }

  return member;
}

/**
 * Verifica permissão no workspace
 */
export async function validateWorkspacePermission(
  workspaceId: string,
  userId: string,
  requiredRole: WorkspaceRole = "ADMIN"
) {
  const member = await validateWorkspaceAccess(workspaceId, userId);

  // SUPER_ADMIN sempre pode
  if (member.user.role === "SUPER_ADMIN") {
    return member;
  }

  // Verifica hierarquia
  const roleHierarchy: Record<WorkspaceRole, number> = {
    VIEWER: 0,
    MEMBER: 1,
    ADMIN: 2,
    OWNER: 3,
  };

  if (roleHierarchy[member.role] < roleHierarchy[requiredRole]) {
    throw new PermissionError(ERROR_MESSAGES.PERMISSION.NO_ACCESS);
  }

  return member;
}

/**
 * Busca grupo com informações do workspace
 */
export async function getGroupWithWorkspace(groupId: string) {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      workspace: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!group) {
    throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.GROUP);
  }

  return group;
}

/**
 * Verifica se usuário pode editar item
 */
export async function validateItemEditPermission(
  itemId: string,
  userId: string
) {
  const item = await prisma.item.findUnique({
    where: { id: itemId, },
    include: {
      group: {
        include: {
          workspace: {
            include: {
              members: {
                where: { userId },
              },
            },
          },
        },
      },
    },
  });

  if (!item) {
    throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.ITEM);
  }

  if (item.group?.workspace.members.length === 0) {
    throw new PermissionError(ERROR_MESSAGES.PERMISSION.NO_ACCESS);
  }

  return item;
}