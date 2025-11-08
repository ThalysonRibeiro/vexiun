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
import { DeleteMultipleNotificationsType, notificationIdsFormSchema } from "./notification-schema";

export const deleteMultipleNotifications = withAuth(
  async (
    userId,
    session,
    formData: DeleteMultipleNotificationsType
  ): Promise<ActionResponse<number | string>> => {
    const schema = notificationIdsFormSchema.safeParse(formData);
    if (!schema.success) {
      throw new ValidationError(schema.error.issues[0].message);
    }
    await prisma.notification.deleteMany({
      where: {
        id: { in: formData.notificationIds },
        userId
      }
    });
    if (formData.revalidatePaths?.length) {
      formData.revalidatePaths.forEach((path) => revalidatePath(path));
    }
    return successResponse(formData.notificationIds.length, "Notificações deletadas com sucesso");
  },
  ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR
);
