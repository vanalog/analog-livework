"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAgreementsWithRelations, useUniversities, useAgents } from "@/lib/hooks/use-data";
import { MultiSelect } from "@/components/core/form/multi-select";
import type { AgreementWithRelations } from "@/types/database";
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Check, FileText } from "lucide-react";
import {
  NilGoStatusBadge,
  NIL_GO_STATUS_OPTIONS,
} from "@/components/agreements/nil-go-status-badge";



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
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-20" />
        </div>
      ))}
    </div>
  );
}

export function AgreementsTable() {
  const router = useRouter();
  const { data: agreements, isLoading, error } = useAgreementsWithRelations();
  const { data: universities = [] } = useUniversities();
  const { data: agents = [] } = useAgents();
  const [search, setSearch] = useState("");
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [universityFilters, setUniversityFilters] = useState<string[]>([]);
  const [agentFilters, setAgentFilters] = useState<string[]>([]);
  const [nilGoFilters, setNilGoFilters] = useState<string[]>([]);

  // Create lookup maps for university and agent names
  const universityMap = useMemo(() => {
    return new Map(universities.map((u) => [u.id, u.name]));
  }, [universities]);

  const agentMap = useMemo(() => {
    return new Map(agents.map((a) => [a.id, a.name]));
  }, [agents]);

  const filteredAgreements = useMemo(() => {
    if (!agreements) return [];

    let filtered = agreements;

    // Search filter (athlete name or sponsor name)
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          `${a.athlete.first_name} ${a.athlete.last_name}`
            .toLowerCase()
            .includes(searchLower) ||
          (a.sponsor?.name || "").toLowerCase().includes(searchLower)
      );
    }

    // Type filters (multi-select)
    if (typeFilters.length > 0) {
      filtered = filtered.filter((a) => typeFilters.includes(a.type));
    }

    // University filters (from athlete, multi-select)
    if (universityFilters.length > 0) {
      filtered = filtered.filter((a) => {
        const uniId = (a.athlete as { university_id?: string }).university_id;
        return uniId ? universityFilters.includes(uniId) : false;
      });
    }

    // Agent filters (from athlete, multi-select)
    if (agentFilters.length > 0) {
      filtered = filtered.filter((a) => {
        const agentId = (a.athlete as { agent_id?: string }).agent_id;
        return agentId ? agentFilters.includes(agentId) : false;
      });
    }

    // NIL Go status filters. Only sponsorship agreements have a status, so
    // when this filter is active we hide revenue share agreements entirely.
    if (nilGoFilters.length > 0) {
      filtered = filtered.filter(
        (a) =>
          a.type === "sponsorship" &&
          a.nil_go_status !== null &&
          nilGoFilters.includes(a.nil_go_status)
      );
    }

    // Sort by amount descending
    return [...filtered].sort((a, b) => b.amount_cents - a.amount_cents);
  }, [agreements, search, typeFilters, universityFilters, agentFilters, nilGoFilters]);

  if (error) {
    return (
      <Card>
        <CardContent className="py-10">
          <p className="text-center text-destructive">
            Failed to load agreements. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate totals for header
  const totalAmount = filteredAgreements.reduce((sum, a) => sum + a.amount_cents, 0);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <span className="font-semibold text-lg">Agreements</span>
          <span className="text-muted-foreground">Total:</span>
          <span className="font-semibold">{formatCurrency(totalAmount)}</span>
          <Badge variant="outline">{filteredAgreements.length} agreement{filteredAgreements.length !== 1 ? "s" : ""}</Badge>
        </div>
        <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by athlete or sponsor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <MultiSelect
              label="All Types"
              options={[
                { value: "sponsorship", label: "Sponsorship" },
                { value: "revenue_share", label: "Revenue Share" },
              ]}
              values={typeFilters}
              onChange={setTypeFilters}
              className="w-[150px]"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
          <MultiSelect
            label="All Universities"
            options={universities.map((uni) => ({
              value: uni.id,
              label: uni.name,
            }))}
            values={universityFilters}
            onChange={setUniversityFilters}
            searchable
            searchPlaceholder="Search universities..."
            className="w-[200px]"
          />
          <MultiSelect
            label="All Agents"
            options={agents.map((a) => ({ value: a.id, label: a.name }))}
            values={agentFilters}
            onChange={setAgentFilters}
            searchable
            searchPlaceholder="Search agents..."
            className="w-[200px]"
          />
          <MultiSelect
            label="All NIL Go Status"
            options={NIL_GO_STATUS_OPTIONS}
            values={nilGoFilters}
            onChange={setNilGoFilters}
            className="w-[200px]"
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
                  <TableHead className="text-muted-foreground font-normal">Type</TableHead>
                  <TableHead className="text-muted-foreground font-normal">Sponsor</TableHead>
                  <TableHead className="text-muted-foreground font-normal">University</TableHead>
                  <TableHead className="text-muted-foreground font-normal">Agent</TableHead>
                  {/* Campaign column hidden - feature disabled for now */}
                  <TableHead className="text-center text-muted-foreground font-normal">NIL Target</TableHead>
                  <TableHead className="text-muted-foreground font-normal">NIL Go Status</TableHead>
                  <TableHead className="text-right text-muted-foreground font-normal">Amount</TableHead>
                </TableRow>
              </TableHeader>
                <TableBody>
                  {filteredAgreements.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="py-10 text-center text-muted-foreground"
                      >
                        No agreements found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAgreements.map((agreement) => (
                      <TableRow
                        key={agreement.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => router.push(`/agreements/${agreement.id}`)}
                      >
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {agreement.athlete.first_name}{" "}
                              {agreement.athlete.last_name}
                            </span>
                            <span className="text-xs text-muted-foreground capitalize">
                              {agreement.athlete.sport?.replace("_", " ")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`capitalize ${
                              agreement.type === "sponsorship"
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                                : "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200"
                            }`}
                            variant="outline"
                          >
                            {agreement.type.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {agreement.sponsor ? (
                            <span>{agreement.sponsor.name}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {(agreement.athlete as { university_id?: string }).university_id 
                            ? universityMap.get((agreement.athlete as { university_id?: string }).university_id!) || "—" 
                            : "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {(agreement.athlete as { agent_id?: string }).agent_id 
                            ? agentMap.get((agreement.athlete as { agent_id?: string }).agent_id!) || "—" 
                            : "—"}
                        </TableCell>
                        {/* Campaign column hidden - feature disabled for now */}
                        <TableCell className="text-center">
                          {agreement.applies_to_ioi ? (
                            <Check className="mx-auto h-4 w-4 text-emerald-600" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <NilGoStatusBadge
                            status={
                              agreement.type === "sponsorship"
                                ? agreement.nil_go_status
                                : null
                            }
                          />
                        </TableCell>
                        <TableCell className="text-right tabular-nums font-medium">
                          {formatCurrency(agreement.amount_cents)}
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
