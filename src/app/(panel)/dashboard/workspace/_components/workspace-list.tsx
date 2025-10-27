"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Archive, Edit2, Ellipsis, Eye, FolderKanban, FolderTree, Inbox, LayoutGrid, LinkIcon, Logs, Trash, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeWorkspace } from "@/components/badge-workspace";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { WorkspaceForm } from "./workspace-form";
import { useState } from "react";
import Link from "next/link";
import { isSuccessResponse } from "@/lib/errors";
import {
  useArchiveWorkspace,
  useWorkspacePermissions,
  useMoveWorkspaceToTrash
} from "@/hooks/use-workspace";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES_MAP } from "@/lib/constants";
import { InviteMembersToWorkspaces } from "@/components/invite-members-to-workspaces";
import { WorkspaceWithDetails } from "./workspaces-page-client";

interface WorkspaceListProps {
  workspaces: WorkspaceWithDetails[];
}

export function WorkspaceList({ workspaces }: WorkspaceListProps) {
  const [changeLayout, setChangeLayout] = useState<boolean>(false);
  const [changeEditOrInvite, setChangeEditOrInvite] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceWithDetails | null>(null);
  const router = useRouter();
  const archive = useArchiveWorkspace();
  const deleteWs = useMoveWorkspaceToTrash();

  if (workspaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Inbox className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">Nenhuma workspace encontrada</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Comece criando uma nova workspace
        </p>
      </div>
    );
  }

  const handleArchive = async (workspaceId: string) => {
    const result = await archive.mutateAsync(workspaceId);
    if (!isSuccessResponse(result)) {
      toast.error("Erro ao arquivar");
    }
    toast.success(result.message);
  }

  const handleDelete = async (workspaceId: string) => {
    if (
      !confirm(
        "Deseja realmente mover para lixeira? Todos os grupos e items serão movidos para lixeira."
      )
    ) {
      return;
    }
    const result = await deleteWs.mutateAsync(workspaceId);
    if (!isSuccessResponse(result)) {
      toast.error("Erro ao deletar");
    }
    toast.success(result.message);
  };

  const handleSelectForEdit = (workspace: WorkspaceWithDetails) => {
    setSelectedWorkspace({
      userId: workspace.userId,
      id: workspace.id,
      title: workspace.title,
      groupsCount: workspace.groupsCount,
      itemsCount: workspace.itemsCount,
      members: workspace.members,
      menbersRole: workspace.menbersRole,
      categories: workspace.categories,
      status: workspace.status,
      statusChangedAt: workspace.statusChangedAt,
      description: workspace.description,
      statusChangedBy: workspace.statusChangedBy,
      lastActivityAt: workspace.lastActivityAt,
    });
    setDropdownOpen(null);
    setTimeout(() => setIsOpen(true), 0);
  };

  return (
    <section className="space-y-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <Button
            className="w-fit" variant={"outline"}
            onClick={() => setChangeEditOrInvite(prev => !prev)}
          >
            {changeEditOrInvite ? (
              <div className="flex items-center gap-2"><Edit2 /> Editar workspace</div>
            ) : (
              <div className="flex items-center gap-2"><Users /> Convidar membros</div>
            )}
          </Button>
          {changeEditOrInvite ? (
            <>
              <DialogHeader>
                <DialogTitle>Convidar membros</DialogTitle>
                <DialogDescription>
                  Convidar membros para Workspace {selectedWorkspace?.title}
                </DialogDescription>
              </DialogHeader>

              <InviteMembersToWorkspaces
                workspaceId={selectedWorkspace?.id as string}
                setClose={setChangeEditOrInvite}
              />
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Editar Workspace</DialogTitle>
                <DialogDescription>
                  Editar detalhes da Workspace {selectedWorkspace?.title}
                </DialogDescription>
              </DialogHeader>
              <WorkspaceForm
                workspaceId={selectedWorkspace?.id}
                initialValues={{
                  title: selectedWorkspace?.title ?? "",
                  description: selectedWorkspace?.description ?? "",
                  categories: selectedWorkspace?.categories ?? [],
                  invitationUsersId: []
                }}
              />
            </>
          )}
        </DialogContent>
      </Dialog>

      <Button
        variant={"outline"} className="cursor-pointer"
        onClick={() => setChangeLayout(!changeLayout)}
      >
        {changeLayout ? <Logs /> : <LayoutGrid />}
        <span>Layout</span>
        {changeLayout ? "lista" : "grid"}
      </Button>

      {changeLayout ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {workspaces.map((workspace, index) => (
            <Card key={workspace.id} className="hover:border-primary/50 hover:bg-primary/20 hover:-translate-y-1 transition-all duration-300">
              <CardHeader>
                {workspace.menbersRole && (
                  <BadgeWorkspace role={workspace.menbersRole} />
                )}
                <CardTitle className="text-xl">
                  <Link
                    href={`/dashboard/workspace/${workspace.id}`}
                    className="min-w-0 line-clamp-1"
                  >
                    {workspace.title}
                  </Link>
                </CardTitle>
                <div className="flex flex-col items-start justify-between">
                  {workspace.description && <CardDescription>{workspace.description}</CardDescription>}
                  {workspace.categories && workspace.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {workspace.categories.map((category) => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {CATEGORIES_MAP[category]}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <CardAction>
                  <ActionsWorkspaceList
                    workspace={workspace}
                    onOpenChange={setDropdownOpen}
                    open={dropdownOpen === workspace.id}
                    onArchive={handleArchive}
                    onDelete={handleDelete}
                    onEdit={() => handleSelectForEdit(workspace)}
                    onRedirect={() => router.push(`/dashboard/workspace/${workspace?.id}`)}
                  />
                </CardAction>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <FolderKanban className="w-4 h-4" />
                      <span>{workspace.groupsCount} grupos</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FolderTree className="w-4 h-4" />
                      <span>{workspace.itemsCount} itens</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>{workspace.members.length} membros</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              {workspace.statusChangedAt && (
                <CardFooter className="text-xs text-muted-foreground border-t pt-4 mt-auto">
                  {workspace.statusChangedAt ? (
                    <div>
                      Alterado em{" "}
                      {new Date(workspace.statusChangedAt).toLocaleDateString("pt-BR")}
                    </div>
                  ) : (
                    <div>
                      Última atividade em{" "}
                      {new Date(workspace.lastActivityAt).toLocaleDateString("pt-BR")}
                    </div>
                  )}
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Table className="border rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-0">Ações</TableHead>
              <TableHead className="text-center border-x">Titulo</TableHead>
              <TableHead className="text-center ">Descrição</TableHead>
              <TableHead className="text-center border-x">Categorias</TableHead>
              <TableHead className="text-center">Ultima atividade</TableHead>
              <TableHead className="text-center w-0 border-x">Grupos</TableHead>
              <TableHead className="text-center w-0">Items</TableHead>
              <TableHead className="text-center border-x">Equipe</TableHead>
              <TableHead className="text-center w-0">Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workspaces.map((workspace, index) => (
              <TableRow key={workspace.id} className="table-row">
                <TableCell>
                  <ActionsWorkspaceList
                    workspace={workspace}
                    onOpenChange={setDropdownOpen}
                    open={dropdownOpen === workspace.id}
                    onArchive={handleArchive}
                    onDelete={handleDelete}
                    onEdit={() => handleSelectForEdit(workspace)}
                    onRedirect={() => router.push(`/dashboard/workspace/${workspace?.id}`)}
                  />
                </TableCell>

                <TableCell className="font-medium border-x max-w-70 truncate">
                  {workspace.title}
                </TableCell>

                <TableCell className="font-medium max-w-70 truncate">
                  {workspace.description}
                </TableCell>

                <TableCell className="font-medium border-x">
                  {workspace.categories && workspace.categories.length > 0 && (
                    <div className="flex gap-1">
                      {workspace.categories.slice(0, 3).map((category) => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {CATEGORIES_MAP[category]}
                        </Badge>
                      ))}
                      {workspace.categories.length > 3 && (
                        <div className="text-xs">+{workspace.categories.length - 3}</div>
                      )}
                    </div>
                  )}
                </TableCell>

                <TableCell className="text-center">
                  {workspace.statusChangedAt ? (
                    <div>
                      Alterado em{" "}
                      {new Date(workspace.statusChangedAt).toLocaleDateString("pt-BR")}
                    </div>
                  ) : (
                    <div>
                      Última atividade em{" "}
                      {new Date(workspace.lastActivityAt).toLocaleDateString("pt-BR")}
                    </div>
                  )}
                </TableCell>

                <TableCell className="text-center border-x">
                  {workspace.groupsCount}
                </TableCell>

                <TableCell className="text-center">
                  {workspace.itemsCount}
                </TableCell>

                <TableCell className="border-x">
                  <div className="flex items-center">
                    {workspace.members.slice(0, 6).map(member => (
                      <Avatar key={member.id}>
                        <AvatarImage src={member.image as string} />
                        <AvatarFallback>
                          {member.name?.charAt(0) ?? "N"}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {workspace.members.length >= 6 && (
                      <span className="ml-2 flex gap-1">
                        +{workspace.members.slice(6).length}
                      </span>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  {workspace.menbersRole && (
                    <BadgeWorkspace role={workspace.menbersRole} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
}

interface ActionsWorkspaceListPorps {
  onOpenChange: (value: string | null) => void;
  open: boolean;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onRedirect: (id: string) => void;
  onEdit: (workspace: WorkspaceWithDetails) => void;
  workspace: WorkspaceWithDetails;
}

function ActionsWorkspaceList({
  workspace,
  onOpenChange,
  open,
  onArchive,
  onRedirect,
  onEdit,
  onDelete,
}: ActionsWorkspaceListPorps) {
  const { data } = useSession();
  const currentUserId = data?.user.id;
  const isOwner = workspace.userId === currentUserId;
  const permissions = useWorkspacePermissions({
    userRole: workspace?.menbersRole ?? "VIEWER",
    workspaceStatus: workspace.status,
    isOwner
  });
  return (
    <>
      {(permissions.canEdit ||
        permissions.canArchive ||
        permissions.canDelete ||
        permissions.canRestore ||
        permissions.isLimitedAccess) && (
          <DropdownMenu
            open={open}
            onOpenChange={(open) => onOpenChange(open ? workspace.id : null)}
          >
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} size={"icon"} className="cursor-pointer">
                <Ellipsis className="h-4 w-4" />
                <span className="sr-only">Abrir menu de ações</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuLabel>Opções</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => onRedirect(workspace.id)}>
                <LinkIcon /> ir para workspace
              </DropdownMenuItem>

              {permissions.canEdit && workspace.status === "ACTIVE" && (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => onEdit(workspace)}>
                  <Edit2 /> Editar ou convidar
                </DropdownMenuItem>
              )}

              {permissions.canArchive && (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => onArchive(workspace.id)}
                >
                  <Archive /> Arquivar
                </DropdownMenuItem>
              )}

              {permissions.canDelete && (
                <DropdownMenuItem
                  className="cursor-pointer"
                  variant="destructive"
                  onClick={() => onDelete(workspace?.id)}
                >
                  <Trash /> Mover para lixeira
                </DropdownMenuItem>
              )}

            </DropdownMenuContent>
          </DropdownMenu>
        )}
      {/* {permissions.isReadOnly && (
        <button className="cursor-pointer" onClick={() => onRedirect(workspace.id)}>
          <Badge variant="outline" className="text-xs">
            <Eye className="w-3 h-3 mr-1" />
            Leitura
          </Badge>
        </button>
      )} */}
    </>
  )
}