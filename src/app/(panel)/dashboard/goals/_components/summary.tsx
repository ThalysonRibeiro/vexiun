"use client"
import { endOfWeek, format, startOfWeek } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Plus } from "lucide-react";
import { Progress, ProgressIndicator } from "@/components/ui/progress-bar";
import { Separator } from "@/components/ui/separator"
import { PedingGoals } from "./peding-goals";
import { toast } from "sonner";
import { PendingGoal, WeekSummaryResponse } from "../_types";
import { goalUndo } from "@/app/actions/goals";
import { isErrorResponse } from "@/lib/errors/error-handler";

interface SummaryProps {
  data: PendingGoal[];
  summaryData: WeekSummaryResponse;
  timeZone: string;
  language: string;
}

export function Summary({ data, summaryData, timeZone, language }: SummaryProps) {
  if (!summaryData.summary) {
    return null;
  }

  const firstDayOfWeek = format(startOfWeek(new Date()), "d MMM", { locale: ptBR });
  const lastDayOfWeek = format(endOfWeek(new Date()), "d MMM", { locale: ptBR });

  async function handleUndo(goalId: string) {
    if (!goalId) {
      toast.error("Erro ao desfazer meta.");
      return;
    }
    try {
      const response = await goalUndo({ id: goalId });
      if (isErrorResponse(response)) {
        toast.error(response.error);
        return;
      }
      toast("🙄👀 " + response.data);
    } catch (error) {
      toast.error("Erro ao desfazer meta.");
    }
  }

  return (
    <article className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold capitalize">{firstDayOfWeek} - {lastDayOfWeek}</span>
        <div className="flex gap-2">
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus size={16} />
              Cadastrar meta
            </Button>
          </DialogTrigger>
          <a href="/dashboard/goals/metrics">
            <Button size="sm" variant="outline">
              Métricas
            </Button>
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <ProgressGoals
          total={summaryData?.summary?.total}
          completed={summaryData?.summary?.completed}
        />

        <Separator />

        <PedingGoals data={data} />

        <div className="flex flex-col gap-6">
          <div className="flex gap-3 justify-between items-center">
            <h2 className="text-xl font-medium">Sua semana</h2>
          </div>
          {summaryData.summary.goalsPerDay.map(({ date, dayOfWeek, goals }) => {
            const localeMap = {
              "pt-BR": ptBR,
              "en-US": enUS,
            };
            const dateInTimezone = new Date(new Date(date).toLocaleString("en-US", { timeZone: timeZone }));
            const formatPattern = language === "pt-BR" ? "d 'de' MMMM" : "MMMM d";
            const formattedDate = format(
              dateInTimezone,
              formatPattern,
              { locale: localeMap[language as "pt-BR" | "en-US"] }
            );
            return (
              <div key={date} className="flex flex-col gap-4">
                <h3 className="font-medium">
                  <span className="capitalize">{dayOfWeek}</span>{' '}
                  <span className="text-xs">({formattedDate})</span>
                </h3>
                <ul className="flex flex-col gap-3">
                  {goals.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()).map(goal => {
                    const timeInTimezone = new Date(new Date(goal.completedAt).toLocaleString("en-US", { timeZone: timeZone }));
                    const time = format(timeInTimezone, 'HH:mm', { locale: localeMap[language as "pt-BR" | "en-US"] });
                    return (
                      <li key={goal.id} className="flex items-center gap-2 justify-between border-b">
                        <div className="flex gap-2">
                          <CheckCircle2 className="size-4 text-primary" />
                          <p className="text-sm inline-flex">
                            &ldquo;
                            <span className="truncate text-ellipsis max-w-60 lg:max-w-140 inline-block font-semibold">
                              <span className="capitalize">{goal.title.slice(0, 1)}</span>
                              {goal.title.slice(1)}</span>
                            &ldquo; -
                            <span className="font-thin text-primary ml-1">{time}</span>
                          </p>
                        </div>
                        <button
                          className="text-sm cursor-pointer underline"
                          onClick={() => handleUndo(goal.id)}
                        >Desfazer
                        </button>
                      </li>
                    )
                  })}
                </ul>
                <Separator />
              </div>
            )
          })}
        </div>
      </div>
    </article>
  )
}

export function ProgressGoals({
  total,
  completed
}: {
  total: number;
  completed: number;
}) {
  const completedPercentage = total === 0 ? 0 : Math.round((completed * 100) / total);

  return (
    <div className="space-y-4">
      <Progress max={total} value={completed}>
        <ProgressIndicator style={{ width: `${completedPercentage}%` }} />
      </Progress>
      <div className="flex items-center justify-between text-xs">
        <span>Você completou <span>{completed}</span> de <span>{total}</span> metas nessa semana.</span>
        <span>{completedPercentage}%</span>
      </div>
    </div>
  )
}