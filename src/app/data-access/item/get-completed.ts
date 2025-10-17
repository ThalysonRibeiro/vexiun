"use server";
import { validateWorkspaceAccess } from "@/lib/db/validators";
import { ERROR_MESSAGES, PermissionError, successResponse, withAuth } from "@/lib/errors";
import prisma from "@/lib/prisma";
;

export const getCompletedItems = withAuth(async (
  userId,
  session,
  workspaceId: string) => {

  if (!workspaceId) {
    return successResponse(null);
  };

  const hasAccess = await validateWorkspaceAccess(workspaceId, userId);

  if (!hasAccess) {
    throw new PermissionError(ERROR_MESSAGES.PERMISSION.NO_ACCESS);
  }

  const response = await prisma.item.findMany({
    where: {
      status: "DONE",
      group: {
        workspaceId,
      },
    },
    include: {
      assignedToUser: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
  return successResponse(response);
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);