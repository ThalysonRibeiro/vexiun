"use client"

import { useState } from "react";
import { Header } from "../../_components/header";
import { KanbanContent } from "./kanban/kanban-content";
import { PrioritiesCount } from "../_data-access/get-priorities";
import { StatusCount } from "../_data-access/get-status";
import { Team } from "./team/team-content";
import { Groups, GroupWithItems } from "./main-board/groups";

interface WorkspaceContentProps {
  groupsData: GroupWithItems[];
  workspaceId: string;
  prioritiesData: PrioritiesCount[];
  statusData: StatusCount[];
  team: TeamUser;
}
type User = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
};

export type TeamUser = User[] | { error: string };


export type TabKey = "main-board" | "kanban" | "calendar" | "team";
export function WorkspaceContent({ groupsData, workspaceId, prioritiesData, statusData, team }: WorkspaceContentProps) {
  const [activeTab, setActiveTab] = useState<TabKey | string>("main-board");

  const tabsConfig = [
    {
      key: "main-board",
      label: "Quadro principal",
      component: <Groups groupsData={groupsData} workspaceId={workspaceId} />
    },
    {
      key: "kanban",
      label: "Kanban",
      component: groupsData.length === 0 ? <p>Nenhum item encontrado</p> : <KanbanContent groupsData={groupsData} />
    },
    {
      key: "team",
      label: "Equipe",
      component: <Team team={team} workspaceId={workspaceId} />
    },
  ];
  return (
    <section className="space-y-6">
      <Header tabs={tabsConfig} activeTab={activeTab} onTabChange={setActiveTab} prioritiesData={prioritiesData} statusData={statusData} />
      {tabsConfig.find(tab => tab.key === activeTab)?.component}
    </section>
  )
}