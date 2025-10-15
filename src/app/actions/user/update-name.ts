"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";
import { ERROR_MESSAGES } from "@/utils/error-messages";
import { handleError } from "@/utils/error-handler";
import { validateUserExists } from "@/lib/db/validators";

const formSchema = z.object({
  userId: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  name: z.string()
    .min(3, ERROR_MESSAGES.VALIDATION.MIN_LENGTH)
    .max(100, ERROR_MESSAGES.VALIDATION.MAX_LENGTH),
});

export async function updateName(formData: z.infer<typeof formSchema>) {
  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }
  try {
    const existingUser = await validateUserExists(formData.userId);

    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        name: formData.name,
      }
    });
    revalidatePath("/dashboard/profile");
  } catch (error) {
    return handleError(ERROR_MESSAGES.GENERIC)
  }
}