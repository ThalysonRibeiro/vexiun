// src/lib/check-triggers.ts
import prisma from "@/lib/prisma"; // ✅ Use o prisma que você já tem configurado

async function checkTriggers() {
  try {
    const result = await prisma.$queryRaw<Array<{
      trigger_name: string;
      event_object_table: string;
      action_timing: string;
      event_manipulation: string;
    }>>`
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

    if (result.length === 0) {
      console.log("❌ Nenhum trigger encontrado!");
      console.log("💡 Os triggers não foram criados. Vamos usar a Opção 2 (helper manual).");
    } else {
      console.log(`✅ ${result.length} triggers encontrados:\n`);
      result.forEach(row => {
        console.log(`📌 ${row.trigger_name}`);
        console.log(`   Tabela: ${row.event_object_table}`);
        console.log(`   Timing: ${row.action_timing}`);
        console.log(`   Evento: ${row.event_manipulation}\n`);
      });
    }
  } catch (error) {
    console.error("❌ Erro ao verificar triggers:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTriggers();