"use client";
import { useEffect, useRef, useState } from "react";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useItemActions, useItems } from "@/hooks/use-items";
import { ItemCard } from "./items/item-card";
import { ItemTable } from "./items/item-table";
import { ItemsTablesProps } from "./items/types";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "../../../../../../../components/ui/empty-state";
import { List } from "lucide-react";

export function ListItems(props: ItemsTablesProps) {
  const { groupId, team, changeLayout, workspaceId } = props;
  const formRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: items, isLoading: isLoadingItems } = useItems(workspaceId, groupId);

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

  const pagination = usePagination(items?.response ?? [], changeLayout ? 6 : 20);
  const currentItems = pagination.currentItems;

  // Estados para o drag scroll
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (changeLayout) return;

    // Pega o elemento interno com scroll
    const container = scrollRef.current?.querySelector(
      ".relative.w-full.overflow-x-auto"
    ) as HTMLElement;
    if (!container) return;

    // Não inicia drag em elementos interativos
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("input") ||
      target.closest("textarea") ||
      target.closest("select") ||
      target.closest("a")
    ) {
      return;
    }

    setIsDown(true);
    setHasMoved(false);
    container.style.cursor = "grabbing";
    container.style.userSelect = "none";
    container.style.scrollBehavior = "auto";

    setStartX(e.pageX - container.offsetLeft);
    setScrollLeftStart(container.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);

    // Cancela qualquer animação pendente
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    const container = scrollRef.current?.querySelector(
      ".relative.w-full.overflow-x-auto"
    ) as HTMLElement;
    if (container) {
      container.style.cursor = "grab";
      container.style.userSelect = "auto";
    }
  };

  const handleMouseUp = () => {
    setIsDown(false);

    // Cancela qualquer animação pendente
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    const container = scrollRef.current?.querySelector(
      ".relative.w-full.overflow-x-auto"
    ) as HTMLElement;
    if (container) {
      container.style.cursor = "grab";
      container.style.userSelect = "auto";
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDown) return;

    const container = scrollRef.current?.querySelector(
      ".relative.w-full.overflow-x-auto"
    ) as HTMLElement;
    if (!container) return;

    e.preventDefault();

    const x = e.pageX - container.offsetLeft;
    const walk = x - startX; // Removido o multiplicador por enquanto

    const newScrollLeft = scrollLeftStart - walk;

    container.scrollLeft = newScrollLeft;
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        const isPopoverClick = (event.target as Element).closest(
          "[data-radix-popper-content-wrapper]"
        );
        if (!isPopoverClick) {
          cancelEditing();
        }
      }
    }

    if (editing.itemId) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
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
        <EmptyState
          icon={List}
          title="Ainda não há itens cadastrados."
          description="Clique no botão acima para adicionar seu primeiro item."
        />
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
    onMoveToTrash: handleMoveToTrash,
    onArchiveItem: handleArchiveItem,
    onRestoreItem: handleRestoreItem,
    onSaveDetails: handleSaveDetails,
    setEditingData,
    setDialogState
  };

  return (
    <div ref={formRef} className="w-full space-y-6">
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto touch-manipulation"
        style={{
          cursor: !changeLayout ? "grab" : "auto",
          touchAction: "pan-y",
          willChange: "scroll-position"
        }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {changeLayout ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {currentItems.map((item) => (
              <ItemCard key={item.id} item={item} {...commonProps} />
            ))}
          </div>
        ) : (
          <ItemTable currentItems={currentItems} {...commonProps} />
        )}
      </div>

      {(items?.itemsNotCompleted ?? []).length > (changeLayout ? 6 : 20) && (
        <PaginationControls {...pagination} />
      )}
    </div>
  );
}
