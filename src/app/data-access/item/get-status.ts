"use server";
import prisma from "@/lib/prisma";
import { Status } from "@/generated/prisma";
import { validateWorkspaceAccess } from "@/lib/db/validators";
import { ERROR_MESSAGES, PermissionError, successResponse, withAuth } from "@/lib/errors";

export type StatusCount = {
  status: Status;
  count: number;
};

export const getStatus = withAuth(async (userId, session, workspaceId: string) => {
  if (!workspaceId) {
    return successResponse([]);
  }

  const hasAccess = await validateWorkspaceAccess(workspaceId, userId);

  if (!hasAccess) {
    throw new PermissionError(ERROR_MESSAGES.PERMISSION.NO_ACCESS);
  }

  const items = await prisma.item.findMany({
    where: {
      group: {
        workspaceId: workspaceId
      }
    },
    select: {
      status: true
    },
    orderBy: {
      status: "asc"
    }
  });

  const statusCount = items.reduce((acc, item) => {
    const status = item.status;
    const existingStatus = acc.find((p) => p.status === status);

    if (existingStatus) {
      existingStatus.count++;
    } else {
      acc.push({ status, count: 1 });
    }

    return acc;
  }, [] as StatusCount[]);

  return successResponse(statusCount);
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);
