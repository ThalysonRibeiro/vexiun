import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  MessageSquare,
  HelpCircle,
  CheckCircle,
  Users,
  Briefcase,
  Target,
  Settings,
  Shield,
  BarChart3,
  Zap,
  Clock,
  Globe,
  Mail,
  Phone
} from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ - Documentação Catalyst",
  description: "Perguntas frequentes e respostas sobre o Catalyst",
};

export default function FAQPage() {
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
              <h1 className="text-3xl font-bold">Perguntas Frequentes</h1>
              <p className="text-muted-foreground mt-2">
                Encontre respostas para as dúvidas mais comuns sobre o Catalyst
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar perguntas..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Categorias</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <Briefcase className="h-5 w-5" />
                <span className="text-sm">Workspaces</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <Target className="h-5 w-5" />
                <span className="text-sm">Metas</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <Users className="h-5 w-5" />
                <span className="text-sm">Equipe</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                <Settings className="h-5 w-5" />
                <span className="text-sm">Configurações</span>
              </Button>
            </div>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-8">
            {/* Getting Started */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                Primeiros Passos
              </h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">
                    Como criar minha primeira conta no Catalyst?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground mb-4">
                      Criar uma conta no Catalyst é muito simples:
                    </p>
                    <ol className="space-y-2 text-muted-foreground">
                      <li>1. Acesse a página de login</li>
                      <li>2. Escolha seu método de autenticação preferido (Google, GitHub ou email)</li>
                      <li>3. Complete seu perfil com informações básicas</li>
                      <li>4. Confirme seu email (se necessário)</li>
                      <li>5. Comece criando seu primeiro workspace!</li>
                    </ol>
                    <p className="text-muted-foreground mt-4">
                      Todo o processo leva menos de 2 minutos e você já pode começar a usar todas as funcionalidades.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">
                    Qual é a diferença entre workspace e grupo?
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          Workspace
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Um workspace é como um projeto ou departamento. É o nível mais alto de organização,
                          onde você pode ter múltiplos grupos e convidar membros da equipe.
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Grupo
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Grupos são categorias dentro de um workspace. Use para organizar tarefas por tipo,
                          prioridade ou equipe responsável.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">
                    Posso usar o Catalyst gratuitamente?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground mb-4">
                      Sim! O Catalyst oferece um plano gratuito que inclui:
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Até 3 workspaces</li>
                      <li>• Até 10 membros por workspace</li>
                      <li>• Metas pessoais ilimitadas</li>
                      <li>• Todas as funcionalidades básicas</li>
                      <li>• Suporte por email</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      Para equipes maiores ou funcionalidades avançadas, oferecemos planos pagos com recursos adicionais.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            {/* Workspaces */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-blue-500" />
                Workspaces e Projetos
              </h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">
                    Como funciona o sistema de workspaces?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground mb-4">
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

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">
                    Quantos projetos e membros posso adicionar na plataforma?
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Plano Gratuito</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Até 3 workspaces</li>
                          <li>• Até 10 membros por workspace</li>
                          <li>• Tarefas ilimitadas</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Planos Pagos</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Workspaces ilimitados</li>
                          <li>• Membros ilimitados</li>
                          <li>• Funcionalidades avançadas</li>
                          <li>• Suporte prioritário</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-left">
                    Como organizar tarefas em grupos?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground mb-4">
                      Grupos são a melhor forma de organizar tarefas dentro de um workspace. Aqui estão algumas estratégias:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Por Funcionalidade</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Frontend</li>
                          <li>• Backend</li>
                          <li>• Design</li>
                          <li>• Testes</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Por Prioridade</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Urgente</li>
                          <li>• Alta</li>
                          <li>• Média</li>
                          <li>• Baixa</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            {/* Goals */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Target className="h-6 w-6 text-green-500" />
                Metas Pessoais
              </h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-7">
                  <AccordionTrigger className="text-left">
                    Como funcionam as metas pessoais?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground mb-4">
                      As metas pessoais são objetivos semanais que você define para si mesmo. O sistema permite:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Definir metas com frequência semanal (ex: "Estudar React 3x/semana")</li>
                      <li>Acompanhar progresso visual com gráficos e estatísticas</li>
                      <li>Receber lembretes e notificações</li>
                      <li>Ver histórico de conquistas e evolução</li>
                      <li>Categorizar metas por área (profissional, saúde, educação, etc.)</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger className="text-left">
                    Posso ter metas de diferentes categorias?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground mb-4">
                      Sim! O Catalyst permite criar metas em diferentes categorias para organizar todos os aspectos da sua vida:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold">Categorias Disponíveis:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Profissional</li>
                          <li>• Saúde</li>
                          <li>• Educação</li>
                          <li>• Pessoal</li>
                          <li>• Hobbies</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Exemplos de Metas:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Estudar programação 5x/semana</li>
                          <li>• Exercitar-se 4x/semana</li>
                          <li>• Ler 2 livros por mês</li>
                          <li>• Meditar diariamente</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            {/* Team Collaboration */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Users className="h-6 w-6 text-purple-500" />
                Colaboração em Equipe
              </h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-9">
                  <AccordionTrigger className="text-left">
                    Como funciona o controle de permissões para diferentes equipes?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground mb-4">
                      O Catalyst possui um sistema avançado de controle de permissões que permite definir exatamente o que cada membro pode ver e editar:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2 text-red-600">Administrador</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Controle total do workspace</li>
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
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-10">
                  <AccordionTrigger className="text-left">
                    Como convidar membros para um workspace?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground mb-4">
                      Convidar membros é simples e pode ser feito de várias formas:
                    </p>
                    <ol className="space-y-2 text-muted-foreground">
                      <li>1. Acesse as configurações do workspace</li>
                      <li>2. Clique em "Convidar Membros"</li>
                      <li>3. Digite o email do membro</li>
                      <li>4. Escolha o nível de permissão</li>
                      <li>5. Envie o convite</li>
                    </ol>
                    <p className="text-muted-foreground mt-4">
                      O membro receberá um email com instruções para aceitar o convite e começar a colaborar.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            {/* Technical */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Settings className="h-6 w-6 text-orange-500" />
                Questões Técnicas
              </h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-11">
                  <AccordionTrigger className="text-left">
                    É possível integrar o Catalyst com outras ferramentas?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground mb-4">
                      Sim! O Catalyst oferece integrações nativas com mais de 30 ferramentas populares, incluindo:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>GitHub - Para sincronizar com repositórios</li>
                      <li>Slack - Para notificações e comunicação</li>
                      <li>Microsoft Teams - Para colaboração</li>
                      <li>Google Workspace - Para documentos e calendário</li>
                      <li>Jira - Para sincronização de tarefas</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      Nossa API aberta também permite criar integrações personalizadas para ferramentas específicas do seu fluxo de trabalho.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-12">
                  <AccordionTrigger className="text-left">
                    Como o Catalyst ajuda a melhorar a produtividade da equipe?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground mb-4">
                      O Catalyst foi projetado para eliminar obstáculos e otimizar o fluxo de trabalho das equipes através de:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Centralização de todas as informações e recursos do projeto em um único lugar</li>
                      <li>Automação de tarefas repetitivas e notificações</li>
                      <li>Visualização clara do progresso e gargalos em tempo real</li>
                      <li>Ferramentas de colaboração que reduzem a necessidade de reuniões excessivas</li>
                      <li>Relatórios e métricas que ajudam a identificar oportunidades de melhoria</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      Nossos clientes relatam um aumento médio de 35% na produtividade após três meses de uso da plataforma.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-13">
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
            </section>
          </div>

          {/* Contact Support */}
          <section className="bg-card border rounded-lg p-8 mt-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Não encontrou sua resposta?</h3>
              <p className="text-muted-foreground mb-6">
                Nossa equipe de suporte está pronta para ajudar você a resolver qualquer dúvida.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Chat ao Vivo</h4>
                      <p className="text-sm text-muted-foreground">Seg-Sex, 9h-18h</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Iniciar chat
                  </Button>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <p className="text-sm text-muted-foreground">Resposta em 24h</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Enviar email
                  </Button>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <HelpCircle className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Base de Conhecimento</h4>
                      <p className="text-sm text-muted-foreground">Artigos detalhados</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Explorar
                  </Button>
                </Card>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
