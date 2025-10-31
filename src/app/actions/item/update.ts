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
import { JSONContent } from "@tiptap/core";
import { validateItemEditPermission, validateItemExists } from "@/lib/db/validators";
import { updateItemFormSchema, UpdateItemType } from "./item-schema";

export const updateItem = withAuth(
  async (userId, session, formData: UpdateItemType): Promise<ActionResponse<string>> => {
    const schema = updateItemFormSchema.safeParse(formData);
    if (!schema.success) {
      throw new ValidationError(schema.error.issues[0].message);
    }
    await validateItemExists(formData.itemId);
    await validateItemEditPermission(formData.itemId, userId);

    const updateData = Object.fromEntries(
      Object.entries({
        title: formData.title,
        status: formData.status,
        term: formData.term,
        priority: formData.priority,
        notes: formData.notes,
        description: formData.description,
        details: (formData.details as JSONContent) || null,
        assignedTo: formData.assignedTo
      }).filter((entry) => entry[1] !== undefined)
    );

    await prisma.item.update({
      where: { id: formData.itemId },
      data: updateData
    });

    if (formData.revalidatePaths?.length) {
      formData.revalidatePaths.forEach((path) => revalidatePath(path));
    }

    return successResponse("Item atualizado com sucesso");
  },
  ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR
);
