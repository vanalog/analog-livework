"use client";

import { useMemo, useState } from "react";
import { useAthletesWithBudgets, useUniversities, useAgents } from "@/lib/hooks/use-data";
import { ComboboxInput } from "@/components/core/form/combobox-input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Users } from "lucide-react";
import { BudgetProgressBar } from "./budget-progress-bar";
import { SPORT_LABELS } from "@/lib/constants";
import Link from "next/link";

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatSport(sport: string): string {
  if (!sport) return "";
  // Normalize: lowercase + convert spaces to underscores so DB values like
  // "womens basketball", "Womens_Basketball", or "WOMENS BASKETBALL" all
  // resolve to the same canonical key in SPORT_LABELS.
  const key = sport.toLowerCase().replace(/\s+/g, "_");
  const label = (SPORT_LABELS as Record<string, string>)[key];
  if (label) return label;
  // Fallback: Title Case the raw value so we never render lowercase.
  return sport
    .replace(/_/g, " ")
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ");
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
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      ))}
    </div>
  );
}

export function RosterTable() {
  const { data: roster, isLoading, error } = useAthletesWithBudgets();
  const { data: universities = [] } = useUniversities();
  const { data: agents = [] } = useAgents();
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState<string>("all");
  const [universityFilter, setUniversityFilter] = useState<string>("all");
  const [agentFilter, setAgentFilter] = useState<string>("all");

  // Create lookup maps for university and agent names
  const universityMap = useMemo(() => {
    return new Map(universities.map((u) => [u.id, u.name]));
  }, [universities]);

  const agentMap = useMemo(() => {
    return new Map(agents.map((a) => [a.id, a.name]));
  }, [agents]);

  const filteredRoster = useMemo(() => {
    if (!roster) return [];

    let filtered = roster;

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          (a.first_name || "").toLowerCase().includes(searchLower) ||
          (a.last_name || "").toLowerCase().includes(searchLower)
      );
    }

    // Sport filter
    if (sportFilter !== "all") {
      filtered = filtered.filter((a) => a.sport === sportFilter);
    }

    // University filter
    if (universityFilter !== "all") {
      filtered = filtered.filter((a) => a.university_id === universityFilter);
    }

    // Agent filter
    if (agentFilter !== "all") {
      filtered = filtered.filter((a) => a.agent_id === agentFilter);
    }

    // Sort by total value descending
    return [...filtered].sort(
      (a, b) =>
        b.budget.revShare + b.budget.sponsorships -
        (a.budget.revShare + a.budget.sponsorships)
    );
  }, [roster, search, sportFilter, universityFilter, agentFilter]);

  // Get unique sports for filter
  const sports = useMemo(() => {
    if (!roster) return [];
    const uniqueSports = [...new Set(roster.map((a) => a.sport))].filter(Boolean);
    return uniqueSports.sort();
  }, [roster]);

  if (error) {
    return (
      <Card>
        <CardContent className="py-10">
          <p className="text-center text-destructive">
            Failed to load roster. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate totals for header
  const totalValue = filteredRoster.reduce((sum, a) => sum + a.budget.revShare + a.budget.sponsorships, 0);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span className="font-semibold text-lg">Athletes</span>
          <span className="text-muted-foreground">Total Value:</span>
          <span className="font-semibold">{formatCurrency(totalValue)}</span>
          <Badge variant="outline">{filteredRoster.length} athlete{filteredRoster.length !== 1 ? "s" : ""}</Badge>
        </div>
        <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search athletes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={sportFilter} onValueChange={setSportFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Sports" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              {sports.map((sport) => (
                <SelectItem key={sport} value={sport}>
                  {formatSport(sport)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={universityFilter} onValueChange={setUniversityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Universities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Universities</SelectItem>
              {universities.map((uni) => (
                <SelectItem key={uni.id} value={uni.id}>
                  {uni.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ComboboxInput
            items={[
              { value: "all", label: "All Agents" },
              ...agents.map((a) => ({ value: a.id, label: a.name })),
            ]}
            placeholder="All Agents"
            value={agentFilter}
            onChange={setAgentFilter}
          />
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
                  <TableHead className="w-[200px] text-muted-foreground font-normal">Athlete</TableHead>
                  <TableHead className="text-muted-foreground font-normal">University</TableHead>
                  <TableHead className="text-muted-foreground font-normal">Agent</TableHead>
                  <TableHead className="text-right text-muted-foreground font-normal">Rev Share</TableHead>
                  <TableHead className="text-right text-muted-foreground font-normal">Sponsorships</TableHead>
                  <TableHead className="text-center text-muted-foreground font-normal">Sponsors</TableHead>
                  <TableHead className="w-[200px] text-muted-foreground font-normal">NIL Target</TableHead>
                  <TableHead className="text-right text-muted-foreground font-normal">Total</TableHead>
                </TableRow>
              </TableHeader>
                <TableBody>
                  {filteredRoster.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="py-10 text-center text-muted-foreground"
                      >
                        No athletes found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRoster.map((athlete) => {
                      const total =
                        athlete.budget.revShare + athlete.budget.sponsorships;
                      const progress =
                        athlete.budget.totalBudget > 0
                          ? (athlete.budget.spent / athlete.budget.totalBudget) *
                            100
                          : 0;

                      return (
                        <TableRow key={athlete.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/athletes/${athlete.id}`}
                                  className="hover:underline"
                                >
                                  {athlete.first_name} {athlete.last_name}
                                </Link>
                                {athlete.status !== "active" && (
                                  <Badge
                                    variant="secondary"
                                    className="capitalize"
                                  >
                                    {athlete.status}
                                  </Badge>
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {formatSport(athlete.sport)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {athlete.university_id ? universityMap.get(athlete.university_id) || "—" : "—"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {athlete.agent_id ? agentMap.get(athlete.agent_id) || "—" : "—"}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatCurrency(athlete.budget.revShare)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatCurrency(athlete.budget.sponsorships)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline">
                              {athlete.budget.sponsorCount}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {athlete.budget.totalBudget > 0 ? (
                              <BudgetProgressBar
                                progress={progress}
                                totalSponsorships={athlete.budget.spent}
                                ioi={athlete.budget.totalBudget}
                              />
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right tabular-nums font-semibold">
                            {formatCurrency(total)}
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
