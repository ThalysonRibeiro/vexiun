"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useItemsAssociatedWithMember } from "@/hooks/use-items";
import { Status } from "@/generated/prisma";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { CheckCircle2, Clock, AlertCircle, Circle } from "lucide-react";
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { colorStatus } from "@/utils/colorStatus";

interface TaskCompletionChartProps {
  memberId: string;
  workspaceId: string;
  dateRange: string;
}

const STATUS_COLORS = {
  [Status.DONE]: "#10b981",
  [Status.IN_PROGRESS]: "#3b82f6",
  [Status.NOT_STARTED]: "#6b7280",
  [Status.STOPPED]: "#f59e0b"
};

const STATUS_LABELS = {
  [Status.DONE]: "Concluído",
  [Status.IN_PROGRESS]: "Em Andamento",
  [Status.NOT_STARTED]: "Não Iniciado",
  [Status.STOPPED]: "Interrompido"
};

export function TaskCompletionChart({ memberId, workspaceId, dateRange }: TaskCompletionChartProps) {
  const { data: memberItems, isLoading } = useItemsAssociatedWithMember(workspaceId, memberId);

  if (isLoading || !memberItems) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Progresso de Tarefas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const items = memberItems.items;
  
  // Get date range filter
  const getDateFilter = () => {
    const now = new Date();
    switch (dateRange) {
      case "7":
        return subDays(now, 7);
      case "30":
        return subDays(now, 30);
      case "90":
        return subDays(now, 90);
      case "1y":
        return subDays(now, 365);
      default:
        return subDays(now, 30);
    }
  };

  const startDate = getDateFilter();
  
  // Filter items by date range (assuming items have createdAt or updatedAt)
  const filteredItems = items.filter(item => {
    const itemDate = new Date(item.term);
    return itemDate >= startDate;
  });

  // Calculate status counts
  const statusCounts = filteredItems.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<Status, number>);

  // Prepare data for charts
  const pieChartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: STATUS_LABELS[status as Status],
    value: count,
    status: status as Status
  }));

  // Daily progress data (last 7 days)
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date()
  });

  const dailyData = last7Days.map(day => {
    const dayItems = items.filter(item => {
      const itemDate = new Date(item.term);
      return format(itemDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });

    const completed = dayItems.filter(item => item.status === Status.DONE).length;
    const total = dayItems.length;

    return {
      day: format(day, 'dd/MM'),
      completed,
      total,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  });

  const totalTasks = filteredItems.length;
  const completedTasks = statusCounts[Status.DONE] || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case Status.DONE:
        return <CheckCircle2 className="h-4 w-4" />;
      case Status.IN_PROGRESS:
        return <Clock className="h-4 w-4" />;
      case Status.NOT_STARTED:
        return <Circle className="h-4 w-4" />;
      case Status.STOPPED:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Tarefas</p>
                <p className="text-2xl font-bold">{totalTasks}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tarefas Concluídas</p>
                <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
                <p className="text-2xl font-bold text-purple-600">{completionRate}%</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Distribuição por Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} tarefas`, 'Quantidade']} />
                  <Legend 
                    formatter={(value, entry) => (
                      <span style={{ color: entry.color }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Nenhuma tarefa encontrada no período
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Progress Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Progresso Diário (Últimos 7 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyData}>
                <XAxis 
                  dataKey="day" 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#27272a", 
                    border: "none", 
                    borderRadius: "8px" 
                  }}
                  labelStyle={{ color: "#fff" }}
                  formatter={(value, name) => {
                    if (name === 'completed') return [`${value}`, 'Concluídas'];
                    if (name === 'total') return [`${value}`, 'Total'];
                    return [value, name];
                  }}
                />
                <Bar 
                  dataKey="completed" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]} 
                  name="completed"
                />
                <Bar 
                  dataKey="total" 
                  fill="#6b7280" 
                  radius={[4, 4, 0, 0]} 
                  name="total"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Detalhamento por Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(STATUS_LABELS).map(([status, label]) => {
              const count = statusCounts[status as Status] || 0;
              const percentage = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
              
              return (
                <div 
                  key={status} 
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-8 w-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${STATUS_COLORS[status as Status]}20` }}
                    >
                      <div style={{ color: STATUS_COLORS[status as Status] }}>
                        {getStatusIcon(status as Status)}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{label}</p>
                      <p className="text-xs text-muted-foreground">
                        {count} tarefas ({percentage}%)
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}