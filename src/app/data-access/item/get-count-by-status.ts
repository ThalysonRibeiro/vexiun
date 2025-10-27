"use server"
import prisma from "@/lib/prisma";
import { withAuth, successResponse, ERROR_MESSAGES } from "@/lib/errors";
import { EntityStatus } from "@/generated/prisma";

export const getItemsCountByStatus = withAuth(async (
  userId,
  session,
  workspaceId: string,
  entityStatus: EntityStatus
) => {
  const count = await prisma.item.count({
    where: {
      entityStatus,
      group: {
        workspaceId
      }
    }
  });

  return successResponse({ count }, "Contagem obtida com sucesso");
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);