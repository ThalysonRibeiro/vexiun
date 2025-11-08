"use client";

import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Mail,
  User,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Download,
  RefreshCw,
  Target,
  Users
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTeam } from "@/hooks/use-team";
import { useItemsAssociatedWithMember } from "@/hooks/use-items";
import { useWorkspaceMemberData } from "@/hooks/use-workspace";
import { WorkspaceRole, Status } from "@/generated/prisma";
import { nameFallback } from "@/utils/name-fallback";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { MemberStats } from "../_components/member-stats";
import { WorkItemsList } from "../_components/work-items-list";
import { WorkspaceActivity } from "../_components/workspace-activity";
import { CollaborationNetwork } from "../_components/collaboration-network";
import { TaskCompletionChart } from "../_components/task-completion-chart";
import { toast } from "sonner";

const roleBadges = {
  OWNER: { label: "Proprietário", variant: "destructive" as const },
  ADMIN: { label: "Administrador", variant: "default" as const },
  MEMBER: { label: "Membro", variant: "secondary" as const },
  VIEWER: { label: "Visualizador", variant: "outline" as const }
};

interface MemberDetailContentProps {
  workspaceId: string;
  memberId: string;
}

export default function MemberDetailContent(props: MemberDetailContentProps) {
  const { workspaceId, memberId } = props;

  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: team = [], isLoading: isLoadingTeam } = useTeam(workspaceId);
  const {
    data: memberData,
    isLoading: isLoadingMemberData,
    refetch
  } = useWorkspaceMemberData(workspaceId);
  const { data: memberItems, isLoading: isLoadingItems } = useItemsAssociatedWithMember(
    workspaceId,
    memberId
  );

  const member = team.find((m) => m.user.id === memberId);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success("Dados atualizados com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar dados");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportData = () => {
    if (!member) return;

    const data = {
      member: member,
      dateRange,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `member-${member.user.name || "data"}-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Dados exportados com sucesso!");
  };

  if (isLoadingTeam || isLoadingMemberData || isLoadingItems) {
    return (
      <div className="container py-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="container py-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Membro não encontrado</h3>
            <p className="text-muted-foreground text-center max-w-md">
              O membro que você está procurando não foi encontrado neste workspace.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedTasks =
    memberItems?.items.filter((item) => item.status === Status.DONE).length || 0;
  const totalTasks = memberItems?.items.length || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="container py-4 mt-6 sm:py-6 space-y-4 sm:space-y-6">
      {/* Member Basic Information */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
              <AvatarImage src={member.user.image || undefined} alt={member.user.name || ""} />
              <AvatarFallback className="text-base sm:text-lg">
                {nameFallback(member.user.name || member.user.email)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold break-words">
                  {member.user.name || "Usuário"}
                </h1>
                <Badge variant={roleBadges[member.role].variant}>
                  {roleBadges[member.role].label}
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="break-all">{member.user.email}</span>
                </div>
                {memberItems?.member.joinedAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>
                      Membro desde{" "}
                      {format(new Date(memberItems.member.joinedAt), "dd 'de' MMMM 'de' yyyy", {
                        locale: ptBR
                      })}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  <span>{completionRate}% de conclusão</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <MemberStats memberId={memberId} workspaceId={workspaceId} dateRange={dateRange} />

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="tasks" className="text-xs sm:text-sm">
              Tarefas
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-xs sm:text-sm">
              Atividade
            </TabsTrigger>
            <TabsTrigger value="collaboration" className="text-xs sm:text-sm">
              Colaboração
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background text-sm"
            >
              <option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="90">Últimos 90 dias</option>
              <option value="1y">Último ano</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="hidden sm:flex"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
              Atualizar
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <MemberStats memberId={memberId} workspaceId={workspaceId} dateRange={dateRange} />
              <TaskCompletionChart
                memberId={memberId}
                workspaceId={workspaceId}
                dateRange={dateRange}
              />
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium text-green-900">Tarefas Concluídas</div>
                      <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    <div>
                      <div className="font-medium text-orange-900">Tarefas Pendentes</div>
                      <div className="text-2xl font-bold text-orange-600">
                        {totalTasks - completedTasks}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium text-blue-900">Taxa de Conclusão</div>
                      <div className="text-2xl font-bold text-blue-600">{completionRate}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Gerenciamento de Tarefas</h3>
              <p className="text-sm text-muted-foreground">
                Visualize e gerencie todas as tarefas do membro
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast.info("Funcionalidade de criação de tarefas em breve!");
                }}
              >
                <Target className="h-4 w-4 mr-2" />
                Nova Tarefa
              </Button>
            </div>
          </div>
          <WorkItemsList memberId={memberId} workspaceId={workspaceId} dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Atividade no Workspace</h3>
              <p className="text-sm text-muted-foreground">
                Acompanhe a atividade e contribuições do membro
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast.info("Funcionalidade de relatórios em breve!");
                }}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Gerar Relatório
              </Button>
            </div>
          </div>
          <WorkspaceActivity memberId={memberId} workspaceId={workspaceId} dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="collaboration" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Rede de Colaboração</h3>
              <p className="text-sm text-muted-foreground">
                Visualize as conexões e colaborações do membro com a equipe
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast.info("Funcionalidade de análise de rede em breve!");
                }}
              >
                <Users className="h-4 w-4 mr-2" />
                Analisar Rede
              </Button>
            </div>
          </div>
          <CollaborationNetwork memberId={memberId} workspaceId={workspaceId} detailed={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
