"use client"

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type WorkflowStage = "upload" | "processing" | "review" | "activation"

export interface ContractUploadData {
  athleteId: string
  athleteName: string
  athleteDetail: string
  contractType: string
  fileName: string
  notes: string
  contractId: string
}

export interface ExtractedParty {
  id: string
  name: string
  firstName: string
  lastName: string
  role: string
  entityType: "Person" | "Organization"
  confidence: "high" | "medium" | "low"
  reviewed: boolean
  edited: boolean
}

export interface ExtractedExchange {
  id: string
  amount: number
  dateTrigger: string
  cadence: string
  type?: string
  capApplicable?: boolean
  confidence: "high" | "medium" | "low"
  reviewed: boolean
  edited: boolean
}

export type ObligationStatus = "Pending" | "Verified" | "Waived" | "Failed"

export interface ExtractedObligation {
  id: string
  description: string
  dueDate: string
  verificationMethod: string
  status: ObligationStatus
  paymentGated: boolean
  linkedExchangeId: string | null
  edited: boolean
}

export interface ExtractedDeliverable {
  id: string
  description: string
  direction: string // e.g. "Athlete → Sponsor"
  quantity: string // e.g. "8 posts"
  deadline: string
  confidence: "high" | "medium" | "low"
  edited: boolean
}

export interface ExtractedTerm {
  id: string
  description: string
  direction: string // e.g. "Mutual", "Athlete → Sponsor"
  duration: "Term" | "Post-term" | "N/A"
  confidence: "high" | "medium" | "low"
  edited: boolean
}

export interface WorkflowState {
  stage: WorkflowStage
  uploadData: ContractUploadData | null
  parties: ExtractedParty[]
  exchanges: ExtractedExchange[]
  obligations: ExtractedObligation[]
  deliverables: ExtractedDeliverable[]
  terms: ExtractedTerm[]
  statedTotal: number
  isActivated: boolean
}

interface WorkflowContextValue {
  state: WorkflowState
  setStage: (stage: WorkflowStage) => void
  setUploadData: (data: ContractUploadData) => void
  setParties: (parties: ExtractedParty[]) => void
  updateParty: (id: string, updates: Partial<ExtractedParty>) => void
  setExchanges: (exchanges: ExtractedExchange[]) => void
  updateExchange: (id: string, updates: Partial<ExtractedExchange>) => void
  addExchange: (exchange: ExtractedExchange) => void
  deleteExchange: (id: string) => void
  setObligations: (obligations: ExtractedObligation[]) => void
  updateObligation: (id: string, updates: Partial<ExtractedObligation>) => void
  addObligation: (obligation: ExtractedObligation) => void
  deleteObligation: (id: string) => void
  setDeliverables: (deliverables: ExtractedDeliverable[]) => void
  updateDeliverable: (id: string, updates: Partial<ExtractedDeliverable>) => void
  addDeliverable: (deliverable: ExtractedDeliverable) => void
  deleteDeliverable: (id: string) => void
  setTerms: (terms: ExtractedTerm[]) => void
  updateTerm: (id: string, updates: Partial<ExtractedTerm>) => void
  addTerm: (term: ExtractedTerm) => void
  deleteTerm: (id: string) => void
  activateContract: () => void
  resetWorkflow: () => void
}

// Demo data derived from standardized dataset
import {
  demoParties as rawParties,
  demoScheduledPayments,
  demoOffSchedulePayments,
  demoObligations as rawObligations,
  demoContract,
  GRAND_TOTAL,
} from "@/lib/demo-contract-data"

const mockParties: ExtractedParty[] = [
  { id: "p1", name: rawParties[1].name, firstName: "Marcus", lastName: "Williams", role: "Beneficiary", entityType: "Person", confidence: "high", reviewed: true, edited: false },
  { id: "p2", name: rawParties[0].name, firstName: "The Ohio State", lastName: "University", role: "Source", entityType: "Organization", confidence: "high", reviewed: true, edited: false },
]

// Map a representative set of exchanges: signing bonus + first 6 scheduled + 2 off-schedule triggers
const mockExchanges: ExtractedExchange[] = [
  { id: "e-os1", amount: demoOffSchedulePayments[0].amount, dateTrigger: demoOffSchedulePayments[0].earliestDate, cadence: "One-time", type: demoOffSchedulePayments[0].name, confidence: "high", reviewed: true, edited: false },
  ...demoScheduledPayments.map((sp, i) => ({
    id: `e-sp${i + 1}`,
    amount: sp.amount,
    dateTrigger: sp.date,
    cadence: "Monthly" as const,
    type: "License Fee" as string,
    confidence: "medium" as const,
    reviewed: false,
    edited: false,
  })),
  { id: "e-os2", amount: demoOffSchedulePayments[1].amount, dateTrigger: demoOffSchedulePayments[1].earliestDate, cadence: "Conditional", type: demoOffSchedulePayments[1].name, confidence: "medium" as const, reviewed: false, edited: false },
  { id: "e-os3", amount: demoOffSchedulePayments[2].amount, dateTrigger: demoOffSchedulePayments[2].earliestDate, cadence: "Conditional", type: demoOffSchedulePayments[2].name, confidence: "medium" as const, reviewed: false, edited: false },
]

