"use client";

import { useMemo, useState } from "react";
import { useSponsorsWithBudgets } from "@/lib/hooks/use-data";
import type { SponsorWithBudgetTotals } from "@/lib/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/core/form/multi-select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, ChevronRight, Building2 } from "lucide-react";
import Link from "next/link";


function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function BudgetProgressBar({
  progress,
  committed,
  budget,
}: {
  progress: number;
  committed: number;
  budget: number;
}) {
  if (budget === 0) {
    return <span className="text-sm text-muted-foreground">No budget</span>;
  }

  const cappedProgress = Math.min(100, progress);
  const isOverBudget = progress > 100;
  const progressColor = isOverBudget
    ? "bg-emerald-500"
    : cappedProgress >= 90
    ? "bg-amber-500"
    : cappedProgress >= 75
    ? "bg-amber-400"
    : "bg-emerald-500";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full ${progressColor} transition-all`}
                style={{ width: `${cappedProgress}%` }}
              />
            </div>
            <span
              className={`text-sm tabular-nums ${
                isOverBudget ? "text-emerald-600 font-medium" : "text-muted-foreground"
              }`}
            >
              {Math.round(progress)}%
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p>
              <span className="text-muted-foreground">Committed: </span>
              <span className="tabular-nums font-medium">
                {formatCurrency(committed)}
              </span>
            </p>
            <p>
              <span className="text-muted-foreground">Budget: </span>
              <span className="tabular-nums font-medium">
                {formatCurrency(budget)}
              </span>
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-16" />
        </div>
      ))}
    </div>
  );
}

export function SponsorsTable() {
  const { data: sponsors, isLoading, error } = useSponsorsWithBudgets();
  const [search, setSearch] = useState("");
  const [budgetFilters, setBudgetFilters] = useState<string[]>([]);

  const filteredSponsors = useMemo(() => {
    if (!sponsors) return [];

    let filtered = sponsors;

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(searchLower)
      );
    }

    // Budget filters (multi-select: match ANY selected)
    if (budgetFilters.length > 0) {
      filtered = filtered.filter((s) =>
        budgetFilters.some((f) => {
          if (f === "with-budget") return s.totalBudget > 0;
          if (f === "no-budget") return s.totalBudget === 0;
          if (f === "has-remaining")
            return s.totalBudget > 0 && s.totalBudget - s.totalCommitted > 0;
          return false;
        })
      );
    }

    // Sort by committed descending
    return [...filtered].sort((a, b) => b.totalCommitted - a.totalCommitted);
  }, [sponsors, search, budgetFilters]);

  if (error) {
    return (
      <Card>
        <CardContent className="py-10">
          <p className="text-center text-destructive">
            Failed to load sponsors. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate totals for header
  const totalCommitted = filteredSponsors.reduce((sum, s) => sum + s.totalCommitted, 0);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          <span className="font-semibold text-lg">Sponsors</span>
          <span className="text-muted-foreground">Total Committed:</span>
          <span className="font-semibold">{formatCurrency(totalCommitted)}</span>
          <Badge variant="outline">{filteredSponsors.length} sponsor{filteredSponsors.length !== 1 ? "s" : ""}</Badge>
        </div>
        <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search sponsors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <MultiSelect
              label="All Budgets"
              options={[
                { value: "with-budget", label: "Has Budget" },
                { value: "no-budget", label: "No Budget" },
                { value: "has-remaining", label: "Has Remaining" },
              ]}
              values={budgetFilters}
              onChange={setBudgetFilters}
              className="w-[180px]"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[200px] text-muted-foreground font-normal">Sponsor</TableHead>
                  <TableHead className="text-muted-foreground font-normal">Industry</TableHead>
                  <TableHead className="text-right text-muted-foreground font-normal">Budget</TableHead>
                  <TableHead className="text-right text-muted-foreground font-normal">Committed</TableHead>
                  <TableHead className="text-right text-muted-foreground font-normal">Remaining</TableHead>
                  <TableHead className="w-[180px] text-muted-foreground font-normal">Progress</TableHead>
                  {/* Campaigns column hidden - feature disabled for now */}
                  <TableHead className="text-center text-muted-foreground font-normal">Agreements</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
                <TableBody>
                  {filteredSponsors.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="py-10 text-center text-muted-foreground"
                      >
                        No sponsors found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSponsors.map((sponsor) => {
                      const remaining = sponsor.totalBudget - sponsor.totalCommitted;
                      const progress =
                        sponsor.totalBudget > 0
                          ? (sponsor.totalCommitted / sponsor.totalBudget) * 100
                          : 0;

                      return (
                        <TableRow key={sponsor.id}>
                          <TableCell>
                            <Link
                              href={`/sponsors/${sponsor.id}`}
                              className="font-medium hover:underline"
                            >
                              {sponsor.name}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <span className="text-muted-foreground capitalize">
                              {sponsor.industry?.replace("_", " ") || "-"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {sponsor.totalBudget > 0 ? (
                              formatCurrency(sponsor.totalBudget)
                            ) : (
                              <span className="text-muted-foreground">--</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right tabular-nums font-medium">
                            {formatCurrency(sponsor.totalCommitted)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {sponsor.totalBudget > 0 ? (
                              remaining < 0 ? (
                                <span className="text-emerald-600">
                                  {formatCurrency(Math.abs(remaining))} over
                                </span>
                              ) : (
                                <span className="text-emerald-600">
                                  {formatCurrency(remaining)}
                                </span>
                              )
                            ) : (
                              <span className="text-muted-foreground">--</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <BudgetProgressBar
                              progress={progress}
                              committed={sponsor.totalCommitted}
                              budget={sponsor.totalBudget}
                            />
                          </TableCell>
                          {/* Campaigns column hidden - feature disabled for now */}
                          <TableCell className="text-center">
                            <Badge variant="outline">
                              {sponsor.agreementCount}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Link href={`/sponsors/${sponsor.id}`}>
                              <Button variant="ghost" size="icon">
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
              </TableBody>
            </Table>

          </>
        )}
      </CardContent>
    </Card>
  );
}
