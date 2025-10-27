"use client"
import { Team } from "./team";
import { Groups } from "./main-board/groups";
import { KanbanGrid } from "./kanban/kanban-grid";
import { GroupsData } from "@/hooks/use-groups";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Archived } from "./archived";
import { Archive, LayoutDashboard, SquareDashedKanban, Trash, Users } from "lucide-react";
import { Deleted } from "./deleted";
import { useItemsCountByStatus } from "@/hooks/use-items";
import { useTeamCount } from "@/hooks/use-team";

interface WorkspaceContentProps {
  workspaceId: string;
}

export function WorkspaceContent({
  workspaceId
}: WorkspaceContentProps
) {

  const { data: activeCount = 0 } = useItemsCountByStatus(workspaceId, "ACTIVE");
  const { data: archivedCount = 0 } = useItemsCountByStatus(workspaceId, "ARCHIVED");
  const { data: deletedCount = 0 } = useItemsCountByStatus(workspaceId, "DELETED");
  const { data: teamCount } = useTeamCount(workspaceId);


  const tabsConfig = [
    {
      key: "main-board",
      label: "Quadro principal",
      icon: <LayoutDashboard className="w-4 h-4" />,
      length: activeCount,
      component: (
        <Groups
          workspaceId={workspaceId}
        />
      )
    },
    {
      key: "kanban",
      label: "Kanban",
      icon: <SquareDashedKanban className="w-4 h-4" />,
      length: activeCount,
      component: (
        <KanbanGrid />
      ),
    },
    {
      key: "team",
      label: "Equipe",
      icon: <Users className="w-4 h-4" />,
      length: teamCount,
      component: (
        <Team
          workspaceId={workspaceId}
        />
      )
    },
    {
      key: "archived",
      label: "Arquivados",
      icon: <Archive className="w-4 h-4" />,
      length: archivedCount,
      component: (
        <Archived
          workspaceId={workspaceId}
        />
      )
    },
    {
      key: "deleted",
      label: "Lixeira",
      icon: <Trash className="w-4 h-4" />,
      length: deletedCount,
      component: (
        <Deleted
          workspaceId={workspaceId}
        />
      )
    },
  ];
  return (
    <Tabs defaultValue="main-board" className="w-full mt-6 md:ml-4">
      <TabsList className="flex gap-2 w-full">
        {tabsConfig.map(tab => (
          <TabsTrigger
            key={tab.key}
            value={tab.key}
            className="gap-2 cursor-pointer hover:border-primary"
          >
            {tab.icon}
            <span className="hidden sm:block">{tab.label}</span>
            {tab.length}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabsConfig.map(tab => (
        <TabsContent key={tab.key} value={tab.key}>{tab.component}</TabsContent>
      ))}
    </Tabs>
  )
}