"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgreementsWithRelations } from "@/lib/hooks/use-data";
import { FileText, DollarSign, TrendingUp, Users } from "lucide-react";

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

export function AgreementsSummary() {
  const { data: agreements, isLoading } = useAgreementsWithRelations();

  const summary = useMemo(() => {
    if (!agreements) {
      return {
        totalAgreements: 0,
        activeCount: 0,
        draftCount: 0,
        activeValue: 0,
        draftValue: 0,
        ioiCount: 0,
        ioiValue: 0,
        uniqueAthletes: 0,
      };
    }

    const totalAgreements = agreements.length;
    const activeAgreements = agreements.filter((a) => a.status === "active");
    const draftAgreements = agreements.filter((a) => a.status === "draft");

    const activeValue = activeAgreements.reduce(
      (sum, a) => sum + a.amount_cents,
      0
    );
    const draftValue = draftAgreements.reduce(
      (sum, a) => sum + a.amount_cents,
      0
    );

    // Count IOI agreements
    const ioiAgreements = agreements.filter((a) => a.applies_to_ioi);
    const ioiValue = ioiAgreements
      .filter((a) => a.status === "active")
      .reduce((sum, a) => sum + a.amount_cents, 0);

    // Count unique athletes with agreements
    const uniqueAthletes = new Set(agreements.map((a) => a.athlete_id)).size;

    return {
      totalAgreements,
      activeCount: activeAgreements.length,
      draftCount: draftAgreements.length,
      activeValue,
      draftValue,
      ioiCount: ioiAgreements.length,
      ioiValue,
      uniqueAthletes,
    };
  }, [agreements]);

  if (isLoading) {
    return <SummarySkeleton />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Agreements</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalAgreements}</div>
          <p className="text-xs text-muted-foreground">
            {summary.activeCount} active, {summary.draftCount} draft
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.activeValue)}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(summary.draftValue)} in draft
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">IOI Applicable</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.ioiValue)}
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.ioiCount} agreements apply to IOI
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Athletes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.uniqueAthletes}</div>
          <p className="text-xs text-muted-foreground">
            Athletes with agreements
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
