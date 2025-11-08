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
import { validateUserExists } from "@/lib/db/validators";
import { settingsSchema, UpdateSettingsType } from "./user-schema";

export const updateSettings = withAuth(
  async (userId, session, formData: UpdateSettingsType): Promise<ActionResponse<string>> => {
    const schema = settingsSchema.safeParse(formData);
    if (!schema.success) {
      throw new ValidationError(schema.error.issues[0].message);
    }

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

    if (formData.revalidatePaths?.length) {
      formData.revalidatePaths.forEach((path) => revalidatePath(path));
    }
    return successResponse("Configurações atualizadas com sucesso");
  },
  ERROR_MESSAGES.GENERIC.SERVER_ERROR
);
