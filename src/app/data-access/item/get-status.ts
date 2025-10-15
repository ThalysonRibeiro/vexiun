"use server";
import { auth } from "@/lib/auth";
import { AuthenticationError, PermissionError } from "@/lib/errors";
import prisma from "@/lib/prisma";
import { handleError, successResponse } from "@/utils/error-handler";
import { ERROR_MESSAGES } from "@/utils/error-messages";
import { Priority, Status } from "@/generated/prisma";
import { validateWorkspaceAccess } from "@/lib/db/validators";

export type StatusCount = {
  status: Status;
  count: number;
};

export async function getStatus(workspaceId: string) {
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
        status: true,
      },
      orderBy: {
        status: "asc",
      },
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
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};
