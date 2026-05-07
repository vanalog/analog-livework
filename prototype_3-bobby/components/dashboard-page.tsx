"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  DollarSign,
  FileText,
  Shield,
  ArrowUpRight,
  Banknote,
  CheckCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { ResponsiveContainer, XAxis, YAxis, AreaChart, Area, Tooltip as RechartsTooltip } from "recharts"
import { Calendar, CreditCard } from "lucide-react"

// Realistic D1 disbursement data over time (bi-weekly schedule)
const disbursementData = [
  { period: "Jan 1", actual: 0, projected: 0, cumulative: 0 },
  { period: "Jan 15", actual: 425000, projected: 425000, cumulative: 425000 },
  { period: "Feb 1", actual: 380000, projected: 380000, cumulative: 805000 },
  { period: "Feb 15", actual: 520000, projected: 520000, cumulative: 1325000 },
  { period: "Mar 1", actual: 445000, projected: 445000, cumulative: 1770000 },
  { period: "Mar 15", actual: 390000, projected: 390000, cumulative: 2160000 },
  { period: "Apr 1", actual: 485000, projected: 485000, cumulative: 2645000 },
  { period: "Apr 15", actual: 520000, projected: 520000, cumulative: 3165000 },
  { period: "May 1", actual: 465000, projected: 465000, cumulative: 3630000 },
  { period: "May 15", actual: 510000, projected: 510000, cumulative: 4140000 },
  { period: "Jun 1", actual: 485000, projected: 485000, cumulative: 4625000 },
  { period: "Jun 15", actual: 575000, projected: 575000, cumulative: 5200000 },
  { period: "Jul 1", actual: null, projected: 485000, cumulative: 5200000 },
  { period: "Jul 15", actual: null, projected: 520000, cumulative: 5200000 },
  { period: "Aug 1", actual: null, projected: 565000, cumulative: 5200000 },
  { period: "Aug 15", actual: null, projected: 610000, cumulative: 5200000 },
  { period: "Sep 1", actual: null, projected: 545000, cumulative: 5200000 },
  { period: "Sep 15", actual: null, projected: 580000, cumulative: 5200000 },
  { period: "Oct 1", actual: null, projected: 625000, cumulative: 5200000 },
  { period: "Oct 15", actual: null, projected: 590000, cumulative: 5200000 },
  { period: "Nov 1", actual: null, projected: 535000, cumulative: 5200000 },
  { period: "Nov 15", actual: null, projected: 485000, cumulative: 5200000 },
  { period: "Dec 1", actual: null, projected: 420000, cumulative: 5200000 },
  { period: "Dec 15", actual: null, projected: 380000, cumulative: 5200000 },
]

// Department budget data
const departmentBudgets = [
  {
    name: "Football",
    athletes: 28,
    allocated: 425000,
    spent: 331500,
    percentage: 78,
  },
  {
    name: "Men's Basketball",
    athletes: 22,
    allocated: 350000,
    spent: 227500,
    percentage: 65,
  },
  {
    name: "Soccer",
    athletes: 18,
    allocated: 175000,
    spent: 143500,
    percentage: 82,
  },
  {
    name: "Track & Field",
    athletes: 15,
    allocated: 120000,
    spent: 54000,
    percentage: 45,
  },
  {
    name: "Swimming",
    athletes: 12,
    allocated: 95000,
    spent: 55100,
    percentage: 58,
  },
  {
    name: "Other Sports",
    athletes: 19,
    allocated: 80000,
    spent: 28000,
    percentage: 35,
  },
]

