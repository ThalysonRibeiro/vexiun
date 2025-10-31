"use server";
import prisma from "@/lib/prisma";
import {
  ActionResponse,
  ERROR_MESSAGES,
  successResponse,
  ValidationError,
  withAuth
} from "@/lib/errors";
import { revalidatePath } from "next/cache";
import { validateWorkspaceExists, validateWorkspacePermission } from "@/lib/db/validators";
import { updateWorkspaceSchema, UpdateWorkspaceType } from "./workspace-schema";

export const updateWorkspace = withAuth(
  async (userId, session, formData: UpdateWorkspaceType): Promise<ActionResponse<string>> => {
    const schema = updateWorkspaceSchema.safeParse(formData);
    if (!schema.success) {
      throw new ValidationError(schema.error.issues[0].message);
    }
    const existingWorkspace = await validateWorkspaceExists(formData.workspaceId);

    await validateWorkspacePermission(formData.workspaceId, userId, "ADMIN");

    await prisma.workspace.update({
      where: { id: existingWorkspace.id },
      data: {
        title: formData.title,
        description: formData.description,
        categories: formData.categories
      }
    });

    if (formData.revalidatePaths?.length) {
      formData.revalidatePaths.forEach((path) => revalidatePath(path));
    }
    revalidatePath("/dashboard");
    return successResponse("Workspace atualizada com sucesso!");
  },
  ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR
);
