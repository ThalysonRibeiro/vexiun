"use client"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Eye } from "lucide-react";
import { ItemWhitCreatedAssignedUser } from "@/hooks/use-items";
import { JSONContent } from "@tiptap/core";
import { memo } from "react";
import { DetailsEditor } from "../details-editor";
import { DialogStateProps } from "./types";


interface ItemCardFooterProps {
  item: ItemWhitCreatedAssignedUser;
  isLoading: string | null;
  dialogState: DialogStateProps;
  onSaveDetails: (item: ItemWhitCreatedAssignedUser) => void;
  setDialogState: (state: DialogStateProps | ((prev: DialogStateProps) => DialogStateProps)) => void;
  permissionsEdit: boolean;
}

export const ItemDetails = memo(function ItemDetails(props: ItemCardFooterProps) {
  const {
    item,
    isLoading,
    dialogState,
    onSaveDetails,
    setDialogState,
    permissionsEdit,
  } = props;

  return (
    <Dialog
      open={dialogState.isOpen && dialogState.itemId === item.id}
      onOpenChange={(open) => {
        if (open) {
          setDialogState({
            isOpen: true,
            itemId: item.id,
            isEditing: false,
            content: (item.details as JSONContent) ?? {}
          });
        } else {
          setDialogState({ isOpen: false, itemId: null, isEditing: false, content: null });
        }
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger className="w-full" asChild>
            <Button variant="outline" className="w-full" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Detalhes do item
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          {permissionsEdit
            ? "Clique para visualizar ou editar os detalhes do item"
            : "Clique para visualizar os detalhes do item"}
        </TooltipContent>
      </Tooltip>
      <DialogContent className="min-h-50 max-h-[calc(100dvh-3rem)] min-w-[calc(100dvw-20rem)] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Detalhes do item</DialogTitle>
          <DialogDescription>
            {dialogState.isEditing
              ? "Editando detalhes - suas alterações não foram salvas"
              : `Visualizando detalhes de ${item.title || 'item'}`}
          </DialogDescription>
        </DialogHeader>
        <div className="pb-6 w-full overflow-y-scroll min-h-50 max-h-120">
          <DetailsEditor
            autofocus={true}
            editable={dialogState.isEditing}
            content={dialogState.content ?? {}}
            onContentChange={(newContent) => {
              setDialogState(prev => ({ ...prev, content: newContent }));
            }}
          />
        </div>
        {permissionsEdit && (
          <div className="flex justify-end gap-2 border-t pt-4">
            {!dialogState.isEditing ? (
              <Button onClick={() => setDialogState(prev => ({ ...prev, isEditing: true }))}>
                Editar
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDialogState(prev => ({
                      ...prev,
                      isEditing: false,
                      content: (item.details as JSONContent) ?? {}
                    }));
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => onSaveDetails(item)}
                  disabled={isLoading === item.id}
                >
                  Salvar
                </Button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
});