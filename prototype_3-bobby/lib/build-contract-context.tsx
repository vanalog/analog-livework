"use client"

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type BuildContractStage = "define" | "generate" | "review" | "export"

export type ContractType = "revenue-share" | "nil-sponsorship" | "ioi"
export type PaymentStrategy = "front-loaded" | "flat" | "back-loaded" | "custom"
export type PaymentFrequency = "bi-weekly" | "monthly" | "quarterly"
export type ObligationBundle = "social" | "event" | "full-season" | "custom"

export interface CapPeriod {
  id: string
  label: string
  startDate: string
  endDate: string
  amount: number
  percentage: number
  locked: boolean
}
export type ObligationTrigger = "on-completion" | "on-signature" | "milestone" | "custom"
export type ObligationStatus = "pending" | "in-progress" | "completed" | "overdue"

export interface BuildContractFormData {
  contractType: ContractType | null
  athleteId: string
  athleteName: string
  athleteDetail: string
  counterpartyId: string
  counterpartyName: string
  totalValue: number
  startDate: string
  endDate: string
  paymentStrategy: PaymentStrategy
  paymentFrequency: PaymentFrequency
  ioiReference: string
  obligationBundle: ObligationBundle | null
  capPeriods: CapPeriod[]
  // IOI specific fields
  agreementDate: string
  budgetYear: string
}

export interface GeneratedPayment {
  id: string
  date: string
  amount: number
  type: string
  capPeriod: string
  fiscalYear: string
  capApplicable: boolean
  edited: boolean
}

export interface GeneratedObligation {
  id: string
  type: string
  description: string
  dueDate: string
  direction: string
  quantity: string
  paymentAmount: number
  trigger: ObligationTrigger
  status: ObligationStatus
  edited: boolean
}

export interface BuildContractState {
  stage: BuildContractStage
  formData: BuildContractFormData
  payments: GeneratedPayment[]
  conditionalPayments: GeneratedPayment[]
  obligations: GeneratedObligation[]
  scheduleTotal: number
}

interface BuildContractContextValue {
  state: BuildContractState
  setStage: (stage: BuildContractStage) => void
  setFormData: (data: Partial<BuildContractFormData>) => void
  setPayments: (payments: GeneratedPayment[]) => void
  updatePayment: (id: string, updates: Partial<GeneratedPayment>) => void
  addPayment: (payment: GeneratedPayment) => void
  deletePayment: (id: string) => void
  reorderPayments: (activeId: string, overId: string) => void
  setConditionalPayments: (payments: GeneratedPayment[]) => void
  updateConditionalPayment: (id: string, updates: Partial<GeneratedPayment>) => void
  addConditionalPayment: (payment: GeneratedPayment) => void
  deleteConditionalPayment: (id: string) => void
  setObligations: (obligations: GeneratedObligation[]) => void
  updateObligation: (id: string, updates: Partial<GeneratedObligation>) => void
  addObligation: (obligation: GeneratedObligation) => void
  deleteObligation: (id: string) => void
  resetBuildWorkflow: () => void
  generateSchedule: () => void
}

const initialFormData: BuildContractFormData = {
  contractType: null,
  athleteId: "",
  athleteName: "",
  athleteDetail: "",
  counterpartyId: "",
  counterpartyName: "",
  totalValue: 0,
  startDate: "",
  endDate: "",
  paymentStrategy: "flat",
  paymentFrequency: "monthly",
  ioiReference: "",
  obligationBundle: null,
  capPeriods: [],
  agreementDate: "",
  budgetYear: "",
  }

const initialState: BuildContractState = {
  stage: "define",
  formData: initialFormData,
  payments: [],
  conditionalPayments: [],
  obligations: [],
  scheduleTotal: 0,
}

const BuildContractContext = createContext<BuildContractContextValue | null>(null)

