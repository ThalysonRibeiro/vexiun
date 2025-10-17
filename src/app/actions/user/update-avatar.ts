"use server"
import prisma from "@/lib/prisma";
import { z } from "zod";
import {
  ActionResponse, ERROR_MESSAGES, successResponse,
  ValidationError,
  withAuth
} from "@/lib/errors";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  avatarUrl: z.string().min(3, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .url(ERROR_MESSAGES.VALIDATION.INVALID_FORMAT),
});

export type UpdateAvatarType = z.infer<typeof formSchema>;

export const updateAvatar = withAuth(async (
  userId,
  session,
  formData: UpdateAvatarType
): Promise<ActionResponse<string>> => {

  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    throw new ValidationError(schema.error.issues[0].message);
  };

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      image: formData.avatarUrl,
    }
  });

  revalidatePath("/dashboard/profile");

  return successResponse("Imagem alterada com sucesso!");
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);