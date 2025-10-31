import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  ArrowRight,
  Play,
  FileText,
  Video,
  Clock,
  Users,
  Target,
  Briefcase,
  Code,
  BarChart3,
  Lightbulb,
  CheckCircle,
  Star,
  TrendingUp,
  Calendar,
  MessageSquare,
  Settings,
  Zap
} from "lucide-react";

export const metadata: Metadata = {
  title: "Tutoriais - Documentação Catalyst",
  description: "Tutoriais práticos e casos de uso para dominar o Catalyst"
};

export default function TutoriaisPage() {
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
              <h1 className="text-3xl font-bold">Tutoriais</h1>
              <p className="text-muted-foreground mt-2">
                Aprenda com tutoriais práticos e casos de uso reais
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Overview */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Tutoriais Práticos</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Aprenda a usar o Catalyst através de tutoriais práticos baseados em cenários reais.
              Cada tutorial inclui passo a passo detalhado e dicas profissionais.
            </p>
          </div>

          <Tabs defaultValue="desenvolvimento" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="desenvolvimento">Desenvolvimento</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
              <TabsTrigger value="pessoal">Pessoal</TabsTrigger>
              <TabsTrigger value="dicas">Dicas</TabsTrigger>
            </TabsList>

            {/* Desenvolvimento Tab */}
            <TabsContent value="desenvolvimento" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Code className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <CardTitle>Projeto de Desenvolvimento Web</CardTitle>
                          <CardDescription>Como organizar um projeto web completo</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="gap-1">
                        <Video className="h-3 w-3" />
                        Vídeo
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>15 min</span>
                      <span>•</span>
                      <span>Intermediário</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Aprenda a estruturar um projeto de desenvolvimento web usando workspaces,
                      grupos e colaboração em equipe.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">O que você vai aprender:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Estruturar workspace para desenvolvimento</li>
                        <li>• Organizar grupos por funcionalidade</li>
                        <li>• Gerenciar equipe de desenvolvedores</li>
                        <li>• Acompanhar progresso do projeto</li>
                      </ul>
                    </div>
                    <Button className="w-full gap-2">
                      <Play className="h-4 w-4" />
                      Assistir tutorial
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <Target className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                          <CardTitle>Metas de Estudo</CardTitle>
                          <CardDescription>Acelere seu aprendizado</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="gap-1">
                        <FileText className="h-3 w-3" />
                        Guia
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>8 min</span>
                      <span>•</span>
                      <span>Iniciante</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Configure metas pessoais para estudar programação e acompanhe seu progresso de
                      forma motivadora.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">O que você vai aprender:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Definir metas de estudo semanais</li>
                        <li>• Acompanhar progresso visual</li>
                        <li>• Manter consistência</li>
                        <li>• Celebrar conquistas</li>
                      </ul>
                    </div>
                    <Button className="w-full gap-2">
                      <FileText className="h-4 w-4" />
                      Ler guia
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Estrutura de Projeto de Desenvolvimento</CardTitle>
                  <CardDescription>
                    Exemplo prático de como organizar um workspace para desenvolvimento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Workspace: "E-commerce 2024"</h4>
                      <div className="space-y-3">
                        <div className="p-3 border rounded-lg">
                          <h5 className="font-medium mb-2 flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                            Frontend
                          </h5>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Implementar design system</li>
                            <li>• Criar componentes reutilizáveis</li>
                            <li>• Integrar com API</li>
                            <li>• Testes de interface</li>
                          </ul>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <h5 className="font-medium mb-2 flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-green-500"></span>
                            Backend
                          </h5>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Desenvolver APIs REST</li>
                            <li>• Configurar banco de dados</li>
                            <li>• Implementar autenticação</li>
                            <li>• Testes unitários</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Equipe e Responsabilidades</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                          <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <span className="text-xs font-bold">JS</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">João Silva</p>
                            <p className="text-xs text-muted-foreground">Frontend Developer</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                          <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                            <span className="text-xs font-bold">MS</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Maria Santos</p>
                            <p className="text-xs text-muted-foreground">Backend Developer</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                          <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                            <span className="text-xs font-bold">AC</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Ana Costa</p>
                            <p className="text-xs text-muted-foreground">QA Tester</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Marketing Tab */}
            <TabsContent value="marketing" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <BarChart3 className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                          <CardTitle>Campanha de Marketing</CardTitle>
                          <CardDescription>Organize campanhas completas</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="gap-1">
                        <Video className="h-3 w-3" />
                        Vídeo
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>12 min</span>
                      <span>•</span>
                      <span>Intermediário</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Aprenda a estruturar uma campanha de marketing digital completa, desde o
                      planejamento até a análise de resultados.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">O que você vai aprender:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Planejar campanhas por fases</li>
                        <li>• Organizar equipe de marketing</li>
                        <li>• Acompanhar métricas</li>
                        <li>• Analisar resultados</li>
                      </ul>
                    </div>
                    <Button className="w-full gap-2">
                      <Play className="h-4 w-4" />
                      Assistir tutorial
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-orange-500" />
                        </div>
                        <div>
                          <CardTitle>Análise de Dados</CardTitle>
                          <CardDescription>Use métricas para otimizar</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="gap-1">
                        <FileText className="h-3 w-3" />
                        Guia
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>10 min</span>
                      <span>•</span>
                      <span>Avançado</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Configure metas baseadas em dados e use o Catalyst para acompanhar KPIs de
                      marketing de forma visual.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">O que você vai aprender:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Definir KPIs como metas</li>
                        <li>• Acompanhar conversões</li>
                        <li>• Otimizar campanhas</li>
                        <li>• Relatórios automáticos</li>
                      </ul>
                    </div>
                    <Button className="w-full gap-2">
                      <FileText className="h-4 w-4" />
                      Ler guia
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Pessoal Tab */}
            <TabsContent value="pessoal" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <Target className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                          <CardTitle>Metas de Vida</CardTitle>
                          <CardDescription>Organize seus objetivos pessoais</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="gap-1">
                        <FileText className="h-3 w-3" />
                        Guia
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>6 min</span>
                      <span>•</span>
                      <span>Iniciante</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Use o Catalyst para organizar e acompanhar seus objetivos pessoais, desde
                      saúde até desenvolvimento profissional.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">O que você vai aprender:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Definir metas de vida</li>
                        <li>• Criar hábitos positivos</li>
                        <li>• Acompanhar progresso</li>
                        <li>• Manter motivação</li>
                      </ul>
                    </div>
                    <Button className="w-full gap-2">
                      <FileText className="h-4 w-4" />
                      Ler guia
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <CardTitle>Planejamento Semanal</CardTitle>
                          <CardDescription>Organize sua semana</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="gap-1">
                        <Video className="h-3 w-3" />
                        Vídeo
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>8 min</span>
                      <span>•</span>
                      <span>Iniciante</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Aprenda a usar o Catalyst para planejar sua semana de forma eficiente,
                      equilibrando trabalho e vida pessoal.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">O que você vai aprender:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Planejar semana antecipadamente</li>
                        <li>• Balancear diferentes áreas</li>
                        <li>• Ajustar conforme necessário</li>
                        <li>• Revisar e melhorar</li>
                      </ul>
                    </div>
                    <Button className="w-full gap-2">
                      <Play className="h-4 w-4" />
                      Assistir tutorial
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Dicas Tab */}
            <TabsContent value="dicas" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      Dicas de Produtividade
                    </CardTitle>
                    <CardDescription>Maximize sua eficiência com o Catalyst</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Use cores para categorizar</li>
                      <li>• Defina metas realistas</li>
                      <li>• Revise progresso diariamente</li>
                      <li>• Celebre pequenas conquistas</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      Colaboração Eficiente
                    </CardTitle>
                    <CardDescription>Melhore o trabalho em equipe</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Comunique-se claramente</li>
                      <li>• Use comentários para contexto</li>
                      <li>• Defina responsabilidades</li>
                      <li>• Mantenha todos atualizados</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-purple-500" />
                      Atalhos e Truques
                    </CardTitle>
                    <CardDescription>Acelere seu fluxo de trabalho</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Use teclas de atalho</li>
                      <li>• Crie templates de workspace</li>
                      <li>• Configure notificações</li>
                      <li>• Use busca avançada</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Dicas Avançadas</CardTitle>
                  <CardDescription>
                    Técnicas profissionais para usuários experientes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Organização</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Crie hierarquia clara de grupos</li>
                        <li>• Use nomenclatura consistente</li>
                        <li>• Arquivar projetos concluídos</li>
                        <li>• Mantenha workspace limpo</li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Automação</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Configure lembretes automáticos</li>
                        <li>• Use templates para tarefas repetitivas</li>
                        <li>• Integre com outras ferramentas</li>
                        <li>• Automatize relatórios</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Featured Tutorials */}
          <section className="mt-12">
            <h3 className="text-2xl font-bold mb-6">Tutoriais em Destaque</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Star className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Guia Completo para Iniciantes</CardTitle>
                      <CardDescription>Do zero ao primeiro projeto</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tutorial completo que te leva desde a criação da conta até a configuração do seu
                    primeiro projeto profissional.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      25 min
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      1.2k visualizações
                    </span>
                  </div>
                </CardContent>
                <div className="px-6 pb-6">
                  <Button className="w-full gap-2">
                    <Play className="h-4 w-4" />
                    Começar tutorial
                  </Button>
                </div>
              </Card>

              <Card className="border-2 border-green-500/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Metas que Funcionam</CardTitle>
                      <CardDescription>Como definir e alcançar objetivos</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Aprenda a definir metas eficazes e use o sistema de acompanhamento para manter a
                    motivação e alcançar seus objetivos.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      18 min
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      856 visualizações
                    </span>
                  </div>
                </CardContent>
                <div className="px-6 pb-6">
                  <Button className="w-full gap-2">
                    <FileText className="h-4 w-4" />
                    Ler guia
                  </Button>
                </div>
              </Card>
            </div>
          </section>

          {/* Next Steps */}
          <section className="bg-card border rounded-lg p-8 mt-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Pronto para começar?</h3>
              <p className="text-muted-foreground mb-6">
                Escolha um tutorial que mais se adequa ao seu objetivo e comece a usar o Catalyst
                hoje mesmo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login">
                  <Button className="gap-2">
                    Começar agora
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/docs/faq">
                  <Button variant="outline" className="gap-2">
                    Ver FAQ
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
