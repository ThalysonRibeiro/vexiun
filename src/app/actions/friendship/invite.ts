"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { validateUserExists } from "@/lib/db/validators";
import { notificationMessages } from "@/lib/notifications/messages";
import { createAndSendNotification } from "../notification";
import { handleError, successResponse } from "@/utils/error-handler";
import { NotFoundError } from "@/lib/errors";
import { ERROR_MESSAGES } from "@/utils/error-messages";

const formSchema = z.object({
  addresseeId: z.string().min(1, "O id é obrigatório"),
});

export async function inviteFriendship(formData: z.infer<typeof formSchema>) {
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
    if (userId === formData.addresseeId) {
      throw new NotFoundError(ERROR_MESSAGES.REQUESTS.CANNOT_SEND_TO_SELF)
    };

    await validateUserExists(formData.addresseeId);

    const existingRequest = await prisma.userFriend.findFirst({
      where: {
        OR: [
          { requesterId: userId, addresseeId: formData.addresseeId },
          { requesterId: formData.addresseeId, addresseeId: userId }
        ]
      }
    });

    if (existingRequest) {
      if (existingRequest.requesterId === userId) {
        throw new NotFoundError(ERROR_MESSAGES.REQUESTS.ALREADY_SENT)
      };
      if (existingRequest.addresseeId === userId) {
        throw new NotFoundError(ERROR_MESSAGES.REQUESTS.ALREADY_RECEIVED)
      };
      return { error: ERROR_MESSAGES.DUPLICATE.FREND_REQUEST };
    };


    const friendRequest = await prisma.userFriend.create({
      data: {
        requesterId: userId as string,
        addresseeId: formData.addresseeId
      }
    });

    const notification = await createAndSendNotification({
      userId: formData.addresseeId,
      referenceId: userId as string,
      message: notificationMessages.FRIEND_REQUEST(session?.user?.name as string),
      type: "FRIEND_REQUEST",
    });

    if (notification && 'error' in notification) {
      console.error("Erro ao enviar notificação:", notification.error);
    };

    revalidatePath("/dashboard/frends");
    return successResponse(friendRequest, "Solicitação de amizade enviada com sucesso");
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};