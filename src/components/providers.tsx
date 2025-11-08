"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache mais agressivo para apps colaborativos
            staleTime: 1000 * 60 * 2, // 2 minutos
            gcTime: 1000 * 60 * 10, // 10 minutos

            // Refetch para manter sincronizado
            refetchOnWindowFocus: true, // ✅ Importante para colaboração
            refetchOnReconnect: true,
            refetchOnMount: true,

            // Error handling
            retry: 1,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
          },
          mutations: {
            retry: 0
          }
        }
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
