"use client"

import { useMemo, useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

// $20.5M annual cap for D1 schools (per fiscal year)
const ANNUAL_CAP = 20500000

// Helper to get fiscal year from date (FY runs July 1 - June 30)
function getFiscalYear(year: number, month: number): string {
  const fy = month >= 7 ? year + 1 : year
  return `FY${String(fy).slice(-2)}`
}

function getFiscalYearRange(fy: string): string {
  const fyNum = parseInt(fy.replace("FY", ""), 10)
  const startYear = 2000 + fyNum - 1
  const endYear = 2000 + fyNum
  return `Jul '${String(startYear).slice(-2)} - Jun '${String(endYear).slice(-2)}`
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

// Mock data for existing active contracts
const existingActiveData: Record<string, number> = {
  "2025-07": 820000, "2025-08": 850000, "2025-09": 880000, "2025-10": 910000,
  "2025-11": 940000, "2025-12": 960000, "2026-01": 980000, "2026-02": 1000000,
  "2026-03": 1020000, "2026-04": 1030000, "2026-05": 1040000, "2026-06": 1050000,
  "2026-07": 680000, "2026-08": 690000, "2026-09": 700000, "2026-10": 710000,
  "2026-11": 720000, "2026-12": 730000, "2027-01": 740000, "2027-02": 750000,
  "2027-03": 760000, "2027-04": 770000, "2027-05": 780000, "2027-06": 790000,
  "2027-07": 420000, "2027-08": 430000, "2027-09": 440000, "2027-10": 450000,
  "2027-11": 460000, "2027-12": 470000, "2028-01": 480000, "2028-02": 490000,
  "2028-03": 500000, "2028-04": 510000, "2028-05": 520000, "2028-06": 530000,
}

// Mock data for contracts currently in review
const existingInReviewData: Record<string, number> = {
  "2025-07": 120000, "2025-08": 140000, "2025-09": 160000, "2025-10": 150000,
  "2025-11": 130000, "2025-12": 110000, "2026-01": 90000, "2026-02": 80000,
  "2026-03": 70000, "2026-04": 60000, "2026-05": 50000, "2026-06": 40000,
  "2026-07": 60000, "2026-08": 55000, "2026-09": 50000, "2026-10": 45000,
  "2026-11": 40000, "2026-12": 35000, "2027-01": 30000, "2027-02": 25000,
  "2027-03": 20000, "2027-04": 15000, "2027-05": 10000, "2027-06": 5000,
  "2027-07": 20000, "2027-08": 18000, "2027-09": 15000, "2027-10": 12000,
  "2027-11": 10000, "2027-12": 8000, "2028-01": 6000, "2028-02": 5000,
  "2028-03": 4000, "2028-04": 3000, "2028-05": 2000, "2028-06": 1000,
}

interface FiscalYearSummary {
  fy: string
  fyRange: string
  thisContract: number
  activeAndInReview: number
  totalCommitted: number
  remainingCap: number
  isOverCap: boolean
}

interface CapPeriodSidebarProps {
  currentContractPayments: Array<{
    date: string
    amount: number
    capApplicable?: boolean
  }>
  className?: string
}

export function CapPeriodSidebar({ currentContractPayments, className }: CapPeriodSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const placeholderRef = useRef<HTMLDivElement>(null)
  const [isSticky, setIsSticky] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(0)
  
  // Offset from top of viewport when sticky (account for fixed nav bar ~64px + some padding)
  const stickyTopOffset = 80 // Below the nav bar when sticky
  
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

  // Build fiscal year summaries
  const fiscalYearSummaries = useMemo(() => {
    const allMonths = new Set<string>([
      ...Object.keys(existingActiveData),
      ...Object.keys(existingInReviewData),
      ...Object.keys(currentContractByMonth),
    ])
    
    const sortedMonths = Array.from(allMonths).sort((a, b) => a.localeCompare(b))
    const cumulativeByFY: Record<string, { active: number; inReview: number; currentContract: number }> = {}
    
    sortedMonths.forEach(month => {
      const [yearStr, monthStr] = month.split("-")
      const year = Number(yearStr)
      const monthNum = Number(monthStr)
      const fy = getFiscalYear(year, monthNum)
      
      if (!cumulativeByFY[fy]) {
        cumulativeByFY[fy] = { active: 0, inReview: 0, currentContract: 0 }
      }
      
      cumulativeByFY[fy].active += existingActiveData[month] || 0
      cumulativeByFY[fy].inReview += existingInReviewData[month] || 0
      cumulativeByFY[fy].currentContract += currentContractByMonth[month] || 0
    })
    
    const summaries: FiscalYearSummary[] = Object.entries(cumulativeByFY)
      .filter(([, totals]) => totals.currentContract > 0) // Only show FYs with current contract payments
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([fy, totals]) => {
        const activeAndInReview = totals.active + totals.inReview
        const totalCommitted = activeAndInReview + totals.currentContract
        const remainingCap = ANNUAL_CAP - totalCommitted
        
        return {
          fy,
          fyRange: getFiscalYearRange(fy),
          thisContract: totals.currentContract,
          activeAndInReview,
          totalCommitted,
          remainingCap,
          isOverCap: totalCommitted > ANNUAL_CAP,
        }
      })
    
    return summaries
  }, [currentContractByMonth])

  const totalThisContract = fiscalYearSummaries.reduce((sum, s) => sum + s.thisContract, 0)

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
            key={summary.fy}
            className={cn(
              "rounded-lg border p-3 transition-colors",
              summary.isOverCap 
                ? "border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20" 
                : "border-border bg-background"
            )}
          >
            <div className="mb-2">
              <span className="text-sm font-semibold text-foreground">{summary.fyRange}</span>
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
                  style={{ width: `${Math.min(100, (summary.totalCommitted / ANNUAL_CAP) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 text-right">
                {((summary.totalCommitted / ANNUAL_CAP) * 100).toFixed(1)}% of ${(ANNUAL_CAP / 1000000).toFixed(1)}M cap
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
