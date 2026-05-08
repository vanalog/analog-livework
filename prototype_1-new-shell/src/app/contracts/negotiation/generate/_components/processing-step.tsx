import { cn } from "@/lib/utils";

type StepStatus = "complete" | "active" | "pending";

interface ProcessingStepProps {
  label: string;
  status: StepStatus;
  progress?: number;
}

function ProcessingStep(props: ProcessingStepProps) {
  const isComplete = props.status === "complete";
  const isActive = props.status === "active";

  return (
    <div
      className={cn(
        "relative flex items-center justify-between px-4 py-3 rounded-lg border overflow-hidden transition-opacity duration-300",
        !isComplete && !isActive && "opacity-40",
        isComplete
          ? "bg-green-50 border-green-200"
          : "bg-background border-border",
      )}
    >
      <span
        className={cn(
          "text-sm font-medium",
          isComplete ? "text-green-700" : "text-foreground",
        )}
      >
        {props.label}
      </span>
      <span
        className={cn(
          "text-sm font-medium shrink-0 ml-4",
          isComplete && "text-green-700",
          isActive && "text-foreground",
          !isComplete && !isActive && "text-muted-foreground",
        )}
      >
        {isComplete ? "Done" : isActive ? `${props.progress ?? 0}%` : "Waiting"}
      </span>
      {isActive && (
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-foreground transition-all duration-300"
          style={{ width: `${props.progress ?? 0}%` }}
        />
      )}
    </div>
  );
}

export { ProcessingStep, type ProcessingStepProps };
