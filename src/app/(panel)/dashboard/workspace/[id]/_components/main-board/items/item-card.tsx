"use client"

import { ItemWhitCreatedAssignedUser } from "@/hooks/use-items";
import { memo } from "react";
import { Priority, Status } from "@/generated/prisma";
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
import { DialogStateProps, EditingField, TeamUser } from "./types";



interface ItemCardProps {
  item: ItemWhitCreatedAssignedUser;
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
  onSaveDetails: (item: ItemWhitCreatedAssignedUser) => void;
  setEditingData: (data: ItemWhitCreatedAssignedUser | null) => void;
  setDialogState: (state: DialogStateProps | ((prev: DialogStateProps) => DialogStateProps)) => void;
}

export const ItemCard = memo(function ItemCard({
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
  onSaveDetails,
  setEditingData,
  setDialogState
}: ItemCardProps
) {
  const titleCapitalized = item.title[0].toUpperCase() + item.title.slice(1);
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
            onDeleteItem={onDeleteItem}
            onArchiveItem={() => { }}
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
          item={item} label="Responsável"
          className="p-2 bg-muted/50 rounded-md hover:bg-muted transition-colors"
        />

        <ItemTerm
          label="Prazo"
          className=""
          item={item}
          isLoading={isLoading}
          editing={editing}
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
          />
          <ItemPriorityStatus
            type="status"
            label="Status"
            item={item}
            isLoading={isLoading}
            onSelectChange={onSelectChange}
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
        />
      </CardFooter>
    </Card>
  );
})