const mockObligations: ExtractedObligation[] = []

const mockDeliverables: ExtractedDeliverable[] = [
  { id: "d1", description: "Social media posts (collab posts)", direction: "Athlete \u2192 Sponsor", quantity: "8 posts", deadline: "2027-01-30", confidence: "high", edited: false },
  { id: "d2", description: "Media production time", direction: "Athlete \u2192 Sponsor", quantity: "6 hours", deadline: "2027-01-30", confidence: "high", edited: false },
  { id: "d3", description: "In-person appearances", direction: "Athlete \u2192 Sponsor", quantity: "2 appearances", deadline: "2027-01-30", confidence: "medium", edited: false },
  { id: "d4", description: "Autographed items", direction: "Athlete \u2192 Sponsor", quantity: "200 items", deadline: "2027-01-30", confidence: "high", edited: false },
]

const mockTerms: ExtractedTerm[] = [
  { id: "t1", description: "Athlete must maintain full-time student status (minimum 12 credit hours per semester) throughout the contract term", direction: "Athlete", duration: "Term", confidence: "high", edited: false },
  { id: "t2", description: "Athlete must maintain NCAA eligibility throughout the term. Any loss of eligibility triggers immediate suspension of all scheduled and off-schedule payments.", direction: "Athlete", duration: "Term", confidence: "high", edited: false },
  { id: "t3", description: "Athlete must comply with all policies, rules, and codes of conduct of Ohio State, the Big Ten Conference, the NCAA, and the College Sports Commission (CSC)", direction: "Athlete", duration: "Term", confidence: "high", edited: false },
  { id: "t4", description: "Athlete must report any third-party NIL deal valued at $600 or more to the Institution and to the designated Reporting System. Failure to report is a material breach.", direction: "Athlete", duration: "Term", confidence: "high", edited: false },
  { id: "t5", description: "Athlete must not engage in conduct harmful to reputation. Prohibited NIL categories include: alcohol, tobacco, e-cigarettes, gambling, adult entertainment.", direction: "Athlete", duration: "Term", confidence: "high", edited: false },
  { id: "t6", description: "Athlete may not use or authorize use of their NIL in connection with any other college or university during the contract term", direction: "Athlete", duration: "Term", confidence: "high", edited: false },
  { id: "t7", description: "If the Athlete enters the NCAA transfer portal or transfers to another institution, Ohio State may seek prorated reimbursement of amounts already paid.", direction: "Mutual", duration: "Term", confidence: "medium", edited: false },
  { id: "t8", description: "Terms and conditions of this agreement may not be disclosed to any third party without Ohio State's prior written approval. Exception: disclosure to parents, guardians, attorneys, and advisors.", direction: "Mutual", duration: "Post-term", confidence: "high", edited: false },
  { id: "t9", description: "NCAA / conference / institutional compliance", direction: "Mutual", duration: "Term", confidence: "high", edited: false },
  { id: "t10", description: "Indemnification", direction: "Mutual", duration: "Term", confidence: "high", edited: false },
  { id: "t11", description: "NIL license grant (royalty-free, approval-based)", direction: "Athlete \u2192 Sponsor", duration: "Term", confidence: "medium", edited: false },
  { id: "t12", description: "No conflicting endorsements / morals clause", direction: "Mutual", duration: "Term", confidence: "high", edited: false },
  { id: "t13", description: "Governing law & venue", direction: "Mutual", duration: "N/A", confidence: "high", edited: false },
  { id: "t14", description: "Institutional NIL reporting obligation", direction: "Athlete \u2192 University", duration: "Term", confidence: "high", edited: false },
]

const initialState: WorkflowState = {
  stage: "upload",
  uploadData: null,
  parties: mockParties,
  exchanges: mockExchanges,
  obligations: mockObligations,
  deliverables: mockDeliverables,
  terms: mockTerms,
  statedTotal: GRAND_TOTAL,
  isActivated: false,
}

const WorkflowContext = createContext<WorkflowContextValue | null>(null)

