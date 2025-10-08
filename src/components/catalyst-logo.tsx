
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
        <div className="absolute inset-0 bg-gradient-to-bl from-primary from-70% to-orange-500 blur-xl  opacity-50 animate-pulse" />

        <div className="relative w-7.5 h-7.5">
          <div className="w-4 h-4 bg-primary absolute top-0 left-0"
            style={{
              width: '17px',
              height: '16px',
              borderRadius: '2.5px',
            }}
          />
          <div className="bg-orange-500 absolute top-0 right-0"
            style={{
              width: '9px',
              height: '9px',
              borderRadius: '100%',
            }}
          />

          <div className="bg-primary rounded absolute bottom-0 left-0"
            style={{
              width: '11px',
              height: '11px',
              borderRadius: '2.5px',
            }}
          />
          <div className="bg-orange-500 absolute bottom-0 right-0" style={{
            width: '14px',
            height: '18px',
            borderRadius: '2.5px',
            clipPath: 'polygon(45% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 35%)'
          }}
          />
        </div>
      </div>

      {showText && (
        <span className={`font-bold ${sizes[size].text}`}>
          Catalyst
        </span>
      )}
    </div>
  );
}