// Helper to calculate cap periods from start and end dates
// Now defaults to 0 amounts - user enters amounts directly per cap period
export function calculateCapPeriods(startDate: string, endDate: string, existingCapPeriods?: CapPeriod[]): CapPeriod[] {
  if (!startDate || !endDate) return []
  
  const start = new Date(startDate + "T00:00:00")
  const end = new Date(endDate + "T00:00:00")
  
  const capPeriods: CapPeriod[] = []
  
  // Find the first cap period that contains the start date
  // Cap periods run July 1 - June 30
  let currentYear = start.getFullYear()
  let capStart: Date
  
  // If start is July or later, cap period starts this July
  // If start is before July, cap period started previous July
  if (start.getMonth() >= 6) { // July = 6
    capStart = new Date(currentYear, 6, 1) // July 1 of current year
  } else {
    capStart = new Date(currentYear - 1, 6, 1) // July 1 of previous year
  }
  
  let periodIndex = 0
  
  while (capStart <= end) {
    const capEnd = new Date(capStart.getFullYear() + 1, 5, 30) // June 30 of next year
    
    // Check if this cap period overlaps with contract dates
    if (capEnd >= start && capStart <= end) {
      const startYear = capStart.getFullYear().toString().slice(-2)
      const endYear = (capStart.getFullYear() + 1).toString().slice(-2)
      const periodId = `cap-${periodIndex}`
      
      // Preserve existing amount if we have it
      const existingPeriod = existingCapPeriods?.find(ep => ep.id === periodId)
      
      capPeriods.push({
        id: periodId,
        label: `Jul '${startYear} - Jun '${endYear}`,
        startDate: capStart.toISOString().split("T")[0],
        endDate: capEnd.toISOString().split("T")[0],
        amount: existingPeriod?.amount ?? 0,
        percentage: 0, // Will be calculated when displaying
        locked: existingPeriod?.locked ?? false,
      })
      periodIndex++
    }
    
    // Move to next cap period
    capStart = new Date(capStart.getFullYear() + 1, 6, 1)
  }
  
  return capPeriods
}

// Helper to get fiscal year from date
function getFiscalYear(dateStr: string): string {
  if (!dateStr) return ""
  const d = new Date(dateStr + "T00:00:00")
  const m = d.getMonth()
  const y = d.getFullYear()
  return m >= 6 ? `FY${(y + 1).toString().slice(-2)}` : `FY${y.toString().slice(-2)}`
}

// Helper to get cap period from date
function getCapPeriod(dateStr: string): string {
  if (!dateStr) return ""
  const d = new Date(dateStr + "T00:00:00")
  const m = d.getMonth()
  const y = d.getFullYear()
  if (m >= 6) {
    const startYear = y.toString().slice(-2)
    const endYear = (y + 1).toString().slice(-2)
    return `7/1/${startYear}-6/30/${endYear}`
  } else {
    const startYear = (y - 1).toString().slice(-2)
    const endYear = y.toString().slice(-2)
    return `7/1/${startYear}-6/30/${endYear}`
  }
}

// Generate payment schedule based on form data
// For NIL Sponsorship: No scheduled payments - payments are tied to obligations
// For Revenue Share: Generate scheduled payments based on cap period allocations and frequency
function generatePaymentSchedule(formData: BuildContractFormData): GeneratedPayment[] {
  if (!formData.startDate || !formData.endDate) return []
  
  // For revenue share, calculate total from cap periods
  const totalValue = formData.contractType === "revenue-share"
    ? formData.capPeriods.reduce((sum, cp) => sum + cp.amount, 0)
    : formData.totalValue
    
  if (totalValue <= 0) return []
  
  // NIL Sponsorship contracts do NOT have scheduled payments
  // Payments are distributed across obligation deliverables instead
  if (formData.contractType === "nil-sponsorship") {
    return []
  }

  const payments: GeneratedPayment[] = []
  let paymentIndex = 1
  
  // Get payment interval based on frequency
  const getPaymentInterval = (frequency: PaymentFrequency): number => {
    switch (frequency) {
      case "bi-weekly": return 14 // days
      case "monthly": return 1 // months
      case "quarterly": return 3 // months
      default: return 1
    }
  }
  
  // If no cap periods defined, calculate them now
  const capPeriods = formData.capPeriods.length > 0 
    ? formData.capPeriods 
    : calculateCapPeriods(formData.startDate, formData.endDate)
  
  // For each cap period, generate payments based on frequency
  for (const capPeriod of capPeriods) {
    if (capPeriod.amount <= 0) continue
    
    // Determine the effective start and end dates within this cap period
    const contractStart = new Date(formData.startDate + "T00:00:00")
    const contractEnd = new Date(formData.endDate + "T00:00:00")
    const capStart = new Date(capPeriod.startDate + "T00:00:00")
    const capEnd = new Date(capPeriod.endDate + "T00:00:00")
    
    const effectiveStart = new Date(Math.max(contractStart.getTime(), capStart.getTime()))
    const effectiveEnd = new Date(Math.min(contractEnd.getTime(), capEnd.getTime()))
    
    // Calculate number of payments in this cap period
    let numPayments: number
    const interval = getPaymentInterval(formData.paymentFrequency)
    
    if (formData.paymentFrequency === "bi-weekly") {
      const days = Math.ceil((effectiveEnd.getTime() - effectiveStart.getTime()) / (24 * 60 * 60 * 1000))
      numPayments = Math.max(1, Math.ceil(days / interval))
    } else {
      const months = (effectiveEnd.getFullYear() - effectiveStart.getFullYear()) * 12 + 
                    (effectiveEnd.getMonth() - effectiveStart.getMonth()) + 1
      numPayments = Math.max(1, Math.ceil(months / interval))
    }
    
    // Distribute cap period amount across payments
    const paymentAmount = Math.floor(capPeriod.amount / numPayments)
    let remainingAmount = capPeriod.amount
    
    for (let i = 0; i < numPayments; i++) {
      let paymentDate: Date
      
      if (formData.paymentFrequency === "bi-weekly") {
        paymentDate = new Date(effectiveStart)
        paymentDate.setDate(paymentDate.getDate() + (i * interval))
      } else {
        paymentDate = new Date(effectiveStart)
        paymentDate.setMonth(paymentDate.getMonth() + (i * interval))
      }
      
      // Ensure payment date doesn't exceed effective end
      if (paymentDate > effectiveEnd) break
      
      const amount = i === numPayments - 1 ? remainingAmount : paymentAmount
      remainingAmount -= amount
      
      const dateStr = paymentDate.toISOString().split("T")[0]
      
      payments.push({
        id: `gen-payment-${paymentIndex}`,
        date: dateStr,
        amount,
        type: "License Fee",
        capPeriod: getCapPeriod(dateStr),
        fiscalYear: getFiscalYear(dateStr),
        capApplicable: true,
        edited: false,
      })
      
      paymentIndex++
    }
  }

  return payments
}

