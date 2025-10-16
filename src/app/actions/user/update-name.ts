"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";
import { ERROR_MESSAGES } from "@/utils/error-messages";
import { ActionResponse, handleError, successResponse } from "@/utils/error-handler";
import { validateUserExists } from "@/lib/db/validators";
import { auth } from "@/lib/auth";
import { AuthenticationError, ValidationError } from "@/lib/errors";

const formSchema = z.object({
  userId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  name: z.string()
    .min(3, ERROR_MESSAGES.VALIDATION.MIN_LENGTH)
    .max(100, ERROR_MESSAGES.VALIDATION.MAX_LENGTH),
});

export type UpdateNameType = z.infer<typeof formSchema>;

export async function updateName(formData: UpdateNameType): Promise<ActionResponse<string>> {
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
    await validateUserExists(formData.userId);

    await prisma.user.update({
      where: { id: formData.userId },
      data: {
        name: formData.name,
      }
    });
    revalidatePath("/dashboard/profile");
    return successResponse("Nome atualizado com sucesso")
  } catch (error) {
    return handleError(ERROR_MESSAGES.GENERIC)
  }
}