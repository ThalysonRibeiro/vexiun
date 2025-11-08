"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  useArchiveWorkspace,
  useDeleteWorkspace,
  useMoveWorkspaceToTrash,
  useRestoreWorkspace,
  WorkspaceByStatus
} from "@/hooks/use-workspace";
import { isSuccessResponse } from "@/lib/errors";
import {
  Archive,
  FolderOpen,
  Trash,
  ArchiveRestore,
  Ellipsis,
  FolderKanban,
  Trash2,
  Users
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useWorkspacesByStatus } from "@/hooks/use-workspace";
import { Skeleton } from "@/components/ui/skeleton";
import { EntityStatus } from "@/generated/prisma";
import { EmptyState } from "../../../../../components/ui/empty-state";

interface WorkspaceListByStatusProps {
  status: EntityStatus;
  emptyMessage?: string;
}

const emptyStateConfig = {
  ACTIVE: {
    icon: FolderOpen,
    title: "Nenhum workspace ativo",
    description: "Você ainda não tem nenhum workspace. Crie um para começar!"
  },
  ARCHIVED: {
    icon: Archive,
    title: "Nenhum workspace arquivado",
    description: "Workspaces arquivados aparecerão aqui."
  },
  DELETED: {
    icon: Trash,
    title: "A lixeira está vazia",
    description: "Workspaces deletados aparecerão aqui por 30 dias."
  }
};

export function WorkspaceListByStatus({
  status,
  emptyMessage = "Nenhum workspace encontrado"
}: WorkspaceListByStatusProps) {
  const workspacesByStatus = useWorkspacesByStatus(status);

  // Loading state
  if (workspacesByStatus.isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-lg" />
        ))}
      </div>
    );
  }

  // Error state
  if (workspacesByStatus.isError) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Erro ao carregar workspaces</p>
      </div>
    );
  }

  // Empty state
  if (!workspacesByStatus.data || workspacesByStatus.data.length === 0) {
    const config = emptyStateConfig[status];
    return <EmptyState icon={config.icon} title={config.title} description={config.description} />;
  }

  // Success state
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {workspacesByStatus.data.map((workspace) => (
        <WorkspaceCard key={workspace.id} workspace={workspace} />
      ))}
    </section>
  );
}

interface WorkspaceCardProps {
  workspace: WorkspaceByStatus;
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const archive = useArchiveWorkspace();
  const restore = useRestoreWorkspace();
  const deleteWs = useMoveWorkspaceToTrash();
  const deletePemamently = useDeleteWorkspace();

  const handleArchive = async () => {
    const result = await archive.mutateAsync(workspace.id);
    if (!isSuccessResponse(result)) {
      toast.error("Erro ao arquivar");
    }
    toast.success(result.message);
  };

  const handleRestore = async () => {
    const result = await restore.mutateAsync(workspace.id);
    if (!isSuccessResponse(result)) {
      toast.error("Erro ao restaurar");
    }
    toast.success(result.message);
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Deseja realmente mover para lixeira? Todos os grupos e items serão movidos para lixeira."
      )
    ) {
      return;
    }
    const result = await deleteWs.mutateAsync(workspace.id);
    if (!isSuccessResponse(result)) {
      toast.error("Erro ao deletar");
    }
    toast.success(result.message);
  };

  const handleDeletePermanently = async (workspaceId: string) => {
    if (!confirm("Deseja realmente deletar permanentemente? Esta ação não pode ser desfeita.")) {
      return;
    }
    const result = await deletePemamently.mutateAsync({
      workspaceId,
      revalidatePaths: ["/dashboard/workspace"]
    });
    if (!isSuccessResponse(result)) {
      toast.error("Erro ao deletar permanentemente");
    }
    toast.success(result.data);
  };

  const isActive = workspace.status === "ACTIVE";
  const canAccess = workspace.status !== "DELETED";

  return (
    <Card className="hover:border-primary/50 hover:bg-primary/20 hover:-translate-y-1 transition-all duration-300relative overflow-hidden">
      <CardHeader className="relative">
        {workspace.status !== "ACTIVE" && (
          <Badge
            variant={workspace.status === "ARCHIVED" ? "secondary" : "destructive"}
            className="text-xs"
          >
            {workspace.status === "ARCHIVED" ? "Arquivado" : "Na lixeira"}
          </Badge>
        )}

        <CardTitle className="text-xl">
          {canAccess ? (
            <Link href={`/dashboard/workspace/${workspace.id}`} className="min-w-0 line-clamp-1">
              {workspace.title}
            </Link>
          ) : (
            workspace.title
          )}
        </CardTitle>

        <div className="flex flex-col items-start justify-between">
          {workspace.description && (
            <CardDescription className="mt-2 line-clamp-2">{workspace.description}</CardDescription>
          )}

          {workspace.categories && workspace.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {workspace.categories.map((category) => (
                <Badge key={category} variant="outline" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Ellipsis className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {workspace.status === "ACTIVE" && (
                <>
                  <DropdownMenuItem onClick={handleArchive}>
                    <Archive className="w-4 h-4 mr-2" />
                    Arquivar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Mover para lixeira
                  </DropdownMenuItem>
                </>
              )}

              {workspace.status === "ARCHIVED" && (
                <>
                  <DropdownMenuItem onClick={handleRestore}>
                    <ArchiveRestore className="w-4 h-4 mr-2" />
                    Restaurar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Mover para lixeira
                  </DropdownMenuItem>
                </>
              )}

              {workspace.status === "DELETED" && (
                <>
                  <DropdownMenuItem onClick={handleRestore}>
                    <ArchiveRestore className="w-4 h-4 mr-2" />
                    Restaurar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      handleDeletePermanently(workspace.id);
                    }}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Deletar permanentemente
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <FolderKanban className="w-4 h-4" />
              <span>{workspace._count.groups} grupos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{workspace._count.members} membros</span>
            </div>
          </div>
        </div>
      </CardContent>

      {(workspace.statusChangedAt || isActive) && (
        <CardFooter className="text-xs text-muted-foreground border-t pt-4">
          {workspace.statusChangedAt ? (
            <div>
              Alterado em {new Date(workspace.statusChangedAt).toLocaleDateString("pt-BR")}
              {workspace.statusChanger &&
                ` por ${workspace.statusChanger.name || workspace.statusChanger.email}`}
            </div>
          ) : (
            <div>
              Última atividade em {new Date(workspace.lastActivityAt).toLocaleDateString("pt-BR")}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
