"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ERROR_MESSAGES } from "@/utils/error-messages";
import { NotFoundError, PermissionError } from "@/lib/errors";
import { handleError } from "@/utils/error-handler";

const formSchema = z.object({
  friendshipId: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
});

export async function deleteFriendship(formData: z.infer<typeof formSchema>) {
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
    const friendship = await prisma.userFriend.findUnique({
      where: { id: formData.friendshipId },
    });
    if (!friendship) {

      throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.FRENDSHIP);
    };
    if (friendship.requesterId !== userId && friendship.addresseeId !== userId) {
      throw new PermissionError(ERROR_MESSAGES.PERMISSION.NO_ACCESS);
    };

    await prisma.userFriend.delete({
      where: { id: formData.friendshipId },
    });

    revalidatePath("/dashboard/frends");
    return { success: true };
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC)
  };
};