"use client"

import { ItemWhitCreatedAssignedUser } from "@/hooks/use-items";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { memo } from "react";
import { EditingField } from "./types";

interface RenderEditableCellProps {
  item: ItemWhitCreatedAssignedUser,
  field: EditingField,
  value: string | null | undefined,
  isEditing: (itemId: string, field: EditingField) => boolean,
  editingData: ItemWhitCreatedAssignedUser | null,
  setEditingData: (data: ItemWhitCreatedAssignedUser | null) => void,
  onStartEditing: (item: ItemWhitCreatedAssignedUser, field: EditingField) => void,
  onCancelEditing: () => void,
  onSaveField: (item: ItemWhitCreatedAssignedUser) => void,
  isLoading: string | null,
}

export const RenderEditableCell = memo(function RenderEditableCell({
  item,
  field,
  value,
  isEditing,
  editingData,
  setEditingData,
  onStartEditing,
  onCancelEditing,
  onSaveField,
  isLoading,
}: RenderEditableCellProps) {
  if (isEditing(item.id, field) && field) {
    const fieldValue = editingData?.[field] as string || '';

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSaveField(item);
        }}
        className="flex items-center gap-2"
      >
        <Input
          value={fieldValue}
          onChange={(e) => setEditingData(editingData ? { ...editingData, [field]: e.target.value } : null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onCancelEditing();
            if (e.key === 'Enter') onSaveField(item);
          }}
          autoFocus
          disabled={isLoading === item.id}
          className="flex-1"
        />
        <Button
          type="submit"
          size="sm"
          variant="ghost"
          disabled={isLoading === item.id}
          className="text-green-600 hover:text-green-700"
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onCancelEditing}
          disabled={isLoading === item.id}
          className="text-red-600 hover:text-red-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </form>
    );
  }

  return (
    <button
      onClick={() => onStartEditing(item, field)}
      className="cursor-pointer hover:bg-accent p-1 rounded transition-colors overflow-auto"
      title="Clique para editar"
    >
      <p className="overflow-hidden max-w-75 text-ellipsis truncate" style={{
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        lineHeight: '1.4em',
        maxHeight: '2.8em'
      }}>
        {value || 'Clique para editar'}
      </p>
    </button>
  );
});


