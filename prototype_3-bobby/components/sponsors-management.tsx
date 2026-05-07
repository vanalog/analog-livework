"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

import {
  Search,
  Plus,
  MoreVertical,
  Building2,
  DollarSign,
  ChevronDown,
  Eye,
  FileText,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { XAxis, YAxis, CartesianGrid, Area, AreaChart, ReferenceLine, Line } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

const mockSponsors = [
  {
    id: "s1",
    name: "Nike Basketball Division",
    contactName: "Sarah Johnson",
    type: "Business",
    entityType: "For-Profit",
    kybStatus: "Verified",
    contractValue: 125000,
    athletes: 3,
    lastActivity: "Deposited Jan 10",
    currentBalance: 500000,
    allocatedFunds: 125000,
    uncommittedFunds: 375000,
    totalFunded: 500000,
    marketingFlex: 50000,
    status: "Active",
    campaigns: 2,
  },
  {
    id: "s2",
    name: "Local Sports Medicine Clinic",
    contactName: "Dr. Michael Chen",
    type: "Business",
    entityType: "For-Profit",
    kybStatus: "Pending",
    contractValue: 35000,
    athletes: 2,
    lastActivity: "Contract signed Jan 5",
    currentBalance: 150000,
    allocatedFunds: 35000,
    uncommittedFunds: 115000,
    totalFunded: 150000,
    marketingFlex: 15000,
    status: "Active",
    campaigns: 1,
  },
  {
    id: "s3",
    name: "Regional Auto Dealership",
    contactName: "Robert Davis",
    type: "Business",
    entityType: "For-Profit",
    kybStatus: "Not Started",
    contractValue: 22000,
    athletes: 1,
    lastActivity: "Deposited Dec 28",
    currentBalance: 75000,
    allocatedFunds: 22000,
    uncommittedFunds: 53000,
    totalFunded: 75000,
    marketingFlex: 10000,
    status: "Active",
    campaigns: 0,
  },
  {
    id: "s4",
    name: "TechStart Solutions",
    contactName: "Jennifer Lee",
    type: "Business",
    entityType: "For-Profit",
    kybStatus: "Verified",
    contractValue: 75000,
    athletes: 2,
    lastActivity: "Deposited Jan 8",
    currentBalance: 250000,
    allocatedFunds: 75000,
    uncommittedFunds: 175000,
    totalFunded: 300000,
    marketingFlex: 25000,
    status: "Active",
    campaigns: 3,
  },
  {
    id: "s5",
    name: "Elite Fitness Equipment Co.",
    contactName: "Amanda Foster",
    type: "Business",
    entityType: "For-Profit",
    kybStatus: "Verified",
    contractValue: 95000,
    athletes: 4,
    lastActivity: "Contract signed Jan 3",
    currentBalance: 400000,
    allocatedFunds: 95000,
    uncommittedFunds: 305000,
    totalFunded: 450000,
    marketingFlex: 40000,
    status: "Active",
    campaigns: 2,
  },
  {
    id: "s6",
    name: "Marcus Thompson Sr.",
    contactName: "Marcus Thompson Sr.",
    type: "Individual",
    entityType: "Individual Donor",
    kybStatus: "Failed",
    contractValue: 0,
    athletes: 0,
    lastActivity: "Failed verification Dec 15",
    currentBalance: 0,
    allocatedFunds: 0,
    uncommittedFunds: 0,
    totalFunded: 0,
    marketingFlex: 0,
    status: "Inactive",
    campaigns: 0,
  },
  {
    id: "s7",
    name: "John Tyson",
    contactName: "John Tyson",
    type: "Individual",
    entityType: "Individual Donor",
    kybStatus: "Verified",
    contractValue: 20000,
    athletes: 1,
    lastActivity: "Deposited Jan 12",
    currentBalance: 200000,
    allocatedFunds: 20000,
    uncommittedFunds: 180000,
    totalFunded: 200000,
    marketingFlex: 20000,
    status: "Active",
    campaigns: 1,
  },
  {
    id: "s8",
    name: "Walmart Foundation",
    contactName: "Patricia Williams",
    type: "Business",
    entityType: "Foundation",
    kybStatus: "Verified",
    contractValue: 150000,
    athletes: 5,
    lastActivity: "Deposited Jan 15",
    currentBalance: 500000,
    allocatedFunds: 150000,
    uncommittedFunds: 350000,
    totalFunded: 500000,
    marketingFlex: 75000,
    status: "Active",
    campaigns: 4,
  },
]

// NIL Position chart data - showing indicated, committed, and in-review sponsorship amounts
const nilPositionData = [
  { date: "2025-07-01", nilIndicated: 4500000, nilCommitted: 800000, nilInReview: 400000 },
  { date: "2025-08-01", nilIndicated: 5200000, nilCommitted: 1100000, nilInReview: 600000 },
  { date: "2025-09-01", nilIndicated: 6800000, nilCommitted: 1500000, nilInReview: 800000 },
  { date: "2025-10-01", nilIndicated: 8200000, nilCommitted: 1900000, nilInReview: 700000 },
  { date: "2025-11-01", nilIndicated: 9500000, nilCommitted: 2300000, nilInReview: 500000 },
  { date: "2025-12-01", nilIndicated: 10800000, nilCommitted: 2600000, nilInReview: 400000 },
  { date: "2026-01-01", nilIndicated: 11500000, nilCommitted: 2800000, nilInReview: 350000 },
  { date: "2026-02-01", nilIndicated: 12000000, nilCommitted: 2900000, nilInReview: 300000 },
  { date: "2026-03-01", nilIndicated: 12300000, nilCommitted: 3000000, nilInReview: 250000 },
  { date: "2026-04-01", nilIndicated: 12500000, nilCommitted: 3000000, nilInReview: 200000 },
  { date: "2026-05-01", nilIndicated: 12500000, nilCommitted: 3000000, nilInReview: 150000 },
  { date: "2026-06-01", nilIndicated: 12500000, nilCommitted: 3000000, nilInReview: 100000 },
  { date: "2026-07-01", nilIndicated: 1500000, nilCommitted: 500000, nilInReview: 200000 },
  { date: "2026-08-01", nilIndicated: 1500000, nilCommitted: 500000, nilInReview: 180000 },
  { date: "2026-09-01", nilIndicated: 1500000, nilCommitted: 500000, nilInReview: 150000 },
  { date: "2026-10-01", nilIndicated: 1500000, nilCommitted: 500000, nilInReview: 120000 },
  { date: "2026-11-01", nilIndicated: 1500000, nilCommitted: 500000, nilInReview: 100000 },
  { date: "2026-12-01", nilIndicated: 1500000, nilCommitted: 500000, nilInReview: 80000 },
  { date: "2027-01-01", nilIndicated: 1500000, nilCommitted: 500000, nilInReview: 50000 },
  { date: "2027-02-01", nilIndicated: 1500000, nilCommitted: 500000, nilInReview: 30000 },
  { date: "2027-03-01", nilIndicated: 1500000, nilCommitted: 500000, nilInReview: 20000 },
  { date: "2027-04-01", nilIndicated: 1500000, nilCommitted: 500000, nilInReview: 10000 },
  { date: "2027-05-01", nilIndicated: 1500000, nilCommitted: 500000, nilInReview: 5000 },
  { date: "2027-06-01", nilIndicated: 1500000, nilCommitted: 500000, nilInReview: 0 },
  { date: "2027-07-01", nilIndicated: 500000, nilCommitted: 100000, nilInReview: 50000 },
  { date: "2027-08-01", nilIndicated: 500000, nilCommitted: 100000, nilInReview: 40000 },
  { date: "2027-09-01", nilIndicated: 500000, nilCommitted: 100000, nilInReview: 30000 },
  { date: "2027-10-01", nilIndicated: 500000, nilCommitted: 100000, nilInReview: 20000 },
  { date: "2027-11-01", nilIndicated: 500000, nilCommitted: 100000, nilInReview: 10000 },
  { date: "2027-12-01", nilIndicated: 500000, nilCommitted: 100000, nilInReview: 5000 },
  { date: "2028-01-01", nilIndicated: 500000, nilCommitted: 100000, nilInReview: 0 },
  { date: "2028-02-01", nilIndicated: 500000, nilCommitted: 100000, nilInReview: 0 },
  { date: "2028-03-01", nilIndicated: 500000, nilCommitted: 100000, nilInReview: 0 },
  { date: "2028-04-01", nilIndicated: 500000, nilCommitted: 100000, nilInReview: 0 },
  { date: "2028-05-01", nilIndicated: 500000, nilCommitted: 100000, nilInReview: 0 },
  { date: "2028-06-01", nilIndicated: 500000, nilCommitted: 100000, nilInReview: 0 },
]

// Chart config for NIL position chart
const nilChartConfig = {
  committed: {
    label: "NIL Committed",
    color: "hsl(173, 58%, 39%)",
  },
  inReview: {
    label: "NIL In Review",
    color: "hsl(43, 96%, 56%)",
  },
  indicated: {
    label: "NIL Indicated",
    color: "hsl(26, 90%, 53%)",
  },
}

// Currency formatting helpers
const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`
  }
  return `$${value.toLocaleString()}`
}

const formatCurrencyFull = (value: number): string => {
  return `$${value.toLocaleString()}`
}

// Date formatting for chart
const formatDateLabel = (dateString: string): string => {
  const date = new Date(dateString)
  const month = date.toLocaleDateString("en-US", { month: "short" })
  const year = date.getFullYear().toString().slice(-2)
  return `${month} '${year}`
}

