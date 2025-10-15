"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";
import { validateWorkspaceAccess } from "@/lib/db/validators";
import { auth } from "@/lib/auth";
import { handleError, successResponse } from "@/utils/error-handler";
import { ERROR_MESSAGES } from "@/utils/error-messages";

const formSchema = z.object({
  workspaceId: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  title: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  textColor: z.string().min(4, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
});

export async function createGroup(formData: z.infer<typeof formSchema>) {
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
    await validateWorkspaceAccess(formData.workspaceId, session?.user?.id as string)
    const newGroup = await prisma.group.create({
      data: {
        workspaceId: formData.workspaceId,
        title: formData.title,
        textColor: formData.textColor,
      }
    });
    revalidatePath("/dashboard/workspace");
    return successResponse(newGroup, "Grupo criado com sucesso")
  } catch (error) {
    console.log(error);
    return handleError(error, ERROR_MESSAGES.GENERIC);
  }
}