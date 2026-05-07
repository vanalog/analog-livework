"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Check,
  Users,
  DollarSign,
  Calendar,
  ClipboardList,
  Shield,
  Zap,
} from "lucide-react"
import { useContractWorkflow } from "@/lib/contract-workflow-context"
import { StageProgress } from "./stage-progress"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

function formatDate(iso: string) {
  if (!iso) return "\u2014"
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function ActivationStage({ onComplete }: { onComplete: () => void }) {
  const { state, setStage, activateContract } = useContractWorkflow()
  const [isActivating, setIsActivating] = useState(false)
  const [activated, setActivated] = useState(false)

  const totalValue = useMemo(() =>
    state.exchanges.reduce((sum, e) => sum + e.amount, 0),
    [state.exchanges]
  )

  const sortedDates = useMemo(() =>
    state.exchanges
      .map(e => e.dateTrigger)
      .filter(Boolean)
      .sort(),
    [state.exchanges]
  )

  const firstPaymentDate = sortedDates[0] || null
  const lastPaymentDate = sortedDates[sortedDates.length - 1] || null

  const paymentGatedCount = useMemo(() =>
    state.obligations.filter(o => o.paymentGated).length,
    [state.obligations]
  )

  const handleActivate = () => {
    setIsActivating(true)
    setTimeout(() => {
      activateContract()
      setIsActivating(false)
      setActivated(true)
    }, 1500)
  }

  if (activated) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-4rem)]">
        <div className="border-b px-6 py-4">
          <StageProgress currentStage="activation" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Contract Activated</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {state.uploadData?.athleteName}&apos;s {state.uploadData?.contractType} contract is now active. Payment schedules have been initialized and obligation tracking records created.
              </p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
              Active
            </Badge>
            <div className="pt-4">
              <Button onClick={onComplete} className="bg-foreground text-background hover:bg-foreground/90">
                Return to Contracts
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Stage progress */}
      <div className="border-b px-6 py-4">
        <StageProgress currentStage="activation" />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
          {/* Back navigation */}
          <button
            onClick={() => setStage("review")}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Review
          </button>

          {/* Summary Card */}
          <div className="border rounded-xl p-6 space-y-5 bg-card">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Contract Summary</h2>
              <Badge variant="outline" className="text-xs">Pending Activation</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Athlete</p>
                  <p className="text-sm font-medium text-foreground">{state.uploadData?.athleteName || "\u2014"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <ClipboardList className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Contract Type</p>
                  <p className="text-sm font-medium text-foreground">{state.uploadData?.contractType || "\u2014"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Contract Value</p>
                  <p className="text-sm font-medium text-foreground">{formatCurrency(totalValue)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Exchanges (Payments)</p>
                  <p className="text-sm font-medium text-foreground">{state.exchanges.length}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Payment Window</p>
                  <p className="text-sm font-medium text-foreground">
                    {firstPaymentDate ? formatDate(firstPaymentDate) : "\u2014"} &ndash; {lastPaymentDate ? formatDate(lastPaymentDate) : "\u2014"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Obligations</p>
                  <p className="text-sm font-medium text-foreground">
                    {state.obligations.length} total, {paymentGatedCount} payment-gated
                  </p>
                </div>
              </div>
            </div>

            </div>

          {/* Activation Panel */}
          <div className="border rounded-xl p-6 space-y-4 bg-card">
            <h2 className="text-lg font-semibold text-foreground">Ready to Activate</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Activating this contract will initialize the payment schedule and create obligation tracking records. This action cannot be undone.
            </p>

            <Button
              onClick={handleActivate}
              disabled={isActivating}
              className="w-full bg-foreground text-background hover:bg-foreground/90 h-11 text-sm font-medium gap-2"
              size="lg"
            >
              {isActivating ? (
                <>
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  Activating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Activate Contract
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
