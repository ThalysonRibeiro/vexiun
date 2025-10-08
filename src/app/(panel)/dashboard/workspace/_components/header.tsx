import { Button } from "@/components/ui/button";
import { PrioritiesCount } from "../[id]/_data-access/get-priorities";
import { PrioritiesBar } from "../[id]/_components/priorities-bar";
import { StatusCount } from "../[id]/_data-access/get-status";
import { StatusBar } from "../[id]/_components/status-bar";

// Header refatorado para ser dinâmico
interface Tab {
  key: string;
  label: string;
  component: React.ReactNode;
}

interface HeaderProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  prioritiesData: PrioritiesCount[];
  statusData: StatusCount[];
}

export function Header({ tabs, activeTab, onTabChange, prioritiesData, statusData }: HeaderProps) {
  return (
    <header className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <PrioritiesBar priorities={prioritiesData} />
        <StatusBar status={statusData} />
      </div>
      <nav className="flex justify-between">
        <ul className="inline-flex gap-4">
          {tabs.map(tab => (
            <li key={tab.key}>
              <Button
                onClick={() => onTabChange(tab.key)}
                variant={activeTab === tab.key ? "default" : "outline"}
                className="cursor-pointer"
              >
                {tab.label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}