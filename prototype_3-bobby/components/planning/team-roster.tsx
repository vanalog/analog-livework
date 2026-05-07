"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import {
  CAP_PERIODS,
  NIL_PERIODS,
  getTeamById,
  getRosterByTeam,
  formatCurrency,
  formatCurrencyFull,
  EXISTING_ATHLETES,
  type RosterEntry,
} from "@/lib/planning-data"
import { ArrowLeft, ArrowRight, Plus, Eye, ChevronUp, ChevronDown, Search, UserPlus } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

type RsField = "capPeriod1" | "capPeriod2" | "capPeriod3"
type NilField = "nil2026" | "nil2027"

interface TeamRosterProps {
  teamId: string
}

export function TeamRoster({ teamId }: TeamRosterProps) {
  const router = useRouter()
  const team = getTeamById(teamId)
  const initialRoster = getRosterByTeam(teamId)

  const [roster, setRoster] = useState<RosterEntry[]>(initialRoster)
  const [sortField, setSortField] = useState<"name" | "total" | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Add athlete state - inline search + modal for create
  const [showAddRow, setShowAddRow] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newAthleteForm, setNewAthleteForm] = useState({
    firstName: "",
    lastName: "",
    studentEmail: "",
    position: "",
  })

  // Calculate totals across both RS and NIL
  const totals = useMemo(() => {
    const capPeriod1 = roster.reduce((sum, r) => sum + r.capPeriod1, 0)
    const capPeriod2 = roster.reduce((sum, r) => sum + r.capPeriod2, 0)
    const capPeriod3 = roster.reduce((sum, r) => sum + r.capPeriod3, 0)
    const nil2026 = roster.reduce((sum, r) => sum + r.nil2026, 0)
    const nil2027 = roster.reduce((sum, r) => sum + r.nil2027, 0)

    const rsAllocated = capPeriod1 + capPeriod2 + capPeriod3
    const nilAllocated = nil2026 + nil2027
    const total = rsAllocated + nilAllocated

    const rsBudget = team ? team.budget : 0
    const nilBudget = team ? team.nilBudget : 0
    const rsTotalBudget = rsBudget * 3
    const nilTotalBudget = nilBudget * 2
    const totalBudget = rsTotalBudget + nilTotalBudget

    return {
      capPeriod1,
      capPeriod2,
      capPeriod3,
      nil2026,
      nil2027,
      rsAllocated,
      nilAllocated,
      total,
      rsBudget,
      nilBudget,
      rsTotalBudget,
      nilTotalBudget,
      totalBudget,
      remaining: totalBudget - total,
      remainingCp1: rsBudget - capPeriod1,
      remainingCp2: rsBudget - capPeriod2,
      remainingCp3: rsBudget - capPeriod3,
      remainingNil26: nilBudget - nil2026,
      remainingNil27: nilBudget - nil2027,
    }
  }, [roster, team])

  // Sort roster
  const sortedRoster = useMemo(() => {
    if (!sortField) return roster

    return [...roster].sort((a, b) => {
      let aVal: string | number = a.athleteName
      let bVal: string | number = b.athleteName

      if (sortField === "total") {
        aVal = a.capPeriod1 + a.capPeriod2 + a.capPeriod3 + a.nil2026 + a.nil2027
        bVal = b.capPeriod1 + b.capPeriod2 + b.capPeriod3 + b.nil2026 + b.nil2027
      }

      if (sortDirection === "asc") {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      }
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
    })
  }, [roster, sortField, sortDirection])

  const handleSort = (field: "name" | "total") => {
    if (sortField === field) {
      setSortDirection(d => d === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Update an editable cell value
  const handleValueChange = (entryId: string, field: RsField | NilField, value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0
    setRoster(prev => prev.map(entry => {
      if (entry.id === entryId) {
        return { ...entry, [field]: numValue }
      }
      return entry
    }))
  }

  // Search results for inline add
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const existingIds = roster.map(r => r.athleteId)
    return EXISTING_ATHLETES
      .filter(a =>
        !existingIds.includes(a.id) &&
        a.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5)
  }, [searchQuery, roster])

  const handleAddExistingAthlete = (athlete: typeof EXISTING_ATHLETES[0]) => {
    const newEntry: RosterEntry = {
      id: `roster-${teamId}-${Date.now()}`,
      athleteId: athlete.id,
      athleteName: athlete.name,
      teamId,
      position: athlete.position,
      graduatingYear: athlete.graduatingYear,
      capPeriod1: 0,
      capPeriod2: 0,
      capPeriod3: 0,
      contractStatus: "none",
      nil2026: 0,
      nil2027: 0,
      nilIoiStatus: "none",
    }
    setRoster(prev => [...prev, newEntry])
    setShowAddRow(false)
    setSearchQuery("")
  }

  const handleCreateNewAthlete = () => {
    if (!newAthleteForm.firstName.trim() || !newAthleteForm.lastName.trim()) return

    const fullName = `${newAthleteForm.firstName} ${newAthleteForm.lastName}`
    const newEntry: RosterEntry = {
      id: `roster-${teamId}-${Date.now()}`,
      athleteId: `athlete-new-${Date.now()}`,
      athleteName: fullName,
      teamId,
      position: newAthleteForm.position || "TBD",
      graduatingYear: new Date().getFullYear() + 2,
      capPeriod1: 0,
      capPeriod2: 0,
      capPeriod3: 0,
      contractStatus: "none",
      nil2026: 0,
      nil2027: 0,
      nilIoiStatus: "none",
    }
    setRoster(prev => [...prev, newEntry])
    closeCreateModal()
  }

  const openCreateModal = () => {
    if (searchQuery.trim()) {
      const parts = searchQuery.trim().split(" ")
      setNewAthleteForm({
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
        studentEmail: "",
        position: "",
      })
    }
    setShowCreateModal(true)
  }

  const closeCreateModal = () => {
    setShowCreateModal(false)
    setShowAddRow(false)
    setSearchQuery("")
    setNewAthleteForm({ firstName: "", lastName: "", studentEmail: "", position: "" })
  }

  const handleBuildContract = (entry: RosterEntry) => {
    const params = new URLSearchParams({
      build: "revshare",
      cp1: String(entry.capPeriod1),
      cp2: String(entry.capPeriod2),
      cp3: String(entry.capPeriod3),
    })
    router.push(`/beneficiaries/${entry.athleteId}?${params.toString()}`)
  }

  const handleBuildIOI = (entry: RosterEntry) => {
    const params = new URLSearchParams({
      build: "ioi",
      amount: String(entry.nil2026 + entry.nil2027),
    })
    router.push(`/beneficiaries/${entry.athleteId}?${params.toString()}`)
  }

  const badgeBase = "text-[10px] px-1.5 py-0 h-5 font-medium border-0"

  const getStatusBadge = (status: RosterEntry["contractStatus"]) => {
    switch (status) {
      case "active":
        return <Badge className={cn(badgeBase, "bg-emerald-100 text-emerald-800 hover:bg-emerald-100")}>Active</Badge>
      case "in-review":
        return <Badge className={cn(badgeBase, "bg-amber-100 text-amber-800 hover:bg-amber-100")}>In Review</Badge>
      case "none":
        return <Badge variant="secondary" className={cn(badgeBase, "bg-muted text-muted-foreground")}>Planning</Badge>
    }
  }

  const getNilStatusBadge = (status: RosterEntry["nilIoiStatus"]) => {
    switch (status) {
      case "active":
        return <Badge className={cn(badgeBase, "bg-emerald-100 text-emerald-800 hover:bg-emerald-100")}>Active</Badge>
      case "pending":
        return <Badge className={cn(badgeBase, "bg-amber-100 text-amber-800 hover:bg-amber-100")}>Pending</Badge>
      case "none":
        return <Badge variant="secondary" className={cn(badgeBase, "bg-muted text-muted-foreground")}>Planning</Badge>
    }
  }

  const isOverBudget = (field: RsField) => {
    const periodTotal = roster.reduce((sum, r) => sum + r[field], 0)
    return periodTotal > (team?.budget || 0)
  }

  const isOverNilBudget = (field: NilField) => {
    const yearTotal = roster.reduce((sum, r) => sum + r[field], 0)
    return yearTotal > (team?.nilBudget || 0)
  }

  if (!team) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Team not found</p>
      </div>
    )
  }

  const budgetSummary = `Budget: ${formatCurrency(totals.rsTotalBudget)} RS + ${formatCurrency(totals.nilTotalBudget)} NIL`

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/planning">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{team.name}</h1>
              <p className="text-muted-foreground">
                {roster.length} athletes | {budgetSummary}
              </p>
            </div>
          </div>
        </div>

        {/* Budget Summary Cards - 3 Cap Periods + 2 NIL Years */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Cap Period cards */}
          {CAP_PERIODS.map((cp, i) => {
            const periodKey = `capPeriod${i + 1}` as RsField
            const allocated = totals[periodKey]
            const remaining = totals.rsBudget - allocated
            const over = remaining < 0

            const committed = roster.reduce((sum, r) => {
              if (r.contractStatus === "active") return sum + r[periodKey]
              return sum
            }, 0)
            const inReview = allocated - committed

            return (
              <Card
                key={cp.id}
                className={cn("border-border", over && "border-red-200 bg-red-50/50")}
              >
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-foreground">{cp.label}</p>
                    <span className={cn(
                      "text-sm font-semibold",
                      over ? "text-red-600" : "text-emerald-600"
                    )}>
                      {over ? `-${formatCurrency(Math.abs(remaining))}` : `${formatCurrency(remaining)} left`}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Committed</span>
                      <span className="font-medium text-foreground">{formatCurrency(committed)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">In Review</span>
                      <span className="font-medium text-emerald-600">{formatCurrency(inReview)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                      <div className="h-full flex">
                        <div
                          className={cn("h-full transition-all", over ? "bg-red-600" : "bg-foreground")}
                          style={{ width: `${Math.min(100, (committed / totals.rsBudget) * 100)}%` }}
                        />
                        <div
                          className={cn("h-full transition-all", over ? "bg-red-300" : "bg-emerald-500")}
                          style={{ width: `${Math.min(100 - (committed / totals.rsBudget) * 100, (inReview / totals.rsBudget) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-right">
                      Budget: {formatCurrency(totals.rsBudget)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {/* NIL Year cards */}
          {NIL_PERIODS.map((np) => {
            const allocated = totals[np.field]
            const remaining = totals.nilBudget - allocated
            const over = remaining < 0

            const committed = roster.reduce((sum, r) => {
              if (r.nilIoiStatus === "active") return sum + r[np.field]
              return sum
            }, 0)
            const inReview = allocated - committed

            return (
              <Card
                key={np.id}
                className={cn("border-border border-l-4 border-l-amber-400", over && "border-red-200 bg-red-50/50")}
              >
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-foreground">{np.label}</p>
                    <span className={cn(
                      "text-sm font-semibold",
                      over ? "text-red-600" : "text-emerald-600"
                    )}>
                      {over ? `-${formatCurrency(Math.abs(remaining))}` : `${formatCurrency(remaining)} left`}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Committed</span>
                      <span className="font-medium text-foreground">{formatCurrency(committed)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">In Review</span>
                      <span className="font-medium text-emerald-600">{formatCurrency(inReview)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                      <div className="h-full flex">
                        <div
                          className={cn("h-full transition-all", over ? "bg-red-600" : "bg-foreground")}
                          style={{ width: `${Math.min(100, totals.nilBudget > 0 ? (committed / totals.nilBudget) * 100 : 0)}%` }}
                        />
                        <div
                          className={cn("h-full transition-all", over ? "bg-red-300" : "bg-emerald-500")}
                          style={{ width: `${Math.min(100 - (totals.nilBudget > 0 ? (committed / totals.nilBudget) * 100 : 0), totals.nilBudget > 0 ? (inReview / totals.nilBudget) * 100 : 0)}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-right">
                      Budget: {formatCurrency(totals.nilBudget)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Unified Roster Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left py-2 px-2 text-[10px] uppercase tracking-wide text-muted-foreground font-semibold min-w-[140px]">
                      <button
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        Name
                        {sortField === "name" && (
                          sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                        )}
                      </button>
                    </th>
                    <th className="text-left py-2 px-2 text-[10px] uppercase tracking-wide text-muted-foreground font-semibold w-[48px]">Pos</th>
                    {/* Revenue Share columns */}
                    <th className={cn(
                      "text-right py-2 px-2 text-[10px] tracking-wide font-semibold",
                      isOverBudget("capPeriod1") ? "text-red-600" : "text-muted-foreground"
                    )}>
                      {CAP_PERIODS[0].label}
                    </th>
                    <th className={cn(
                      "text-right py-2 px-2 text-[10px] tracking-wide font-semibold",
                      isOverBudget("capPeriod2") ? "text-red-600" : "text-muted-foreground"
                    )}>
                      {CAP_PERIODS[1].label}
                    </th>
                    <th className={cn(
                      "text-right py-2 px-2 text-[10px] tracking-wide font-semibold",
                      isOverBudget("capPeriod3") ? "text-red-600" : "text-muted-foreground"
                    )}>
                      {CAP_PERIODS[2].label}
                    </th>
                    {/* NIL columns - visually separated with left border */}
                    <th className={cn(
                      "text-right py-2 px-2 text-[10px] tracking-wide font-semibold border-l border-border",
                      isOverNilBudget("nil2026") ? "text-red-600" : "text-muted-foreground"
                    )}>
                      {NIL_PERIODS[0].label}
                    </th>
                    <th className={cn(
                      "text-right py-2 px-2 text-[10px] tracking-wide font-semibold",
                      isOverNilBudget("nil2027") ? "text-red-600" : "text-muted-foreground"
                    )}>
                      {NIL_PERIODS[1].label}
                    </th>
                    {/* Total */}
                    <th className="text-right py-2 px-2 text-[10px] uppercase tracking-wide text-muted-foreground font-semibold border-l border-border">
                      <button
                        onClick={() => handleSort("total")}
                        className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors"
                      >
                        Total
                        {sortField === "total" && (
                          sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                        )}
                      </button>
                    </th>
                    {/* RS status + agreement */}
                    <th className="text-center py-2 px-2 text-[10px] uppercase tracking-wide text-muted-foreground font-semibold border-l border-border">RS Status</th>
                    <th className="text-right py-2 px-2 text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">RS Agmt</th>
                    {/* NIL status + IOI */}
                    <th className="text-center py-2 px-2 text-[10px] uppercase tracking-wide text-muted-foreground font-semibold border-l border-border">NIL Status</th>
                    <th className="text-right py-2 px-2 text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">NIL IOI</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRoster.map((entry) => {
                    const rsTotal = entry.capPeriod1 + entry.capPeriod2 + entry.capPeriod3
                    const nilTotal = entry.nil2026 + entry.nil2027
                    const rowTotal = rsTotal + nilTotal
                    const rsEditable = entry.contractStatus === "none"
                    const nilEditable = entry.nilIoiStatus === "none"

                    return (
                      <tr key={entry.id} className="border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                        <td className="py-2 px-2">
                          <span className="font-medium text-foreground text-sm">{entry.athleteName}</span>
                        </td>
                        <td className="py-2 px-2 text-xs text-muted-foreground">{entry.position}</td>

                        {/* Cap Period 1 */}
                        <td className="py-1.5 px-2 text-right">
                          {rsEditable ? (
                            <Input
                              type="text"
                              value={entry.capPeriod1 ? entry.capPeriod1.toLocaleString() : ""}
                              onChange={(e) => handleValueChange(entry.id, "capPeriod1", e.target.value)}
                              className="h-7 w-20 text-right text-xs ml-auto px-2"
                              placeholder="0"
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              {formatCurrencyFull(entry.capPeriod1)}
                            </span>
                          )}
                        </td>

                        {/* Cap Period 2 */}
                        <td className="py-1.5 px-2 text-right">
                          {rsEditable ? (
                            <Input
                              type="text"
                              value={entry.capPeriod2 ? entry.capPeriod2.toLocaleString() : ""}
                              onChange={(e) => handleValueChange(entry.id, "capPeriod2", e.target.value)}
                              className="h-7 w-20 text-right text-xs ml-auto px-2"
                              placeholder="0"
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              {formatCurrencyFull(entry.capPeriod2)}
                            </span>
                          )}
                        </td>

                        {/* Cap Period 3 */}
                        <td className="py-1.5 px-2 text-right">
                          {rsEditable ? (
                            <Input
                              type="text"
                              value={entry.capPeriod3 ? entry.capPeriod3.toLocaleString() : ""}
                              onChange={(e) => handleValueChange(entry.id, "capPeriod3", e.target.value)}
                              className="h-7 w-20 text-right text-xs ml-auto px-2"
                              placeholder="0"
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              {formatCurrencyFull(entry.capPeriod3)}
                            </span>
                          )}
                        </td>

                        {/* NIL 2026 */}
                        <td className="py-1.5 px-2 text-right border-l border-border">
                          {nilEditable ? (
                            <Input
                              type="text"
                              value={entry.nil2026 ? entry.nil2026.toLocaleString() : ""}
                              onChange={(e) => handleValueChange(entry.id, "nil2026", e.target.value)}
                              className="h-7 w-20 text-right text-xs ml-auto px-2"
                              placeholder="0"
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              {formatCurrencyFull(entry.nil2026)}
                            </span>
                          )}
                        </td>

                        {/* NIL 2027 */}
                        <td className="py-1.5 px-2 text-right">
                          {nilEditable ? (
                            <Input
                              type="text"
                              value={entry.nil2027 ? entry.nil2027.toLocaleString() : ""}
                              onChange={(e) => handleValueChange(entry.id, "nil2027", e.target.value)}
                              className="h-7 w-20 text-right text-xs ml-auto px-2"
                              placeholder="0"
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              {formatCurrencyFull(entry.nil2027)}
                            </span>
                          )}
                        </td>

                        {/* Total (RS + NIL) */}
                        <td className="py-2 px-2 text-right border-l border-border">
                          <span className="text-xs font-semibold text-foreground">
                            {formatCurrencyFull(rowTotal)}
                          </span>
                        </td>

                        {/* RS Status */}
                        <td className="py-2 px-2 text-center border-l border-border">
                          {getStatusBadge(entry.contractStatus)}
                        </td>
                        {/* RS Agreement */}
                        <td className="py-2 px-2 text-right">
                          {entry.contractStatus === "none" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleBuildContract(entry)}
                              disabled={rsTotal === 0}
                              className="h-7 px-2 text-xs"
                            >
                              Build
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
                              <Link href={entry.contractId ? `/contracts/${entry.contractStatus === "active" ? "active" : "negotiation"}/${entry.contractId}` : "#"}>
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Link>
                            </Button>
                          )}
                        </td>

                        {/* NIL Status */}
                        <td className="py-2 px-2 text-center border-l border-border">
                          {getNilStatusBadge(entry.nilIoiStatus)}
                        </td>
                        {/* NIL IOI */}
                        <td className="py-2 px-2 text-right">
                          {entry.nilIoiStatus === "none" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleBuildIOI(entry)}
                              disabled={nilTotal === 0}
                              className="h-7 px-2 text-xs"
                            >
                              Build
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs">
                              <Link href={entry.nilIoiId ? `/contracts/ioi/${entry.nilIoiId}` : "#"}>
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Link>
                            </Button>
                          )}
                        </td>
                      </tr>
                    )
                  })}

                  {/* Add Athlete Row - Inline Search */}
                  {showAddRow ? (
                    <tr className="border-b bg-muted/10">
                      <td colSpan={12} className="py-3 px-4">
                        <div className="relative max-w-sm">
                          <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Search for athlete..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onBlur={() => {
                              setTimeout(() => {
                                if (!searchQuery) {
                                  setShowAddRow(false)
                                }
                              }, 200)
                            }}
                            className="h-8 pl-8"
                            autoFocus
                          />
                          {searchQuery && (
                            <div className="absolute top-full left-0 right-0 mt-1 border rounded-md bg-background shadow-lg z-10 max-h-48 overflow-y-auto">
                              {searchResults.map(athlete => (
                                <button
                                  key={athlete.id}
                                  onClick={() => handleAddExistingAthlete(athlete)}
                                  className="w-full text-left px-3 py-2 hover:bg-muted text-sm flex justify-between items-center border-b last:border-b-0"
                                >
                                  <span className="font-medium">{athlete.name}</span>
                                  <span className="text-muted-foreground text-xs">{athlete.position}</span>
                                </button>
                              ))}
                              <button
                                onClick={openCreateModal}
                                className="w-full text-left px-3 py-2 hover:bg-muted text-sm flex items-center gap-2 text-emerald-600 font-medium"
                              >
                                <UserPlus className="h-3.5 w-3.5" />
                                {`Create "${searchQuery.trim()}"`}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr className="border-b hover:bg-muted/20 transition-colors">
                      <td colSpan={12} className="py-2 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAddRow(true)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Athlete
                        </Button>
                      </td>
                    </tr>
                  )}
                </tbody>

                {/* Totals Footer */}
                <tfoot>
                  <tr className="border-t-2 bg-muted/40">
                    <td className="py-2 px-2 text-xs font-semibold text-foreground" colSpan={2}>Total Allocated</td>
                    <td className={cn(
                      "py-2 px-2 text-right text-xs font-semibold",
                      isOverBudget("capPeriod1") ? "text-red-600" : "text-foreground"
                    )}>
                      {formatCurrencyFull(totals.capPeriod1)}
                    </td>
                    <td className={cn(
                      "py-2 px-2 text-right text-xs font-semibold",
                      isOverBudget("capPeriod2") ? "text-red-600" : "text-foreground"
                    )}>
                      {formatCurrencyFull(totals.capPeriod2)}
                    </td>
                    <td className={cn(
                      "py-2 px-2 text-right text-xs font-semibold",
                      isOverBudget("capPeriod3") ? "text-red-600" : "text-foreground"
                    )}>
                      {formatCurrencyFull(totals.capPeriod3)}
                    </td>
                    <td className={cn(
                      "py-2 px-2 text-right text-xs font-semibold border-l border-border",
                      isOverNilBudget("nil2026") ? "text-red-600" : "text-foreground"
                    )}>
                      {formatCurrencyFull(totals.nil2026)}
                    </td>
                    <td className={cn(
                      "py-2 px-2 text-right text-xs font-semibold",
                      isOverNilBudget("nil2027") ? "text-red-600" : "text-foreground"
                    )}>
                      {formatCurrencyFull(totals.nil2027)}
                    </td>
                    <td className="py-2 px-2 text-right text-xs font-bold text-foreground border-l border-border">
                      {formatCurrencyFull(totals.total)}
                    </td>
                    <td colSpan={4} className="border-l border-border"></td>
                  </tr>
                  <tr className="bg-muted/40">
                    <td className="py-1.5 px-2 text-xs text-muted-foreground" colSpan={2}>Budget per Period</td>
                    <td className="py-1.5 px-2 text-right text-xs text-muted-foreground">{formatCurrencyFull(totals.rsBudget)}</td>
                    <td className="py-1.5 px-2 text-right text-xs text-muted-foreground">{formatCurrencyFull(totals.rsBudget)}</td>
                    <td className="py-1.5 px-2 text-right text-xs text-muted-foreground">{formatCurrencyFull(totals.rsBudget)}</td>
                    <td className="py-1.5 px-2 text-right text-xs text-muted-foreground border-l border-border">{formatCurrencyFull(totals.nilBudget)}</td>
                    <td className="py-1.5 px-2 text-right text-xs text-muted-foreground">{formatCurrencyFull(totals.nilBudget)}</td>
                    <td className="py-1.5 px-2 text-right text-xs text-muted-foreground border-l border-border">{formatCurrencyFull(totals.totalBudget)}</td>
                    <td colSpan={4} className="border-l border-border"></td>
                  </tr>
                  <tr className="bg-muted/40">
                    <td className="py-1.5 px-2 text-xs font-medium text-muted-foreground" colSpan={2}>Remaining</td>
                    <td className={cn(
                      "py-1.5 px-2 text-right text-xs font-semibold",
                      totals.remainingCp1 < 0 ? "text-red-600" : "text-emerald-600"
                    )}>
                      {totals.remainingCp1 < 0 ? `-${formatCurrencyFull(Math.abs(totals.remainingCp1))}` : formatCurrencyFull(totals.remainingCp1)}
                    </td>
                    <td className={cn(
                      "py-1.5 px-2 text-right text-xs font-semibold",
                      totals.remainingCp2 < 0 ? "text-red-600" : "text-emerald-600"
                    )}>
                      {totals.remainingCp2 < 0 ? `-${formatCurrencyFull(Math.abs(totals.remainingCp2))}` : formatCurrencyFull(totals.remainingCp2)}
                    </td>
                    <td className={cn(
                      "py-1.5 px-2 text-right text-xs font-semibold",
                      totals.remainingCp3 < 0 ? "text-red-600" : "text-emerald-600"
                    )}>
                      {totals.remainingCp3 < 0 ? `-${formatCurrencyFull(Math.abs(totals.remainingCp3))}` : formatCurrencyFull(totals.remainingCp3)}
                    </td>
                    <td className={cn(
                      "py-1.5 px-2 text-right text-xs font-semibold border-l border-border",
                      totals.remainingNil26 < 0 ? "text-red-600" : "text-emerald-600"
                    )}>
                      {totals.remainingNil26 < 0 ? `-${formatCurrencyFull(Math.abs(totals.remainingNil26))}` : formatCurrencyFull(totals.remainingNil26)}
                    </td>
                    <td className={cn(
                      "py-1.5 px-2 text-right text-xs font-semibold",
                      totals.remainingNil27 < 0 ? "text-red-600" : "text-emerald-600"
                    )}>
                      {totals.remainingNil27 < 0 ? `-${formatCurrencyFull(Math.abs(totals.remainingNil27))}` : formatCurrencyFull(totals.remainingNil27)}
                    </td>
                    <td className={cn(
                      "py-1.5 px-2 text-right text-xs font-bold border-l border-border",
                      totals.remaining < 0 ? "text-red-600" : "text-emerald-600"
                    )}>
                      {totals.remaining < 0 ? `-${formatCurrencyFull(Math.abs(totals.remaining))}` : formatCurrencyFull(totals.remaining)}
                    </td>
                    <td colSpan={4} className="border-l border-border"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create New Athlete Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Athlete</DialogTitle>
            <DialogDescription>Add a new athlete to the system.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  value={newAthleteForm.firstName}
                  onChange={(e) => setNewAthleteForm({ ...newAthleteForm, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name <span className="text-destructive">*</span></Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  value={newAthleteForm.lastName}
                  onChange={(e) => setNewAthleteForm({ ...newAthleteForm, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentEmail">Student Email</Label>
              <Input
                id="studentEmail"
                type="email"
                placeholder="student@university.edu"
                value={newAthleteForm.studentEmail}
                onChange={(e) => setNewAthleteForm({ ...newAthleteForm, studentEmail: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Sport</Label>
                <Input
                  value={team?.sport || "Men's Basketball"}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  placeholder="e.g., PG, SG, SF"
                  value={newAthleteForm.position}
                  onChange={(e) => setNewAthleteForm({ ...newAthleteForm, position: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="ghost" onClick={closeCreateModal}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateNewAthlete}
                disabled={!newAthleteForm.firstName.trim() || !newAthleteForm.lastName.trim()}
              >
                Add to Roster
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
