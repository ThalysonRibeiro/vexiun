"use server"
import prisma from "@/lib/prisma";
import { z } from "zod";
import {
  ERROR_MESSAGES,
  NotFoundError,
  successResponse,
  ValidationError,
  withAuth
} from "@/lib/errors";
import { revalidatePath } from "next/cache";
import { createAndSendNotification } from "../notification";
import { notificationMessages } from "@/lib/notifications/messages";


const formSchema = z.object({
  title: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  invitationUsersId: z.array(z.string().cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID)).optional(),
  revalidatePaths: z.array(z.string()).optional(),
});

export type CreateWorkspaceType = z.infer<typeof formSchema>;

export const createWorkspace = withAuth(async (
  userId,
  session,
  formData: CreateWorkspaceType
) => {

  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    throw new ValidationError(schema.error.issues[0].message);
  };
  const newWorkspace = await prisma.$transaction(async (tx) => {

    const workspace = await tx.workspace.create({
      data: {
        userId,
        title: formData.title,
        members: {
          create: {
            userId,
            role: "OWNER",
          },
        },
      }
    });

    // Se há convites, processa tudo dentro da transação
    if (formData.invitationUsersId && formData.invitationUsersId.length > 0) {
      const existingUsers = await tx.user.findMany({
        where: { id: { in: formData.invitationUsersId } },
        select: { id: true }
      });

      if (existingUsers.length === 0) {
        throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.INVITATION);
      };

      // Cria os convites
      await tx.workspaceInvitation.createMany({
        data: existingUsers.map(user => ({
          workspaceId: workspace.id,
          userId: user.id,
          invitedBy: session?.user?.id as string,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        })),
        skipDuplicates: true,
      });
    };

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
        createAndSendNotification({
          userId: user.id,
          referenceId: newWorkspace.id,
          nameReference: session?.user?.name as string,
          image: session?.user?.image as string,
          message: notificationMessages.WORKSPACE_INVITE(session?.user?.name as string, newWorkspace.title),
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
    };
  };

  // Revalida os paths especificados
  if (formData.revalidatePaths && formData.revalidatePaths.length > 0) {
    formData.revalidatePaths.forEach(path => revalidatePath(path));
  } else {
    revalidatePath("/dashboard");
  };

  return successResponse(newWorkspace, "Workspace criado com sucesso");
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);

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
