"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Componente interno reutilizável para testes
export const ErrorContent = ({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => (
  <div className="flex min-h-screen items-center justify-center">
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Oops, algo deu errado!</CardTitle>
        <CardDescription>
          Lamentamos, mas parece que ocorreu um erro inesperado. Por favor, tente novamente ou entre
          em contato com o suporte se o problema persistir.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
          <p className="font-medium">Detalhes do erro:</p>
          <pre className="mt-2 whitespace-pre-wrap font-mono text-xs">{error.message}</pre>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => reset()} className="w-full">
          Tente Novamente
        </Button>
      </CardFooter>
    </Card>
  </div>
);

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ErrorContent error={error} reset={reset} />
      </body>
    </html>
  );
}
