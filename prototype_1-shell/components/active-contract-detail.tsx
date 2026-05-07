"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Download,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Check,
  Plus,
  Mail,
  MessageSquare,
  MoreVertical,
  Pause,
  ArrowRightLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts"
import {
  demoContract,
  demoScheduledPayments,
  demoOffSchedulePayments,
  demoObligations,
  SCHEDULED_TOTAL,
  OFF_SCHEDULE_TOTAL,
  GRAND_TOTAL,
} from "@/lib/demo-contract-data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// ─── Formatting Helpers ───

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(iso: string) {
  if (!iso) return "\u2014"
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatCurrencyShort(v: number) {
  if (v >= 1000) return `$${Math.round(v / 1000)}k`
  return `$${v}`
}

function formatChartMonth(dateKey: string) {
  const [y, m] = dateKey.split("-")
  return new Date(Number(y), Number(m) - 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })
}

function getPeriodRange(dateStr: string): string {
  if (!dateStr) return "\u2014"
  const d = new Date(dateStr + "T00:00:00")
  const y = d.getFullYear()
  const m = d.getMonth()
  const start = new Date(y, m, 1)
  const end = new Date(y, m + 1, 0)
  const fmt = (dt: Date) =>
    dt.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  return `${fmt(start)} \u2013 ${fmt(end)}, ${y}`
}

function getFiscalYear(dateStr: string): string {
  if (!dateStr) return "\u2014"
  const d = new Date(dateStr + "T00:00:00")
  const m = d.getMonth()
  const y = d.getFullYear()
  return m >= 6 ? `FY${(y + 1).toString().slice(-2)}` : `FY${y.toString().slice(-2)}`
}

function getAthleticSeason(dateStr: string): string {
  if (!dateStr) return "\u2014"
  const d = new Date(dateStr + "T00:00:00")
  const y = d.getFullYear()
  const m = d.getMonth()
  if (m >= 6) return `${y}-${(y + 1).toString().slice(-2)}`
  return `${y - 1}-${y.toString().slice(-2)}`
}

// ─── Types ───

interface PaymentStatus {
  status: "completed" | "upcoming" | "overdue" | "pending"
  paidDate?: string
  transactionId?: string
}

interface ActiveContractData {
  id: string
  title: string
  athlete: string
  athleteInitials: string
  sport: string
  position: string
  source: string
  contractType: string
  status: "active" | "paused"
  contractValue: number
  totalPaid: number
  startDate: string
  endDate: string
  activatedDate: string
  payments: number
  obligations: number
  deliverables: {
    completed: number
    total: number
  }
}

// ─── Mock Data (extends demo data for active state) ───

const mockActiveContract: ActiveContractData = {
  id: "osu-001",
  title: "2026 Benefits Pool Agreement",
  athlete: demoContract.athleteName,
  athleteInitials: demoContract.athleteInitials,
  sport: demoContract.sport,
  position: demoContract.position,
  source: demoContract.sourceName,
  contractType: demoContract.contractType,
  status: "active",
  contractValue: GRAND_TOTAL,
  totalPaid: 59500,
  startDate: demoContract.effectiveDate,
  endDate: demoContract.termEndDate,
  activatedDate: "2026-01-20",
  payments: demoScheduledPayments.length + demoOffSchedulePayments.length,
  obligations: demoObligations.length,
  deliverables: { completed: 1, total: 4 },
}

// Payment statuses for the first few scheduled payments
const paymentStatuses: Record<string, PaymentStatus> = {
  "sp-1": {
    status: "completed",
    paidDate: "2026-01-16",
    transactionId: "TXN-OSU-001",
  },
  "sp-2": {
    status: "completed",
    paidDate: "2026-02-01",
    transactionId: "TXN-OSU-002",
  },
  "sp-3": {
    status: "completed",
    paidDate: "2026-03-01",
    transactionId: "TXN-OSU-003",
  },
  "sp-4": {
    status: "upcoming",
  },
}

const offScheduleStatuses: Record<string, PaymentStatus> = {
  "os-1": {
    status: "completed",
    paidDate: "2026-01-16",
    transactionId: "TXN-OSU-SB1",
  },
  "os-2": { status: "pending" },
  "os-3": { status: "pending" },
}

