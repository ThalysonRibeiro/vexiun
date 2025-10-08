"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  groupId: z.string().min(1, "O Id do grupo é obrigatório"),
  title: z.string().min(1, "O titulo é obrigatório"),
  term: z.date().optional(),
  priority: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "STANDARD"]),
  status: z.enum(["DONE", "IN_PROGRESS", "STOPPED", "NOT_STARTED"]),
  notes: z.string()
    .min(1, "Notas é obrigatória")
    .max(500, "A nota da item deve ter no máximo 500 caracteres."),
  description: z.string()
    .min(1, "A descrição é obrigatória")
    .max(1000, "A descrição da item deve ter no máximo 1000 caracteres."),
});

type FormSchema = z.infer<typeof formSchema>;

export async function createItem(formData: FormSchema) {

  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }
  const existingGropu = await prisma.group.findFirst({
    where: { id: formData.groupId }
  });
  if (!existingGropu) {
    return {
      error: "Falha ao cadastrar item"
    }
  }
  try {
    const newItem = await prisma.item.create({
      data: {
        groupId: existingGropu.id,
        title: formData.title,
        term: formData.term || new Date(),
        priority: formData.priority || "STANDARD",
        status: formData.status,
        notes: formData.notes || "",
        description: formData.description || ""
      }
    });
    revalidatePath("/dashboard/Workspace");
    return { data: newItem }
  } catch (error) {
    return {
      error: "Falha ao cadastrar item"
    }
  }
}