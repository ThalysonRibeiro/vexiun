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
  title: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
});

export type UpdateWorkspaceType = z.infer<typeof formSchema>;

export const updateWorkspace = withAuth(async (
  userId,
  session,
  formData: UpdateWorkspaceType
): Promise<ActionResponse<string>> => {
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    throw new ValidationError(schema.error.issues[0].message);
  };
  const existingWorkspace = await validateWorkspaceExists(formData.workspaceId);
  await prisma.workspace.update({
    where: { id: existingWorkspace.id },
    data: { title: formData.title }
  });
  revalidatePath("/dashboard");
  return successResponse("Workspace atualizada com sucesso!");
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);