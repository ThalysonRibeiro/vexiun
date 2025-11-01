"use client";
import { Button } from "@/components/ui/button";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { colorPriority, colorStatus, priorityMap, statusMap } from "@/utils/colorStatus";
import { Edit, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CreateOrEditItemForm } from "../create-or-edit-item-form";
import { JSONContent } from "@tiptap/core";
import { ItemWhitCreatedAssignedUser } from "@/hooks/use-items";
import { DetailsEditor } from "../details-editor";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useWorkspaceMemberData, useWorkspacePermissions } from "@/hooks/use-workspace";
import { EntityStatus, WorkspaceRole } from "@/generated/prisma";

type TeamUser = {
  id: string;
  name: string | null;
  image: string | null;
  email: string;
};

export function InfoItem({
  data,
  editable = true,
  team
}: {
  data: ItemWhitCreatedAssignedUser;
  editable?: boolean;
  team: TeamUser[];
}) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const shetRef = useRef<HTMLDivElement>(null);
  const { id: workspaceId } = useParams();
  const { data: session } = useSession();
  const { data: workspace } = useWorkspaceMemberData(workspaceId as string);

  const currentUserId = session?.user.id;
  const isOwner = workspace?.workspace.userId === currentUserId;
  const permissions = useWorkspacePermissions({
    userRole: (workspace?.member.role as WorkspaceRole) ?? "VIEWER",
    workspaceStatus: workspace?.workspace.status as EntityStatus,
    isOwner
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shetRef.current && !shetRef.current.contains(event.target as Node)) {
        setIsEditing(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <SheetContent ref={shetRef} className="overflow-y-scroll min-w-[calc(80vw-25rem)]">
      {editable && permissions.canCreateOrEditItem && (
        <Button
          className="w-fit ml-4 mt-4 border-dashed"
          variant={"outline"}
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {isEditing ? "Cancelar" : "Editar"} {isEditing ? <X /> : <Edit />}
        </Button>
      )}
      {isEditing && editable && permissions.canCreateOrEditItem ? (
        <div className="p-4 space-y-4">
          <CreateOrEditItemForm
            workspaceId={workspaceId as string}
            closeForm={() => setIsEditing(false)}
            initialValues={{
              title: data.title,
              term: data.term,
              priority: data.priority,
              status: data.status,
              notes: data.notes,
              description: data.description,
              assignedTo: data.assignedTo,
              details: data.details as JSONContent
            }}
            team={team}
            groupId={""}
            itemId={data.id}
            editingItem={true}
          />
        </div>
      ) : (
        <div>
          <SheetHeader>
            <SheetTitle>
              {data.title[0].toUpperCase()}
              {data.title.slice(1)}
            </SheetTitle>
            {data.notes && <SheetDescription>{data.notes}</SheetDescription>}
          </SheetHeader>
          <div className="p-4 space-y-4">
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <div className="flex flex-col gap-2 text-sm">
                <Label>Prioridade:</Label>
                <Badge className={`text-xs ${colorPriority(data.priority)}`}>
                  {priorityMap.filter((priority) => priority.key === data.priority)[0].label}
                </Badge>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <Label>Status:</Label>
                <Badge className={`text-xs ${colorStatus(data.status)}`}>
                  {statusMap.filter((status) => status.key === data.status)[0].label}
                </Badge>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <Label>Prazo:</Label>
                <span
                  className={cn(
                    "px-2 py-1 w-fit rounded",
                    new Date(data.term).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                  )}
                >
                  {data.term ? new Date(data.term).toLocaleDateString() : "Não definido"}
                </span>
              </div>
            </div>

            <div className="text-sm">
              <label>Descrição:</label>
              <div className="mt-1 italic bg-accent p-2 rounded border">
                {data.description ? <span>{data.description}</span> : "Não definido"}
              </div>
            </div>

            <DetailsEditor
              content={data.details as JSONContent}
              editable={false}
              onContentChange={() => {}}
            />
          </div>
        </div>
      )}
    </SheetContent>
  );
}
