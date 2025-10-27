import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Play,
  Users,
  Target,
  Briefcase,
  HelpCircle,
  ArrowRight,
  Search,
  CheckCircle,
  Clock,
  Zap,
  Shield,
  BarChart3,
  Settings,
  MessageSquare,
  FileText,
  Video,
  Lightbulb
} from "lucide-react";

export const metadata: Metadata = {
  title: "Documentação - Catalyst",
  description: "Aprenda a usar o Catalyst para gerenciar projetos e metas pessoais de forma eficiente",
  keywords: ["documentação", "tutorial", "guia", "ajuda", "catalyst", "projetos", "metas"],
};

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Documentação</h1>
              <p className="text-muted-foreground mt-2">
                Aprenda a usar o Catalyst para maximizar sua produtividade
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
              <Link href="/login">
                <Button size="sm">
                  Começar agora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="sticky top-8 space-y-2">
              <div className="space-y-1">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                  Começando
                </h3>
                <Link href="#primeiros-passos" className="block text-sm hover:text-primary transition-colors">
                  Primeiros passos
                </Link>
                <Link href="#criando-workspace" className="block text-sm hover:text-primary transition-colors">
                  Criando workspace
                </Link>
                <Link href="#primeira-meta" className="block text-sm hover:text-primary transition-colors">
                  Primeira meta
                </Link>
              </div>

              <Separator className="my-4" />

              <div className="space-y-1">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                  Funcionalidades
                </h3>
                <Link href="#workspaces" className="block text-sm hover:text-primary transition-colors">
                  Workspaces
                </Link>
                <Link href="#grupos" className="block text-sm hover:text-primary transition-colors">
                  Grupos
                </Link>
                <Link href="#metas" className="block text-sm hover:text-primary transition-colors">
                  Metas pessoais
                </Link>
                <Link href="#equipes" className="block text-sm hover:text-primary transition-colors">
                  Colaboração
                </Link>
              </div>

              <Separator className="my-4" />

              <div className="space-y-1">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                  Tutoriais
                </h3>
                <Link href="#casos-uso" className="block text-sm hover:text-primary transition-colors">
                  Casos de uso
                </Link>
                <Link href="#dicas" className="block text-sm hover:text-primary transition-colors">
                  Dicas e truques
                </Link>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Hero Section */}
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <BookOpen className="h-4 w-4" />
                Centro de Ajuda
              </div>
              <h2 className="text-4xl font-bold mb-4">
                Aprenda a usar o Catalyst
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Guias completos para dominar todas as funcionalidades da plataforma e maximizar sua produtividade
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2">
                  <Play className="h-4 w-4" />
                  Ver tutoriais
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Falar com suporte
                </Button>
              </div>
            </div>

            {/* Quick Start Cards */}
            <section id="primeiros-passos">
              <h3 className="text-2xl font-bold mb-6">🚀 Primeiros Passos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Criar seu primeiro workspace</CardTitle>
                        <CardDescription>Configure um projeto do zero</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Aprenda a criar workspaces, organizar grupos e começar a gerenciar seu primeiro projeto.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>5 min de leitura</span>
                    </div>
                  </CardContent>
                  <div className="px-6 pb-6">
                    <Button variant="outline" size="sm" className="w-full">
                      Ler guia
                    </Button>
                  </div>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <Target className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Definir metas pessoais</CardTitle>
                        <CardDescription>Acompanhe seu progresso semanal</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Configure suas metas semanais e acompanhe seu progresso de forma visual e motivadora.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>3 min de leitura</span>
                    </div>
                  </CardContent>
                  <div className="px-6 pb-6">
                    <Button variant="outline" size="sm" className="w-full">
                      Ler guia
                    </Button>
                  </div>
                </Card>
              </div>
            </section>

            {/* Features Section */}
            <section id="funcionalidades">
              <h3 className="text-2xl font-bold mb-6">📋 Funcionalidades Principais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <CardTitle>Workspaces</CardTitle>
                        <CardDescription>Organize projetos em espaços dedicados</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Criar múltiplos projetos</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Convidar membros da equipe</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Definir permissões</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <CardTitle>Colaboração</CardTitle>
                        <CardDescription>Trabalhe em equipe de forma eficiente</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Compartilhar workspaces</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Atribuir tarefas</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Acompanhar progresso</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Tutorials Section */}
            <section id="tutoriais">
              <h3 className="text-2xl font-bold mb-6">🎯 Tutoriais Práticos</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Projeto de Desenvolvimento</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Como organizar um projeto de desenvolvimento web com equipe.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Video className="h-3 w-3" />
                      <span>Vídeo tutorial</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <Target className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Metas de Estudo</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Como usar metas pessoais para acelerar seu aprendizado.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      <span>Guia escrito</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Projeto de Marketing</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Organize campanhas de marketing e acompanhe resultados.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Video className="h-3 w-3" />
                      <span>Vídeo tutorial</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* FAQ Section */}
            <section id="faq">
              <h3 className="text-2xl font-bold mb-6">❓ Perguntas Frequentes</h3>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Como funciona o sistema de workspaces?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Workspaces são espaços dedicados para cada projeto. Você pode criar múltiplos workspaces,
                      convidar membros específicos para cada um e organizar tarefas em grupos personalizados.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quantos projetos posso ter?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      No plano gratuito você pode ter até 3 workspaces. Nos planos pagos, não há limite para
                      o número de projetos que você pode gerenciar.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Como funcionam as metas pessoais?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      As metas pessoais são objetivos semanais que você define para si mesmo.
                      Você pode acompanhar seu progresso visualmente e manter a motivação para alcançar seus objetivos.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Support Section */}
            <section className="bg-card border rounded-lg p-8 text-center">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-4">Precisa de mais ajuda?</h3>
                <p className="text-muted-foreground mb-6">
                  Nossa equipe de suporte está pronta para ajudar você a maximizar o uso do Catalyst.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Falar com suporte
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Enviar feedback
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
