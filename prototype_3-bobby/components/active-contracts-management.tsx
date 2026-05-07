"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  X,
  CheckCircle2,
  Pause,
  DollarSign,
  MoreHorizontal,
  FileCheck,
  TrendingUp,
  Star,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"

type ContractStatus = "active" | "paused"
type ContractType = "revenue_share" | "nil_sponsorship"

interface ActiveContract {
  id: string
  title: string
  athlete: string
  athleteId: string
  sport: string
  status: ContractStatus
  type: ContractType
  sponsor: string
  totalValue: number
  paidToDate: number
  paidPercentage: number
  startDate: string
  endDate: string
  seasons: string[]
  deliverables?: {
    completed: number
    total: number
  }
  nextPayment?: string
  isPriority?: boolean
}

const mockActiveContracts: ActiveContract[] = [
  // Ohio State Football - Revenue Share
  {
    id: "osu-001",
    title: "2025-26 Revenue Share Agreement",
    athlete: "Marcus Williams",
    athleteId: "osu-001",
    sport: "Football",
    status: "active",
    type: "revenue_share",
    sponsor: "Revenue Share",
    totalValue: 1000000,
    paidToDate: 142856,
    paidPercentage: 14,
    startDate: "2025-07-01",
    endDate: "2026-06-30",
    seasons: ["2025-26"],
    nextPayment: "2026-03-17",
    isPriority: true,
  },
  {
    id: "osu-002",
    title: "2025-26 Revenue Share Agreement",
    athlete: "Darius Thornton",
    athleteId: "osu-002",
    sport: "Football",
    status: "active",
    type: "revenue_share",
    sponsor: "Revenue Share",
    totalValue: 850000,
    paidToDate: 121428,
    paidPercentage: 14,
    startDate: "2025-07-01",
    endDate: "2026-06-30",
    seasons: ["2025-26"],
    nextPayment: "2026-03-17",
    isPriority: true,
  },
  {
    id: "osu-003",
    title: "2025-26 Revenue Share Agreement",
    athlete: "Cameron Reid",
    athleteId: "osu-003",
    sport: "Football",
    status: "active",
    type: "revenue_share",
    sponsor: "Revenue Share",
    totalValue: 720000,
    paidToDate: 102857,
    paidPercentage: 14,
    startDate: "2025-07-01",
    endDate: "2026-06-30",
    seasons: ["2025-26"],
    nextPayment: "2026-03-17",
  },
  {
    id: "osu-004",
    title: "Transfer Portal - Rev Share",
    athlete: "Aiden Brooks",
    athleteId: "osu-004",
    sport: "Football",
    status: "active",
    type: "revenue_share",
    sponsor: "Revenue Share",
    totalValue: 650000,
    paidToDate: 92857,
    paidPercentage: 14,
    startDate: "2025-07-01",
    endDate: "2026-06-30",
    seasons: ["2025-26"],
    nextPayment: "2026-03-17",
  },
  {
    id: "osu-005",
    title: "2025-26 Revenue Share Agreement",
    athlete: "Devon Mitchell",
    athleteId: "osu-005",
    sport: "Football",
    status: "active",
    type: "revenue_share",
    sponsor: "Revenue Share",
    totalValue: 580000,
    paidToDate: 82857,
    paidPercentage: 14,
    startDate: "2025-07-01",
    endDate: "2026-06-30",
    seasons: ["2025-26"],
    nextPayment: "2026-03-17",
  },
  // Ohio State Basketball - Revenue Share
  {
    id: "osu-006",
    title: "2025-26 Revenue Share Agreement",
    athlete: "Jaylen Carter",
    athleteId: "osu-006",
    sport: "Men's Basketball",
    status: "active",
    type: "revenue_share",
    sponsor: "Revenue Share",
    totalValue: 520000,
    paidToDate: 74285,
    paidPercentage: 14,
    startDate: "2025-07-01",
    endDate: "2026-06-30",
    seasons: ["2025-26"],
    nextPayment: "2026-03-17",
    isPriority: true,
  },
  {
    id: "osu-007",
    title: "2025-26 Revenue Share Agreement",
    athlete: "Andre Williams",
    athleteId: "osu-007",
    sport: "Men's Basketball",
    status: "active",
    type: "revenue_share",
    sponsor: "Revenue Share",
    totalValue: 480000,
    paidToDate: 68571,
    paidPercentage: 14,
    startDate: "2025-07-01",
    endDate: "2026-06-30",
    seasons: ["2025-26"],
    nextPayment: "2026-03-17",
  },
  {
    id: "osu-008",
    title: "2025-26 Revenue Share Agreement",
    athlete: "Tyrell Jackson",
    athleteId: "osu-008",
    sport: "Men's Basketball",
    status: "active",
    type: "revenue_share",
    sponsor: "Revenue Share",
    totalValue: 425000,
    paidToDate: 60714,
    paidPercentage: 14,
    startDate: "2025-07-01",
    endDate: "2026-06-30",
    seasons: ["2025-26"],
    nextPayment: "2026-03-17",
  },
  // More Football contracts
  {
    id: "osu-009",
    title: "Roster Retention Package",
    athlete: "Quincy Adams",
    athleteId: "osu-009",
    sport: "Football",
    status: "active",
    type: "revenue_share",
    sponsor: "Revenue Share",
    totalValue: 400000,
    paidToDate: 57142,
    paidPercentage: 14,
    startDate: "2025-07-01",
    endDate: "2026-06-30",
    seasons: ["2025-26"],
    nextPayment: "2026-03-17",
  },
  {
    id: "osu-010",
    title: "2025-26 Revenue Share Agreement",
    athlete: "Terrell Washington",
    athleteId: "osu-010",
    sport: "Football",
    status: "active",
    type: "revenue_share",
    sponsor: "Revenue Share",
    totalValue: 380000,
    paidToDate: 54285,
    paidPercentage: 14,
    startDate: "2025-07-01",
    endDate: "2026-06-30",
    seasons: ["2025-26"],
    nextPayment: "2026-03-17",
  },
  {
    id: "osu-011",
    title: "Transfer Portal - Rev Share",
    athlete: "Xavier Thompson",
    athleteId: "osu-011",
    sport: "Football",
    status: "active",
    type: "revenue_share",
    sponsor: "Revenue Share",
    totalValue: 350000,
    paidToDate: 50000,
    paidPercentage: 14,
    startDate: "2025-07-01",
    endDate: "2026-06-30",
    seasons: ["2025-26"],
    nextPayment: "2026-03-17",
  },
  {
    id: "osu-012",
    title: "2025-26 Revenue Share Agreement",
    athlete: "Tyler Robinson",
    athleteId: "osu-012",
    sport: "Football",
    status: "active",
    type: "revenue_share",
    sponsor: "Revenue Share",
    totalValue: 320000,
    paidToDate: 45714,
    paidPercentage: 14,
    startDate: "2025-07-01",
    endDate: "2026-06-30",
    seasons: ["2025-26"],
    nextPayment: "2026-03-17",
  },
  {
    id: "osu-013",
    title: "Roster Retention Package",
    athlete: "Kevin Thompson",
    athleteId: "osu-013",
    sport: "Football",
    status: "paused",
    type: "revenue_share",
    sponsor: "Revenue Share",
    totalValue: 280000,
    paidToDate: 40000,
    paidPercentage: 14,
    startDate: "2025-07-01",
    endDate: "2026-06-30",
    seasons: ["2025-26"],
  },
  {
    id: "osu-014",
    title: "2025-26 Revenue Share Agreement",
    athlete: "Brandon Lewis",
    athleteId: "osu-014",
    sport: "Football",
    status: "active",
    type: "revenue_share",
    sponsor: "Revenue Share",
    totalValue: 250000,
    paidToDate: 35714,
    paidPercentage: 14,
    startDate: "2025-07-01",
    endDate: "2026-06-30",
    seasons: ["2025-26"],
    nextPayment: "2026-03-17",
  },
  {
    id: "osu-015",
    title: "2025-26 Revenue Share Agreement",
    athlete: "Marcus Johnson",
    athleteId: "osu-015",
    sport: "Football",
    status: "active",
    type: "revenue_share",
    sponsor: "Revenue Share",
    totalValue: 220000,
    paidToDate: 31428,
    paidPercentage: 14,
    startDate: "2025-07-01",
    endDate: "2026-06-30",
    seasons: ["2025-26"],
    nextPayment: "2026-03-17",
  },
]

