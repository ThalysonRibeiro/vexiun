"use server"
import { auth } from "@/lib/auth";
import { AuthenticationError, ValidationError } from "@/lib/errors";
import prisma from "@/lib/prisma";
import { ActionResponse, handleError, successResponse } from "@/utils/error-handler";
import { ERROR_MESSAGES } from "@/utils/error-messages";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const formSchema = z.object({
  itemId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
});

export type DeleteItemType = z.infer<typeof formSchema>;

export async function deleteItem(formData: DeleteItemType): Promise<ActionResponse<string>> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new AuthenticationError();
    }
    const schema = formSchema.safeParse(formData);
    if (!schema.success) {
      throw new ValidationError(schema.error.issues[0].message);
    };
    await prisma.item.delete({
      where: { id: formData.itemId }
    })
    revalidatePath("/dashboard/Workspace");
    return successResponse("Item deletado com sucesso");
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};