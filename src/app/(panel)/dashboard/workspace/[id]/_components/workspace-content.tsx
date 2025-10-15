"use client"
import { useState } from "react";
import { Header } from "../../_components/header";
import { Team } from "./team";
import { Groups } from "./main-board/groups";
import { PrioritiesCount, StatusCount } from "@/app/data-access/item";
import { KanbanGrid } from "./kanban/kanban-grid";
import { GroupsData } from "@/hooks/use-groups";

interface WorkspaceContentProps {
  groupsData: GroupsData;
  workspaceId: string;
  prioritiesData: PrioritiesCount[];
  statusData: StatusCount[];
}

export type TabKey = "main-board" | "kanban" | "calendar" | "team";
export function WorkspaceContent({
  groupsData, workspaceId, prioritiesData, statusData
}: WorkspaceContentProps
) {
  const [activeTab, setActiveTab] = useState<TabKey | string>("main-board");

  const tabsConfig = [
    {
      key: "main-board",
      label: "Quadro principal",
      component: <Groups data={groupsData} workspaceId={workspaceId} />
    },
    {
      key: "kanban",
      label: "Kanban",
      component: <KanbanGrid />
    },
    {
      key: "team",
      label: "Equipe",
      component: <Team workspaceId={workspaceId} />
    },
  ];
  return (
    <section className="space-y-6">
      <Header tabs={tabsConfig} activeTab={activeTab} onTabChange={setActiveTab} prioritiesData={prioritiesData} statusData={statusData} />
      {tabsConfig.find(tab => tab.key === activeTab)?.component}
    </section>
  )
}