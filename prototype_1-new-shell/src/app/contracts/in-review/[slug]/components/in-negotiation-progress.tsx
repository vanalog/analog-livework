import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { ReadThreadResponse, ThreadStatus } from "@/types/api-types";

type ThreadProgressStatus = Exclude<
  ThreadStatus,
  "terminated" | "expired" | "cancelled"
>;

const NEGOTIATION_STEPS: Record<ThreadProgressStatus, string> = {
  drafting: "Drafting",
  draft_sent: "Draft Sent",
  in_redlining: "In Redlining",
  ready_to_sign: "Ready to Sign",
  executed: "Executed",
  active: "Active",
};

type InNegotiationProgressProps = Pick<ReadThreadResponse, "status">;

function InNegotiationProgress(props: InNegotiationProgressProps) {
  const steps = Object.entries(NEGOTIATION_STEPS);
  const currentIndex = steps.findIndex(([status]) => status === props.status);

  return (
    <Card className="p-6 pt-10">
      {/* mobile/vertical view */}
      <div className="flex flex-col gap-0 lg:hidden">
        {steps.map(([stepStatus, label], index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;

          return (
            <div key={stepStatus}>
              <div className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full text-xs flex items-center justify-center font-semibold shrink-0 ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isActive
                        ? "bg-blue-500 text-white"
                        : "bg-white-200 text-gray-400 border-2 border-gray-200"
                  }`}
                >
                  {isCompleted ? <Check size={16} /> : index + 1}
                </div>
                <span
                  className={`text-sm ${
                    isActive
                      ? "font-bold"
                      : isCompleted
                        ? "text-muted-foreground"
                        : "text-muted-foreground/80"
                  }`}
                >
                  {label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div className="flex">
                  <div className="w-8 flex justify-center">
                    <div
                      className={`w-0.5 h-8 ${
                        isCompleted ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* desktop/horizontal view */}
      <div className="hidden lg:flex items-start">
        {steps.map(([stepStatus, label], index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;

          return (
            <div
              key={stepStatus}
              className="flex items-start flex-1 last:flex-none"
            >
              <div className="flex flex-col items-center w-20">
                <div
                  className={`w-8 h-8 rounded-full text-xs flex items-center justify-center font-semibold ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isActive
                        ? "bg-blue-500 text-white"
                        : "bg-white-200 text-gray-400 border-2 border-gray-200"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={16} aria-label="completed" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`mt-2 text-xs text-center ${
                    isActive
                      ? "font-bold"
                      : isCompleted
                        ? "text-muted-foreground"
                        : "text-muted-foreground/80"
                  }`}
                >
                  {label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mt-4 ${
                    isCompleted ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export { InNegotiationProgress };
