"use server";
import { validateWorkspaceAccess } from "@/lib/db/validators";
import {
  ERROR_MESSAGES,
  PermissionError,
  successResponse,
  withAuth
} from "@/lib/errors";
import prisma from "@/lib/prisma";

export const getItemsByStatus = withAuth(async (
  userId,
  session,
  workspaceId: string) => {

  if (!workspaceId) {
    return successResponse({
      response: [],
      statusDone: [],
      statusNotStarted: [],
      statusInProgress: [],
      statusStoped: [],
    });
  }
  const hasAccess = await validateWorkspaceAccess(workspaceId, userId);

  if (!hasAccess) {
    throw new PermissionError(ERROR_MESSAGES.PERMISSION.NO_ACCESS);
  }

  const response = await prisma.item.findMany({
    where: { group: { workspaceId } },
    include: {
      assignedToUser: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
          createdBy: true,
        },
      },
      createdByUser: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
          createdBy: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const categorized = response.reduce(
    (acc, item) => {
      switch (item.status) {
        case "DONE":
          acc.statusDone.push(item);
          break;
        case "NOT_STARTED":
          acc.statusNotStarted.push(item);
          break;
        case "IN_PROGRESS":
          acc.statusInProgress.push(item);
          break;
        case "STOPPED":
          acc.statusStoped.push(item);
          break;
      }
      return acc;
    },
    {
      statusDone: [] as typeof response,
      statusNotStarted: [] as typeof response,
      statusInProgress: [] as typeof response,
      statusStoped: [] as typeof response,
    }
  );

  return successResponse({
    response,
    ...categorized,
  });
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);