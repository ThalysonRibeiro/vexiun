import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { getDetailUser } from "@/app/data-access/user";
import { GoalsContent } from "./_components/goals-content";
import { getWeekPendingGoal, getWeekSummary } from "@/app/data-access/goals";
import { unwrapServerData } from "@/utils/server-helpers";


export default async function GoalsPage() {
  const session = await getSession();

  if (!session) {
    redirect('/')
  }
  const pedingGoals = await getWeekPendingGoal(session?.user?.id as string);
  const weekSummaryDate = await getWeekSummary(session?.user?.id as string);
  const detailUser = await getDetailUser().then(unwrapServerData);
  if (!detailUser) return null;
  const { userSettings } = detailUser;

  const timezone = userSettings?.timezone ?? "America/Sao_Paulo";
  const language = userSettings?.language ?? "pt-BR";

  return (
    <main className="container mx-auto px-6 pt-10">
      <GoalsContent
        data={pedingGoals ?? []}
        summaryData={weekSummaryDate}
        timeZone={timezone}
        language={language}
      />
    </main>
  )
}
