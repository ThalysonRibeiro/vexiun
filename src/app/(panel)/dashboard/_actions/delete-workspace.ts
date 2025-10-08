"use server"
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export async function deleteWorkspace(workspaceId: string) {
  const existingWorkspace = await prisma.workspace.findFirst({
    where: { id: workspaceId }
  });
  if (!existingWorkspace) {
    return {
      error: "Workspace não encontrada"
    }
  }
  try {
    await prisma.$transaction(async (tx) => {
      await tx.notification.deleteMany({
        where: { referenceId: existingWorkspace.id }
      });

      await tx.workspaceInvitation.deleteMany({
        where: { workspaceId: existingWorkspace.id }
      });

      await tx.workspace.delete({
        where: { id: existingWorkspace.id }
      });
    });

    revalidatePath("/dashboard");
    return {
      data: "Workspace deletada com sucesso!"
    };
  } catch (error) {
    return {
      error: "Falha ao deletar Workspace"
    }
  }
}