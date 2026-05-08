import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type StepState = "pending" | "active" | "complete";

const STEPS = [
  { label: "Verify Identity" },
  { label: "Review & Sign" },
  { label: "Connect Bank" },
  { label: "Confirmation" },
];

function StepIcon({ index, state }: { index: number; state: StepState }) {
  const isComplete = state === "complete";
  const isActive = state === "active";

  return (
    <div
      className={cn(
        "flex items-center justify-center w-7 h-7 rounded-full border-2 text-xs font-semibold shrink-0",
        isComplete && "bg-green-500 border-green-500 text-white",
        isActive && "bg-foreground border-foreground text-background",
        !isComplete &&
          !isActive &&
          "border-muted-foreground/30 text-muted-foreground/30",
      )}
    >
      {isComplete ? <Check className="w-3.5 h-3.5" /> : index + 1}
    </div>
  );
}

interface ProgressHeaderProps {
  currentStep: number; // 1–4
}

function ProgressHeader({ currentStep }: ProgressHeaderProps) {
  function stateFor(index: number): StepState {
    if (index + 1 < currentStep) {
      return "complete";
    }

    if (index + 1 === currentStep) {
      return "active";
    }

    return "pending";
  }

  return (
    <div className="flex items-center w-full max-w-2xl mx-auto">
      {STEPS.map((step, index) => (
        <React.Fragment key={step.label}>
          <div className="flex items-center gap-2">
            <StepIcon index={index} state={stateFor(index)} />
            <span
              className={cn(
                "text-sm font-medium whitespace-nowrap hidden sm:inline",
                stateFor(index) !== "pending"
                  ? "text-foreground"
                  : "text-muted-foreground/40",
              )}
            >
              {step.label}
            </span>
          </div>
          {index < STEPS.length - 1 && <div className="min-w-6" />}
        </React.Fragment>
      ))}
    </div>
  );
}

export { ProgressHeader };
