"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { sendNotification } from "./create-notfication";

const formSchema = z.object({
  workspaceId: z.string().min(1, "O id é obrigatório").cuid(),
  invitationUsersId: z.array(z.string().cuid()),
  revalidatePaths: z.array(z.string()).optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export async function sendInviteToWorkspace(formData: FormSchema) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Falha ao enviar convite" }
  }

  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return { error: schema.error.issues[0].message }
  }

  try {
    await prisma.$transaction(async (tx) => {
      const existingWorkspace = await tx.workspace.findUnique({
        where: { id: formData.workspaceId },
        select: { id: true, title: true }
      });

      if (!existingWorkspace) {
        throw new Error("Workspace não encontrado");
      }

      if (formData.invitationUsersId.length === 0) {
        return;
      }

      const existingUsers = await tx.user.findMany({
        where: { id: { in: formData.invitationUsersId } },
        select: { id: true }
      });

      if (existingUsers.length === 0) {
        return;
      }

      await tx.workspaceInvitation.createMany({
        data: existingUsers.map(user => ({
          workspaceId: formData.workspaceId,
          userId: user.id,
        })),
        skipDuplicates: true,
      });

      await Promise.all(
        existingUsers.map(user =>
          sendNotification({
            userId: user.id,
            referenceId: existingWorkspace.id,
            nameReference: session?.user?.name as string,
            image: session.user?.image as string,
            message: `Você foi convidado para a equipe: "${existingWorkspace.title}"`,
            type: "WORKSPACE_INVITE",
          })
        )
      );
    });

    if (formData.revalidatePaths && formData.revalidatePaths.length > 0) {
      formData.revalidatePaths.forEach(path => revalidatePath(path));
    }

    return { success: true, message: "Convites enviados com sucesso" };

  } catch (error) {
    console.error('Erro ao enviar convite:', error);
    return { error: error instanceof Error ? error.message : "Falha ao enviar convite" }
  }
}