"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { handleError, successResponse } from "@/utils/error-handler";
import { ERROR_MESSAGES } from "@/utils/error-messages";
import { NotFoundError } from "@/lib/errors";

const formSchema = z.object({
  requestId: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
});

export async function declinedFriendship(formData: z.infer<typeof formSchema>) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: ERROR_MESSAGES.AUTH.NOT_AUTHENTICATED };
  };
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return { error: schema.error.issues[0].message };
  };

  try {
    const request = await prisma.userFriend.findFirst({
      where: { addresseeId: formData.requestId },
      select: { id: true, addresseeId: true, requesterId: true }
    });

    if (!request) {
      throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.INVITATION);
    };
    if (request.addresseeId !== userId) {
      throw new NotFoundError(ERROR_MESSAGES.PERMISSION.NO_ACCESS);
    };

    const updated = await prisma.userFriend.delete({
      where: { id: request.id }
    });
    revalidatePath("/dashboard/frends");
    return successResponse(updated, "Solicitação cancelada com sucesso");
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};