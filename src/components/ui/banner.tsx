"use client";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { LucideIcon, X } from "lucide-react";
import { JSX, useState } from "react";
import { Button } from "./button";

interface BannerProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  className?: string;
  variant?: "default" | "alert" | "success" | "warning" | "destructive";
  defaultOpen?: boolean; // Permite controlar se inicia aberto/fechado
}

const bannerVariants = cva("flex items-center gap-4 border py-2 px-4 rounded-lg", {
  variants: {
    variant: {
      default: "bg-transparent border-border",
      alert: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      success: "bg-green-500/10 text-green-500 border-green-500/20",
      warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      destructive: "bg-destructive/10 text-destructive border-destructive/20"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export function Banner({
  title,
  description,
  icon: Icon,
  variant = "default",
  className,
  defaultOpen = true,
  ...props
}: BannerProps): JSX.Element | null {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={cn(bannerVariants({ variant }), className)} {...props}>
      {Icon && <Icon className="w-8 h-8 shrink-0" />}
      <div className="flex-1">
        <h4 className="font-semibold text-lg">{title}</h4>
        <p className="text-sm opacity-90">{description}</p>
      </div>

      <Button
        onClick={() => setIsOpen(false)}
        variant="ghost"
        size="icon"
        className="shrink-0 cursor-pointer ml-auto hover:bg-background/50"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
