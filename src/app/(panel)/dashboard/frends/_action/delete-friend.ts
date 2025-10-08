"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  friendshipId: z.string().min(1, "O id é obrigatório"),
});

type FormSchema = z.infer<typeof formSchema>;

export async function deleteFriendship(formData: FormSchema) {
  const session = await auth();
  if (!session?.user) {
    return {
      error: "Usuário não autenticado"
    };
  }
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }
  try {
    const friendship = await prisma.userFriend.findUnique({
      where: { id: formData.friendshipId },
    });
    if (!friendship) {
      return { error: "Amizade não encontrada" };
    }
    const userId = session.user.id;
    if (friendship.requesterId !== userId && friendship.addresseeId !== userId) {
      return { error: "Você não tem permissão para deletar essa amizade" };
    }

    await prisma.userFriend.delete({
      where: { id: formData.friendshipId },
    });

    revalidatePath("/dashboard/frends");
    return { success: true };
  } catch (error) {
    return {
      error: "Erro ao deletar amizade"
    };
  }
}