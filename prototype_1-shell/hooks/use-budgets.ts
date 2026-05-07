"use client"

import { useState, useEffect, useCallback } from "react"
import { getBudgetSummaries } from "@/lib/budget-actions"
import type { BudgetSummary, Sport, BudgetCategory } from "@/lib/budget-types"

export function useBudgets() {
  const [summaries, setSummaries] = useState<BudgetSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadBudgets = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getBudgetSummaries()
      setSummaries(data)
    } catch (err) {
      setError("Failed to load budget data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBudgets()
  }, [loadBudgets])

  const getBudgetForSportCategory = useCallback(
    (sport: Sport, category: BudgetCategory): BudgetSummary | null => {
      return summaries.find(
        (s) => s.budgetType.sport === sport && s.budgetType.category === category
      ) || null
    },
    [summaries]
  )

  const getCapForPeriod = useCallback(
    (sport: Sport, category: BudgetCategory, fiscalYear: string): number | null => {
      const summary = getBudgetForSportCategory(sport, category)
      if (!summary) return null

      const period = summary.periods.find((p) => {
        // Match by fiscal year label pattern like "Jul '25 - Jun '26" to "FY26"
        // Extract the end year from the period label
        const match = p.fiscal_year_label.match(/Jun '(\d{2})/)
        if (match) {
          const fy = `FY${match[1]}`
          return fy === fiscalYear
        }
        return false
      })

      if (!period) return null
      return (period.budget_amount || 0) + (period.rollover_amount || 0)
    },
    [getBudgetForSportCategory]
  )

  const getCurrentPeriodCap = useCallback(
    (sport: Sport, category: BudgetCategory): number | null => {
      const summary = getBudgetForSportCategory(sport, category)
      if (!summary || !summary.currentPeriod) return null
      return (summary.currentPeriod.budget_amount || 0) + (summary.currentPeriod.rollover_amount || 0)
    },
    [getBudgetForSportCategory]
  )

  const getCommittedForPeriod = useCallback(
    (sport: Sport, category: BudgetCategory, fiscalYear: string): number | null => {
      const summary = getBudgetForSportCategory(sport, category)
      if (!summary) return null

      const period = summary.periods.find((p) => {
        const match = p.fiscal_year_label.match(/Jun '(\d{2})/)
        if (match) {
          const fy = `FY${match[1]}`
          return fy === fiscalYear
        }
        return false
      })

      return period?.committed_amount ?? null
    },
    [getBudgetForSportCategory]
  )

  return {
    summaries,
    loading,
    error,
    refresh: loadBudgets,
    getBudgetForSportCategory,
    getCapForPeriod,
    getCurrentPeriodCap,
    getCommittedForPeriod,
  }
}

// Utility to convert fiscal year label to FY format
export function fiscalYearLabelToFY(label: string): string | null {
  const match = label.match(/Jun '(\d{2})/)
  return match ? `FY${match[1]}` : null
}

// Utility to convert FY format to fiscal year label
export function fyToFiscalYearLabel(fy: string): string {
  const fyNum = parseInt(fy.replace("FY", ""), 10)
  const startYear = 2000 + fyNum - 1
  const endYear = 2000 + fyNum
  return `Jul '${String(startYear).slice(-2)} - Jun '${String(endYear).slice(-2)}`
}
