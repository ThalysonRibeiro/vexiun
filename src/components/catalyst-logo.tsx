import { Zap } from "lucide-react";

interface CatalystLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function CatalystLogo({ size = "md", showText = true }: CatalystLogoProps) {
  const sizes = {
    sm: { icon: 20, text: "text-lg" },
    md: { icon: 32, text: "text-2xl" },
    lg: { icon: 48, text: "text-4xl" },
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-bl from-primary from-70% to-orange-500 blur-xl  opacity-50 animate-pulse" />

        {/* Icon */}
        <Zap
          size={sizes[size].icon}
          className="relative fill-catalyst-orange text-catalyst-red drop-shadow-lg"
          absoluteStrokeWidth={true}
        />
      </div>

      {showText && (
        <span className={`font-bold bg-gradient-to-bl from-primary from-70% to-orange-500 bg-clip-text text-transparent ${sizes[size].text}`}>
          CATALYST
        </span>
      )}
    </div>
  );
}