import { getPriorities } from "../workspace/[id]/_data-access/get-priorities";
import { PrioritiesBar } from "../workspace/[id]/_components/priorities-bar";

export async function Priorities({ workspaceId }: { workspaceId: string }) {
  const data = await getPriorities(workspaceId);
  return (
    <div className="w-full mt-auto">
      <PrioritiesBar priorities={data} label={false} />
    </div>
  )
}