// Deliverable statuses for the active contract
const deliverableStatuses = [
  {
    id: "d1",
    description: "Social media posts (collab posts)",
    direction: "Athlete \u2192 Sponsor",
    quantity: "8 posts",
    deadline: "2027-01-30",
    completed: 3,
    total: 8,
    status: "in-progress" as const,
  },
  {
    id: "d2",
    description: "Media production time",
    direction: "Athlete \u2192 Sponsor",
    quantity: "6 hours",
    deadline: "2027-01-30",
    completed: 2,
    total: 6,
    status: "in-progress" as const,
  },
  {
    id: "d3",
    description: "In-person appearances",
    direction: "Athlete \u2192 Sponsor",
    quantity: "2 appearances",
    deadline: "2027-01-30",
    completed: 0,
    total: 2,
    status: "not-started" as const,
  },
  {
    id: "d4",
    description: "Autographed items",
    direction: "Athlete \u2192 Sponsor",
    quantity: "200 items",
    deadline: "2027-01-30",
    completed: 200,
    total: 200,
    status: "completed" as const,
  },
]

// Review / Activity history
interface TimelineItem {
  id: string
  type: "version" | "note" | "email" | "status_change"
  timestamp: string
  actor: string
  versionNumber?: number
  filename?: string
  holder?: string
  isCurrent?: boolean
  summary?: string | null
  daysWithHolder?: number
  subject?: string
  preview?: string
  fromStatus?: string
  toStatus?: string
  content?: string
}

// Historical review-phase activity (matches negotiation detail for this contract)
const mockTimeline: TimelineItem[] = [
  // ── v3: final executed version ──
  {
    id: "tl-1",
    type: "note",
    timestamp: "2026-01-10T15:30:00Z",
    actor: "John H.",
    content: "Agent requested clarification on payment schedule structure. Sent updated terms via email.",
  },
  {
    id: "tl-2",
    type: "version",
    timestamp: "2026-01-08T11:00:00Z",
    actor: "University Legal",
    versionNumber: 3,
    filename: "BenefitsPool_MWilliams_v3.pdf",
    holder: "With Agent",
    isCurrent: true,
    summary: "Accepted payment schedule changes. Updated clawback language per agent request.",
    daysWithHolder: 3,
  },
  // ── activities between v2 and v3 ──
  {
    id: "tl-3",
    type: "email",
    timestamp: "2026-01-07T16:30:00Z",
    actor: "James Chen",
    subject: "RE: Benefits Pool Agreement - Payment Terms",
    preview: "Thanks for the updated terms. We're reviewing the clawback language now and should have comments by EOD.",
  },
  {
    id: "tl-4",
    type: "status_change",
    timestamp: "2026-01-05T14:30:00Z",
    actor: "System",
    fromStatus: "Draft Sent",
    toStatus: "In Redlining",
  },
  {
    id: "tl-5",
    type: "note",
    timestamp: "2026-01-05T11:15:00Z",
    actor: "University Legal",
    content: "Received initial redlines from Excel Sports. Minor changes to termination language.",
  },
  // ── v2 ──
  {
    id: "tl-6",
    type: "version",
    timestamp: "2026-01-05T10:00:00Z",
    actor: "Excel Sports",
    versionNumber: 2,
    filename: "BenefitsPool_MWilliams_Redline.pdf",
    holder: "With University",
    isCurrent: false,
    summary: "Agent requested modification to payment schedule in Section 4. Minor changes to termination language.",
    daysWithHolder: 1,
  },
  // ── v1 ──
  {
    id: "tl-7",
    type: "version",
    timestamp: "2026-01-02T10:00:00Z",
    actor: "University Compliance",
    versionNumber: 1,
    filename: "BenefitsPool_MWilliams_Draft.pdf",
    holder: "With Agent",
    isCurrent: false,
    summary: null,
    daysWithHolder: 3,
  },
]

const mockParticipants = [
  { id: "p1", name: "Marcus Williams", initials: "MW", role: "Athlete" },
  { id: "p2", name: "James Chen", initials: "JC", role: "Agent" },
  {
    id: "p3",
    name: "University Legal",
    initials: "UL",
    role: "University Counsel",
  },
  {
    id: "p4",
    name: "University Compliance",
    initials: "UC",
    role: "University",
  },
]

// ─── Chart Config ───

const paymentChartConfig = {
  scheduled: { label: "Scheduled", color: "hsl(160, 60%, 40%)" },
  conditional: { label: "Conditional", color: "hsl(40, 90%, 55%)" },
}

// ─── Payment Chart ───

