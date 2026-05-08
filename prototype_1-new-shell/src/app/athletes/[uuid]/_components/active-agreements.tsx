"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, Check, Plus } from "lucide-react";
import { AddAgreementDialog } from "@/app/agreements/components/add-agreement-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCentstoUSD } from "@/lib/formatters";
import { StudentAthleteWithThreads } from "@/types/api-types";
import { getAgreementsByAthlete, getSponsors, getUniversities } from "@/lib/data";
import useSWR from "swr";

type ActiveAgreementsProps = {
  athlete: StudentAthleteWithThreads;
  totalContractValue: number;
  athleteUuid: string;
};

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function ActiveAgreements({ athlete, totalContractValue, athleteUuid }: ActiveAgreementsProps) {
  const router = useRouter();

  // Get agreements from database
  const { data: dbAgreements = [] } = useSWR(
    `athlete-agreements-${athleteUuid}`,
    () => getAgreementsByAthlete(athleteUuid)
  );
  
  // Get sponsors and universities for display names
  const { data: sponsors = [] } = useSWR("sponsors", getSponsors);
  const { data: universities = [] } = useSWR("universities", getUniversities);
  
  const getSponsorName = (sponsorId: string | null): string | null => {
    if (!sponsorId) return null;
    const sponsor = sponsors.find((s) => s.id === sponsorId);
    return sponsor?.name || null;
  };
  
  const getUniversityName = (universityId: string | null): string | null => {
    if (!universityId) return null;
    const university = universities.find((u) => u.id === universityId);
    return university?.name || null;
  };

  // Filter to active/non-terminated agreements and sort by amount descending
  const allAgreements = useMemo(
    () => dbAgreements
      .filter((a) => a.status !== "terminated")
      .sort((a, b) => (b.amount_cents || 0) - (a.amount_cents || 0)),
    [dbAgreements]
  );

  // Calculate totals
  const totalAgreements = allAgreements.length;
  const combinedValue = useMemo(
    () => allAgreements.reduce((sum, a) => sum + (a.amount_cents || 0), 0),
    [allAgreements]
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Agreements
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {totalAgreements} agreement{totalAgreements !== 1 ? "s" : ""} • Total Value:{" "}
              {formatCentstoUSD(combinedValue)}
            </p>
          </div>
          <AddAgreementDialog 
            defaultAthleteId={athleteUuid}
            trigger={
              <Button variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-50/50 hover:text-blue-700 hover:border-blue-300 shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Agreement
              </Button>
            }
          />
        </div>
      </CardHeader>
      <CardContent>
        {totalAgreements > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground font-normal">Counterparty</TableHead>
                <TableHead className="text-muted-foreground font-normal">Type</TableHead>
                <TableHead className="text-center text-muted-foreground font-normal">NIL Target</TableHead>
                <TableHead className="text-right text-muted-foreground font-normal">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allAgreements.map((agreement) => {
                // Determine counterparty based on agreement type
                const isRevenueShare = agreement.type === "revenue_share";
                const counterpartyName = isRevenueShare
                  ? getUniversityName((agreement as any).university_id) || "University"
                  : getSponsorName(agreement.sponsor_id);
                const counterpartyLink = isRevenueShare
                  ? (agreement as any).university_id ? `/universities/${(agreement as any).university_id}` : null
                  : agreement.sponsor_id ? `/sponsors/${agreement.sponsor_id}` : null;

                return (
                  <TableRow 
                    key={agreement.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/agreements/${agreement.id}`)}
                  >
                    <TableCell className="font-medium">
                      {counterpartyLink ? (
                        <Link
                          href={counterpartyLink}
                          className="hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {counterpartyName}
                        </Link>
                      ) : (
                        <span>{counterpartyName || "—"}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          isRevenueShare
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-teal-50 text-teal-700 border-teal-200"
                        }
                      >
                        {isRevenueShare ? "Revenue Share" : "Sponsorship"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {agreement.applies_to_ioi ? (
                        <Check className="mx-auto h-4 w-4 text-emerald-600" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-medium">
                      {formatCurrency(agreement.amount_cents || 0)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-8">
            No active agreements
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { ActiveAgreements };
