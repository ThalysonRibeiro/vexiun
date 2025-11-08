"use server";
import prisma from "@/lib/prisma";
import { ActionResponse, ERROR_MESSAGES, successResponse, withAuth } from "@/lib/errors";
import { revalidatePath } from "next/cache";

export const markAllAsRead = withAuth(async (userId): Promise<ActionResponse<string>> => {
  await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false
    },
    data: { isRead: true }
  });

  revalidatePath("/dashboard/notifications");
  return successResponse("Notificações marcadas como lidas com sucesso");
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);
