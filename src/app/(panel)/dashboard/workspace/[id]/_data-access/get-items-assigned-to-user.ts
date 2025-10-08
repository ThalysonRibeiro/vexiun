"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const formSchema = z.object({
  assignedTo: z.string()
    .min(1, "O id é obrigatório")
    .cuid("ID inválido")
});

type FormSchema = z.infer<typeof formSchema>;


export async function getItemsAssignedToUset(formData: FormSchema) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Não autorizado" }
  }
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return { error: schema.error.issues[0].message }
  }

  try {
    const itemsAssigned = await prisma.item.findMany({
      where: {
        assignedTo: formData.assignedTo,
      },
      orderBy: [
        { term: "asc" },
        { priority: "asc" },
        { status: "asc" },
      ]
    });

    const stats = {
      done: itemsAssigned.filter(t => t.status === "DONE").length,
      pending: itemsAssigned.filter(t => t.status === "IN_PROGRESS").length,
      stopped: itemsAssigned.filter(t => t.status === "STOPPED").length,
      notStarted: itemsAssigned.filter(t => t.status === "NOT_STARTED").length,
      total: itemsAssigned.length,
    }

    return {
      success: true,
      itemsAssigned,
      stats
    }
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error)
    return {
      success: false,
      error: 'Erro ao carregar tarefas',
      itemsAssigned: [],
      stats: { done: 0, pending: 0, stopped: 0, notStarted: 0, total: 0 }
    }
  }
}