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
import { deleteItemFormSchema, DeleteItemType } from "./item-schema";
import { validateWorkspacePermission } from "@/lib/db/validators";

export const deleteItem = withAuth(
  async (userId, session, formData: DeleteItemType): Promise<ActionResponse<string>> => {
    const schema = deleteItemFormSchema.safeParse(formData);
    if (!schema.success) {
      throw new ValidationError(schema.error.issues[0].message);
    }

    await validateWorkspacePermission(formData.workspaceId, userId, "ADMIN");

    await prisma.item.delete({
      where: { id: formData.itemId }
    });

    if (formData.revalidatePaths?.length) {
      formData.revalidatePaths.forEach((path) => revalidatePath(path));
    }
    revalidatePath("/dashboard/Workspace");
    return successResponse("Item deletado com sucesso");
  },
  ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR
);
