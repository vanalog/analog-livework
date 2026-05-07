"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"

import { DropdownMenuContent } from "@/components/ui/dropdown-menu"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { DropdownMenu } from "@/components/ui/dropdown-menu"

import { SelectItem } from "@/components/ui/select"

import { SelectContent } from "@/components/ui/select"

import { SelectValue } from "@/components/ui/select"

import { SelectTrigger } from "@/components/ui/select"

import { Select } from "@/components/ui/select"

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
  Clock,
  XCircle,
  FileX,
  DollarSign,
  TrendingDown,
  Archive,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { MoreHorizontal } from "lucide-react"

type ClosureReason = "fulfilled" | "expired" | "terminated" | "cancelled"
type ContractType = "revenue_share" | "nil_sponsorship"

interface ClosedContract {
  id: string
  title: string
  athlete: string
  athleteId: string
  sport: string
  closureReason: ClosureReason
  type: ContractType
  sponsor: string
  season: string
  originalValue: number
  finalDisbursed: number
  disbursedPercentage: number
  closedDate: string
  termDates: string
}

const mockClosedContracts: ClosedContract[] = [
  {
    id: "closed-001",
    title: "Dillard's NIL Partnership",
    athlete: "Marcus Johnson",
    athleteId: "ARK-BKB-010",
    sport: "Men's Basketball",
    closureReason: "fulfilled",
    type: "nil_sponsorship",
    sponsor: "Dillard's",
    season: "2023-24",
    originalValue: 100000,
    finalDisbursed: 100000,
    disbursedPercentage: 100,
    closedDate: "2024-08-31",
    termDates: "Sep 2023 - Aug 2024",
  },
  {
    id: "closed-002",
    title: "2024-25 Benefits Pool Agreement",
    athlete: "Chris Olave",
    athleteId: "ESU-FB-020",
    sport: "Football",
    closureReason: "fulfilled",
    type: "revenue_share",
    sponsor: "Revenue Share",
    season: "2023-24",
    originalValue: 650000,
    finalDisbursed: 650000,
    disbursedPercentage: 100,
    closedDate: "2024-12-31",
    termDates: "Jan 2024 - Dec 2024",
  },
  {
    id: "closed-003",
    title: "Pro Camps Youth Program",
    athlete: "Tyler Davis",
    athleteId: "ARK-BKB-012",
    sport: "Men's Basketball",
    closureReason: "expired",
    type: "nil_sponsorship",
    sponsor: "Pro Camps",
    season: "2023-24",
    originalValue: 60000,
    finalDisbursed: 60000,
    disbursedPercentage: 100,
    closedDate: "2024-06-30",
    termDates: "Jul 2023 - Jun 2024",
  },
  {
    id: "closed-004",
    title: "Tyson Foods Ambassador",
    athlete: "Jake Martinez",
    athleteId: "ARK-BKB-015",
    sport: "Football",
    closureReason: "terminated",
    type: "nil_sponsorship",
    sponsor: "Tyson Foods",
    season: "2024-25",
    originalValue: 200000,
    finalDisbursed: 85000,
    disbursedPercentage: 43,
    closedDate: "2024-11-15",
    termDates: "Sep 2024 - Aug 2025",
  },
  {
    id: "closed-005",
    title: "2023-24 Rev Share Agreement",
    athlete: "Jaxon Smith-Njigba",
    athleteId: "ESU-FB-018",
    sport: "Football",
    closureReason: "fulfilled",
    type: "revenue_share",
    sponsor: "Revenue Share",
    season: "2022-23",
    originalValue: 720000,
    finalDisbursed: 720000,
    disbursedPercentage: 100,
    closedDate: "2024-01-15",
    termDates: "Jan 2023 - Dec 2023",
  },
  {
    id: "closed-006",
    title: "Walmart Regional Campaign",
    athlete: "Sarah Chen",
    athleteId: "ARK-VB-003",
    sport: "Volleyball",
    closureReason: "cancelled",
    type: "nil_sponsorship",
    sponsor: "Walmart",
    season: "2024-25",
    originalValue: 45000,
    finalDisbursed: 0,
    disbursedPercentage: 0,
    closedDate: "2024-09-01",
    termDates: "Sep 2024 - Aug 2025",
  },
  {
    id: "closed-007",
    title: "Roster Retention Package",
    athlete: "David Thompson",
    athleteId: "ESU-FB-022",
    sport: "Football",
    closureReason: "terminated",
    type: "revenue_share",
    sponsor: "Revenue Share",
    season: "2023-24",
    originalValue: 425000,
    finalDisbursed: 141000,
    disbursedPercentage: 33,
    closedDate: "2024-10-20",
    termDates: "Jan 2024 - Dec 2024",
  },
  {
    id: "closed-008",
    title: "Lakewood Jewelry Promotion",
    athlete: "Amanda Rodriguez",
    athleteId: "ARK-GYM-001",
    sport: "Gymnastics",
    closureReason: "fulfilled",
    type: "nil_sponsorship",
    sponsor: "Lakewood Jewelry",
    season: "2023-24",
    originalValue: 35000,
    finalDisbursed: 35000,
    disbursedPercentage: 100,
    closedDate: "2024-05-31",
    termDates: "Sep 2023 - May 2024",
  },
  {
    id: "closed-009",
    title: "Local Restaurant Promotion",
    athlete: "Taylor Wilson",
    athleteId: "ARK-BSB-002",
    sport: "Baseball",
    closureReason: "expired",
    type: "nil_sponsorship",
    sponsor: "Big Bob's Burgers",
    season: "2023-24",
    originalValue: 28000,
    finalDisbursed: 28000,
    disbursedPercentage: 100,
    closedDate: "2024-05-31",
    termDates: "Feb 2024 - May 2024",
  },
  {
    id: "closed-010",
    title: "2023-24 Benefits Pool Agreement",
    athlete: "Marvin Harrison Jr",
    athleteId: "ESU-FB-019",
    sport: "Football",
    closureReason: "fulfilled",
    type: "revenue_share",
    sponsor: "Revenue Share",
    season: "2022-23",
    originalValue: 890000,
    finalDisbursed: 890000,
    disbursedPercentage: 100,
    closedDate: "2024-01-10",
    termDates: "Jan 2023 - Dec 2023",
  },
]

