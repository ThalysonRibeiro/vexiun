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
  notificationId: z.string().cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
});

export type MarkNotificationAsReadType = z.infer<typeof formSchema>;

export const markNotificationAsRead = withAuth(async (
  userId,
  session,
  formData: MarkNotificationAsReadType
): Promise<ActionResponse<string>> => {

  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    throw new ValidationError(schema.error.issues[0].message);
  };
  await prisma.notification.update({
    where: {
      id: formData.notificationId,
      userId,
    },
    data: { isRead: true },
  });

  revalidatePath("/dashboard/notifications");
  return successResponse("Notificação marcada como lida com sucesso");

}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);