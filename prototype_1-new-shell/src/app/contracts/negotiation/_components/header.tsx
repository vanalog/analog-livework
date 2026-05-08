import { cn } from "@/lib/utils";
import {
  Cpu,
  FilePen,
  FileSearch,
  Download,
  Check,
  type LucideIcon,
} from "lucide-react";

type StepState = "pending" | "active" | "complete";

type ProgressIconProps = {
  icon: LucideIcon;
  label: string;
  state: StepState;
};

function ProgressIcon({ icon: Icon, label, state }: ProgressIconProps) {
  const active = state === "active";
  const complete = state === "complete";

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full border-2 bg-background",
          active || complete
            ? "border-foreground"
            : "border-muted-foreground/30",
        )}
      >
        {complete ? (
          <Check className="w-4 h-4 text-foreground" />
        ) : (
          <Icon
            className={cn(
              "w-4 h-4",
              active ? "text-foreground" : "text-muted-foreground/30",
            )}
          />
        )}
      </div>
      <div
        className={cn(
          "text-xs font-medium whitespace-nowrap hidden sm:inline",
          active || complete ? "text-foreground" : "text-muted-foreground/30",
        )}
      >
        {label}
      </div>
    </div>
  );
}

function Separator() {
  return (
    <div className="flex-1 h-px mx-3 min-w-[24px] bg-muted-foreground/20" />
  );
}

interface HeaderProps {
  step: number;
}

function Header({ step }: HeaderProps) {
  function stateFor(index: number): StepState {
    if (index < step) {
      return "complete";
    }

    if (index === step) {
      return "active";
    }

    return "pending";
  }

  return (
    <div className="flex w-full items-center max-w-xl mx-auto">
      <ProgressIcon icon={FilePen} label="Define" state={stateFor(0)} />
      <Separator />
      <ProgressIcon icon={Cpu} label="Generate" state={stateFor(1)} />
      <Separator />
      <ProgressIcon
        icon={FileSearch}
        label="Review & Adjust"
        state={stateFor(2)}
      />
      <Separator />
      <ProgressIcon icon={Download} label="Export" state={stateFor(3)} />
    </div>
  );
}

export { Header };
