export type BudgetCategory = "cap" | "nil"
export type Sport = "mbb" | "wbb"

export interface BudgetType {
  id: string
  sport: Sport
  category: BudgetCategory
  name: string
  description: string | null
  fiscal_year_start_month: number
  created_at: string
  updated_at: string
}

export interface BudgetPeriod {
  id: string
  budget_type_id: string
  fiscal_year_label: string
  start_date: string
  end_date: string
  budget_amount: number
  rollover_amount: number
  committed_amount: number
  rollover_enabled: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface BudgetPeriodWithType extends BudgetPeriod {
  budget_type: BudgetType
}

export interface BudgetSummary {
  budgetType: BudgetType
  periods: BudgetPeriod[]
  currentPeriod: BudgetPeriod | null
  totalBudget: number
  totalCommitted: number
  totalAvailable: number
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getBudgetDisplayName(sport: Sport, category: BudgetCategory): string {
  const sportName = sport === "mbb" ? "Men's Basketball" : "Women's Basketball"
  const categoryName = category === "cap" ? "Revenue Share Cap" : "NIL Marketing"
  return `${sportName} ${categoryName}`
}

export function getBudgetShortName(sport: Sport, category: BudgetCategory): string {
  const sportName = sport === "mbb" ? "MBB" : "WBB"
  const categoryName = category === "cap" ? "Cap" : "NIL"
  return `${sportName} ${categoryName}`
}
