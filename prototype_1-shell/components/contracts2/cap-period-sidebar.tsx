"use client"

import { useMemo, useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { getBudgetPeriodsForSport, getAgreementPaymentSums } from "@/lib/budget-actions"
import type { BudgetPeriod } from "@/lib/budget-types"

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`
  }
  return `$${value.toLocaleString()}`
}

interface FiscalYearSummary {
  periodId: string
  label: string
  thisContract: number
  activeAndInReview: number
  totalCommitted: number
  cap: number // Total cap (budget + rollover) from database
  remainingCap: number
  isOverCap: boolean
  startDate: string
  endDate: string
}

interface CapPeriodSidebarProps {
  currentContractPayments: Array<{
    date: string
    amount: number
    capApplicable?: boolean
  }>
  sport?: "MBB" | "WBB"
  className?: string
  editingContractId?: string | null
}

export function CapPeriodSidebar({ 
  currentContractPayments, 
  sport = "MBB",
  className,
  editingContractId = null,
}: CapPeriodSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const placeholderRef = useRef<HTMLDivElement>(null)
  const [isSticky, setIsSticky] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(0)
  const [budgetPeriods, setBudgetPeriods] = useState<BudgetPeriod[]>([])
  const [agreementPayments, setAgreementPayments] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  
  // Offset from top of viewport when sticky (account for fixed nav bar ~64px + some padding)
  const stickyTopOffset = 80 // Below the nav bar when sticky

  // Fetch budget periods and agreement payments from database
  useEffect(() => {
    async function fetchBudgets() {
      try {
        setLoading(true)
        const [periods, payments] = await Promise.all([
          getBudgetPeriodsForSport(sport, "REVENUE_SHARE"),
          // Exclude the current contract being edited to avoid double-counting
          getAgreementPaymentSums(editingContractId)
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
  }, [sport, editingContractId])
  
  useEffect(() => {
    const handleScroll = () => {
      if (!placeholderRef.current) return
      
      const rect = placeholderRef.current.getBoundingClientRect()
      const shouldBeSticky = rect.top <= stickyTopOffset
      
      if (shouldBeSticky && !isSticky) {
        // Capture width before going sticky
        setSidebarWidth(placeholderRef.current.offsetWidth)
        setIsSticky(true)
      } else if (!shouldBeSticky && isSticky) {
        setIsSticky(false)
      }
    }
    
    // Also handle resize to update width
    const handleResize = () => {
      if (placeholderRef.current && isSticky) {
        setSidebarWidth(placeholderRef.current.offsetWidth)
      }
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleResize, { passive: true })
    
    // Initial check
    handleScroll()
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [isSticky, stickyTopOffset])

  // Aggregate current contract payments by month
  const currentContractByMonth = useMemo(() => {
    const monthlyTotals: Record<string, number> = {}
    
    currentContractPayments.forEach(payment => {
      if (!payment.date) return
      if (payment.capApplicable === false) return
      
      const d = new Date(payment.date + "T00:00:00")
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      monthlyTotals[key] = (monthlyTotals[key] || 0) + payment.amount
    })
    
    return monthlyTotals
  }, [currentContractPayments])

  // Helper to check if a date falls within a budget period
  const findBudgetPeriodForDate = (dateKey: string): BudgetPeriod | undefined => {
    const [year, month] = dateKey.split("-").map(Number)
    const date = new Date(year, month - 1, 15) // Mid-month to be safe
    
    return budgetPeriods.find(period => {
      const start = new Date(period.start_date + "T00:00:00")
      const end = new Date(period.end_date + "T23:59:59")
      return date >= start && date <= end
    })
  }
  
  // Calculate current contract total for a specific budget period
  const getCurrentContractForPeriod = (period: BudgetPeriod): number => {
    let total = 0
    Object.entries(currentContractByMonth).forEach(([monthKey, amount]) => {
      const bp = findBudgetPeriodForDate(monthKey)
      if (bp?.id === period.id) {
        total += amount
      }
    })
    return total
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
      const prevCommitted = prevPeriod.committed_amount || 0
      const prevAgreementPayments = agreementPayments[prevPeriod.fiscal_year_label] || 0
      // Include this contract's allocation for the previous period
      const prevThisContract = getCurrentContractForPeriod(prevPeriod)
      return prevBudget + prevRollover - prevCommitted - prevAgreementPayments - prevThisContract
    }
    
    // Otherwise use the stored rollover_amount
    return period.rollover_amount || 0
  }

  // Build fiscal year summaries based on budget periods from database
  const fiscalYearSummaries = useMemo(() => {
    if (loading || budgetPeriods.length === 0) return []
    
    // Group current contract payments by budget period
    const periodData: Record<string, { 
      period: BudgetPeriod
      currentContract: number
    }> = {}
    
    // Initialize with all budget periods
    budgetPeriods.forEach(period => {
      periodData[period.id] = {
        period,
        currentContract: 0,
      }
    })
    
    // Aggregate current contract payments by budget period
    Object.entries(currentContractByMonth).forEach(([monthKey, amount]) => {
      const budgetPeriod = findBudgetPeriodForDate(monthKey)
      if (!budgetPeriod) return
      
      const data = periodData[budgetPeriod.id]
      if (!data) return
      
      data.currentContract += amount
    })
    
    // Build summaries only for periods with current contract payments
    const summaries: FiscalYearSummary[] = Object.values(periodData)
      .filter(data => data.currentContract > 0)
      .sort((a, b) => a.period.start_date.localeCompare(b.period.start_date))
      .map((data, _idx, arr) => {
        const { period, currentContract } = data
        // Find the index of this period in the full budgetPeriods array for rollover calculation
        const periodIndex = budgetPeriods.findIndex(bp => bp.id === period.id)
        const budgetAmount = period.budget_amount || 0
        const rolloverAmount = getCalculatedRollover(periodIndex)
        const cap = budgetAmount + rolloverAmount
        // Use committed_amount from database as "Previously Committed"
        const previouslyCommitted = period.committed_amount || 0
        // Get agreement payments for this fiscal year (saved contracts)
        const periodAgreementPayments = agreementPayments[period.fiscal_year_label] || 0
        // "Active & In Review" should be Previously Committed + Agreement Payments (existing saved contracts)
        const activeAndInReview = previouslyCommitted + periodAgreementPayments
        // Total committed includes: active contracts + this contract being edited/created
        const totalCommitted = activeAndInReview + currentContract
        const remainingCap = cap - totalCommitted
        
        return {
          periodId: period.id,
          label: period.fiscal_year_label,
          thisContract: currentContract,
          activeAndInReview,
          totalCommitted,
          cap,
          remainingCap,
          isOverCap: totalCommitted > cap,
          startDate: period.start_date,
          endDate: period.end_date,
        }
      })
    
    return summaries
  }, [budgetPeriods, currentContractByMonth, loading, agreementPayments])

  const totalThisContract = fiscalYearSummaries.reduce((sum, s) => sum + s.thisContract, 0)

  if (loading) {
    return (
      <div className={className}>
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-muted rounded w-32" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (fiscalYearSummaries.length === 0) {
    return null
  }

  const sidebarContent = (
    <div 
      ref={sidebarRef}
      className={cn(
        "space-y-3 bg-background",
        isSticky && "fixed z-40 pr-2"
      )}
      style={isSticky ? { 
        top: `${stickyTopOffset}px`, 
        width: `${sidebarWidth}px`,
      } : undefined}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Cap Period Impact
        </h3>
        <span className="text-xs text-muted-foreground">
          Contract: {formatCurrency(totalThisContract)}
        </span>
      </div>
      
      <div className="space-y-3">
        {fiscalYearSummaries.map((summary) => (
          <div
            key={summary.periodId}
            className={cn(
              "rounded-lg border p-3 transition-colors",
              summary.isOverCap 
                ? "border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20" 
                : "border-border bg-background"
            )}
          >
            <div className="mb-2">
              <span className="text-sm font-semibold text-foreground">{summary.label}</span>
              {summary.isOverCap && (
                <span className="ml-2 text-[10px] font-medium text-red-600 dark:text-red-400">
                  Over Cap
                </span>
              )}
            </div>
            
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(142, 71%, 45%)" }} />
                  This Contract
                </span>
                <span className="font-medium">{formatCurrency(summary.thisContract)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Active & In Review</span>
                <span className="font-medium">{formatCurrency(summary.activeAndInReview)}</span>
              </div>
              
              <div className="h-px bg-border my-1" />
              
              <div className="flex items-center justify-between">
                <span className={cn(
                  "font-medium",
                  summary.isOverCap ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
                )}>
                  {summary.remainingCap >= 0 ? "Remaining Cap" : "Over Cap"}
                </span>
                <span className={cn(
                  "font-bold",
                  summary.isOverCap 
                    ? "text-red-600 dark:text-red-400" 
                    : "text-emerald-600 dark:text-emerald-400"
                )}>
                  {summary.remainingCap >= 0 
                    ? formatCurrency(summary.remainingCap)
                    : `-${formatCurrency(Math.abs(summary.remainingCap))}`
                  }
                </span>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-2">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all",
                    summary.isOverCap ? "bg-red-500" : "bg-emerald-500"
                  )}
                  style={{ width: `${Math.min(100, (summary.totalCommitted / summary.cap) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 text-right">
                {((summary.totalCommitted / summary.cap) * 100).toFixed(1)}% of {formatCurrency(summary.cap)} cap
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div ref={placeholderRef} className={className}>
      {sidebarContent}
    </div>
  )
}
