"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Trophy, CheckCircle, Edit2, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface Obligation {
  id: string
  amount: number
  triggerType: "date" | "event" | "milestone"
  trigger: string
  beneficiary: string
  status: "pending" | "active" | "completed"
  confidence: number
  date?: string
}

const mockObligations: Obligation[] = [
  {
    id: "1",
    amount: 50000,
    triggerType: "date",
    trigger: "Contract Signing",
    beneficiary: "Vendor Corp",
    status: "completed",
    confidence: 98,
    date: "2025-01-15",
  },
  {
    id: "2",
    amount: 25000,
    triggerType: "milestone",
    trigger: "Phase 1 Completion",
    beneficiary: "Vendor Corp",
    status: "active",
    confidence: 95,
    date: "2025-03-01",
  },
  {
    id: "3",
    amount: 25000,
    triggerType: "milestone",
    trigger: "Phase 2 Completion",
    beneficiary: "Vendor Corp",
    status: "pending",
    confidence: 95,
    date: "2025-05-01",
  },
  {
    id: "4",
    amount: 15000,
    triggerType: "date",
    trigger: "Monthly Retainer",
    beneficiary: "Vendor Corp",
    status: "active",
    confidence: 99,
    date: "2025-02-01",
  },
]

const chartData = [
  { month: "Jan", amount: 50000 },
  { month: "Feb", amount: 65000 },
  { month: "Mar", amount: 90000 },
  { month: "Apr", amount: 90000 },
  { month: "May", amount: 115000 },
  { month: "Jun", amount: 115000 },
]

const triggerIcons = {
  date: Calendar,
  event: CheckCircle,
  milestone: Trophy,
}

export function PaymentPanel() {
  const [editingId, setEditingId] = useState<string | null>(null)

  const totalValue = mockObligations.reduce((sum, ob) => sum + ob.amount, 0)
  const paymentCount = mockObligations.length

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Obligation Schedule</CardTitle>

          {/* Hero Metrics */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-primary/5 p-4">
              <div className="text-sm text-muted-foreground">Total Value</div>
              <div className="mt-1 text-2xl font-bold text-foreground">${totalValue.toLocaleString()}</div>
            </div>
            <div className="rounded-lg bg-secondary/5 p-4">
              <div className="text-sm text-muted-foreground">Payments</div>
              <div className="mt-1 text-2xl font-bold text-foreground">{paymentCount}</div>
            </div>
            <div className="rounded-lg bg-success/5 p-4">
              <div className="text-sm text-muted-foreground">Timeline</div>
              <div className="mt-1 text-2xl font-bold text-foreground">6 months</div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Payment Timeline Chart */}
          <div className="mb-6 rounded-lg border border-border bg-muted/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h4 className="font-semibold text-card-foreground">Cumulative Payment Schedule</h4>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Obligations List */}
          <div className="space-y-3">
            <h4 className="font-semibold text-card-foreground">Payment Obligations</h4>
            {mockObligations.map((obligation, index) => {
              const TriggerIcon = triggerIcons[obligation.triggerType]

              return (
                <motion.div
                  key={obligation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge
                          variant={
                            obligation.triggerType === "date"
                              ? "default"
                              : obligation.triggerType === "milestone"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {obligation.triggerType === "date" && "Date-Based"}
                          {obligation.triggerType === "milestone" && "Milestone"}
                          {obligation.triggerType === "event" && "Event-Based"}
                        </Badge>
                        <Badge
                          variant={
                            obligation.status === "completed"
                              ? "default"
                              : obligation.status === "active"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {obligation.status}
                        </Badge>
                      </div>

                      <div className="mb-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-foreground">
                          ${obligation.amount.toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground">to {obligation.beneficiary}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TriggerIcon className="h-4 w-4" />
                        <span>{obligation.trigger}</span>
                        {obligation.date && (
                          <>
                            <span>•</span>
                            <span>{obligation.date}</span>
                          </>
                        )}
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1.5 flex-1 rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-success"
                            style={{ width: `${obligation.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{obligation.confidence}% confidence</span>
                      </div>
                    </div>

                    <Button size="sm" variant="ghost" onClick={() => setEditingId(obligation.id)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