// Bundle templates for NIL sponsorship obligations
const OBLIGATION_BUNDLES: Record<ObligationBundle, Omit<GeneratedObligation, "id" | "dueDate" | "edited">[]> = {
  social: [
    { type: "Social Media", description: "Instagram collab post", direction: "Athlete → Sponsor", quantity: "2 posts", paymentAmount: 500, trigger: "on-completion", status: "pending" },
    { type: "Social Media", description: "TikTok video mention", direction: "Athlete → Sponsor", quantity: "1 video", paymentAmount: 750, trigger: "on-completion", status: "pending" },
    { type: "Social Media", description: "Twitter/X engagement post", direction: "Athlete → Sponsor", quantity: "2 posts", paymentAmount: 250, trigger: "on-completion", status: "pending" },
  ],
  event: [
    { type: "Appearance", description: "In-person appearance at sponsor event", direction: "Athlete → Sponsor", quantity: "1 appearance", paymentAmount: 2000, trigger: "on-completion", status: "pending" },
    { type: "Appearance", description: "Meet & greet session", direction: "Athlete → Sponsor", quantity: "1 session (2 hrs)", paymentAmount: 1500, trigger: "on-completion", status: "pending" },
    { type: "Content", description: "Photo/video shoot for marketing", direction: "Athlete → Sponsor", quantity: "1 shoot", paymentAmount: 1000, trigger: "on-completion", status: "pending" },
  ],
  "full-season": [
    { type: "Social Media", description: "Monthly Instagram posts", direction: "Athlete → Sponsor", quantity: "12 posts", paymentAmount: 3000, trigger: "on-completion", status: "pending" },
    { type: "Social Media", description: "Game day stories/content", direction: "Athlete → Sponsor", quantity: "24 stories", paymentAmount: 2400, trigger: "on-completion", status: "pending" },
    { type: "Appearance", description: "Quarterly sponsor events", direction: "Athlete → Sponsor", quantity: "4 appearances", paymentAmount: 6000, trigger: "on-completion", status: "pending" },
    { type: "Content", description: "Autographed merchandise", direction: "Athlete → Sponsor", quantity: "100 items", paymentAmount: 2000, trigger: "on-completion", status: "pending" },
    { type: "Licensing", description: "Name/image/likeness usage rights", direction: "Athlete → Sponsor", quantity: "Season duration", paymentAmount: 5000, trigger: "on-signature", status: "pending" },
  ],
  custom: [],
}

