"use server";
import prisma from "@/lib/prisma";
import { Priority } from "@/generated/prisma";
import { ERROR_MESSAGES, PermissionError, successResponse, withAuth } from "@/lib/errors";
import { validateWorkspaceAccess } from "@/lib/db/validators";

export type PrioritiesCount = {
  priority: Priority;
  count: number;
};
type PrioritiesResponse = Awaited<ReturnType<typeof getPriorities>>;
export type PrioritiesData = Extract<PrioritiesResponse, { success: true }>['data'];


export const getPriorities = withAuth(async (
  userId,
  session,
  workspaceId: string) => {

  if (!workspaceId) {
    return successResponse([]);
  };

  const hasAccess = await validateWorkspaceAccess(workspaceId, userId);

  if (!hasAccess) {
    throw new PermissionError(ERROR_MESSAGES.PERMISSION.NO_ACCESS);
  }

  const items = await prisma.item.findMany({
    where: {
      group: {
        workspaceId: workspaceId,
      },
    },
    select: {
      priority: true,
    },
    orderBy: {
      priority: "asc",
    },
  });

  const prioritiesCount = items.reduce((acc, item) => {
    const priority = item.priority;
    const existingPriority = acc.find((p) => p.priority === priority);

    if (existingPriority) {
      existingPriority.count++;
    } else {
      acc.push({ priority, count: 1 });
    }

    return acc;
  }, [] as PrioritiesCount[]);

  return successResponse(prioritiesCount);
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);
