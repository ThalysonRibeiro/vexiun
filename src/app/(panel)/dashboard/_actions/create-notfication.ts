"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { auth } from "@/lib/auth";
import { NotificationType } from "@/generated/prisma";

const formSchema = z.object({
  image: z.string().optional(),
  nameReference: z.string().optional(),
  userId: z.string().min(1, "O id é obrigatório"),
  referenceId: z.string().min(1, "O id é obrigatório"),
  message: z.string().min(1, "A mensagem é obrigatória"),
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

type FormSchema = z.infer<typeof formSchema>;

export async function sendNotification(formData: FormSchema) {
  const session = await auth();
  if (!session?.user) {
    return {
      error: "Falha ao cadastrar notificação"
    }
  }

  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }

  try {
    const userExists = await existingUser(formData.userId);
    if (!userExists) {
      return {
        error: "Usuário não encontrado"
      }
    }

    switch (formData.type) {
      case "CHAT_MESSAGE":
      case "FRIEND_REQUEST":
      case "FRIEND_ACCEPTED":
        const userReferenceExists = await existingUser(formData.referenceId);
        if (!userReferenceExists) {
          return {
            error: "Usuário de referência não encontrado"
          }
        }
        return await createNotification({
          ...formData,
          image: userReferenceExists.image ?? undefined,
          nameReference: userReferenceExists.name ?? undefined,
        });

      case "WORKSPACE_INVITE":
      case "WORKSPACE_ACCEPTED":
        const existingWorkspace = await prisma.workspace.findUnique({
          where: { id: formData.referenceId }
        });

        if (!existingWorkspace) {
          return { error: "Workspace não encontrado" }
        }
        return await createNotification(formData);

      case "ITEM_ASSIGNED":
      case "ITEM_COMPLETED":
        const existingItem = await prisma.item.findUnique({
          where: { id: formData.referenceId }
        });
        if (!existingItem) {
          return { error: "Item não encontrado" }
        }
        return await createNotification(formData);

      default:
        return { error: "Tipo de notificação inválido" }
    }
  } catch (error) {
    console.error(error);
    return {
      error: "Falha ao cadastrar notificação"
    }
  }
}

async function createNotification(formData: FormSchema) {
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
}

async function existingUser(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: { image: true, name: true }
  });
}