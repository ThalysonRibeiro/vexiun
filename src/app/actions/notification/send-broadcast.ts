"use server"
import prisma from "@/lib/prisma";
import {
  ActionResponse,
  ERROR_MESSAGES,
  successResponse,
  ValidationError,
  withAuth
} from "@/lib/errors";
import { NotificationType } from "@/generated/prisma";
import { BroadcastNotificationType, broadcastSchema } from "./notification-schema";
import { revalidatePath } from "next/cache";

export const sendBroadcastNotification = withAuth(async (
  userId,
  session,
  formData: BroadcastNotificationType
): Promise<ActionResponse<{
  success: boolean;
  totalSend: number;
} | string>> => {

  const schema = broadcastSchema.safeParse(formData);
  if (!schema.success) {
    throw new ValidationError(schema.error.issues[0].message);
  };
  const result = await sendNotificationAllUsers({
    type: formData.type,
    message: formData.message,
    referenceId: formData.referenceId
  });
  revalidatePath("/dashboard");
  return successResponse(result, "Notificação enviada com sucesso");

}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);

async function sendNotificationAllUsers({
  type, message, referenceId
}: {
  type: NotificationType;
  message: string;
  referenceId?: string;
}) {
  const users = await prisma.user.findMany({
    select: { id: true }
  });

  const result = await prisma.notification.createMany({
    data: users.map(user => ({
      userId: user.id,
      type,
      message,
      referenceId: referenceId || null,
    })),
    skipDuplicates: true,
  });

  return {
    success: true,
    totalSend: result.count,
  };
};


//  const handleSendAllUsers = async () => {
//     const result = await sendBroadcastNotification({
//       message: "Manutenção programada para amanhã às 22h",
//       type: "SISTEM_MESSAGE",
//     });

//     if ('error' in result) {
//       toast.error(result.error);
//     } else {
//       toast.success(`Enviado para ${result.totalSend} usuários`);
//     }
//   };