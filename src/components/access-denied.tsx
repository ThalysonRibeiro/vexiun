import { ShieldX } from "lucide-react";
import Link from "next/link";

export function AccessDenied() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="text-center space-y-4 p-8">
        <ShieldX className="mx-auto h-16 w-16 text-destructive" />
        <h1 className="text-3xl font-bold">Acesso Negado</h1>
        <p className="text-muted-foreground max-w-md">
          Você não tem permissão para acessar esta página.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
}
