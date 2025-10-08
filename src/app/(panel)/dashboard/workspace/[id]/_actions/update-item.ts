"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  itemId: z.string().min(1, "O Id do grupo é obrigatório"),
  title: z.string().min(1, "O titulo é obrigatório"),
  status: z.enum(["DONE", "IN_PROGRESS", "STOPPED", "NOT_STARTED"]),
  term: z.date().optional(),
  priority: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "STANDARD"]),
  notes: z.string()
    .min(1, "Notas é obrigatória")
    .max(300, "A nota da item deve ter no máximo 300 caracteres."),
  description: z.string()
    .min(1, "A descriçãoo é obrigatória")
    .max(500, "A descrição da item deve ter no máximo 500 caracteres."),
});

type FormSchema = z.infer<typeof formSchema>;

export async function updateItem(formData: FormSchema) {

  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }

  try {
    const existingItem = await prisma.item.findFirst({
      where: {
        id: formData.itemId,
      }
    });

    if (!existingItem) {
      return {
        error: "Item não encontrada ou você não tem permissão para editá-lo"
      }
    }

    const updateData = Object.fromEntries(
      Object.entries({
        title: formData.title,
        status: formData.status,
        term: formData.term,
        priority: formData.priority,
        notes: formData.notes,
        description: formData.description
      }).filter((entry) => entry[1] !== undefined)
    );

    await prisma.item.update({
      where: { id: formData.itemId },
      data: updateData
    });

    revalidatePath("/dashboard/Workspace");

    return {
      success: true
    };

  } catch (error) {
    return {
      error: "Falha ao atualizar item"
    }
  }
}