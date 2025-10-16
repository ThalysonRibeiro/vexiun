"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";
import { ERROR_MESSAGES } from "@/utils/error-messages";
import { validateUserExists } from "@/lib/db/validators";
import { ActionResponse, handleError, successResponse } from "@/utils/error-handler";
import { auth } from "@/lib/auth";
import { AuthenticationError, ValidationError } from "@/lib/errors";

const settingsFormSchema = z.object({
  userId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  pushNotifications: z.boolean(),
  emailNotifications: z.boolean(),
  language: z.string(),
  timezone: z.string(),
});

export type UpdateSettingsType = z.infer<typeof settingsFormSchema>;

export async function updateSettings(formData: UpdateSettingsType): Promise<ActionResponse<string>> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new AuthenticationError();
    }
    const schema = settingsFormSchema.safeParse(formData);
    if (!schema.success) {
      throw new ValidationError(schema.error.issues[0].message);
    };

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