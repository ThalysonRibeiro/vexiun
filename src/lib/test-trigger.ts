// test-trigger.ts npx tsx src/lib/test-trigger.ts
import prisma from "@/lib/prisma";

async function testTrigger() {
  try {
    // 1. Pega uma workspace existente
    const workspace = await prisma.workspace.findFirst({
      include: {
        groups: { take: 1 }
      }
    });

    if (!workspace) {
      console.log("❌ Nenhuma workspace encontrada. Crie uma primeiro!");
      return;
    }

    console.log("\n🔍 Testando workspace:", workspace.title);
    console.log("📅 ID:", workspace.id);
    console.log("⏰ lastActivityAt ANTES:", workspace.lastActivityAt);

    // Aguarda 2 segundos
    console.log("\n⏳ Aguardando 2 segundos...\n");
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 2. Cria um item ou grupo
    if (workspace.groups.length > 0) {
      console.log("📝 Criando item no grupo:", workspace.groups[0].title);

      await prisma.item.create({
        data: {
          title: "🧪 Teste Trigger - " + new Date().toLocaleTimeString(),
          status: "NOT_STARTED",
          priority: "STANDARD",
          notes: "Teste automático",
          description: "Item criado para testar trigger",
          term: new Date(),
          groupId: workspace.groups[0].id
        }
      });

      console.log("✅ Item criado!");
    } else {
      console.log("📁 Criando grupo na workspace");

      await prisma.group.create({
        data: {
          title: "🧪 Grupo Teste - " + new Date().toLocaleTimeString(),
          textColor: "#3b82f6",
          workspaceId: workspace.id
        }
      });

      console.log("✅ Grupo criado!");
    }

    // 3. Busca a workspace novamente
    const workspaceAfter = await prisma.workspace.findUnique({
      where: { id: workspace.id },
      select: { lastActivityAt: true }
    });

    console.log("\n⏰ lastActivityAt DEPOIS:", workspaceAfter?.lastActivityAt);

    // 4. Compara
    const antes = workspace.lastActivityAt.getTime();
    const depois = workspaceAfter!.lastActivityAt.getTime();
    const diferenca = (depois - antes) / 1000;

    if (depois > antes) {
      console.log("\n✅ ✅ ✅ SUCESSO! O trigger FUNCIONOU! ✅ ✅ ✅");
      console.log(`📊 Diferença: ${diferenca.toFixed(2)} segundos`);
      console.log("\n🎉 Agora toda atividade atualiza automaticamente o lastActivityAt!");
    } else {
      console.log("\n❌ ❌ ❌ FALHOU! O trigger NÃO funcionou! ❌ ❌ ❌");
      console.log("💡 Vamos precisar usar a Opção 2 (helper manual)");
    }

  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testTrigger();