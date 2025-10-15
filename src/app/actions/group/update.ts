"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { validateGroupExists } from "@/lib/db/validators";
import { ERROR_MESSAGES } from "@/utils/error-messages";
import { handleError } from "@/utils/error-handler";

const formSchema = z.object({
  id: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  title: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  textColor: z.string().min(4, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
});

export async function updateGroup(formData: z.infer<typeof formSchema>) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: ERROR_MESSAGES.AUTH.NOT_AUTHENTICATED };
  };
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return { error: schema.error.issues[0].message };
  };

  const existingGroup = await validateGroupExists(formData.id);

  if (!existingGroup) {
    return {
      error: ERROR_MESSAGES.NOT_FOUND.GROUP
    }
  }

  try {
    await prisma.group.update({
      where: { id: formData.id },
      data: {
        title: formData.title,
        textColor: formData.textColor
      }
    });
    revalidatePath("/dashboard/Workspace");
    return;
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  }
}