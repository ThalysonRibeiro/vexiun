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
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Edit2,
  FolderKanban,
  FolderTree,
  Inbox,
  LayoutGrid,
  Logs,
  Users
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { BadgeWorkspace } from "@/components/badge-workspace";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { WorkspaceForm } from "./workspace-form";
import { useRef, useState } from "react";
import Link from "next/link";
import { useActionsWorkspaceList } from "@/hooks/use-workspace";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES_MAP } from "@/lib/constants";
import { InviteMembersToWorkspaces } from "@/components/invite-members-to-workspaces";
import { WorkspaceWithDetails } from "./workspaces-page-client";
import { ActionsWorkspaceList } from "./actions-workspace-list";

interface WorkspaceListProps {
  workspaces: WorkspaceWithDetails[];
}

export function WorkspaceList({ workspaces }: WorkspaceListProps) {
  const [changeLayout, setChangeLayout] = useState<boolean>(false);
  const [changeEditOrInvite, setChangeEditOrInvite] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const router = useRouter();
  const {
    isOpen,
    dropdownOpen,
    selectedWorkspace,
    setIsOpen,
    setDropdownOpen,
    setSelectedWorkspace,
    handleArchive,
    handleDelete,
    handleSelectForEdit
  } = useActionsWorkspaceList();

  const commonProps = {
    isOpen,
    dropdownOpen,
    selectedWorkspace,
    setIsOpen,
    onOpenChange: setDropdownOpen,
    onArchive: handleArchive,
    onDelete: handleDelete,
    onEdit: handleSelectForEdit
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (changeLayout) return;

    const container = scrollRef.current?.querySelector('.relative.w-full.overflow-x-auto') as HTMLElement;
    if (!container) return;

    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('select') ||
      target.closest('a')
    ) {
      return;
    }

    setIsDown(true);
    container.style.cursor = 'grabbing';
    container.style.userSelect = 'none';
    container.style.scrollBehavior = 'auto';

    setStartX(e.pageX - container.offsetLeft);
    setScrollLeftStart(container.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    const container = scrollRef.current?.querySelector('.relative.w-full.overflow-x-auto') as HTMLElement;
    if (container) {
      container.style.cursor = 'grab';
      container.style.userSelect = 'auto';
    }
  };

  const handleMouseUp = () => {
    setIsDown(false);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    const container = scrollRef.current?.querySelector('.relative.w-full.overflow-x-auto') as HTMLElement;
    if (container) {
      container.style.cursor = 'grab';
      container.style.userSelect = 'auto';
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDown) return;

    const container = scrollRef.current?.querySelector('.relative.w-full.overflow-x-auto') as HTMLElement;
    if (!container) return;

    e.preventDefault();

    const x = e.pageX - container.offsetLeft;
    const walk = x - startX;

    const newScrollLeft = scrollLeftStart - walk;

    container.scrollLeft = newScrollLeft;
  };

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

      <div
        ref={scrollRef}
        className="w-full overflow-x-auto touch-manipulation"
        style={{
          cursor: !changeLayout ? 'grab' : 'auto',
          touchAction: 'pan-y',
          willChange: 'scroll-position'
        }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
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
                      open={dropdownOpen === workspace.id}
                      {...commonProps}
                      onRedirect={() =>
                        router.push(`/dashboard/workspace/${workspace?.id}`)
                      }
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
                      open={dropdownOpen === workspace.id}
                      {...commonProps}
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
      </div>
    </section>
  );
}