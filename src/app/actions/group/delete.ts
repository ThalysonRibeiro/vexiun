"use server"
import { auth } from "@/lib/auth";
import { AuthenticationError, ValidationError } from "@/lib/errors/custom-errors";
import prisma from "@/lib/prisma";
import { ActionResponse, handleError, successResponse } from "@/lib/errors/error-handler";
import { ERROR_MESSAGES } from "@/lib/errors/messages";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const formSchema = z.object({
  groupId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
});

export type DeleteGroupType = z.infer<typeof formSchema>;

export async function deleteGroup(formData: DeleteGroupType): Promise<ActionResponse<string>> {
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
    await prisma.group.delete({
      where: {
        id: formData.groupId,
      }
    });
    revalidatePath("/dashboard/Workspace");
    return successResponse("Grupo deletado com sucesso");
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};