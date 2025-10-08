"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  requestId: z.string().min(1, "O id é obrigatório"),
});

type FormSchema = z.infer<typeof formSchema>;

export async function rejectFriendRequest(formData: FormSchema) {
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

  const request = await prisma.userFriend.findFirst({
    where: { addresseeId: formData.requestId },
    select: { id: true, addresseeId: true, requesterId: true }
  });

  if (!request) {
    return {
      error: "Solicitação não encontrada"
    }
  }
  if (request.addresseeId !== session.user.id) {
    return {
      error: "Não autorizado"
    }
  }

  const updated = await prisma.userFriend.delete({
    where: { id: request.id }
  });
  revalidatePath("/dashboard/frends");
  return { success: true, data: updated };
}