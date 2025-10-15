"use server"
import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { notificationMessages } from "@/lib/notifications/messages";
import { validateGroupExists, validateUserExists } from "@/lib/db/validators";
import { createAndSendNotification } from "@/app/actions/notification";
import { ERROR_MESSAGES } from "@/utils/error-messages";
import { handleError, successResponse } from "@/utils/error-handler";
import { JSONContent } from "@tiptap/core";

const formSchema = z.object({
  groupId: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  title: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  term: z.date().optional(),
  priority: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "STANDARD"]),
  status: z.enum(["DONE", "IN_PROGRESS", "STOPPED", "NOT_STARTED"]),
  notes: z.string().optional(),
  description: z.string().optional(),
  details: z.custom<JSONContent>().nullable().optional(),
  assignedTo: z.string().nullable().optional(),
});

export async function createItem(formData: z.infer<typeof formSchema>) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: ERROR_MESSAGES.AUTH.NOT_AUTHENTICATED };
  };
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return { error: schema.error.issues[0].message };
  };
  const existingGrop = await validateGroupExists(formData.groupId);

  if (formData.assignedTo && formData.assignedTo !== session?.user?.id) {
    await validateUserExists(formData?.assignedTo as string);
  };

  try {
    const newItem = await prisma.item.create({
      data: {
        groupId: existingGrop.id,
        title: formData.title,
        term: formData.term || new Date(),
        priority: formData.priority || "STANDARD",
        status: formData.status,
        notes: formData.notes as string,
        description: formData.description as string,
        createdBy: session?.user?.id,
        assignedTo: formData.assignedTo,
        details: formData.details as JSONContent || null
      }
    });

    if (formData.assignedTo && formData.assignedTo !== session?.user?.id) {
      await createAndSendNotification({
        type: "ITEM_ASSIGNED",
        userId: formData.assignedTo,
        image: session?.user?.image as string,
        nameReference: session?.user?.name as string,
        referenceId: newItem.id,
        message: notificationMessages.ITEM_ASSIGNED(session?.user?.name as string, newItem.title),
      });
    };

    revalidatePath("/dashboard/workspace");
    return successResponse(newItem, "Item criado com sucesso");
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};