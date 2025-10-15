"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { validateWorkspaceExists } from "@/lib/db/validators";
import { handleError, successResponse } from "@/utils/error-handler";
import { ERROR_MESSAGES } from "@/utils/error-messages";

const formSchema = z.object({
  workspaceId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  title: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
});

export async function updateWorkspace(formData: z.infer<typeof formSchema>) {
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