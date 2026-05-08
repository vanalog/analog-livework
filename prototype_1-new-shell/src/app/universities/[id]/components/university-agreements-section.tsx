"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, Check, Plus } from "lucide-react";
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
import type { Agreement } from "@/types/database";

interface UniversityAgreementsSectionProps {
  agreements: Agreement[];
  universityId: string;
  athleteNames: Record<string, { first_name: string; last_name: string; sport: string }>;
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function UniversityAgreementsSection({
  agreements,
  universityId,
  athleteNames,
}: UniversityAgreementsSectionProps) {
  const router = useRouter();

  const totalValue = agreements.reduce((sum, a) => sum + (a.amount_cents || 0), 0);
  const agreementCount = agreements.length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg font-semibold">Agreements</CardTitle>
          </div>
          <span className="text-lg font-semibold">
            Total: {formatCurrency(totalValue)}
          </span>
          <Badge variant="secondary" className="font-normal">
            {agreementCount} agreement{agreementCount !== 1 ? "s" : ""}
          </Badge>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push("/agreements")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Agreement
        </Button>
      </CardHeader>
      <CardContent>
        {agreementCount > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground font-normal">Athlete</TableHead>
                <TableHead className="text-muted-foreground font-normal">Type</TableHead>
                <TableHead className="text-center text-muted-foreground font-normal">NIL Target</TableHead>
                <TableHead className="text-right text-muted-foreground font-normal">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agreements.map((agreement) => {
                const athlete = athleteNames[agreement.athlete_id || ""];
                
                return (
                  <TableRow
                    key={agreement.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/agreements/${agreement.id}`)}
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {athlete ? `${athlete.first_name} ${athlete.last_name}` : "Unknown Athlete"}
                        </span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {athlete?.sport?.replace("_", " ") || ""}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 border-emerald-200"
                      >
                        Revenue Share
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {agreement.applies_to_ioi ? (
                        <Check className="mx-auto h-4 w-4 text-emerald-600" />
                      ) : (
                        <span className="text-muted-foreground">-</span>
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
            No agreements yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}
