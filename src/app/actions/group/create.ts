"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";
import { validateWorkspaceAccess } from "@/lib/db/validators";
import { auth } from "@/lib/auth";
import { ActionResponse, handleError, successResponse } from "@/lib/errors/error-handler";
import { ERROR_MESSAGES } from "@/lib/errors/messages";
import { AuthenticationError, ValidationError } from "@/lib/errors/custom-errors";
import { Group } from "@/generated/prisma";

const formSchema = z.object({
  workspaceId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  title: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  textColor: z.string().min(4, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
});
export type CreateGroupType = z.infer<typeof formSchema>;

export async function createGroup(formData: CreateGroupType): Promise<ActionResponse<Group | string>> {
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
    return handleError(error, ERROR_MESSAGES.GENERIC);
  }
}