import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { PrioritiesCount } from "../[id]/_data-access/get-priorities";
import { PrioritiesBar } from "../[id]/_components/priorities-bar";
import { StatusCount } from "../[id]/_data-access/get-status";
import { StatusBar } from "../[id]/_components/status-bar";
import { useMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const isMobile = useMobile(500);
  const isTablet = useMobile(1000);
  return (
    <header className="space-y-4 -mt-6 px-6">

      <nav className="flex justify-between">
        {!isMobile ? (
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
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"icon"}>
                <Menu />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {tabs.map(tab => (
                <DropdownMenuItem key={tab.key} className={cn(activeTab === tab.key ? "border border-primary" : "")}>
                  <button
                    onClick={() => onTabChange(tab.key)}
                    className="cursor-pointer"
                  >
                    {tab.label}
                  </button>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {!isTablet && (
          <div className="max-w-100 w-full grid grid-cols-2 gap-4 mr-15">
            <PrioritiesBar priorities={prioritiesData} />
            <StatusBar status={statusData} />
          </div>
        )}
      </nav>
      {isTablet && (
        <div className="w-full grid grid-cols-2 gap-4 mr-15">
          <PrioritiesBar priorities={prioritiesData} />
          <StatusBar status={statusData} />
        </div>
      )}
    </header>
  )
}