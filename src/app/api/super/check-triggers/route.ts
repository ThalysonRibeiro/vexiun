import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/api/helpers";

export async function GET() {
  const { error, user } = await requireSuperAdmin();

  if (error) return error;

  try {
    const triggers = await prisma.$queryRaw<
      Array<{
        trigger_name: string;
        event_object_table: string;
        action_timing: string;
        event_manipulation: string;
      }>
    > /* sql */ `
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

    console.info(`[AUDIT] Triggers verificados por: ${user.name} - ${triggers.length} encontrados`);

    return NextResponse.json({
      success: true,
      triggers,
      count: triggers.length,
      checkedBy: user,
      checkedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("[ERROR] Erro ao verificar triggers:", error);

    return NextResponse.json(
      { success: false, error: "Erro interno ao verificar triggers" },
      { status: 500 }
    );
  }
}
