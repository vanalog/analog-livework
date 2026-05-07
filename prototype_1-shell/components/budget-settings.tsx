"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Edit2,
  Check,
  X,
  Plus,
  AlertCircle,
  Loader2
} from "lucide-react"

import { 
  getBudgetSummaries, 
  updateBudgetPeriod, 
  createBudgetPeriod,
  getAgreementPaymentSums,
} from "@/lib/budget-actions"
import type { BudgetSummary, BudgetPeriod } from "@/lib/budget-types"
import { formatCurrency } from "@/lib/budget-types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"

// Helper to derive fiscal year label from start and end dates
function deriveFiscalYearLabel(startDate: string, endDate: string): string {
  const start = new Date(startDate + "T00:00:00")
  const end = new Date(endDate + "T00:00:00")
  
  const startMonth = start.toLocaleString("en-US", { month: "short" })
  const startYear = String(start.getFullYear()).slice(-2)
  const endMonth = end.toLocaleString("en-US", { month: "short" })
  const endYear = String(end.getFullYear()).slice(-2)
  
  return `${startMonth} '${startYear} - ${endMonth} '${endYear}`
}

// Define section order and display names (matching database values)
// Only showing Revenue Share budgets now
const SECTION_CONFIG = [
  { sport: "MBB", category: "REVENUE_SHARE", title: "Men's Basketball Revenue Sharing" },
  { sport: "WBB", category: "REVENUE_SHARE", title: "Women's Basketball Revenue Sharing" },
] as const

interface EditingCell {
  periodId: string
  field: "budget_amount" | "rollover_amount" | "committed_amount"
  value: string
}

