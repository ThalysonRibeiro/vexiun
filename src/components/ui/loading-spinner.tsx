import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-4",
    lg: "w-16 h-16 border-4"
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div
        className={cn(
          "border-t-accent rounded-full animate-spin border-primary",
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
}