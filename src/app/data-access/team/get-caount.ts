"use server";

import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/errors";
import { successResponse } from "@/lib/errors/error-handler";
import { ERROR_MESSAGES } from "@/lib/errors";

export const getTeamCount = withAuth(async (userId, session, workspaceId: string) => {
  const count = await prisma.workspaceMember.count({
    where: { workspaceId }
  });

  return successResponse({ count }, "Contagem obtida com sucesso");
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);
