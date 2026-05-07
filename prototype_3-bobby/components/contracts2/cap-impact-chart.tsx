"use client"

import { useState, useMemo } from "react"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

// $20.5M annual cap for D1 schools (per fiscal year)
const ANNUAL_CAP = 20500000

// Helper to get fiscal year from date (FY runs July 1 - June 30)
// e.g., July 2025 -> FY26, June 2026 -> FY26
function getFiscalYear(year: number, month: number): string {
  // If month is July (7) through December (12), it's the next calendar year's FY
  // If month is January (1) through June (6), it's the current calendar year's FY
  const fy = month >= 7 ? year + 1 : year
  return `FY${String(fy).slice(-2)}`
}

function getFiscalYearRange(fy: string): string {
  const fyNum = parseInt(fy.replace("FY", ""), 10)
  const startYear = 2000 + fyNum - 1
  const endYear = 2000 + fyNum
  return `Jul '${String(startYear).slice(-2)} - Jun '${String(endYear).slice(-2)}`
}

// Mock data for existing active contracts - cumulative totals per month
// These represent cap-applicable payments from executed contracts
const existingActiveData: Record<string, number> = {
  "2025-07": 820000,
  "2025-08": 850000,
  "2025-09": 880000,
  "2025-10": 910000,
  "2025-11": 940000,
  "2025-12": 960000,
  "2026-01": 980000,
  "2026-02": 1000000,
  "2026-03": 1020000,
  "2026-04": 1030000,
  "2026-05": 1040000,
  "2026-06": 1050000,
  "2026-07": 680000,
  "2026-08": 690000,
  "2026-09": 700000,
  "2026-10": 710000,
  "2026-11": 720000,
  "2026-12": 730000,
  "2027-01": 740000,
  "2027-02": 750000,
  "2027-03": 760000,
  "2027-04": 770000,
  "2027-05": 780000,
  "2027-06": 790000,
  "2027-07": 420000,
  "2027-08": 430000,
  "2027-09": 440000,
  "2027-10": 450000,
  "2027-11": 460000,
  "2027-12": 470000,
  "2028-01": 480000,
  "2028-02": 490000,
  "2028-03": 500000,
  "2028-04": 510000,
  "2028-05": 520000,
  "2028-06": 530000,
}

// Mock data for contracts currently in review (excluding current contract)
const existingInReviewData: Record<string, number> = {
  "2025-07": 120000,
  "2025-08": 140000,
  "2025-09": 160000,
  "2025-10": 150000,
  "2025-11": 130000,
  "2025-12": 110000,
  "2026-01": 90000,
  "2026-02": 80000,
  "2026-03": 70000,
  "2026-04": 60000,
  "2026-05": 50000,
  "2026-06": 40000,
  "2026-07": 60000,
  "2026-08": 55000,
  "2026-09": 50000,
  "2026-10": 45000,
  "2026-11": 40000,
  "2026-12": 35000,
  "2027-01": 30000,
  "2027-02": 25000,
  "2027-03": 20000,
  "2027-04": 15000,
  "2027-05": 10000,
  "2027-06": 5000,
  "2027-07": 20000,
  "2027-08": 18000,
  "2027-09": 15000,
  "2027-10": 12000,
  "2027-11": 10000,
  "2027-12": 8000,
  "2028-01": 6000,
  "2028-02": 4000,
  "2028-03": 3000,
  "2028-04": 2000,
  "2028-05": 1000,
  "2028-06": 0,
}

interface PaymentData {
  date: string
  amount: number
  capApplicable?: boolean
}

interface CapImpactChartProps {
  currentContractPayments: PaymentData[]
  athleteName?: string
  className?: string
  defaultExpanded?: boolean
}

