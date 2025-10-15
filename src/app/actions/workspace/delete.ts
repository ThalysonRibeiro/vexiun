"use server"
import { auth } from "@/lib/auth";
import { validateWorkspaceExists } from "@/lib/db/validators";
import prisma from "@/lib/prisma";
import { handleError, successResponse } from "@/utils/error-handler";
import { ERROR_MESSAGES } from "@/utils/error-messages";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const formSchema = z.object({
  workspaceId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
});

export async function deleteWorkspace(formData: z.infer<typeof formSchema>) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: ERROR_MESSAGES.AUTH.NOT_AUTHENTICATED };
  };
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return { error: schema.error.issues[0].message };
  };

  try {
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