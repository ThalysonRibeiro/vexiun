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
import { Item } from "@/generated/prisma";
import { createAndSendNotification } from "../notification";
import { notificationMessages } from "@/lib/notifications/messages";
import { JSONContent } from "@tiptap/core";
import { validateGroupExists, validateUserExists } from "@/lib/db/validators";

const formSchema = z.object({
  groupId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
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
    .optional()
});

export type CreateItemType = z.infer<typeof formSchema>;

export const createItem = withAuth(async (
  userId,
  session,
  formData: CreateItemType): Promise<ActionResponse<Item | string>> => {

  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    throw new ValidationError(schema.error.issues[0].message);
  };
  const existingGrop = await validateGroupExists(formData.groupId);

  if (formData.assignedTo && formData.assignedTo !== session?.user?.id) {
    await validateUserExists(formData?.assignedTo as string);
  };

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

}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);