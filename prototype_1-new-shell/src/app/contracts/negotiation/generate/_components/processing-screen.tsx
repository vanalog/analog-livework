import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { ProcessingStep } from "./processing-step";
import type { ProcessingStepProps } from "./processing-step";

const TICK_MS = 80;

interface ProcessingScreenProps {
  labels: string[];
  onComplete: () => void;
}

function ProcessingScreen(props: ProcessingScreenProps) {
  const [steps, setSteps] = useState<ProcessingStepProps[]>(
    props.labels.map((label, i) => ({
      label,
      status: i === 0 ? "active" : "pending",
      progress: i === 0 ? 0 : undefined,
    })),
  );

  const activeStep = steps.find((step) => step.status === "active");
  const allComplete = steps.every((step) => step.status === "complete");
  const onComplete = props.onComplete;

  useEffect(() => {
    if (allComplete) {
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      setSteps((prev) => {
        const activeIndex = prev.findIndex((s) => s.status === "active");
        if (activeIndex === -1) return prev;

        const current = prev[activeIndex];
        if (!current) return prev;

        const currentProgress = current.progress ?? 0;

        if (currentProgress >= 100) {
          const next = [...prev];
          next[activeIndex] = { label: current.label, status: "complete" };
          const nextStep = next[activeIndex + 1];
          if (nextStep) {
            next[activeIndex + 1] = {
              label: nextStep.label,
              status: "active",
              progress: 0,
            };
          }
          return next;
        }

        const increment = Math.random() * 8 + 14;
        const next = [...prev];
        next[activeIndex] = {
          label: current.label,
          status: "active",
          progress: Math.min(Math.round(currentProgress + increment), 100),
        };
        return next;
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [allComplete, onComplete]);

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 py-8 px-4">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-16 h-16 animate-spin text-foreground" />
        <p className="text-sm font-medium text-foreground">
          {allComplete
            ? "Schedule Generated"
            : (activeStep?.label ?? "Processing...")}
        </p>
      </div>
      <div className="space-y-3">
        {steps.map((step) => (
          <ProcessingStep
            key={step.label}
            label={step.label}
            status={step.status}
            progress={step.progress}
          />
        ))}
      </div>
    </div>
  );
}

export { ProcessingScreen };