export function SponsorsManagement() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [kybFilter, setKybFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [chartTimeRange, setChartTimeRange] = useState("All Years")
  const [nilVisible, setNilVisible] = useState({
    committed: true,
    inReview: true,
    indicated: true,
  })

  // Filter chart data based on time range
  const filteredChartData = (() => {
    if (chartTimeRange === "All Years") return nilPositionData

    const seasonRanges: Record<string, { start: string; end: string }> = {
      "2025-26": { start: "2025-07-01", end: "2026-06-30" },
      "2026-27": { start: "2026-07-01", end: "2027-06-30" },
      "2027-28": { start: "2027-07-01", end: "2028-06-30" },
    }

    const range = seasonRanges[chartTimeRange]
    if (!range) return nilPositionData

    return nilPositionData.filter((d) => {
      const date = new Date(d.date)
      return date >= new Date(range.start) && date <= new Date(range.end)
    })
  })()

  const toggleNilSeries = (series: "committed" | "inReview" | "indicated") => {
    setNilVisible((prev) => ({ ...prev, [series]: !prev[series] }))
  }

  const totalSponsors = mockSponsors.length
  const businessSponsors = mockSponsors.filter((s) => s.type === "Business").length
  const individualSponsors = mockSponsors.filter((s) => s.type === "Individual").length
  const activeContracts = mockSponsors.reduce((sum, s) => sum + (s.contractValue > 0 ? 1 : 0), 0)

  const handleRowClick = (sponsorId: string) => {
    router.push(`/sponsors/${sponsorId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sponsors</h1>
          <p className="text-muted-foreground">Manage sponsor commitments and NIL allocations</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Sponsor
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Total Sponsors</h3>
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <p className="text-sm text-muted-foreground mt-1">
              6 Business · 2 Individual
            </p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Committed</h3>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$2.08M</div>
            <p className="text-sm text-muted-foreground mt-1">Across all active sponsors</p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Available</h3>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">$1.55M</div>
            <p className="text-sm text-muted-foreground mt-1">Uncommitted this season</p>
          </CardContent>
        </Card>
      </div>

      <div className="px-6 py-3 bg-muted/30 rounded-lg border">
        <p className="text-sm text-muted-foreground">
          Transfer window: April 6–21 · 3 sponsors with unallocated funds
        </p>
      </div>

      <div className="space-y-6">
          <Card className="border shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">NIL Position</h3>
                  <p className="text-sm text-muted-foreground">Committed and active contracts vs. indicated interest (IOI)</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {chartTimeRange}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setChartTimeRange("All Years")}>All Years</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setChartTimeRange("2025-26")}>2025-26</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setChartTimeRange("2026-27")}>2026-27</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setChartTimeRange("2027-28")}>2027-28</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <ChartContainer config={nilChartConfig} className="h-[250px] w-full">
                <AreaChart data={filteredChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillCommitted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(173, 58%, 39%)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(173, 58%, 39%)" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="fillNilInReview" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(43, 96%, 56%)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(43, 96%, 56%)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDateLabel}
                    className="text-xs"
                    tickMargin={8}
                    axisLine={false}
                  />
                  <YAxis
                    className="text-xs"
                    tickFormatter={(value) => formatCurrency(value)}
                    tickMargin={8}
                    axisLine={false}
                  />
                  <ReferenceLine x="2025-07-01" stroke="#d1d5db" strokeDasharray="3 3" />
                  <ReferenceLine x="2026-07-01" stroke="#d1d5db" strokeDasharray="3 3" />
                  <ReferenceLine x="2027-07-01" stroke="#d1d5db" strokeDasharray="3 3" />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || payload.length === 0) return null
                      const data = payload[0].payload
                      const total = data.nilCommitted + data.nilInReview
                      const gap = data.nilIndicated - total
                      return (
                        <div className="rounded-lg border bg-background p-3 shadow-lg">
                          <p className="font-semibold mb-2">{formatDateLabel(data.date)}</p>
                          <div className="grid gap-1.5">
                            <div className="flex items-center gap-2 text-xs">
                              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "hsl(173, 58%, 39%)" }} />
                              <span className="text-muted-foreground">Committed:</span>
                              <span className="font-medium ml-auto">{formatCurrencyFull(data.nilCommitted)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "hsl(43, 96%, 56%)" }} />
                              <span className="text-muted-foreground">In Review:</span>
                              <span className="font-medium ml-auto">{formatCurrencyFull(data.nilInReview)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "hsl(26, 90%, 53%)" }} />
                              <span className="text-muted-foreground">Indicated:</span>
                              <span className="font-medium ml-auto">{formatCurrencyFull(data.nilIndicated)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs pt-1 border-t">
                              <span className="text-amber-600 font-medium">Gap:</span>
                              <span className="font-bold ml-auto text-amber-600">{formatCurrencyFull(gap)}</span>
                            </div>
                          </div>
                        </div>
                      )
                    }}
                  />
                  {nilVisible.committed && (
                    <Area
                      type="monotone"
                      dataKey="nilCommitted"
                      stackId="b"
                      stroke="hsl(173, 58%, 39%)"
                      fill="url(#fillCommitted)"
                      strokeWidth={2}
                    />
                  )}
                  {nilVisible.inReview && (
                    <Area
                      type="monotone"
                      dataKey="nilInReview"
                      stackId="b"
                      stroke="hsl(43, 96%, 56%)"
                      fill="url(#fillNilInReview)"
                      strokeWidth={2}
                    />
                  )}
                  {nilVisible.indicated && (
                    <Line
                      type="monotone"
                      dataKey="nilIndicated"
                      stroke="hsl(26, 90%, 53%)"
                      strokeWidth={0.75}
                      dot={false}
                    />
                  )}
                </AreaChart>
              </ChartContainer>

              <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm">
                <button
                  onClick={() => toggleNilSeries("committed")}
                  className={`flex items-center gap-2 cursor-pointer transition-opacity ${
                    !nilVisible.committed ? "opacity-40" : "opacity-100"
                  }`}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(173, 58%, 39%)" }} />
                  <span className={`text-muted-foreground ${!nilVisible.committed ? "line-through" : ""}`}>
                    NIL Committed
                  </span>
                </button>
                <button
                  onClick={() => toggleNilSeries("inReview")}
                  className={`flex items-center gap-2 cursor-pointer transition-opacity ${
                    !nilVisible.inReview ? "opacity-40" : "opacity-100"
                  }`}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(43, 96%, 56%)" }} />
                  <span className={`text-muted-foreground ${!nilVisible.inReview ? "line-through" : ""}`}>
                    NIL In Review
                  </span>
                </button>
                <button
                  onClick={() => toggleNilSeries("indicated")}
                  className={`flex items-center gap-2 cursor-pointer transition-opacity ${
                    !nilVisible.indicated ? "opacity-40" : "opacity-100"
                  }`}
                >
                  <div className="w-5 h-0.5 bg-[hsl(26,90%,53%)]" />
                  <span className={`text-muted-foreground ${!nilVisible.indicated ? "line-through" : ""}`}>
                    IOI / Indicated Interest
                  </span>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search sponsors, contacts..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={kybFilter} onValueChange={setKybFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Verification Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="business">Businesses</SelectItem>
                    <SelectItem value="individual">Individuals</SelectItem>
                    <SelectItem value="pending">Pending Setup</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="last-activity">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-activity">Last Activity</SelectItem>
                    <SelectItem value="committed-desc">Committed ↓</SelectItem>
                    <SelectItem value="allocated-desc">Allocated ↓</SelectItem>
                    <SelectItem value="name-asc">Name A–Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <input type="checkbox" className="rounded border-gray-300" />
                    </TableHead>
                    <TableHead>Sponsor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Season</TableHead>
                    <TableHead>Committed</TableHead>
                    <TableHead>Allocated</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSponsors.map((sponsor) => (
                    <TableRow
                      key={sponsor.id}
                      className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                        sponsor.status === "Inactive" ? "opacity-50" : ""
                      }`}
                      onClick={() => handleRowClick(sponsor.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded border-gray-300" />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{sponsor.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className={
                                sponsor.type === "Business"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-green-50 text-green-700 border-green-200"
                              }
                            >
                              {sponsor.type}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{sponsor.entityType}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">2025–26</TableCell>
                      <TableCell className="font-mono">${sponsor.currentBalance.toLocaleString()}</TableCell>
                      <TableCell className="font-mono">${sponsor.allocatedFunds.toLocaleString()}</TableCell>
                      <TableCell className="font-mono text-green-600">${sponsor.uncommittedFunds.toLocaleString()}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{sponsor.lastActivity}</TableCell>
                      <TableCell>
                        <Badge variant={sponsor.status === "Active" ? "default" : "secondary"}>{sponsor.status}</Badge>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleRowClick(sponsor.id)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit Sponsor</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <FileText className="w-4 h-4 mr-2" />
                              Create Sponsorship Contract
                            </DropdownMenuItem>
                            <DropdownMenuItem>Add Funding</DropdownMenuItem>
                            <DropdownMenuItem>Create Campaign</DropdownMenuItem>
                            {sponsor.status === "Inactive" && (
                              <DropdownMenuItem className="text-blue-600">Invite to reactivate</DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={6} className="text-right font-semibold">
                      Total Available:
                    </TableCell>
                    <TableCell className="font-mono font-bold text-green-600">
                      $1,553,000
                    </TableCell>
                    <TableCell colSpan={3} />
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
      </div>
    </div>
  )
}
