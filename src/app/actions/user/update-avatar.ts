"use server";
import prisma from "@/lib/prisma";
import {
  ActionResponse,
  ERROR_MESSAGES,
  successResponse,
  ValidationError,
  withAuth
} from "@/lib/errors";
import { revalidatePath } from "next/cache";
import { avatarSchema, UpdateAvatarType } from "./user-schema";

export const updateAvatar = withAuth(
  async (userId, session, formData: UpdateAvatarType): Promise<ActionResponse<string>> => {
    const schema = avatarSchema.safeParse(formData);
    if (!schema.success) {
      throw new ValidationError(schema.error.issues[0].message);
    }

    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        image: formData.avatarUrl
      }
    });

    if (formData.revalidatePaths?.length) {
      formData.revalidatePaths.forEach((path) => revalidatePath(path));
    }

    return successResponse("Imagem alterada com sucesso!");
  },
  ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR
);
