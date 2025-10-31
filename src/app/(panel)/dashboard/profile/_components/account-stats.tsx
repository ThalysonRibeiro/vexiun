"use client";

import { Calendar, Clock, Database, TrendingUp } from "lucide-react";
import { UserWithCounts } from "../types/profile-types";
import { GoalCompletions } from "@/generated/prisma";

export default function AccountStats({ detailUser }: { detailUser: UserWithCounts }) {
  const accountAge = Math.floor(
    (new Date().getTime() - detailUser.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  const lastUpdated = Math.floor(
    (new Date().getTime() - detailUser.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  const stats = [
    {
      icon: Calendar,
      label: "Membro desde",
      value: detailUser.createdAt.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }),
      subtitle: `${accountAge} dias atrás`,
      color: "blue"
    },
    {
      icon: Clock,
      label: "Última atualização",
      value: detailUser.updatedAt.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "short",
        day: "numeric"
      }),
      subtitle: lastUpdated === 0 ? "Hoje" : `${lastUpdated} dias atrás`,
      color: "green"
    },
    {
      icon: Database,
      label: "ID do usuário",
      value: detailUser.id.substring(0, 5) + "...",
      subtitle: "Identificador único do usuário no sistema",
      color: "purple"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          icon: "text-blue-600",
          text: "text-blue-900"
        };
      case "green":
        return {
          icon: "text-green-600",
          text: "text-green-900"
        };
      case "purple":
        return {
          icon: "text-purple-600",
          text: "text-purple-900"
        };
      default:
        return {
          icon: "text-slate-600",
          text: "text-slate-900"
        };
    }
  };

  let goalCompleted: number = 0;
  for (let i = 0; i < detailUser.goals.length; i++) {
    goalCompleted += detailUser.goals[i].goalCompletions.length;
  }

  return (
    <div className="space-y-4 w-full max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">Informações da conta</h2>

      {stats.map((stat, index) => {
        const colors = getColorClasses(stat.color);
        const Icon = stat.icon;

        return (
          <div
            key={index}
            className="rounded-lg shadow-lg border p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className={`w-6 h-6 ${colors.icon}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{stat.label}</p>
                <p className={`font-bold text-lg ${colors.text} truncate`}>{stat.value}</p>
                <p className="text-sm">{stat.subtitle}</p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Activity Summary */}
      <div className="rounded-lg shadow-lg border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="font-bold">Estatísticas rápidas</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 rounded-lg">
            <div className="text-2xl font-bold">{goalCompleted}</div>
            <div className="text-sm">Metas concluídas</div>
          </div>
          <div className="p-3 rounded-lg">
            <div className="text-2xl font-bold">{detailUser._count.sessions}</div>
            <div className="text-sm">Sessões</div>
          </div>
        </div>
      </div>
    </div>
  );
}
