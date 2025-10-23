import { WorkspaceCategory } from "@/generated/prisma";
import { ERROR_MESSAGES } from "@/lib/errors";
import { z } from "zod";

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

export const CreateWorkspaceSchema = workspaceSchema.extend({
  revalidatePaths: z.array(z.string()).optional(),
});

export type WorkspaceFormData = z.infer<typeof workspaceSchema>;
export type CreateWorkspaceType = z.infer<typeof CreateWorkspaceSchema>;