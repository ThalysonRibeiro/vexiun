"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { validateItemEditPermission, validateItemExists } from "@/lib/db/validators";
import { handleError, successResponse } from "@/utils/error-handler";
import { ERROR_MESSAGES } from "@/utils/error-messages";
import { JSONContent } from "@tiptap/core";

const formSchema = z.object({
  itemId: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  title: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  status: z.enum(["DONE", "IN_PROGRESS", "STOPPED", "NOT_STARTED"]),
  term: z.date().optional(),
  priority: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "STANDARD"]),
  notes: z.string().optional(),
  description: z.string().optional(),
  details: z.custom<JSONContent>().nullable().optional(),
  assignedTo: z.string().nullable().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export async function updateItem(formData: FormSchema) {
  const session = await auth();
  if (!session?.user) {
    return {
      error: ERROR_MESSAGES.AUTH.NOT_AUTHENTICATED
    };
  }

  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }

  try {
    await validateItemExists(formData.itemId);
    await validateItemEditPermission(formData.itemId, session.user.id as string)

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

    return successResponse();
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  }
}