const chartConfig = {
  active: {
    label: "Active Contracts",
    color: "hsl(221, 83%, 53%)",
  },
  inReview: {
    label: "Contracts In Review",
    color: "hsl(212, 95%, 68%)",
  },
  currentContract: {
    label: "This Contract",
    color: "hsl(142, 71%, 45%)",
  },
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

function formatCurrencyFull(value: number): string {
  return `$${value.toLocaleString()}`
}

function formatDateLabel(dateString: string): string {
  const [year, month] = dateString.split("-")
  const date = new Date(Number(year), Number(month) - 1)
  const monthStr = date.toLocaleDateString("en-US", { month: "short" })
  const yearStr = year.slice(-2)
  return `${monthStr} '${yearStr}`
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

export function CapImpactChart({ 
  currentContractPayments, 
  athleteName,
  className,
  defaultExpanded = true 
}: CapImpactChartProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [yearsToShow, setYearsToShow] = useState<"1" | "2" | "3">("2")

  // Aggregate current contract payments by month
  const currentContractByMonth = useMemo(() => {
    const monthlyTotals: Record<string, number> = {}
    
    currentContractPayments.forEach(payment => {
      if (!payment.date) return
      // Only count cap-applicable payments, default to true if not specified
      if (payment.capApplicable === false) return
      
      const d = new Date(payment.date + "T00:00:00")
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      monthlyTotals[key] = (monthlyTotals[key] || 0) + payment.amount
    })
    
    return monthlyTotals
  }, [currentContractPayments])

  // Build cumulative chart data per fiscal year
  const { chartData, fiscalYearSummaries } = useMemo(() => {
    // Get all unique months from all data sources
    const allMonths = new Set<string>([
      ...Object.keys(existingActiveData),
      ...Object.keys(existingInReviewData),
      ...Object.keys(currentContractByMonth),
    ])
    
    // Sort months chronologically
    const sortedMonths = Array.from(allMonths).sort((a, b) => a.localeCompare(b))
    
    // Track cumulative totals per fiscal year
    const cumulativeByFY: Record<string, { active: number; inReview: number; currentContract: number }> = {}
    
    // Build chart data with cumulative values
    const data = sortedMonths
      .filter(month => {
        const hasCurrentContract = (currentContractByMonth[month] || 0) > 0
        const hasActive = (existingActiveData[month] || 0) > 0
        const hasInReview = (existingInReviewData[month] || 0) > 0
        return hasCurrentContract || hasActive || hasInReview
      })
      .map(month => {
        const [yearStr, monthStr] = month.split("-")
        const year = Number(yearStr)
        const monthNum = Number(monthStr)
        const fy = getFiscalYear(year, monthNum)
        
        // Initialize FY cumulative if not exists
        if (!cumulativeByFY[fy]) {
          cumulativeByFY[fy] = { active: 0, inReview: 0, currentContract: 0 }
        }
        
        // Add this month's values to cumulative
        const activeThisMonth = existingActiveData[month] || 0
        const inReviewThisMonth = existingInReviewData[month] || 0
        const currentContractThisMonth = currentContractByMonth[month] || 0
        
        cumulativeByFY[fy].active += activeThisMonth
        cumulativeByFY[fy].inReview += inReviewThisMonth
        cumulativeByFY[fy].currentContract += currentContractThisMonth
        
        const cumulativeActive = cumulativeByFY[fy].active
        const cumulativeInReview = cumulativeByFY[fy].inReview
        const cumulativeCurrentContract = cumulativeByFY[fy].currentContract
        
        return {
          month,
          fy,
          active: cumulativeActive,
          inReview: cumulativeInReview,
          currentContract: cumulativeCurrentContract,
          total: cumulativeActive + cumulativeInReview + cumulativeCurrentContract,
          // Track when we're starting a new FY (July)
          isNewFY: monthNum === 7,
        }
      })
    
    // Build fiscal year summaries for the sidebar
    const summaries: FiscalYearSummary[] = Object.entries(cumulativeByFY)
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
    
    return { chartData: data, fiscalYearSummaries: summaries }
  }, [currentContractByMonth])

  // Filter data based on years selection
  const { filteredChartData, filteredFiscalYearSummaries } = useMemo(() => {
    const numYears = parseInt(yearsToShow, 10)
    const filteredSummaries = fiscalYearSummaries.slice(0, numYears)
    const allowedFYs = new Set(filteredSummaries.map(s => s.fy))
    const filteredData = chartData.filter(d => allowedFYs.has(d.fy))
    return { filteredChartData: filteredData, filteredFiscalYearSummaries: filteredSummaries }
  }, [chartData, fiscalYearSummaries, yearsToShow])

  // Calculate if any fiscal year exceeds the cap
  const hasCapExceedance = useMemo(() => {
    return filteredFiscalYearSummaries.some(s => s.isOverCap)
  }, [filteredFiscalYearSummaries])

  // Calculate total current contract value (cap-applicable)
  const currentContractTotal = useMemo(() => {
    return Object.values(currentContractByMonth).reduce((sum, val) => sum + val, 0)
  }, [currentContractByMonth])

  if (filteredChartData.length === 0) {
    return null
  }

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      {/* Collapsible header */}
      <div
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 flex-1 text-left"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">Cap Impact Analysis</span>
            {hasCapExceedance && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                Exceeds Cap
              </span>
            )}
          </div>
          {athleteName && (
            <span className="text-xs text-muted-foreground hidden md:inline">
              Showing impact of {athleteName}&apos;s contract on overall cap position
            </span>
          )}
        </button>
        <div className="flex items-center gap-3">
          <Select value={yearsToShow} onValueChange={(v) => setYearsToShow(v as "1" | "2" | "3")}>
            <SelectTrigger className="h-7 w-[100px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Year</SelectItem>
              <SelectItem value="2">2 Years</SelectItem>
              <SelectItem value="3">3 Years</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground">
            This contract: <span className="font-medium text-foreground">{formatCurrency(currentContractTotal)}</span>
          </span>
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-1">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Content: Chart + Fiscal Year Breakdown */}
      {isExpanded && (
        <div className="flex flex-col">
          {/* Chart - Full Width */}
          <div className="p-4">
            <ChartContainer config={chartConfig} className="h-[240px] w-full">
              <AreaChart data={filteredChartData} margin={{ top: 10, right: 80, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="fillInReview" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(212, 95%, 68%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(212, 95%, 68%)" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="fillCurrentContract" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.15} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  tickFormatter={formatDateLabel}
                  className="text-xs"
                  tickMargin={8}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  className="text-xs"
                  tickFormatter={formatCurrency}
                  tickMargin={8}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, (dataMax: number) => Math.max(dataMax * 1.1, ANNUAL_CAP * 1.1)]}
                />
                
                {/* Annual Cap Reference Line */}
                <ReferenceLine
                  y={ANNUAL_CAP}
                  stroke="hsl(0, 84%, 60%)"
                  strokeWidth={1.5}
                  strokeDasharray="6 4"
                  label={{
                    value: "Cap ($20.5M)",
                    position: "right",
                    fill: "hsl(0, 84%, 60%)",
                    fontSize: 10,
                  }}
                />

                <ChartTooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length === 0) return null
                    const data = payload[0].payload
                    const overCap = data.total > ANNUAL_CAP
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-lg min-w-[200px]">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-sm">{formatDateLabel(data.month)}</p>
                          <span className="text-[10px] text-muted-foreground">{data.fy}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mb-2">Cumulative for fiscal year</p>
                        <div className="grid gap-1.5">
                          <div className="flex items-center gap-2 text-xs">
                            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "hsl(221, 83%, 53%)" }} />
                            <span className="text-muted-foreground">Active:</span>
                            <span className="font-medium ml-auto">{formatCurrencyFull(data.active)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "hsl(212, 95%, 68%)" }} />
                            <span className="text-muted-foreground">In Review:</span>
                            <span className="font-medium ml-auto">{formatCurrencyFull(data.inReview)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "hsl(142, 71%, 45%)" }} />
                            <span className="text-muted-foreground">This Contract:</span>
                            <span className="font-medium ml-auto">{formatCurrencyFull(data.currentContract)}</span>
                          </div>
                          <div className={cn(
                            "flex items-center gap-2 text-xs pt-1.5 mt-1 border-t",
                            overCap && "text-red-600 dark:text-red-400"
                          )}>
                            <span className="text-muted-foreground">Total:</span>
                            <span className={cn("font-bold ml-auto", overCap && "text-red-600 dark:text-red-400")}>
                              {formatCurrencyFull(data.total)}
                            </span>
                          </div>
                          {overCap && (
                            <div className="text-[10px] text-red-600 dark:text-red-400 text-right">
                              {formatCurrency(data.total - ANNUAL_CAP)} over cap
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  }}
                />
                
                {/* Stacked areas - order matters for stacking */}
                <Area
                  type="monotone"
                  dataKey="active"
                  stackId="1"
                  stroke="hsl(221, 83%, 53%)"
                  fill="url(#fillActive)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="inReview"
                  stackId="1"
                  stroke="hsl(212, 95%, 68%)"
                  fill="url(#fillInReview)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="currentContract"
                  stackId="1"
                  stroke="hsl(142, 71%, 45%)"
                  fill="url(#fillCurrentContract)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(221, 83%, 53%)" }} />
                <span className="text-muted-foreground">Active Contracts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(212, 95%, 68%)" }} />
                <span className="text-muted-foreground">In Review</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(142, 71%, 45%)" }} />
                <span className="text-muted-foreground">This Contract</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-0.5 bg-[hsl(0,84%,60%)]" style={{ borderStyle: "dashed" }} />
                <span className="text-muted-foreground">Cap Limit</span>
              </div>
            </div>
          </div>

          {/* Fiscal Year Breakdown - Horizontal Cards */}
          <div className="px-4 pb-4 pt-2 border-t bg-muted/10">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">
                Cap Period Breakdown
              </h4>
              <span className="text-[10px] text-muted-foreground">
                Annual cap: {formatCurrency(ANNUAL_CAP)} per fiscal year
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredFiscalYearSummaries.map((summary) => (
                <div 
                  key={summary.fy} 
                  className={cn(
                    "rounded-lg p-3 border",
                    summary.isOverCap 
                      ? "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/10" 
                      : "border-border bg-background"
                  )}
                >
                  <div className="mb-2">
                    <span className="text-sm font-semibold text-foreground">{summary.fyRange} Cap Period</span>
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
                    
                    <div className={cn(
                      "flex items-center justify-between pt-1.5 mt-1.5 border-t",
                      summary.isOverCap ? "border-red-200 dark:border-red-800" : "border-border"
                    )}>
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
                          : summary.remainingCap < ANNUAL_CAP * 0.1 
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-green-600 dark:text-green-500"
                      )}>
                        {summary.remainingCap >= 0 
                          ? formatCurrency(summary.remainingCap)
                          : `-${formatCurrency(Math.abs(summary.remainingCap))}`
                        }
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
