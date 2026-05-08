"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSponsorsWithBudgets } from "@/lib/hooks/use-data";
import { Building2, DollarSign, TrendingDown, Wallet } from "lucide-react";

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function SummarySkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-20 mb-1" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function SponsorsSummary() {
  const { data: sponsors, isLoading } = useSponsorsWithBudgets();

  const summary = useMemo(() => {
    if (!sponsors) {
      return {
        totalSponsors: 0,
        totalBudget: 0,
        totalCommitted: 0,
        totalRemaining: 0,
        sponsorsWithBudget: 0,
        sponsorsWithRemaining: 0,
      };
    }

    const totalSponsors = sponsors.length;

    // Only count sponsors that have a budget set
    const sponsorsWithBudget = sponsors.filter((s) => s.totalBudget > 0);
    const totalBudget = sponsorsWithBudget.reduce(
      (sum, s) => sum + s.totalBudget,
      0
    );

    // Total committed across ALL sponsors
    const totalCommitted = sponsors.reduce(
      (sum, s) => sum + s.totalCommitted,
      0
    );

    // Remaining only counts for sponsors with budgets
    const totalRemaining = sponsorsWithBudget.reduce((sum, s) => {
      const remaining = s.totalBudget - s.totalCommitted;
      return sum + Math.max(0, remaining);
    }, 0);

    // How many sponsors still have remaining budget
    const sponsorsWithRemaining = sponsorsWithBudget.filter(
      (s) => s.totalBudget - s.totalCommitted > 0
    ).length;

    return {
      totalSponsors,
      totalBudget,
      totalCommitted,
      totalRemaining,
      sponsorsWithBudget: sponsorsWithBudget.length,
      sponsorsWithRemaining,
    };
  }, [sponsors]);

  if (isLoading) {
    return <SummarySkeleton />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sponsors</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalSponsors}</div>
          <p className="text-xs text-muted-foreground">
            {summary.sponsorsWithBudget} with budgets
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.totalBudget)}
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.sponsorsWithBudget} sponsors with budgets
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Committed</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.totalCommitted)}
          </div>
          <p className="text-xs text-muted-foreground">Across all agreements</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Budget Remaining</CardTitle>
          <TrendingDown className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">
            {formatCurrency(summary.totalRemaining)}
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.sponsorsWithRemaining} sponsors with availability
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
