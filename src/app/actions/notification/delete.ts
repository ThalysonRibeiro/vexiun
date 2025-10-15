"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { handleError, successResponse } from "@/utils/error-handler";
import { ERROR_MESSAGES } from "@/utils/error-messages";

const formSchema = z.object({
  notificationId: z.string().min(1, "O id é obrigatório"),
});

export async function deleteNotification(formData: z.infer<typeof formSchema>) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: ERROR_MESSAGES.AUTH.NOT_AUTHENTICATED };
  };
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return { error: schema.error.issues[0].message };
  };

  try {
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