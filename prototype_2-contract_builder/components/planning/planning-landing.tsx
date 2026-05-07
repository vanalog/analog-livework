"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TEAMS, getTeamTotals, formatCurrency, CAP_PERIODS, getNilSponsorshipRosterByTeam } from "@/lib/planning-data"
import { ArrowRight, Users, TrendingUp, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function PlanningLanding() {
  // Calculate overall totals across all teams
  const overallStats = TEAMS.reduce(
    (acc, team) => {
      const totals = getTeamTotals(team.id)
      const nilRoster = getNilSponsorshipRosterByTeam(team.id)
      const nilTotal = nilRoster.reduce((sum, r) => sum + r.indicatedAmount, 0)
      return {
        totalBudget: acc.totalBudget + totals.budget * 3, // 3 cap periods
        totalAllocated: acc.totalAllocated + totals.totalAllocated,
        athleteCount: acc.athleteCount + totals.athleteCount,
        totalIoi: acc.totalIoi + nilTotal,
      }
    },
    { totalBudget: 0, totalAllocated: 0, athleteCount: 0, totalIoi: 0 }
  )

  const overallRemaining = overallStats.totalBudget - overallStats.totalAllocated
  const overallPercentage = (overallStats.totalAllocated / overallStats.totalBudget) * 100

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cap Planning</h1>
          <p className="text-muted-foreground mt-1">
            Manage team budgets and athlete allocations across cap periods
          </p>
        </div>

        {/* Overall Budget Summary */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Overall Budget Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Total Budget</p>
                <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(overallStats.totalBudget)}</p>
                <p className="text-xs text-muted-foreground">Across 3 cap periods</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Allocated</p>
                <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(overallStats.totalAllocated)}</p>
                <p className="text-xs text-muted-foreground">{overallPercentage.toFixed(1)}% of budget</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Remaining</p>
                <p className={cn(
                  "text-2xl font-bold mt-1",
                  overallRemaining >= 0 ? "text-emerald-600" : "text-red-600"
                )}>
                  {formatCurrency(Math.abs(overallRemaining))}
                </p>
                <p className="text-xs text-muted-foreground">Available to allocate</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Indicated NIL</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{formatCurrency(overallStats.totalIoi)}</p>
                <p className="text-xs text-muted-foreground">Sponsorship pipeline</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Athletes</p>
                <p className="text-2xl font-bold text-foreground mt-1">{overallStats.athleteCount}</p>
                <p className="text-xs text-muted-foreground">Across all teams</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cap Periods Reference */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <span className="font-medium">Cap Periods:</span>
          {CAP_PERIODS.map((cp, i) => (
            <span key={cp.id} className="flex items-center gap-2">
              <span className="font-medium text-foreground">{cp.label}</span>
              {i < CAP_PERIODS.length - 1 && <span className="text-border">|</span>}
            </span>
          ))}
        </div>

        {/* Team Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {TEAMS.map((team) => {
            const totals = getTeamTotals(team.id)
            const nilRoster = getNilSponsorshipRosterByTeam(team.id)
            const nilTotal = nilRoster.reduce((sum, r) => sum + r.indicatedAmount, 0)
            const percentage = (totals.totalAllocated / totals.totalBudget) * 100
            const isOverBudget = percentage > 100
            const isNearBudget = percentage >= 80 && percentage <= 100
            
            return (
              <Card key={team.id} className="border-border hover:border-foreground/20 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">{team.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{totals.athleteCount} athletes</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Budget Stats */}
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Budget</p>
                      <p className="text-lg font-semibold text-foreground">{formatCurrency(totals.totalBudget)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Allocated</p>
                      <p className="text-lg font-semibold text-foreground">{formatCurrency(totals.totalAllocated)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Remaining</p>
                      <p className={cn(
                        "text-lg font-semibold",
                        isOverBudget ? "text-red-600" : "text-emerald-600"
                      )}>
                        {formatCurrency(Math.abs(totals.remaining))}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Indicated NIL</p>
                      <p className="text-lg font-semibold text-amber-600">{formatCurrency(nilTotal)}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Budget utilization</span>
                      <span className={cn(
                        "font-medium",
                        isOverBudget ? "text-red-600" : isNearBudget ? "text-amber-600" : "text-muted-foreground"
                      )}>
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full transition-all",
                          isOverBudget ? "bg-red-500" : isNearBudget ? "bg-amber-500" : "bg-emerald-500"
                        )}
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      />
                    </div>
                    {isOverBudget && (
                      <div className="flex items-center gap-1.5 text-xs text-red-600">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Over budget by {formatCurrency(Math.abs(totals.remaining))}</span>
                      </div>
                    )}
                  </div>

                  {/* Per-Period Breakdown */}
                  <div className="grid grid-cols-3 gap-3 pt-2 border-t">
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">{CAP_PERIODS[0].label}</p>
                      <p className="text-sm font-medium text-foreground">{formatCurrency(totals.capPeriod1)}</p>
                      <p className="text-[10px] text-muted-foreground">of {formatCurrency(totals.budget)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">{CAP_PERIODS[1].label}</p>
                      <p className="text-sm font-medium text-foreground">{formatCurrency(totals.capPeriod2)}</p>
                      <p className="text-[10px] text-muted-foreground">of {formatCurrency(totals.budget)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">{CAP_PERIODS[2].label}</p>
                      <p className="text-sm font-medium text-foreground">{formatCurrency(totals.capPeriod3)}</p>
                      <p className="text-[10px] text-muted-foreground">of {formatCurrency(totals.budget)}</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button asChild variant="outline" className="w-full mt-2">
                    <Link href={`/planning/${team.id}`}>
                      <span>Manage Roster</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
