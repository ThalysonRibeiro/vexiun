"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ActionResponse, handleError, successResponse } from "@/lib/errors/error-handler";
import { ERROR_MESSAGES } from "@/lib/errors/messages";
import { AuthenticationError } from "@/lib/errors/custom-errors";

export async function deleteAllNotifications(): Promise<ActionResponse<number | string>> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new AuthenticationError();
    }

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