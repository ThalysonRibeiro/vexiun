"use client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { colorPriority, colorStatus, } from "@/utils/colorStatus";
import { cn } from "@/lib/utils";
import { Priority, Status } from "@/generated/prisma";
import { ItemWhitCreatedAssignedUser } from "@/hooks/use-items";
import { memo } from "react";

interface ItemPriorityStatusProps {
  className?: string;
  label?: string;
  type: "priority" | "status";
  item: ItemWhitCreatedAssignedUser;
  isLoading: string | null;
  onSelectChange: (item: ItemWhitCreatedAssignedUser, field: "priority" | "status", value: Priority | Status) => void;
}

export const ItemPriorityStatus = memo(function ItemPriorityStatus({
  className,
  label,
  type,
  item,
  isLoading,
  onSelectChange
}: ItemPriorityStatusProps) {
  return (
    <div>
      {type === "priority" && (
        <div>
          {label && <div className="text-xs font-medium text-muted-foreground mb-1.5">{label}</div>}
          <Select
            value={item.priority}
            onValueChange={(value) => onSelectChange(item, "priority", value as Priority)}
            disabled={isLoading === item.id}
          >
            <SelectTrigger className={cn("text-xs h-9 font-medium",
              colorPriority(item.priority),
              className
            )}
              size="sm"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CRITICAL" className={colorPriority("CRITICAL")}>
                CRÍTICO
              </SelectItem>
              <SelectItem value="HIGH" className={colorPriority("HIGH")}>
                ALTO
              </SelectItem>
              <SelectItem value="MEDIUM" className={colorPriority("MEDIUM")}>
                MÉDIO
              </SelectItem>
              <SelectItem value="LOW" className={colorPriority("LOW")}>
                BAIXO
              </SelectItem>
              <SelectItem value="STANDARD" className={colorPriority("STANDARD")}>
                PADRÃO
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      {type === "status" && (
        <div>
          {label && <div className="text-xs font-medium text-muted-foreground mb-1.5">{label}</div>}
          <Select
            value={item.status}
            onValueChange={(value) => onSelectChange(item, "status", value as Status)}
            disabled={isLoading === item.id}
          >
            <SelectTrigger className={cn("text-xs h-9 font-medium",
              colorStatus(item.status),
              className
            )}
              size="sm"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DONE" className={colorStatus("DONE")}>
                CONCLUÍDO
              </SelectItem>
              <SelectItem value="IN_PROGRESS" className={colorStatus("IN_PROGRESS")}>
                EM ANDAMENTO
              </SelectItem>
              <SelectItem value="STOPPED" className={colorStatus("STOPPED")}>
                INTERROMPIDO
              </SelectItem>
              <SelectItem value="NOT_STARTED" className={colorStatus("NOT_STARTED")}>
                NÃO INICIADO
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
});