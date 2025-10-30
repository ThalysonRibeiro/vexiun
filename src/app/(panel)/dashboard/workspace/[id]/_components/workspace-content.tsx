"use client"
import { Team } from "./team";
import { Groups } from "./main-board/groups";
import { KanbanGrid } from "./kanban/kanban-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Archive, LayoutDashboard, SquareDashedKanban, Trash, Users } from "lucide-react";
import { useItemsCountByStatus } from "@/hooks/use-items";
import { useTeamCount } from "@/hooks/use-team";
import { ItemLifecycleManager } from "./Item-lifecycle-manager";
import { useSession } from "next-auth/react";
import { useWorkspaceMemberData, useWorkspacePermissions } from "@/hooks/use-workspace";
import { EntityStatus, WorkspaceRole } from "@/generated/prisma";

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

  const { data: session } = useSession();
  const { data: workspace } = useWorkspaceMemberData(workspaceId as string);

  const currentUserId = session?.user.id;
  const isOwner = workspace?.workspace.userId === currentUserId;
  const permissions = useWorkspacePermissions({
    userRole: workspace?.member.role as WorkspaceRole ?? "VIEWER",
    workspaceStatus: workspace?.workspace.status as EntityStatus,
    isOwner
  });

  const tabsConfig = [
    {
      key: "main-board",
      havePermission: permissions.canManageMembers || permissions.isLimitedAccess,
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
      havePermission: permissions.canManageMembers || permissions.isLimitedAccess,
      label: "Kanban",
      icon: <SquareDashedKanban className="w-4 h-4" />,
      length: activeCount,
      component: (
        <KanbanGrid />
      ),
    },
    {
      key: "team",
      havePermission: permissions.canManageMembers,
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
      havePermission: permissions.canManageMembers,
      label: "Arquivados",
      icon: <Archive className="w-4 h-4" />,
      length: archivedCount,
      component: (
        <ItemLifecycleManager workspaceId={workspaceId} entityStatus="ARCHIVED" />
      )
    },
    {
      key: "deleted",
      havePermission: permissions.canManageMembers,
      label: "Lixeira",
      icon: <Trash className="w-4 h-4" />,
      length: deletedCount,
      component: (
        <ItemLifecycleManager workspaceId={workspaceId} entityStatus="DELETED" />
      )
    },
  ];
  return (
    <Tabs defaultValue="main-board" className="w-full mt-6 md:ml-4">
      <TabsList className="flex items-center justify-start gap-2 w-full">
        {tabsConfig.filter(tab => tab.havePermission)
          .map(tab => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className="gap-2 cursor-pointer hover:border-primary max-w-60"
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