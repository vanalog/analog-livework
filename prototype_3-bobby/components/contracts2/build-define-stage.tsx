"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Building2, Handshake, Search, Calendar, Users, Sparkles, Pencil, FileText, Download, Info, Lock, Unlock } from "lucide-react"
import { useBuildContract, calculateCapPeriods, type ContractType, type PaymentFrequency, type ObligationBundle, type CapPeriod } from "@/lib/build-contract-context"
import { BuildStageProgress } from "./build-stage-progress"
import { cn } from "@/lib/utils"

// Mock sponsors data with categories
const mockSponsors = [
  { id: "sp1", name: "Nike", type: "National Brand" },
  { id: "sp2", name: "Gatorade", type: "National Brand" },
  { id: "sp3", name: "EA Sports", type: "National Brand" },
  { id: "sp4", name: "Beats by Dre", type: "National Brand" },
  { id: "sp5", name: "Red Bull", type: "National Brand" },
  { id: "sp6", name: "Columbus Auto Group", type: "Local Business" },
  { id: "sp7", name: "Buckeye State Bank", type: "Local Business" },
  { id: "sp8", name: "Huntington Bank", type: "Regional Business" },
  { id: "sp9", name: "John Smith", type: "Individual" },
  { id: "sp10", name: "Ohio Boosters Association", type: "Collective" },
  { id: "usg", name: "University Sports Group", type: "MMR Partner" },
]

// Mock athletes data for sponsor-initiated contracts
const mockAthletes = [
  { id: "osu-001", name: "Darius Thornton", sport: "Football", position: "Wide Receiver", year: "Sophomore" },
  { id: "osu-002", name: "Marcus Johnson", sport: "Football", position: "Quarterback", year: "Junior" },
  { id: "osu-003", name: "Tyler Williams", sport: "Men's Basketball", position: "Point Guard", year: "Senior" },
  { id: "osu-004", name: "Jordan Davis", sport: "Football", position: "Running Back", year: "Freshman" },
  { id: "osu-005", name: "Chris Martinez", sport: "Baseball", position: "Pitcher", year: "Junior" },
  { id: "osu-006", name: "Alex Thompson", sport: "Men's Basketball", position: "Center", year: "Sophomore" },
  { id: "osu-007", name: "Ryan Anderson", sport: "Football", position: "Linebacker", year: "Senior" },
  { id: "osu-008", name: "Jake Wilson", sport: "Soccer", position: "Forward", year: "Junior" },
]

// Obligation bundle definitions with descriptions
const obligationBundles: { value: ObligationBundle; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: "social",
    label: "Social Media",
    description: "Instagram, TikTok, and Twitter/X posts",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    value: "event",
    label: "Event/Appearance",
    description: "In-person appearances and photo shoots",
    icon: <Users className="w-5 h-5" />,
  },
  {
    value: "full-season",
    label: "Full Season",
    description: "Comprehensive social, events, and licensing",
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    value: "custom",
    label: "Custom",
    description: "Build obligations from scratch",
    icon: <Pencil className="w-5 h-5" />,
  },
]

// Type badge colors
const typeBadgeColors: Record<string, string> = {
  "National Brand": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  "Local Business": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "Regional Business": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  "Individual": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  "Collective": "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
  "MMR Partner": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
}

// $20.5M annual cap for D1 schools (per fiscal year)
const ANNUAL_CAP = 20500000

// Mock data for existing active & in-review contracts per fiscal year
const existingCapData: Record<string, number> = {
  "Jul '25 - Jun '26": 12700000, // Active + In Review for FY26
  "Jul '26 - Jun '27": 9200000,  // Active + In Review for FY27
  "Jul '27 - Jun '28": 5800000,  // Active + In Review for FY28
}

// NIL Marketing Budget data per calendar year
const IOI_BUDGET_YEARS = [
  { year: "2026", budget: 5000000, committed: 2100000 },
  { year: "2027", budget: 6000000, committed: 850000 },
  { year: "2028", budget: 6500000, committed: 0 },
]

