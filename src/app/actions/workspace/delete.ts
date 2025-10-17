"use server"
import prisma from "@/lib/prisma";
import { z } from "zod";
import {
  ActionResponse,
  ERROR_MESSAGES,
  successResponse,
  ValidationError,
  withAuth
} from "@/lib/errors";
import { revalidatePath } from "next/cache";
import { validateWorkspaceExists } from "@/lib/db/validators";

const formSchema = z.object({
  workspaceId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
});

export type DeleteWorkspaceType = z.infer<typeof formSchema>;

export const deleteWorkspace = withAuth(async (
  userId,
  session,
  formData: DeleteWorkspaceType
): Promise<ActionResponse<string>> => {
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    throw new ValidationError(schema.error.issues[0].message);
  };

  const existingWorkspace = await validateWorkspaceExists(formData.workspaceId);

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
  return successResponse("Workspace deletada com sucesso!");
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);