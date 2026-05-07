"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  Save,
  Loader2,
} from "lucide-react"
import { useBuildContract } from "@/lib/build-contract-context"
import { BuildStageProgress } from "./build-stage-progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createContract } from "@/lib/contract-actions"
import { getBudgetPeriodsForSport } from "@/lib/budget-actions"
import type { CreateContractInput, CreatePaymentInput, CreateCapAllocationInput, CreateConditionalPaymentInput } from "@/lib/contract-types"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)
}

// Format date as M/D/YYYY (no leading zeros to match Word doc)
function formatDate(iso: string) {
  if (!iso) return "—"
  const d = new Date(iso + "T00:00:00")
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
}

// Get the period date range from a payment date (full month range)
function getPeriodRangeFromDate(dateStr: string) {
  if (!dateStr) return "—"
  const d = new Date(dateStr + "T00:00:00")
  const y = d.getFullYear()
  const m = d.getMonth()
  const start = new Date(y, m, 1)
  const end = new Date(y, m + 1, 0) // Last day of month
  
  const fmt = (dt: Date) => {
    const mm = String(dt.getMonth() + 1).padStart(2, '0')
    const dd = String(dt.getDate()).padStart(2, '0')
    const yyyy = dt.getFullYear()
    return `${mm}/${dd}/${yyyy}`
  }
  return `${fmt(start)}-${fmt(end)}`
}

function formatDateFull(iso: string) {
  if (!iso) return "—"
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
}

// Get cap periods covered from payments (fiscal year runs July 1 - June 30)
function getCapPeriodsCovered(payments: { fiscalYear: string }[]): string {
  const years = new Set(payments.map(p => p.fiscalYear))
  const sorted = Array.from(years).sort()
  if (sorted.length === 0) return "None"
  
  const formatCapPeriod = (fy: string) => {
    const yearNum = parseInt(fy.replace("FY", ""), 10)
    const startYear = yearNum - 1
    const endYear = yearNum
    return `Jul '${startYear.toString().slice(-2)} - Jun '${endYear.toString().slice(-2)}`
  }
  
  if (sorted.length === 1) return formatCapPeriod(sorted[0])
  return `${formatCapPeriod(sorted[0])} to ${formatCapPeriod(sorted[sorted.length - 1])}`
}

interface BuildExportStageProps {
  onBack?: () => void
  onCancel?: () => void
  onComplete: () => void
  isEditing?: boolean
  onSave?: () => Promise<void>
  saving?: boolean
}

