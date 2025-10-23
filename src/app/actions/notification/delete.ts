"use server"
import prisma from "@/lib/prisma";
import {
  ActionResponse,
  ERROR_MESSAGES,
  successResponse,
  ValidationError,
  withAuth
} from "@/lib/errors";
import { revalidatePath } from "next/cache";
import { DeleteNotificationType, notificationIdsFormSchema } from "./notification-schema";

export const deleteNotification = withAuth(async (
  userId,
  session,
  formData: DeleteNotificationType
): Promise<ActionResponse<string>> => {

  const schema = notificationIdsFormSchema.safeParse(formData);
  if (!schema.success) {
    throw new ValidationError(schema.error.issues[0].message);
  };

  const notification = await prisma.notification.findFirst({
    where: {
      id: formData.notificationId,
      userId,
    },
  });

  if (!notification) {
    return { error: ERROR_MESSAGES.NOT_FOUND.NOTIFICATION };
  };

  await prisma.notification.delete({
    where: { id: formData.notificationId },
  });

  if (formData.revalidatePaths?.length) {
    formData.revalidatePaths.forEach((path) => revalidatePath(path));
  }

  return successResponse("Notificação deletada com sucesso");

}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);