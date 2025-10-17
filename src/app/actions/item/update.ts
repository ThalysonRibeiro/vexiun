"use server"
import prisma from "@/lib/prisma";
import { z } from "zod";
import {
  ActionResponse,
  ERROR_MESSAGES,
  successResponse,
  ValidationError,
  withAuth
} from "@/lib/errors";
import { revalidatePath } from "next/cache";
import { JSONContent } from "@tiptap/core";
import { validateItemEditPermission, validateItemExists } from "@/lib/db/validators";

const formSchema = z.object({
  itemId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  title: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  status: z.enum(["DONE", "IN_PROGRESS", "STOPPED", "NOT_STARTED"]),
  term: z.date().optional(),
  priority: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "STANDARD"]),
  notes: z.string().optional(),
  description: z.string().optional(),
  details: z.custom<JSONContent>().nullable().optional(),
  assignedTo: z.string()
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID)
    .nullable().optional(),
});

export type UpdateItemType = z.infer<typeof formSchema>;

export const updateItem = withAuth(async (
  userId,
  session,
  formData: UpdateItemType): Promise<ActionResponse<string>> => {

  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    throw new ValidationError(schema.error.issues[0].message);
  };
  await validateItemExists(formData.itemId);
  await validateItemEditPermission(formData.itemId, userId)

  const updateData = Object.fromEntries(
    Object.entries({
      title: formData.title,
      status: formData.status,
      term: formData.term,
      priority: formData.priority,
      notes: formData.notes,
      description: formData.description,
      details: formData.details as JSONContent || null,
      assignedTo: formData.assignedTo
    }).filter((entry) => entry[1] !== undefined)
  );

  await prisma.item.update({
    where: { id: formData.itemId },
    data: updateData
  });

  revalidatePath("/dashboard/Workspace");

  return successResponse("Item atualizado com sucesso");
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);