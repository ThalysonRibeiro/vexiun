import { auth } from "@/lib/auth";
import { Role } from "@/generated/prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function requireSuperAdmin() {
  const session = await auth();

  if (!session?.user) {
    return {
      error: NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 }),
      user: null
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      role: true,
      name: true,
      email: true
    }
  });

  if (!user) {
    return {
      error: NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 }),
      user: null
    };
  }

  if (user.role !== Role.SUPER_ADMIN) {
    console.warn(`[SECURITY] Acesso negado: ${user.email} (${user.role})`);
    return {
      error: NextResponse.json({ error: "Acesso negado. Apenas SUPER_ADMIN." }, { status: 403 }),
      user: null
    };
  }

  return { error: null, user };
}
