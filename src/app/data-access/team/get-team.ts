"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AuthenticationError, PermissionError } from "@/lib/errors/custom-errors";
import { handleError, successResponse } from "@/lib/errors/error-handler";
import { validateWorkspaceAccess } from "@/lib/db/validators";
import { ERROR_MESSAGES } from "@/lib/errors/messages";

export async function getTeam(workspaceId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new AuthenticationError();
  }

  if (!workspaceId) {
    return successResponse([]);
  }
  const hasAccess = await validateWorkspaceAccess(workspaceId, userId);

  if (!hasAccess) {
    throw new PermissionError(ERROR_MESSAGES.PERMISSION.NO_ACCESS);
  }
  try {
    const team = await prisma.workspaceMember.findMany({
      where: {
        workspaceId,
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
    return successResponse(team.map(member => member.user));
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  }
}