export function BuildExportStage({ onBack, onCancel, onComplete, isEditing, onSave, saving: externalSaving }: BuildExportStageProps) {
  const router = useRouter()
  const { state, setStage } = useBuildContract()
  const { formData, payments, conditionalPayments, obligations, scheduleTotal } = state
  
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  
  const isSaving = externalSaving || saving

  // Save contract to database
  const handleSaveContract = async () => {
    if (!formData.team || !formData.athleteName) {
      setSaveError("Missing required contract information")
      return
    }

    setSaving(true)
    setSaveError(null)

    try {
      // Map team to database format
      const teamCode = formData.team === "mens-basketball" ? "MBB" : "WBB"
      
      // Get budget periods to map cap period labels to IDs
      const budgetPeriods = await getBudgetPeriodsForSport(teamCode, "REVENUE_SHARE")
      
      // Build cap period label to budget_period_id mapping
      const periodLabelToId: Record<string, string> = {}
      for (const bp of budgetPeriods) {
        periodLabelToId[bp.fiscal_year_label] = bp.id
      }

      // Build contract input
      const contractInput: CreateContractInput = {
        athlete_name: formData.athleteName,
        counterparty_name: formData.counterpartyName || "Revenue Share",
        team: teamCode,
        start_date: formData.startDate,
        end_date: formData.endDate,
        total_value: scheduleTotal,
        payment_frequency: formData.paymentFrequency,
        status: "active",
      }

      // Build payments input
      const paymentsInput: Omit<CreatePaymentInput, 'contract_id'>[] = payments.map(p => ({
        payment_date: p.date,
        amount: p.amount,
        cap_period_label: p.capPeriod,
      }))

      // Build cap allocations from capPeriods in formData
      // Group payments by fiscal year and sum amounts
      const allocationsByPeriod: Record<string, number> = {}
      for (const capPeriod of formData.capPeriods) {
        if (capPeriod.amount > 0) {
          const budgetPeriodId = periodLabelToId[capPeriod.label]
          if (budgetPeriodId) {
            allocationsByPeriod[budgetPeriodId] = (allocationsByPeriod[budgetPeriodId] || 0) + capPeriod.amount
          }
        }
      }

      const capAllocationsInput: Omit<CreateCapAllocationInput, 'contract_id'>[] = Object.entries(allocationsByPeriod).map(([budget_period_id, allocated_amount]) => ({
        budget_period_id,
        allocated_amount,
      }))

      // Build conditional payments input
      const conditionalPaymentsInput: Omit<CreateConditionalPaymentInput, 'contract_id'>[] = (conditionalPayments || []).map(p => ({
        payment_date: p.date,
        amount: p.amount,
        payment_type: p.type,
        cap_period: p.capPeriod,
      }))

      // Create the contract
      await createContract(contractInput, paymentsInput, capAllocationsInput, conditionalPaymentsInput)
      
      setSaved(true)
      
      // Redirect to agreements page after successful save
      setTimeout(() => {
        router.push("/agreements")
      }, 500)
    } catch (error) {
      console.error("Error saving contract:", error)
      setSaveError(error instanceof Error ? error.message : "Failed to save contract")
    } finally {
      setSaving(false)
    }
  }

  const contractTypeLabel = formData.contractType === "revenue-share" 
    ? "Revenue Share" 
    : formData.contractType === "ioi" 
      ? "NIL Indication of Interest" 
      : "NIL Sponsorship"
  const capPeriodsCovered = getCapPeriodsCovered(payments)
  
  const isIoi = formData.contractType === "ioi"

  // Build the table data for copying - matches Word doc format
  const buildCopyableTable = () => {
    const rows = payments.map((payment, index) => {
      const periodNum = index + 1
      const dates = getPeriodRangeFromDate(payment.date)
      const amount = formatCurrency(payment.amount)
      const paymentDate = formatDate(payment.date)
      return `${periodNum}\t${dates}\t${amount}\t${paymentDate}`
    })
    
    // Add header row
    const header = "Payment Period\tDates\tAmount\tPayment Date"
    return [header, ...rows].join("\n")
  }

  const handleCopyTable = async () => {
    try {
      await navigator.clipboard.writeText(buildCopyableTable())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleExportCSV = () => {
    const csvContent = [
      "Payment Period,Dates,Amount,Payment Date",
      ...payments.map((payment, index) => {
        const periodNum = index + 1
        const dates = `"${getPeriodRangeFromDate(payment.date)}"`
        const amount = payment.amount.toFixed(2)
        const paymentDate = formatDate(payment.date)
        return `${periodNum},${dates},${amount},${paymentDate}`
      })
    ].join("\n")
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${formData.athleteName.replace(/\s+/g, "_")}_payment_schedule.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  // IOI-specific export view
  if (isIoi) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-4rem)]">
        {/* Stage progress at top - simplified for IOI */}
        <div className="border-b px-6 py-4">
          <div className="flex items-center gap-1 w-full max-w-xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 bg-foreground border-foreground">
                <Check className="w-4 h-4 text-background" />
              </div>
              <span className="text-xs font-medium whitespace-nowrap text-foreground hidden sm:inline">Define</span>
            </div>
            <div className="flex-1 h-px mx-3 min-w-[24px] bg-foreground" />
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-foreground bg-background">
                <Download className="w-3.5 h-3.5 text-foreground" />
              </div>
              <span className="text-xs font-medium whitespace-nowrap text-foreground hidden sm:inline">Export</span>
            </div>
          </div>
        </div>

        {/* IOI Export content */}
        <div className="flex-1 flex justify-center py-6 px-4">
          <div className="w-full max-w-4xl">
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-semibold text-foreground">IOI Summary</h2>
                <p className="text-xs text-muted-foreground mt-1">Review the indication of interest details</p>
              </div>

              <div className="space-y-3 p-3 rounded-lg border bg-muted/20 max-w-md text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Document Type</span>
                  <Badge variant="outline" className="text-xs">{contractTypeLabel}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Student Athlete</span>
                  <span className="font-medium">{formData.athleteName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Company</span>
                  <span className="font-medium">{formData.counterpartyName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Estimated NIL Value</span>
                  <span className="font-semibold">{formatCurrency(formData.totalValue)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Agreement Date</span>
                  <span className="font-medium">{formatDateFull(formData.agreementDate)}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                This document indicates potential NIL compensation only. Actual NIL activities and payments will be offered through the NIL platform.
              </p>
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t">
              <Button variant="ghost" size="sm" onClick={() => setStage("define")} className="gap-2 text-xs">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Define
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Standard contract export view
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Stage progress at top */}
      <div className="border-b px-4 py-3">
        <BuildStageProgress currentStage="export" />
      </div>

      {/* Export content */}
      <div className="flex-1 flex justify-center py-4 px-3">
        <div className="w-full max-w-4xl space-y-4">
          {/* Header with title */}
          <div>
            <h2 className="text-base font-semibold text-foreground">Payment Schedule</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Copy this schedule to paste into your contract document
            </p>
          </div>

          {/* Summary cards - moved above table, Athlete first */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg border bg-muted/20">
              <span className="text-muted-foreground">Athlete</span>
              <p className="font-medium mt-0.5">{formData.athleteName}</p>
            </div>
            <div className="p-3 rounded-lg border bg-muted/20">
              <span className="text-muted-foreground">Date Range</span>
              <p className="font-medium mt-0.5">{formatDate(formData.startDate)} – {formatDate(formData.endDate)}</p>
            </div>
            <div className="p-3 rounded-lg border bg-muted/20">
              <span className="text-muted-foreground">Cap Periods Covered</span>
              <p className="font-medium mt-0.5">{capPeriodsCovered}</p>
            </div>
          </div>

          {/* Payment Schedule Table - compact */}
          <div className="rounded-lg border">
            <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
              <div className="flex items-center gap-3 text-xs">
                <span className="font-medium">{payments.length} Payments</span>
                <span className="text-muted-foreground">Total: <span className="font-semibold text-foreground">{formatCurrency(scheduleTotal)}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCSV}
                  className="gap-1.5 h-7 text-xs px-2"
                >
                  <Download className="w-3 h-3" />
                  CSV
                </Button>
                <Button
                  variant={copied ? "default" : "outline"}
                  size="sm"
                  onClick={handleCopyTable}
                  className="gap-1.5 h-7 text-xs px-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy Table
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-20 text-xs py-2 px-2">Period</TableHead>
                  <TableHead className="text-xs py-2 px-2">Dates</TableHead>
                  <TableHead className="text-right text-xs py-2 px-2">Amount</TableHead>
                  <TableHead className="text-xs py-2 px-2">Payment Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment, index) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium text-center text-xs py-1.5 px-2">{index + 1}</TableCell>
                    <TableCell className="text-xs py-1.5 px-2">{getPeriodRangeFromDate(payment.date)}</TableCell>
                    <TableCell className="text-right font-mono text-xs py-1.5 px-2">{formatCurrency(payment.amount)}</TableCell>
                    <TableCell className="text-xs py-1.5 px-2">{formatDate(payment.date)}</TableCell>
                  </TableRow>
                ))}
                {/* Total row */}
                <TableRow className="bg-muted/30 font-medium">
                  <TableCell className="text-xs py-1.5 px-2"></TableCell>
                  <TableCell className="text-xs py-1.5 px-2">Total</TableCell>
                  <TableCell className="text-right font-mono text-xs py-1.5 px-2">{formatCurrency(scheduleTotal)}</TableCell>
                  <TableCell className="text-xs py-1.5 px-2"></TableCell>
                </TableRow>
