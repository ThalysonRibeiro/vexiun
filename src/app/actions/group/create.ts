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
import { Group } from "@/generated/prisma";
import { validateWorkspaceAccess } from "@/lib/db/validators";


const formSchema = z.object({
  workspaceId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  title: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  textColor: z.string().min(4, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
});
export type CreateGroupType = z.infer<typeof formSchema>;

export const createGroup = withAuth(async (
  userId,
  session,
  formData: CreateGroupType): Promise<ActionResponse<Group | string>> => {

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
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);