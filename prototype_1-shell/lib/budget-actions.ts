"use server"

import { createClient } from "@/lib/supabase/server"
import type { BudgetType, BudgetPeriod, BudgetSummary } from "./budget-types"

// Map contract team values to budget sport values
// Handles both formats: "mens-basketball" / "womens-basketball" and "MBB" / "WBB"
const TEAM_TO_SPORT: Record<string, "MBB" | "WBB"> = {
  "mens-basketball": "MBB",
  "womens-basketball": "WBB",
  "MBB": "MBB",
  "WBB": "WBB",
}

// Parse cap_period string like "7/1/25-6/30/26" into a start date for matching
function parseCapPeriodStartDate(capPeriod: string): Date | null {
  // Format: "M/D/YY-M/D/YY" e.g., "7/1/25-6/30/26"
  const match = capPeriod.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})-/)
  if (!match) return null
  
  const [, month, day, year] = match
  // Convert 2-digit year to 4-digit (assuming 20xx)
  const fullYear = 2000 + parseInt(year, 10)
  return new Date(fullYear, parseInt(month, 10) - 1, parseInt(day, 10))
}

// Get sum of agreement payments grouped by fiscal_year_label and team (sport)
// Includes both regular contract_payments AND contract_conditional_payments
// Optional excludeContractId to exclude payments from a specific contract (used when editing)
export async function getAgreementPaymentSums(excludeContractId?: string | null): Promise<
  Record<string, Record<string, number>> // { "MBB": { "Jul '25 - Jun '26": 1875000 }, ... }
> {
  const supabase = await createClient()
  
  // Fetch contract payments with team info and contract_id
  let paymentsQuery = supabase
    .from("contract_payments")
    .select(`
      amount,
      cap_period,
      contract_id,
      contract:contracts!inner(team)
    `)
  
  // Exclude payments from the specified contract if provided
  if (excludeContractId) {
    paymentsQuery = paymentsQuery.neq("contract_id", excludeContractId)
  }
  
  const { data: payments, error: paymentsError } = await paymentsQuery
  
  if (paymentsError) {
    console.error("Error fetching agreement payments:", paymentsError)
    return {}
  }

  // Also fetch conditional payments with team info and contract_id
  let conditionalQuery = supabase
    .from("contract_conditional_payments")
    .select(`
      amount,
      cap_period,
      contract_id,
      contract:contracts!inner(team)
    `)
  
  // Exclude payments from the specified contract if provided
  if (excludeContractId) {
    conditionalQuery = conditionalQuery.neq("contract_id", excludeContractId)
  }
  
  const { data: conditionalPayments, error: conditionalError } = await conditionalQuery
  
  if (conditionalError) {
    console.error("Error fetching conditional payments:", conditionalError)
    // Continue with regular payments only
  }
  
  // Fetch all budget periods to map cap_period dates to fiscal_year_label
  const { data: budgetPeriods, error: periodsError } = await supabase
    .from("budget_periods")
    .select("fiscal_year_label, start_date, end_date")
  
  if (periodsError) {
    console.error("Error fetching budget periods:", periodsError)
    return {}
  }
  
  // Build a lookup: find fiscal_year_label by matching payment's cap_period start date
  // to budget_period's start_date
  const findFiscalYearLabel = (capPeriod: string): string | null => {
    const paymentStartDate = parseCapPeriodStartDate(capPeriod)
    if (!paymentStartDate) return null
    
    for (const bp of budgetPeriods || []) {
      const bpStartDate = new Date(bp.start_date)
      // Match if the start dates are the same (comparing year, month, day)
      if (
        paymentStartDate.getFullYear() === bpStartDate.getFullYear() &&
        paymentStartDate.getMonth() === bpStartDate.getMonth() &&
        paymentStartDate.getDate() === bpStartDate.getDate()
      ) {
        return bp.fiscal_year_label
      }
    }
    return null
  }
  
  // Group and sum by sport and fiscal_year_label
  const result: Record<string, Record<string, number>> = {
    MBB: {},
    WBB: {},
  }

  // Helper to add a payment to the result
  const addPayment = (payment: { amount: number; cap_period: string; contract: { team: string } }) => {
    const team = payment.contract?.team
    const sport = TEAM_TO_SPORT[team]
    const capPeriod = payment.cap_period
    const amount = payment.amount || 0
    
    if (!sport || !capPeriod) return
    
    // Convert cap_period to fiscal_year_label
    const fiscalYearLabel = findFiscalYearLabel(capPeriod)
    if (!fiscalYearLabel) return
    
    if (!result[sport][fiscalYearLabel]) {
      result[sport][fiscalYearLabel] = 0
    }
    result[sport][fiscalYearLabel] += amount
  }
  
  // Add regular payments
  for (const payment of payments || []) {
    addPayment(payment as { amount: number; cap_period: string; contract: { team: string } })
  }

  // Add conditional payments
  for (const payment of conditionalPayments || []) {
    addPayment(payment as { amount: number; cap_period: string; contract: { team: string } })
  }
  
  return result
}

export async function getBudgetTypes(): Promise<BudgetType[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("budget_types")
    .select("*")
    .order("sport", { ascending: true })
    .order("category", { ascending: true })

  if (error) {
    console.error("Error fetching budget types:", error)
    throw new Error("Failed to fetch budget types")
  }

  return data || []
}

export async function getBudgetPeriods(budgetTypeId?: string): Promise<BudgetPeriod[]> {
  const supabase = await createClient()
  let query = supabase
    .from("budget_periods")
    .select("*")
    .order("start_date", { ascending: true })

  if (budgetTypeId) {
    query = query.eq("budget_type_id", budgetTypeId)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching budget periods:", error)
    throw new Error("Failed to fetch budget periods")
  }

  return data || []
}

