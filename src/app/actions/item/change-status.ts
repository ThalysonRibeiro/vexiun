"use server";
import prisma from "@/lib/prisma";
import { ValidationError, withAuth } from "@/lib/errors";
import { PermissionError } from "@/lib/errors";
import { successResponse } from "@/lib/errors/error-handler";
import { ERROR_MESSAGES } from "@/lib/errors";
import { changeStatusFormSchema, ChangeStatusInputType } from "./item-schema";
import { validateItemExists, validateWorkspacePermission } from "@/lib/db/validators";
import { revalidatePath } from "next/cache";
import { entityStatusMessages } from "@/lib/entityStatus/messages";

export const changeItemStatus = withAuth(
  async (userId, session, formData: ChangeStatusInputType) => {

    const result = changeStatusFormSchema.safeParse(formData);
    if (!result.success) {
      throw new ValidationError(result.error.issues[0].message);
    }

    const item = await validateItemExists(formData.itemId);

    const permission = await validateWorkspacePermission(
      formData.workspaceId,
      userId,
      "MEMBER"
    );

    if (!permission) {
      throw new PermissionError(ERROR_MESSAGES.PERMISSION.NO_ACCESS);
    }

    const { role } = permission;
    const { entityStatus: currentStatus, id } = item;

    if (currentStatus === "DELETED" && role !== "OWNER") {
      throw new PermissionError(
        ERROR_MESSAGES.PERMISSION.OWNER_ONLY
      );
    }

    if (["MEMBER", "VIEWER"].includes(role) && formData.newStatus !== "ACTIVE") {
      throw new PermissionError(
        ERROR_MESSAGES.PERMISSION.OWNER_ONLY
      );
    }

    await prisma.item.update({
      where: { id: formData.itemId },
      data: {
        entityStatus: formData.newStatus
      }
    });

    if (formData.revalidatePaths?.length) {
      formData.revalidatePaths.forEach((path) => revalidatePath(path));
    } else {
      revalidatePath(`/dashboard/workspace/${formData.workspaceId}`);
    }

    return successResponse(
      { itemId: formData.itemId, status: formData.newStatus },
      entityStatusMessages.ITEM(formData.newStatus)
    );
  },
  ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR
);