export function ContractWorkflowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WorkflowState>(initialState)

  const setStage = useCallback((stage: WorkflowStage) => {
    setState(prev => ({ ...prev, stage }))
  }, [])

  const setUploadData = useCallback((data: ContractUploadData) => {
    setState(prev => ({ ...prev, uploadData: data }))
  }, [])

  const setParties = useCallback((parties: ExtractedParty[]) => {
    setState(prev => ({ ...prev, parties }))
  }, [])

  const updateParty = useCallback((id: string, updates: Partial<ExtractedParty>) => {
    setState(prev => ({
      ...prev,
      parties: prev.parties.map(p => p.id === id ? { ...p, ...updates } : p),
    }))
  }, [])

  const setExchanges = useCallback((exchanges: ExtractedExchange[]) => {
    setState(prev => ({ ...prev, exchanges }))
  }, [])

  const updateExchange = useCallback((id: string, updates: Partial<ExtractedExchange>) => {
    setState(prev => ({
      ...prev,
      exchanges: prev.exchanges.map(e => e.id === id ? { ...e, ...updates } : e),
    }))
  }, [])

  const addExchange = useCallback((exchange: ExtractedExchange) => {
    setState(prev => ({ ...prev, exchanges: [...prev.exchanges, exchange] }))
  }, [])

  const deleteExchange = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      exchanges: prev.exchanges.filter(e => e.id !== id),
      obligations: prev.obligations.map(o => o.linkedExchangeId === id ? { ...o, linkedExchangeId: null } : o),
    }))
  }, [])

  const setObligations = useCallback((obligations: ExtractedObligation[]) => {
    setState(prev => ({ ...prev, obligations }))
  }, [])

  const updateObligation = useCallback((id: string, updates: Partial<ExtractedObligation>) => {
    setState(prev => ({
      ...prev,
      obligations: prev.obligations.map(o => o.id === id ? { ...o, ...updates } : o),
    }))
  }, [])

  const addObligation = useCallback((obligation: ExtractedObligation) => {
    setState(prev => ({ ...prev, obligations: [...prev.obligations, obligation] }))
  }, [])

  const deleteObligation = useCallback((id: string) => {
    setState(prev => ({ ...prev, obligations: prev.obligations.filter(o => o.id !== id) }))
  }, [])

  const setDeliverables = useCallback((deliverables: ExtractedDeliverable[]) => {
    setState(prev => ({ ...prev, deliverables }))
  }, [])

  const updateDeliverable = useCallback((id: string, updates: Partial<ExtractedDeliverable>) => {
    setState(prev => ({
      ...prev,
      deliverables: prev.deliverables.map(d => d.id === id ? { ...d, ...updates } : d),
    }))
  }, [])

  const addDeliverable = useCallback((deliverable: ExtractedDeliverable) => {
    setState(prev => ({ ...prev, deliverables: [...prev.deliverables, deliverable] }))
  }, [])

  const deleteDeliverable = useCallback((id: string) => {
    setState(prev => ({ ...prev, deliverables: prev.deliverables.filter(d => d.id !== id) }))
  }, [])

  const setTerms = useCallback((terms: ExtractedTerm[]) => {
    setState(prev => ({ ...prev, terms }))
  }, [])

  const updateTerm = useCallback((id: string, updates: Partial<ExtractedTerm>) => {
    setState(prev => ({
      ...prev,
      terms: prev.terms.map(t => t.id === id ? { ...t, ...updates } : t),
    }))
  }, [])

  const addTerm = useCallback((term: ExtractedTerm) => {
    setState(prev => ({ ...prev, terms: [...prev.terms, term] }))
  }, [])

  const deleteTerm = useCallback((id: string) => {
    setState(prev => ({ ...prev, terms: prev.terms.filter(t => t.id !== id) }))
  }, [])

  const activateContract = useCallback(() => {
    setState(prev => ({ ...prev, isActivated: true }))
  }, [])

  const resetWorkflow = useCallback(() => {
    setState({ ...initialState, parties: mockParties.map(p => ({ ...p })), exchanges: mockExchanges.map(e => ({ ...e })), obligations: mockObligations.map(o => ({ ...o })), deliverables: mockDeliverables.map(d => ({ ...d })), terms: mockTerms.map(t => ({ ...t })) })
  }, [])

  return (
    <WorkflowContext.Provider value={{
      state, setStage, setUploadData, setParties, updateParty,
      setExchanges, updateExchange, addExchange, deleteExchange,
      setObligations, updateObligation, addObligation, deleteObligation,
      setDeliverables, updateDeliverable, addDeliverable, deleteDeliverable,
      setTerms, updateTerm, addTerm, deleteTerm,
      activateContract, resetWorkflow,
    }}>
      {children}
    </WorkflowContext.Provider>
  )
}

export function useContractWorkflow() {
  const ctx = useContext(WorkflowContext)
  if (!ctx) throw new Error("useContractWorkflow must be used within ContractWorkflowProvider")
  return ctx
}
