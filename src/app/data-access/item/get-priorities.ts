"use server";
import { auth } from "@/lib/auth";
import { AuthenticationError, PermissionError } from "@/lib/errors/custom-errors";
import prisma from "@/lib/prisma";
import { handleError, successResponse } from "@/lib/errors/error-handler";
import { ERROR_MESSAGES } from "@/lib/errors/messages";
import { Priority } from "@/generated/prisma";
import { validateWorkspaceAccess } from "@/lib/db/validators";

export type PrioritiesCount = {
  priority: Priority;
  count: number;
};
type PrioritiesResponse = Awaited<ReturnType<typeof getPriorities>>;
export type PrioritiesData = Extract<PrioritiesResponse, { success: true }>['data'];


export async function getPriorities(workspaceId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new AuthenticationError();
    };

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
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};
