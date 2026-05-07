"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, AlertTriangle, Download, ArrowUp, ArrowDown, Search } from "lucide-react"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceLine, Line } from "recharts"
import Link from "next/link"
import { useState, useMemo } from "react"

const contractValueData = [
  {
    date: "2025-07-01",
    revShareActive: 5200000,
    revShareInReview: 1800000,
    nilIndicated: 4500000,
    nilCommitted: 800000,
    nilInReview: 400000,
  },
  {
    date: "2025-08-01",
    revShareActive: 6100000,
    revShareInReview: 2200000,
    nilIndicated: 5200000,
    nilCommitted: 1100000,
    nilInReview: 600000,
  },
  {
    date: "2025-09-01",
    revShareActive: 7500000,
    revShareInReview: 2800000,
    nilIndicated: 6800000,
    nilCommitted: 1500000,
    nilInReview: 800000,
  },
  {
    date: "2025-10-01",
    revShareActive: 8900000,
    revShareInReview: 2400000,
    nilIndicated: 8200000,
    nilCommitted: 1900000,
    nilInReview: 700000,
  },
  {
    date: "2025-11-01",
    revShareActive: 9800000,
    revShareInReview: 1900000,
    nilIndicated: 9500000,
    nilCommitted: 2300000,
    nilInReview: 500000,
  },
  {
    date: "2025-12-01",
    revShareActive: 10500000,
    revShareInReview: 1500000,
    nilIndicated: 10800000,
    nilCommitted: 2600000,
    nilInReview: 400000,
  },
  {
    date: "2026-01-01",
    revShareActive: 11200000,
    revShareInReview: 1200000,
    nilIndicated: 11500000,
    nilCommitted: 2800000,
    nilInReview: 350000,
  },
  {
    date: "2026-02-01",
    revShareActive: 11600000,
    revShareInReview: 900000,
    nilIndicated: 12000000,
    nilCommitted: 2900000,
    nilInReview: 300000,
  },
  {
    date: "2026-03-01",
    revShareActive: 11800000,
    revShareInReview: 700000,
    nilIndicated: 12300000,
    nilCommitted: 3000000,
    nilInReview: 250000,
  },
  {
    date: "2026-04-01",
    revShareActive: 11900000,
    revShareInReview: 600000,
    nilIndicated: 12500000,
    nilCommitted: 3000000,
    nilInReview: 200000,
  },
  {
    date: "2026-05-01",
    revShareActive: 11900000,
    revShareInReview: 500000,
    nilIndicated: 12500000,
    nilCommitted: 3000000,
    nilInReview: 150000,
  },
  {
    date: "2026-06-01",
    revShareActive: 11900000,
    revShareInReview: 400000,
    nilIndicated: 12500000,
    nilCommitted: 3000000,
    nilInReview: 100000,
  },
  {
    date: "2026-07-01",
    revShareActive: 4200000,
    revShareInReview: 800000,
    nilIndicated: 1500000,
    nilCommitted: 500000,
    nilInReview: 200000,
  },
  {
    date: "2026-08-01",
    revShareActive: 4200000,
    revShareInReview: 750000,
    nilIndicated: 1500000,
    nilCommitted: 500000,
    nilInReview: 180000,
  },
  {
    date: "2026-09-01",
    revShareActive: 4200000,
    revShareInReview: 700000,
    nilIndicated: 1500000,
    nilCommitted: 500000,
    nilInReview: 150000,
  },
  {
    date: "2026-10-01",
    revShareActive: 4200000,
    revShareInReview: 600000,
    nilIndicated: 1500000,
    nilCommitted: 500000,
    nilInReview: 120000,
  },
  {
    date: "2026-11-01",
    revShareActive: 4200000,
    revShareInReview: 500000,
    nilIndicated: 1500000,
    nilCommitted: 500000,
    nilInReview: 100000,
  },
  {
    date: "2026-12-01",
    revShareActive: 4200000,
    revShareInReview: 400000,
    nilIndicated: 1500000,
    nilCommitted: 500000,
    nilInReview: 80000,
  },
  {
    date: "2027-01-01",
    revShareActive: 4200000,
    revShareInReview: 300000,
    nilIndicated: 1500000,
    nilCommitted: 500000,
    nilInReview: 50000,
  },
  {
    date: "2027-02-01",
    revShareActive: 4200000,
    revShareInReview: 250000,
    nilIndicated: 1500000,
    nilCommitted: 500000,
    nilInReview: 30000,
  },
  {
    date: "2027-03-01",
    revShareActive: 4200000,
    revShareInReview: 200000,
    nilIndicated: 1500000,
    nilCommitted: 500000,
    nilInReview: 20000,
  },
  {
    date: "2027-04-01",
    revShareActive: 4200000,
    revShareInReview: 150000,
    nilIndicated: 1500000,
    nilCommitted: 500000,
    nilInReview: 10000,
  },
  {
    date: "2027-05-01",
    revShareActive: 4200000,
    revShareInReview: 100000,
    nilIndicated: 1500000,
    nilCommitted: 500000,
    nilInReview: 5000,
  },
  {
    date: "2027-06-01",
    revShareActive: 4200000,
    revShareInReview: 100000,
    nilIndicated: 1500000,
    nilCommitted: 500000,
    nilInReview: 0,
  },
  {
    date: "2027-07-01",
    revShareActive: 2200000,
    revShareInReview: 200000,
    nilIndicated: 500000,
    nilCommitted: 100000,
    nilInReview: 50000,
  },
  {
    date: "2027-08-01",
    revShareActive: 2200000,
    revShareInReview: 180000,
    nilIndicated: 500000,
    nilCommitted: 100000,
    nilInReview: 40000,
  },
  {
    date: "2027-09-01",
    revShareActive: 2200000,
    revShareInReview: 150000,
    nilIndicated: 500000,
    nilCommitted: 100000,
    nilInReview: 30000,
  },
  {
    date: "2027-10-01",
    revShareActive: 2200000,
    revShareInReview: 120000,
    nilIndicated: 500000,
    nilCommitted: 100000,
    nilInReview: 20000,
  },
  {
    date: "2027-11-01",
    revShareActive: 2200000,
    revShareInReview: 100000,
    nilIndicated: 500000,
    nilCommitted: 100000,
    nilInReview: 10000,
  },
  {
    date: "2027-12-01",
    revShareActive: 2200000,
    revShareInReview: 50000,
    nilIndicated: 500000,
    nilCommitted: 100000,
    nilInReview: 5000,
  },
  {
    date: "2028-01-01",
    revShareActive: 2200000,
    revShareInReview: 30000,
    nilIndicated: 500000,
    nilCommitted: 100000,
    nilInReview: 0,
  },
  {
    date: "2028-02-01",
    revShareActive: 2200000,
    revShareInReview: 10000,
    nilIndicated: 500000,
    nilCommitted: 100000,
    nilInReview: 0,
  },
  {
    date: "2028-03-01",
    revShareActive: 2200000,
    revShareInReview: 5000,
    nilIndicated: 500000,
    nilCommitted: 100000,
    nilInReview: 0,
  },
  {
    date: "2028-04-01",
    revShareActive: 2200000,
    revShareInReview: 0,
    nilIndicated: 500000,
    nilCommitted: 100000,
    nilInReview: 0,
  },
  {
    date: "2028-05-01",
    revShareActive: 2200000,
    revShareInReview: 0,
    nilIndicated: 500000,
    nilCommitted: 100000,
    nilInReview: 0,
  },
  {
    date: "2028-06-01",
    revShareActive: 2200000,
    revShareInReview: 0,
    nilIndicated: 500000,
    nilCommitted: 100000,
    nilInReview: 0,
  },
]

