"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { handleError, successResponse } from "@/utils/error-handler";
import { ERROR_MESSAGES } from "@/utils/error-messages";

export async function markAllAsRead() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: ERROR_MESSAGES.AUTH.NOT_AUTHENTICATED };
  };

  try {
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    revalidatePath("/dashboard/notifications");
    return successResponse("Notificações marcadas como lidas com sucesso");
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};