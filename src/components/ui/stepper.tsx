"use client";

import {
  Children,
  HTMLAttributes,
  ReactNode,
  useState,
  cloneElement,
  isValidElement,
} from "react";
import { Card, CardContent, CardHeader } from "./card";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Check } from "lucide-react";

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  backButtonText?: string;
  nextButtonText?: string;
}

export function Stepper({
  children,
  initialStep = 1,
  onStepChange,
  onFinalStepCompleted,
  backButtonText = "Voltar",
  nextButtonText = "Próximo",
}: StepperProps) {
  const stepsArray = Children.toArray(children)
  const totalSteps = stepsArray.length

  const [currentStep, setCurrentStep] = useState(initialStep)
  const [canProceed, setCanProceed] = useState(false)

  const handleNext = () => {
    if (!canProceed) return

    if (currentStep < totalSteps) {
      const next = currentStep + 1
      setCurrentStep(next)
      onStepChange?.(next)
    } else {
      onFinalStepCompleted?.()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      const prev = currentStep - 1
      setCurrentStep(prev)
      onStepChange?.(prev)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {stepsArray.map((_, index) => {
            const step = index + 1;
            const isActive = currentStep === step;
            const isCompleted = currentStep > step;

            return (
              <div key={step} className="flex items-center gap-2 w-full">
                <div
                  className={cn(
                    "flex items-center justify-center min-w-8 min-h-8 rounded-full transition-colors",
                    isCompleted
                      ? "bg-primary text-white"
                      : isActive
                        ? "bg-primary text-white"
                        : "bg-accent text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step}
                </div>

                {step < totalSteps && (
                  <div className="relative w-full h-2 bg-accent rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-500",
                        currentStep > step &&
                        "bg-gradient-to-r from-primary to-orange-500"
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardHeader>

      <CardContent>
        {stepsArray.map((child, index) => {
          if (index + 1 !== currentStep) return null

          if (isValidElement(child)) {
            return cloneElement(child as React.ReactElement<StepProps>, {
              next: handleNext,
              back: handleBack,
              isFirst: currentStep === 1,
              isLast: currentStep === totalSteps,
              canProceed: (valid: boolean) => setCanProceed(valid),
            })
          }

          return child
        })}

        <div className="flex items-center mt-4">
          {currentStep > 1 && (
            <Button onClick={handleBack} variant="outline" className="cursor-pointer">
              {backButtonText}
            </Button>
          )}
          <Button className="ml-auto cursor-pointer" onClick={handleNext} disabled={!canProceed}>
            {currentStep < totalSteps ? nextButtonText : "Concluir"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface StepChildProps {
  next: () => void
  back: () => void
  isFirst: boolean
  isLast: boolean
  canProceed?: (valid: boolean) => void
}

interface StepProps {
  children: (props: StepChildProps) => ReactNode
  next?: () => void
  back?: () => void
  isFirst?: boolean
  isLast?: boolean
  canProceed?: (valid: boolean) => void
}

export function Step({
  children,
  next,
  back,
  isFirst = false,
  isLast = false,
  canProceed,
}: StepProps) {
  return <>{children({ next: next!, back: back!, isFirst, isLast, canProceed })}</>
}
