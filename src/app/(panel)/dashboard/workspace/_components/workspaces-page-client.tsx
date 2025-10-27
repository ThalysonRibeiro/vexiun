"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { WorkspaceList } from "./workspace-list";
import { EntityStatus, WorkspaceCategory, WorkspaceRole } from "@/generated/prisma";
import { DialogCreateWorkspace } from "../[id]/_components/dialog-create-workspace";
import { useWorkspacesByStatus } from "@/hooks/use-workspace";
import { PermissionsTable } from "./permissions";
import { WorkspaceListByStatus } from "./workspace-list-by-status";
import { Archive, FolderOpen, Shield, Trash2, Users } from "lucide-react";

interface WorkspacesPageClientProps {
  workspaces: WorkspaceWithDetails[]
  sharedWorkspaces: WorkspaceWithDetails[];
}

export type WorkspaceWithDetails = {
  id: string;
  title: string;
  description: string | null;
  categories: WorkspaceCategory[];
  statusChangedAt: Date | null;
  statusChangedBy: string | null;
  lastActivityAt: Date;
  status: EntityStatus;
  groupsCount: number;
  itemsCount: number;
  userId: string;
  members: Array<{
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  }>;
  menbersRole: WorkspaceRole | undefined;
}


export function WorkspacesPageClient({
  workspaces,
  sharedWorkspaces,
}: WorkspacesPageClientProps) {
  const archivedWorkspaces = useWorkspacesByStatus("ARCHIVED");
  const deletedWorkspaces = useWorkspacesByStatus("DELETED");

  return (
    <main className="container mx-auto pl-8 space-y-6 pt-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Workspaces
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os seus espaços de trabalho
          </p>
        </div>

        <div className="w-fit mb-2">
          <DialogCreateWorkspace
            isNoWorkspace={workspaces.length === 0 ? true : false}
          />
        </div>
      </header>

      <Tabs defaultValue="my-workspaces">
        <TabsList className="flex gap-2 w-full">
          <TabsTrigger value="my-workspaces" className="gap-2 cursor-pointer hover:border-primary">
            <FolderOpen className="w-4 h-4" />
            <p className="hidden lg:block">Minhas</p>
            {workspaces.length > 0 && (
              <Badge variant="secondary">{workspaces.length}</Badge>
            )}
          </TabsTrigger>

          <TabsTrigger value="shared-workspaces" className="gap-2 cursor-pointer hover:border-primary">
            <Users className="w-4 h-4" />
            <span className="hidden lg:block">Compartilhadas</span>
            {sharedWorkspaces.length > 0 && (
              <Badge variant="secondary">{sharedWorkspaces.length}</Badge>
            )}
          </TabsTrigger>

          <TabsTrigger value="archived" className="gap-2 cursor-pointer hover:border-primary">
            <Archive className="w-4 h-4" />
            <span className="hidden lg:block">Arquivadas</span>
            {(archivedWorkspaces?.data?.length || 0) > 0 && (
              <Badge variant="secondary">{archivedWorkspaces?.data?.length}</Badge>
            )}
          </TabsTrigger>

          <TabsTrigger value="bin" className="gap-2 cursor-pointer hover:border-primary">
            <Trash2 className="w-4 h-4" />
            <span className="hidden lg:block">Lixeira</span>
            {(deletedWorkspaces?.data?.length || 0) > 0 && (
              <Badge variant="destructive">{deletedWorkspaces?.data?.length}</Badge>
            )}
          </TabsTrigger>

          <TabsTrigger value="permissions" className="gap-2 cursor-pointer hover:border-primary">
            <Shield className="w-4 h-4" />
            <span className="hidden lg:block">Permissões</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-workspaces" className="mt-6">
          <div className="overflow-y-auto">
            <WorkspaceList
              workspaces={workspaces}
            />
          </div>
        </TabsContent>

        <TabsContent value="shared-workspaces" className="mt-6">
          <div className="overflow-y-auto">
            <WorkspaceList
              workspaces={sharedWorkspaces}
            />
          </div>
        </TabsContent>

        <TabsContent value="archived" className="mt-6">
          <WorkspaceListByStatus
            status="ARCHIVED"
            emptyMessage="Nenhum workspace arquivado"
          />
        </TabsContent>

        <TabsContent value="bin" className="mt-6">
          <div className="space-y-4">
            {/* ✅ Alert de aviso */}
            <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-destructive/20 p-2">
                  <svg
                    className="w-5 h-5 text-destructive"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-destructive">
                    Atenção
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Workspaces na lixeira serão deletados permanentemente em 30
                    dias. Restaure-os antes disso para não perder seus dados.
                  </p>
                </div>
              </div>
            </div>

            <WorkspaceListByStatus
              status="DELETED"
              emptyMessage="A lixeira está vazia"
            />
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="mt-6">
          <PermissionsTable />
        </TabsContent>
      </Tabs>
    </main>
  );
}