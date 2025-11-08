import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Briefcase,
  Users,
  Target,
  Layers,
  BarChart3,
  Settings,
  Shield,
  Calendar,
  MessageSquare,
  FileText,
  Zap,
  Clock,
  TrendingUp,
  Workflow,
  Globe,
  Bell
} from "lucide-react";

export const metadata: Metadata = {
  title: "Funcionalidades - Documentação Catalyst",
  description: "Explore todas as funcionalidades do Catalyst para maximizar sua produtividade"
};

export default function FuncionalidadesPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/docs">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Funcionalidades</h1>
              <p className="text-muted-foreground mt-2">
                Explore todas as funcionalidades do Catalyst
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Overview */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Funcionalidades Principais</h2>
            <p className="text-lg text-muted-foreground mb-6">
              O Catalyst oferece um conjunto completo de ferramentas para gerenciar projetos,
              colaborar em equipe e acompanhar metas pessoais. Conheça cada funcionalidade em
              detalhes.
            </p>
          </div>

          <Tabs defaultValue="workspaces" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
              <TabsTrigger value="goals">Metas</TabsTrigger>
              <TabsTrigger value="collaboration">Colaboração</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Workspaces Tab */}
            <TabsContent value="workspaces" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Gerenciamento de Workspaces
                    </CardTitle>
                    <CardDescription>
                      Organize projetos em espaços dedicados e personalizados
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Criar múltiplos workspaces</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Personalizar cores e ícones</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Definir descrições detalhadas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Arquivar workspaces antigos</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="h-5 w-5" />
                      Organização com Grupos
                    </CardTitle>
                    <CardDescription>Estruture tarefas em grupos personalizados</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Criar grupos por categoria</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Organizar por prioridade</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Separar por equipe</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Drag & drop para reorganizar</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Como usar Workspaces</CardTitle>
                  <CardDescription>
                    Guia prático para aproveitar ao máximo os workspaces
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold">1. Criar Workspace</h4>
                      <ol className="space-y-1 text-sm text-muted-foreground">
                        <li>• Clique em &quot;Novo Workspace&quot;</li>
                        <li>• Escolha nome descritivo</li>
                        <li>• Defina cor e ícone</li>
                        <li>• Adicione descrição</li>
                      </ol>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">2. Organizar Grupos</h4>
                      <ol className="space-y-1 text-sm text-muted-foreground">
                        <li>• Crie grupos por categoria</li>
                        <li>• Use cores para identificação</li>
                        <li>• Adicione descrições</li>
                        <li>• Reorganize com drag & drop</li>
                      </ol>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">3. Gerenciar Tarefas</h4>
                      <ol className="space-y-1 text-sm text-muted-foreground">
                        <li>• Crie tarefas nos grupos</li>
                        <li>• Atribua responsáveis</li>
                        <li>• Defina prazos</li>
                        <li>• Acompanhe progresso</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Goals Tab */}
            <TabsContent value="goals" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Metas Pessoais
                    </CardTitle>
                    <CardDescription>Defina e acompanhe objetivos semanais</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Metas semanais personalizáveis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Acompanhamento visual</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Histórico de progresso</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Notificações de lembretes</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Acompanhamento
                    </CardTitle>
                    <CardDescription>Visualize seu progresso e evolução</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Gráficos de progresso</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Estatísticas semanais</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Relatórios de conquistas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Comparação temporal</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Tipos de Metas</CardTitle>
                  <CardDescription>
                    Diferentes categorias para organizar seus objetivos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                          Profissional
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Estudar nova tecnologia</li>
                          <li>• Completar certificação</li>
                          <li>• Ler artigos técnicos</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full bg-green-500"></span>
                          Saúde
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Exercitar-se regularmente</li>
                          <li>• Meditar diariamente</li>
                          <li>• Dormir 8 horas</li>
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full bg-purple-500"></span>
                          Educação
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Ler livros</li>
                          <li>• Fazer cursos online</li>
                          <li>• Praticar idiomas</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <span className="h-3 w-3 rounded-full bg-orange-500"></span>
                          Pessoal
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Passar tempo com família</li>
                          <li>• Hobbies e lazer</li>
                          <li>• Desenvolvimento pessoal</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Collaboration Tab */}
            <TabsContent value="collaboration" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Gerenciamento de Equipe
                    </CardTitle>
                    <CardDescription>Convide e gerencie membros da equipe</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Convidar por email</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Definir níveis de acesso</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Gerenciar permissões</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Remover membros</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Controle de Acesso
                    </CardTitle>
                    <CardDescription>Sistema robusto de permissões</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Admin: Controle total</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Editor: Criar e editar</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Membro: Apenas visualizar</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Permissões granulares</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Níveis de Permissão</CardTitle>
                  <CardDescription>Entenda as diferentes permissões disponíveis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2 text-red-600">Administrador</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Criar e editar workspaces</li>
                        <li>• Gerenciar membros</li>
                        <li>• Alterar configurações</li>
                        <li>• Excluir conteúdo</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2 text-blue-600">Editor</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Criar e editar tarefas</li>
                        <li>• Organizar grupos</li>
                        <li>• Comentar e colaborar</li>
                        <li>• Ver todos os membros</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2 text-green-600">Membro</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Visualizar tarefas</li>
                        <li>• Marcar como concluído</li>
                        <li>• Adicionar comentários</li>
                        <li>• Ver progresso</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Relatórios de Projeto
                    </CardTitle>
                    <CardDescription>Acompanhe o progresso dos projetos</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Progresso por grupo</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Tarefas por membro</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Tempo de conclusão</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Produtividade da equipe</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Métricas Pessoais
                    </CardTitle>
                    <CardDescription>Acompanhe seu desenvolvimento pessoal</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Evolução das metas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Consistência semanal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Conquistas alcançadas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Histórico de progresso</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Tipos de Relatórios</CardTitle>
                  <CardDescription>Diferentes visualizações para analisar dados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Relatórios de Projeto</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Gráfico de progresso por grupo</li>
                        <li>• Distribuição de tarefas</li>
                        <li>• Tempo médio de conclusão</li>
                        <li>• Produtividade por membro</li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Relatórios Pessoais</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Evolução das metas semanais</li>
                        <li>• Taxa de conclusão</li>
                        <li>• Consistência ao longo do tempo</li>
                        <li>• Conquistas e marcos</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Additional Features */}
          <section className="mt-12">
            <h3 className="text-2xl font-bold mb-6">Funcionalidades Adicionais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notificações
                  </CardTitle>
                  <CardDescription>
                    Mantenha-se atualizado com notificações inteligentes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Lembretes de tarefas</li>
                    <li>• Atualizações de progresso</li>
                    <li>• Menções em comentários</li>
                    <li>• Prazos próximos</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Comentários
                  </CardTitle>
                  <CardDescription>Colabore através de comentários nas tarefas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Discussões em tarefas</li>
                    <li>• Menções a membros</li>
                    <li>• Histórico de comentários</li>
                    <li>• Notificações de respostas</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Prazos
                  </CardTitle>
                  <CardDescription>Gerencie prazos e datas importantes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Definir datas de vencimento</li>
                    <li>• Visualização em calendário</li>
                    <li>• Alertas de prazo</li>
                    <li>• Relatórios de atraso</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Next Steps */}
          <section className="bg-card border rounded-lg p-8 mt-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Próximos Passos</h3>
              <p className="text-muted-foreground mb-6">
                Agora que você conhece as funcionalidades, explore tutoriais práticos e casos de
                uso.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/docs/tutoriais">
                  <Button className="gap-2">
                    Ver tutoriais
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/docs/faq">
                  <Button variant="outline" className="gap-2">
                    FAQ
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
