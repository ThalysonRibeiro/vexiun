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
  notificationIds: z.array(z.string().cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID)),
});

export type DeleteMultipleNotificationsType = z.infer<typeof formSchema>;

export const deleteMultipleNotifications = withAuth(async (
  userId,
  session,
  formData: DeleteMultipleNotificationsType
): Promise<ActionResponse<number | string>> => {

  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    throw new ValidationError(schema.error.issues[0].message);
  };
  await prisma.notification.deleteMany({
    where: {
      id: { in: formData.notificationIds },
      userId,
    },
  });

  revalidatePath("/dashboard/notifications");
  return successResponse(formData.notificationIds.length, "Notificações deletadas com sucesso")

}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);