const statusConfig = {
  active: {
    label: "Active",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    icon: CheckCircle2,
  },
  paused: {
    label: "Paused",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    icon: Pause,
  },
}

const typeConfig = {
  revenue_share: { label: "Revenue Share", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  nil_sponsorship: {
    label: "NIL Sponsorship",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  },
}

function formatSeasons(seasons: string[]): string {
  if (seasons.length === 1) {
    return seasons[0]
  } else if (seasons.length === 2) {
    // Multi-year format: "2025-26" "2026-27" => "2025-27"
    const first = seasons[0]
    const second = seasons[1]

    // Extract first year from first season and last year from last season
    const startYear = first.split("-")[0]
    const endYear = second.split("-")[1]

    return `${startYear}-${endYear}`
  }
  return seasons.join(", ")
}

export function ActiveContractsManagement() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [seasonFilters, setSeasonFilters] = useState<string[]>([])
  const [sportFilter, setSportFilter] = useState<string>("all")
  const [showPriorityOnly, setShowPriorityOnly] = useState(false)
  const [priorityContracts, setPriorityContracts] = useState<string[]>(
    mockActiveContracts.filter((c) => c.isPriority).map((c) => c.id),
  )
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const filteredContracts = mockActiveContracts.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.athlete.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sponsor.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    // Dropdown filters
    if (seasonFilters.length > 0 && !c.seasons.some((season) => seasonFilters.includes(season))) return false
    if (sportFilter !== "all" && c.sport !== sportFilter) return false

    // Priority filter
    if (showPriorityOnly && !priorityContracts.includes(c.id)) return false

    return true
  })

  const stats = {
    activeContracts: mockActiveContracts.filter((c) => c.status === "active").length,
    pausedContracts: mockActiveContracts.filter((c) => c.status === "paused").length,
    totalActiveValue: mockActiveContracts
      .filter((c) => c.status === "active")
      .reduce((sum, c) => sum + c.totalValue, 0),
    totalAthletes: mockActiveContracts.filter((c) => c.status === "active").length,
    dueThisMonth: 485000,
  }

  const activeFilterCount =
    (seasonFilters.length > 0 ? 1 : 0) +
    (sportFilter !== "all" ? 1 : 0) +
    (showPriorityOnly ? 1 : 0)

  const handleClearFilters = () => {
    setSeasonFilters([])
    setSportFilter("all")
    setShowPriorityOnly(false)
  }

  const togglePriority = (contractId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setPriorityContracts((prev) =>
      prev.includes(contractId) ? prev.filter((id) => id !== contractId) : [...prev, contractId],
    )
  }

  const toggleSeasonFilter = (season: string) => {
    setSeasonFilters((prev) => (prev.includes(season) ? prev.filter((s) => s !== season) : [...prev, season]))
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedContracts = [...filteredContracts].sort((a, b) => {
    if (!sortColumn) return 0

    let aValue: any
    let bValue: any

    switch (sortColumn) {
      case "status":
        aValue = a.status
        bValue = b.status
        break
      case "contract":
        aValue = a.title
        bValue = b.title
        break
      case "athlete":
        aValue = a.athlete
        bValue = b.athlete
        break
      case "sponsor":
        aValue = a.sponsor
        bValue = b.sponsor
        break
      case "season":
        aValue = a.seasons[0]
        bValue = b.seasons[0]
        break
      case "totalValue":
        aValue = a.totalValue
        bValue = b.totalValue
        break
      case "paidToDate":
        aValue = a.paidToDate
        bValue = b.paidToDate
        break
      case "deliverables":
        aValue = a.deliverables ? a.deliverables.completed / a.deliverables.total : 0
        bValue = b.deliverables ? b.deliverables.completed / b.deliverables.total : 0
        break
      case "nextPayment":
        aValue = a.nextPayment || ""
        bValue = b.nextPayment || ""
        break
      default:
        return 0
    }

    if (typeof aValue === "string") {
      const comparison = aValue.localeCompare(bValue)
      return sortDirection === "asc" ? comparison : -comparison
    } else {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }
  })

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-muted-foreground/50" />
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1 h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="ml-1 h-3.5 w-3.5" />
    )
  }

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Contracts</h1>
          <p className="text-muted-foreground">Manage active revenue share agreements</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeContracts}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently executing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paused</CardTitle>
            <Pause className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pausedContracts}</div>
            <p className="text-xs text-muted-foreground mt-1">Temporarily on hold</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Active Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats.totalActiveValue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground mt-1">Across all active agreements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Athletes</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAthletes}</div>
            <p className="text-xs text-muted-foreground mt-1">With active agreements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats.dueThisMonth / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground mt-1">Scheduled disbursements</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={sportFilter} onValueChange={setSportFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sports</SelectItem>
            <SelectItem value="Football">Football</SelectItem>
            <SelectItem value="Men's Basketball">Men&apos;s Basketball</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[150px] justify-between bg-transparent">
              {seasonFilters.length > 0 ? `Season (${seasonFilters.length})` : "All Seasons"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked={seasonFilters.includes("2024-25")}
              onCheckedChange={() => toggleSeasonFilter("2024-25")}
            >
              2024-25
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={seasonFilters.includes("2025-26")}
              onCheckedChange={() => toggleSeasonFilter("2025-26")}
            >
              2025-26
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={seasonFilters.includes("2026-27")}
              onCheckedChange={() => toggleSeasonFilter("2026-27")}
            >
              2026-27
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={seasonFilters.includes("2027-28")}
              onCheckedChange={() => toggleSeasonFilter("2027-28")}
            >
              2027-28
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={showPriorityOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setShowPriorityOnly(!showPriorityOnly)}
        >
          <Star className={`mr-1.5 h-3.5 w-3.5 ${showPriorityOnly ? "fill-current" : ""}`} />
          Priority
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search contracts, athletes, or sponsors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="icon" onClick={handleClearFilters} title="Clear all filters">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[120px]">
                  <button
                    onClick={() => handleSort("status")}
                    className="flex items-center font-medium hover:text-foreground"
                  >
                    Status
                    <SortIcon column="status" />
                  </button>
                </TableHead>
                <TableHead className="w-[280px]">
                  <button
                    onClick={() => handleSort("contract")}
                    className="flex items-center font-medium hover:text-foreground"
                  >
                    Contract
                    <SortIcon column="contract" />
                  </button>
                </TableHead>
                <TableHead className="w-[200px]">
                  <button
                    onClick={() => handleSort("athlete")}
                    className="flex items-center font-medium hover:text-foreground"
                  >
                    Athlete
                    <SortIcon column="athlete" />
                  </button>
                </TableHead>
                <TableHead className="w-[180px]">
                  <button
                    onClick={() => handleSort("sponsor")}
                    className="flex items-center font-medium hover:text-foreground"
                  >
                    Sponsor/Source
                    <SortIcon column="sponsor" />
                  </button>
                </TableHead>
                <TableHead className="w-[100px]">
                  <button
                    onClick={() => handleSort("season")}
                    className="flex items-center font-medium hover:text-foreground"
                  >
                    Season(s)
                    <SortIcon column="season" />
                  </button>
                </TableHead>
                <TableHead className="w-[130px]">
                  <button
                    onClick={() => handleSort("totalValue")}
                    className="flex items-center font-medium hover:text-foreground"
                  >
                    Total Value
                    <SortIcon column="totalValue" />
                  </button>
                </TableHead>
                <TableHead className="w-[150px]">
                  <button
                    onClick={() => handleSort("paidToDate")}
                    className="flex items-center font-medium hover:text-foreground"
                  >
                    Paid to Date
                    <SortIcon column="paidToDate" />
                  </button>
                </TableHead>
                <TableHead className="w-[140px]">
                  <button
                    onClick={() => handleSort("deliverables")}
                    className="flex items-center font-medium hover:text-foreground"
                  >
                    Deliverables
                    <SortIcon column="deliverables" />
                  </button>
                </TableHead>
                <TableHead className="w-[150px]">
                  <button
                    onClick={() => handleSort("nextPayment")}
                    className="flex items-center font-medium hover:text-foreground"
                  >
                    Next Payment
                    <SortIcon column="nextPayment" />
                  </button>
                </TableHead>
                <TableHead className="text-right w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedContracts.map((contract) => {
                const StatusIcon = statusConfig[contract.status].icon
                const progressPercentage = contract.deliverables
                  ? (contract.deliverables.completed / contract.deliverables.total) * 100
                  : 0
                const isPriority = priorityContracts.includes(contract.id)

                return (
                  <TableRow
                    key={contract.id}
                    className="cursor-pointer hover:bg-accent/50"
                    onClick={() => router.push(`/contracts/active/${contract.id}`)}
                  >
                    <TableCell>
                      <button
                        onClick={(e) => togglePriority(contract.id, e)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-4 w-4 ${isPriority ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      </button>
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary" className={statusConfig[contract.status].color}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {statusConfig[contract.status].label}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{contract.title}</div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={typeConfig[contract.type].color}>
                            {typeConfig[contract.type].label}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(contract.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          -{" "}
                          {new Date(contract.endDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="font-medium">{contract.athlete}</div>
                        <div className="text-xs text-muted-foreground">{contract.sport}</div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-medium">{contract.sponsor}</div>
                    </TableCell>

                    <TableCell>
                      <div className="font-medium">{formatSeasons(contract.seasons)}</div>
                    </TableCell>

                    <TableCell>
                      <div className="font-medium">${(contract.totalValue / 1000).toFixed(0)}K</div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="font-medium">${(contract.paidToDate / 1000).toFixed(0)}K</div>
                        <div className="text-xs text-muted-foreground">{contract.paidPercentage}%</div>
                      </div>
                    </TableCell>

                    <TableCell>
                      {contract.deliverables ? (
                        <div className="space-y-1.5">
                          <div className="text-xs font-medium">
                            {contract.deliverables.completed}/{contract.deliverables.total}
                          </div>
                          <Progress value={progressPercentage} className="h-1.5" />
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {contract.nextPayment ? (
                        <div className="text-sm">
                          {contract.nextPayment.startsWith("2")
                            ? new Date(contract.nextPayment).toLocaleDateString("en-US", {
                                month: "2-digit",
                                day: "2-digit",
                                year: "numeric",
                              })
                            : contract.nextPayment}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>View Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Edit Contract</DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            {contract.status === "active" ? "Pause" : "Resume"} Contract
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Download PDF</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