// Generate obligations for NIL sponsorship based on bundle selection
// Distributes the total contract value proportionally across obligation payment amounts
function generateObligations(formData: BuildContractFormData): GeneratedObligation[] {
  if (formData.contractType !== "nil-sponsorship") return []
  if (!formData.obligationBundle) return []
  
  const bundleTemplate = OBLIGATION_BUNDLES[formData.obligationBundle]
  
  // If no obligations in bundle (custom), return empty
  if (bundleTemplate.length === 0) return []
  
  // Calculate total of template payment amounts for proportional distribution
  const templateTotal = bundleTemplate.reduce((sum, obl) => sum + obl.paymentAmount, 0)
  
  // Distribute the total contract value proportionally across obligations
  let remainingValue = formData.totalValue
  
  return bundleTemplate.map((obl, index) => {
    // Calculate proportional amount based on template weights
    let paymentAmount: number
    if (index === bundleTemplate.length - 1) {
      // Last obligation gets remaining value to avoid rounding issues
      paymentAmount = remainingValue
    } else {
      // Proportional distribution based on template amounts
      paymentAmount = Math.floor((obl.paymentAmount / templateTotal) * formData.totalValue)
      remainingValue -= paymentAmount
    }
    
    return {
      ...obl,
      paymentAmount,
      id: `gen-obl-${index + 1}`,
      dueDate: formData.endDate,
      edited: false,
    }
  })
}

