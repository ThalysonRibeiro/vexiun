"use client"

import {
  Sheet
} from "@/components/ui/sheet"
import { CreateGoals } from "./create-goals"
import { EmptyGoal } from "./empyt-goal"
import { Summary } from "./summary"
import { PendingGoal, WeekSummaryResponse } from "@/app/data-access/goals"


interface GoalsContentProps {
  data: PendingGoal[];
  summaryData: WeekSummaryResponse | null;
  timeZone: string;
  language: string;
}

export function GoalsContent({ data, summaryData, timeZone, language }: GoalsContentProps) {

  return (
    <section>
      <Sheet>
        {data.length > 0 ? <Summary data={data} summaryData={summaryData} timeZone={timeZone} language={language} /> : <EmptyGoal />}

        <CreateGoals />
      </Sheet>
    </section>
  )
}
