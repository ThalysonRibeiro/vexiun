"use client"
import { useEffect, useRef } from "react";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import {
  useItemActions,
  useItems
} from "@/hooks/use-items";
import { ItemCard } from "./items/item-card";
import { ItemTable } from "./items/item-table";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ItemsTablesProps } from "./items/types";
import { Skeleton } from "@/components/ui/skeleton";


export function ListItems({ groupId, team, changeLayout }: ItemsTablesProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const { data: items, isLoading: isLoadingItems } = useItems(groupId);

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
  } = useItemActions();

  const pagination = usePagination(items?.itemsNotCompleted ?? [], 10);
  const currentItems = pagination.currentItems;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        const isPopoverClick = (event.target as Element).closest('[data-radix-popper-content-wrapper]');
        if (!isPopoverClick) {
          cancelEditing();
        }
      }
    }

    if (editing.itemId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [editing.itemId, cancelEditing]);

  // Estados de loading e vazio
  if (isLoadingItems) {
    return (
      <>
        {changeLayout ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
            <Skeleton className="h-100" />
          </div>
        ) : (
          <div className="space-y-1">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        )}
      </>
    );
  }

  if (items?.itemsNotCompleted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <EmptyState title="Ainda não há itens cadastrados." description="Clique no botão acima para adicionar seu primeiro item." />
      </div>
    );
  }

  const commonProps = {
    team,
    isLoading,
    editing,
    editingData,
    dialogState,
    onStartEditing: startEditing,
    onCancelEditing: cancelEditing,
    onSaveField: handleSaveField,
    onSelectChange: handleSelectChange,
    onDeleteItem: handleDeleteItem,
    onSaveDetails: handleSaveDetails,
    setEditingData,
    setDialogState,
  };

  return (
    <div ref={formRef} className="w-full space-y-6">
      <div className="w-full overflow-x-auto">
        {changeLayout ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {currentItems.map(item => (
              <ItemCard key={item.id} item={item} {...commonProps} />
            ))}
          </div>
        ) : (
          <ItemTable currentItems={currentItems} {...commonProps} />
        )}
      </div>

      {(items?.itemsNotCompleted ?? []).length > 10 && (
        <PaginationControls {...pagination} />
      )}
    </div>
  );
}