export function BuildContractProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BuildContractState>(initialState)

  const setStage = useCallback((stage: BuildContractStage) => {
    setState(prev => ({ ...prev, stage }))
  }, [])

  const setFormData = useCallback((data: Partial<BuildContractFormData>) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...data },
    }))
  }, [])

  const setPayments = useCallback((payments: GeneratedPayment[]) => {
    const total = payments.reduce((sum, p) => sum + p.amount, 0)
    setState(prev => ({ ...prev, payments, scheduleTotal: total + prev.conditionalPayments.reduce((s, p) => s + p.amount, 0) }))
  }, [])

  const updatePayment = useCallback((id: string, updates: Partial<GeneratedPayment>) => {
    setState(prev => {
      const payments = prev.payments.map(p => p.id === id ? { ...p, ...updates, edited: true } : p)
      const total = payments.reduce((sum, p) => sum + p.amount, 0) + prev.conditionalPayments.reduce((s, p) => s + p.amount, 0)
      return { ...prev, payments, scheduleTotal: total }
    })
  }, [])

  const addPayment = useCallback((payment: GeneratedPayment) => {
    setState(prev => {
      const payments = [...prev.payments, payment]
      const total = payments.reduce((sum, p) => sum + p.amount, 0) + prev.conditionalPayments.reduce((s, p) => s + p.amount, 0)
      return { ...prev, payments, scheduleTotal: total }
    })
  }, [])

  const deletePayment = useCallback((id: string) => {
    setState(prev => {
      const payments = prev.payments.filter(p => p.id !== id)
      const total = payments.reduce((sum, p) => sum + p.amount, 0) + prev.conditionalPayments.reduce((s, p) => s + p.amount, 0)
      return { ...prev, payments, scheduleTotal: total }
    })
  }, [])

  const reorderPayments = useCallback((activeId: string, overId: string) => {
    setState(prev => {
      const oldIndex = prev.payments.findIndex(p => p.id === activeId)
      const newIndex = prev.payments.findIndex(p => p.id === overId)
      if (oldIndex === -1 || newIndex === -1) return prev
      
      const newPayments = [...prev.payments]
      const [removed] = newPayments.splice(oldIndex, 1)
      newPayments.splice(newIndex, 0, removed)
      
      return { ...prev, payments: newPayments }
    })
  }, [])

  const setConditionalPayments = useCallback((conditionalPayments: GeneratedPayment[]) => {
    setState(prev => {
      const total = prev.payments.reduce((sum, p) => sum + p.amount, 0) + conditionalPayments.reduce((s, p) => s + p.amount, 0)
      return { ...prev, conditionalPayments, scheduleTotal: total }
    })
  }, [])

  const updateConditionalPayment = useCallback((id: string, updates: Partial<GeneratedPayment>) => {
    setState(prev => {
      const conditionalPayments = prev.conditionalPayments.map(p => p.id === id ? { ...p, ...updates, edited: true } : p)
      const total = prev.payments.reduce((sum, p) => sum + p.amount, 0) + conditionalPayments.reduce((s, p) => s + p.amount, 0)
      return { ...prev, conditionalPayments, scheduleTotal: total }
    })
  }, [])

  const addConditionalPayment = useCallback((payment: GeneratedPayment) => {
    setState(prev => {
      const conditionalPayments = [...prev.conditionalPayments, payment]
      const total = prev.payments.reduce((sum, p) => sum + p.amount, 0) + conditionalPayments.reduce((s, p) => s + p.amount, 0)
      return { ...prev, conditionalPayments, scheduleTotal: total }
    })
  }, [])

  const deleteConditionalPayment = useCallback((id: string) => {
    setState(prev => {
      const conditionalPayments = prev.conditionalPayments.filter(p => p.id !== id)
      const total = prev.payments.reduce((sum, p) => sum + p.amount, 0) + conditionalPayments.reduce((s, p) => s + p.amount, 0)
      return { ...prev, conditionalPayments, scheduleTotal: total }
    })
  }, [])

  const setObligations = useCallback((obligations: GeneratedObligation[]) => {
    setState(prev => ({ ...prev, obligations }))
  }, [])

  const updateObligation = useCallback((id: string, updates: Partial<GeneratedObligation>) => {
    setState(prev => ({
      ...prev,
      obligations: prev.obligations.map(o => o.id === id ? { ...o, ...updates, edited: true } : o),
    }))
  }, [])

  const addObligation = useCallback((obligation: GeneratedObligation) => {
    setState(prev => ({ ...prev, obligations: [...prev.obligations, obligation] }))
  }, [])

  const deleteObligation = useCallback((id: string) => {
    setState(prev => ({ ...prev, obligations: prev.obligations.filter(o => o.id !== id) }))
  }, [])

  const generateSchedule = useCallback(() => {
    setState(prev => {
      const payments = generatePaymentSchedule(prev.formData)
      const obligations = generateObligations(prev.formData)
      
      // For NIL Sponsorship, generate conditional payments tied to each deliverable
      // Distribute payment dates evenly throughout the contract period for better chart visualization
      let conditionalPayments: GeneratedPayment[] = []
      if (prev.formData.contractType === "nil-sponsorship" && obligations.length > 0) {
        const startDate = new Date(prev.formData.startDate + "T00:00:00")
        const endDate = new Date(prev.formData.endDate + "T00:00:00")
        const totalDays = Math.max(1, (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))
        
        // Distribute payments evenly across the contract period
        const interval = totalDays / obligations.length
        
        conditionalPayments = obligations.map((obl, index) => {
          // Calculate evenly distributed date for this payment
          const daysFromStart = Math.floor(interval * (index + 1))
          const paymentDate = new Date(startDate)
          paymentDate.setDate(paymentDate.getDate() + daysFromStart)
          const dateStr = paymentDate.toISOString().split("T")[0]
          
          return {
            id: `cond-payment-${index + 1}`,
            date: dateStr,
            amount: obl.paymentAmount,
            type: `Deliverable: ${obl.description}`,
            capPeriod: getCapPeriod(dateStr),
            fiscalYear: getFiscalYear(dateStr),
            capApplicable: false, // NIL payments are NOT cap applicable
            edited: false,
          }
        })
      }
      
      // For NIL Sponsorship, total comes from conditional payments (tied to deliverables)
      // For Revenue Share, total comes from scheduled payments
      const total = prev.formData.contractType === "nil-sponsorship"
        ? conditionalPayments.reduce((sum, p) => sum + p.amount, 0)
        : payments.reduce((sum, p) => sum + p.amount, 0)
      
      return {
        ...prev,
        payments,
        obligations,
        scheduleTotal: total,
        conditionalPayments,
      }
    })
  }, [])

  const resetBuildWorkflow = useCallback(() => {
    setState(initialState)
  }, [])

  return (
    <BuildContractContext.Provider value={{
      state,
      setStage,
      setFormData,
      setPayments,
      updatePayment,
      addPayment,
      deletePayment,
      reorderPayments,
      setConditionalPayments,
      updateConditionalPayment,
      addConditionalPayment,
      deleteConditionalPayment,
      setObligations,
      updateObligation,
      addObligation,
      deleteObligation,
      resetBuildWorkflow,
      generateSchedule,
    }}>
      {children}
    </BuildContractContext.Provider>
  )
}

export function useBuildContract() {
  const ctx = useContext(BuildContractContext)
  if (!ctx) throw new Error("useBuildContract must be used within BuildContractProvider")
  return ctx
}
