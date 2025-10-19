"use client"
import { Team } from "./team";
import { Groups } from "./main-board/groups";
import { KanbanGrid } from "./kanban/kanban-grid";
import { GroupsData } from "@/hooks/use-groups";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WorkspaceContentProps {
  groupsData: GroupsData;
  workspaceId: string;
}

export function WorkspaceContent({
  groupsData, workspaceId
}: WorkspaceContentProps
) {

  const tabsConfig = [
    {
      key: "main-board",
      label: "Quadro principal",
      component: <Groups data={groupsData} workspaceId={workspaceId} />
    },
    {
      key: "kanban",
      label: "Kanban",
      component: <div>
        {groupsData?.group.length !== 0
          ? < KanbanGrid />
          : <h2 className="text-center">Cadastre um group</h2>}
      </div>
    },
    {
      key: "team",
      label: "Equipe",
      component: <Team workspaceId={workspaceId} />
    },
  ];
  return (
    <Tabs defaultValue="main-board" className="w-full mt-6 md:ml-4">
      <TabsList className="">
        {tabsConfig.map(tab => (
          <TabsTrigger key={tab.key} value={tab.key}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabsConfig.map(tab => (
        <TabsContent key={tab.key} value={tab.key}>{tab.component}</TabsContent>
      ))}
    </Tabs>
  )
}