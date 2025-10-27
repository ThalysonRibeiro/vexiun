"use client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { colorPriority, colorStatus, priorityMap, statusMap, } from "@/utils/colorStatus";
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
            <SelectTrigger
              className={cn("text-xs h-9 font-medium", colorPriority(item.priority), className)}
              size="sm"
            >
              <SelectValue>
                {(() => {
                  const p = priorityMap.find(p => p.key === item.priority);
                  return p ? (
                    <div className="flex items-center gap-1.5">
                      <p.icon className="h-3.5 w-3.5 text-white" />
                      <span>{p.label}</span>
                    </div>
                  ) : null;
                })()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {priorityMap.map((p) => (
                <SelectItem
                  key={p.key}
                  value={p.key}
                  className={cn("cursor-pointer", colorPriority(p.key))}
                >
                  <div className="flex items-center gap-2">
                    <p.icon className="h-4 w-4 text-white" />
                    <span>{p.label}</span>
                  </div>
                </SelectItem>
              ))}
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
            <SelectTrigger
              className={cn("text-xs h-9 font-medium", colorStatus(item.status), className)}
              size="sm"
            >
              <SelectValue>
                {(() => {
                  const s = statusMap.find(s => s.key === item.status);
                  return s ? (
                    <div className="flex items-center gap-1.5">
                      <s.icon className={cn("h-3.5 w-3.5 text-white", s.animate && "animate-spin")} />
                      <span className="text-white">{s.label}</span>
                    </div>
                  ) : null;
                })()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {statusMap.map((s) => (
                <SelectItem
                  key={s.key}
                  value={s.key}
                  className={cn("cursor-pointer", colorStatus(s.key))}
                >
                  <div className="flex items-center gap-2">
                    <s.icon className={cn("h-4 w-4 text-white", s.animate && "animate-spin")} />
                    <span>{s.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
});