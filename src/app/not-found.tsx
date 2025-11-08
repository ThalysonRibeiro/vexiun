"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative overflow-hidden flex min-h-[100dvh] flex-col items-center justify-center px-4 py-12 text-center">
      <div className="max-w-md">
        <h1 className="text-9xl font-bold tracking-tighter text-foreground">404</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Oops, a página que você está procurando não foi encontrada.
        </p>
        <div className="mt-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Voltar para o Início
          </Link>
        </div>
      </div>
    </div>
  );
}
