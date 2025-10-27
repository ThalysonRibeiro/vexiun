import { NotificationType } from "@/generated/prisma";
import { ERROR_MESSAGES } from "@/lib/errors";
import { z } from "zod";

export const notificationFormSchema = z.object({
  image: z.string().optional(),
  nameReference: z.string().optional(),
  userId: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  referenceId: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  message: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  type: z.enum([
    NotificationType.WORKSPACE_INVITE,
    NotificationType.WORKSPACE_ACCEPTED,
    NotificationType.ITEM_ASSIGNED,
    NotificationType.ITEM_COMPLETED,
    NotificationType.CHAT_MESSAGE
  ]),
});


export const notificationIdsFormSchema = z.object({
  notificationIds: z.array(z.string().cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID)),
  revalidatePaths: z.array(z.string()).optional(),
});

export const notificationIdFormSchema = z.object({
  notificationId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  revalidatePaths: z.array(z.string()).optional(),
});

export const broadcastSchema = z.object({
  message: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  type: z.enum(["SISTEM_MESSAGE", "NOTICES_MESSAGE"]),
  referenceId: z.string().cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID).optional(),
});

export type CreateNotificationInput = z.infer<typeof notificationFormSchema>;
export type DeleteMultipleNotificationsType = z.infer<typeof notificationIdsFormSchema>;
export type DeleteNotificationType = z.infer<typeof notificationIdFormSchema>;
export type MarkNotificationAsReadType = z.infer<typeof notificationIdFormSchema>;
export type BroadcastNotificationType = z.infer<typeof broadcastSchema>;
