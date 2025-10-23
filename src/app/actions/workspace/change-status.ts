"use server";

import prisma from "@/lib/prisma";
import { NotFoundError, PermissionError, ValidationError, withAuth } from "@/lib/errors";
import { successResponse } from "@/lib/errors/error-handler";
import { ERROR_MESSAGES } from "@/lib/errors";
import { revalidatePath } from "next/cache";
import { EntityStatus } from "@/generated/prisma";
import {
  validateWorkspaceExists,
  validateWorkspacePermission
} from "@/lib/db/validators";
import { z } from "zod";

const schema = z.object({
  workspaceId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  newStatus: z.enum([
    EntityStatus.ARCHIVED,
    EntityStatus.ACTIVE,
    EntityStatus.DELETED
  ]),
});

type ChangeStatusInput = z.infer<typeof schema>;

export const changeWorkspaceStatus = withAuth(
  async (userId, session, data: ChangeStatusInput) => {
    // ✅ 1. Valida input
    const result = schema.safeParse(data);
    if (!result.success) {
      throw new ValidationError(result.error.issues[0].message);
    }

    // ✅ 2. Verifica se workspace existe
    const workspace = await validateWorkspaceExists(data.workspaceId);

    // ✅ 3. Valida permissão do usuário
    const permission = await validateWorkspacePermission(
      data.workspaceId,
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
    if (["MEMBER", "VIEWER"].includes(role) && data.newStatus !== "ACTIVE") {
      throw new PermissionError(
        "Você não tem permissão para arquivar ou deletar esta workspace"
      );
    }

    // Só OWNER pode deletar permanentemente (se implementar)
    if (data.newStatus === "DELETED" && role !== "OWNER") {
      throw new PermissionError(
        "Apenas o proprietário pode mover para lixeira"
      );
    }

    // ✅ 5. Atualiza workspace e conteúdo em cascata
    await prisma.$transaction(async (tx) => {
      // Atualiza workspace
      await tx.workspace.update({
        where: { id: data.workspaceId },
        data: {
          status: data.newStatus,
          statusChangedAt: new Date(),
          statusChangedBy: userId
        }
      });

      // Atualiza grupos
      await tx.group.updateMany({
        where: { workspaceId: data.workspaceId },
        data: { status: data.newStatus }
      });

      // Atualiza items
      const groups = await tx.group.findMany({
        where: { workspaceId: data.workspaceId },
        select: { id: true }
      });

      if (groups.length > 0) {
        await tx.item.updateMany({
          where: {
            groupId: { in: groups.map(g => g.id) }
          },
          data: { entityStatus: data.newStatus }
        });
      }
    });

    // ✅ 6. Revalidação de cache
    revalidatePath("/dashboard/workspaces");
    revalidatePath(`/dashboard/workspace/${data.workspaceId}`);

    // ✅ 7. Mensagem de sucesso
    const messages: Record<EntityStatus, string> = {
      ARCHIVED: "Workspace arquivada com sucesso",
      ACTIVE: "Workspace restaurada com sucesso",
      DELETED: "Workspace movida para lixeira"
    };

    return successResponse(
      { workspaceId: data.workspaceId, status: data.newStatus },
      messages[data.newStatus]
    );
  },
  ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR
);