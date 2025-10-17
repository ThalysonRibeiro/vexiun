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

const formSchema = z.object({
  groupId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
});

export type DeleteGroupType = z.infer<typeof formSchema>;

export const deleteGroup = withAuth(async (
  userId,
  session,
  formData: DeleteGroupType): Promise<ActionResponse<string>> => {

  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    throw new ValidationError(schema.error.issues[0].message);
  };
  await prisma.group.delete({
    where: {
      id: formData.groupId,
    }
  });
  revalidatePath("/dashboard/Workspace");
  return successResponse("Grupo deletado com sucesso");
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);