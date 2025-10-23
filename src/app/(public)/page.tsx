import { CardSignIn } from "@/components/card-signIn";
import Image from "next/image";
import logo_img from "@/assets/logo-goallist.png";
import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import Link from "next/link";
import { TestimonialsSectionMultipleRows } from "@/components/testimonials";
import { CatalystLogo } from "@/components/catalyst-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, BarChart3, Briefcase, CheckCircle, Clock, Code, Command, FileText, FolderGit2, Globe, Layers, LayoutDashboard, MessageSquare, Rocket, Settings, Share2, Shield, Users, Calendar, Zap, HelpCircle, Twitter, Linkedin, Github, Instagram } from "lucide-react";

export default async function Home() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className="relative overflow-x-hidden min-h-screen">
      <div className="absolute top-4 left-4">
        <CatalystLogo size="lg" />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[44px_44px]" />

      {/* Hero Section */}
      <section id="hero" className="relative container mx-auto px-4 pt-16 md:pt-24 pb-16 md:pb-20 flex flex-col items-center">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent -z-10 rounded-3xl"></div>

        <div className="flex flex-col lg:flex-row justify-between gap-8 md:gap-10 items-center w-full max-w-7xl">
          <div className="flex-1 flex flex-col text-left">
            <Badge variant="outline" className="w-fit mb-4 px-4 py-1 text-sm bg-primary/10 border-primary/20">
              Plataforma de Gerenciamento de Projetos
            </Badge>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-left bg-gradient-to-r from-primary via-orange-500 to-primary bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto] mb-4 md:mb-6">
              Gerencie múltiplos projetos e equipes em um só lugar
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground text-left mb-6 md:mb-8 max-w-2xl">
              O Catalyst é uma plataforma profissional para gerenciar projetos em equipe, permitindo que você organize diferentes equipes para cada projeto, acompanhe o progresso e aumente a produtividade da sua empresa.
            </p>

            <div className="flex flex-wrap gap-4 mb-6 md:mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm md:text-base">Múltiplos projetos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm md:text-base">Equipes personalizadas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm md:text-base">Controle de permissões</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm md:text-base">Métricas em tempo real</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                Começar agora <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Agendar demonstração
              </Button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center relative mt-8 lg:mt-0 w-full max-w-xl lg:max-w-none mx-auto">
            <div className="absolute -z-10 w-60 md:w-72 h-60 md:h-72 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="bg-card border rounded-lg shadow-lg p-4 md:p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-md bg-primary/20 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Workspace Principal</h3>
                    <p className="text-xs text-muted-foreground">3 projetos ativos</p>
                  </div>
                </div>
                <Badge>Administrador</Badge>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div className="bg-background border rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-sm">P1</div>
                      <h4 className="font-medium">Projeto Alpha</h4>
                    </div>
                    <Badge variant="outline" className="text-xs">8 membros</Badge>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>24 tarefas</span>
                    <span>75% concluído</span>
                  </div>
                </div>

                <div className="bg-background border rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-purple-500/20 flex items-center justify-center text-purple-500 font-bold text-sm">P2</div>
                      <h4 className="font-medium">Projeto Beta</h4>
                    </div>
                    <Badge variant="outline" className="text-xs">5 membros</Badge>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>16 tarefas</span>
                    <span>45% concluído</span>
                  </div>
                </div>

                <div className="bg-background border rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-green-500/20 flex items-center justify-center text-green-500 font-bold text-sm">P3</div>
                      <h4 className="font-medium">Projeto Gamma</h4>
                    </div>
                    <Badge variant="outline" className="text-xs">3 membros</Badge>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>9 tarefas</span>
                    <span>30% concluído</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-6">
                <CardSignIn />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mt-16">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold">1000+</span>
              <span className="text-sm text-muted-foreground">Equipes ativas</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
              <Briefcase className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold">5000+</span>
              <span className="text-sm text-muted-foreground">Projetos gerenciados</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
              <CheckCircle className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold">98%</span>
              <span className="text-sm text-muted-foreground">Satisfação dos clientes</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
              <Globe className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold">20+</span>
              <span className="text-sm text-muted-foreground">Países</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">Funcionalidades Principais</h2>
        <p className="text-xl text-muted-foreground text-center max-w-3xl mx-auto mb-16">
          Descubra como o Catalyst pode transformar seu fluxo de trabalho e aumentar a produtividade da sua equipe
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature Card 1 */}
          <Card className="border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Gestão de Equipes</CardTitle>
              <CardDescription>Organize equipes e atribua permissões facilmente</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Crie e gerencie equipes, convide membros e defina níveis de acesso personalizados para cada projeto.
              </p>
            </CardContent>
            <CardFooter>
              <Badge variant="outline" className="text-xs">Colaboração</Badge>
            </CardFooter>
          </Card>

          {/* Feature Card 2 */}
          <Card className="border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Workspaces</CardTitle>
              <CardDescription>Ambientes de trabalho personalizados</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Crie workspaces dedicados para diferentes projetos ou departamentos, mantendo tudo organizado.
              </p>
            </CardContent>
            <CardFooter>
              <Badge variant="outline" className="text-xs">Organização</Badge>
            </CardFooter>
          </Card>

          {/* Feature Card 3 */}
          <Card className="border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Gestão de Tarefas</CardTitle>
              <CardDescription>Acompanhe o progresso de forma visual</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Crie, atribua e acompanhe tarefas com status personalizados e visualização em kanban.
              </p>
            </CardContent>
            <CardFooter>
              <Badge variant="outline" className="text-xs">Produtividade</Badge>
            </CardFooter>
          </Card>

          {/* Feature Card 4 */}
          <Card className="border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Calendário Integrado</CardTitle>
              <CardDescription>Visualize prazos e eventos importantes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Acompanhe datas de entrega, reuniões e marcos importantes em um calendário integrado.
              </p>
            </CardContent>
            <CardFooter>
              <Badge variant="outline" className="text-xs">Planejamento</Badge>
            </CardFooter>
          </Card>

          {/* Feature Card 5 */}
          <Card className="border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Análise de Desempenho</CardTitle>
              <CardDescription>Métricas e insights valiosos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Visualize o desempenho da equipe com gráficos e relatórios detalhados sobre produtividade.
              </p>
            </CardContent>
            <CardFooter>
              <Badge variant="outline" className="text-xs">Analytics</Badge>
            </CardFooter>
          </Card>

          {/* Feature Card 6 */}
          <Card className="border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Acesso Remoto</CardTitle>
              <CardDescription>Trabalhe de qualquer lugar</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Acesse seus projetos e tarefas de qualquer dispositivo, ideal para equipes remotas e híbridas.
              </p>
            </CardContent>
            <CardFooter>
              <Badge variant="outline" className="text-xs">Flexibilidade</Badge>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-4 py-1 text-sm bg-primary/10 border-primary/20">
            Demonstração Interativa
          </Badge>
          <h2 className="text-3xl font-bold mb-4">Gerencie múltiplos projetos e equipes em uma única plataforma</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore como o Catalyst permite gerenciar diferentes projetos com equipes personalizadas, tudo em um só lugar.
          </p>
        </div>

        <Tabs defaultValue="workspaces" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
            <TabsTrigger value="projects">Projetos</TabsTrigger>
            <TabsTrigger value="teams">Equipes</TabsTrigger>
          </TabsList>

          <TabsContent value="workspaces" className="border rounded-lg p-6 bg-card">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-medium">Seus Workspaces</h3>
                <Button variant="outline" size="sm" className="gap-1">
                  <FolderGit2 className="h-4 w-4" /> Novo Workspace
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-2 border-primary/20">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-md bg-blue-500/20 flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-blue-500" />
                        </div>
                        <CardTitle>Desenvolvimento Web</CardTitle>
                      </div>
                      <Badge>8 projetos</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Workspace para projetos de desenvolvimento web e frontend.
                    </p>
                    <div className="flex justify-between text-sm">
                      <span>12 membros</span>
                      <span>Atualizado há 2 dias</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="ghost" size="sm">Gerenciar Workspace</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-md bg-purple-500/20 flex items-center justify-center">
                          <Code className="h-5 w-5 text-purple-500" />
                        </div>
                        <CardTitle>Backend API</CardTitle>
                      </div>
                      <Badge>5 projetos</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Workspace dedicado ao desenvolvimento de APIs e serviços backend.
                    </p>
                    <div className="flex justify-between text-sm">
                      <span>9 membros</span>
                      <span>Atualizado hoje</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="ghost" size="sm">Gerenciar Workspace</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-md bg-green-500/20 flex items-center justify-center">
                          <LayoutDashboard className="h-5 w-5 text-green-500" />
                        </div>
                        <CardTitle>Marketing Digital</CardTitle>
                      </div>
                      <Badge>3 projetos</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Workspace para campanhas de marketing e análise de dados.
                    </p>
                    <div className="flex justify-between text-sm">
                      <span>6 membros</span>
                      <span>Atualizado há 1 semana</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="ghost" size="sm">Gerenciar Workspace</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="border rounded-lg p-6 bg-card">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-md bg-blue-500/20 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-medium">Workspace: Desenvolvimento Web</h3>
                </div>
                <Button size="sm" className="gap-1">
                  <Layers className="h-4 w-4" /> Novo Projeto
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Redesign do Portal</CardTitle>
                      <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-300">Em andamento</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Redesign completo do portal corporativo com novo sistema de design.
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex -space-x-2">
                        <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center border-2 border-background">
                          <span className="text-xs">MS</span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center border-2 border-background">
                          <span className="text-xs">JR</span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center border-2 border-background">
                          <span className="text-xs">AC</span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-background border-2 border-background flex items-center justify-center">
                          <span className="text-xs">+2</span>
                        </div>
                      </div>
                      <span className="text-sm">Prazo: 15/07/2023</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Progresso: </span>
                      <span className="font-medium">65%</span>
                    </div>
                    <Button variant="ghost" size="sm">Ver detalhes</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>App Mobile</CardTitle>
                      <Badge variant="outline" className="bg-yellow-500/20 text-yellow-700 border-yellow-300">Planejamento</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Desenvolvimento do aplicativo mobile para iOS e Android.
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex -space-x-2">
                        <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center border-2 border-background">
                          <span className="text-xs">PA</span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center border-2 border-background">
                          <span className="text-xs">LM</span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-background border-2 border-background flex items-center justify-center">
                          <span className="text-xs">+1</span>
                        </div>
                      </div>
                      <span className="text-sm">Prazo: 30/08/2023</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Progresso: </span>
                      <span className="font-medium">15%</span>
                    </div>
                    <Button variant="ghost" size="sm">Ver detalhes</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="teams" className="border rounded-lg p-6 bg-card">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-medium">Equipes Personalizadas</h3>
                <Button size="sm" className="gap-1">
                  <Users className="h-4 w-4" /> Nova Equipe
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-md bg-blue-500/20 flex items-center justify-center">
                          <Code className="h-5 w-5 text-blue-500" />
                        </div>
                        <CardTitle>Desenvolvedores Frontend</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">React</Badge>
                      <Badge variant="outline">UI/UX</Badge>
                      <Badge variant="outline">TypeScript</Badge>
                    </div>
                    <div className="flex -space-x-2 mb-4">
                      <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center border-2 border-background">
                        <span className="text-xs">MS</span>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center border-2 border-background">
                        <span className="text-xs">JR</span>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center border-2 border-background">
                        <span className="text-xs">AC</span>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-background border-2 border-background flex items-center justify-center">
                        <span className="text-xs">+2</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Atribuída a 3 projetos ativos
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="ghost" size="sm">Gerenciar Equipe</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-md bg-purple-500/20 flex items-center justify-center">
                          <Settings className="h-5 w-5 text-purple-500" />
                        </div>
                        <CardTitle>Desenvolvedores Backend</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">Node.js</Badge>
                      <Badge variant="outline">API</Badge>
                      <Badge variant="outline">Database</Badge>
                    </div>
                    <div className="flex -space-x-2 mb-4">
                      <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center border-2 border-background">
                        <span className="text-xs">PA</span>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center border-2 border-background">
                        <span className="text-xs">LM</span>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center border-2 border-background">
                        <span className="text-xs">CM</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Atribuída a 2 projetos ativos
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="ghost" size="sm">Gerenciar Equipe</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-md bg-green-500/20 flex items-center justify-center">
                          <BarChart3 className="h-5 w-5 text-green-500" />
                        </div>
                        <CardTitle>Marketing & Design</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">Design</Badge>
                      <Badge variant="outline">Branding</Badge>
                      <Badge variant="outline">Analytics</Badge>
                    </div>
                    <div className="flex -space-x-2 mb-4">
                      <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center border-2 border-background">
                        <span className="text-xs">AC</span>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-teal-500/20 flex items-center justify-center border-2 border-background">
                        <span className="text-xs">RM</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Atribuída a 1 projeto ativo
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="ghost" size="sm">Gerenciar Equipe</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-4 py-1 text-sm bg-primary/10 border-primary/20">
            Perguntas Frequentes
          </Badge>
          <h2 className="text-3xl font-bold mb-4">Tire suas dúvidas sobre o Catalyst</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Encontre respostas para as perguntas mais comuns sobre nossa plataforma de gerenciamento de projetos.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                Como o Catalyst gerencia múltiplos projetos e equipes?
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground mb-2">
                  O Catalyst utiliza um sistema de workspaces que permite organizar múltiplos projetos e atribuir equipes específicas a cada um deles. Você pode:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Criar workspaces para diferentes departamentos ou clientes</li>
                  <li>Configurar projetos dentro de cada workspace com suas próprias metas e prazos</li>
                  <li>Formar equipes personalizadas com membros específicos para cada projeto</li>
                  <li>Definir permissões e níveis de acesso para cada membro da equipe</li>
                  <li>Acompanhar o progresso de todos os projetos em um único dashboard</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                Quantos projetos e membros posso adicionar na plataforma?
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">
                  O Catalyst oferece planos flexíveis que se adaptam ao tamanho da sua empresa. No plano básico, você pode gerenciar até 5 projetos com 10 membros. Nos planos Profissional e Empresarial, não há limites para o número de projetos ou membros que você pode adicionar, permitindo que sua equipe cresça sem restrições.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                Como funciona o controle de permissões para diferentes equipes?
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">
                  O Catalyst possui um sistema avançado de controle de permissões que permite definir exatamente o que cada membro pode ver e editar. Você pode atribuir papéis como Administrador, Gerente de Projeto, Membro da Equipe ou Visualizador, cada um com diferentes níveis de acesso. Além disso, é possível personalizar permissões específicas para cada projeto, garantindo que as informações sensíveis sejam acessadas apenas por quem precisa.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">
                É possível integrar o Catalyst com outras ferramentas que já utilizamos?
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">
                  Sim, o Catalyst oferece integrações nativas com mais de 30 ferramentas populares, incluindo GitHub, Slack, Microsoft Teams, Google Workspace, Jira e muitas outras. Nossa API aberta também permite criar integrações personalizadas para ferramentas específicas do seu fluxo de trabalho. Isso garante que o Catalyst se adapte perfeitamente ao ecossistema de ferramentas que sua equipe já utiliza.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">
                Como o Catalyst ajuda a melhorar a produtividade da equipe?
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground mb-2">
                  O Catalyst foi projetado para eliminar obstáculos e otimizar o fluxo de trabalho das equipes através de:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Centralização de todas as informações e recursos do projeto em um único lugar</li>
                  <li>Automação de tarefas repetitivas e notificações</li>
                  <li>Visualização clara do progresso e gargalos em tempo real</li>
                  <li>Ferramentas de colaboração que reduzem a necessidade de reuniões excessivas</li>
                  <li>Relatórios e métricas que ajudam a identificar oportunidades de melhoria</li>
                </ul>
                <p className="text-muted-foreground mt-2">
                  Nossos clientes relatam um aumento médio de 35% na produtividade após três meses de uso da plataforma.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left">
                O Catalyst oferece suporte para metodologias ágeis?
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">
                  Sim, o Catalyst suporta completamente metodologias ágeis como Scrum e Kanban. A plataforma inclui recursos como quadros Kanban personalizáveis, planejamento de sprints, backlogs de produto, estimativas de pontos de história, gráficos de burndown e retrospectivas. Você pode adaptar esses recursos para seguir rigorosamente uma metodologia específica ou criar um processo híbrido que melhor atenda às necessidades da sua equipe.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="container mx-auto px-4 py-20 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent -z-10 rounded-3xl"></div>

        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-1 text-sm bg-primary/10 border-primary/20">
            Vantagens Exclusivas
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que escolher o Catalyst?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Nossa plataforma foi projetada para equipes que gerenciam múltiplos projetos e precisam de organização e eficiência.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="flex gap-4 bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Aumento de Produtividade</h3>
              <p className="text-muted-foreground">
                Reduza o tempo gasto em gerenciamento de tarefas e aumente o foco no desenvolvimento com ferramentas otimizadas.
              </p>
            </div>
          </div>

          <div className="flex gap-4 bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Colaboração Eficiente</h3>
              <p className="text-muted-foreground">
                Facilite a comunicação entre equipes e mantenha todos alinhados com os objetivos do projeto.
              </p>
            </div>
          </div>

          <div className="flex gap-4 bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Segurança Avançada</h3>
              <p className="text-muted-foreground">
                Proteja seus dados com controle de acesso granular e criptografia de ponta a ponta.
              </p>
            </div>
          </div>

          <div className="flex gap-4 bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Economia de Tempo</h3>
              <p className="text-muted-foreground">
                Automatize processos repetitivos e foque no que realmente importa para seu negócio.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Button size="lg" className="gap-2">
            Conheça todos os recursos <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-16">O que os desenvolvedores dizem</h2>
        <TestimonialsSectionMultipleRows maxRows={2} />
      </section>

      {/* CTA Section */}
      <section id="cta" className="container mx-auto px-4 py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl -z-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-3xl mx-auto">
          <Badge variant="outline" className="mb-6 px-4 py-1 text-sm bg-primary/10 border-primary/20">
            Comece Hoje
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Transforme a gestão de projetos da sua equipe</h2>
          <p className="text-muted-foreground mb-10 text-lg max-w-2xl mx-auto">
            Junte-se a centenas de equipes que já aumentaram sua produtividade e organização com o Catalyst.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <CardSignIn />
            <Button size="lg" variant="outline" className="text-base px-8 py-6 gap-2">
              <Calendar className="h-5 w-5" />
              Agendar demonstração
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            Não é necessário cartão de crédito • Plano gratuito disponível • Cancelamento a qualquer momento
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-16 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <CatalystLogo size="sm" />
                <span className="text-xl font-bold">Catalyst</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                Plataforma completa para gerenciamento de projetos em equipe,
                permitindo colaboração eficiente e visibilidade em tempo real.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                  <Github className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                  <Instagram className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-lg">Produto</h3>
              <ul className="space-y-4">
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Funcionalidades</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Preços</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Integrações</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Roadmap</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Atualizações</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-lg">Recursos</h3>
              <ul className="space-y-4">
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Documentação</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Tutoriais</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Comunidade</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Webinars</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-lg">Empresa</h3>
              <ul className="space-y-4">
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Sobre nós</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Carreiras</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Contato</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Imprensa</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Parceiros</Link></li>
              </ul>
            </div>
          </div>

          <Separator className="mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <span className="text-sm text-muted-foreground">© {new Date().getFullYear()} Catalyst. Todos os direitos reservados.</span>
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Termos de Serviço
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Política de Privacidade
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Preferências de Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}