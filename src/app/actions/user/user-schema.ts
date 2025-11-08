import { ERROR_MESSAGES } from "@/lib/errors";
import { z } from "zod";

export const nameFormSchema = z.object({
  name: z
    .string()
    .min(3, ERROR_MESSAGES.VALIDATION.MIN_LENGTH)
    .max(100, ERROR_MESSAGES.VALIDATION.MAX_LENGTH)
});

export const settingsFormSchema = z.object({
  pushNotifications: z.boolean(),
  emailNotifications: z.boolean(),
  language: z.string(),
  timezone: z.string()
});

export const userSchema = z.object({
  userId: z
    .string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  revalidatePaths: z.array(z.string()).optional()
});

export const updateNameSchema = userSchema.extend({
  name: z
    .string()
    .min(3, ERROR_MESSAGES.VALIDATION.MIN_LENGTH)
    .max(100, ERROR_MESSAGES.VALIDATION.MAX_LENGTH)
});

export const avatarSchema = z.object({
  avatarUrl: z
    .string()
    .min(3, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .url(ERROR_MESSAGES.VALIDATION.INVALID_FORMAT),
  revalidatePaths: z.array(z.string()).optional()
});

export const settingsSchema = userSchema.merge(settingsFormSchema);

export type NameFormData = z.infer<typeof nameFormSchema>;
export type UpdateNameType = z.infer<typeof updateNameSchema>;
export type SettingsFormData = z.infer<typeof settingsFormSchema>;
export type UpdateAvatarType = z.infer<typeof avatarSchema>;
export type UpdateSettingsType = z.infer<typeof settingsSchema>;
