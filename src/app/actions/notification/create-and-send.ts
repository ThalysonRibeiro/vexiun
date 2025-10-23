"use server"
import prisma from "@/lib/prisma";
import {
  validateItemExists,
  validateUserExists,
  validateWorkspaceExists
} from "@/lib/db/validators";
import { ERROR_MESSAGES, handleError } from "@/lib/errors";
import { CreateNotificationInput, notificationFormSchema } from "./notification-schema";


/**
 * Função helper para criar notificações.
 * NOTA: Esta função assume que a autenticação já foi validada pela action que a chamou.
 */
export async function createAndSendNotification(formData: CreateNotificationInput) {
  try {
    const schema = notificationFormSchema.safeParse(formData);
    if (!schema.success) {
      return { error: schema.error.issues[0].message };
    };

    await validateUserExists(formData.userId);

    switch (formData.type) {
      case "CHAT_MESSAGE":
        const userReferenceExists = await validateUserExists(formData.referenceId);

        return await createNotification({
          ...formData,
          image: userReferenceExists.image ?? undefined,
          nameReference: userReferenceExists.name ?? undefined,
        });

      case "WORKSPACE_INVITE":
      case "WORKSPACE_ACCEPTED":
        await validateWorkspaceExists(formData.referenceId);
        return await createNotification(formData);

      case "ITEM_ASSIGNED":
      case "ITEM_COMPLETED":
        await validateItemExists(formData.referenceId)
        return await createNotification(formData);

      default:
        return { error: ERROR_MESSAGES.REQUESTS.INVALID_TYPE }
    };
  } catch (error) {
    console.error(error);
    return handleError(error, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);
  };
};

async function createNotification(formData: CreateNotificationInput) {
  return await prisma.notification.create({
    data: {
      image: formData.image,
      nameReference: formData.nameReference,
      userId: formData.userId,
      type: formData.type,
      message: formData.message,
      referenceId: formData.referenceId
    }
  });
};