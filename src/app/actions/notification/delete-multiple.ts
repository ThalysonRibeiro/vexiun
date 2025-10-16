"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActionResponse, handleError, successResponse } from "@/utils/error-handler";
import { ERROR_MESSAGES } from "@/utils/error-messages";
import { AuthenticationError, ValidationError } from "@/lib/errors";

const formSchema = z.object({
  notificationIds: z.array(z.string().cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID)),
});

export type DeleteMultipleNotificationsType = z.infer<typeof formSchema>;

export async function deleteMultipleNotifications(formData: DeleteMultipleNotificationsType): Promise<ActionResponse<number | string>> {
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
    await prisma.notification.deleteMany({
      where: {
        id: { in: formData.notificationIds },
        userId,
      },
    });

    revalidatePath("/dashboard/notifications");
    return successResponse(formData.notificationIds.length, "Notificações deletadas com sucesso")
  } catch (error) {
    console.error(error);
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};