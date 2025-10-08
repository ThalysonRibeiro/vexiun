import { colorPriority, priorityKeys, priorityMap } from "@/utils/colorStatus";
import { PrioritiesCount } from "../_data-access/get-priorities";

interface PrioritiesBarProps {
  priorities: PrioritiesCount[];
  label?: boolean;
}

export function PrioritiesBar({ priorities, label = true }: PrioritiesBarProps) {
  const total = priorities.reduce((acc, priority) => acc + priority.count, 0);

  return (
    <div className="relative group">
      {label && <h3 className="font-semibold text-sm">Prioridade geral</h3>}
      <div data-testid="progress-bar-container" className=" flex w-full h-4 rounded-md overflow-hidden">
        {priorities.map((priority) => (
          <div
            key={priority.priority}
            className={`h-full`}
            style={{
              width: `${total > 0 ? (priority.count / total) * 100 : 0}%`,
              backgroundColor: getPriorityColor(priority.priority),
            }}
          />
        ))}
      </div>
    </div>
  );
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "CRITICAL":
      return "oklch(63.7% 0.237 25.331)";
    case "HIGH":
      return "oklch(70.5% 0.213 47.604)";
    case "MEDIUM":
      return "oklch(79.5% 0.184 86.047)";
    case "LOW":
      return "oklch(72.3% 0.219 149.579)";
    default:
      return "oklch(70.5% 0.015 286.067)";
  }
}
