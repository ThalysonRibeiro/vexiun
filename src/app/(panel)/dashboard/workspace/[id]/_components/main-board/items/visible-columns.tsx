"use client";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";

interface VisibleColumnsProps {
  COLUMNS: Column[];
  visibleColumns: Set<string>;
  isVisible: (key: string) => boolean;
  toggleColumn: (key: string) => void;
}

type Column = {
  key: string;
  label: string;
  defaultVisible: boolean;
  fixed?: boolean;
};

export function VisibleColumns(props: VisibleColumnsProps) {
  const { COLUMNS, visibleColumns, isVisible, toggleColumn } = props;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Settings2 className="w-4 h-4 mr-2" />
          Colunas ({visibleColumns.size}/{COLUMNS.length})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {COLUMNS.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.key}
            checked={isVisible(column.key)}
            onCheckedChange={() => toggleColumn(column.key)}
            disabled={column.defaultVisible}
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
