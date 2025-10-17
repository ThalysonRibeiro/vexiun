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
import { NotificationType } from "@/generated/prisma";

const broadcastSchema = z.object({
  message: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  type: z.enum(["SISTEM_MESSAGE", "NOTICES_MESSAGE"]),
  referenceId: z.string().cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID).optional(),
});

export type BroadcastNotificationType = z.infer<typeof broadcastSchema>;

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