"use client"

import { useGroupItemByEntityStatus } from "@/hooks/use-groups";
import { ItemLifecycleView } from "../main-board/items/item-lifecycle-view";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Logs } from "lucide-react";
import { useItemActions } from "@/hooks/use-items";

interface ArchivedProps {
  workspaceId: string;
}

export function Archived({ workspaceId }: ArchivedProps) {
  const [changeLayout, setChangeLayout] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data } = useGroupItemByEntityStatus(workspaceId, "ARCHIVED");
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
                  entityStatus="ARCHIVED"
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