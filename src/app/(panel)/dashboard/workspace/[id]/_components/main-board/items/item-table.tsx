"use client"

import { ItemWhitCreatedAssignedUser } from "@/hooks/use-items";
import { memo } from "react"
import { EntityStatus, Priority, Status, WorkspaceRole } from "@/generated/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { ActionItem } from "./action-item";
import { RenderEditableCell } from "./render-editablecell";
import { EditableTextarea } from "./editable-textarea";
import { ItemResponsible } from "./item-responsible";
import { ItemTerm } from "./item-term";
import { ItemPriorityStatus } from "./priority";
import { colorPriority, colorStatus } from "@/utils/colorStatus";
import { ItemDetails } from "./item-details";
import { DialogStateProps, EditingField, TeamUser } from "./types";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useWorkspaceMemberData, useWorkspacePermissions } from "@/hooks/use-workspace";


interface ItemTableProps {
  currentItems: ItemWhitCreatedAssignedUser[];
  team: TeamUser[];
  isLoading: string | null;
  editing: { itemId: string | null; field: EditingField };
  editingData: ItemWhitCreatedAssignedUser | null;
  dialogState: DialogStateProps;
  onStartEditing: (item: ItemWhitCreatedAssignedUser, field: EditingField) => void;
  onCancelEditing: () => void;
  onSaveField: (item: ItemWhitCreatedAssignedUser) => void;
  onSelectChange: (item: ItemWhitCreatedAssignedUser, field: 'priority' | 'status', value: Priority | Status) => void;
  onDeleteItem: (itemId: string) => void;
  onMoveToTrash: (itemId: string) => void;
  onSaveDetails: (item: ItemWhitCreatedAssignedUser) => void;
  setEditingData: (data: ItemWhitCreatedAssignedUser | null) => void;
  setDialogState: (state: DialogStateProps | ((prev: DialogStateProps) => DialogStateProps)) => void;
  onArchiveItem: (itemId: string) => void;
  onRestoreItem: (itemId: string) => void;
}

export const ItemTable = memo(function ItemTable(props: ItemTableProps) {
  const {
    currentItems,
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

  const { id: workspaceId } = useParams();
  const { data: session } = useSession();
  const { data: workspace } = useWorkspaceMemberData(workspaceId as string);

  const currentUserId = session?.user.id;
  const isOwner = workspace?.workspace.userId === currentUserId;
  const permissions = useWorkspacePermissions({
    userRole: workspace?.member.role as WorkspaceRole ?? "VIEWER",
    workspaceStatus: workspace?.workspace.status as EntityStatus,
    isOwner
  });

  return (
    <Table className="border rounded-lg">
      <TableHeader>
        <TableRow>
          <TableHead className="w-fit">Ações</TableHead>
          <TableHead className="border-x">Titulo</TableHead>
          <TableHead>Notas</TableHead>
          <TableHead className="max-w-25 overflow-hidden border-x text-center">Responsável</TableHead>
          <TableHead>Prazo</TableHead>
          <TableHead className="w-20 border-x">Prioridade</TableHead>
          <TableHead className="w-20">Status</TableHead>
          <TableHead className="text-center border-l">Descrição</TableHead>
          <TableHead className="text-center border-l">Detalhes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentItems.map(item => {
          const titleCapitalized = item.title[0].toUpperCase() + item.title.slice(1);
          return (
            <TableRow key={item.id} className={isLoading === item.id ? 'opacity-50' : ''}>

              <TableCell className="py-0.5">
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
              </TableCell>
              <TableCell className="border-x py-0.5">
                <div className="flex-1 min-w-0 text-base leading-tight">
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
                </div>
              </TableCell>

              <TableCell className="max-w-100 w-full py-0.5">
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
              </TableCell>

              <TableCell className="border-x py-0.5"
                title="Para trocar de responsável edite o item"
              >
                <ItemResponsible item={item} label="" permissionsEdit={permissions.canEdit} />
              </TableCell>

              <TableCell className="py-0.5">
                <ItemTerm
                  label=""
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
              </TableCell>

              <TableCell className={cn("py-0.5", colorPriority(item.priority))}>

                <ItemPriorityStatus
                  className="w-full p-0 border-0 shadow-none"
                  type="priority"
                  label=""
                  item={item}
                  isLoading={isLoading}
                  onSelectChange={onSelectChange}
                  permissionsEdit={permissions.canCreateOrEditItem}
                />
              </TableCell>

              <TableCell className={cn("py-0.5", colorStatus(item.status))}>
                <ItemPriorityStatus
                  className="w-full p-0 border-0 shadow-none"
                  type="status"
                  label=""
                  item={item}
                  isLoading={isLoading}
                  onSelectChange={onSelectChange}
                  permissionsEdit={permissions.canCreateOrEditItem}
                />
              </TableCell>

              <TableCell className="max-w-90 border-l py-0.5">
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
              </TableCell>

              <TableCell className="border-l py-0.5">
                <div className="flex items-center justify-center">
                  <ItemDetails
                    item={item}
                    isLoading={isLoading}
                    dialogState={dialogState}
                    onSaveDetails={onSaveDetails}
                    setDialogState={setDialogState}
                    permissionsEdit={permissions.canCreateOrEditItem}
                  />
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  )
})