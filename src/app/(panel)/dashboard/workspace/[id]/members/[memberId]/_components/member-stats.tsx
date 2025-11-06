"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Calendar,
  Activity 
} from "lucide-react";
import { useItemsAssociatedWithMember } from "@/hooks/use-items";
import { Status } from "@/generated/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MemberStatsProps {
  memberId: string;
  workspaceId: string;
  dateRange: string;
}

export function MemberStats({ memberId, workspaceId, dateRange }: MemberStatsProps) {
  const { data: memberItems, isLoading } = useItemsAssociatedWithMember(workspaceId, memberId);

  if (isLoading || !memberItems) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carregando...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const items = memberItems.items;
  const completedTasks = items.filter(item => item.status === Status.DONE).length;
  const inProgressTasks = items.filter(item => item.status === Status.IN_PROGRESS).length;
  const pendingTasks = items.filter(item => item.status === Status.NOT_STARTED).length;
  const overdueTasks = items.filter(item => {
    if (item.status === Status.DONE) return false;
    return new Date(item.term) < new Date();
  }).length;

  const totalTasks = items.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate average completion time (mock data for demonstration)
  const avgCompletionTime = totalTasks > 0 ? "2.5 dias" : "—";

  // Calculate activity score (mock calculation)
  const activityScore = Math.min(100, Math.round((completedTasks * 10) + (inProgressTasks * 5)));

  const stats = [
    {
      title: "Total de Tarefas",
      value: totalTasks.toString(),
      icon: Calendar,
      description: "Tarefas atribuídas",
      color: "text-blue-600"
    },
    {
      title: "Taxa de Conclusão",
      value: `${completionRate}%`,
      icon: TrendingUp,
      description: completedTasks > 0 ? `${completedTasks} concluídas` : "Nenhuma concluída",
      color: completionRate >= 80 ? "text-green-600" : completionRate >= 60 ? "text-yellow-600" : "text-red-600"
    },
    {
      title: "Tempo Médio",
      value: avgCompletionTime,
      icon: Clock,
      description: "Para concluir tarefas",
      color: "text-purple-600"
    },
    {
      title: "Pontuação de Atividade",
      value: activityScore.toString(),
      icon: Activity,
      description: "Nível de produtividade",
      color: activityScore >= 80 ? "text-green-600" : activityScore >= 60 ? "text-yellow-600" : "text-red-600"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}