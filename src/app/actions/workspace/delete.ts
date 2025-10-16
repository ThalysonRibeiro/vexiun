"use server"
import { auth } from "@/lib/auth";
import { validateWorkspaceExists } from "@/lib/db/validators";
import { AuthenticationError, ValidationError } from "@/lib/errors/custom-errors";
import prisma from "@/lib/prisma";
import { ActionResponse, handleError, successResponse } from "@/lib/errors/error-handler";
import { ERROR_MESSAGES } from "@/lib/errors/messages";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const formSchema = z.object({
  workspaceId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
});

export type DeleteWorkspaceType = z.infer<typeof formSchema>;


export async function deleteWorkspace(formData: DeleteWorkspaceType): Promise<ActionResponse<string>> {
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
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};