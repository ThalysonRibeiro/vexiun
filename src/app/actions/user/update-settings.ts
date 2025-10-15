"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";
import { ERROR_MESSAGES } from "@/utils/error-messages";
import { validateUserExists } from "@/lib/db/validators";
import { handleError, successResponse } from "@/utils/error-handler";

const settingsFormSchema = z.object({
  userId: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  pushNotifications: z.boolean(),
  emailNotifications: z.boolean(),
  language: z.string(),
  timezone: z.string(),
});

export async function updateSettings(formData: z.infer<typeof settingsFormSchema>) {
  const schema = settingsFormSchema.safeParse(formData);
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    };
  };
  try {
    const existingUserSettings = await validateUserExists(formData.userId);

    await prisma.userSettings.update({
      where: { userId: existingUserSettings.id },
      data: {
        emailNotifications: formData.emailNotifications,
        pushNotifications: formData.pushNotifications,
        language: formData.language,
        timezone: formData.timezone
      }
    });
    revalidatePath("/dashboard/profile");
    return successResponse("Configurações atualizadas com sucesso");
  } catch (error) {
    return handleError(ERROR_MESSAGES.GENERIC);
  };
};