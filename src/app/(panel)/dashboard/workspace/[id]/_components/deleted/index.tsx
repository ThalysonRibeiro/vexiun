"use client"

import { Button } from "@/components/ui/button";
import { ItemLifecycleView } from "../main-board/items/item-lifecycle-view";
import { LayoutGrid, Logs } from "lucide-react";
import { useState } from "react";
import { useGroupItemByEntityStatus } from "@/hooks/use-groups";
import { useItemActions } from "@/hooks/use-items";

interface DeletedProps {
  workspaceId: string;

}

export function Deleted({ workspaceId }: DeletedProps) {
  const [changeLayout, setChangeLayout] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data } = useGroupItemByEntityStatus(workspaceId, "DELETED");
  const {
    dialogState,
    editing,
    editingData,
    isLoading,
    setDialogState,
    setEditingData,
    startEditing,
    cancelEditing,
    handleSaveDetails,
    handleSaveField,
    handleSelectChange,
    handleDeleteItem,
    handleMoveToTrash,
    handleArchiveItem,
    handleRestoreItem
  } = useItemActions(workspaceId);

  const commonProps = {
    isLoading,
    editing,
    editingData,
    dialogState,
    onStartEditing: startEditing,
    onCancelEditing: cancelEditing,
    onSaveField: handleSaveField,
    onSelectChange: handleSelectChange,
    onDeleteItem: handleDeleteItem,
    onMoveToTrash: handleMoveToTrash,
    onArchiveItem: handleArchiveItem,
    onRestoreItem: handleRestoreItem,
    onSaveDetails: handleSaveDetails,
    setEditingData,
    setDialogState,
  };

  return (
    <section>

      <div>
        <Button
          onClick={() => setChangeLayout(prev => !prev)}
          variant="outline"
          className="cursor-pointer"
        >
          {changeLayout ? <Logs /> : <LayoutGrid />}
          <span>Layout</span>
          {changeLayout ? "lista" : "grid"}
        </Button>
        <div>
          {data?.map((group, index) => {

            return (
              <div key={group.id}>
                {group.title}
                <ItemLifecycleView
                  items={group.item}
                  changeLayout={changeLayout}
                  textColor={group.textColor}
                  entityStatus="DELETED"
                  {...commonProps}
                />
              </div>
            )
          })}
        </div>
      </div>


    </section>
  )
}