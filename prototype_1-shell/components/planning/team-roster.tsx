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
  getTeamById, 
  getRosterByTeam, 
  getNilSponsorshipRosterByTeam,
  formatCurrency,
  formatCurrencyFull,
  EXISTING_ATHLETES,
  type RosterEntry,
  type NilSponsorshipEntry 
} from "@/lib/planning-data"
import { ArrowLeft, ArrowRight, Plus, Eye, ChevronUp, ChevronDown, Search, UserPlus } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

type RosterTab = "revenue-share" | "nil-sponsorship"

interface TeamRosterProps {
  teamId: string
}

export function TeamRoster({ teamId }: TeamRosterProps) {
  const router = useRouter()
  const team = getTeamById(teamId)
  const initialRoster = getRosterByTeam(teamId)
  const initialNilRoster = getNilSponsorshipRosterByTeam(teamId)
  
  // Tab state
  const [activeTab, setActiveTab] = useState<RosterTab>("revenue-share")
  
  // Revenue Share roster state
  const [roster, setRoster] = useState<RosterEntry[]>(initialRoster)
  
  // NIL Sponsorship roster state
  const [nilRoster, setNilRoster] = useState<NilSponsorshipEntry[]>(initialNilRoster)
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

  // NIL Sponsorship specific state
  const [nilSortField, setNilSortField] = useState<"name" | "amount" | null>(null)
  const [nilSortDirection, setNilSortDirection] = useState<"asc" | "desc">("asc")
  const [showNilAddRow, setShowNilAddRow] = useState(false)
  const [nilSearchQuery, setNilSearchQuery] = useState("")

  // Calculate totals
  const totals = useMemo(() => {
    const capPeriod1 = roster.reduce((sum, r) => sum + r.capPeriod1, 0)
    const capPeriod2 = roster.reduce((sum, r) => sum + r.capPeriod2, 0)
    const capPeriod3 = roster.reduce((sum, r) => sum + r.capPeriod3, 0)
    const total = capPeriod1 + capPeriod2 + capPeriod3
    const budget = team ? team.budget : 0
    const totalBudget = budget * 3
    
    return {
      capPeriod1,
      capPeriod2,
      capPeriod3,
      total,
      budget,
      totalBudget,
      remaining: totalBudget - total,
      remainingPeriod1: budget - capPeriod1,
      remainingPeriod2: budget - capPeriod2,
      remainingPeriod3: budget - capPeriod3,
    }
  }, [roster, team])

  // Sort roster
  const sortedRoster = useMemo(() => {
    if (!sortField) return roster
    
    return [...roster].sort((a, b) => {
      let aVal: string | number = a.athleteName
      let bVal: string | number = b.athleteName
      
      if (sortField === "total") {
        aVal = a.capPeriod1 + a.capPeriod2 + a.capPeriod3
        bVal = b.capPeriod1 + b.capPeriod2 + b.capPeriod3
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

  // Direct value update for editable cells
  const handleValueChange = (entryId: string, field: "capPeriod1" | "capPeriod2" | "capPeriod3", value: string) => {
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
    }
    setRoster(prev => [...prev, newEntry])
    closeCreateModal()
  }

  const openCreateModal = () => {
    // Pre-fill the name if user typed something that didn't match
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
    setShowNilAddRow(false)
    setSearchQuery("")
    setNilSearchQuery("")
    setNewAthleteForm({ firstName: "", lastName: "", studentEmail: "", position: "" })
  }

  // NIL Sponsorship computed values
  const nilTotals = useMemo(() => {
    const total = nilRoster.reduce((sum, r) => sum + r.indicatedAmount, 0)
    return { total, athleteCount: nilRoster.length }
  }, [nilRoster])

  const sortedNilRoster = useMemo(() => {
    if (!nilSortField) return nilRoster
    
    return [...nilRoster].sort((a, b) => {
      let aVal: string | number = a.athleteName
      let bVal: string | number = b.athleteName
      
      if (nilSortField === "amount") {
        aVal = a.indicatedAmount
        bVal = b.indicatedAmount
      }
      
      if (nilSortDirection === "asc") {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      }
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
    })
  }, [nilRoster, nilSortField, nilSortDirection])

  const handleNilSort = (field: "name" | "amount") => {
    if (nilSortField === field) {
      setNilSortDirection(d => d === "asc" ? "desc" : "asc")
    } else {
      setNilSortField(field)
      setNilSortDirection("asc")
    }
  }

  const handleNilValueChange = (entryId: string, value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0
    setNilRoster(prev => prev.map(entry => {
      if (entry.id === entryId) {
        return { ...entry, indicatedAmount: numValue }
      }
      return entry
    }))
  }

  // Search results for NIL roster inline add
  const nilSearchResults = useMemo(() => {
    if (!nilSearchQuery.trim()) return []
    const existingIds = nilRoster.map(r => r.athleteId)
    return EXISTING_ATHLETES
      .filter(a => 
        !existingIds.includes(a.id) &&
        a.name.toLowerCase().includes(nilSearchQuery.toLowerCase())
      )
      .slice(0, 5)
  }, [nilSearchQuery, nilRoster])

  const handleAddNilAthlete = (athlete: typeof EXISTING_ATHLETES[0]) => {
    const newEntry: NilSponsorshipEntry = {
      id: `nil-roster-${teamId}-${Date.now()}`,
      athleteId: athlete.id,
      athleteName: athlete.name,
      teamId,
      position: athlete.position,
      graduatingYear: athlete.graduatingYear,
      indicatedAmount: 0,
      ioiStatus: "none",
    }
    setNilRoster(prev => [...prev, newEntry])
    setShowNilAddRow(false)
    setNilSearchQuery("")
  }

  const handleCreateNewNilAthlete = () => {
    if (!newAthleteForm.firstName.trim() || !newAthleteForm.lastName.trim()) return
    
    const fullName = `${newAthleteForm.firstName} ${newAthleteForm.lastName}`
    const newEntry: NilSponsorshipEntry = {
      id: `nil-roster-${teamId}-${Date.now()}`,
      athleteId: `athlete-new-${Date.now()}`,
      athleteName: fullName,
      teamId,
      position: newAthleteForm.position || "TBD",
      graduatingYear: new Date().getFullYear() + 2,
      indicatedAmount: 0,
      ioiStatus: "none",
    }
    setNilRoster(prev => [...prev, newEntry])
    closeCreateModal()
  }

  const openNilCreateModal = () => {
    if (nilSearchQuery.trim()) {
      const parts = nilSearchQuery.trim().split(" ")
      setNewAthleteForm({
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
        studentEmail: "",
        position: "",
      })
    }
    setShowCreateModal(true)
  }

  const handleBuildIOI = (entry: NilSponsorshipEntry) => {
    // Navigate to contract builder with IOI pre-selected
    const params = new URLSearchParams({
      build: "ioi",
      amount: String(entry.indicatedAmount),
    })
    router.push(`/beneficiaries/${entry.athleteId}?${params.toString()}`)
  }

  const getNilStatusBadge = (status: NilSponsorshipEntry["ioiStatus"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-0">Active</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0">Pending</Badge>
      case "none":
        return <Badge variant="secondary" className="bg-muted text-muted-foreground">Planning</Badge>
    }
  }

  const handleBuildContract = (entry: RosterEntry) => {
    // Navigate directly to the contract builder with revshare pre-selected and values populated
    const params = new URLSearchParams({
      build: "revshare",
      cp1: String(entry.capPeriod1),
      cp2: String(entry.capPeriod2),
      cp3: String(entry.capPeriod3),
    })
    router.push(`/beneficiaries/${entry.athleteId}?${params.toString()}`)
  }

  const getStatusBadge = (status: RosterEntry["contractStatus"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-0">Active</Badge>
      case "in-review":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0">In Review</Badge>
      case "none":
        return <Badge variant="secondary" className="bg-muted text-muted-foreground">Planning</Badge>
    }
  }

  const isOverBudget = (period: "capPeriod1" | "capPeriod2" | "capPeriod3") => {
    const periodTotal = roster.reduce((sum, r) => sum + r[period], 0)
    return periodTotal > (team?.budget || 0)
  }

  if (!team) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Team not found</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
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
                {activeTab === "revenue-share" 
                  ? `${roster.length} athletes | Budget: ${formatCurrency(totals.totalBudget)} across 3 cap periods`
                  : `${nilRoster.length} athletes | Total Indicated: ${formatCurrency(nilTotals.total)}`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex gap-6 border-b" aria-label="Roster type tabs">
          {([
            { id: "revenue-share", label: "Revenue Share" },
            { id: "nil-sponsorship", label: "NIL Sponsorship" },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Revenue Share Tab Content */}
        {activeTab === "revenue-share" && (
          <>
        {/* Budget Summary Cards - 3 Cap Periods */}
        <div className="grid grid-cols-3 gap-4">
          {CAP_PERIODS.map((cp, i) => {
            const periodKey = `capPeriod${i + 1}` as "capPeriod1" | "capPeriod2" | "capPeriod3"
            const allocated = totals[periodKey]
            const remaining = totals.budget - allocated
            const percentage = (allocated / totals.budget) * 100
            const over = remaining < 0
            
            // Calculate committed (active contracts) vs in review (draft/pending)
            const committed = roster.reduce((sum, r) => {
              if (r.contractStatus === "active") {
                return sum + r[periodKey]
              }
              return sum
            }, 0)
            const inReview = allocated - committed
            
            return (
              <Card key={cp.id} className={cn(
                "border-border",
                over && "border-red-200 bg-red-50/50"
              )}>
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
                      {/* Stacked bar: committed (black) + in review (green) */}
                      <div className="h-full flex">
                        <div 
                          className={cn(
                            "h-full transition-all",
                            over ? "bg-red-600" : "bg-foreground"
                          )}
                          style={{ width: `${Math.min(100, (committed / totals.budget) * 100)}%` }}
                        />
                        <div 
                          className={cn(
                            "h-full transition-all",
                            over ? "bg-red-300" : "bg-emerald-500"
                          )}
                          style={{ width: `${Math.min(100 - (committed / totals.budget) * 100, (inReview / totals.budget) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-right">
                      Budget: {formatCurrency(totals.budget)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Roster Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-wide text-muted-foreground font-semibold w-[220px]">
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
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-wide text-muted-foreground font-semibold w-[80px]">Pos</th>
                    <th className={cn(
                      "text-right py-3 px-4 text-xs tracking-wide font-semibold w-[130px]",
                      isOverBudget("capPeriod1") ? "text-red-600" : "text-muted-foreground"
                    )}>
                      {CAP_PERIODS[0].label}
                    </th>
                    <th className={cn(
                      "text-right py-3 px-4 text-xs tracking-wide font-semibold w-[130px]",
                      isOverBudget("capPeriod2") ? "text-red-600" : "text-muted-foreground"
                    )}>
                      {CAP_PERIODS[1].label}
                    </th>
                    <th className={cn(
                      "text-right py-3 px-4 text-xs tracking-wide font-semibold w-[130px]",
                      isOverBudget("capPeriod3") ? "text-red-600" : "text-muted-foreground"
                    )}>
                      {CAP_PERIODS[2].label}
                    </th>
                    <th className="text-right py-3 px-4 text-xs uppercase tracking-wide text-muted-foreground font-semibold w-[120px]">
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
                    <th className="text-center py-3 px-4 text-xs uppercase tracking-wide text-muted-foreground font-semibold w-[100px]">Status</th>
                    <th className="text-right py-3 px-4 text-xs uppercase tracking-wide text-muted-foreground font-semibold w-[120px]">Contract</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRoster.map((entry) => {
                    const total = entry.capPeriod1 + entry.capPeriod2 + entry.capPeriod3
                    const isEditable = entry.contractStatus === "none"
                    
                    return (
                      <tr key={entry.id} className="border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-medium text-foreground">{entry.athleteName}</span>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{entry.position}</td>
                        
                        {/* Cap Period 1 */}
                        <td className="py-2 px-4 text-right">
                          {isEditable ? (
                            <Input
                              type="text"
                              value={entry.capPeriod1 ? entry.capPeriod1.toLocaleString() : ""}
                              onChange={(e) => handleValueChange(entry.id, "capPeriod1", e.target.value)}
                              className="h-8 w-28 text-right ml-auto"
                              placeholder="0"
                            />
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              {formatCurrencyFull(entry.capPeriod1)}
                            </span>
                          )}
                        </td>
                        
                        {/* Cap Period 2 */}
                        <td className="py-2 px-4 text-right">
                          {isEditable ? (
                            <Input
                              type="text"
                              value={entry.capPeriod2 ? entry.capPeriod2.toLocaleString() : ""}
                              onChange={(e) => handleValueChange(entry.id, "capPeriod2", e.target.value)}
                              className="h-8 w-28 text-right ml-auto"
                              placeholder="0"
                            />
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              {formatCurrencyFull(entry.capPeriod2)}
                            </span>
                          )}
                        </td>
                        
                        {/* Cap Period 3 */}
                        <td className="py-2 px-4 text-right">
                          {isEditable ? (
                            <Input
                              type="text"
                              value={entry.capPeriod3 ? entry.capPeriod3.toLocaleString() : ""}
                              onChange={(e) => handleValueChange(entry.id, "capPeriod3", e.target.value)}
                              className="h-8 w-28 text-right ml-auto"
                              placeholder="0"
                            />
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              {formatCurrencyFull(entry.capPeriod3)}
                            </span>
                          )}
                        </td>
                        
                        <td className="py-3 px-4 text-right">
                          <span className="text-sm font-semibold text-foreground">
                            {formatCurrencyFull(total)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {getStatusBadge(entry.contractStatus)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {entry.contractStatus === "none" ? (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleBuildContract(entry)}
                              disabled={total === 0}
                            >
                              Build
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={entry.contractId ? `/contracts/${entry.contractStatus === "active" ? "active" : "negotiation"}/${entry.contractId}` : "#"}>
                                <Eye className="h-3.5 w-3.5 mr-1" />
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
                      <td colSpan={8} className="py-3 px-4">
                        <div className="relative max-w-sm">
                          <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Search for athlete..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onBlur={() => {
                              // Delay to allow click on results
                              setTimeout(() => {
                                if (!searchQuery) {
                                  setShowAddRow(false)
                                }
                              }, 200)
                            }}
                            className="h-8 pl-8"
                            autoFocus
                          />
                          {/* Dropdown results */}
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
                              {/* Create new option - always shown when typing */}
                              <button
                                onClick={openCreateModal}
                                className="w-full text-left px-3 py-2 hover:bg-muted text-sm flex items-center gap-2 text-emerald-600 font-medium"
                              >
                                <UserPlus className="h-3.5 w-3.5" />
                                Create "{searchQuery.trim()}"
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr className="border-b hover:bg-muted/20 transition-colors">
                      <td colSpan={8} className="py-2 px-4">
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
                    <td className="py-3 px-4 font-semibold text-foreground" colSpan={2}>Total Allocated</td>
                    <td className={cn(
                      "py-3 px-4 text-right font-semibold",
                      isOverBudget("capPeriod1") ? "text-red-600" : "text-foreground"
                    )}>
                      {formatCurrencyFull(totals.capPeriod1)}
                    </td>
                    <td className={cn(
                      "py-3 px-4 text-right font-semibold",
                      isOverBudget("capPeriod2") ? "text-red-600" : "text-foreground"
                    )}>
                      {formatCurrencyFull(totals.capPeriod2)}
                    </td>
                    <td className={cn(
                      "py-3 px-4 text-right font-semibold",
                      isOverBudget("capPeriod3") ? "text-red-600" : "text-foreground"
                    )}>
                      {formatCurrencyFull(totals.capPeriod3)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-foreground">
                      {formatCurrencyFull(totals.total)}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                  <tr className="bg-muted/40">
                    <td className="py-2 px-4 text-sm text-muted-foreground" colSpan={2}>Budget per Period</td>
                    <td className="py-2 px-4 text-right text-sm text-muted-foreground">{formatCurrencyFull(totals.budget)}</td>
                    <td className="py-2 px-4 text-right text-sm text-muted-foreground">{formatCurrencyFull(totals.budget)}</td>
                    <td className="py-2 px-4 text-right text-sm text-muted-foreground">{formatCurrencyFull(totals.budget)}</td>
                    <td className="py-2 px-4 text-right text-sm text-muted-foreground">{formatCurrencyFull(totals.totalBudget)}</td>
                    <td colSpan={2}></td>
                  </tr>
                  <tr className="bg-muted/40">
                    <td className="py-2 px-4 text-sm font-medium text-muted-foreground" colSpan={2}>Remaining</td>
                    <td className={cn(
                      "py-2 px-4 text-right text-sm font-semibold",
                      totals.remainingPeriod1 < 0 ? "text-red-600" : "text-emerald-600"
                    )}>
                      {totals.remainingPeriod1 < 0 ? `-${formatCurrencyFull(Math.abs(totals.remainingPeriod1))}` : formatCurrencyFull(totals.remainingPeriod1)}
                    </td>
                    <td className={cn(
                      "py-2 px-4 text-right text-sm font-semibold",
                      totals.remainingPeriod2 < 0 ? "text-red-600" : "text-emerald-600"
                    )}>
                      {totals.remainingPeriod2 < 0 ? `-${formatCurrencyFull(Math.abs(totals.remainingPeriod2))}` : formatCurrencyFull(totals.remainingPeriod2)}
                    </td>
                    <td className={cn(
                      "py-2 px-4 text-right text-sm font-semibold",
                      totals.remainingPeriod3 < 0 ? "text-red-600" : "text-emerald-600"
                    )}>
                      {totals.remainingPeriod3 < 0 ? `-${formatCurrencyFull(Math.abs(totals.remainingPeriod3))}` : formatCurrencyFull(totals.remainingPeriod3)}
                    </td>
                    <td className={cn(
                      "py-2 px-4 text-right text-sm font-bold",
                      totals.remaining < 0 ? "text-red-600" : "text-emerald-600"
                    )}>
                      {totals.remaining < 0 ? `-${formatCurrencyFull(Math.abs(totals.remaining))}` : formatCurrencyFull(totals.remaining)}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
          </>
        )}

        {/* NIL Sponsorship Tab Content */}
        {activeTab === "nil-sponsorship" && (
          <>
            {/* Summary Card */}
            <Card className="border-border">
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Total Indicated NIL Sponsorships</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(nilTotals.total)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{nilTotals.athleteCount} athletes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* NIL Sponsorship Roster Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left py-3 px-4 text-xs uppercase tracking-wide text-muted-foreground font-semibold w-[220px]">
                          <button 
                            onClick={() => handleNilSort("name")} 
                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                          >
                            Name
                            {nilSortField === "name" && (
                              nilSortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                            )}
                          </button>
                        </th>
                        <th className="text-left py-3 px-4 text-xs uppercase tracking-wide text-muted-foreground font-semibold w-[80px]">Pos</th>
                        <th className="text-right py-3 px-4 text-xs uppercase tracking-wide text-muted-foreground font-semibold w-[180px]">
                          <button 
                            onClick={() => handleNilSort("amount")} 
                            className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors"
                          >
                            Indicated Amount
                            {nilSortField === "amount" && (
                              nilSortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                            )}
                          </button>
                        </th>
                        <th className="text-center py-3 px-4 text-xs uppercase tracking-wide text-muted-foreground font-semibold w-[100px]">Status</th>
                        <th className="text-right py-3 px-4 text-xs uppercase tracking-wide text-muted-foreground font-semibold w-[120px]">IOI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedNilRoster.map((entry) => {
                        const isEditable = entry.ioiStatus === "none"
                        
                        return (
                          <tr key={entry.id} className="border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                            <td className="py-3 px-4">
                              <span className="font-medium text-foreground">{entry.athleteName}</span>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{entry.position}</td>
                            
                            {/* Indicated Amount */}
                            <td className="py-2 px-4 text-right">
                              {isEditable ? (
                                <Input
                                  type="text"
                                  value={entry.indicatedAmount ? entry.indicatedAmount.toLocaleString() : ""}
                                  onChange={(e) => handleNilValueChange(entry.id, e.target.value)}
                                  className="h-8 w-32 text-right ml-auto"
                                  placeholder="0"
                                />
                              ) : (
                                <span className="text-sm font-semibold text-foreground">
                                  {formatCurrencyFull(entry.indicatedAmount)}
                                </span>
                              )}
                            </td>
                            
                            <td className="py-3 px-4 text-center">
                              {getNilStatusBadge(entry.ioiStatus)}
                            </td>
                            <td className="py-3 px-4 text-right">
                              {entry.ioiStatus === "none" ? (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleBuildIOI(entry)}
                                  disabled={entry.indicatedAmount === 0}
                                >
                                  Build
                                  <ArrowRight className="ml-1 h-3 w-3" />
                                </Button>
                              ) : (
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={entry.ioiId ? `/contracts/ioi/${entry.ioiId}` : "#"}>
                                    <Eye className="h-3.5 w-3.5 mr-1" />
                                    View
                                  </Link>
                                </Button>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                      
                      {/* Add Athlete Row - Inline Search */}
                      {showNilAddRow ? (
                        <tr className="border-b bg-muted/10">
                          <td colSpan={5} className="py-3 px-4">
                            <div className="relative max-w-sm">
                              <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="text"
                                placeholder="Search for athlete..."
                                value={nilSearchQuery}
                                onChange={(e) => setNilSearchQuery(e.target.value)}
                                onBlur={() => {
                                  setTimeout(() => {
                                    if (!nilSearchQuery) {
                                      setShowNilAddRow(false)
                                    }
                                  }, 200)
                                }}
                                className="h-8 pl-8"
                                autoFocus
                              />
                              {/* Dropdown results */}
                              {nilSearchQuery && (
                                <div className="absolute top-full left-0 right-0 mt-1 border rounded-md bg-background shadow-lg z-10 max-h-48 overflow-y-auto">
                                  {nilSearchResults.map(athlete => (
                                    <button
                                      key={athlete.id}
                                      onClick={() => handleAddNilAthlete(athlete)}
                                      className="w-full text-left px-3 py-2 hover:bg-muted text-sm flex justify-between items-center border-b last:border-b-0"
                                    >
                                      <span className="font-medium">{athlete.name}</span>
                                      <span className="text-muted-foreground text-xs">{athlete.position}</span>
                                    </button>
                                  ))}
                                  {/* Create new option */}
                                  <button
                                    onClick={openNilCreateModal}
                                    className="w-full text-left px-3 py-2 hover:bg-muted text-sm flex items-center gap-2 text-emerald-600 font-medium"
                                  >
                                    <UserPlus className="h-3.5 w-3.5" />
                                    Create "{nilSearchQuery.trim()}"
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <tr className="border-b hover:bg-muted/20 transition-colors">
                          <td colSpan={5} className="py-2 px-4">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setShowNilAddRow(true)}
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
                        <td className="py-3 px-4 font-semibold text-foreground" colSpan={2}>Total Indicated</td>
                        <td className="py-3 px-4 text-right font-bold text-foreground">
                          {formatCurrencyFull(nilTotals.total)}
                        </td>
                        <td colSpan={2}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
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
                  value={team?.sport || "Basketball"}
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
                onClick={activeTab === "revenue-share" ? handleCreateNewAthlete : handleCreateNewNilAthlete}
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
