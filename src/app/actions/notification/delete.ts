"use server"
import prisma from "@/lib/prisma";
import { z } from "zod";
import {
  ActionResponse,
  ERROR_MESSAGES,
  successResponse,
  ValidationError,
  withAuth
} from "@/lib/errors";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  notificationId: z.string().min(1, "O id é obrigatório"),
});

export type DeleteNotificationType = z.infer<typeof formSchema>;

export const deleteNotification = withAuth(async (
  userId,
  session,
  formData: DeleteNotificationType
): Promise<ActionResponse<string>> => {

  const schema = formSchema.safeParse(formData);
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

  revalidatePath("/dashboard/notifications");
  return successResponse("Notificação deletada com sucesso");

}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);