import * as ProgressPrimitive from "@radix-ui/react-progress";

export function Progress(props: ProgressPrimitive.ProgressProps) {
  return <ProgressPrimitive.Progress {...props} className="bg-card rounded-full h-2 border" />;
}

export function ProgressIndicator(props: ProgressPrimitive.ProgressIndicatorProps) {
  return (
    <ProgressPrimitive.Indicator
      {...props}
      className="bg-gradient-to-r from-primary to-orange-500 w-1/2 h-2 rounded-full"
    />
  );
}