// chart configuration for area chart
const chartConfig = {
  revShareActive: {
    label: "RevShare Active",
    color: "hsl(var(--chart-1))",
  },
  revShareInReview: {
    label: "RevShare In Review",
    color: "hsl(var(--chart-2))",
  },
  nilIndicated: {
    label: "NIL Indicated",
    color: "hsl(var(--chart-3))",
  },
  nilCommitted: {
    label: "NIL Committed",
    color: "hsl(var(--chart-4))",
  },
  nilInReview: {
    label: "NIL In Review",
    color: "hsl(var(--chart-5))",
  },
}

const overviewData = {
  summary: {
    totalContractValue: 27000000,
    totalContractValueTrend: "+12% vs last season",
    totalContractValueTrendPositive: true,
    executedValue: 21000000,
    executedPercent: 78,
    inReviewValue: 6000000,
    inReviewCount: 12,
    nilGap: 9500000,
    nilGapTrend: "+$2.1M vs last month",
    nilGapTrendPositive: false,
    avgDaysInReview: 16,
    avgDaysInReviewTrend: "+5 vs last month",
    avgDaysInReviewWarning: true,
  },
  pipeline: [
    { stage: "Executed", value: 21000000, count: 32, color: "hsl(var(--chart-1))" },
    { stage: "In Review", value: 4500000, count: 12, color: "hsl(var(--chart-2))" },
    { stage: "Draft", value: 1500000, count: 8, color: "hsl(var(--chart-5))" },
  ],
  nilFunding: {
    totalIndicated: 12500000,
    committed: 3000000,
    gap: 9500000,
    percentFunded: 24,
  },
  seasonComparison: {
    previous: { season: "2024-25", contracts: 38, value: 18200000, nilGap: 4200000, avgReview: 11 },
    current: { season: "2025-26", contracts: 52, value: 27000000, nilGap: 9500000, avgReview: 16 },
  },
  seasonCommitments: [
    {
      season: "2025-26",
      revShare: 8500000,
      enhancements: 2100000,
      nilCommitted: 2500000,
      nilGap: 5100000,
      total: 18200000,
    },
    {
      season: "2026-27",
      revShare: 4200000,
      enhancements: 400000,
      nilCommitted: 500000,
      nilGap: 1000000,
      total: 6100000,
    },
    {
      season: "2027-28",
      revShare: 2200000,
      enhancements: 100000,
      nilCommitted: 0,
      nilGap: 400000,
      total: 2700000,
    },
  ],
  attentionRequired: [
    {
      athlete: "[First] [Last]",
      issue: "Contract in review - awaiting agent",
      amount: 350000,
      days: 21,
      type: "stuck",
    },
    {
      athlete: "[First] [Last]",
      issue: "Contract in review - with counsel",
      amount: 200000,
      days: 18,
      type: "stuck",
    },
    {
      athlete: "[First] [Last]",
      issue: "Multiple redlines (4 turns)",
      amount: 250000,
      days: 14,
      type: "stuck",
    },
    {
      athlete: "[First] [Last]",
      issue: "NIL Gap - needs sponsor",
      amount: 400000,
      days: null,
      type: "nil_gap",
    },
    {
      athlete: "[First] [Last]",
      issue: "NIL Gap - needs sponsor",
      amount: 350000,
      days: null,
      type: "nil_gap",
    },
  ],
  topNilGaps: [
    {
      athlete: "[First] [Last]",
      sport: "Football",
      nilIndicated: 400000,
      nilCommitted: 0,
      gap: 400000,
      season: "2025-26",
    },
    {
      athlete: "[First] [Last]",
      sport: "Football",
      nilIndicated: 350000,
      nilCommitted: 0,
      gap: 350000,
      season: "2025-26",
    },
    {
      athlete: "[First] [Last]",
      sport: "Men's Basketball",
      nilIndicated: 250000,
      nilCommitted: 0,
      gap: 250000,
      season: "2025-26",
    },
    {
      athlete: "[First] [Last]",
      sport: "Football",
      nilIndicated: 400000,
      nilCommitted: 200000,
      gap: 200000,
      season: "2025-26",
    },
    {
      athlete: "[First] [Last]",
      sport: "Football",
      nilIndicated: 150000,
      nilCommitted: 0,
      gap: 150000,
      season: "2025-26",
    },
  ],
}

