"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { Plus, FileText, Check } from "lucide-react";
import type { AgreementWithRelations } from "@/types/database";
import { AddAgreementDialog } from "@/app/agreements/components/add-agreement-dialog";

interface AgreementsSectionProps {
  agreements: AgreementWithRelations[];
  sponsorId: string;
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function AgreementsSection({
  agreements,
  sponsorId,
}: AgreementsSectionProps) {
  const router = useRouter();
  
  const sortedAgreements = useMemo(() => {
    return [...agreements].sort((a, b) => {
      // Sort by amount descending
      return (b.amount_cents || 0) - (a.amount_cents || 0);
    });
  }, [agreements]);

  // Calculate totals
  const totalAmount = sortedAgreements.reduce((sum, a) => sum + (a.amount_cents || 0), 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <span className="font-semibold text-lg">Agreements</span>
          <span className="text-muted-foreground">Total:</span>
          <span className="font-semibold">{formatCurrency(totalAmount)}</span>
          <Badge variant="outline">{sortedAgreements.length} agreement{sortedAgreements.length !== 1 ? "s" : ""}</Badge>
        </div>
        <AddAgreementDialog
          defaultSponsorId={sponsorId}
          sponsorshipOnly
          trigger={
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Create Agreement
            </Button>
          }
        />
      </CardHeader>
      <CardContent>
        {sortedAgreements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">
              No agreements yet. Create an agreement to track sponsorship deals.
            </p>
            <AddAgreementDialog
              defaultSponsorId={sponsorId}
              sponsorshipOnly
              trigger={
                <Button variant="outline" className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Agreement
                </Button>
              }
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[200px] text-muted-foreground font-normal">Athlete</TableHead>
                <TableHead className="text-muted-foreground font-normal">University</TableHead>
                <TableHead className="text-muted-foreground font-normal">Agent</TableHead>
                <TableHead className="text-center text-muted-foreground font-normal">NIL Target</TableHead>
                <TableHead className="text-right text-muted-foreground font-normal">Amount</TableHead>
              </TableRow>
            </TableHeader>
              <TableBody>
                {sortedAgreements.map((agreement) => (
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
                      {(agreement.athlete as any).university ? (
                        <span>{(agreement.athlete as any).university}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {(agreement.athlete as any).agent_name ? (
                        <span>{(agreement.athlete as any).agent_name}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
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
                ))}
            </TableBody>
          </Table>
        )}


      </CardContent>
    </Card>
  );
}
