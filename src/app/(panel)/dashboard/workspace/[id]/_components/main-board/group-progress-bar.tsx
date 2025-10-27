import { Priority, Status } from "@/generated/prisma";

interface GroupProgressBarProps {
  items: {
    id: string;
    status: Status;
    priority: Priority
  }[];
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
export function GroupPriorityBar({ items }: GroupProgressBarProps) {
  const total = items.length;
  if (total === 0) {
    return null;
  }

  const priorityCounts = Object.fromEntries(
    Object.entries(
      items.reduce((acc, item) => {
        acc[item.priority] = (acc[item.priority] || 0) + 1;
        return acc;
      }, {} as Record<Priority, number>)
    ).sort(([a], [b]) => a.localeCompare(b))
  );

  return (
    <div data-testid="progress-bar-container" className="flex w-full max-w-75 h-2 rounded-md overflow-hidden">
      {Object.entries(priorityCounts).map(([priority, count]) => (
        <div
          key={priority}
          className={`h-full`}
          style={{
            width: `${(count / total) * 100}%`,
            backgroundColor: getPriorityColor(priority as Priority),
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

function getPriorityColor(priority: string) {
  switch (priority) {
    case "CRITICAL":
      return "oklch(37% 0.013 285.805)";
    case "HIGH":
      return "oklch(50.5% 0.213 27.518)";
    case "MEDIUM":
      return "oklch(63.7% 0.237 25.331)";
    case "LOW":
      return "oklch(70.4% 0.191 22.216)";
    default:
      return "oklch(80.8% 0.114 19.571)";
  }
}