const allContractsData = [
  {
    id: "c1",
    athlete: "Marcus Johnson",
    sport: "Football",
    position: "QB",
    contractType: "RevShare + IOI",
    status: "Executed",
    totalValue: 1000000,
    revShare: 550000,
    enhancements: 50000,
    nilIndicated: 400000,
    nilCommitted: 150000,
    nilGap: 250000,
    startSeason: "2025-26",
    endSeason: "2027-28",
    daysInStatus: 32,
    agency: "Excel Sports",
  },
  {
    id: "c2",
    athlete: "Jaylen Mitchell",
    sport: "Football",
    position: "WR",
    contractType: "RevShare",
    status: "In Review",
    totalValue: 350000,
    revShare: 350000,
    enhancements: 0,
    nilIndicated: 0,
    nilCommitted: 0,
    nilGap: 0,
    startSeason: "2025-26",
    endSeason: "2026-27",
    daysInStatus: 14,
    agency: "Wasserman",
  },
  {
    id: "c3",
    athlete: "Tyler Robinson",
    sport: "Men's Basketball",
    position: "G",
    contractType: "RevShare + IOI",
    status: "Executed",
    totalValue: 500000,
    revShare: 250000,
    enhancements: 0,
    nilIndicated: 250000,
    nilCommitted: 0,
    nilGap: 250000,
    startSeason: "2025-26",
    endSeason: "2025-26",
    daysInStatus: 45,
    agency: "CAA Sports",
  },
  {
    id: "c4",
    athlete: "Devon Harris",
    sport: "Football",
    position: "RB",
    contractType: "RevShare + IOI",
    status: "Executed",
    totalValue: 750000,
    revShare: 400000,
    enhancements: 50000,
    nilIndicated: 300000,
    nilCommitted: 100000,
    nilGap: 200000,
    startSeason: "2025-26",
    endSeason: "2026-27",
    daysInStatus: 28,
    agency: "Klutch Sports",
  },
  {
    id: "c5",
    athlete: "Cameron Williams",
    sport: "Men's Basketball",
    position: "F",
    contractType: "RevShare",
    status: "In Review",
    totalValue: 425000,
    revShare: 425000,
    enhancements: 0,
    nilIndicated: 0,
    nilCommitted: 0,
    nilGap: 0,
    startSeason: "2025-26",
    endSeason: "2026-27",
    daysInStatus: 8,
    agency: "Octagon",
  },
  {
    id: "c6",
    athlete: "Jordan Davis",
    sport: "Football",
    position: "LB",
    contractType: "RevShare + IOI",
    status: "Draft",
    totalValue: 300000,
    revShare: 200000,
    enhancements: 0,
    nilIndicated: 100000,
    nilCommitted: 0,
    nilGap: 100000,
    startSeason: "2026-27",
    endSeason: "2027-28",
    daysInStatus: 3,
    agency: "Roc Nation",
  },
  {
    id: "c7",
    athlete: "Brianna Thompson",
    sport: "Men's Basketball",
    position: "G",
    contractType: "RevShare",
    status: "Executed",
    totalValue: 380000,
    revShare: 380000,
    enhancements: 0,
    nilIndicated: 0,
    nilCommitted: 0,
    nilGap: 0,
    startSeason: "2025-26",
    endSeason: "2026-27",
    daysInStatus: 21,
    agency: "CAA Sports",
  },
  {
    id: "c8",
    athlete: "Ethan Rodriguez",
    sport: "Football",
    position: "TE",
    contractType: "RevShare + IOI",
    status: "Executed",
    totalValue: 620000,
    revShare: 320000,
    enhancements: 30000,
    nilIndicated: 270000,
    nilCommitted: 80000,
    nilGap: 190000,
    startSeason: "2025-26",
    endSeason: "2027-28",
    daysInStatus: 38,
    agency: "Wasserman",
  },
  {
    id: "c9",
    athlete: "Skylar Anderson",
    sport: "Men's Basketball",
    position: "F",
    contractType: "RevShare + IOI",
    status: "In Review",
    totalValue: 475000,
    revShare: 250000,
    enhancements: 25000,
    nilIndicated: 200000,
    nilCommitted: 50000,
    nilGap: 150000,
    startSeason: "2026-27",
    endSeason: "2027-28",
    daysInStatus: 11,
    agency: "Excel Sports",
  },
  {
    id: "c10",
    athlete: "Mason Taylor",
    sport: "Football",
    position: "DB",
    contractType: "RevShare",
    status: "Executed",
    totalValue: 290000,
    revShare: 290000,
    enhancements: 0,
    nilIndicated: 0,
    nilCommitted: 0,
    nilGap: 0,
    startSeason: "2025-26",
    endSeason: "2026-27",
    daysInStatus: 56,
    agency: "Octagon",
  },
  {
    id: "c11",
    athlete: "Zoe Martinez",
    sport: "Men's Basketball",
    position: "C",
    contractType: "RevShare + IOI",
    status: "Executed",
    totalValue: 540000,
    revShare: 280000,
    enhancements: 10000,
    nilIndicated: 250000,
    nilCommitted: 120000,
    nilGap: 130000,
    startSeason: "2025-26",
    endSeason: "2026-27",
    daysInStatus: 42,
    agency: "Klutch Sports",
  },
  {
    id: "c12",
    athlete: "Aiden Parker",
    sport: "Football",
    position: "OL",
    contractType: "RevShare",
    status: "In Review",
    totalValue: 315000,
    revShare: 315000,
    enhancements: 0,
    nilIndicated: 0,
    nilCommitted: 0,
    nilGap: 0,
    startSeason: "2026-27",
    endSeason: "2027-28",
    daysInStatus: 6,
    agency: "Roc Nation",
  },
  {
    id: "c13",
    athlete: "Madison Clark",
    sport: "Men's Basketball",
    position: "G",
    contractType: "RevShare + IOI",
    status: "Draft",
    totalValue: 410000,
    revShare: 210000,
    enhancements: 0,
    nilIndicated: 200000,
    nilCommitted: 0,
    nilGap: 200000,
    startSeason: "2026-27",
    endSeason: "2028-29",
    daysInStatus: 2,
    agency: "CAA Sports",
  },
  {
    id: "c14",
    athlete: "Isaiah Wright",
    sport: "Football",
    position: "DE",
    contractType: "RevShare + IOI",
    status: "Executed",
    totalValue: 685000,
    revShare: 385000,
    enhancements: 40000,
    nilIndicated: 260000,
    nilCommitted: 90000,
    nilGap: 170000,
    startSeason: "2025-26",
    endSeason: "2027-28",
    daysInStatus: 29,
    agency: "Wasserman",
  },
  {
    id: "c15",
    athlete: "Chloe Bennett",
    sport: "Men's Basketball",
    position: "F",
    contractType: "RevShare",
    status: "Executed",
    totalValue: 395000,
    revShare: 395000,
    enhancements: 0,
    nilIndicated: 0,
    nilCommitted: 0,
    nilGap: 0,
    startSeason: "2025-26",
    endSeason: "2026-27",
    daysInStatus: 48,
    agency: "Octagon",
  },
  {
    id: "c16",
    athlete: "Noah Peterson",
    sport: "Football",
    position: "WR",
    contractType: "RevShare + IOI",
    status: "In Review",
    totalValue: 445000,
    revShare: 245000,
    enhancements: 20000,
    nilIndicated: 180000,
    nilCommitted: 60000,
    nilGap: 120000,
    startSeason: "2026-27",
    endSeason: "2027-28",
    daysInStatus: 9,
    agency: "Excel Sports",
  },
  {
    id: "c17",
    athlete: "Alexis Turner",
    sport: "Men's Basketball",
    position: "G",
    contractType: "RevShare",
    status: "Draft",
    totalValue: 340000,
    revShare: 340000,
    enhancements: 0,
    nilIndicated: 0,
    nilCommitted: 0,
    nilGap: 0,
    startSeason: "2026-27",
    endSeason: "2027-28",
    daysInStatus: 1,
    agency: "Klutch Sports",
  },
  {
    id: "c18",
    athlete: "Caleb Foster",
    sport: "Football",
    position: "QB",
    contractType: "RevShare + IOI",
    status: "Executed",
    totalValue: 925000,
    revShare: 525000,
    enhancements: 50000,
    nilIndicated: 350000,
    nilCommitted: 140000,
    nilGap: 210000,
    startSeason: "2025-26",
    endSeason: "2028-29",
    daysInStatus: 61,
    agency: "CAA Sports",
  },
]

