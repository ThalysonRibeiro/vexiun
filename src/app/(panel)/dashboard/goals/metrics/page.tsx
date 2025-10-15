import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { getGoalsMetrics } from "@/app/data-access/goals/get-metrics";
import { MetricsContent } from "./_components/metrics-content";

export default async function MetricsPage() {
  const session = await getSession();

  if (!session) {
    redirect('/')
  }
  const metrics = await getGoalsMetrics(session?.user?.id as string);

  return (
    <main className="container mx-auto px-6 pt-6">
      <MetricsContent data={metrics} />
    </main>
  );
}
