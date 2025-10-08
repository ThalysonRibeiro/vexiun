"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { sendNotification } from "./create-notfication";

const formSchema = z.object({
  title: z.string().min(1, "O titulo é obrigatório"),
  invitationUsersId: z.array(z.string().cuid()).optional(),
  revalidatePaths: z.array(z.string()).optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export async function createWorkspace(formData: FormSchema) {
  const session = await auth();
  const userId = session?.user?.id;

  // Validações ANTES da transação
  if (!userId) {
    return { error: "Falha ao cadastrar Workspace" }
  }

  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return { error: schema.error.issues[0].message }
  }

  try {
    const newWorkspace = await prisma.$transaction(async (tx) => {
      // Cria o Workspace
      const workspace = await tx.workspace.create({
        data: {
          userId,
          title: formData.title,
        }
      });

      // Se há convites, processa tudo dentro da transação
      if (formData.invitationUsersId && formData.invitationUsersId.length > 0) {
        const existingUsers = await tx.user.findMany({
          where: { id: { in: formData.invitationUsersId } },
          select: { id: true }
        });

        if (existingUsers.length === 0) {
          throw new Error("Nenhum usuário encontrado para convite");
        }

        // Cria os convites
        await tx.workspaceInvitation.createMany({
          data: existingUsers.map(user => ({
            workspaceId: workspace.id,
            userId: user.id,
          })),
          skipDuplicates: true,
        });
      }

      return workspace;
    });

    // Envia notificações APÓS a transação ser commitada
    if (formData.invitationUsersId && formData.invitationUsersId.length > 0) {
      const existingUsers = await prisma.user.findMany({
        where: { id: { in: formData.invitationUsersId } },
        select: { id: true }
      });

      const notificationResults = await Promise.allSettled(
        existingUsers.map(user =>
          sendNotification({
            userId: user.id,
            referenceId: newWorkspace.id,
            nameReference: session?.user?.name as string,
            image: session.user?.image as string,
            message: `Você foi convidado para a equipe: "${newWorkspace.title}"`,
            type: "WORKSPACE_INVITE",
          })
        )
      );

      const failedNotifications = notificationResults.filter(
        result => result.status === 'rejected'
      );

      if (failedNotifications.length > 0) {
        console.error(`${failedNotifications.length} notificação(ões) falharam:`);
        failedNotifications.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.error(`Notificação ${index + 1}:`, result.reason);
          }
        });
      }
    }

    // Revalida os paths especificados
    if (formData.revalidatePaths && formData.revalidatePaths.length > 0) {
      formData.revalidatePaths.forEach(path => revalidatePath(path));
    } else {
      // Fallback para o path padrão
      revalidatePath("/dashboard");
    }

    return { success: true, newWorkspace };

  } catch (error) {
    console.error("Erro ao criar Workspace:", error);
    return {
      error: error instanceof Error ? error.message : "Falha ao cadastrar Workspace"
    }
  }
}

// import { prisma } from "@/lib/prisma";
// import { sendEmail } from "@/lib/transporter";

// export async function inviteUserToWorkspace(WorkspaceId: string, userId: string) {
//   // 1️⃣ Criar convite
//   const invitation = await prisma.WorkspaceInvitation.create({
//     data: { WorkspaceId, userId },
//   });

//   // 2️⃣ Criar notificação
//   await prisma.notification.create({
//     data: {
//       userId,
//       type: "INVITE",
//       message: `Você foi convidado para o projeto "${WorkspaceId}"`,
//       referenceId: invitation.id,
//     },
//   });

//   // 3️⃣ Enviar e-mail
//   const acceptLink = `https://seusite.com/signin?callbackUrl=/invitations/accept?invitationId=${invitation.id}`;
//   const emailBody = `
//     <p>Você foi convidado para o projeto.</p>
//     <p><a href="${acceptLink}">Clique aqui para aceitar o convite</a></p>
//   `;

//   await sendEmail({
//     to: (await prisma.user.findUnique({ where: { id: userId } }))?.email!,
//     subject: "Convite para projeto",
//     html: emailBody,
//   });

//   return invitation;
// }

// import { prisma } from "@/lib/prisma";
// import { auth } from "@/auth";

// export default async function handler(req, res) {
//   const session = await auth(req);
//   if (!session?.user?.id) return res.status(401).json({ error: "Não autenticado" });

//   const { invitationId, action } = req.body;

//   const invitation = await prisma.WorkspaceInvitation.findUnique({ where: { id: invitationId } });
//   if (!invitation || invitation.userId !== session.user.id) {
//     return res.status(404).json({ error: "Convite não encontrado" });
//   }

//   if (action === "ACCEPT") {
//     await prisma.WorkspaceMember.create({
//       data: { WorkspaceId: invitation.WorkspaceId, userId: session.user.id },
//     });
//     await prisma.WorkspaceInvitation.update({ where: { id: invitationId }, data: { status: "ACCEPTED" } });
//   } else if (action === "REJECT") {
//     await prisma.WorkspaceInvitation.update({ where: { id: invitationId }, data: { status: "REJECTED" } });
//   }

//   res.status(200).json({ success: true });
// }
