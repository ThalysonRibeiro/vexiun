"use server"
import prisma from "@/lib/prisma";
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
import { createItemFormSchema, CreateItemType } from "./item-schema";

export const createItem = withAuth(async (
  userId,
  session,
  formData: CreateItemType): Promise<ActionResponse<Item | string>> => {

  const schema = createItemFormSchema.safeParse(formData);
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

  if (formData.revalidatePaths?.length) {
    formData.revalidatePaths.forEach((path) => revalidatePath(path));
  }
  return successResponse(newItem, "Item criado com sucesso");

}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);