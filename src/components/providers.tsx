"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache strategy
            staleTime: 1000 * 60 * 5, // 5 minutos (dados considerados "frescos")
            gcTime: 1000 * 60 * 10, // 10 minutos (mantém em cache)

            // Refetch strategy (mais conservadora)
            refetchOnWindowFocus: false, // Não refetch ao focar janela
            refetchOnReconnect: true, // Refetch ao reconectar internet
            refetchOnMount: true, // Refetch ao montar componente (se stale)
            // Error handling
            retry: 1, // Tenta apenas 1 vez em caso de erro
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
          },
          mutations: {
            retry: 0 // Não retenta mutations
          }
        }
      })
  );
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
