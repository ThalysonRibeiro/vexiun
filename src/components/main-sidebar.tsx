"use client"

import { cn } from "@/lib/utils";
import { useSidebar } from "./ui/sidebar"

export function MainSaidebar({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar();

  return (
    <main className={cn("relative w-full px-2 pt-4",
      open && "md:w-[calc(100dvw-16.5rem)]"
    )}>
      {children}
    </main>
  )
}