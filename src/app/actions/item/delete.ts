"use server"
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { handleError } from "@/utils/error-handler";
import { ERROR_MESSAGES } from "@/utils/error-messages";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const formSchema = z.object({
  itemId: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
});

export async function deleteItem(formData: z.infer<typeof formSchema>) {
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
    await prisma.item.delete({
      where: { id: formData.itemId }
    })
    revalidatePath("/dashboard/Workspace");
    return;
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};