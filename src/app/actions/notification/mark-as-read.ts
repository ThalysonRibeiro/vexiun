"use server";
import prisma from "@/lib/prisma";
import {
  ActionResponse,
  ERROR_MESSAGES,
  successResponse,
  ValidationError,
  withAuth
} from "@/lib/errors";
import { revalidatePath } from "next/cache";
import { MarkNotificationAsReadType, notificationIdsFormSchema } from "./notification-schema";

export const markNotificationAsRead = withAuth(
  async (
    userId,
    session,
    formData: MarkNotificationAsReadType
  ): Promise<ActionResponse<string>> => {
    const schema = notificationIdsFormSchema.safeParse(formData);
    if (!schema.success) {
      throw new ValidationError(schema.error.issues[0].message);
    }
    await prisma.notification.update({
      where: {
        id: formData.notificationId,
        userId
      },
      data: { isRead: true }
    });
    if (formData.revalidatePaths?.length) {
      formData.revalidatePaths.forEach((path) => revalidatePath(path));
    }
    return successResponse("Notificação marcada como lida com sucesso");
  },
  ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR
);
