"use client"
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Check, X, CircleAlert, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { ItemWhitCreatedAssignedUser } from "@/hooks/use-items";
import { memo } from "react";
import { CalendarTerm } from "../calendar-term";
import { EditingField } from "./types";

interface ItemTermProps {
  label: string;
  className?: string;
  item: ItemWhitCreatedAssignedUser;
  isLoading: string | null;
  editing: { itemId: string | null; field: EditingField };
  editingData: ItemWhitCreatedAssignedUser | null;
  onStartEditing: (item: ItemWhitCreatedAssignedUser, field: EditingField) => void;
  onCancelEditing: () => void;
  onSaveField: (item: ItemWhitCreatedAssignedUser) => void;
  setEditingData: (data: ItemWhitCreatedAssignedUser | null) => void;
}


export const ItemTerm = memo(function ItemTerm({
  item,
  isLoading,
  editing,
  editingData,
  onStartEditing,
  onCancelEditing,
  onSaveField,
  setEditingData,
  label,
  className
}: ItemTermProps) {
  const isEditing = editing.itemId === item.id && editing.field === 'term';
  const isOverdue = new Date(item.term) < new Date() && item.status !== 'DONE';
  const isCompleted = new Date(item.term) < new Date() && item.status === 'DONE';

  return (
    <div>
      {label && <div className="text-xs font-medium text-muted-foreground mb-1.5">{label}</div>}
      {isEditing ? (
        <div className="flex items-center gap-2">
          <CalendarTerm
            initialDate={editingData?.term || item.term}
            onChange={(dateRange) => {
              setEditingData(editingData ? { ...editingData, term: dateRange } : null);
            }}
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onSaveField(item)}
            disabled={isLoading === item.id}
            className="text-green-600 hover:text-green-700 h-8 w-8 p-0"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancelEditing}
            disabled={isLoading === item.id}
            className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => onStartEditing(item, 'term')}
          className={cn(
            "flex items-center justify-center gap-2 py-1 px-3 rounded-md font-medium text-sm cursor-pointer transition-colors",
            isOverdue
              ? "text-red-800 hover:bg-red-600/20"
              : "text-foreground hover:bg-muted",
          )}
          title="Clique para editar"
        >
          {isOverdue && <CircleAlert className="h-4 w-4" />}
          {isCompleted && <Check className="h-4 w-4 text-green-600" />}
          <Calendar className="h-4 w-4" />
          <span>{format(item.term, "dd/MM/yyyy")}</span>
        </div>
      )}
    </div>
  );
});