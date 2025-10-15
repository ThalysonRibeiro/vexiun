"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { handleError, successResponse } from "@/utils/error-handler";
import { ERROR_MESSAGES } from "@/utils/error-messages";

const formSchema = z.object({
  notificationIds: z.array(z.string().cuid()),
});

export async function deleteMultipleNotifications(formData: z.infer<typeof formSchema>) {
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