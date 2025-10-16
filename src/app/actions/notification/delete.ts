"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActionResponse, handleError, successResponse } from "@/lib/errors/error-handler";
import { ERROR_MESSAGES } from "@/lib/errors/messages";
import { AuthenticationError, ValidationError } from "@/lib/errors/custom-errors";

const formSchema = z.object({
  notificationId: z.string().min(1, "O id é obrigatório"),
});

export type DeleteNotificationType = z.infer<typeof formSchema>;

export async function deleteNotification(formData: DeleteNotificationType): Promise<ActionResponse<string>> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new AuthenticationError();
    }
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
  } catch (error) {
    console.error(error);
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};