"use server";
import { auth } from "@/lib/auth";
import { validateWorkspaceAccess } from "@/lib/db/validators";
import { AuthenticationError, PermissionError } from "@/lib/errors/custom-errors";
import prisma from "@/lib/prisma";
import { handleError, successResponse } from "@/lib/errors/error-handler";
import { ERROR_MESSAGES } from "@/lib/errors/messages";

export async function getCompletedItems(workspaceId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new AuthenticationError();
    };

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
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  }
}