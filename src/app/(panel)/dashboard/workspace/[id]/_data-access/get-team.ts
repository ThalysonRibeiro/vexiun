"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const formSchema = z.object({
  workspaceId: z.string()
    .min(1, "O id é obrigatório")
    .cuid("ID inválido")
});

type FormSchema = z.infer<typeof formSchema>;

export async function getTeam(formData: FormSchema) {
  const session = await auth();
  if (!session?.user) {
    return {
      error: "Não autorizado"
    }
  }

  try {
    const schema = formSchema.safeParse(formData);
    if (!schema.success) {
      return {
        error: schema.error.issues[0].message
      }
    }

    const team = await prisma.workspaceMember.findMany({
      where: {
        workspaceId: formData.workspaceId,
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
    return team.map(member => member.user);
  } catch (error) {
    return { error: "equipe não encontrada" }
  }
}