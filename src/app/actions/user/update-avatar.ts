"use server"
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { handleError, successResponse } from "@/utils/error-handler";
import { ERROR_MESSAGES } from "@/utils/error-messages";
import { error } from "console";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const formSchema = z.object({
  avatarUrl: z.string().min(3, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
});

export async function updateAvatar(formData: z.infer<typeof formSchema>) {
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