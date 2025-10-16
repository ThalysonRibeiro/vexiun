"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { validateGroupExists } from "@/lib/db/validators";
import { ERROR_MESSAGES } from "@/lib/errors/messages";
import { ActionResponse, handleError, successResponse } from "@/lib/errors/error-handler";
import { AuthenticationError, ValidationError } from "@/lib/errors/custom-errors";

const formSchema = z.object({
  groupId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  title: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  textColor: z.string().min(4, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
});

export type UpdateGroupType = z.infer<typeof formSchema>;

export async function updateGroup(formData: UpdateGroupType): Promise<ActionResponse<string>> {
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

    const existingGroup = await validateGroupExists(formData.groupId);

    if (!existingGroup) {
      return {
        error: ERROR_MESSAGES.NOT_FOUND.GROUP
      }
    }

    await prisma.group.update({
      where: { id: formData.groupId },
      data: {
        title: formData.title,
        textColor: formData.textColor
      }
    });
    revalidatePath("/dashboard/Workspace");
    return successResponse("Grupo atualizado com sucesso");
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  }
}