export function BudgetSettings() {
  const [summaries, setSummaries] = useState<BudgetSummary[]>([])
  const [agreementPayments, setAgreementPayments] = useState<Record<string, Record<string, number>>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<EditingCell | null>(null)
  const [saving, setSaving] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [addingToBudgetType, setAddingToBudgetType] = useState<string | null>(null)
  const [togglingRollover, setTogglingRollover] = useState<string | null>(null)
  const [newPeriod, setNewPeriod] = useState({
    start_date: "",
    end_date: "",
    budget_amount: "",
  })

  const loadBudgets = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [data, payments] = await Promise.all([
        getBudgetSummaries(),
        getAgreementPaymentSums(),
      ])
      setSummaries(data)
      setAgreementPayments(payments)
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

  const handleSave = async () => {
    if (!editing) return

    try {
      setSaving(true)
      const numValue = parseFloat(editing.value.replace(/[^0-9.-]/g, ""))
      if (isNaN(numValue)) {
        setError("Please enter a valid number")
        return
      }

      await updateBudgetPeriod(editing.periodId, {
        [editing.field]: numValue,
      })

      setEditing(null)
      await loadBudgets()
    } catch (err) {
      setError("Failed to save changes")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleAddPeriod = (budgetTypeId: string) => {
    setAddingToBudgetType(budgetTypeId)
    setNewPeriod({
      start_date: "",
      end_date: "",
      budget_amount: "",
    })
    setShowAddDialog(true)
  }

  const handleToggleRollover = async (periodId: string, enabled: boolean) => {
    try {
      setTogglingRollover(periodId)
      await updateBudgetPeriod(periodId, { rollover_enabled: enabled })
      await loadBudgets()
    } catch (err) {
      setError("Failed to update rollover setting")
      console.error(err)
    } finally {
      setTogglingRollover(null)
    }
  }

  const handleCreatePeriod = async () => {
    if (!addingToBudgetType) return

    try {
      setSaving(true)
      const amount = parseFloat(newPeriod.budget_amount.replace(/[^0-9.-]/g, ""))
      if (isNaN(amount)) {
        setError("Please enter a valid budget amount")
        return
      }

      if (!newPeriod.start_date || !newPeriod.end_date) {
        setError("Please enter start and end dates")
        return
      }

      // Auto-derive the label from dates
      const derivedLabel = deriveFiscalYearLabel(newPeriod.start_date, newPeriod.end_date)

      await createBudgetPeriod(addingToBudgetType, {
        fiscal_year_label: derivedLabel,
        start_date: newPeriod.start_date,
        end_date: newPeriod.end_date,
        budget_amount: amount,
      })

      setShowAddDialog(false)
      setAddingToBudgetType(null)
      await loadBudgets()
    } catch (err) {
      setError("Failed to create period")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  // Find summary by sport and category
  const getSummary = (sport: string, category: string) => {
    return summaries.find(
      s => s.budgetType.sport === sport && s.budgetType.category === category
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error && summaries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={loadBudgets}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold tracking-tight">Budget Settings</h1>

      {error && (
        <div className="bg-destructive/10 text-destructive px-3 py-2 rounded-md flex items-center gap-2 text-sm">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
          <Button variant="ghost" size="sm" onClick={() => setError(null)} className="ml-auto h-6 px-2 text-xs">
            Dismiss
          </Button>
        </div>
      )}

      {/* Render each section */}
      {SECTION_CONFIG.map(({ sport, category, title }) => {
        const summary = getSummary(sport, category)
        if (!summary) return null

        return (
          <BudgetSection
            key={`${sport}-${category}`}
            title={title}
            summary={summary}
            editing={editing}
            setEditing={setEditing}
            onSave={handleSave}
            saving={saving}
            onAddPeriod={() => handleAddPeriod(summary.budgetType.id)}
            onToggleRollover={handleToggleRollover}
            togglingRollover={togglingRollover}
            agreementPaymentsBySport={agreementPayments[sport] || {}}
          />
        )
      })}

      {/* Add Period Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-base">Add Budget Period</DialogTitle>
            <DialogDescription className="text-xs">
              Create a new fiscal year budget period.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel>Start Date</FieldLabel>
              <Input
                type="date"
                value={newPeriod.start_date}
                onChange={(e) => setNewPeriod({ ...newPeriod, start_date: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel>End Date</FieldLabel>
              <Input
                type="date"
                value={newPeriod.end_date}
                onChange={(e) => setNewPeriod({ ...newPeriod, end_date: e.target.value })}
              />
            </Field>
            {newPeriod.start_date && newPeriod.end_date && (
              <div className="text-sm text-muted-foreground bg-muted/50 rounded px-3 py-2">
                Label: <span className="font-medium text-foreground">{deriveFiscalYearLabel(newPeriod.start_date, newPeriod.end_date)}</span>
              </div>
            )}
            <Field>
              <FieldLabel>Budget Amount</FieldLabel>
              <Input
                placeholder="e.g., 3500000"
                value={newPeriod.budget_amount}
                onChange={(e) => setNewPeriod({ ...newPeriod, budget_amount: e.target.value })}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePeriod} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Period
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface BudgetSectionProps {
  title: string
  summary: BudgetSummary
  editing: EditingCell | null
  setEditing: (editing: EditingCell | null) => void
  onSave: () => void
  saving: boolean
  onAddPeriod: () => void
  onToggleRollover: (periodId: string, enabled: boolean) => void
  togglingRollover: string | null
  agreementPaymentsBySport: Record<string, number> // { "Jul '25 - Jun '26": 1875000, ... }
}

function BudgetSection({ 
  title, 
  summary, 
  editing, 
  setEditing, 
  onSave, 
  saving,
  onAddPeriod,
  onToggleRollover,
  togglingRollover,
  agreementPaymentsBySport
}: BudgetSectionProps) {
  const periods = summary.periods
  
  // Calculate available amounts for each period, accounting for auto-rollover
  // When rollover_enabled is true on period N, the rollover for period N+1 
  // should be calculated from period N's available amount
  const getCalculatedRollover = (periodIndex: number): number => {
    if (periodIndex === 0) {
      // First period cannot have auto-rollover from a previous period
      return periods[0].rollover_amount || 0
    }
    
    const prevPeriod = periods[periodIndex - 1]
    
    // If previous period has rollover_enabled, calculate from its available
    if (prevPeriod.rollover_enabled) {
      const prevBudget = prevPeriod.budget_amount || 0
      const prevRollover = getCalculatedRollover(periodIndex - 1)
      const prevCommitted = prevPeriod.committed_amount || 0
      const prevAgreementPayments = agreementPaymentsBySport[prevPeriod.fiscal_year_label] || 0
      return prevBudget + prevRollover - prevCommitted - prevAgreementPayments
    }
    
    // Otherwise use the manually set rollover_amount
    return periods[periodIndex].rollover_amount || 0
  }
  
  // Pre-calculate all rollovers for display
  const calculatedRollovers = periods.map((_, idx) => getCalculatedRollover(idx))

  return (
    <Card>
      <CardHeader className="py-2 px-4">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-4">
        {periods.length === 0 ? (
          <p className="text-muted-foreground text-center py-4 text-sm">No budget periods configured</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1.5 pr-3 font-medium text-muted-foreground text-xs w-28"></th>
                  {periods.map((period) => (
                    <th key={period.id} className="text-left py-1.5 px-2 font-semibold text-xs min-w-[140px]">
                      {period.fiscal_year_label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-1.5 pr-3 text-muted-foreground text-xs">Budget</td>
                  {periods.map((period) => (
                    <td key={period.id} className="py-1.5 px-2">
                      <EditableCell
                        value={period.budget_amount || 0}
                        periodId={period.id}
                        field="budget_amount"
                        editing={editing}
                        setEditing={setEditing}
                        onSave={onSave}
                        saving={saving}
                        color="blue"
                      />
                    </td>
                  ))}
                </tr>
                
                <tr className="border-b">
                  <td className="py-1.5 pr-3 text-muted-foreground text-xs">Previously Committed</td>
                  {periods.map((period) => (
                    <td key={period.id} className="py-1.5 px-2">
                      <EditableCell
                        value={period.committed_amount || 0}
                        periodId={period.id}
                        field="committed_amount"
                        editing={editing}
                        setEditing={setEditing}
                        onSave={onSave}
                        saving={saving}
                        color="blue"
                      />
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-1.5 pr-3 text-muted-foreground text-xs">Agreements</td>
                  {periods.map((period) => {
                    const agreementTotal = agreementPaymentsBySport[period.fiscal_year_label] || 0
                    return (
                      <td key={period.id} className="py-1.5 px-2">
                        <span className={agreementTotal > 0 ? "text-orange-600 text-xs font-medium" : "text-muted-foreground text-xs"}>
                          {agreementTotal > 0 ? formatCurrency(agreementTotal) : "-"}
                        </span>
                      </td>
                    )
                  })}
                </tr>
                <tr>
                  <td className="py-1.5 pr-3 text-muted-foreground text-xs">Available</td>
                  {periods.map((period, idx) => {
                    const budget = period.budget_amount || 0
                    const rollover = calculatedRollovers[idx]
                    const committed = period.committed_amount || 0
                    const agreementTotal = agreementPaymentsBySport[period.fiscal_year_label] || 0
                    const available = budget + rollover - committed - agreementTotal
                    
                    return (
                      <td key={period.id} className="py-1.5 px-2">
                        <span className={available >= 0 ? "text-green-700 font-semibold text-xs" : "text-red-600 font-semibold text-xs"}>
                          {formatCurrency(available)}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface EditableCellProps {
  value: number
  periodId: string
  field: EditingCell["field"]
  editing: EditingCell | null
  setEditing: (editing: EditingCell | null) => void
  onSave: () => void
  saving: boolean
  color?: "blue" | "default"
}

function EditableCell({
  value,
  periodId,
  field,
  editing,
  setEditing,
  onSave,
  saving,
  color = "default"
}: EditableCellProps) {
  const isEditing = editing?.periodId === periodId && editing?.field === field

  const handleStartEdit = () => {
    setEditing({
      periodId,
      field,
      value: value.toString(),
    })
  }

  const handleCancel = () => {
    setEditing(null)
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-0.5">
        <Input
          className="h-6 w-24 text-xs"
          value={editing.value}
          onChange={(e) => setEditing({ ...editing, value: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSave()
            if (e.key === "Escape") handleCancel()
          }}
          autoFocus
        />
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onSave} disabled={saving}>
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
        </Button>
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleCancel}>
          <X className="w-3 h-3" />
        </Button>
      </div>
    )
  }

  // If value is 0 or empty, show a dash but still allow editing
  if (value === 0) {
    return (
      <div className="flex items-center gap-1 group">
        <span className="text-muted-foreground text-xs">—</span>
        <Button
          size="icon"
          variant="ghost"
          className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleStartEdit}
        >
          <Edit2 className="w-2.5 h-2.5" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 group">
      <span className={color === "blue" ? "text-blue-700 text-xs" : "text-xs"}>
        {formatCurrency(value)}
      </span>
      <Button
        size="icon"
        variant="ghost"
        className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleStartEdit}
      >
        <Edit2 className="w-2.5 h-2.5" />
      </Button>
    </div>
  )
}
