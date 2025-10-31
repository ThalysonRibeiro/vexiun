// app/api/check-triggers/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ error: "Acesso não autorizado" }, { status: 401 });
  }

  try {
    const userId = req.auth.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        name: true // ✅ Útil para logs
      }
    });

    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Acesso negado. Apenas SUPER_ADMIN." }, { status: 403 }); // ✅ 403 é mais apropriado
    }

    const triggers = await prisma.$queryRaw<
      Array<{
        trigger_name: string;
        event_object_table: string;
        action_timing: string;
        event_manipulation: string;
      }>
    >`
      SELECT 
        trigger_name, 
        event_object_table,
        action_timing,
        event_manipulation
      FROM information_schema.triggers
      WHERE trigger_schema = 'public'
        AND trigger_name LIKE '%activity%'
      ORDER BY event_object_table, trigger_name
    `;

    return NextResponse.json({
      success: true,
      triggers,
      count: triggers.length,
      checkedBy: user.name, // ✅ Log de quem verificou
      checkedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error checking triggers:", error); // ✅ Log do erro
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao verificar triggers"
      },
      { status: 500 }
    );
  }
});
