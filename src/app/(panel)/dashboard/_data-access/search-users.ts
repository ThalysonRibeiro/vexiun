"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const formSchema = z.object({
  query: z.string().min(1, "A query é obrigatório"),
});

type FormSchema = z.infer<typeof formSchema>;

export async function searchUsers(formData: FormSchema) {
  const session = await auth();
  if (!session?.user) {
    return {
      error: "Não autorizado"
    }
  }

  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }

  if (!formData.query || formData.query.trim().length < 2) {
    return {
      success: true,
      data: []
    }
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        isActive: true,
        // emailVerified: { not: null },
        NOT: { id: session.user.id },
        OR: [
          {
            name: {
              contains: formData.query,
              mode: 'insensitive'
            }
          },
          {
            email: {
              contains: formData.query,
              mode: 'insensitive'
            }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      },
      take: 20
    });

    return {
      success: true,
      data: users
    };
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return {
      error: "Falha ao buscar usuários"
    }
  }
}