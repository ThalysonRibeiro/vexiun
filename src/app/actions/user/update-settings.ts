"use server"
import prisma from "@/lib/prisma";
import { z } from "zod";
import {
  ActionResponse, ERROR_MESSAGES, successResponse,
  ValidationError,
  withAuth
} from "@/lib/errors";
import { revalidatePath } from "next/cache";
import { validateUserExists } from "@/lib/db/validators";

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

export const updateSettings = withAuth(async (
  userId,
  session,
  formData: UpdateSettingsType
): Promise<ActionResponse<string>> => {

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

}, ERROR_MESSAGES.GENERIC.SERVER_ERROR);