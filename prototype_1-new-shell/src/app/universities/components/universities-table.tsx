"use client";

import { useMemo, useState } from "react";
import { useUniversitiesWithStats, useSports } from "@/lib/hooks/use-data";
import type { UniversityWithStats } from "@/lib/data";
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
import { Search, ChevronRight, GraduationCap } from "lucide-react";
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
        </div>
      ))}
    </div>
  );
}

export function UniversitiesTable() {
  const { data: universities, isLoading, error } = useUniversitiesWithStats();
  const { data: sports } = useSports();
  const [search, setSearch] = useState("");
  const [conferenceFilters, setConferenceFilters] = useState<string[]>([]);
  const [sportFilters, setSportFilters] = useState<string[]>([]);
  const [agentFilters, setAgentFilters] = useState<string[]>([]);

  // Build a key -> label map for sports. Prefer the DB-managed list from
  // /settings/taxonomy, and fall back to the static SPORT_LABELS constant
  // so athletes with legacy keys still render a human label.
  const sportLabelMap = useMemo(() => {
    const map: Record<string, string> = { ...SPORT_LABELS };
    for (const s of sports ?? []) map[s.key] = s.label;
    return map;
  }, [sports]);

  function formatSport(key: string): string {
    return sportLabelMap[key] ?? key;
  }

  // Get unique conferences present on universities for the filter options.
  const conferenceOptions = useMemo(() => {
    if (!universities) return [];
    const uniqueConferences = [
      ...new Set(universities.map((u) => u.conference).filter(Boolean)),
    ];
    return uniqueConferences
      .sort()
      .map((c) => ({ value: c as string, label: c as string }));
  }, [universities]);

  // Get unique agents present across all universities for the filter options.
  // Agents are derived from the athletes assigned to each university, so a
  // university can contribute multiple agents.
  const agentOptions = useMemo(() => {
    if (!universities) return [];
    const byId = new Map<string, string>();
    for (const u of universities) {
      for (const a of u.agents) byId.set(a.id, a.name);
    }
    return [...byId.entries()]
      .map(([id, name]) => ({ value: id, label: name }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [universities]);

  // Get unique sports present across all universities for the filter options.
  const sportOptions = useMemo(() => {
    if (!universities) return [];
    const uniqueSports = new Set<string>();
    for (const u of universities) {
      for (const sport of u.sports) uniqueSports.add(sport);
    }
    return [...uniqueSports]
      .map((key) => ({ value: key, label: formatSport(key) }))
      .sort((a, b) => a.label.localeCompare(b.label));
    // formatSport depends on sportLabelMap, but re-running when universities
    // change is enough since labels are only ever additive.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [universities, sportLabelMap]);

  const filteredUniversities = useMemo(() => {
    if (!universities) return [];

    let filtered = universities;

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((u) =>
        u.name.toLowerCase().includes(searchLower)
      );
    }

    // Conference filters (multi-select, OR across selections)
    if (conferenceFilters.length > 0) {
      filtered = filtered.filter(
        (u) => u.conference && conferenceFilters.includes(u.conference)
      );
    }

    // Sport filters (multi-select, OR across selections). A university
    // matches if it has at least one athlete in any of the selected sports.
    if (sportFilters.length > 0) {
      filtered = filtered.filter((u) =>
        u.sports.some((s) => sportFilters.includes(s))
      );
    }

    // Agent filters (multi-select, OR across selections). A university
    // matches if any of its athletes are represented by any selected agent.
    if (agentFilters.length > 0) {
      filtered = filtered.filter((u) =>
        u.agents.some((a) => agentFilters.includes(a.id))
      );
    }

    // Sort by athlete count descending
    return [...filtered].sort((a, b) => b.athleteCount - a.athleteCount);
  }, [universities, search, conferenceFilters, sportFilters, agentFilters]);

  if (error) {
    return (
      <Card>
        <CardContent className="py-10">
          <p className="text-center text-destructive">
            Failed to load universities. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate totals for header
  const totalAthletes = filteredUniversities.reduce((sum, u) => sum + u.athleteCount, 0);
  const totalAgreements = filteredUniversities.reduce((sum, u) => sum + u.agreementCount, 0);
  const totalValue = filteredUniversities.reduce((sum, u) => sum + u.totalAgreementValue, 0);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-5 w-5 text-muted-foreground" />
          <span className="font-semibold text-lg">Universities</span>
          <span className="text-muted-foreground">Athletes:</span>
          <span className="font-semibold">{totalAthletes}</span>
          <span className="text-muted-foreground">Agreements:</span>
          <span className="font-semibold">{totalAgreements}</span>
          <span className="text-muted-foreground">Total Value:</span>
          <span className="font-semibold">{formatCurrency(totalValue)}</span>
          <Badge variant="outline">{filteredUniversities.length} universit{filteredUniversities.length !== 1 ? "ies" : "y"}</Badge>
        </div>
        <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search universities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <MultiSelect
              label="All Conferences"
              options={conferenceOptions}
              values={conferenceFilters}
              onChange={setConferenceFilters}
              searchable
              searchPlaceholder="Search conferences..."
              className="w-[200px]"
            />
            <MultiSelect
              label="All Sports"
              options={sportOptions}
              values={sportFilters}
              onChange={setSportFilters}
              searchable
              searchPlaceholder="Search sports..."
              className="w-[200px]"
            />
            <MultiSelect
              label="All Agents"
              options={agentOptions}
              values={agentFilters}
              onChange={setAgentFilters}
              searchable
              searchPlaceholder="Search agents..."
              className="w-[200px]"
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
                  <TableHead className="w-[250px] text-muted-foreground font-normal">University</TableHead>
                  <TableHead className="text-muted-foreground font-normal">Conference</TableHead>
                  <TableHead className="text-center text-muted-foreground font-normal">Athletes</TableHead>
                  <TableHead className="text-muted-foreground font-normal">Sports</TableHead>
                  <TableHead className="text-muted-foreground font-normal">Agents</TableHead>
                  <TableHead className="text-center text-muted-foreground font-normal">Agreements</TableHead>
                  <TableHead className="text-right text-muted-foreground font-normal">Total Value</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
                <TableBody>
                  {filteredUniversities.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="py-10 text-center text-muted-foreground"
                      >
                        No universities found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUniversities.map((university: UniversityWithStats) => (
                      <TableRow key={university.id}>
                        <TableCell>
                          <Link
                            href={`/universities/${university.id}`}
                            className="font-medium hover:underline"
                          >
                            {university.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {university.conference ? (
                            <Badge variant="outline">{university.conference}</Badge>
                          ) : (
                            <span className="text-muted-foreground">--</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{university.athleteCount}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {university.sports.slice(0, 3).map((sport) => (
                              <Badge key={sport} variant="outline" className="text-xs">
                                {formatSport(sport)}
                              </Badge>
                            ))}
                            {university.sports.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{university.sports.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {university.agents.length === 0 ? (
                            <span className="text-muted-foreground">--</span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {university.agents.slice(0, 2).map((agent) => (
                                <Badge
                                  key={agent.id}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {agent.name}
                                </Badge>
                              ))}
                              {university.agents.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{university.agents.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{university.agreementCount}</Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums font-medium">
                          {university.totalAgreementValue > 0 ? (
                            formatCurrency(university.totalAgreementValue)
                          ) : (
                            <span className="text-muted-foreground">--</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Link href={`/universities/${university.id}`}>
                            <Button variant="ghost" size="icon">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
              </TableBody>
            </Table>

          </>
        )}
      </CardContent>
    </Card>
  );
}
