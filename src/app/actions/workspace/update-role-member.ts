"use server";

import prisma from "@/lib/prisma";
import { PermissionError, withAuth } from "@/lib/errors";
import { ValidationError } from "@/lib/errors";
import { successResponse } from "@/lib/errors/error-handler";
import { ERROR_MESSAGES } from "@/lib/errors";
import { UpadeteRoleMemberType, updateRoleMemberWorkspace } from "./workspace-schema";
import { validateWorkspacePermission } from "@/lib/db/validators";
import { revalidatePath } from "next/cache";

export const updateRoleMember = withAuth(
  async (userId, session, formData: UpadeteRoleMemberType) => {
    const schema = updateRoleMemberWorkspace.safeParse(formData);

    if (!schema.success) {
      throw new ValidationError(schema.error.issues[0].message);
    }

    if (formData.newRole === "OWNER") {
      throw new PermissionError(ERROR_MESSAGES.PERMISSION.OWNER_ONLY);
    }

    await validateWorkspacePermission(formData.workspaceId, userId, "ADMIN");

    await prisma.workspaceMember.update({
      where: {
        workspaceId_userId: {
          workspaceId: formData.workspaceId,
          userId: formData.memberId
        }
      },
      data: {
        role: formData.newRole
      }
    });

    formData.revalidatePaths?.forEach((path) => revalidatePath(path));
    const message = `Membro atualizado com sucesso`;

    return successResponse(message);
  },
  ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR
);
