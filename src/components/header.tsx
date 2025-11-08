"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import logo_img from "@/assets/logo-goallist.png";
import { useCallback, useEffect, useState } from "react";
import { useMobile } from "@/hooks/use-mobile";
import { scrollToSection } from "@/utils/scrollTosection";
import { Button } from "./ui/button";

const SCROLL_THRESHOLD = 500;

const NAVIGATION_ITEMS = [
  { label: "Início", id: "hero" },
  { label: "Depoimentos", id: "testimonials" }
] as const;

interface NavProps {
  className?: string;
  activeSection?: string;
}

export function Header() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const isMobile = useMobile();

  const throttle = useCallback(
    <T extends (...args: unknown[]) => void>(func: T, limit: number): T => {
      let inThrottle: boolean;
      return ((...args: Parameters<T>): void => {
        if (!inThrottle) {
          func(...args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      }) as T;
    },
    []
  );

  useEffect(() => {
    const thrittledHandleScroll = throttle(() => {
      const scrolly = window.scrollY;
      setIsVisible(scrolly > SCROLL_THRESHOLD);

      const sections = NAVIGATION_ITEMS.map((item) => item.id);
      for (const setionId of sections) {
        const elemment = document.getElementById(setionId);
        if (elemment) {
          const rect = elemment.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(setionId);
            break;
          }
        }
      }
    }, 16);
    window.addEventListener("scroll", thrittledHandleScroll, { passive: true });
    return () => window.removeEventListener("scroll", thrittledHandleScroll);
  }, [throttle]);

  if (!isVisible) {
    return null;
  }

  return isMobile ? (
    <MobileNavigation activeSection={activeSection} />
  ) : (
    <FloatingNavigation activeSection={activeSection} />
  );
}

function Navigation({ className, activeSection }: NavProps) {
  const handleNavClick = useCallback((sectionId: string) => {
    scrollToSection(sectionId);
  }, []);
  return (
    <nav
      className={cn("flex items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8", className)}
      role="navigation"
      aria-label="Navegação principal"
    >
      {NAVIGATION_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => handleNavClick(item.id)}
          className={cn(
            "hover:text-primary transition-all duration-200 cursor-pointer",
            "text-xs sm:text-sm md:text-base lg:text-lg font-light uppercase",
            "focus:outline-none focus:ring-2 focus:ring-primary rounded-sm px-1",
            activeSection === item.id && "text-primary font-semibold"
          )}
          aria-current={activeSection === item.id ? "page" : undefined}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

function FloatingNavigation({ activeSection }: { activeSection?: string }) {
  return (
    <div
      className={cn(
        "fixed top-4 left-1/2 transform -translate-x-1/2 z-50",
        "bg-background/80 backdrop-blur-md border border-border/50",
        "px-4 py-2 rounded-full shadow-lg",
        "animate-in fade-in-0 slide-in-from-top-2 duration-200"
      )}
      role="banner"
    >
      <Navigation activeSection={activeSection} />
    </div>
  );
}

function MobileNavigation({ activeSection }: { activeSection?: string }) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-background/90 backdrop-blur-md border-t border-border/50",
        "px-4 py-3 shadow-lg",
        "animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
      )}
      role="banner"
    >
      <Navigation
        className="justify-between items-center max-w-screen-sm mx-auto"
        activeSection={activeSection}
      />
    </div>
  );
}

export function HeaderOld() {
  return (
    <header className="border-b pr-14 hidden md:block">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 relative">
            <Image src={logo_img} alt="imagem do logo" fill className="object-contain" />
          </div>
          <h1 className="text-xl font-bold uppercase bg-radial from-violet-500 via-cyan-400 to-violet-700 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">
            dev-tasks
          </h1>
        </div>
        <nav className="flex items-center">
          {NAVIGATION_ITEMS.map((item, index) => (
            <button
              key={item.id}
              aria-label={`Navegar para a seção ${item.label}`}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                "px-4 py-6 hover:text-primary transition-colors duration-300 cursor-pointer",
                "text-xs sm:text-sm md:text-base lg:text-lg font-light uppercase",
                "border-r",
                index === 0 && "border-x"
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
