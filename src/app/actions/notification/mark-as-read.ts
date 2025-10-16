"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActionResponse, handleError, successResponse } from "@/lib/errors/error-handler";
import { ERROR_MESSAGES } from "@/lib/errors/messages";
import { AuthenticationError, ValidationError } from "@/lib/errors/custom-errors";

const formSchema = z.object({
  notificationId: z.string().cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
});

export type MarkNotificationAsReadType = z.infer<typeof formSchema>;

export async function markNotificationAsRead(formData: MarkNotificationAsReadType): Promise<ActionResponse<string>> {
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
    await prisma.notification.update({
      where: {
        id: formData.notificationId,
        userId,
      },
      data: { isRead: true },
    });

    revalidatePath("/dashboard/notifications");
    return successResponse("Notificação marcada como lida com sucesso");
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};