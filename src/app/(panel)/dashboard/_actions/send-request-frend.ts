"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { auth } from "@/lib/auth";
import { sendNotification } from "./create-notfication";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  addresseeId: z.string().min(1, "O id é obrigatório"),
});

type FormSchema = z.infer<typeof formSchema>;

export async function sendFriendRequest(formData: FormSchema) {
  const session = await auth();
  if (!session?.user) {
    return {
      error: "Falha ao enviar solicitação de amizade"
    }
  }

  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }

  try {
    if (session.user.id === formData.addresseeId) {
      return {
        error: "Você não pode enviar solicitação de amizade para si mesmo"
      }
    }


    const existsAddressee = await findUserById(formData.addresseeId);
    if (!existsAddressee) {
      return {
        error: `usuário não encontrado`
      }
    }

    const existingRequest = await prisma.userFriend.findFirst({
      where: {
        OR: [
          { requesterId: session.user.id, addresseeId: formData.addresseeId },
          { requesterId: formData.addresseeId, addresseeId: session.user.id }
        ]
      }
    });

    if (existingRequest) {
      if (existingRequest.requesterId === session.user.id) {
        return { error: "Você já enviou uma solicitação para esse usuário" };
      }
      if (existingRequest.addresseeId === session.user.id) {
        return { error: "Esse usuário já enviou uma solicitação para você" };
      }

      // fallback de segurança (não deveria cair aqui, mas evita undefined)
      return { error: "Solicitação de amizade já existe" };
    }


    const friendRequest = await prisma.userFriend.create({
      data: {
        requesterId: session.user.id!,
        addresseeId: formData.addresseeId
      }
    });

    const notification = await sendNotification({
      userId: formData.addresseeId,
      referenceId: session.user.id!,
      message: "Você recebeu uma solicitação de amizade",
      type: "FRIEND_REQUEST",
    });

    if (notification && 'error' in notification) {
      console.error("Erro ao enviar notificação:", notification.error);
    }

    revalidatePath("/dashboard/frends");
    return {
      success: true,
      data: friendRequest
    }

  } catch (error) {
    console.error("Erro ao enviar solicitação:", error);
    return {
      error: "Falha ao enviar solicitação de amizade"
    }
  }
}

async function findUserById(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true }
  });
}