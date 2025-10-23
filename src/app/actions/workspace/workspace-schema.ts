import { EntityStatus, WorkspaceCategory } from "@/generated/prisma";
import { ERROR_MESSAGES } from "@/lib/errors";
import { z } from "zod";

export const workspaceIdSchema = z.object({
  workspaceId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  revalidatePaths: z.array(z.string()).optional(),
});

export const addMemnberSchema = workspaceIdSchema.extend({
  invitationUsersId: z
    .array(z.string().cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID))
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  revalidatePaths: z.array(z.string()).optional(),
});

export const cancelInvitationSchema = z.object({
  invitationId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  revalidatePaths: z.array(z.string()).optional(),
});

export const workspaceSchema = z.object({
  title: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  invitationUsersId: z.array(z
    .string()
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID))
    .optional(),
  description: z.string().optional(),
  categories: z.array(z.enum([
    WorkspaceCategory.PERSONAL,
    WorkspaceCategory.WORK,
    WorkspaceCategory.EDUCATION,
    WorkspaceCategory.HEALTH,
    WorkspaceCategory.FINANCE,
    WorkspaceCategory.CREATIVE,
    WorkspaceCategory.TECHNOLOGY,
    WorkspaceCategory.MARKETING,
    WorkspaceCategory.SALES,
    WorkspaceCategory.SUPPORT,
    WorkspaceCategory.OTHER,
  ]), {
    required_error: ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD,
    invalid_type_error: ERROR_MESSAGES.VALIDATION.INVALID_FORMAT
  }),
});

export const createWorkspaceSchema = workspaceSchema.extend({
  revalidatePaths: z.array(z.string()).optional(),
});

export const updateWorkspaceSchema = createWorkspaceSchema.extend({
  workspaceId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
});

export const changeWorkspaceStatusSchema = workspaceIdSchema.extend({
  newStatus: z.enum([
    EntityStatus.ARCHIVED,
    EntityStatus.ACTIVE,
    EntityStatus.DELETED
  ]),
  revalidatePaths: z.array(z.string()).optional(),
});


export type AcceptWorkspaceInvitationType = z.infer<typeof workspaceIdSchema>;
export type AddWorkspaceMemberType = z.infer<typeof addMemnberSchema>;
export type CancelWorkspaceInvitationType = z.infer<typeof cancelInvitationSchema>;
export type ChangeStatusInput = z.infer<typeof changeWorkspaceStatusSchema>;
export type DeclineWorkspaceInvitationType = z.infer<typeof workspaceIdSchema>;
export type DeleteWorkspaceType = z.infer<typeof workspaceIdSchema>;
export type WorkspaceFormData = z.infer<typeof workspaceSchema>;
export type CreateWorkspaceType = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceType = z.infer<typeof updateWorkspaceSchema>;