"use server";
import { validateWorkspaceAccess } from "@/lib/db/validators";
import { ERROR_MESSAGES, PermissionError, successResponse, withAuth } from "@/lib/errors";
import prisma from "@/lib/prisma";

export const getTeam = withAuth(async (userId, session, workspaceId: string) => {
  if (!workspaceId) {
    return successResponse([]);
  }
  const hasAccess = await validateWorkspaceAccess(workspaceId, userId);

  if (!hasAccess) {
    throw new PermissionError(ERROR_MESSAGES.PERMISSION.NO_ACCESS);
  }

  const team = await prisma.workspaceMember.findMany({
    where: {
      workspaceId
    },
    select: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    }
  });
  return successResponse(team.map((member) => member.user));
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);
