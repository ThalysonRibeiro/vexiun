"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { auth } from "@/lib/auth";
import { NotificationType } from "@/generated/prisma";
import { validateItemExists, validateUserExists, validateWorkspaceExists } from "@/lib/db/validators";
import { handleError } from "@/utils/error-handler";
import { ERROR_MESSAGES } from "@/utils/error-messages";

const formSchema = z.object({
  image: z.string().optional(),
  nameReference: z.string().optional(),
  userId: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  referenceId: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  message: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  type: z.enum([
    NotificationType.FRIEND_REQUEST,
    NotificationType.FRIEND_ACCEPTED,
    NotificationType.WORKSPACE_INVITE,
    NotificationType.WORKSPACE_ACCEPTED,
    NotificationType.ITEM_ASSIGNED,
    NotificationType.ITEM_COMPLETED,
    NotificationType.CHAT_MESSAGE
  ]),
});

export async function createAndSendNotification(formData: z.infer<typeof formSchema>) {
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
    await validateUserExists(formData.userId);

    switch (formData.type) {
      case "CHAT_MESSAGE":
      case "FRIEND_REQUEST":
      case "FRIEND_ACCEPTED":
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
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};

async function createNotification(formData: z.infer<typeof formSchema>) {
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