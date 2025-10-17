"use server"
import prisma from "@/lib/prisma";
import {
  ActionResponse, ERROR_MESSAGES, successResponse, withAuth
} from "@/lib/errors";
import { revalidatePath } from "next/cache";


export const deleteAllNotifications = withAuth(async (
  userId
): Promise<ActionResponse<number | string>> => {

  const result = await prisma.notification.deleteMany({
    where: { userId },
  });

  revalidatePath("/dashboard/notifications");
  return successResponse(result.count, "Notificações deletadas com sucesso")

}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);