const formatCurrency = (amount: number | null) => {
  if (amount === null) {
    return "$0"
  }
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`
  } else {
    return `$${amount.toLocaleString()}`
  }
}

const activityFeed = [
  {
    id: 1,
    type: "disbursement",
    title: "Payment of $45,000 sent to Marcus Johnson",
    description: "Football revenue share disbursed",
    amount: "$45,000",
    timestamp: "2 hours ago",
    status: "completed",
    icon: ArrowUpRight,
    iconColor: "text-green-600",
    bgColor: "bg-green-100",
    user: "System",
  },
  {
    id: 2,
    type: "contract",
    title: "Thomas approved Contract #248",
    description: "Sarah Williams - Nike partnership agreement uploaded",
    amount: "$35,000",
    timestamp: "5 hours ago",
    status: "pending_review",
    icon: FileText,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100",
    user: "Thomas",
  },
  {
    id: 3,
    type: "compliance",
    title: "Compliance flag resolved",
    description: "David Chen - Academic eligibility verified",
    amount: null,
    timestamp: "1 day ago",
    status: "resolved",
    icon: Shield,
    iconColor: "text-green-600",
    bgColor: "bg-green-100",
    user: "System",
  },
  {
    id: 4,
    type: "approval",
    title: "Contract approved",
    description: "Emma Taylor - Sports drink endorsement approved by legal",
    amount: "$25,000",
    timestamp: "1 day ago",
    status: "approved",
    icon: CheckCircle,
    iconColor: "text-green-600",
    bgColor: "bg-green-100",
    user: "Legal Dept",
  },
  {
    id: 5,
    type: "flag",
    title: "Compliance issue flagged",
    description: "James Wilson - Contract terms require review",
    amount: "$18,000",
    timestamp: "2 days ago",
    status: "flagged",
    icon: AlertTriangle,
    iconColor: "text-orange-600",
    bgColor: "bg-orange-100",
    user: "System",
  },
]

export function DashboardOverview() {
  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Athlete Payout Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Financial oversight and compliance management
          </p>
        </div>

        {/* NIL Operations Section */}
        <div className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Benefits Pool - spans 2 columns */}
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Benefits Pool</h3>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold">$20.5M allocated</p>
                    <div className="flex items-center gap-1 text-sm mt-1">
                      <ArrowUpRight className="h-3 w-3 text-green-600" />
                      <span className="text-green-600 font-medium">12.5%</span>
                      <span className="text-muted-foreground">from previous year</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">$13.3M spent</span>
                      <span className="font-medium">$7.2M remaining</span>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-help">
                          <Progress value={65} className="h-3" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>$13.3M disbursed out of $20.5M total NIL allocation for FY2025</p>
                      </TooltipContent>
                    </Tooltip>
                    <p className="text-xs text-muted-foreground">65% utilized • On track – 7 months into fiscal year</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contracts */}
            <Card>
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Contracts</h3>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-end gap-6">
                    <Link href="/contracts/active" className="group">
                      <p className="text-3xl font-bold text-green-600 group-hover:text-green-700 transition-colors">32</p>
                      <p className="text-xs text-muted-foreground group-hover:underline">Active</p>
                    </Link>
                    <Link href="/contracts/negotiation" className="group">
                      <p className="text-3xl font-bold group-hover:text-foreground/80 transition-colors">12</p>
                      <p className="text-xs text-muted-foreground group-hover:underline">In Review</p>
                    </Link>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">$27.0M total value across 52 contracts</p>
                </div>
                <Link
                  href="/portfolio"
                  className="mt-4 inline-flex items-center justify-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors border border-border rounded-md px-3 py-1.5 w-full hover:bg-muted"
                >
                  View Portfolio
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </CardContent>
            </Card>

            {/* Active Sponsors */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <h3 className="text-sm font-medium text-muted-foreground">Active Sponsors</h3>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="w-4 h-4 rounded-full border border-muted-foreground flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">?</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Companies and organizations providing NIL opportunities</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold">37</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <ArrowUpRight className="h-3 w-3 text-green-600" />
                      <span className="text-green-600 font-medium">3 new this month</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Engaging 64 athletes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts Row - Side by Side */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Disbursement Timeline Chart - 50% width */}
          <Card className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5" />
                    Disbursement Timeline
                  </CardTitle>
                  <CardDescription>Bi-weekly payout schedule with projections</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/disbursements">View Details</Link>
                </Button>
              </div>
            </CardHeader>
  <CardContent className="flex-1 flex flex-col min-h-[300px]">
  <div className="flex-1">
  <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={disbursementData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <defs>
                      <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6b7280" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#6b7280" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="period"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 9, fill: "#6b7280" }}
                      interval={4}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 9, fill: "#6b7280" }}
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <RechartsTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-white p-2 border rounded-lg shadow-lg">
                              <p className="font-medium text-xs">{label}</p>
                              <div className="space-y-1 mt-1">
                                <div className="flex justify-between gap-2">
                                  <span className="text-xs text-muted-foreground">Amount:</span>
                                  <span className="text-xs font-medium">
                                    {formatCurrency(data.actual || data.projected)}
                                  </span>
                                </div>
                                <div className="flex justify-between gap-2">
                                  <span className="text-xs text-muted-foreground">Status:</span>
                                  <span className="text-xs font-medium">
                                    {data.actual > 0 ? "Completed" : "Projected"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />

                    {/* Actual disbursements */}
                    <Area
                      type="monotone"
                      dataKey="actual"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#actualGradient)"
                      dot={false}
                      activeDot={{ r: 2, fill: "#3b82f6", strokeWidth: 1 }}
                    />

                    {/* Projected disbursements */}
                    <Area
                      type="monotone"
                      dataKey="projected"
                      stroke="#6b7280"
                      strokeWidth={1}
                      strokeDasharray="3 3"
                      fill="url(#projectedGradient)"
                      dot={false}
                      activeDot={{ r: 2, fill: "#6b7280" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Benefits Pool Distribution by Department - 50% width */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Benefits Pool Distribution by Department</CardTitle>
              <CardDescription>Allocation and utilization across sports departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentBudgets.map((dept, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{dept.name}</h3>
                        <span className="text-xs text-muted-foreground">{dept.athletes} athletes</span>
                      </div>
                      <span className="text-sm font-semibold">{formatCurrency(dept.allocated)} allocated</span>
                    </div>
                    <div className="relative">
                      <div className="flex h-6 rounded overflow-hidden bg-gray-200">
                        <div
                          className="bg-gray-800 flex items-center justify-start px-2"
                          style={{ width: `${dept.percentage}%` }}
                        >
                          <span className="text-white text-xs font-medium">
                            {formatCurrency(dept.spent)} spent ({dept.percentage}%)
                          </span>
                        </div>
                        <div
                          className="bg-gray-200 flex items-center justify-end px-2"
                          style={{ width: `${100 - dept.percentage}%` }}
                        >
                          <span className="text-gray-600 text-xs">
                            {formatCurrency(dept.allocated - dept.spent)} remaining
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription className="text-xs">Latest platform events and transactions</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/transactions">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityFeed.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.bgColor}`}>
                    <activity.icon className={`w-4 h-4 ${activity.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">{activity.title}</h4>
                      <div className="flex items-center gap-2">
                        {activity.amount && <span className="text-sm font-medium">{activity.amount}</span>}
                        <Badge
                          variant={
                            activity.status === "completed" ||
                            activity.status === "approved" ||
                            activity.status === "resolved"
                              ? "default"
                              : activity.status === "flagged"
                                ? "destructive"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {activity.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                      <span className="text-xs text-muted-foreground">By: {activity.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription className="text-xs">Operator control panel for common CFO workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Create New */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Create New</h3>
              <div className="grid gap-3 md:grid-cols-3">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all duration-200 group bg-transparent"
                  asChild
                >
                  <Link href="/contracts/new">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-1 group-hover:bg-blue-200 transition-colors">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">New Contract</span>
                    <span className="text-xs text-muted-foreground">Avg time to complete: 3 min</span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-green-50 hover:border-green-300 hover:shadow-md transition-all duration-200 group bg-transparent"
                  asChild
                >
                  <Link href="/disbursements/new">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mb-1 group-hover:bg-green-200 transition-colors">
                      <Banknote className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium">New Disbursement</span>
                    <span className="text-xs text-muted-foreground">Schedule payment</span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-purple-50 hover:border-purple-300 hover:shadow-md transition-all duration-200 group bg-transparent"
                  asChild
                >
                  <Link href="/compliance/reports/new">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mb-1 group-hover:bg-purple-200 transition-colors">
                      <Shield className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium">New Compliance Report</span>
                    <span className="text-xs text-muted-foreground">Generate audit</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* View or Manage */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                View or Manage
              </h3>
              <div className="grid gap-3 md:grid-cols-3">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md transition-all duration-200 group bg-transparent"
                  asChild
                >
                  <Link href="/contracts">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mb-1 group-hover:bg-slate-200 transition-colors">
                      <FileText className="w-4 h-4 text-slate-600" />
                    </div>
                    <span className="text-sm font-medium">View All Contracts</span>
                    <span className="text-xs text-muted-foreground">43 active contracts</span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-amber-50 hover:border-amber-300 hover:shadow-md transition-all duration-200 group bg-transparent"
                  asChild
                >
                  <Link href="/disbursements?status=pending">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mb-1 group-hover:bg-amber-200 transition-colors">
                      <Clock className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="text-sm font-medium">Disbursement Queue</span>
                    <span className="text-xs text-muted-foreground">8 scheduled / 2 flagged</span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-red-50 hover:border-red-300 hover:shadow-md transition-all duration-200 group bg-transparent"
                  asChild
                >
                  <Link href="/compliance?status=exception">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mb-1 group-hover:bg-red-200 transition-colors">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-sm font-medium">Compliance Exceptions</span>
                    <span className="text-xs text-muted-foreground">5 active reviews</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Export or Share */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                Export or Share
              </h3>
              <div className="grid gap-3 md:grid-cols-3">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-indigo-50 hover:border-indigo-300 hover:shadow-md transition-all duration-200 group bg-transparent"
                  onClick={() => {
                    /* Export logic */
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mb-1 group-hover:bg-indigo-200 transition-colors">
                    <ArrowUpRight className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-sm font-medium">Export Contracts CSV</span>
                  <span className="text-xs text-muted-foreground">Last exported: June 22</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-md transition-all duration-200 group bg-transparent"
                  onClick={() => {
                    /* Export logic */
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mb-1 group-hover:bg-emerald-200 transition-colors">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium">Export Financial Report</span>
                  <span className="text-xs text-muted-foreground">Last generated: July 1</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-violet-50 hover:border-violet-300 hover:shadow-md transition-all duration-200 group bg-transparent"
                  onClick={() => {
                    /* Export logic */
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center mb-1 group-hover:bg-violet-200 transition-colors">
                    <Shield className="w-4 h-4 text-violet-600" />
                  </div>
                  <span className="text-sm font-medium">Download Audit Summary</span>
                  <span className="text-xs text-muted-foreground">Q2 2024 available</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
