"use server"
import { auth } from "@/lib/auth";
import { AuthenticationError, ValidationError } from "@/lib/errors";
import prisma from "@/lib/prisma";
import { ActionResponse, handleError, successResponse } from "@/utils/error-handler";
import { ERROR_MESSAGES } from "@/utils/error-messages";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const formSchema = z.object({
  avatarUrl: z.string().min(3, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .url(ERROR_MESSAGES.VALIDATION.INVALID_FORMAT),
});

export type UpdateAvatarType = z.infer<typeof formSchema>;

export async function updateAvatar(formData: UpdateAvatarType): Promise<ActionResponse<string>> {
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
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};