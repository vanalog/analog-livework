"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BudgetTotals {
  totalBudget: number;
  totalCommitted: number;
  agreementCount: number;
}

interface SponsorBudgetCardProps {
  budgetTotals: BudgetTotals;
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function SponsorBudgetCard({ budgetTotals }: SponsorBudgetCardProps) {
  const hasBudget = budgetTotals.totalBudget > 0;
  const remaining = budgetTotals.totalBudget - budgetTotals.totalCommitted;
  const progress = hasBudget ? (budgetTotals.totalCommitted / budgetTotals.totalBudget) * 100 : 0;
  const cappedProgress = Math.min(100, progress);
  
  const progressColor =
    cappedProgress >= 90
      ? "bg-red-500"
      : cappedProgress >= 75
      ? "bg-amber-500"
      : "bg-emerald-500";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Main budget display */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-2xl font-bold">
                {hasBudget ? formatCurrency(budgetTotals.totalBudget) : "Not set"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Committed</p>
              <p className="text-2xl font-bold tabular-nums">
                {formatCurrency(budgetTotals.totalCommitted)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p
                className={`text-2xl font-bold tabular-nums ${
                  hasBudget
                    ? remaining > 0
                      ? "text-emerald-600"
                      : "text-red-600"
                    : ""
                }`}
              >
                {hasBudget ? formatCurrency(remaining) : "No limit"}
              </p>
            </div>
          </div>

          {/* Progress bar - only show if budget is set */}
          {hasBudget && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Budget utilization</span>
                <span className="tabular-nums font-medium">{Math.round(cappedProgress)}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full ${progressColor} transition-all`}
                  style={{ width: `${cappedProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-6 border-t pt-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total Agreements: </span>
              <span className="font-medium">{budgetTotals.agreementCount}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
