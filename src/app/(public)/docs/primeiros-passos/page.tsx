import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  Target,
  Briefcase,
  Settings,
  Plus,
  UserPlus,
  FolderPlus,
  Calendar
} from "lucide-react";

export const metadata: Metadata = {
  title: "Primeiros Passos - Documentação Catalyst",
  description: "Aprenda os conceitos básicos do Catalyst e configure sua primeira conta"
};

export default function PrimeirosPassosPage() {
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
              <h1 className="text-3xl font-bold">Primeiros Passos</h1>
              <p className="text-muted-foreground mt-2">
                Configure sua conta e comece a usar o Catalyst
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Overview */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Bem-vindo ao Catalyst!</h2>
            <p className="text-lg text-muted-foreground mb-6">
              O Catalyst é uma plataforma completa para gerenciar projetos em equipe e acompanhar
              suas metas pessoais. Este guia vai te ajudar a configurar tudo em poucos minutos.
            </p>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-sm font-bold">!</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Dica importante</h3>
                  <p className="text-sm text-muted-foreground">
                    Reserve 10-15 minutos para completar este guia. Isso vai te dar uma base sólida
                    para usar todas as funcionalidades.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 1: Account Setup */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <h2 className="text-2xl font-bold">Criar sua conta</h2>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Configuração inicial
                </CardTitle>
                <CardDescription>Primeiro passo para começar a usar o Catalyst</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Acesse a página de login</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Escolha seu método de autenticação preferido</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Complete seu perfil com informações básicas</span>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Métodos de autenticação disponíveis:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Google (recomendado)</li>
                    <li>• GitHub</li>
                    <li>• Email e senha</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Step 2: First Workspace */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <h2 className="text-2xl font-bold">Criar seu primeiro workspace</h2>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Workspace inicial
                </CardTitle>
                <CardDescription>
                  Um workspace é como um projeto ou departamento onde você organiza suas tarefas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Passo a passo:</h4>
                    <ol className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                          1
                        </span>
                        <span>Clique em "Novo Workspace" no dashboard</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                          2
                        </span>
                        <span>Escolha um nome descritivo (ex: "Projeto Website")</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                          3
                        </span>
                        <span>Adicione uma descrição opcional</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                          4
                        </span>
                        <span>Defina a cor do workspace</span>
                      </li>
                    </ol>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">💡 Dicas para o nome:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Use nomes claros e descritivos</li>
                      <li>• Evite abreviações confusas</li>
                      <li>• Exemplos: "E-commerce 2024", "App Mobile"</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Step 3: Create Groups */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <h2 className="text-2xl font-bold">Organizar com grupos</h2>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderPlus className="h-5 w-5" />
                  Estrutura de grupos
                </CardTitle>
                <CardDescription>
                  Grupos ajudam a organizar tarefas por categoria, prioridade ou equipe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Exemplos de grupos:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm">Desenvolvimento Frontend</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-sm">Testes e QA</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-950/20 rounded">
                        <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm">Design e UX</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🎯 Como criar grupos:</h4>
                    <ol className="space-y-1 text-sm text-muted-foreground">
                      <li>1. Dentro do workspace, clique em "Novo Grupo"</li>
                      <li>2. Escolha um nome claro</li>
                      <li>3. Defina uma cor para identificação</li>
                      <li>4. Adicione uma descrição opcional</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Step 4: Personal Goals */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                4
              </div>
              <h2 className="text-2xl font-bold">Definir metas pessoais</h2>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Metas semanais
                </CardTitle>
                <CardDescription>
                  As metas pessoais são objetivos que você define para si mesmo e acompanha
                  semanalmente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Exemplos de metas:</h4>
                    <div className="space-y-2">
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">Estudar React</span>
                          <Badge variant="outline" className="text-xs">
                            3x/semana
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Meta: Estudar React 3 vezes por semana
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">Exercitar-se</span>
                          <Badge variant="outline" className="text-xs">
                            5x/semana
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Meta: Exercitar-se 5 vezes por semana
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">📈 Benefícios das metas:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Acompanhamento visual do progresso</li>
                      <li>• Motivação para manter consistência</li>
                      <li>• Histórico de conquistas</li>
                      <li>• Foco em objetivos pessoais</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Step 5: Invite Team */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                5
              </div>
              <h2 className="text-2xl font-bold">Convidar equipe</h2>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Colaboração
                </CardTitle>
                <CardDescription>
                  Convide membros da equipe para colaborar no workspace
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Como convidar:</h4>
                    <ol className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                          1
                        </span>
                        <span>Vá para "Configurações do Workspace"</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                          2
                        </span>
                        <span>Clique em "Convidar Membros"</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                          3
                        </span>
                        <span>Digite o email do membro</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                          4
                        </span>
                        <span>Defina o nível de permissão</span>
                      </li>
                    </ol>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🔐 Níveis de permissão:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>
                        • <strong>Admin:</strong> Controle total
                      </li>
                      <li>
                        • <strong>Editor:</strong> Criar e editar
                      </li>
                      <li>
                        • <strong>Membro:</strong> Apenas visualizar
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Next Steps */}
          <section className="bg-card border rounded-lg p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">🎉 Parabéns!</h3>
              <p className="text-muted-foreground mb-6">
                Você configurou sua conta e está pronto para começar a usar o Catalyst. Agora você
                pode explorar funcionalidades mais avançadas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/docs/funcionalidades">
                  <Button className="gap-2">
                    Explorar funcionalidades
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/docs/tutoriais">
                  <Button variant="outline" className="gap-2">
                    Ver tutoriais
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