// Currency formatting
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

const calculatePercentChange = (current: number, previous: number): string => {
  const change = ((current - previous) / previous) * 100
  const sign = change > 0 ? "+" : ""
  return `${sign}${Math.round(change)}%`
}

// date formatting for chart
const formatDateLabel = (dateString: string): string => {
  const date = new Date(dateString)
  const month = date.toLocaleDateString("en-US", { month: "short" })
  const year = date.getFullYear().toString().slice(-2)
  return `${month} '${year}`
}

const revShareChartConfig = {
  active: {
    label: "RevShare Active",
    color: "hsl(var(--chart-1))",
  },
  inReview: {
    label: "RevShare In Review",
    color: "hsl(var(--chart-2))",
  },
}

const nilChartConfig = {
  committed: {
    label: "NIL Committed",
    color: "hsl(var(--chart-3))",
  },
  inReview: {
    label: "NIL In Review",
    color: "hsl(var(--chart-4))",
  },
  indicated: {
    label: "NIL Indicated",
    color: "hsl(var(--chart-5))",
  },
}

// Currency formatting
const CHART_COLORS = {
  revShare: "hsl(var(--chart-1))",
  enhancements: "hsl(var(--chart-2))",
  nilCommitted: "hsl(var(--chart-3))",
  nilGap: "hsl(var(--chart-4))",
  inactive: "hsl(var(--chart-5))",
}

