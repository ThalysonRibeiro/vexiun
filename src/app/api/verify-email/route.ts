import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token inválido" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token }
    });

    if (!user || !user.verificationExpiresAt || user.verificationExpiresAt < new Date()) {
      return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        emailVerificationToken: null,
        verificationExpiresAt: null
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: "E-mail verificado com sucesso"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao verificar email:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor"
      },
      { status: 500 }
    );
  }
}
