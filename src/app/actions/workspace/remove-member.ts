"use server";

import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/errors";
import { ValidationError } from "@/lib/errors";
import { successResponse } from "@/lib/errors/error-handler";
import { ERROR_MESSAGES } from "@/lib/errors";
import { manageMemberWorkspaceSchema, RemoveMemberType } from "./workspace-schema";
import { revalidatePath } from "next/cache";
import { validateWorkspaceAccess, validateWorkspacePermission } from "@/lib/db/validators";

export const removeMember = withAuth(async (userId, session, formData: RemoveMemberType) => {
  const schema = manageMemberWorkspaceSchema.safeParse(formData);

  if (!schema.success) {
    throw new ValidationError(schema.error.issues[0].message);
  }

  await validateWorkspacePermission(formData.workspaceId, userId, "ADMIN");

  const member = await validateWorkspaceAccess(formData.workspaceId, formData.memberId);

  if (member.role === "OWNER") {
    throw new ValidationError(ERROR_MESSAGES.PERMISSION.OWNER_ONLY);
  }

  let itemsAffected = 0;

  await prisma.$transaction(async (tx) => {
    itemsAffected = await tx.item.count({
      where: {
        assignedTo: formData.memberId,
        group: {
          workspaceId: formData.workspaceId
        }
      }
    });

    if (itemsAffected > 0) {
      await tx.item.updateMany({
        where: {
          assignedTo: formData.memberId,
          group: {
            workspaceId: formData.workspaceId
          }
        },
        data: {
          assignedTo: null
        }
      });
    }

    await tx.workspaceInvitation.deleteMany({
      where: {
        workspaceId: formData.workspaceId,
        userId: formData.memberId
      }
    });

    await tx.workspaceMember.delete({
      where: {
        workspaceId_userId: {
          workspaceId: formData.workspaceId,
          userId: formData.memberId
        }
      }
    });
  });

  formData.revalidatePaths?.forEach((path) => revalidatePath(path));

  const message =
    itemsAffected > 0
      ? `Membro removido com sucesso. ${itemsAffected} item(s) foram desatribuídos.`
      : "Membro removido com sucesso";

  return successResponse(message);
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);
