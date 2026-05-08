"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAthletesWithBudgets } from "@/lib/hooks/use-data";
import { DollarSign, Users, TrendingUp, Award } from "lucide-react";

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

export function RosterSummary() {
  const { data: roster, isLoading } = useAthletesWithBudgets();

  const summary = useMemo(() => {
    if (!roster) {
      return {
        totalAthletes: 0,
        activeAthletes: 0,
        totalRevShare: 0,
        totalSponsorships: 0,
        totalValue: 0,
        athletesWithDeals: 0,
      };
    }

    const totalAthletes = roster.length;
    const activeAthletes = roster.filter((a) => a.status === "active").length;

    const totalRevShare = roster.reduce(
      (sum, a) => sum + a.budget.revShare,
      0
    );
    const totalSponsorships = roster.reduce(
      (sum, a) => sum + a.budget.sponsorships,
      0
    );
    const totalValue = totalRevShare + totalSponsorships;

    const athletesWithDeals = roster.filter(
      (a) => a.budget.revShare > 0 || a.budget.sponsorships > 0
    ).length;

    return {
      totalAthletes,
      activeAthletes,
      totalRevShare,
      totalSponsorships,
      totalValue,
      athletesWithDeals,
    };
  }, [roster]);

  if (isLoading) {
    return <SummarySkeleton />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Athletes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalAthletes}</div>
          <p className="text-xs text-muted-foreground">
            {summary.activeAthletes} active
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.totalValue)}
          </div>
          <p className="text-xs text-muted-foreground">
            Across all agreements
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue Share</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.totalRevShare)}
          </div>
          <p className="text-xs text-muted-foreground">
            From rev share deals
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">With Deals</CardTitle>
          <Award className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">
            {summary.athletesWithDeals}
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.totalAthletes > 0
              ? Math.round(
                  (summary.athletesWithDeals / summary.totalAthletes) * 100
                )
              : 0}
            % of roster
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