function PaymentChart() {
  const chartData = useMemo(() => {
    const grouped = new Map<
      string,
      { scheduled: number; conditional: number }
    >()

    demoScheduledPayments.forEach((p) => {
      const d = new Date(p.date + "T00:00:00")
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      const existing = grouped.get(key) || { scheduled: 0, conditional: 0 }
      existing.scheduled += p.amount
      grouped.set(key, existing)
    })

    demoOffSchedulePayments.forEach((p) => {
      const d = new Date(p.earliestDate + "T00:00:00")
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      const existing = grouped.get(key) || { scheduled: 0, conditional: 0 }
      if (p.name === "Signing Bonus") {
        existing.scheduled += p.amount
      } else {
        existing.conditional += p.amount
      }
      grouped.set(key, existing)
    })

    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, val]) => ({
        date: key,
        scheduled: val.scheduled,
        conditional: val.conditional,
      }))
  }, [])

  return (
    <div className="border rounded-lg p-4 bg-background">
      <ChartContainer
        config={paymentChartConfig}
        className="h-[200px] w-full"
      >
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="gradScheduledActive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(160, 60%, 40%)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="hsl(160, 60%, 40%)" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="gradConditionalActive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(40, 90%, 55%)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="hsl(40, 90%, 55%)" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
          <XAxis
            dataKey="date"
            tickFormatter={formatChartMonth}
            className="text-xs"
            tickMargin={8}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            className="text-xs"
            tickFormatter={formatCurrencyShort}
            tickMargin={8}
            axisLine={false}
            tickLine={false}
          />
          <ChartTooltip
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null
              const d = payload[0].payload
              return (
                <div className="rounded-lg border bg-background p-3 shadow-lg">
                  <p className="font-semibold mb-1 text-sm">
                    {formatChartMonth(d.date)}
                  </p>
                  {d.scheduled > 0 && (
                    <div className="flex items-center gap-2 text-xs">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: "hsl(160, 60%, 40%)" }}
                      />
                      <span className="text-muted-foreground">Scheduled:</span>
                      <span className="font-medium ml-auto">
                        {formatCurrency(d.scheduled)}
                      </span>
                    </div>
                  )}
                  {d.conditional > 0 && (
                    <div className="flex items-center gap-2 text-xs mt-1">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: "hsl(40, 90%, 55%)" }}
                      />
                      <span className="text-muted-foreground">Conditional:</span>
                      <span className="font-medium ml-auto">
                        {formatCurrency(d.conditional)}
                      </span>
                    </div>
                  )}
                </div>
              )
            }}
          />
          <Area
            type="monotone"
            dataKey="scheduled"
            stroke="hsl(160, 60%, 40%)"
            strokeWidth={2}
            fill="url(#gradScheduledActive)"
          />
          <Area
            type="monotone"
            dataKey="conditional"
            stroke="hsl(40, 90%, 55%)"
            strokeWidth={2}
            fill="url(#gradConditionalActive)"
          />
          <Legend
            verticalAlign="bottom"
            height={28}
            formatter={(value: string) => {
              if (value === "scheduled") return "Scheduled"
              if (value === "conditional") return "Conditional"
              return value
            }}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{
              fontSize: "11px",
              color: "hsl(var(--muted-foreground))",
            }}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

// ─── Fiscal Period Summary ───

