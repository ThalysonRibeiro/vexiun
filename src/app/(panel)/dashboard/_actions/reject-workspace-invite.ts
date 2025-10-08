"use server"
import prisma from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@/lib/auth";

const formSchema = z.object({
  WorkspaceId: z.string().min(1, "O id é obrigatório"),
});

type FormSchema = z.infer<typeof formSchema>;

export async function rejectWorkspaceInvite(formData: FormSchema) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Falha ao rejeitar convite" }
  }
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return { error: schema.error.issues[0].message }
  }

  try {
    const invitationExists = await prisma.workspaceInvitation.findFirst({
      where: { workspaceId: formData.WorkspaceId, userId },
    });
    if (!invitationExists) {
      return { error: "Falha ao rejeitar convite" }
    }
    await prisma.workspaceInvitation.delete({ where: { id: invitationExists.id } });

    return { success: true }
  } catch (error) {
    return { error: "Falha ao rejeitar convite" }
  }

}