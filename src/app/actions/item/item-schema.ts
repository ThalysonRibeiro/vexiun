import { ERROR_MESSAGES } from "@/lib/errors";
import { JSONContent } from "@tiptap/core";
import { z } from "zod";
import { groupIdFormSchema } from "../group";
import { EntityStatus } from "@/generated/prisma";

export const itemIdFormSchema = z.object({
  itemId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  revalidatePaths: z.array(z.string()).optional(),
});

export const itemFormSchema = z.object({
  title: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  term: z.date().optional(),
  priority: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "STANDARD"]),
  status: z.enum(["DONE", "IN_PROGRESS", "STOPPED", "NOT_STARTED"]),
  notes: z.string().optional(),
  description: z.string().optional(),
  details: z.custom<JSONContent>().nullable().optional(),
  assignedTo: z.string()
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID)
    .nullable()
    .optional(),
});
export const createItemFormSchema = groupIdFormSchema.merge(itemFormSchema);

export const updateItemFormSchema = itemIdFormSchema.merge(itemFormSchema.extend({
  workspaceId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
}));


export const assignToFormSchema = z.object({
  workspaceId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  itemId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  assignedTo: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
});

export const deleteItemFormSchema = itemIdFormSchema.extend({
  workspaceId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
});


export const changeStatusFormSchema = itemIdFormSchema.extend({
  workspaceId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  newStatus: z.enum([
    EntityStatus.ACTIVE,
    EntityStatus.ARCHIVED,
    EntityStatus.DELETED
  ])
})

export type ItemFormData = z.infer<typeof itemFormSchema>;
export type CreateItemType = z.infer<typeof createItemFormSchema>;
export type UpdateItemType = z.infer<typeof updateItemFormSchema>;
export type AssignToType = z.infer<typeof assignToFormSchema>;
export type DeleteItemType = z.infer<typeof deleteItemFormSchema>;
export type ChangeStatusInputType = z.infer<typeof changeStatusFormSchema>;