function FiscalPeriodSummary() {
  const fiscalTotals = useMemo(() => {
    const totals = new Map<string, number>()
    demoScheduledPayments.forEach((p) => {
      const fy = getFiscalYear(p.date)
      totals.set(fy, (totals.get(fy) || 0) + p.amount)
    })
    return Array.from(totals.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [])

  return (
    <div className="flex items-center gap-2 flex-wrap mb-3 px-1">
      <span className="text-xs font-medium text-muted-foreground">
        Cap-applicable by period:
      </span>
      {fiscalTotals.map(([fy, total]) => (
        <Badge
          key={fy}
          variant="outline"
          className="text-xs font-medium px-2 py-0.5 border-muted-foreground/20 text-foreground bg-muted/40"
        >
          {fy}: {formatCurrency(total)}
        </Badge>
      ))}
    </div>
  )
}

// ─── Payment Status Badge ───

function PaymentStatusBadge({ ps }: { ps?: PaymentStatus }) {
  if (!ps || ps.status === "pending") {
    return (
      <Badge
        variant="outline"
        className="text-[10px] font-medium px-1.5 py-0 border-muted-foreground/30 text-muted-foreground"
      >
        Pending
      </Badge>
    )
  }
  if (ps.status === "completed") {
    return (
      <Badge
        variant="outline"
        className="text-[10px] font-medium px-1.5 py-0 border-emerald-300 text-emerald-700 bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:bg-emerald-950/30"
      >
        Paid
      </Badge>
    )
  }
  if (ps.status === "upcoming") {
    return (
      <Badge
        variant="outline"
        className="text-[10px] font-medium px-1.5 py-0 border-blue-300 text-blue-700 bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:bg-blue-950/30"
      >
        Upcoming
      </Badge>
    )
  }
  return (
    <Badge
      variant="outline"
      className="text-[10px] font-medium px-1.5 py-0 border-red-300 text-red-700 bg-red-50 dark:border-red-700 dark:text-red-400 dark:bg-red-950/30"
    >
      Overdue
    </Badge>
  )
}

// ─── Deliverable Status Badge ─���─

function DeliverableStatusBadge({ status }: { status: "completed" | "in-progress" | "not-started" }) {
  if (status === "completed") {
    return (
      <Badge
        variant="outline"
        className="text-[10px] font-medium px-1.5 py-0 border-emerald-300 text-emerald-700 bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:bg-emerald-950/30"
      >
        Completed
      </Badge>
    )
  }
  if (status === "in-progress") {
    return (
      <Badge
        variant="outline"
        className="text-[10px] font-medium px-1.5 py-0 border-blue-300 text-blue-700 bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:bg-blue-950/30"
      >
        In Progress
      </Badge>
    )
  }
  return (
    <Badge
      variant="outline"
      className="text-[10px] font-medium px-1.5 py-0 border-muted-foreground/30 text-muted-foreground"
    >
      Not Started
    </Badge>
  )
}

// ─── Payments Tab ───

function PaymentsTab() {
  const [upcomingScheduledOpen, setUpcomingScheduledOpen] = useState(true)
  const [conditionalOpen, setConditionalOpen] = useState(true)
  const [paidOpen, setPaidOpen] = useState(false)

  // Separate paid vs upcoming/pending scheduled payments
  const paidScheduled = demoScheduledPayments.filter(
    (p) => paymentStatuses[p.id]?.status === "completed"
  )
  const upcomingScheduled = demoScheduledPayments.filter(
    (p) => !paymentStatuses[p.id] || paymentStatuses[p.id]?.status !== "completed"
  )

  const paidScheduledTotal = paidScheduled.reduce((acc, p) => acc + p.amount, 0)
  const upcomingTotal = upcomingScheduled.reduce((acc, p) => acc + p.amount, 0)

  const paidConditional = demoOffSchedulePayments.filter(
    (p) => offScheduleStatuses[p.id]?.status === "completed"
  )
  const paidConditionalTotal = paidConditional.reduce((acc, p) => acc + p.amount, 0)

  // All paid payments combined (scheduled + conditional)
  const allPaidPayments: Array<{
    id: string
    date: string
    amount: number
    type: string
    paidDate?: string
    source: "scheduled" | "conditional"
    fiscalYear: string
    athleticYear: string
    period: string
  }> = [
    ...paidScheduled.map((p) => ({
      id: p.id,
      date: p.date,
      amount: p.amount,
      type: "License Fee",
      paidDate: paymentStatuses[p.id]?.paidDate,
      source: "scheduled" as const,
      fiscalYear: getFiscalYear(p.date),
      athleticYear: getAthleticSeason(p.date),
      period: getPeriodRange(p.date),
    })),
    ...paidConditional.map((p) => ({
      id: p.id,
      date: p.earliestDate,
      amount: p.amount,
      type: p.name,
      paidDate: offScheduleStatuses[p.id]?.paidDate,
      source: "conditional" as const,
      fiscalYear: getFiscalYear(p.earliestDate),
      athleticYear: getAthleticSeason(p.earliestDate),
      period: getPeriodRange(p.earliestDate),
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const allPaidTotal = paidScheduledTotal + paidConditionalTotal

  // Upcoming conditional payments (not yet paid)
  const upcomingConditional = demoOffSchedulePayments.filter(
    (p) => !offScheduleStatuses[p.id] || offScheduleStatuses[p.id]?.status !== "completed"
  )

  return (
    <div className="space-y-6">
      <PaymentChart />

      <FiscalPeriodSummary />

      {/* Upcoming/Pending Scheduled Payments */}
      <section>
        <button
          onClick={() => setUpcomingScheduledOpen(!upcomingScheduledOpen)}
          className="flex items-center gap-2 w-full text-left py-1 mb-2"
        >
          {upcomingScheduledOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <h2 className="text-sm font-semibold text-foreground">
            Upcoming / Pending Scheduled Payments
          </h2>
          <span className="text-xs text-muted-foreground">
            ({upcomingScheduled.length})
          </span>
          <span className="ml-auto text-xs font-medium text-muted-foreground">
            {formatCurrency(upcomingTotal)} remaining
          </span>
        </button>
        {upcomingScheduledOpen && (
          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-10">
                    #
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Payment Date
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Period
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Type
                  </th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-14">
                    Cap
                  </th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-16">
                    Fiscal Yr
                  </th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-20">
                    Athletic Yr
                  </th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-20">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {upcomingScheduled.map((payment, i) => {
                  const ps = paymentStatuses[payment.id]
                  return (
                    <tr
                      key={payment.id}
                      className={cn(
                        "border-b last:border-b-0 transition-colors",
                        ps?.status === "upcoming" && "bg-blue-50/20 dark:bg-blue-950/10"
                      )}
                    >
                      <td className="py-2.5 px-3 text-sm text-muted-foreground text-center">
                        {paidScheduled.length + i + 1}
                      </td>
                      <td className="py-2.5 px-3 text-sm font-medium text-foreground">
                        {formatDate(payment.date)}
                      </td>
                      <td className="py-2.5 px-3 text-sm text-muted-foreground">
                        {getPeriodRange(payment.date)}
                      </td>
                      <td className="py-2.5 px-3 text-sm font-semibold text-foreground">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="py-2.5 px-3 text-sm text-muted-foreground">
                        License Fee
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                      </td>
                      <td className="py-2.5 px-3 text-sm text-muted-foreground text-center">
                        {getFiscalYear(payment.date)}
                      </td>
                      <td className="py-2.5 px-3 text-sm text-muted-foreground text-center">
                        {getAthleticSeason(payment.date)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <PaymentStatusBadge ps={ps} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="bg-muted/30">
                  <td className="py-2.5 px-3" />
                  <td
                    className="py-2.5 px-3 text-sm font-semibold text-foreground"
                    colSpan={2}
                  >
                    Total Remaining
                  </td>
                  <td className="py-2.5 px-3 text-sm font-semibold text-foreground">
                    {formatCurrency(upcomingTotal)}
                  </td>
                  <td
                    className="py-2.5 px-3 text-xs text-muted-foreground"
                    colSpan={5}
                  >
                    {formatCurrency(SCHEDULED_TOTAL)} total scheduled ({formatCurrency(paidScheduledTotal)} paid)
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>

      {/* Conditional Payments (upcoming only) */}
      <section>
        <button
          onClick={() => setConditionalOpen(!conditionalOpen)}
          className="flex items-center gap-2 w-full text-left py-1 mb-2"
        >
          {conditionalOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <h2 className="text-sm font-semibold text-foreground">
            Conditional Payments
          </h2>
          <span className="text-xs text-muted-foreground">
            ({upcomingConditional.length} pending)
          </span>
        </button>
        {conditionalOpen && (
          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-10">
                    #
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Payment Date
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Period
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Type
                  </th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-14">
                    Cap
                  </th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-16">
                    Fiscal Yr
                  </th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-20">
                    Athletic Yr
                  </th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-20">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {upcomingConditional.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-4 text-center text-sm text-muted-foreground">
                      All conditional payments have been fulfilled
                    </td>
                  </tr>
                ) : (
                  upcomingConditional.map((payment, i) => {
                    const ps = offScheduleStatuses[payment.id]
                    return (
                      <tr
                        key={payment.id}
                        className="border-b last:border-b-0 transition-colors"
                      >
                        <td className="py-2.5 px-3 text-sm text-muted-foreground text-center">
                          {i + 1}
                        </td>
                        <td className="py-2.5 px-3 text-sm font-medium text-foreground">
                          {formatDate(payment.earliestDate)}
                        </td>
                        <td className="py-2.5 px-3 text-sm text-muted-foreground">
                          {getPeriodRange(payment.earliestDate)}
                        </td>
                        <td className="py-2.5 px-3 text-sm font-semibold text-foreground">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="py-2.5 px-3 text-sm text-muted-foreground">
                          {payment.name}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <Check className="h-4 w-4 text-emerald-600 mx-auto" />
                        </td>
                        <td className="py-2.5 px-3 text-sm text-muted-foreground text-center">
                          {getFiscalYear(payment.earliestDate)}
                        </td>
                        <td className="py-2.5 px-3 text-sm text-muted-foreground text-center">
                          {getAthleticSeason(payment.earliestDate)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <PaymentStatusBadge ps={ps} />
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
              <tfoot>
                <tr className="bg-muted/30">
                  <td className="py-2.5 px-3" />
                  <td
                    className="py-2.5 px-3 text-sm font-semibold text-foreground"
                    colSpan={2}
                  >
                    Total
                  </td>
                  <td className="py-2.5 px-3 text-sm font-semibold text-foreground">
                    {formatCurrency(OFF_SCHEDULE_TOTAL)}
                  </td>
                  <td
                    className="py-2.5 px-3 text-xs text-muted-foreground"
                    colSpan={5}
                  >
                    {formatCurrency(OFF_SCHEDULE_TOTAL)} cap-applicable
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>

      {/* Paid Payments (all types combined) */}
      {allPaidPayments.length > 0 && (
        <section>
          <button
            onClick={() => setPaidOpen(!paidOpen)}
            className="flex items-center gap-2 w-full text-left py-1 mb-2"
          >
            {paidOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <h2 className="text-sm font-semibold text-foreground">
              Paid Payments
            </h2>
            <span className="text-xs text-muted-foreground">
              ({allPaidPayments.length})
            </span>
            <span className="ml-auto text-xs font-medium text-emerald-600">
              {formatCurrency(allPaidTotal)} paid
            </span>
          </button>
          {paidOpen && (
            <div className="border rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-10">
                      #
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Payment Date
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Period
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Amount
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Type
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-24">
                      Source
                    </th>
                    <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-16">
                      Fiscal Yr
                    </th>
                    <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-20">
                      Athletic Yr
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-24">
                      Paid Date
                    </th>
                    <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-20">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allPaidPayments.map((payment, i) => (
                    <tr
                      key={payment.id}
                      className="border-b last:border-b-0 bg-emerald-50/30 dark:bg-emerald-950/10 transition-colors"
                    >
                      <td className="py-2.5 px-3 text-sm text-muted-foreground text-center">
                        {i + 1}
                      </td>
                      <td className="py-2.5 px-3 text-sm font-medium text-foreground">
                        {formatDate(payment.date)}
                      </td>
                      <td className="py-2.5 px-3 text-sm text-muted-foreground">
                        {payment.period}
                      </td>
                      <td className="py-2.5 px-3 text-sm font-semibold text-foreground">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="py-2.5 px-3 text-sm text-muted-foreground">
                        {payment.type}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] font-medium px-1.5 py-0",
                            payment.source === "scheduled"
                              ? "border-muted-foreground/30 text-muted-foreground"
                              : "border-amber-300 text-amber-700 bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:bg-amber-950/30"
                          )}
                        >
                          {payment.source === "scheduled" ? "Scheduled" : "Conditional"}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-sm text-muted-foreground text-center">
                        {payment.fiscalYear}
                      </td>
                      <td className="py-2.5 px-3 text-sm text-muted-foreground text-center">
                        {payment.athleticYear}
                      </td>
                      <td className="py-2.5 px-3 text-sm text-muted-foreground">
                        {payment.paidDate ? formatDate(payment.paidDate) : "\u2014"}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-medium px-1.5 py-0 border-emerald-300 text-emerald-700 bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:bg-emerald-950/30"
                        >
                          Paid
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/30">
                    <td className="py-2.5 px-3" />
                    <td
                      className="py-2.5 px-3 text-sm font-semibold text-foreground"
                      colSpan={2}
                    >
                      Total Paid
                    </td>
                    <td className="py-2.5 px-3 text-sm font-semibold text-emerald-600">
                      {formatCurrency(allPaidTotal)}
                    </td>
                    <td
                      className="py-2.5 px-3 text-xs text-muted-foreground"
                      colSpan={6}
                    >
                      {paidScheduled.length} scheduled, {paidConditional.length} conditional
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

// ─── Deliverables Tab ───

function DeliverablesTab() {
  return (
    <div className="space-y-6">
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-10">
                #
              </th>
              <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Description
              </th>
              <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-36">
                {"Source \u2192 Beneficiary"}
              </th>
              <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-28">
                Quantity
              </th>
              <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-28">
                Progress
              </th>
              <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-28">
                Deadline
              </th>
              <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-24">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {deliverableStatuses.map((d, i) => (
              <tr
                key={d.id}
                className={cn(
                  "border-b last:border-b-0 transition-colors",
                  d.status === "completed" && "bg-emerald-50/30 dark:bg-emerald-950/10"
                )}
              >
                <td className="py-2.5 px-3 text-sm text-muted-foreground text-center">
                  {i + 1}
                </td>
                <td className="py-2.5 px-3 text-sm text-foreground">
                  {d.description}
                </td>
                <td className="py-2.5 px-3 text-sm text-muted-foreground">
                  {d.direction}
                </td>
                <td className="py-2.5 px-3 text-sm text-muted-foreground">
                  {d.quantity}
                </td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-1.5">
                      <div
                        className={cn(
                          "h-1.5 rounded-full transition-all",
                          d.status === "completed"
                            ? "bg-emerald-500"
                            : d.status === "in-progress"
                              ? "bg-blue-500"
                              : "bg-muted-foreground/20"
                        )}
                        style={{
                          width: `${d.total > 0 ? (d.completed / d.total) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {d.completed}/{d.total}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-sm text-muted-foreground">
                  {formatDate(d.deadline)}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <DeliverableStatusBadge status={d.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Review History Tab (matches negotiation detail Activity layout) ───

function ReviewHistoryTab() {
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set())

  const toggleVersionExpanded = (versionId: string) => {
    setExpandedVersions((prev) => {
      const next = new Set(prev)
      if (next.has(versionId)) {
        next.delete(versionId)
      } else {
        next.add(versionId)
      }
      return next
    })
  }

  // Group timeline items by version - activity items belong to the version that precedes them
  const groupTimelineByVersion = (timeline: TimelineItem[]) => {
    if (!timeline || timeline.length === 0) return []

    const sorted = [...timeline].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    const groups: { version: TimelineItem; activities: TimelineItem[] }[] = []
    let currentActivities: TimelineItem[] = []

    for (const item of sorted) {
      if (item.type === "version") {
        groups.push({
          version: item,
          activities: currentActivities,
        })
        currentActivities = []
      } else {
        currentActivities.push(item)
      }
    }

    // Attach orphan activities at the end to last version
    if (currentActivities.length > 0 && groups.length > 0) {
      groups[groups.length - 1].activities.push(...currentActivities)
    }

    return groups
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getDaysWaitingColor = (days: number) => {
    if (days <= 3) return "text-muted-foreground"
    if (days <= 6) return "text-amber-600 dark:text-amber-500"
    return "text-red-600 dark:text-red-500"
  }

  const groups = groupTimelineByVersion(mockTimeline)

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main timeline */}
      <div className="lg:col-span-2 space-y-4">
        {/* Timeline with vertical line - Accordion structure */}
        <div className="relative">
          <div className="space-y-3">
            {groups.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>
            ) : (
              groups.map((group, groupIndex) => {
                const item = group.version
                const activities = group.activities
                const isExpanded = expandedVersions.has(item.id)
                const hasActivities = activities.length > 0
                const isLast = groupIndex === groups.length - 1

                return (
                  <div key={item.id} className="relative">
                    {/* Vertical timeline line connecting to next version card */}
                    {!isLast && (
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                    )}
                    {/* Version Card */}
                    <div
                      className={cn(
                        "relative z-10 p-4 rounded-lg border bg-card",
                        item.isCurrent && "border-blue-300 bg-blue-50/50 dark:border-blue-700 dark:bg-blue-950/30"
                      )}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 shrink-0">
                              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span
                              className={cn(
                                "text-base font-semibold",
                                item.isCurrent && "text-blue-700 dark:text-blue-400"
                              )}
                            >
                              v{item.versionNumber}
                            </span>
                            <span className="text-sm truncate max-w-[200px]">{item.filename}</span>
                            {item.isCurrent && (
                              <Badge variant="default" className="text-xs bg-blue-600 text-white">
                                CURRENT
                              </Badge>
                            )}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download Version
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground pl-11">
                          <span>{item.holder}</span>
                          {item.daysWithHolder !== undefined && item.daysWithHolder > 0 && (
                            <span className={getDaysWaitingColor(item.daysWithHolder)}>
                              {item.daysWithHolder} {item.daysWithHolder === 1 ? "day" : "days"}
                            </span>
                          )}
                          <span>{formatTimestamp(item.timestamp)}</span>
                          <span>by {item.actor}</span>
                        </div>
                        {item.summary && (
                          <p className="text-sm text-muted-foreground pl-11 border-t pt-2 mt-2">{item.summary}</p>
                        )}
                        {/* Expand/Collapse toggle */}
                        {hasActivities && (
                          <button
                            type="button"
                            onClick={() => toggleVersionExpanded(item.id)}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-2 pl-11"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronDown className="h-3.5 w-3.5" />
                                <span>Hide activity ({activities.length})</span>
                              </>
                            ) : (
                              <>
                                <ChevronRight className="h-3.5 w-3.5" />
                                <span>Show activity ({activities.length})</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Collapsible Activities Section */}
                    {hasActivities && isExpanded && (
                      <div className="mt-2 space-y-2">
                        {activities.map((activity) => (
                          <div key={activity.id}>
                            {/* Note activity */}
                            {activity.type === "note" && (
                              <div className="relative pl-10">
                                <div className="absolute left-4 top-4 w-6 h-0.5 bg-border" />
                                <div className="absolute left-[14px] top-[14px] w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 z-10" />
                                <div className="p-3 rounded-lg border bg-card text-sm">
                                  <div className="flex items-center gap-2 mb-1">
                                    <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="font-medium text-sm">{activity.actor}</span>
                                    <span className="text-xs text-muted-foreground">{formatTimestamp(activity.timestamp)}</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground pl-5">{activity.content}</p>
                                </div>
                              </div>
                            )}

                            {/* Email activity */}
                            {activity.type === "email" && (
                              <div className="relative pl-10">
                                <div className="absolute left-4 top-4 w-6 h-0.5 bg-border" />
                                <div className="absolute left-[14px] top-[14px] w-2 h-2 rounded-full bg-purple-500 z-10" />
                                <div className="p-3 rounded-lg border border-l-2 border-l-purple-500 bg-card text-sm">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Mail className="h-3.5 w-3.5 text-purple-600" />
                                    <span className="font-medium text-sm">{activity.actor}</span>
                                    <span className="text-xs text-muted-foreground">{formatTimestamp(activity.timestamp)}</span>
                                  </div>
                                  <div className="pl-5">
                                    <div className="text-sm font-medium">{activity.subject}</div>
                                    <p className="text-xs text-muted-foreground mt-0.5">{activity.preview}</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Status change activity */}
                            {activity.type === "status_change" && (
                              <div className="relative pl-10">
                                <div className="absolute left-4 top-4 w-6 h-0.5 bg-border" />
                                <div className="absolute left-[14px] top-[14px] w-2 h-2 rounded-full bg-green-500 z-10" />
                                <div className="p-3 rounded-lg border border-l-2 border-l-green-500 bg-card text-sm">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <ArrowRightLeft className="h-3.5 w-3.5 text-green-600" />
                                    <Badge variant="secondary" className="text-xs h-5">
                                      {activity.fromStatus}
                                    </Badge>
                                    <span className="text-muted-foreground">{"\u2192"}</span>
                                    <Badge variant="default" className="text-xs bg-green-600 text-white h-5">
                                      {activity.toStatus}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground ml-auto">
                                      {formatTimestamp(activity.timestamp)} by {activity.actor}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Participants only (no Quick Actions for active contracts) */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Participants</CardTitle>
                <p className="text-xs text-muted-foreground">All parties involved in this contract</p>
              </div>

            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockParticipants.map((participant) => (
              <Tooltip key={participant.id}>
                <TooltipTrigger asChild>
                  <div className="group flex items-start gap-3 rounded-lg border p-2 hover:bg-muted/50 cursor-default">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {participant.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{participant.name}</div>
                      <div className="text-xs text-muted-foreground">{participant.role}</div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <div className="text-xs">
                    <div className="font-medium">{participant.name}</div>
                    <div className="text-muted-foreground">{participant.role}</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}

          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ─── Main Component ───

type ActiveTab = "Payments" | "Deliverables" | "Review History"

interface ActiveContractDetailProps {
  contractId: string
}

export function ActiveContractDetail({ contractId }: ActiveContractDetailProps) {
  const router = useRouter()
  const contract = mockActiveContract
  const [activeTab, setActiveTab] = useState<ActiveTab>("Payments")

  const paidPercentage = Math.round(
    (contract.totalPaid / contract.contractValue) * 100
  )

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-0">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/contracts/active")}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Active Contracts
          </button>

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold text-foreground">
                  {contract.title}
                </h1>
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                  Active
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {contract.athlete} &middot; {contract.contractType}
              </p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                This contract covers a {contract.contractType} between{" "}
                {contract.athlete} and {contract.source}, consisting of{" "}
                {demoScheduledPayments.length} scheduled and{" "}
                {demoOffSchedulePayments.filter((p) => p.name !== "Signing Bonus").length}{" "}
                conditional payments across {deliverableStatuses.length}{" "}
                deliverables, {demoObligations.length} obligations, and{" "}
                {formatCurrency(GRAND_TOTAL)} in total value.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs h-8"
              >
                <Download className="h-3.5 w-3.5" />
                Download Executed Contract
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Pause className="h-3.5 w-3.5 mr-2" />
                    Pause Contract
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="h-3.5 w-3.5 mr-2" />
                    View Original
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Key stats row */}
          <div className="flex items-center gap-6 mt-3 pt-3 border-t">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                Contract Value
              </p>
              <p className="text-sm font-semibold text-foreground">
                {formatCurrency(contract.contractValue)}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                Paid to Date
              </p>
              <p className="text-sm font-semibold text-emerald-600">
                {formatCurrency(contract.totalPaid)} ({paidPercentage}%)
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                Start Date
              </p>
              <p className="text-sm font-semibold text-foreground">
                {formatDate(contract.startDate)}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                End Date
              </p>
              <p className="text-sm font-semibold text-foreground">
                {formatDate(contract.endDate)}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                Payments
              </p>
              <p className="text-sm font-semibold text-foreground">
                {contract.payments}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                Activated
              </p>
              <p className="text-sm font-semibold text-foreground">
                {formatDate(contract.activatedDate)}
              </p>
            </div>
          </div>


        </div>

        {/* Tab Bar - matches Athlete page pattern */}
        <div className="border-b mb-6">
          <nav className="flex gap-6" aria-label="Contract detail tabs">
            {(["Payments", "Deliverables", "Review History"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "Payments" && <PaymentsTab />}
        {activeTab === "Deliverables" && <DeliverablesTab />}
        {activeTab === "Review History" && <ReviewHistoryTab />}
      </div>
    </TooltipProvider>
  )
}
