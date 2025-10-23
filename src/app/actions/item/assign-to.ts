"use server";
import prisma from "@/lib/prisma";
import { ValidationError, withAuth } from "@/lib/errors";
import { PermissionError } from "@/lib/errors";
import { successResponse } from "@/lib/errors/error-handler";
import { ERROR_MESSAGES } from "@/lib/errors";
import { validateWorkspaceAccess } from "@/lib/db/validators";
import { createAndSendNotification } from "../notification";
import { notificationMessages } from "@/lib/notifications/messages";
import { assignToFormSchema, AssignToType } from "./item-schema";

export const assignTo = withAuth(
  async (userId, session, formData: AssignToType) => {

    const schema = assignToFormSchema.safeParse(formData);
    if (!schema.success) {
      throw new ValidationError(schema.error.issues[0].message);
    };

    const hasAccess = await validateWorkspaceAccess(formData.workspaceId, formData.assignedTo);

    if (!hasAccess) {
      throw new PermissionError(ERROR_MESSAGES.PERMISSION.NO_ACCESS);
    }

    const result = await prisma.item.update({
      where: { id: formData.itemId },
      data: {
        assignedTo: formData.assignedTo
      }
    });

    if (formData.assignedTo && formData.assignedTo !== session?.user?.id) {
      await createAndSendNotification({
        userId: formData.assignedTo,
        type: "ITEM_ASSIGNED",
        message: notificationMessages.ITEM_ASSIGNED(session?.user?.name as string, result.title),
        referenceId: formData.itemId,
        image: session?.user?.image as string,
        nameReference: session?.user?.name as string,
      });
    }

    return successResponse(result);
  },
  ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR
);