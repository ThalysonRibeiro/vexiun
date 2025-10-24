import { FileX } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "Nenhum item encontrado",
  description = "Comece adicionando um novo item.",
  icon
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-2 text-center">
      <div className="mb-4 text-muted-foreground">
        {icon || <FileX className="w-12 h-12" />}
      </div>
      <p className="text-lg font-medium text-foreground">{title}</p>
      {description && (
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
          {description}
        </p>
      )}
    </div>
  );
}