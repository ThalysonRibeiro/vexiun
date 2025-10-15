"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { auth } from "@/lib/auth";
import { NotificationType } from "@/generated/prisma";
import { handleError, successResponse } from "@/utils/error-handler";
import { ERROR_MESSAGES } from "@/utils/error-messages";

const broadcastSchema = z.object({
  message: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  type: z.enum(["SISTEM_MESSAGE", "NOTICES_MESSAGE"]),
  referenceId: z.string().optional(),
});

export async function sendBroadcastNotification(
  formData: z.infer<typeof broadcastSchema>
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: ERROR_MESSAGES.AUTH.NOT_AUTHENTICATED };
  };
  const schema = broadcastSchema.safeParse(formData);
  if (!schema.success) {
    return { error: schema.error.issues[0].message };
  };

  try {
    const result = await sendNotificationAllUsers({
      type: formData.type,
      message: formData.message,
      referenceId: formData.referenceId
    });
    return successResponse(result, "Notificação enviada com sucesso");
  } catch (error) {
    console.error("Erro ao enviar broadcast:", error);
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};

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