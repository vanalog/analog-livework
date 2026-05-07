"use client"

import { useState, useEffect } from "react"
import { FileText } from "lucide-react"
import { useContractWorkflow } from "@/lib/contract-workflow-context"
import { StageProgress } from "./stage-progress"

interface ProcessingStep {
  id: number
  label: string
  status: "pending" | "processing" | "complete"
  progress: number
}

const initialSteps: ProcessingStep[] = [
  { id: 1, label: "Extracting Parties", status: "pending", progress: 0 },
  { id: 2, label: "Extracting Payment Terms", status: "pending", progress: 0 },
  { id: 3, label: "Extracting Obligations", status: "pending", progress: 0 },
  { id: 4, label: "Reviewing Cap Allocation", status: "pending", progress: 0 },
  { id: 5, label: "Extracting Dates", status: "pending", progress: 0 },
  { id: 6, label: "Preparing for View", status: "pending", progress: 0 },
]

export function ProcessingStage() {
  const { state, setStage } = useContractWorkflow()
  const [steps, setSteps] = useState<ProcessingStep[]>(initialSteps)
  const [statusMessage, setStatusMessage] = useState("Analyzing contract...")

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      // Simulate a brief initial delay
      await new Promise(r => setTimeout(r, 600))

      for (let i = 0; i < initialSteps.length; i++) {
        if (cancelled) return

        // Set current step to processing
        setSteps(prev => prev.map((s, idx) =>
          idx === i ? { ...s, status: "processing", progress: 0 } : idx < i ? { ...s, status: "complete", progress: 100 } : s
        ))
        setStatusMessage(initialSteps[i].label + "...")

        // Animate progress from 0 to 100
        const totalDuration = 700 + Math.random() * 800
        const steps_count = 20
        const stepDuration = totalDuration / steps_count
        
        for (let p = 1; p <= steps_count; p++) {
          if (cancelled) return
          await new Promise(r => setTimeout(r, stepDuration))
          const progress = Math.min(Math.round((p / steps_count) * 100), 100)
          setSteps(prev => prev.map((s, idx) =>
            idx === i ? { ...s, progress } : s
          ))
        }
        
        if (cancelled) return

        // Mark step complete
        setSteps(prev => prev.map((s, idx) =>
          idx === i ? { ...s, status: "complete", progress: 100 } : s
        ))
      }

      setStatusMessage("Analysis complete")
      await new Promise(r => setTimeout(r, 500))
      if (!cancelled) setStage("review")
    }

    run()
    return () => { cancelled = true }
  }, [setStage])

  const getProgressText = (step: ProcessingStep) => {
    switch (step.status) {
      case "complete":
        return <span className="text-emerald-600 dark:text-emerald-400 font-medium">Done</span>
      case "processing":
        return <span className="text-foreground font-medium">{step.progress}%</span>
      default:
        return <span className="text-muted-foreground/50">Waiting</span>
    }
  }

  const getCardClass = (step: ProcessingStep) => {
    switch (step.status) {
      case "complete":
        return "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20"
      case "processing":
        return "border-foreground/20 bg-muted/30"
      default:
        return "border-muted bg-muted/10"
    }
  }

  const getLabelClass = (step: ProcessingStep) => {
    switch (step.status) {
      case "complete":
        return "text-emerald-700 dark:text-emerald-300"
      case "processing":
        return "text-foreground font-medium"
      default:
        return "text-muted-foreground/60"
    }
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Stage progress at top */}
      <div className="border-b px-6 py-4">
        <StageProgress currentStage="processing" />
      </div>

      {/* Processing content - aligned to top with fixed padding */}
      <div className="flex-1 flex justify-center pt-16 pb-8">
        <div className="w-full max-w-lg space-y-6">
          {/* Contract info */}
          {state.uploadData && (
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <span className="text-sm font-medium text-foreground whitespace-nowrap">{state.uploadData.fileName}</span>
              </div>
              <p className="text-sm text-muted-foreground">{state.uploadData.athleteName}</p>
            </div>
          )}

          {/* Animated indicator */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-2 border-muted-foreground/20" />
              <div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
              </div>
            </div>
          </div>

          {/* Status message */}
          <p className="text-center text-sm font-medium text-foreground">{statusMessage}</p>

          {/* Sub-steps as cards */}
          <div className="space-y-2">
            {steps.map(step => (
              <div 
                key={step.id} 
                className={`relative overflow-hidden rounded-lg border px-4 py-3 transition-all duration-300 ${getCardClass(step)}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${getLabelClass(step)}`}>
                    {step.label}
                  </span>
                  {getProgressText(step)}
                </div>
                {/* Progress bar at bottom */}
                {step.status === "processing" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted">
                    <div 
                      className="h-full bg-foreground transition-all duration-100 ease-out"
                      style={{ width: `${step.progress}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
