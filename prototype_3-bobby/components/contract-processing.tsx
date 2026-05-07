"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface ProcessingStep {
  id: number
  label: string
  status: "pending" | "processing" | "complete" | "error"
}

interface ContractProcessingProps {
  fileName: string
  onComplete: (success: boolean, error?: string) => void
  onContinueInBackground: () => void
  onCancel: () => void
  onPartiesResolution?: () => void
}

export function ContractProcessing({
  fileName,
  onComplete,
  onContinueInBackground,
  onCancel,
  onPartiesResolution,
}: ContractProcessingProps) {
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { id: 1, label: "Upload received", status: "complete" },
    { id: 2, label: "OCR & normalization", status: "pending" },
    { id: 3, label: "Clause extraction", status: "pending" },
    { id: 4, label: "Parties & roles", status: "pending" },
    { id: 5, label: "Disbursement logic", status: "pending" },
    { id: 6, label: "Compliance pre-check", status: "pending" },
  ])

  const [currentStep, setCurrentStep] = useState(1)
  const [notifyWhenReady, setNotifyWhenReady] = useState(false)
  const [processingError, setProcessingError] = useState<string | null>(null)

  useEffect(() => {
    const processSteps = async () => {
      // Simulate processing each step
      for (let i = 2; i <= 6; i++) {
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000 + 1000)) // 1-3 seconds per step

        // Simulate occasional errors (10% chance)
        if (Math.random() < 0.1 && i === 3) {
          setProcessingError("Encrypted PDF. Enter password to re-try.")
          setSteps((prev) => prev.map((step) => (step.id === i ? { ...step, status: "error" } : step)))
          return
        }

        setCurrentStep(i)
        setSteps((prev) =>
          prev.map((step) => {
            if (step.id === i) return { ...step, status: "processing" }
            if (step.id < i) return { ...step, status: "complete" }
            return step
          }),
        )

        if (i === 4 && onPartiesResolution) {
          // Complete the current step after a brief moment
          await new Promise((resolve) => setTimeout(resolve, 500))
          setSteps((prev) => prev.map((step) => (step.id === i ? { ...step, status: "complete" } : step)))

          // Trigger parties resolution instead of continuing
          onPartiesResolution()
          return
        }

        // Complete the current step after a brief moment
        await new Promise((resolve) => setTimeout(resolve, 500))
        setSteps((prev) => prev.map((step) => (step.id === i ? { ...step, status: "complete" } : step)))
      }

      // Processing complete
      setTimeout(() => {
        onComplete(true)
      }, 1000)
    }

    processSteps()
  }, [onComplete, onPartiesResolution])

  const getStepIcon = (step: ProcessingStep) => {
    switch (step.status) {
      case "complete":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "processing":
        return <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStepTextColor = (step: ProcessingStep) => {
    switch (step.status) {
      case "complete":
        return "text-green-600"
      case "processing":
        return "text-primary font-medium"
      case "error":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  if (processingError) {
    return (
      <div className="p-6">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <div>
            <h2 className="text-xl font-semibold mb-2">Processing Error</h2>
            <p className="text-muted-foreground">{processingError}</p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setProcessingError(null)
                setSteps((prev) => prev.map((step) => ({ ...step, status: step.id === 1 ? "complete" : "pending" })))
                setCurrentStep(1)
              }}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Parsing contract…</h1>
          <p className="text-sm text-muted-foreground">Processing "{fileName}"</p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-3">
              {getStepIcon(step)}
              <span className={`text-sm font-mono ${getStepTextColor(step)}`}>
                {step.label}
                {step.status === "processing" && <span className="ml-2 animate-pulse">...</span>}
              </span>
            </div>
          ))}
        </div>

        {/* Hint Text */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Identifying parties and roles...</p>
        </div>

        {/* Controls */}
        <div className="pt-4 border-t">
          <div className="flex justify-center">
            <Button variant="ghost" onClick={onCancel} className="px-4">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
