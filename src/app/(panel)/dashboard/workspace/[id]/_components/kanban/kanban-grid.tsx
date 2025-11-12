"use client";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EntityStatus, Status, WorkspaceRole } from "@/generated/prisma";
import { Eye, Plus } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DialogContentNewItem } from "./dialog-new-item";
import { Button } from "@/components/ui/button";
import { colorPriority, colorStatus, priorityMap, statusMap } from "@/utils/colorStatus";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { InfoItem } from "../main-board/items/info-item";
import { cn } from "@/lib/utils";
import { ItemWhitCreatedAssignedUser, useItemsByStatus, useUpdateItem } from "@/hooks/use-items";
import { useParams } from "next/navigation";
import { useTeam } from "@/hooks/use-team";
import { isSuccessResponse } from "@/lib/errors";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { useWorkspaceMemberData, useWorkspacePermissions } from "@/hooks/use-workspace";

export function KanbanGrid() {
  const params = useParams();
  const workspaceId = params.id as string;
  const { data, isLoading } = useItemsByStatus(workspaceId);
  const { data: team } = useTeam(workspaceId);
  const [draggedItem, setDraggedItem] = useState<ItemWhitCreatedAssignedUser | null>(null);
  const [isCloseDialog, setIsCloseDialog] = useState<boolean>(false);
  const [getStatus, setGetStatus] = useState<Status>("NOT_STARTED");
  const updateItem = useUpdateItem();

  const { data: session } = useSession();
  const { data: workspace } = useWorkspaceMemberData(workspaceId as string);

  const currentUserId = session?.user.id;
  const isOwner = workspace?.workspace.userId === currentUserId;
  const permissions = useWorkspacePermissions({
    userRole: (workspace?.member.role as WorkspaceRole) ?? "VIEWER",
    workspaceStatus: workspace?.workspace.status as EntityStatus,
    isOwner
  });

  function handleDragStart(e: React.DragEvent, item: ItemWhitCreatedAssignedUser) {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";

    // Criar preview customizado
    const dragPreview = document.createElement("div");
    const statusClass = `text-xs px-1 py-0.5 rounded-md ${colorStatus(item.status)}`;
    const priorityClass = `text-xs px-1 py-0.5 rounded-md ${colorPriority(item.priority)}`;
    dragPreview.className =
      "h-35 w-60 bg-background border-1 border-primary/50 rounded-lg p-3 shadow-lg opacity-90 space-y-1";
    dragPreview.innerHTML = /*html*/ `
      <div class="font-medium truncate">${item.title}</div>
      <div class="text-sm">
        ${format(new Date(item.term), "dd/MM/yyyy")}
      </div>
      <div class="flex gap-4 text-muted-foreground">
        <span class="${statusClass}">
          ${statusMap.filter((status) => status.key === item.status)[0].label}
        </span>
        <span class="${priorityClass}">
          ${priorityMap.filter((priority) => priority.key === item.priority)[0].label}
        </span>
      </div>
      <div class="text-sm truncate">${item.notes}</div>
    `;

    // Posicionar fora da tela
    dragPreview.style.position = "absolute";
    dragPreview.style.top = "-1000px";
    dragPreview.style.left = "-1000px";

    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 0, 0);

    // Remover após um tempo
    setTimeout(() => {
      document.body.removeChild(dragPreview);
    }, 0);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
  }

  async function handleDrop(e: React.DragEvent, status: Status) {
    e.preventDefault();
    if (draggedItem && draggedItem.status !== status) {
      const response = await updateItem.mutateAsync({
        workspaceId,
        itemId: draggedItem.id,
        status: status,
        priority: draggedItem.priority,
        complexity: draggedItem.complexity,
        // term: draggedItem.term,
        description: draggedItem.description,
        notes: draggedItem.notes,
        title: draggedItem.title
      });
      if (!isSuccessResponse(response)) {
        toast.error("Erro ao cadastrar item");
        return;
      }
    }
    setDraggedItem(null);
  }

  const statusConfig = [
    {
      status: "DONE" as Status,
      title: "Concluído",
      bgColor: "bg-green-500",
      count: data?.statusDone.length ?? 0
    },
    {
      status: "IN_PROGRESS" as Status,
      title: "Em Progresso",
      bgColor: "bg-blue-500",
      count: data?.statusInProgress.length ?? 0
    },
    {
      status: "STOPPED" as Status,
      title: "Parado",
      bgColor: "bg-red-500",
      count: data?.statusStoped.length ?? 0
    },
    {
      status: "NOT_STARTED" as Status,
      title: "Não Iniciado",
      bgColor: "bg-zinc-500",
      count: data?.statusNotStarted.length ?? 0
    }
  ];

  if (isLoading) {
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-4 border-t-accent rounded-full animate-spin border-primary"></div>
    );
  }

  return (
    <section className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 pb-4 min-h-[calc(100vh-10rem)]">
      {statusConfig.map((config) => (
        <Card
          key={config.status}
          className={`pt-0 overflow-hidden transition-all duration-200 ${
            draggedItem ? "border border-dashed border-primary/50 bg-zinc-600/20" : ""
          }`}
          onDrop={(e) => handleDrop(e, config.status)}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
        >
          <CardHeader className={`${config.bgColor} py-4`}>
            <CardTitle
              className={cn(
                "text-white",
                config.status === "DONE" && "mb-4",
                !permissions.canCreateOrEditItem && "mb-4"
              )}
            >
              {config.title} ({config.count})
            </CardTitle>
            {config.status !== "DONE" && permissions.canCreateOrEditItem && (
              <CardAction>
                <Dialog open={isCloseDialog} onOpenChange={setIsCloseDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      className="cursor-pointer hover:bg-transparent"
                      onClick={() => setGetStatus(config.status)}
                    >
                      <Plus className="text-white" />
                    </Button>
                  </DialogTrigger>
                  <DialogContentNewItem closeDialog={setIsCloseDialog} status={getStatus} />
                </Dialog>
              </CardAction>
            )}
          </CardHeader>
          <CardContent className="space-y-2 px-2 max-h-[65vh] overflow-auto">
            {data?.response
              .filter((item) => item.status === config.status)
              .map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "space-y-1 text-sm border rounded bg-background p-2 kanban-item hover:shadow-md transition-all duration-200 select-none",
                    draggedItem?.id === item.id
                      ? "opacity-50 scale-95 rotate-2 border border-dashed border-primary/50"
                      : "",
                    config.status !== "DONE" && "cursor-move",
                    !permissions.canCreateOrEditItem && "cursor-auto"
                  )}
                  draggable={config.status !== "DONE" && permissions.canCreateOrEditItem}
                  onDragStart={(e) => handleDragStart(e, item)}
                >
                  <h3 className="font-medium truncate">{item.title}</h3>
                  <div className="flex gap-4 text-muted-foreground">
                    <Badge className={`text-xs ${colorStatus(item.status)}`}>
                      {statusMap.filter((status) => status.key === item.status)[0].label}
                    </Badge>
                    <Badge className={`text-xs ${colorPriority(item.priority)}`}>
                      {priorityMap.filter((priority) => priority.key === item.priority)[0].label}
                    </Badge>
                  </div>
                  <p className="text-xs">{format(new Date(item.term), "dd/MM/yyyy")}</p>
                  {<h4 className="text-sm mt-2 truncate">{item.notes}</h4>}
                  <div>
                    <Sheet>
                      <SheetTrigger className="cursor-pointer flex items-center gap-2 hover:bg-accent py-1 px-2 rounded transition-colors border border-dashed">
                        <Eye className="h-4 w-4" /> Visualizar
                      </SheetTrigger>
                      <InfoItem
                        data={item}
                        editable={config.status !== "DONE" ? true : false}
                        team={team ?? []}
                      />
                    </Sheet>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
