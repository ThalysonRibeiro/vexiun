"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  colorComplexity,
  colorPriority,
  colorStatus,
  complexityMap,
  priorityMap,
  statusMap
} from "@/utils/colorStatus";
import { cn } from "@/lib/utils";
import { Priority, Status } from "@/generated/prisma";
import { ItemWhitCreatedAssignedUser } from "@/hooks/use-items";
import { memo } from "react";

interface ItemPriorityStatusProps {
  className?: string;
  label?: string;
  type: "priority" | "status" | "complexity";
  item: ItemWhitCreatedAssignedUser;
  isLoading: string | null;
  onSelectChange: (
    item: ItemWhitCreatedAssignedUser,
    field: "priority" | "status" | "complexity",
    value: Priority | Status
  ) => void;
  permissionsEdit: boolean;
}

export const ItemPriorityStatus = memo(function ItemPriorityStatus(props: ItemPriorityStatusProps) {
  const { className, label, type, item, isLoading, onSelectChange, permissionsEdit } = props;

  const isDisabled = isLoading === item.id || !permissionsEdit;

  // if (type === "priority") {

  // }

  switch (type) {
    case "priority":
      const currentPriority = priorityMap.find((p) => p.key === item.priority);

      return (
        <div>
          {label && <div className="text-xs font-medium text-muted-foreground mb-1.5">{label}</div>}
          <Select
            value={item.priority}
            onValueChange={(value) => onSelectChange(item, "priority", value as Priority)}
            disabled={isDisabled}
          >
            <SelectTrigger
              className={cn(
                "text-xs h-9 font-medium",
                colorPriority(item.priority),
                !permissionsEdit && "cursor-not-allowed opacity-70",
                className
              )}
              size="sm"
            >
              <SelectValue>
                {currentPriority && (
                  <div className="flex items-center gap-1.5">
                    <currentPriority.icon className="h-3.5 w-3.5 text-white" />
                    <span>{currentPriority.label}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="p-2">
              {priorityMap.map((p) => (
                <SelectItem
                  key={p.key}
                  value={p.key}
                  className={cn("cursor-pointer rounded-none mb-1", colorPriority(p.key))}
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
      );
    case "status":
      const currentStatus = statusMap.find((s) => s.key === item.status);

      return (
        <div>
          {label && <div className="text-xs font-medium text-muted-foreground mb-1.5">{label}</div>}
          <Select
            value={item.status}
            onValueChange={(value) => onSelectChange(item, "status", value as Status)}
            disabled={isDisabled}
          >
            <SelectTrigger
              className={cn(
                "text-xs h-9 font-medium",
                colorStatus(item.status),
                !permissionsEdit && "cursor-not-allowed opacity-70",
                className
              )}
              size="sm"
            >
              <SelectValue>
                {currentStatus && (
                  <div className="flex items-center gap-1.5">
                    <currentStatus.icon
                      className={cn(
                        "h-3.5 w-3.5 text-white",
                        currentStatus.animate && "animate-spin"
                      )}
                    />
                    <span className="text-white">{currentStatus.label}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="p-2">
              {statusMap.map((s) => (
                <SelectItem
                  key={s.key}
                  value={s.key}
                  className={cn("cursor-pointer rounded-none mb-1", colorStatus(s.key))}
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
      );
    case "complexity":
      const currentComplexity = complexityMap.find((p) => p.key === item.complexity);

      return (
        <div>
          {label && <div className="text-xs font-medium text-muted-foreground mb-1.5">{label}</div>}
          <Select
            value={item.status}
            onValueChange={(value) => onSelectChange(item, "complexity", value as Status)}
            disabled={isDisabled}
          >
            <SelectTrigger
              className={cn(
                "text-xs h-9 font-medium",
                colorComplexity(item.complexity),
                !permissionsEdit && "cursor-not-allowed opacity-70",
                className
              )}
              size="sm"
            >
              <SelectValue>
                {currentComplexity && (
                  <div className="flex items-center gap-1.5">
                    <currentComplexity.icon className={cn("h-3.5 w-3.5 text-white")} />
                    <span className="text-white">{currentComplexity.label}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="p-2">
              {complexityMap.map((s) => (
                <SelectItem
                  key={s.key}
                  value={s.key}
                  className={cn("cursor-pointer rounded-none mb-1", colorComplexity(s.key))}
                >
                  <div className="flex items-center gap-2">
                    <s.icon className={cn("h-4 w-4 text-white")} />
                    <span>{s.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
  }
});
