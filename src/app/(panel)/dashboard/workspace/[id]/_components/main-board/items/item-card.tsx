"use client";

import { ItemWhitCreatedAssignedUser } from "@/hooks/use-items";
import { memo } from "react";
import { EntityStatus, Priority, Status, WorkspaceRole } from "@/generated/prisma";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ActionItem } from "./action-item";
import { EditableTextarea } from "./editable-textarea";
import { ItemResponsible } from "./item-responsible";
import { ItemTerm } from "./item-term";
import { ItemPriorityStatus } from "./priority";
import { ItemDetails } from "./item-details";
import { RenderEditableCell } from "./render-editablecell";
import { DialogStateProps, EditingField } from "./types";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useWorkspaceMemberData, useWorkspacePermissions } from "@/hooks/use-workspace";
import { TeamResponse } from "@/hooks/use-team";

interface ItemCardProps {
  item: ItemWhitCreatedAssignedUser;
  team: TeamResponse;
  isLoading: string | null;
  editing: { itemId: string | null; field: EditingField };
  editingData: ItemWhitCreatedAssignedUser | null;
  dialogState: DialogStateProps;
  onStartEditing: (item: ItemWhitCreatedAssignedUser, field: EditingField) => void;
  onCancelEditing: () => void;
  onSaveField: (item: ItemWhitCreatedAssignedUser) => void;
  onSelectChange: (
    item: ItemWhitCreatedAssignedUser,
    field: "priority" | "status",
    value: Priority | Status
  ) => void;
  onDeleteItem: (itemId: string) => void;
  onMoveToTrash: (itemId: string) => void;
  onSaveDetails: (item: ItemWhitCreatedAssignedUser) => void;
  setEditingData: (data: ItemWhitCreatedAssignedUser | null) => void;
  setDialogState: (
    state: DialogStateProps | ((prev: DialogStateProps) => DialogStateProps)
  ) => void;
  onArchiveItem: (itemId: string) => void;
  onRestoreItem: (itemId: string) => void;
}

export const ItemCard = memo(function ItemCard(props: ItemCardProps) {
  const {
    item,
    team,
    isLoading,
    editing,
    editingData,
    dialogState,
    onStartEditing,
    onCancelEditing,
    onSaveField,
    onSelectChange,
    onDeleteItem,
    onMoveToTrash,
    onSaveDetails,
    setEditingData,
    setDialogState,
    onArchiveItem,
    onRestoreItem
  } = props;
  const titleCapitalized = item.title[0].toUpperCase() + item.title.slice(1);
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
  return (
    <Card
      key={item.id}
      className={cn(
        "flex flex-col hover:shadow-md transition-shadow",
        isLoading === item.id && "opacity-50"
      )}
    >
      <CardHeader>
        <CardTitle className="flex-1 min-w-0 text-base leading-tight">
          <RenderEditableCell
            item={item}
            field={"title"}
            value={titleCapitalized}
            isEditing={(itemId, field) => editing.itemId === itemId && editing.field === field}
            permissionsEdit={permissions.canCreateOrEditItem}
            onStartEditing={onStartEditing}
            onCancelEditing={onCancelEditing}
            onSaveField={onSaveField}
            isLoading={isLoading}
            editingData={editingData}
            setEditingData={setEditingData}
          />
        </CardTitle>

        <CardAction>
          <ActionItem
            item={item}
            team={team}
            isLoading={isLoading}
            entityStatus="ACTIVE"
            onDeleteItem={onDeleteItem}
            onMoveToTrash={onMoveToTrash}
            onArchiveItem={() => onArchiveItem(item.id)}
            onRestoreItem={() => onRestoreItem(item.id)}
          />
        </CardAction>

        <CardDescription className="space-y-3 pt-2">
          <EditableTextarea
            item={item}
            field="notes"
            value={item.notes || null}
            placeholder="Clique para adicionar notas"
            isLoading={isLoading}
            editing={editing}
            permissionsEdit={permissions.canCreateOrEditItem}
            editingData={editingData}
            onSaveField={onSaveField}
            onStartEditing={onStartEditing}
            onCancelEditing={onCancelEditing}
            setEditingData={setEditingData}
          />
          <EditableTextarea
            item={item}
            field="description"
            value={item.description || null}
            placeholder="Clique para adicionar descrição"
            isLoading={isLoading}
            editing={editing}
            permissionsEdit={permissions.canCreateOrEditItem}
            editingData={editingData}
            onSaveField={onSaveField}
            onStartEditing={onStartEditing}
            onCancelEditing={onCancelEditing}
            setEditingData={setEditingData}
          />
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 pt-0">
        <ItemResponsible
          item={item}
          label="Responsável"
          permissionsEdit={permissions.canEdit}
          className="p-2 bg-muted/50 rounded-md hover:bg-muted transition-colors"
        />

        <ItemTerm
          label="Prazo"
          className=""
          item={item}
          isLoading={isLoading}
          editing={editing}
          permissionsEdit={permissions.canCreateOrEditItem}
          editingData={editingData}
          onStartEditing={onStartEditing}
          onCancelEditing={onCancelEditing}
          onSaveField={onSaveField}
          setEditingData={setEditingData}
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
          <ItemPriorityStatus
            type="priority"
            label="Prioridade"
            item={item}
            isLoading={isLoading}
            onSelectChange={onSelectChange}
            permissionsEdit={permissions.canCreateOrEditItem}
          />
          <ItemPriorityStatus
            type="status"
            label="Status"
            item={item}
            isLoading={isLoading}
            onSelectChange={onSelectChange}
            permissionsEdit={permissions.canCreateOrEditItem}
          />
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <ItemDetails
          item={item}
          isLoading={isLoading}
          dialogState={dialogState}
          onSaveDetails={onSaveDetails}
          setDialogState={setDialogState}
          permissionsEdit={permissions.canCreateOrEditItem}
        />
      </CardFooter>
    </Card>
  );
});
