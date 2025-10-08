import { Item, Status } from "@/generated/prisma";
import { ItemWhitCreatedAssignedUser } from "../kanban/kanban-grid";

interface GroupProgressBarProps {
  items: ItemWhitCreatedAssignedUser[];
}

export function GroupProgressBar({ items }: GroupProgressBarProps) {
  const total = items.length;
  if (total === 0) {
    return null;
  }

  const statusCounts = Object.fromEntries(
    Object.entries(
      items.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {} as Record<Status, number>)
    ).sort(([a], [b]) => a.localeCompare(b))
  );

  return (
    <div data-testid="progress-bar-container" className="flex w-full max-w-75 h-2 rounded-md overflow-hidden">
      {Object.entries(statusCounts).map(([status, count]) => (
        <div
          key={status}
          className={`h-full`}
          style={{
            width: `${(count / total) * 100}%`,
            backgroundColor: getStatusColor(status as Status),
          }}
        />
      ))}
    </div>
  );
}

function getStatusColor(status: Status) {
  switch (status) {
    case "DONE":
      return "oklch(72.3% 0.219 149.579)";
    case "IN_PROGRESS":
      return "oklch(62.3% 0.214 259.815)";
    case "STOPPED":
      return "oklch(63.7% 0.237 25.331)";
    default:
      return "oklch(70.5% 0.015 286.067)";
  }
}
