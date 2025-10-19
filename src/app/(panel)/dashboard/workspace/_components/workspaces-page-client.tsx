"use client";

import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { WorkspaceList } from "./workspace-list";
import { Prisma, WorkspaceRole } from "@/generated/prisma";
import { DialogCreateWorkspace } from "../[id]/_components/dialog-create-workspace";
import { useDeleteWorkspace } from "@/hooks/use-workspace";
import { isSuccessResponse } from "@/lib/errors";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { SharedWorkspaceList } from "./shared-workspace-list";

interface WorkspacesPageClientProps {
  workspaces: Array<{
    id: string;
    title: string;
    groupsCount: number;
    itemsCount: number;
    members: Array<{
      name: string | null;
      image: string | null;
      id: string;
      email: string;
    }>;
    menbersRole: WorkspaceRole | undefined;

  }>;
  sharedWorkspaces: WorkspacesMenberWithWorkspace[];
}

export type WorkspacesMenberWithWorkspace = Prisma.WorkspaceMemberGetPayload<{
  include: {
    workspace: {
      select: {
        id: true,
        title: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        lastActivityAt: true,
        members: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              }
            },
            role: true
          },
        },
        _count: {
          select: {
            groups: true,
            members: true
          }
        }
      },
    },
  };
}>;

export function WorkspacesPageClient({ workspaces, sharedWorkspaces }: WorkspacesPageClientProps) {
  const pathname = usePathname();
  const deleteWorkspace = useDeleteWorkspace();

  const handleDeleteWorkspace = useCallback(async (workspaceId: string) => {
    if (!confirm('Deseja realmente deletar a workspace? Todos os grupos e items serão deletados juntos.')) {
      return;
    }

    const response = await deleteWorkspace.mutateAsync({ workspaceId });
    if (!isSuccessResponse(response)) {
      toast.error("Erro inesperado ao deletar Workspace");
      if (pathname !== "/dashboard/workspace") {
        window.location.href = "/dashboard";
      }
      toast.error("Erro ao deletar workspace");
      return;
    }

    toast.success(response.data);
    if (pathname !== "/dashboard/workspace") {
      window.location.href = "/dashboard";
    }

  }, [deleteWorkspace, pathname]);


  const handleEdit = (id: string) => {
    // TODO: Implementar edit
    console.log("Edit workspace:", id);
  };

  return (
    <main className="container mx-auto pl-8 space-y-6 pt-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os seus espaços de trabalho
          </p>
        </div>


        <div className="w-fit mb-2">
          <DialogCreateWorkspace
            isNoWorkspace={workspaces.length === 0 ? true : false} />
        </div>
      </div>

      <Tabs defaultValue="my-workspaces">
        <TabsList>
          <TabsTrigger value="my-workspaces">Minhas</TabsTrigger>
          <TabsTrigger value="shared-workspaces">Compartilhadas</TabsTrigger>
        </TabsList>
        <TabsContent value="my-workspaces">
          <div className="border rounded-lg overflow-y-scroll">
            <WorkspaceList
              workspaces={workspaces}
              onDelete={handleDeleteWorkspace}
            />
          </div>
        </TabsContent>
        <TabsContent value="shared-workspaces">
          <div className="border rounded-lg overflow-y-scroll">
            <SharedWorkspaceList
              sharedWorkspaces={sharedWorkspaces}
            />
          </div>
        </TabsContent>
      </Tabs>



    </main>
  );
}