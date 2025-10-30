import { ERROR_MESSAGES } from "@/lib/errors";
import { z } from "zod";
import { workspaceIdSchema } from "../workspace";

export const groupIdFormSchema = z.object({
  workspaceId: z.string().cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  groupId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  revalidatePaths: z.array(z.string()).optional(),
});

export const groupFormSchema = z.object({
  title: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  textColor: z.string().min(4, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
});

export const createGroupFormSchema = workspaceIdSchema.merge(groupFormSchema);

export const updateGroupFormSchema = groupIdFormSchema.merge(groupFormSchema);

export const changeGroupStatusSchema = groupIdFormSchema.extend({
  status: z.enum(["ACTIVE", "DELETED", "ARCHIVED"])
});

export type GroupFormData = z.infer<typeof groupFormSchema>;
export type CreateGroupType = z.infer<typeof createGroupFormSchema>;
export type UpdateGroupType = z.infer<typeof updateGroupFormSchema>;
export type DeleteGroupType = z.infer<typeof groupIdFormSchema>;
export type ChangeGroupStatusType = z.infer<typeof changeGroupStatusSchema>;