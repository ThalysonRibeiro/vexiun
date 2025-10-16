"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { validateWorkspaceExists } from "@/lib/db/validators";
import { ActionResponse, handleError, successResponse } from "@/lib/errors/error-handler";
import { ERROR_MESSAGES } from "@/lib/errors/messages";
import { AuthenticationError, ValidationError } from "@/lib/errors/custom-errors";

const formSchema = z.object({
  workspaceId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  title: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
});

export type UpdateWorkspaceType = z.infer<typeof formSchema>;

export async function updateWorkspace(formData: UpdateWorkspaceType): Promise<ActionResponse<string>> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new AuthenticationError();
    }
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
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};