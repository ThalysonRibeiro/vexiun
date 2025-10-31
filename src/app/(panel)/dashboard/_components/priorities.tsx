import { getPriorities } from "@/app/data-access/item";
import { PrioritiesBar } from "../workspace/[id]/_components/priorities-bar";
import { unwrapServerData } from "@/utils/server-helpers";

export async function Priorities({ workspaceId }: { workspaceId: string }) {
  const data = await getPriorities(workspaceId).then(unwrapServerData);

  return (
    <div className="w-full mt-auto">
      <PrioritiesBar priorities={data} label={false} />
    </div>
  );
}