const closureReasonConfig = {
  fulfilled: {
    label: "Fulfilled",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    icon: CheckCircle2,
  },
  expired: {
    label: "Expired",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    icon: Clock,
  },
  terminated: {
    label: "Terminated",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    icon: XCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
    icon: FileX,
  },
}

const typeConfig = {
  revenue_share: { label: "Revenue Share", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  nil_sponsorship: {
    label: "NIL Sponsorship",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  },
}

export function ClosedContractsManagement() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [seasonFilters, setSeasonFilters] = useState<string[]>([])
  const [sportFilter, setSportFilter] = useState<string>("all")
  const [closureReasonFilter, setClosureReasonFilter] = useState<string>("all")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const toggleSeasonFilter = (season: string) => {
    setSeasonFilters((prev) => (prev.includes(season) ? prev.filter((s) => s !== season) : [...prev, season]))
  }

  const filteredContracts = mockClosedContracts.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.athlete.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sponsor.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    // Dropdown filters
    if (typeFilter !== "all" && c.type !== typeFilter) return false
    if (seasonFilters.length > 0 && !seasonFilters.includes(c.season)) return false
    if (sportFilter !== "all" && c.sport !== sportFilter) return false
    if (closureReasonFilter !== "all" && c.closureReason !== closureReasonFilter) return false

    return true
  })

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
      case "closureReason":
        aValue = a.closureReason
        bValue = b.closureReason
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
        aValue = a.season
        bValue = b.season
        break
      case "originalValue":
        aValue = a.originalValue
        bValue = b.originalValue
        break
      case "totalDisbursed":
        aValue = a.finalDisbursed
        bValue = b.finalDisbursed
        break
      case "closedDate":
        aValue = new Date(a.closedDate).getTime()
        bValue = new Date(b.closedDate).getTime()
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

  const stats = {
    totalClosed: mockClosedContracts.length,
    closedThisSeason: mockClosedContracts.filter((c) => c.season === "2024-25").length,
    totalDisbursed: mockClosedContracts.reduce((sum, c) => sum + c.finalDisbursed, 0),
    avgContractValue: mockClosedContracts.reduce((sum, c) => sum + c.originalValue, 0) / mockClosedContracts.length,
  }

  const activeFilterCount =
    (typeFilter !== "all" ? 1 : 0) +
    (seasonFilters.length > 0 ? 1 : 0) +
    (sportFilter !== "all" ? 1 : 0) +
    (closureReasonFilter !== "all" ? 1 : 0)

  const handleClearFilters = () => {
    setTypeFilter("all")
    setSeasonFilters([])
    setSportFilter("all")
    setClosureReasonFilter("all")
  }

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Closed Contracts</h1>
          <p className="text-muted-foreground">Completed, expired, and terminated agreements</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Closed</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClosed}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed This Season</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.closedThisSeason}</div>
            <p className="text-xs text-muted-foreground mt-1">2024-25 academic year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Disbursed</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats.totalDisbursed / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime payouts from closed contracts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Contract Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats.avgContractValue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground mt-1">Across all closed agreements</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="revenue_share">Revenue Share</SelectItem>
            <SelectItem value="nil_sponsorship">NIL Sponsorship</SelectItem>
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
              checked={seasonFilters.includes("2022-23")}
              onCheckedChange={() => toggleSeasonFilter("2022-23")}
            >
              2022-23
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={seasonFilters.includes("2023-24")}
              onCheckedChange={() => toggleSeasonFilter("2023-24")}
            >
              2023-24
            </DropdownMenuCheckboxItem>
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
          </DropdownMenuContent>
        </DropdownMenu>

        <Select value={sportFilter} onValueChange={setSportFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sports</SelectItem>
            <SelectItem value="Football">Football</SelectItem>
            <SelectItem value="Men's Basketball">Men&apos;s Basketball</SelectItem>
            <SelectItem value="Volleyball">Volleyball</SelectItem>
            <SelectItem value="Gymnastics">Gymnastics</SelectItem>
            <SelectItem value="Baseball">Baseball</SelectItem>
          </SelectContent>
        </Select>

        <Select value={closureReasonFilter} onValueChange={setClosureReasonFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Closure Reason" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Closure Reasons</SelectItem>
            <SelectItem value="fulfilled">Fulfilled</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="terminated">Terminated</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
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

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">
                  <button
                    onClick={() => handleSort("closureReason")}
                    className="flex items-center font-medium hover:text-foreground"
                  >
                    Closure Reason
                    <SortIcon column="closureReason" />
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
                    Season
                    <SortIcon column="season" />
                  </button>
                </TableHead>
                <TableHead className="w-[130px]">
                  <button
                    onClick={() => handleSort("originalValue")}
                    className="flex items-center font-medium hover:text-foreground"
                  >
                    Original Value
                    <SortIcon column="originalValue" />
                  </button>
                </TableHead>
                <TableHead className="w-[150px]">
                  <button
                    onClick={() => handleSort("totalDisbursed")}
                    className="flex items-center font-medium hover:text-foreground"
                  >
                    Total Disbursed
                    <SortIcon column="totalDisbursed" />
                  </button>
                </TableHead>
                <TableHead className="w-[120px]">
                  <button
                    onClick={() => handleSort("closedDate")}
                    className="flex items-center font-medium hover:text-foreground"
                  >
                    Closed Date
                    <SortIcon column="closedDate" />
                  </button>
                </TableHead>
                <TableHead className="text-right w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedContracts.map((contract) => {
                const ReasonIcon = closureReasonConfig[contract.closureReason].icon

                const getPercentageColor = (percentage: number) => {
                  if (percentage === 100) return "text-green-600 dark:text-green-400"
                  if (percentage > 0) return "text-amber-600 dark:text-amber-400"
                  return "text-gray-500 dark:text-gray-400"
                }

                return (
                  <TableRow
                    key={contract.id}
                    className="cursor-pointer hover:bg-accent/50"
                    onClick={() => router.push(`/contracts/active/${contract.id}`)}
                  >
                    <TableCell>
                      <Badge variant="secondary" className={closureReasonConfig[contract.closureReason].color}>
                        <ReasonIcon className="mr-1 h-3 w-3" />
                        {closureReasonConfig[contract.closureReason].label}
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
                        <div className="text-xs text-muted-foreground">{contract.termDates}</div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{contract.athlete}</div>
                        <div className="text-xs text-muted-foreground">{contract.sport}</div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-medium">{contract.sponsor}</div>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm">{contract.season}</div>
                    </TableCell>

                    <TableCell>
                      <div className="font-medium">${(contract.originalValue / 1000).toFixed(0)}K</div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">${(contract.finalDisbursed / 1000).toFixed(0)}K</div>
                        <div className={`text-xs font-medium ${getPercentageColor(contract.disbursedPercentage)}`}>
                          ({contract.disbursedPercentage}%)
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm">
                        {new Date(contract.closedDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>View Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Clone Contract</DropdownMenuItem>
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