export async function getBudgetSummaries(): Promise<BudgetSummary[]> {
  const supabase = await createClient()
  
  const { data: types, error: typesError } = await supabase
    .from("budget_types")
    .select("*")
    .order("sport", { ascending: true })
    .order("category", { ascending: true })

  if (typesError) {
    console.error("Error fetching budget types:", typesError)
    throw new Error("Failed to fetch budget types")
  }

  const { data: periods, error: periodsError } = await supabase
    .from("budget_periods")
    .select("*")
    .order("start_date", { ascending: true })

  if (periodsError) {
    console.error("Error fetching budget periods:", periodsError)
    throw new Error("Failed to fetch budget periods")
  }

  const today = new Date()

  return (types || []).map((budgetType) => {
    const typePeriods = (periods || []).filter((p) => p.budget_type_id === budgetType.id)
    
    const currentPeriod = typePeriods.find((p) => {
      const start = new Date(p.start_date)
      const end = new Date(p.end_date)
      return today >= start && today <= end
    }) || null

    const totalBudget = typePeriods.reduce((sum, p) => sum + (p.budget_amount || 0), 0)
    const totalRollover = typePeriods.reduce((sum, p) => sum + (p.rollover_amount || 0), 0)
    const totalCommitted = typePeriods.reduce((sum, p) => sum + (p.committed_amount || 0), 0)

    return {
      budgetType,
      periods: typePeriods,
      currentPeriod,
      totalBudget: totalBudget + totalRollover,
      totalCommitted,
      totalAvailable: totalBudget + totalRollover - totalCommitted,
    }
  })
}

export async function updateBudgetPeriod(
  periodId: string,
  updates: Partial<Pick<BudgetPeriod, "budget_amount" | "rollover_amount" | "committed_amount" | "rollover_enabled" | "notes">>
): Promise<BudgetPeriod> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("budget_periods")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", periodId)
    .select()
    .single()

  if (error) {
    console.error("Error updating budget period:", error)
    throw new Error("Failed to update budget period")
  }

  return data
}

export async function createBudgetPeriod(
  budgetTypeId: string,
  period: {
    fiscal_year_label: string
    start_date: string
    end_date: string
    budget_amount: number
    rollover_amount?: number
    committed_amount?: number
    notes?: string
  }
): Promise<BudgetPeriod> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("budget_periods")
    .insert({
      budget_type_id: budgetTypeId,
      fiscal_year_label: period.fiscal_year_label,
      start_date: period.start_date,
      end_date: period.end_date,
      budget_amount: period.budget_amount,
      rollover_amount: period.rollover_amount || 0,
      committed_amount: period.committed_amount || 0,
      notes: period.notes || null,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating budget period:", error)
    throw new Error("Failed to create budget period")
  }

  return data
}

export async function deleteBudgetPeriod(periodId: string): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("budget_periods")
    .delete()
    .eq("id", periodId)

  if (error) {
    console.error("Error deleting budget period:", error)
    throw new Error("Failed to delete budget period")
  }
}

// Get budget periods for a specific sport and category (for cap sidebar)
export async function getBudgetPeriodsForSport(
  sport: "MBB" | "WBB",
  category: "REVENUE_SHARE" | "NIL_MARKETING" = "REVENUE_SHARE"
): Promise<BudgetPeriod[]> {
  const supabase = await createClient()
  
  // First get the budget type ID
  const { data: budgetType, error: typeError } = await supabase
    .from("budget_types")
    .select("id")
    .eq("sport", sport)
    .eq("category", category)
    .single()

  if (typeError || !budgetType) {
    console.error("Error fetching budget type:", typeError)
    return []
  }

  // Get all periods for this budget type
  const { data: periods, error: periodsError } = await supabase
    .from("budget_periods")
    .select("*")
    .eq("budget_type_id", budgetType.id)
    .order("start_date", { ascending: true })

  if (periodsError) {
    console.error("Error fetching budget periods:", periodsError)
    return []
  }

  return periods || []
}

// Get cap amounts by sport and category, keyed by fiscal year
export async function getCapsByFiscalYear(
  sport: "mbb" | "wbb",
  category: "cap" | "nil"
): Promise<Record<string, { budget: number; rollover: number; committed: number; total: number }>> {
  const supabase = await createClient()
  
  // First get the budget type ID
  const { data: budgetType, error: typeError } = await supabase
    .from("budget_types")
    .select("id")
    .eq("sport", sport)
    .eq("category", category)
    .single()

  if (typeError || !budgetType) {
    console.error("Error fetching budget type:", typeError)
    return {}
  }

  // Get all periods for this budget type
  const { data: periods, error: periodsError } = await supabase
    .from("budget_periods")
    .select("*")
    .eq("budget_type_id", budgetType.id)
    .order("start_date", { ascending: true })

  if (periodsError) {
    console.error("Error fetching budget periods:", periodsError)
    return {}
  }

  // Build a map keyed by FY label (e.g., "FY26")
  const result: Record<string, { budget: number; rollover: number; committed: number; total: number }> = {}
  
  for (const period of periods || []) {
    // Extract FY from the label like "Jul '25 - Jun '26" -> "FY26"
    const match = period.fiscal_year_label.match(/Jun '(\d{2})/)
    if (match) {
      const fy = `FY${match[1]}`
      const budget = period.budget_amount || 0
      const rollover = period.rollover_amount || 0
      const committed = period.committed_amount || 0
      result[fy] = {
        budget,
        rollover,
        committed,
        total: budget + rollover,
      }
    }
  }

  return result
}
