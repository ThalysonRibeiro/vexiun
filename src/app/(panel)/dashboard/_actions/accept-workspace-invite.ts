"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { sendNotification } from "./create-notfication";

const formSchema = z.object({
  userId: z.string().min(1, "O id é obrigatório"),
  WorkspaceId: z.string().min(1, "O id é obrigatório"),
});

type FormSchema = z.infer<typeof formSchema>;

export async function acceptWorkspaceInvite(formData: FormSchema) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Falha ao aceitar convite" }
  }
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return { error: schema.error.issues[0].message }
  }
  try {
    const userExists = await prisma.user.findUnique({
      where: { id: formData.userId },
      select: { id: true }
    });
    if (!userExists) {
      return { error: "Usuário não encontrado" }
    }

    const invitationExists = await prisma.workspaceInvitation.findFirst({
      where: { workspaceId: formData.WorkspaceId, userId: formData.userId },
    });
    if (!invitationExists) {
      return { error: "Falha ao aceitar convite" }
    }
    const result = await prisma.workspaceMember.create({
      data: {
        workspaceId: formData.WorkspaceId,
        userId: formData.userId,
      },
      include: {
        workspace: {
          select: {
            title: true,
            userId: true
          }
        }
      }
    });
    await prisma.workspaceInvitation.delete({ where: { id: invitationExists.id } });

    await sendNotification({
      userId: result.workspace.userId,
      referenceId: formData.WorkspaceId,
      nameReference: session.user?.name as string,
      image: session.user?.image as string,
      message: `${session.user?.name} aceitou seu convite!`,
      type: "WORKSPACE_ACCEPTED",
    });
    revalidatePath("/dashboard");
    return { success: true }
  } catch (error) {
    return { error: "Falha ao aceitar convite" }
  }
}