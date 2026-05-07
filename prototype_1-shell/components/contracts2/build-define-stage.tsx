"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Handshake } from "lucide-react"
import { useBuildContract, calculateCapPeriods, type PaymentFrequency, type CapPeriod, type Team } from "@/lib/build-contract-context"
import { BuildStageProgress } from "./build-stage-progress"
import { cn } from "@/lib/utils"
import { getBudgetPeriodsForSport, getAgreementPaymentSums } from "@/lib/budget-actions"
import type { BudgetPeriod } from "@/lib/budget-types"

// Helper to map team to sport for database lookup
function teamToSport(team: Team | null): "MBB" | "WBB" {
  return team === "womens-basketball" ? "WBB" : "MBB"
}

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`
  }
  return `$${value.toLocaleString()}`
}

// Cap Period Allocation inputs only (impact cards moved to sidebar)
function CapPeriodAllocationWithImpact({
  capPeriods,
  onAmountChange,
  errors,
}: {
  capPeriods: CapPeriod[]
  onAmountChange: (periodId: string, amount: number) => void
  errors: Record<string, string>
}) {
  const total = capPeriods.reduce((sum, cp) => sum + cp.amount, 0)
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Cap Period Allocation <span className="text-destructive">*</span></Label>
        <span className="text-sm text-muted-foreground">
          Total: <span className="font-semibold text-foreground">${total.toLocaleString()}</span>
        </span>
      </div>
      
      <div className="rounded-lg border divide-y">
        {capPeriods.map((period) => {
          const percentage = total > 0 ? Math.round((period.amount / total) * 100) : 0
          
          return (
            <div key={period.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex-1">
                <p className="text-sm font-medium">{period.label}</p>
                {total > 0 && (
                  <p className="text-xs text-muted-foreground">{percentage}% of total</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">$</span>
                <Input
                  type="text"
                  value={period.amount ? period.amount.toLocaleString() : ""}
                  onChange={e => {
                    const rawValue = e.target.value.replace(/,/g, "")
                    const numValue = Number(rawValue)
                    if (!isNaN(numValue) && numValue >= 0) {
                      onAmountChange(period.id, numValue)
                    }
                  }}
                  placeholder="0"
                  className="w-32 text-right"
                />
              </div>
            </div>
          )
        })}
        <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
          <p className="text-sm font-medium">Total Contract Value</p>
          <p className="text-sm font-bold">${total.toLocaleString()}</p>
        </div>
      </div>
      
      {errors.capPeriods && (
        <p className="text-sm text-destructive">{errors.capPeriods}</p>
      )}
    </div>
  )
}

// Cap Period Impact Sidebar - shows cap usage impact in a sticky sidebar
// Now fetches real cap values from database based on sport/team selection
function CapPeriodImpactSidebar({ capPeriods, team }: { capPeriods: CapPeriod[]; team: Team | null }) {
  const [budgetPeriods, setBudgetPeriods] = useState<BudgetPeriod[]>([])
  const [agreementPayments, setAgreementPayments] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  
  const total = capPeriods.reduce((sum, cp) => sum + cp.amount, 0)
  const sport = teamToSport(team)
  
  // Fetch budget periods and agreement payments from database when team changes
  useEffect(() => {
    async function fetchBudgets() {
      try {
        setLoading(true)
        const [periods, payments] = await Promise.all([
          getBudgetPeriodsForSport(sport, "REVENUE_SHARE"),
          getAgreementPaymentSums()
        ])
        setBudgetPeriods(periods)
        // Get agreement payments for the current sport
        setAgreementPayments(payments[sport] || {})
      } catch (error) {
        console.error("Failed to fetch budget periods:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBudgets()
  }, [sport])
  
  // Find the matching budget period for a cap period label
  const findBudgetForPeriod = (periodLabel: string): BudgetPeriod | undefined => {
    return budgetPeriods.find(bp => bp.fiscal_year_label === periodLabel)
  }
  
  // Calculate rollover dynamically (same logic as budget-settings)
  // When rollover_enabled is true on period N, the rollover for period N+1
  // is calculated from period N's available amount (INCLUDING this contract's allocations)
  const getCalculatedRollover = (periodIndex: number): number => {
    if (periodIndex < 0 || periodIndex >= budgetPeriods.length) return 0
    
    const period = budgetPeriods[periodIndex]
    
    if (periodIndex === 0) {
      // First period uses its stored rollover_amount
      return period.rollover_amount || 0
    }
    
    const prevPeriod = budgetPeriods[periodIndex - 1]
    
    // If previous period has rollover_enabled, calculate from its available
    if (prevPeriod.rollover_enabled) {
      const prevBudget = prevPeriod.budget_amount || 0
      const prevRollover = getCalculatedRollover(periodIndex - 1)
      const prevPreviouslyCommitted = prevPeriod.committed_amount || 0
      const prevAgreementPayments = agreementPayments[prevPeriod.fiscal_year_label] || 0
      // Include this contract's allocation for the previous period
      const prevThisContract = capPeriods.find(cp => cp.label === prevPeriod.fiscal_year_label)?.amount || 0
      return prevBudget + prevRollover - prevPreviouslyCommitted - prevAgreementPayments - prevThisContract
    }
    
    // Otherwise use the stored rollover_amount
    return period.rollover_amount || 0
  }
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-4 bg-muted rounded w-32 animate-pulse" />
        <div className="h-32 bg-muted rounded animate-pulse" />
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Cap Period Impact
        </h3>
        <span className="text-xs text-muted-foreground">
          Contract: {formatCurrency(total)}
        </span>
      </div>
      
      <div className="space-y-3">
        {capPeriods.map((period) => {
          const budgetPeriod = findBudgetForPeriod(period.label)
          const budgetPeriodIndex = budgetPeriods.findIndex(bp => bp.fiscal_year_label === period.label)
          
          // Use database values with dynamic rollover calculation
          const budgetAmount = budgetPeriod?.budget_amount || 0
          const rolloverAmount = getCalculatedRollover(budgetPeriodIndex)
          const cap = budgetAmount + rolloverAmount
          const previouslyCommitted = budgetPeriod?.committed_amount || 0
          // Get agreement payments for this fiscal year
          const periodAgreementPayments = agreementPayments[period.label] || 0
          // "Active & In Review" should show previously committed + saved agreement payments
          const activeAndInReview = previouslyCommitted + periodAgreementPayments
          const thisContract = period.amount
          // Total committed includes: active/in review + this contract
          const totalCommitted = activeAndInReview + thisContract
          const remainingCap = cap - totalCommitted
          const isOverCap = cap > 0 && totalCommitted > cap
          const percentageUsed = cap > 0 ? (totalCommitted / cap) * 100 : 0
          
          // Show a warning if no budget is configured for this period
          const noBudgetConfigured = !budgetPeriod || cap === 0
          
          return (
            <div
              key={period.id}
              className={cn(
                "rounded-lg border p-4 transition-colors",
                isOverCap 
                  ? "border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20"
                  : noBudgetConfigured
                  ? "border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20"
                  : "border-border bg-background"
              )}
            >
              <div className="mb-3">
                <span className="text-base font-semibold text-foreground">{period.label}</span>
                {isOverCap && (
                  <span className="ml-2 text-xs font-medium text-red-600 dark:text-red-400">
                    Over Cap
                  </span>
                )}
                {noBudgetConfigured && (
                  <span className="ml-2 text-xs font-medium text-amber-600 dark:text-amber-400">
                    No Budget Set
                  </span>
                )}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    This Contract
                  </span>
                  <span className="font-medium">{formatCurrency(thisContract)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Active & In Review</span>
                  <span className="font-medium">{formatCurrency(activeAndInReview)}</span>
                </div>
                
                <div className="h-px bg-border my-1" />
                
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "font-medium",
                    isOverCap ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
                  )}>
                    Remaining Cap
                  </span>
                  <span className={cn(
                    "font-bold",
                    isOverCap 
                      ? "text-red-600 dark:text-red-400" 
                      : "text-emerald-600 dark:text-emerald-400"
                  )}>
                    {noBudgetConfigured 
                      ? "—"
                      : remainingCap >= 0 
                        ? formatCurrency(remainingCap)
                        : `-${formatCurrency(Math.abs(remainingCap))}`
                    }
                  </span>
                </div>
              </div>
              
              {/* Progress bar */}
              {!noBudgetConfigured && (
                <div className="mt-3">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all",
                        isOverCap ? "bg-red-500" : "bg-emerald-500"
                      )}
                      style={{ width: `${Math.min(100, percentageUsed)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 text-right">
                    {percentageUsed.toFixed(1)}% of {formatCurrency(cap)} cap
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface BuildDefineStageProps {
  onCancel: () => void
  fromPlanning?: boolean
  planningCapPeriods?: { cp1: number; cp2: number; cp3: number }
}

export function BuildDefineStage({ onCancel, fromPlanning, planningCapPeriods }: BuildDefineStageProps) {
  const { state, setFormData, setStage, generateSchedule } = useBuildContract()
  const { formData } = state

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Handle cap period amount changes - no fixed total constraint for revenue share
  // Users enter amounts directly for each cap period
  const handleCapPeriodAmountChange = useCallback((periodId: string, newAmount: number) => {
    const updatedCapPeriods = formData.capPeriods.map(cp => {
      if (cp.id === periodId) {
        return { ...cp, amount: newAmount }
      }
      return cp
    })
    
    // Calculate new total from all cap periods
    const newTotal = updatedCapPeriods.reduce((sum, cp) => sum + cp.amount, 0)
    
    // Update percentages based on new total
    const finalCapPeriods = updatedCapPeriods.map(cp => ({
      ...cp,
      percentage: newTotal > 0 ? Math.round((cp.amount / newTotal) * 100) : 0,
    }))
    
    setFormData({ capPeriods: finalCapPeriods, totalValue: newTotal })
  }, [formData.capPeriods, setFormData])
  
  // Toggle lock on a cap period
  const handleToggleCapPeriodLock = useCallback((periodId: string) => {
    const updatedCapPeriods = formData.capPeriods.map(cp => 
      cp.id === periodId ? { ...cp, locked: !cp.locked } : cp
    )
    setFormData({ capPeriods: updatedCapPeriods })
  }, [formData.capPeriods, setFormData])

  // Handle date changes - recalculate cap periods (preserving existing amounts where possible)
  const handleDateChange = useCallback((field: 'startDate' | 'endDate', value: string) => {
    const newStartDate = field === 'startDate' ? value : formData.startDate
    const newEndDate = field === 'endDate' ? value : formData.endDate
    
    if (formData.contractType === "revenue-share" && newStartDate && newEndDate) {
      const newCapPeriods = calculateCapPeriods(newStartDate, newEndDate, formData.capPeriods)
      const newTotal = newCapPeriods.reduce((sum, cp) => sum + cp.amount, 0)
      setFormData({ [field]: value, capPeriods: newCapPeriods, totalValue: newTotal })
    } else {
      setFormData({ [field]: value })
    }
  }, [formData.contractType, formData.startDate, formData.endDate, formData.capPeriods, setFormData])

  const handleContractTypeChange = (type: ContractType) => {
    setFormData({
      contractType: type,
      // Reset obligation bundle when switching types
      obligationBundle: null,
    })
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate cap period totals
    const capTotal = formData.capPeriods.reduce((sum, cp) => sum + cp.amount, 0)
    if (capTotal <= 0) {
      newErrors.capPeriods = "Please enter amounts for at least one cap period"
    }
    
    // Validate dates
    if (!formData.startDate) {
      newErrors.startDate = "Please select a start date"
    }
    if (!formData.endDate) {
      newErrors.endDate = "Please select an end date"
    }
    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = "End date must be after start date"
    }
    
    if (!formData.athleteName) {
      newErrors.athlete = "Please enter an athlete name"
    }
    if (!formData.team) {
      newErrors.team = "Please select a team"
    }
  
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      generateSchedule()
      setStage("generate")
    }
  }

  // Check if we should show the cap period sidebar
  const showCapPeriodSidebar = formData.startDate && formData.endDate && formData.capPeriods.length > 0

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Stage progress at top */}
      <div className="border-b px-6 py-4">
        <BuildStageProgress currentStage="define" />
      </div>

      {/* Form content with optional sidebar */}
      <div className={cn(
        "flex-1 flex py-8 px-4 gap-8 justify-center"
      )}>
        {/* Main form */}
        <div className="w-full max-w-xl space-y-6">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-foreground">Build Agreement Schedule</h1>
            <p className="text-sm text-muted-foreground">
              Define the agreement parameters to generate a payment schedule
            </p>
          </div>

          {/* Agreement Type - Revenue Share is the default and only option */}
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
              <Handshake className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-sm">Revenue Share Agreement</p>
              <p className="text-xs text-muted-foreground">
                Scheduled payments from the Benefits Pool
              </p>
            </div>
          </div>

          {/* Athlete */}
          <div className="space-y-2">
            <Label htmlFor="athleteName">
              Athlete <span className="text-destructive">*</span>
            </Label>
            <Input
              id="athleteName"
              type="text"
              placeholder="Enter athlete's legal name or LLC..."
              value={formData.athleteName}
              onChange={e => setFormData({ 
                athleteName: e.target.value,
                athleteId: e.target.value ? `athlete-${Date.now()}` : ""
              })}
            />
            <p className="text-xs text-muted-foreground">
              Enter the athlete's legal name or their LLC name
            </p>
            {errors.athlete && (
              <p className="text-sm text-destructive">{errors.athlete}</p>
            )}
          </div>

          {/* Team */}
          <div className="space-y-2">
            <Label>
              Team <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.team || ""}
              onValueChange={(value) => setFormData({ team: value as "mens-basketball" | "womens-basketball" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mens-basketball">Men's Basketball</SelectItem>
                <SelectItem value="womens-basketball">Women's Basketball</SelectItem>
              </SelectContent>
            </Select>
            {errors.team && (
              <p className="text-sm text-destructive">{errors.team}</p>
            )}
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">
                Start Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={e => handleDateChange('startDate', e.target.value)}
              />
              {errors.startDate && (
                <p className="text-sm text-destructive">{errors.startDate}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">
                End Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={e => handleDateChange('endDate', e.target.value)}
              />
              {errors.endDate && (
                <p className="text-sm text-destructive">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Payment Frequency */}
          <div className="space-y-2">
            <Label htmlFor="paymentFrequency">Payment Frequency</Label>
            <Select 
              value={formData.paymentFrequency} 
              onValueChange={(value: PaymentFrequency) => setFormData({ paymentFrequency: value })}
            >
              <SelectTrigger id="paymentFrequency">
                <SelectValue placeholder="Select payment frequency..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Cap Period Allocation (shown when dates are entered) */}
          {formData.startDate && formData.endDate && formData.capPeriods.length > 0 && (
            <CapPeriodAllocationWithImpact
              capPeriods={formData.capPeriods}
              onAmountChange={handleCapPeriodAmountChange}
              errors={errors}
            />
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="gap-2">
              Generate Schedule
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Cap Period Impact Sidebar */}
        {showCapPeriodSidebar && (
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <CapPeriodImpactSidebar capPeriods={formData.capPeriods} team={formData.team} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
