"use client"

import { cn } from "@/lib/utils"
import { Check, FileEdit, Cpu, FileSearch, Download } from "lucide-react"
import type { BuildContractStage } from "@/lib/build-contract-context"

const stages: { key: BuildContractStage; label: string; icon: typeof FileEdit }[] = [
  { key: "define", label: "Define", icon: FileEdit },
  { key: "generate", label: "Generate", icon: Cpu },
  { key: "review", label: "Review & Adjust", icon: FileSearch },
  { key: "export", label: "Export", icon: Download },
]

const stageOrder: BuildContractStage[] = ["define", "generate", "review", "export"]

export function BuildStageProgress({ currentStage }: { currentStage: BuildContractStage }) {
  const currentIndex = stageOrder.indexOf(currentStage)

  return (
    <div className="flex items-center gap-1 w-full max-w-xl mx-auto">
      {stages.map((stage, i) => {
        const isComplete = i < currentIndex
        const isCurrent = i === currentIndex
        const Icon = stage.icon

        return (
          <div key={stage.key} className="flex items-center flex-1 last:flex-initial">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
                  isComplete && "bg-foreground border-foreground",
                  isCurrent && "border-foreground bg-background",
                  !isComplete && !isCurrent && "border-muted-foreground/30 bg-background"
                )}
              >
                {isComplete ? (
                  <Check className="w-4 h-4 text-background" />
                ) : (
                  <Icon
                    className={cn(
                      "w-3.5 h-3.5",
                      isCurrent ? "text-foreground" : "text-muted-foreground/40"
                    )}
                  />
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap hidden sm:inline",
                  isComplete && "text-foreground",
                  isCurrent && "text-foreground",
                  !isComplete && !isCurrent && "text-muted-foreground/50"
                )}
              >
                {stage.label}
              </span>
            </div>
            {i < stages.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-3 min-w-[24px]",
                  i < currentIndex ? "bg-foreground" : "bg-muted-foreground/20"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
