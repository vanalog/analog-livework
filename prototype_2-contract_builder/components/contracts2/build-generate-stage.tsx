"use client"

import { useState, useEffect } from "react"
import { useBuildContract } from "@/lib/build-contract-context"
import { BuildStageProgress } from "./build-stage-progress"

interface GenerateStep {
  id: number
  label: string
  status: "pending" | "processing" | "complete"
  progress: number
}

export function BuildGenerateStage() {
  const { state, setStage } = useBuildContract()
  const isRevenueShare = state.formData.contractType === "revenue-share"

  const initialSteps: GenerateStep[] = [
    { id: 1, label: "Mapping contract term to fiscal periods...", status: "pending", progress: 0 },
    { id: 2, label: "Calculating payment schedule...", status: "pending", progress: 0 },
    { id: 3, label: isRevenueShare ? "Assigning cap periods..." : "Building obligation index...", status: "pending", progress: 0 },
    { id: 4, label: "Ready to review.", status: "pending", progress: 0 },
  ]

  const [steps, setSteps] = useState<GenerateStep[]>(initialSteps)
  const [statusMessage, setStatusMessage] = useState("Preparing schedule...")

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      await new Promise(r => setTimeout(r, 400))

      for (let i = 0; i < initialSteps.length; i++) {
        if (cancelled) return

        setSteps(prev => prev.map((s, idx) =>
          idx === i ? { ...s, status: "processing", progress: 0 } : idx < i ? { ...s, status: "complete", progress: 100 } : s
        ))
        setStatusMessage(initialSteps[i].label)

        const totalDuration = 400 + Math.random() * 400
        const stepCount = 15
        const stepDuration = totalDuration / stepCount

        for (let p = 1; p <= stepCount; p++) {
          if (cancelled) return
          await new Promise(r => setTimeout(r, stepDuration))
          const progress = Math.min(Math.round((p / stepCount) * 100), 100)
          setSteps(prev => prev.map((s, idx) =>
            idx === i ? { ...s, progress } : s
          ))
        }

        if (cancelled) return

        setSteps(prev => prev.map((s, idx) =>
          idx === i ? { ...s, status: "complete", progress: 100 } : s
        ))
      }

      setStatusMessage("Schedule generated")
      await new Promise(r => setTimeout(r, 400))
      if (!cancelled) setStage("review")
    }

    run()
    return () => { cancelled = true }
  }, [setStage, initialSteps.length, isRevenueShare])

  const getCardClass = (step: GenerateStep) => {
    switch (step.status) {
      case "complete":
        return "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20"
      case "processing":
        return "border-foreground/20 bg-muted/30"
      default:
        return "border-muted bg-muted/10"
    }
  }

  const getLabelClass = (step: GenerateStep) => {
    switch (step.status) {
      case "complete":
        return "text-emerald-700 dark:text-emerald-300"
      case "processing":
        return "text-foreground font-medium"
      default:
        return "text-muted-foreground/60"
    }
  }

  const getProgressText = (step: GenerateStep) => {
    switch (step.status) {
      case "complete":
        return <span className="text-emerald-600 dark:text-emerald-400 font-medium">Done</span>
      case "processing":
        return <span className="text-foreground font-medium">{step.progress}%</span>
      default:
        return <span className="text-muted-foreground/50">Waiting</span>
    }
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Stage progress at top */}
      <div className="border-b px-6 py-4">
        <BuildStageProgress currentStage="generate" />
      </div>

      {/* Generate content - centered */}
      <div className="flex-1 flex justify-center pt-16 pb-8">
        <div className="w-full max-w-lg space-y-6">
          {/* Logo mark placeholder */}
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center">
              <span className="text-background font-bold text-lg">A</span>
            </div>
          </div>

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
