"use server";
import prisma from "@/lib/prisma";
import { PermissionError, ValidationError, withAuth } from "@/lib/errors";
import { successResponse } from "@/lib/errors/error-handler";
import { ERROR_MESSAGES } from "@/lib/errors";
import { revalidatePath } from "next/cache";
import { EntityStatus } from "@/generated/prisma";
import {
  validateWorkspaceExists,
  validateWorkspacePermission
} from "@/lib/db/validators";
import { ChangeStatusInput, changeWorkspaceStatusSchema } from "./workspace-schema";

export const changeWorkspaceStatus = withAuth(
  async (userId, session, formData: ChangeStatusInput) => {
    // ✅ 1. Valida input
    const result = changeWorkspaceStatusSchema.safeParse(formData);
    if (!result.success) {
      throw new ValidationError(result.error.issues[0].message);
    }

    // ✅ 2. Verifica se workspace existe
    const workspace = await validateWorkspaceExists(formData.workspaceId);

    // ✅ 3. Valida permissão do usuário
    const permission = await validateWorkspacePermission(
      formData.workspaceId,
      userId,
      "ADMIN" // Mínimo ADMIN para mudar status
    );

    // ✅ 4. Regras de negócio por status e role
    const { role } = permission;
    const { status: currentStatus, userId: ownerId } = workspace;

    // DELETED só pode ser alterado pelo OWNER
    if (currentStatus === "DELETED" && role !== "OWNER") {
      throw new PermissionError(
        "Apenas o proprietário pode restaurar workspaces deletadas"
      );
    }

    // Só OWNER e ADMIN podem arquivar/deletar
    if (["MEMBER", "VIEWER"].includes(role) && formData.newStatus !== "ACTIVE") {
      throw new PermissionError(
        "Você não tem permissão para arquivar ou deletar esta workspace"
      );
    }

    // Só OWNER pode deletar permanentemente (se implementar)
    if (formData.newStatus === "DELETED" && role !== "OWNER") {
      throw new PermissionError(
        "Apenas o proprietário pode mover para lixeira"
      );
    }

    // ✅ 5. Atualiza workspace e conteúdo em cascata
    await prisma.$transaction(async (tx) => {
      // Atualiza workspace
      await tx.workspace.update({
        where: { id: formData.workspaceId },
        data: {
          status: formData.newStatus,
          statusChangedAt: new Date(),
          statusChangedBy: userId
        }
      });

      // Atualiza grupos
      await tx.group.updateMany({
        where: { workspaceId: formData.workspaceId },
        data: { status: formData.newStatus }
      });

      // Atualiza items
      const groups = await tx.group.findMany({
        where: { workspaceId: formData.workspaceId },
        select: { id: true }
      });

      if (groups.length > 0) {
        await tx.item.updateMany({
          where: {
            groupId: { in: groups.map(g => g.id) }
          },
          data: { entityStatus: formData.newStatus }
        });
      }
    });

    if (formData.revalidatePaths?.length) {
      formData.revalidatePaths.forEach((path) => revalidatePath(path));
    }
    // ✅ 6. Revalidação de cache
    revalidatePath("/dashboard/workspaces");
    revalidatePath(`/dashboard/workspace/${formData.workspaceId}`);

    // ✅ 7. Mensagem de sucesso
    const messages: Record<EntityStatus, string> = {
      ARCHIVED: "Workspace arquivada com sucesso",
      ACTIVE: "Workspace restaurada com sucesso",
      DELETED: "Workspace movida para lixeira"
    };

    return successResponse(
      { workspaceId: formData.workspaceId, status: formData.newStatus },
      messages[formData.newStatus]
    );
  },
  ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR
);