"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { handleError, successResponse } from "@/utils/error-handler";
import { ERROR_MESSAGES } from "@/utils/error-messages";

export async function deleteAllNotifications() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: ERROR_MESSAGES.AUTH.NOT_AUTHENTICATED };
  };

  try {
    const result = await prisma.notification.deleteMany({
      where: { userId },
    });

    revalidatePath("/dashboard/notifications");
    return successResponse(result.count, "Notificações deletadas com sucesso")
  } catch (error) {
    console.error(error);
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};