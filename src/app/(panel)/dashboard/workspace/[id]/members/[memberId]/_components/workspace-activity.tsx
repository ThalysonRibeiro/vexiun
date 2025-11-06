"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  GitCommit, 
  GitPullRequest, 
  MessageSquare, 
  Users, 
  Clock, 
  TrendingUp,
  Calendar,
  Activity
} from "lucide-react";
import { useTeam } from "@/hooks/use-team";
import { useItemsAssociatedWithMember } from "@/hooks/use-items";
import { format, differenceInDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface WorkspaceActivityProps {
  memberId: string;
  workspaceId: string;
  dateRange?: string;
}

interface ActivityData {
  date: string;
  commits: number;
  pullRequests: number;
  comments: number;
  meetings: number;
}

// Mock data generator for activity timeline
const generateMockActivity = (memberId: string, days: number = 30): ActivityData[] => {
  const activities: ActivityData[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = subDays(today, i);
    const baseActivity = Math.random() > 0.3 ? Math.floor(Math.random() * 15) + 1 : 0;
    
    activities.push({
      date: format(date, "yyyy-MM-dd"),
      commits: Math.floor(Math.random() * 8),
      pullRequests: Math.floor(Math.random() * 3),
      comments: Math.floor(Math.random() * 12),
      meetings: Math.floor(Math.random() * 2)
    });
  }
  
  return activities.reverse();
};

export function WorkspaceActivity({ memberId, workspaceId }: WorkspaceActivityProps) {
  const { data: teamData } = useTeam(workspaceId);
  const { data: memberItems } = useItemsAssociatedWithMember(workspaceId, memberId);
  const [selectedPeriod, setSelectedPeriod] = useState<"7" | "30" | "90">("30");
  
  // Mock activity data
  const activityData = generateMockActivity(memberId, parseInt(selectedPeriod));
  const totalActivity = activityData.reduce((acc, day) => ({
    commits: acc.commits + day.commits,
    pullRequests: acc.pullRequests + day.pullRequests,
    comments: acc.comments + day.comments,
    meetings: acc.meetings + day.meetings
  }), { commits: 0, pullRequests: 0, comments: 0, meetings: 0 });

  const currentMember = teamData?.find(member => member.user.id === memberId);
  const memberStats = {
    totalTasks: memberItems?.items.length || 0,
    completedTasks: memberItems?.items.filter(item => item.status === "DONE").length || 0,
    activeDays: Math.floor(Math.random() * 20) + 10, // Mock data
    collaborationScore: Math.floor(Math.random() * 100) + 1
  };

  const getActivityLevel = (activity: number) => {
    if (activity >= 20) return "high";
    if (activity >= 10) return "medium";
    return "low";
  };

  const getActivityColor = (level: string) => {
    switch (level) {
      case "high": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-red-500";
      default: return "bg-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Activity Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Atividade no Workspace
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={selectedPeriod === "7" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("7")}
            >
              7 dias
            </Button>
            <Button
              variant={selectedPeriod === "30" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("30")}
            >
              30 dias
            </Button>
            <Button
              variant={selectedPeriod === "90" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("90")}
            >
              90 dias
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <GitCommit className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{totalActivity.commits}</div>
              <div className="text-sm text-muted-foreground">Commits</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <GitPullRequest className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{totalActivity.pullRequests}</div>
              <div className="text-sm text-muted-foreground">Pull Requests</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">{totalActivity.comments}</div>
              <div className="text-sm text-muted-foreground">Comentários</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold">{totalActivity.meetings}</div>
              <div className="text-sm text-muted-foreground">Reuniões</div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="space-y-2">
            <h4 className="font-medium mb-3">Linha do Tempo de Atividade</h4>
            <div className="space-y-1">
              {activityData.slice(-14).map((day, index) => {
                const totalDayActivity = day.commits + day.pullRequests + day.comments + day.meetings;
                const activityLevel = getActivityLevel(totalDayActivity);
                
                return (
                  <div key={day.date} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/50">
                    <div className="text-sm text-muted-foreground w-20">
                      {format(new Date(day.date), "dd/MM", { locale: ptBR })}
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full", getActivityColor(activityLevel))} />
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className={cn("h-full transition-all duration-300", getActivityColor(activityLevel))}
                          style={{ width: `${Math.min(100, (totalDayActivity / 25) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm font-medium w-12 text-right">
                      {totalDayActivity}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Member Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Estatísticas de Produtividade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Taxa de Conclusão</span>
                <Badge variant="outline">
                  {memberStats.totalTasks > 0 ? Math.round((memberStats.completedTasks / memberStats.totalTasks) * 100) : 0}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Dias Ativos</span>
                <Badge variant="outline">
                  {memberStats.activeDays}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Score de Colaboração</span>
                <Badge variant="outline" className={cn(
                  memberStats.collaborationScore >= 80 ? "bg-green-100 text-green-800" :
                  memberStats.collaborationScore >= 60 ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                )}>
                  {memberStats.collaborationScore}/100
                </Badge>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Tempo Médio de Resposta</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {Math.floor(Math.random() * 24) + 1}h
                </div>
                <div className="text-sm text-blue-700">
                  Últimas 24 horas
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-900">Colaborações Ativas</span>
                </div>
                <div className="text-2xl font-bold text-green-900">
                  {Math.floor(Math.random() * 15) + 5}
                </div>
                <div className="text-sm text-green-700">
                  Com outros membros
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Atividades Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: "Completou a tarefa", item: "Implementar dashboard de métricas", time: "2 horas atrás", type: "task" },
              { action: "Comentou em", item: "Revisão de código - API de autenticação", time: "4 horas atrás", type: "comment" },
              { action: "Criou pull request", item: "Feature: Adicionar exportação de relatórios", time: "6 horas atrás", type: "pr" },
              { action: "Atualizou status", item: "Corrigir bug no formulário de cadastro", time: "8 horas atrás", type: "status" },
              { action: "Participou da reunião", item: "Planejamento Sprint 23", time: "1 dia atrás", type: "meeting" }
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 py-3 border-b last:border-b-0">
                <div className={cn(
                  "w-2 h-2 rounded-full mt-2",
                  activity.type === "task" ? "bg-green-500" :
                  activity.type === "comment" ? "bg-blue-500" :
                  activity.type === "pr" ? "bg-purple-500" :
                  activity.type === "status" ? "bg-yellow-500" :
                  "bg-orange-500"
                )} />
                <div className="flex-1">
                  <div className="text-sm">
                    <span className="font-medium">{activity.action}</span>
                    <span className="text-muted-foreground ml-1">{activity.item}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}