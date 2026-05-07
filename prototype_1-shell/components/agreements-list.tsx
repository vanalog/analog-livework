"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, MoreHorizontal, Trash2, Pencil, Loader2, FileText } from "lucide-react"
import { getContractsWithCapAllocations, deleteContract } from "@/lib/contract-actions"
import { getBudgetSummaries, getAgreementPaymentSums } from "@/lib/budget-actions"
import type { Contract, ContractCapAllocation } from "@/lib/contract-types"
import type { BudgetSummary } from "@/lib/budget-types"
import Link from "next/link"

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Contract with cap allocation details
type ContractWithAllocations = Contract & {
  cap_allocations: (ContractCapAllocation & {
    budget_period: { fiscal_year_label: string; budget_type_id: string }
  })[]
}

// Budget period info for display
interface BudgetPeriodInfo {
  id: string
  fiscal_year_label: string
  budget_amount: number
  rollover_amount: number
  committed_amount: number
  rollover_enabled?: boolean
}

// Configuration for each team section
const TEAM_CONFIG = [
  { team: "MBB" as const, sport: "MBB", title: "Men's Basketball" },
  { team: "WBB" as const, sport: "WBB", title: "Women's Basketball" },
]

export function AgreementsList() {
  const [contracts, setContracts] = useState<ContractWithAllocations[]>([])
  const [budgetSummaries, setBudgetSummaries] = useState<BudgetSummary[]>([])
  const [agreementPayments, setAgreementPayments] = useState<Record<string, Record<string, number>>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [contractsData, summaries, payments] = await Promise.all([
        getContractsWithCapAllocations(),
        getBudgetSummaries(),
        getAgreementPaymentSums(),
      ])
      setContracts(contractsData)
      setBudgetSummaries(summaries)
      setAgreementPayments(payments)
      setError(null)
    } catch (err) {
      console.error("Error loading data:", err)
      setError("Failed to load agreements")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleDelete = async () => {
    if (!contractToDelete) return

    try {
      setActionLoading(contractToDelete.id)
      await deleteContract(contractToDelete.id)
      await loadData()
    } catch (err) {
      console.error("Error deleting contract:", err)
      setError("Failed to delete agreement")
    } finally {
      setActionLoading(null)
      setDeleteDialogOpen(false)
      setContractToDelete(null)
    }
  }

  const openDeleteDialog = (contract: Contract) => {
    setContractToDelete(contract)
    setDeleteDialogOpen(true)
  }

  // Get budget summary for a specific sport
  const getBudgetSummary = (sport: string) => {
    return budgetSummaries.find(
      s => s.budgetType.sport === sport && s.budgetType.category === "REVENUE_SHARE"
    )
  }

  // Get cap periods for a sport (sorted by start date)
  const getCapPeriods = (sport: string): BudgetPeriodInfo[] => {
    const summary = getBudgetSummary(sport)
    if (!summary) return []
    return summary.periods.map(p => ({
      id: p.id,
      fiscal_year_label: p.fiscal_year_label,
      budget_amount: p.budget_amount || 0,
      rollover_amount: p.rollover_amount || 0,
      committed_amount: p.committed_amount || 0,
      rollover_enabled: p.rollover_enabled,
    }))
  }

  // Calculate rollover amounts accounting for auto-rollover from previous periods
  const getCalculatedRollovers = (periods: BudgetPeriodInfo[], sport: string): number[] => {
    const sportPayments = agreementPayments[sport] || {}
    
    return periods.map((period, idx) => {
      if (idx === 0) {
        return period.rollover_amount || 0
      }
      
      const prevPeriod = periods[idx - 1]
      if (prevPeriod.rollover_enabled) {
        // Calculate from previous period's available
        const prevBudget = prevPeriod.budget_amount || 0
        const prevRollover = getCalculatedRolloversRecursive(periods, idx - 1, sportPayments)
        const prevCommitted = prevPeriod.committed_amount || 0
        const prevAgreementPayments = sportPayments[prevPeriod.fiscal_year_label] || 0
        return prevBudget + prevRollover - prevCommitted - prevAgreementPayments
      }
      
      return period.rollover_amount || 0
    })
  }
  
  // Helper for recursive rollover calculation
  const getCalculatedRolloversRecursive = (
    periods: BudgetPeriodInfo[], 
    idx: number, 
    sportPayments: Record<string, number>
  ): number => {
    if (idx === 0) {
      return periods[0].rollover_amount || 0
    }
    
    const prevPeriod = periods[idx - 1]
    if (prevPeriod.rollover_enabled) {
      const prevBudget = prevPeriod.budget_amount || 0
      const prevRollover = getCalculatedRolloversRecursive(periods, idx - 1, sportPayments)
      const prevCommitted = prevPeriod.committed_amount || 0
      const prevAgreementPayments = sportPayments[prevPeriod.fiscal_year_label] || 0
      return prevBudget + prevRollover - prevCommitted - prevAgreementPayments
    }
    
    return periods[idx].rollover_amount || 0
  }

  // Get contracts filtered by team
  const getContractsByTeam = (team: "MBB" | "WBB") => {
    return contracts.filter(c => c.team === team)
  }

  // Get the allocation amount for a contract in a specific period
  const getAllocationForPeriod = (
    contract: ContractWithAllocations,
    periodLabel: string
  ): number => {
    const allocation = contract.cap_allocations.find(
      a => a.budget_period?.fiscal_year_label === periodLabel
    )
    return allocation?.allocated_amount || 0
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Agreements</h1>
        </div>
        <Card>
          <CardContent className="py-12 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Agreements</h1>
        <Link href="/">
          <Button size="sm" className="gap-1.5 h-8 text-xs">
            <Plus className="w-3.5 h-3.5" />
            New Agreement
          </Button>
        </Link>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          {error}
          <Button variant="ghost" size="sm" onClick={() => setError(null)} className="ml-2 h-6 px-2 text-xs">
            Dismiss
          </Button>
        </div>
      )}

      {/* Render each team section */}
      {TEAM_CONFIG.map(({ team, sport, title }) => {
        const teamContracts = getContractsByTeam(team)
        const periods = getCapPeriods(sport)
        const sportPayments = agreementPayments[sport] || {}
        const calculatedRollovers = getCalculatedRollovers(periods, sport)

        return (
          <Card key={team}>
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm font-semibold">
                {title}
                <span className="ml-2 text-muted-foreground font-normal">
                  ({teamContracts.length} agreement{teamContracts.length !== 1 ? "s" : ""})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {teamContracts.length === 0 && periods.length === 0 ? (
                <div className="py-8 text-center">
                  <FileText className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">No agreements yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs pl-4 min-w-[160px]">Athlete</TableHead>
                        {periods.map((period) => (
                          <TableHead key={period.id} className="text-xs text-right min-w-[120px]">
                            {period.fiscal_year_label}
                          </TableHead>
                        ))}
                        <TableHead className="text-xs text-right min-w-[100px]">Total Value</TableHead>
                        <TableHead className="text-xs w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamContracts.length === 0 ? (
                        <TableRow>
                          <TableCell 
                            colSpan={3 + periods.length} 
                            className="text-center text-muted-foreground text-sm py-6"
                          >
                            No agreements for this team
                          </TableCell>
                        </TableRow>
                      ) : (
                        teamContracts.map((contract) => (
                          <TableRow key={contract.id}>
                            <TableCell className="text-sm font-medium pl-4">
                              {contract.athlete_name}
                            </TableCell>
                            {periods.map((period) => {
                              const amount = getAllocationForPeriod(contract, period.fiscal_year_label)
                              return (
                                <TableCell key={period.id} className="text-sm text-right">
                                  {amount > 0 ? (
                                    <span className="text-foreground">{formatCurrency(amount)}</span>
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </TableCell>
                              )
                            })}
                            <TableCell className="text-sm text-right font-medium">
                              {formatCurrency(contract.total_value)}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7" 
                                    disabled={actionLoading === contract.id}
                                  >
                                    {actionLoading === contract.id ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <MoreHorizontal className="w-3.5 h-3.5" />
                                    )}
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <a href={`/agreements/${contract.id}/edit`}>
                                      <Pencil className="w-3.5 h-3.5 mr-2" />
                                      Edit
                                    </a>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => openDeleteDialog(contract)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}

                      {/* Totals row */}
                      <TableRow className="bg-muted/30 border-t-2">
                        <TableCell className="text-xs font-semibold pl-4 text-muted-foreground">
                          Total Agreements
                        </TableCell>
                        {periods.map((period) => {
                          const total = sportPayments[period.fiscal_year_label] || 0
                          return (
                            <TableCell key={period.id} className="text-sm text-right font-semibold">
                              <span className={total > 0 ? "text-orange-600" : "text-muted-foreground"}>
                                {total > 0 ? formatCurrency(total) : "-"}
                              </span>
                            </TableCell>
                          )
                        })}
                        <TableCell className="text-sm text-right font-semibold">
                          {formatCurrency(
                            teamContracts.reduce((sum, c) => sum + c.total_value, 0)
                          )}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>

                      {/* Available/Remaining row */}
                      <TableRow className="bg-muted/30">
                        <TableCell className="text-xs font-semibold pl-4 text-muted-foreground">
                          Available in Cap
                        </TableCell>
                        {periods.map((period, idx) => {
                          const budget = period.budget_amount || 0
                          const rollover = calculatedRollovers[idx]
                          const committed = period.committed_amount || 0
                          const agreementTotal = sportPayments[period.fiscal_year_label] || 0
                          const available = budget + rollover - committed - agreementTotal

                          return (
                            <TableCell key={period.id} className="text-sm text-right font-semibold">
                              <span className={available >= 0 ? "text-green-700" : "text-red-600"}>
                                {formatCurrency(available)}
                              </span>
                            </TableCell>
                          )
                        })}
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Agreement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the agreement for{" "}
              <span className="font-medium">{contractToDelete?.athlete_name}</span>?
              This will also remove the cap allocations and update the committed amounts.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
