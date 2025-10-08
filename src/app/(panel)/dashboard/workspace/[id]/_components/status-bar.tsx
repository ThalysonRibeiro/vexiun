import { colorStatus, statusKeys, statusMap } from "@/utils/colorStatus";
import { StatusCount } from "../_data-access/get-status";
import { Status } from "@/generated/prisma";

interface StatusBarProps {
  status: StatusCount[];
}

export function StatusBar({ status }: StatusBarProps) {
  const total = status.reduce((acc, s) => acc + s.count, 0);

  return (
    <div className="relative group">
      <h3 className="font-semibold text-sm">Status geral</h3>
      <div data-testid="progress-bar-container" className="flex w-full h-4 rounded-md overflow-hidden">
        {status.map((s) => (
          <div
            key={s.status}
            className={`h-full`}
            style={{
              width: `${total > 0 ? (s.count / total) * 100 : 0}%`,
              backgroundColor: getStatusColor(s.status as Status),
            }}
          />
        ))}
      </div>
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
