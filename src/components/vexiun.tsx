"use client";

import { cn } from "@/lib/utils";
import { AiOutlineRobot } from "react-icons/ai";

interface VexiunProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  robot?: boolean;
}

export function Vexiun({ size = "md", showText = true, className, robot = true }: VexiunProps) {
  const sizes = {
    sm: { icon: "w-8 h-8", text: "text-lg" },
    md: { icon: "w-12 h-12", text: "text-3xl" },
    lg: { icon: "w-28 h-28", text: "text-5xl" },
    xl: { icon: "w-40 h-40", text: "text-6xl" }
  };

  return (
    <div className={cn("flex items-center", className)}>
      {robot && <Robot className={sizes[size].icon} />}
      {showText && <span className={`font-bold -ml-2 uppercase ${sizes[size].text}`}>Vexiun</span>}
    </div>
  );
}

export function Robot({ className }: { className?: string }) {
  return (
    <svg
      className={className} // ← Adiciona as classes aqui
      viewBox="0 0 200 280"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* <!-- Cabeça retangular (monitor) --> */}
      <rect
        x="50"
        y="20"
        width="100"
        height="75"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        rx="6"
      />

      {/* <!-- Olhos ovais verticais --> */}
      <rect
        x="70"
        y="40"
        width="22"
        height="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        rx="11"
      />
      <rect
        x="108"
        y="40"
        width="22"
        height="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        rx="11"
      />

      {/* <!-- Pescoço --> */}
      <rect
        x="88"
        y="95"
        width="24"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
      />

      {/* <!-- Peito (cápsula horizontal) --> */}
      <rect
        x="70"
        y="113"
        width="60"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        rx="12"
      />

      {/* <!-- Linha divisória vertical no peito --> */}
      <line x1="100" y1="113" x2="100" y2="137" stroke="currentColor" strokeWidth="7" />

      {/* <!-- Braço esquerdo --> */}
      <path
        d="M 70 125 Q 48 140, 48 162"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* <!-- Mão esquerda --> */}
      <circle cx="48" cy="175" r="13" fill="none" stroke="currentColor" strokeWidth="7" />

      {/* <!-- Braço direito --> */}
      <path
        d="M 130 125 Q 152 140, 152 162"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* <!-- Mão direita --> */}
      <circle cx="152" cy="175" r="13" fill="none" stroke="currentColor" strokeWidth="7" />

      {/* <!-- Quadril/barriga trapezoidal --> */}
      <path
        d="M 75 137 L 75 175 L 125 175 L 125 137"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinejoin="miter"
      />

      {/* <!-- Perna esquerda --> */}
      <line
        x1="85"
        y1="175"
        x2="75"
        y2="220"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* <!-- Perna direita --> */}
      <line
        x1="115"
        y1="175"
        x2="125"
        y2="220"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* <!-- Pé esquerdo --> */}
      <path
        d="M 75 220 L 75 235 L 58 235 Q 50 235, 50 243 Q 50 251, 58 251 L 75 251 L 75 220"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinejoin="round"
      />

      {/* <!-- Pé direito --> */}
      <path
        d="M 125 220 L 125 235 L 142 235 Q 150 235, 150 243 Q 150 251, 142 251 L 125 251 L 125 220"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinejoin="round"
      />
    </svg>
  );
}