// Get IOI budget info for a given year
function getIoiBudgetInfo(year: string) {
  return IOI_BUDGET_YEARS.find(b => b.year === year)
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
function CapPeriodImpactSidebar({ capPeriods }: { capPeriods: CapPeriod[] }) {
  const total = capPeriods.reduce((sum, cp) => sum + cp.amount, 0)
  
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
          const existingCommitted = existingCapData[period.label] || 0
          const thisContract = period.amount
          const totalCommitted = existingCommitted + thisContract
          const remainingCap = ANNUAL_CAP - totalCommitted
          const isOverCap = totalCommitted > ANNUAL_CAP
          const percentageUsed = (totalCommitted / ANNUAL_CAP) * 100
          
          return (
            <div
              key={period.id}
              className={cn(
                "rounded-lg border p-4 transition-colors",
                isOverCap 
                  ? "border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20" 
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
                  <span className="font-medium">{formatCurrency(existingCommitted)}</span>
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
                    {remainingCap >= 0 
                      ? formatCurrency(remainingCap)
                      : `-${formatCurrency(Math.abs(remainingCap))}`
                    }
                  </span>
                </div>
              </div>
              
              {/* Progress bar */}
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
                  {percentageUsed.toFixed(1)}% of ${(ANNUAL_CAP / 1000000).toFixed(1)}M cap
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// IOI Budget Impact Sidebar - shows a single card for the selected budget year
function IoiBudgetImpactSidebar({ budgetYear, indicatedAmount }: { budgetYear: string; indicatedAmount: number }) {
  const budgetInfo = getIoiBudgetInfo(budgetYear)
  if (!budgetInfo) return null
  
  const thisIndication = indicatedAmount
  const existingCommitted = budgetInfo.committed
  const totalCommitted = existingCommitted + thisIndication
  const remainingBudget = budgetInfo.budget - totalCommitted
  const isOverBudget = totalCommitted > budgetInfo.budget
  const percentageUsed = (totalCommitted / budgetInfo.budget) * 100
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Budget Impact
        </h3>
        <span className="text-xs text-muted-foreground">
          Indication: {formatCurrency(thisIndication)}
        </span>
      </div>
      
      <div
        className={cn(
          "rounded-lg border p-4 transition-colors",
          isOverBudget 
            ? "border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20" 
            : "border-border bg-background"
        )}
      >
        <div className="mb-3">
          <span className="text-base font-semibold text-foreground">{budgetYear}</span>
          {isOverBudget && (
            <span className="ml-2 text-xs font-medium text-red-600 dark:text-red-400">
              Over Budget
            </span>
          )}
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              This Indication
            </span>
            <span className="font-medium">{formatCurrency(thisIndication)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Committed & In Review</span>
            <span className="font-medium">{formatCurrency(existingCommitted)}</span>
          </div>
          
          <div className="h-px bg-border my-1" />
          
          <div className="flex items-center justify-between">
            <span className={cn(
              "font-medium",
              isOverBudget ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
            )}>
              Remaining Budget
            </span>
            <span className={cn(
              "font-bold",
              isOverBudget 
                ? "text-red-600 dark:text-red-400" 
                : "text-emerald-600 dark:text-emerald-400"
            )}>
              {remainingBudget >= 0 
                ? formatCurrency(remainingBudget)
                : `-${formatCurrency(Math.abs(remainingBudget))}`
              }
            </span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all",
                isOverBudget ? "bg-red-500" : "bg-emerald-500"
              )}
              style={{ width: `${Math.min(100, percentageUsed)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 text-right">
            {percentageUsed.toFixed(1)}% of {formatCurrency(budgetInfo.budget)} budget
          </p>
        </div>
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
  const [sponsorSearch, setSponsorSearch] = useState("")
  const [athleteSearch, setAthleteSearch] = useState("")

  // Determine if athlete was pre-selected (beneficiary page flow) vs needs selection (sponsor page flow)
  const athletePreSelected = Boolean(formData.athleteId && formData.athleteName)
  
  // Determine if counterparty was pre-selected (sponsor page flow)
  const counterpartyPreSelected = Boolean(formData.counterpartyId && formData.counterpartyName && formData.contractType === "nil-sponsorship")

  // Filter sponsors by search
  const filteredSponsors = mockSponsors.filter(s =>
    s.name.toLowerCase().includes(sponsorSearch.toLowerCase()) ||
    s.type.toLowerCase().includes(sponsorSearch.toLowerCase())
  )
  
  // Filter athletes by search
  const filteredAthletes = mockAthletes.filter(a =>
    a.name.toLowerCase().includes(athleteSearch.toLowerCase()) ||
    a.sport.toLowerCase().includes(athleteSearch.toLowerCase()) ||
    a.position.toLowerCase().includes(athleteSearch.toLowerCase())
  )

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
    // If counterparty was pre-selected (sponsor page flow), preserve it for NIL contracts
    const preserveCounterparty = counterpartyPreSelected && type === "nil-sponsorship"
    
    // Set default counterparty based on type
    let counterpartyId = ""
    let counterpartyName = ""
    
    if (type === "revenue-share") {
      counterpartyId = "school"
      counterpartyName = "The Ohio State University"
    } else if (type === "ioi") {
      counterpartyId = "usg"
      counterpartyName = "University Sports Group"
    } else if (preserveCounterparty) {
      counterpartyId = formData.counterpartyId
      counterpartyName = formData.counterpartyName
    }
    
    setFormData({
      contractType: type,
      counterpartyId,
      counterpartyName,
      // Reset obligation bundle when switching types
      obligationBundle: null,
    })
    setSponsorSearch("")
  }

  const handleSponsorChange = (sponsorId: string) => {
    const sponsor = mockSponsors.find(s => s.id === sponsorId)
    setFormData({
      counterpartyId: sponsorId,
      counterpartyName: sponsor?.name || "",
    })
  }
  
  const handleAthleteChange = (athleteId: string) => {
    const athlete = mockAthletes.find(a => a.id === athleteId)
    if (athlete) {
      setFormData({
        athleteId: athlete.id,
        athleteName: athlete.name,
        athleteDetail: `${athlete.sport} • ${athlete.position} • ${athlete.year}`,
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.contractType) {
      newErrors.contractType = "Please select a contract type"
    }
    
    // For revenue share, validate cap period totals instead of totalValue field
    if (formData.contractType === "revenue-share") {
      const capTotal = formData.capPeriods.reduce((sum, cp) => sum + cp.amount, 0)
      if (capTotal <= 0) {
        newErrors.capPeriods = "Please enter amounts for at least one cap period"
      }
    } else if (formData.contractType !== "revenue-share" && (!formData.totalValue || formData.totalValue <= 0)) {
      // For IOI and NIL Sponsorship, still require totalValue
      newErrors.totalValue = "Please enter a valid contract value"
    }
    
    // IOI only needs budget year, not start/end dates
    if (formData.contractType === "ioi") {
      if (!formData.budgetYear) {
        newErrors.budgetYear = "Please select a budget year"
      }
    } else {
      if (!formData.startDate) {
        newErrors.startDate = "Please select a start date"
      }
      if (!formData.endDate) {
        newErrors.endDate = "Please select an end date"
      }
      if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
        newErrors.endDate = "End date must be after start date"
      }
    }
    
    if (formData.contractType === "nil-sponsorship" && !formData.counterpartyId) {
      newErrors.counterparty = "Please select a sponsor"
    }
    if (formData.contractType === "nil-sponsorship" && !formData.obligationBundle) {
      newErrors.obligationBundle = "Please select an obligation bundle"
    }
    if (!formData.athleteId) {
      newErrors.athlete = "Please select an athlete"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      // For IOI, skip directly to export (no schedule generation needed)
      if (formData.contractType === "ioi") {
        setStage("export")
      } else {
        generateSchedule()
        setStage("generate")
      }
    }
  }

  // Custom IOI progress indicator (2 steps: Define, Export)
  const IoiStageProgress = () => (
    <div className="flex items-center gap-1 w-full max-w-xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-foreground bg-background">
          <FileText className="w-3.5 h-3.5 text-foreground" />
        </div>
        <span className="text-xs font-medium whitespace-nowrap text-foreground hidden sm:inline">Define</span>
      </div>
      <div className="flex-1 h-px mx-3 min-w-[24px] bg-muted-foreground/20" />
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-muted-foreground/30 bg-background">
          <Download className="w-3.5 h-3.5 text-muted-foreground/40" />
        </div>
        <span className="text-xs font-medium whitespace-nowrap text-muted-foreground/50 hidden sm:inline">Export</span>
      </div>
    </div>
  )

  // Check if we should show the cap period sidebar (revenue share)
  const showCapPeriodSidebar = formData.contractType === "revenue-share" &&
    formData.startDate &&
    formData.endDate &&
    formData.capPeriods.length > 0
    
  // Check if we should show the IOI budget sidebar
  const showIoiBudgetSidebar = formData.contractType === "ioi" &&
    formData.budgetYear &&
    formData.totalValue > 0

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Stage progress at top */}
      <div className="border-b px-6 py-4">
        {formData.contractType === "ioi" ? <IoiStageProgress /> : <BuildStageProgress currentStage="define" />}
      </div>

      {/* Form content with optional sidebar */}
      <div className={cn(
        "flex-1 flex py-8 px-4 gap-8 justify-center"
      )}>
        {/* Main form */}
        <div className="w-full max-w-xl space-y-6">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-foreground">
              {formData.contractType === "ioi" ? "Create Indication of Interest" : "Build Contract Schedule"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {formData.contractType === "ioi" 
                ? "Define the IOI parameters for the athlete" 
                : "Define the contract parameters to generate a payment schedule"}
            </p>
          </div>

          {/* Contract Type */}
          <div className="space-y-3">
            <Label>
              Contract Type <span className="text-destructive">*</span>
            </Label>
            {fromPlanning ? (
              // When coming from Planning, show Revenue Share as pre-selected and locked
              <div className="flex items-center gap-3 p-4 rounded-lg border-2 border-foreground bg-muted/50">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                  <Handshake className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">Revenue Share</p>
                  <p className="text-xs text-muted-foreground">
                    Scheduled payments from the Benefits Pool
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                  <Lock className="w-3 h-3" />
                  From Planning
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleContractTypeChange("revenue-share")}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all text-left",
                    formData.contractType === "revenue-share"
                      ? "border-foreground bg-muted/50"
                      : "border-border hover:border-foreground/30"
                  )}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                    <Handshake className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">Revenue Share</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Scheduled payments from the Benefits Pool
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleContractTypeChange("nil-sponsorship")}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all text-left",
                    formData.contractType === "nil-sponsorship"
                      ? "border-foreground bg-muted/50"
                      : "border-border hover:border-foreground/30"
                  )}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">NIL Sponsorship</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Deliverable-based payments funded by a sponsor
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleContractTypeChange("ioi")}
                  className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all text-left",
                    formData.contractType === "ioi"
                      ? "border-foreground bg-muted/50"
                      : "border-border hover:border-foreground/30"
                  )}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">NIL Indication of Interest</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Non-binding estimate of NIL earnings
                    </p>
                  </div>
                </button>
              </div>
            )}
            {errors.contractType && (
              <p className="text-sm text-destructive">{errors.contractType}</p>
            )}
          </div>

          {/* Athlete */}
          <div className="space-y-2">
            <Label>
              Athlete <span className="text-destructive">*</span>
            </Label>
            {athletePreSelected ? (
              // Read-only when athlete was pre-selected (beneficiary page flow)
              <div className="px-3 py-2 rounded-md border bg-muted/30">
                <p className="text-sm font-medium">{formData.athleteName}</p>
                {formData.athleteDetail && (
                  <p className="text-xs text-muted-foreground">{formData.athleteDetail}</p>
                )}
              </div>
            ) : (
              // Searchable dropdown when starting from sponsor page
              <>
                <Select value={formData.athleteId} onValueChange={handleAthleteChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Search or select an athlete..." />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 pb-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search athletes..."
                          value={athleteSearch}
                          onChange={e => setAthleteSearch(e.target.value)}
                          className="pl-8 h-8"
                        />
                      </div>
                    </div>
                    {filteredAthletes.length === 0 ? (
                      <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                        No athletes found
                      </div>
                    ) : (
                      filteredAthletes.map(athlete => (
                        <SelectItem key={athlete.id} value={athlete.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{athlete.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {athlete.sport} • {athlete.position} • {athlete.year}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.athlete && (
                  <p className="text-sm text-destructive">{errors.athlete}</p>
                )}
              </>
            )}
          </div>

          {/* Counterparty - only show for non-revenue-share contracts */}
          {formData.contractType !== "revenue-share" && (
          <div className="space-y-2">
            <Label>
              Counterparty <span className="text-destructive">*</span>
            </Label>
            {formData.contractType === "ioi" ? (
              <div className="px-3 py-2 rounded-md border bg-muted/30">
                <p className="text-sm font-medium">University Sports Group</p>
                <p className="text-xs text-muted-foreground">Multi-media rights partner</p>
              </div>
            ) : counterpartyPreSelected ? (
              // Read-only when sponsor was pre-selected (sponsor page flow)
              <div className="px-3 py-2 rounded-md border bg-muted/30">
                <p className="text-sm font-medium">{formData.counterpartyName}</p>
                <p className="text-xs text-muted-foreground">Pre-filled from sponsor page</p>
              </div>
            ) : (
              <>
                <Select value={formData.counterpartyId} onValueChange={handleSponsorChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Search or select a sponsor..." />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 pb-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search sponsors..."
                          value={sponsorSearch}
                          onChange={e => setSponsorSearch(e.target.value)}
                          className="pl-8 h-8"
                        />
                      </div>
                    </div>
                    {filteredSponsors.length === 0 ? (
                      <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                        No sponsors found
                      </div>
                    ) : (
                      filteredSponsors.map(sponsor => (
                        <SelectItem key={sponsor.id} value={sponsor.id}>
                          <div className="flex items-center gap-2">
                            <span>{sponsor.name}</span>
                            <span className={cn(
                              "text-xs px-1.5 py-0.5 rounded-full font-medium",
                              typeBadgeColors[sponsor.type] || "bg-muted text-muted-foreground"
                            )}>
                              {sponsor.type}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.counterparty && (
                  <p className="text-sm text-destructive">{errors.counterparty}</p>
                )}
              </>
            )}
          </div>
          )}

          {/* Total Value / Estimated NIL Value - Only for IOI and NIL Sponsorship (not revenue share) */}
          {formData.contractType !== "revenue-share" && (
            <div className="space-y-2">
              <Label htmlFor="totalValue">
                {formData.contractType === "ioi" ? "Estimated NIL Value ($)" : "Total Value ($)"} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="totalValue"
                type="text"
                placeholder="0"
                value={formData.totalValue ? formData.totalValue.toLocaleString() : ""}
                onChange={e => {
                  const rawValue = e.target.value.replace(/,/g, "")
                  const numValue = Number(rawValue)
                  if (!isNaN(numValue)) {
                    setFormData({ totalValue: numValue })
                  }
                }}
              />
              {errors.totalValue && (
                <p className="text-sm text-destructive">{errors.totalValue}</p>
              )}
            </div>
          )}

          {/* Date Fields - different for IOI vs other types */}
          {formData.contractType === "ioi" ? (
            <div className="space-y-2">
              <Label htmlFor="budgetYear">
                Budget Year <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.budgetYear || ""}
                onValueChange={(value) => setFormData({ budgetYear: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select budget year" />
                </SelectTrigger>
                <SelectContent>
                  {IOI_BUDGET_YEARS.map((item) => (
                    <SelectItem key={item.year} value={item.year}>
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>{item.year}</span>
                        <span className="text-muted-foreground text-xs">
                          Budget: {formatCurrency(item.budget)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.budgetYear && (
                <p className="text-sm text-destructive">{errors.budgetYear}</p>
              )}
            </div>
          ) : (
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
          )}

          {/* Payment Frequency (Revenue Share only) */}
          {formData.contractType === "revenue-share" && (
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
          )}
          
          {/* Cap Period Allocation (Revenue Share only, shown when dates are entered) */}
          {formData.contractType === "revenue-share" && formData.startDate && formData.endDate && formData.capPeriods.length > 0 && (
            <CapPeriodAllocationWithImpact
              capPeriods={formData.capPeriods}
              onAmountChange={handleCapPeriodAmountChange}
              errors={errors}
            />
          )}

          {/* Obligation Bundle (NIL Sponsorship only) */}
          {formData.contractType === "nil-sponsorship" && (
            <div className="space-y-3">
                <Label>
                  Obligation Bundle <span className="text-destructive">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {obligationBundles.map(bundle => (
                    <button
                      key={bundle.value}
                      type="button"
                      onClick={() => setFormData({ obligationBundle: bundle.value })}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border-2 transition-all text-left",
                        formData.obligationBundle === bundle.value
                          ? "border-foreground bg-muted/50"
                          : "border-border hover:border-foreground/30"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0",
                        formData.obligationBundle === bundle.value
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground"
                      )}>
                        {bundle.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{bundle.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {bundle.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.obligationBundle && (
                <p className="text-sm text-destructive">{errors.obligationBundle}</p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="gap-2">
              {formData.contractType === "ioi" ? "Continue" : "Generate Schedule"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Cap Period Impact Sidebar - only for revenue share with dates set */}
        {showCapPeriodSidebar && (
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <CapPeriodImpactSidebar capPeriods={formData.capPeriods} />
            </div>
          </div>
        )}
        
        {/* IOI Budget Impact Sidebar - only for IOI with budget year selected */}
        {showIoiBudgetSidebar && (
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <IoiBudgetImpactSidebar 
                budgetYear={formData.budgetYear!} 
                indicatedAmount={formData.totalValue} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
