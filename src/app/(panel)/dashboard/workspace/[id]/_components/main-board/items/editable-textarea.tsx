"use client";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { ItemWhitCreatedAssignedUser } from "@/hooks/use-items";
import { EditingField } from "./types";

interface EditableTextareaProps {
  item: ItemWhitCreatedAssignedUser;
  field: "notes" | "description";
  value: string | null;
  placeholder: string;
  isLoading: string | null;
  editing: { itemId: string | null; field: EditingField };
  permissionsEdit: boolean;
  editingData: ItemWhitCreatedAssignedUser | null;
  onStartEditing: (item: ItemWhitCreatedAssignedUser, field: EditingField) => void;
  onCancelEditing: () => void;
  onSaveField: (item: ItemWhitCreatedAssignedUser) => void;
  setEditingData: (data: ItemWhitCreatedAssignedUser | null) => void;
}

export const EditableTextarea = memo(function EditableTextarea(props: EditableTextareaProps) {
  const {
    item,
    field,
    value,
    placeholder,
    isLoading,
    editing,
    permissionsEdit,
    editingData,
    onStartEditing,
    onCancelEditing,
    onSaveField,
    setEditingData
  } = props;
  const isEditing = editing.itemId === item.id && editing.field === field;

  return (
    <>
      {isEditing && permissionsEdit ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSaveField(item);
          }}
          className="flex items-start gap-2"
        >
          <div className="flex-1 space-y-2">
            <Textarea
              value={editingData?.[field] || ""}
              onChange={(e) =>
                setEditingData(editingData ? { ...editingData, [field]: e.target.value } : null)
              }
              onKeyDown={(e) => {
                if (e.key === "Escape") onCancelEditing();
                if (e.key === "Enter" && e.ctrlKey) onSaveField(item);
              }}
              autoFocus
              disabled={isLoading === item.id}
              className="max-h-[120px] w-85 resize-none"
              placeholder={placeholder}
              maxLength={1000}
            />
            <div className="flex justify-end">
              <span
                className={cn(
                  "text-xs",
                  (editingData?.[field] || "").length > 900 && "text-red-500",
                  (editingData?.[field] || "").length > 800 &&
                    (editingData?.[field] || "").length <= 900 &&
                    "text-yellow-500",
                  (editingData?.[field] || "").length <= 800 && "text-gray-500"
                )}
              >
                {(editingData?.[field] || "").length}/1000
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Button
              type="submit"
              size="sm"
              variant="ghost"
              disabled={isLoading === item.id}
              className="text-green-600 hover:text-green-700"
              title="Salvar (Ctrl + Enter)"
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
              title="Cancelar (Esc)"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </form>
      ) : (
        <Tooltip>
          <TooltipTrigger
            onClick={() => onStartEditing(item, field)}
            className="cursor-pointer hover:bg-accent p-1 rounded transition-colors group w-full text-left"
          >
            {value ? (
              <p
                className="overflow-hidden line-clamp-2 text-ellipsis"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  lineHeight: "1.4em",
                  maxHeight: "2.8em"
                }}
              >
                {value}
              </p>
            ) : (
              <span className="text-gray-400 italic">{placeholder}</span>
            )}
          </TooltipTrigger>
          <TooltipContent>
            {permissionsEdit
              ? "Clique para editar"
              : `Você não tem permissão para alterar ${field === "notes" ? "notas" : "a descrição"}`}
          </TooltipContent>
        </Tooltip>
      )}
    </>
  );
});