export default function OverviewPage() {
  const [chartTimeRange, setChartTimeRange] = useState("All Years")
  const [revShareVisible, setRevShareVisible] = useState({
    active: true,
    inReview: true,
    annualCap: true,
  })
  const [nilVisible, setNilVisible] = useState({
    committed: true,
    inReview: true,
    indicated: true,
  })
  const [contractsSearch, setContractsSearch] = useState("")
  const [contractsSortColumn, setContractsSortColumn] = useState<string | null>(null)
  const [contractsSortDirection, setContractsSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 15

  const filteredChartData = useMemo(() => {
    if (chartTimeRange === "All Years") return contractValueData

    const seasonRanges: Record<string, { start: string; end: string }> = {
      "2025-26": { start: "2025-07-01", end: "2026-06-30" },
      "2026-27": { start: "2026-07-01", end: "2027-06-30" },
      "2027-28": { start: "2027-07-01", end: "2028-06-30" },
    }

    const range = seasonRanges[chartTimeRange]
    if (!range) return contractValueData

    return contractValueData.filter((item) => item.date >= range.start && item.date <= range.end)
  }, [chartTimeRange])

  const totalPipelineValue = overviewData.pipeline.reduce((sum, item) => sum + item.value, 0)

  const filteredAndSortedContracts = useMemo(() => {
    const filtered = allContractsData.filter((contract) => {
      const searchLower = contractsSearch.toLowerCase()
      return (
        contract.athlete.toLowerCase().includes(searchLower) ||
        contract.sport.toLowerCase().includes(searchLower) ||
        contract.position.toLowerCase().includes(searchLower) ||
        contract.contractType.toLowerCase().includes(searchLower) ||
        contract.status.toLowerCase().includes(searchLower) ||
        contract.agency.toLowerCase().includes(searchLower)
      )
    })

    if (contractsSortColumn) {
      filtered.sort((a, b) => {
        const aValue = a[contractsSortColumn as keyof typeof a]
        const bValue = b[contractsSortColumn as keyof typeof b]

        if (typeof aValue === "number" && typeof bValue === "number") {
          return contractsSortDirection === "asc" ? aValue - bValue : bValue - aValue
        }

        const aString = String(aValue).toLowerCase()
        const bString = String(bValue).toLowerCase()
        if (aString < bString) return contractsSortDirection === "asc" ? -1 : 1
        if (aString > bString) return contractsSortDirection === "asc" ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [allContractsData, contractsSearch, contractsSortColumn, contractsSortDirection])

  const paginatedContracts = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage
    return filteredAndSortedContracts.slice(startIndex, startIndex + rowsPerPage)
  }, [filteredAndSortedContracts, currentPage])

  const totalPages = Math.ceil(filteredAndSortedContracts.length / rowsPerPage)

  const handleSort = (column: string) => {
    if (contractsSortColumn === column) {
      setContractsSortDirection(contractsSortDirection === "asc" ? "desc" : "asc")
    } else {
      setContractsSortColumn(column)
      setContractsSortDirection("asc")
    }
  }

  const toggleRevShareSeries = (series: keyof typeof revShareVisible) => {
    setRevShareVisible((prev) => ({ ...prev, [series]: !prev[series] }))
  }

  const toggleNilSeries = (series: keyof typeof nilVisible) => {
    setNilVisible((prev) => ({ ...prev, [series]: !prev[series] }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contract Portfolio</h1>
          <p className="text-muted-foreground mt-1">Revenue share and NIL position across all contracts</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Export CSV</DropdownMenuItem>
            <DropdownMenuItem>Export Excel</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">RevShare Position</h3>
              <p className="text-sm text-muted-foreground">Active and in-review revenue share contracts</p>
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

          <ChartContainer config={revShareChartConfig} className="h-[200px] w-full">
            <AreaChart data={filteredChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillInReview" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(212, 95%, 68%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(212, 95%, 68%)" stopOpacity={0.1} />
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
              {revShareVisible.annualCap && (
                <ReferenceLine
                  y={10000000}
                  stroke="hsl(0, 84%, 60%)"
                  strokeWidth={0.75}
                  label={{
                    value: "Annual Cap",
                    position: "right",
                    fill: "hsl(0, 84%, 60%)",
                    fontSize: 12,
                  }}
                />
              )}
              <ChartTooltip
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) return null
                  const data = payload[0].payload
                  const total = data.revShareActive + data.revShareInReview
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-lg">
                      <p className="font-semibold mb-2">{formatDateLabel(data.date)}</p>
                      <div className="grid gap-1.5">
                        <div className="flex items-center gap-2 text-xs">
                          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "hsl(221, 83%, 53%)" }} />
                          <span className="text-muted-foreground">Active:</span>
                          <span className="font-medium ml-auto">{formatCurrencyFull(data.revShareActive)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "hsl(212, 95%, 68%)" }} />
                          <span className="text-muted-foreground">In Review:</span>
                          <span className="font-medium ml-auto">{formatCurrencyFull(data.revShareInReview)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs pt-1 border-t">
                          <span className="text-muted-foreground">Total:</span>
                          <span className="font-bold ml-auto">{formatCurrencyFull(total)}</span>
                        </div>
                      </div>
                    </div>
                  )
                }}
              />
              {revShareVisible.active && (
                <Area
                  type="monotone"
                  dataKey="revShareActive"
                  stackId="a"
                  stroke="hsl(221, 83%, 53%)"
                  fill="url(#fillActive)"
                  strokeWidth={2}
                />
              )}
              {revShareVisible.inReview && (
                <Area
                  type="monotone"
                  dataKey="revShareInReview"
                  stackId="a"
                  stroke="hsl(212, 95%, 68%)"
                  fill="url(#fillInReview)"
                  strokeWidth={2}
                />
              )}
            </AreaChart>
          </ChartContainer>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm">
            <button
              onClick={() => toggleRevShareSeries("active")}
              className={`flex items-center gap-2 cursor-pointer transition-opacity ${
                !revShareVisible.active ? "opacity-40" : "opacity-100"
              }`}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(221, 83%, 53%)" }} />
              <span className={`text-muted-foreground ${!revShareVisible.active ? "line-through" : ""}`}>
                RevShare Active
              </span>
            </button>
            <button
              onClick={() => toggleRevShareSeries("inReview")}
              className={`flex items-center gap-2 cursor-pointer transition-opacity ${
                !revShareVisible.inReview ? "opacity-40" : "opacity-100"
              }`}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(212, 95%, 68%)" }} />
              <span className={`text-muted-foreground ${!revShareVisible.inReview ? "line-through" : ""}`}>
                RevShare In Review
              </span>
            </button>
            <button
              onClick={() => toggleRevShareSeries("annualCap")}
              className={`flex items-center gap-2 cursor-pointer transition-opacity ${
                !revShareVisible.annualCap ? "opacity-40" : "opacity-100"
              }`}
            >
              <div className="w-5 h-0.5 bg-[hsl(0,84%,60%)]" />
              <span className={`text-muted-foreground ${!revShareVisible.annualCap ? "line-through" : ""}`}>
                Annual Cap
              </span>
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">NIL Position</h3>
              <p className="text-sm text-muted-foreground">Committed and in-review NIL contracts vs indicated</p>
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

          <ChartContainer config={nilChartConfig} className="h-[200px] w-full">
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
                NIL Indicated
              </span>
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="space-y-1 mb-4">
              <h3 className="text-lg font-semibold">Contract Pipeline</h3>
              <p className="text-sm text-muted-foreground">Value by contract stage</p>
            </div>
            <div className="space-y-3">
              {overviewData.pipeline.map((item) => (
                <div key={item.stage} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.stage}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">{formatCurrency(item.value)}</span>
                      <span className="text-muted-foreground">({item.count})</span>
                      {item.stage === "In Review" && item.count > 10 && (
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                      )}
                    </div>
                  </div>
                  <div className="relative h-[12px] bg-muted rounded-md overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-md transition-all"
                      style={{
                        width: `${(item.value / totalPipelineValue) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 text-sm flex-wrap">
              {overviewData.pipeline.map((item) => (
                <div key={item.stage} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.stage}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="space-y-1 mb-4">
              <h3 className="text-lg font-semibold">Commitments by Season</h3>
              <p className="text-sm text-muted-foreground">Projected spend by contract year</p>
            </div>
            <div className="space-y-3">
              {overviewData.seasonCommitments.map((season) => (
                <div key={season.season} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{season.season}</span>
                    <span className="font-bold">{formatCurrency(season.total)}</span>
                  </div>
                  <div className="relative h-[12px] bg-muted rounded-md overflow-hidden flex">
                    <div
                      className="h-full"
                      style={{
                        width: `${(season.revShare / season.total) * 100}%`,
                        backgroundColor: CHART_COLORS.revShare,
                      }}
                    />
                    <div
                      className="h-full"
                      style={{
                        width: `${(season.enhancements / season.total) * 100}%`,
                        backgroundColor: CHART_COLORS.enhancements,
                      }}
                    />
                    <div
                      className="h-full"
                      style={{
                        width: `${(season.nilCommitted / season.total) * 100}%`,
                        backgroundColor: CHART_COLORS.nilCommitted,
                      }}
                    />
                    <div
                      className="h-full rounded-md"
                      style={{
                        width: `${(season.nilGap / season.total) * 100}%`,
                        backgroundColor: CHART_COLORS.nilGap,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.revShare }} />
                <span className="text-muted-foreground">RevShare</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.enhancements }} />
                <span className="text-muted-foreground">Enhancements</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.nilCommitted }} />
                <span className="text-muted-foreground">NIL Committed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.nilGap }} />
                <span className="text-muted-foreground">NIL Gap</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="space-y-1 mb-4">
              <h3 className="text-lg font-semibold">NIL Funding Status</h3>
              <p className="text-sm text-muted-foreground">Sponsor coverage for NIL commitments</p>
            </div>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Total NIL Indicated</div>
                <div className="text-3xl font-bold">{formatCurrency(overviewData.nilFunding.totalIndicated)}</div>
              </div>
              <div className="relative h-[12px] bg-muted rounded-md overflow-hidden flex">
                <div
                  className="h-full"
                  style={{
                    width: `${overviewData.nilFunding.percentFunded}%`,
                    backgroundColor: CHART_COLORS.nilCommitted,
                  }}
                />
                <div
                  className="h-full rounded-r-md"
                  style={{
                    width: `${100 - overviewData.nilFunding.percentFunded}%`,
                    backgroundColor: CHART_COLORS.nilGap,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-bold">{formatCurrency(overviewData.nilFunding.committed)}</span>
                  <span className="text-muted-foreground ml-1">Committed</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold">{overviewData.nilFunding.percentFunded}%</span>
                </div>
                <div className="text-amber-600">
                  <span className="font-bold">{formatCurrency(overviewData.nilFunding.gap)}</span>
                  <span className="ml-1">Gap</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Season Comparison */}
        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="space-y-1 mb-4">
              <h3 className="text-lg font-semibold">Season Comparison</h3>
              <p className="text-sm text-muted-foreground">Year-over-year metrics</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium py-2"></th>
                    <th className="text-right font-medium py-2">{overviewData.seasonComparison.previous.season}</th>
                    <th className="text-right font-medium py-2">{overviewData.seasonComparison.current.season}</th>
                    <th className="text-right font-medium py-2">Δ</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2.5 text-muted-foreground">Contracts</td>
                    <td className="text-right py-2.5">{overviewData.seasonComparison.previous.contracts}</td>
                    <td className="text-right py-2.5 font-medium">{overviewData.seasonComparison.current.contracts}</td>
                    <td className="text-right py-2.5 text-emerald-600 font-medium">
                      {calculatePercentChange(
                        overviewData.seasonComparison.current.contracts,
                        overviewData.seasonComparison.previous.contracts,
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-muted-foreground">Total Value</td>
                    <td className="text-right py-2.5">
                      {formatCurrency(overviewData.seasonComparison.previous.value)}
                    </td>
                    <td className="text-right py-2.5 font-medium">
                      {formatCurrency(overviewData.seasonComparison.current.value)}
                    </td>
                    <td className="text-right py-2.5 text-emerald-600 font-medium">
                      {calculatePercentChange(
                        overviewData.seasonComparison.current.value,
                        overviewData.seasonComparison.previous.value,
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-muted-foreground">NIL Gap</td>
                    <td className="text-right py-2.5">
                      {formatCurrency(overviewData.seasonComparison.previous.nilGap)}
                    </td>
                    <td className="text-right py-2.5 font-medium">
                      {formatCurrency(overviewData.seasonComparison.current.nilGap)}
                    </td>
                    <td className="text-right py-2.5 text-amber-600 font-medium">
                      {calculatePercentChange(
                        overviewData.seasonComparison.current.nilGap,
                        overviewData.seasonComparison.previous.nilGap,
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-muted-foreground">Avg Review Days</td>
                    <td className="text-right py-2.5">{overviewData.seasonComparison.previous.avgReview}d</td>
                    <td className="text-right py-2.5 font-medium">
                      {overviewData.seasonComparison.current.avgReview}d
                    </td>
                    <td className="text-right py-2.5 text-amber-600 font-medium">
                      +
                      {overviewData.seasonComparison.current.avgReview -
                        overviewData.seasonComparison.previous.avgReview}
                      d
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Contracts Table - keep as is */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">All Contracts</h3>
              <p className="text-sm text-muted-foreground">Complete contract list with search and filtering</p>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Export CSV
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Export CSV</DropdownMenuItem>
                  <DropdownMenuItem>Export Excel</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search contracts..."
                value={contractsSearch}
                onChange={(e) => setContractsSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("athlete")}>
                    <div className="flex items-center gap-1">
                      Athlete
                      {contractsSortColumn === "athlete" &&
                        (contractsSortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3" />
                        ) : (
                          <ArrowDown className="w-3 h-3" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("sport")}>
                    <div className="flex items-center gap-1">
                      Sport
                      {contractsSortColumn === "sport" &&
                        (contractsSortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3" />
                        ) : (
                          <ArrowDown className="w-3 h-3" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("contractType")}>
                    <div className="flex items-center gap-1">
                      Type
                      {contractsSortColumn === "contractType" &&
                        (contractsSortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3" />
                        ) : (
                          <ArrowDown className="w-3 h-3" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                    <div className="flex items-center gap-1">
                      Status
                      {contractsSortColumn === "status" &&
                        (contractsSortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3" />
                        ) : (
                          <ArrowDown className="w-3 h-3" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => handleSort("totalValue")}>
                    <div className="flex items-center gap-1 justify-end">
                      Total Value
                      {contractsSortColumn === "totalValue" &&
                        (contractsSortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3" />
                        ) : (
                          <ArrowDown className="w-3 h-3" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => handleSort("revShare")}>
                    <div className="flex items-center gap-1 justify-end">
                      RevShare
                      {contractsSortColumn === "revShare" &&
                        (contractsSortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3" />
                        ) : (
                          <ArrowDown className="w-3 h-3" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer" onClick={() => handleSort("nilGap")}>
                    <div className="flex items-center gap-1 justify-end">
                      NIL Gap
                      {contractsSortColumn === "nilGap" &&
                        (contractsSortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3" />
                        ) : (
                          <ArrowDown className="w-3 h-3" />
                        ))}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("agency")}>
                    <div className="flex items-center gap-1">
                      Agency
                      {contractsSortColumn === "agency" &&
                        (contractsSortDirection === "asc" ? (
                          <ArrowUp className="w-3 h-3" />
                        ) : (
                          <ArrowDown className="w-3 h-3" />
                        ))}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedContracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell>
                      <Link href={`/contracts/active/${contract.id}`} className="font-medium hover:underline">
                        {contract.athlete}
                      </Link>
                    </TableCell>
                    <TableCell>{contract.sport}</TableCell>
                    <TableCell className="text-sm">{contract.contractType}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          contract.status === "Executed"
                            ? "bg-emerald-100 text-emerald-700"
                            : contract.status === "In Review"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {contract.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(contract.totalValue)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(contract.revShare)}</TableCell>
                    <TableCell className="text-right">
                      {contract.nilGap > 0 ? (
                        <span className="text-amber-600 font-medium">{formatCurrency(contract.nilGap)}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{contract.agency}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
              {Math.min(currentPage * rowsPerPage, filteredAndSortedContracts.length)} of{" "}
              {filteredAndSortedContracts.length} contracts
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
