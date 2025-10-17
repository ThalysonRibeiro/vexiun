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
import { validateGroupExists } from "@/lib/db/validators";

const formSchema = z.object({
  groupId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  title: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  textColor: z.string().min(4, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
});

export type UpdateGroupType = z.infer<typeof formSchema>;

export const updateGroup = withAuth(async (
  userId,
  session,
  formData: UpdateGroupType): Promise<ActionResponse<string>> => {

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
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);