</TableBody>
          </Table>
          </div>

          {/* Conditional Payments Section */}
          {conditionalPayments && conditionalPayments.length > 0 && (
            <div className="rounded-lg border">
              <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-medium">{conditionalPayments.length} Conditional Payment{conditionalPayments.length !== 1 ? 's' : ''}</span>
                  <span className="text-muted-foreground">Total: <span className="font-semibold text-foreground">{formatCurrency(conditionalPayments.reduce((sum, p) => sum + p.amount, 0))}</span></span>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs py-2 px-2">Type</TableHead>
                    <TableHead className="text-right text-xs py-2 px-2">Amount</TableHead>
                    <TableHead className="text-xs py-2 px-2">Target Date</TableHead>
                    <TableHead className="text-xs py-2 px-2">Cap Period</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conditionalPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="text-xs py-1.5 px-2">{payment.type}</TableCell>
                      <TableCell className="text-right font-mono text-xs py-1.5 px-2">{formatCurrency(payment.amount)}</TableCell>
                      <TableCell className="text-xs py-1.5 px-2">{formatDate(payment.date)}</TableCell>
                      <TableCell className="text-xs py-1.5 px-2">{payment.capPeriod}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Save error message */}
          {saveError && (
            <div className="p-2 rounded-md bg-destructive/10 text-destructive text-xs">
              {saveError}
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-3 border-t">
            <Button variant="ghost" size="sm" onClick={onBack || (() => setStage("review"))} className="gap-1.5 text-xs h-8">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Review
            </Button>
            <Button 
              size="sm" 
              onClick={isEditing ? onSave : handleSaveContract}
              disabled={isSaving || saved}
              className="gap-1.5 text-xs h-8"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  {isEditing ? "Save Changes" : "Save Contract"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
