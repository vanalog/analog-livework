"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Mail, Phone, Trash2 } from "lucide-react";
import { AddAgreementDialog } from "@/app/agreements/components/add-agreement-dialog";
import { DeleteConfirmationDialog } from "@/components/core/delete-confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { BackButton } from "@/components/core/back-button";
import { useApi } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import type { StudentAthleteWithThreads } from "@/types/api-types";
import { formatPhoneNumber } from "@/lib/formatters";
import { SPORT_LABELS } from "@/lib/constants";
import { EditAthleteDialog } from "@/app/athletes/components/edit-athlete-dialog";
import { ActiveAgreements } from "./_components/active-agreements";
import { EditIoiDialog } from "./_components/edit-ioi-dialog";
import { SponsorsSection } from "./_components/sponsors-section";
import { NilTargetCard } from "./_components/nil-target-card";
import { useAgents } from "@/lib/hooks/use-data";
import { deleteAthleteAction } from "@/lib/data/actions";
import { getAthleteBudgetByAthleteAndYear, getAgreementsByAthlete, getAgreementsByAthleteWithRelations } from "@/lib/data";
import useSWR from "swr";

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function AthletePage() {
  const params = useParams<{ uuid: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { uuid } = params;
  const [ioiDialogOpen, setIoiDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const $api = useApi();
  const { data, isLoading } = $api.useQuery(
    "get",
    "/v1/student_athletes/{student_athlete_uuid}",
    {
      params: { path: { student_athlete_uuid: uuid } },
    }
  );
  const athlete = data as StudentAthleteWithThreads | undefined;

  const totalContractValue = React.useMemo(() => {
    return (
      athlete?.threads?.reduce((sum, t) => sum + (t.total_value || 0), 0) || 0
    );
  }, [athlete?.threads]);

  // Budget data from database
  const currentYear = new Date().getFullYear().toString();
  const { data: athleteBudget, mutate: mutateBudget } = useSWR(
    `athlete-budget-${uuid}-${currentYear}`,
    () => getAthleteBudgetByAthleteAndYear(uuid, currentYear)
  );
  const { data: athleteAgreements } = useSWR(
    `athlete-agreements-${uuid}`,
    () => getAgreementsByAthlete(uuid)
  );
  const { data: athleteAgreementsWithRelations = [] } = useSWR(
    `athlete-agreements-relations-${uuid}`,
    () => getAgreementsByAthleteWithRelations(uuid)
  );
  const { data: agents = [] } = useAgents();

  // Get agent name from agent_id
  const agentName = useMemo(() => {
    const agentId = (athlete as any)?.agent_id;
    if (!agentId) return null;
    const agent = agents.find(a => a.id === agentId);
    return agent?.name || null;
  }, [athlete, agents]);

  // Calculate budget totals
  const budget = useMemo(() => {
    if (!athleteBudget) return null;
    return {
      ioi: athleteBudget.total_budget_cents || 0,
      revShare: 0, // Will be calculated from agreements
    };
  }, [athleteBudget]);

  const totals = useMemo(() => {
    const agreements = athleteAgreements || [];
    const ioi = budget?.ioi || 0;
    
    // Total sponsorships that apply to IOI (exclude terminated agreements)
    const ioiSponsorships = agreements
      .filter(a => a.status !== 'terminated' && a.applies_to_ioi)
      .reduce((sum, a) => sum + (a.amount_cents || 0), 0);
    
    // Total of all sponsorships (exclude terminated)
    const totalSponsorships = agreements
      .filter(a => a.status !== 'terminated')
      .reduce((sum, a) => sum + (a.amount_cents || 0), 0);
    
    // Revenue share agreements (exclude terminated)
    const revShare = agreements
      .filter(a => a.type === 'revenue_share' && a.status !== 'terminated')
      .reduce((sum, a) => sum + (a.amount_cents || 0), 0);
    
    const sponsorshipGap = Math.max(0, ioi - ioiSponsorships);
    const sponsorshipProgress = ioi > 0 ? (ioiSponsorships / ioi) * 100 : 0;
    
    return {
      revShare,
      ioi,
      totalSponsorships,
      ioiSponsorships,
      total: revShare + totalSponsorships, // Total committed = revenue share + all sponsorships
      sponsorshipGap,
      sponsorshipProgress, // Don't cap - allow >100% for athletes exceeding target
      sponsorCount: agreements.filter(a => a.status !== 'terminated').length,
      isFullyFunded: ioiSponsorships >= ioi,
    };
  }, [athleteAgreements, budget]);

  const hasIoi = budget && budget.ioi > 0;
  const cappedProgress = Math.min(100, totals?.sponsorshipProgress || 0);
  const progressColor =
    cappedProgress >= 100
      ? "bg-emerald-500"
      : cappedProgress >= 75
        ? "bg-emerald-400"
        : cappedProgress >= 50
          ? "bg-amber-500"
          : cappedProgress >= 25
            ? "bg-amber-400"
            : "bg-slate-300";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!athlete) {
    return (
      <div className="space-y-6">
        <BackButton label="Back to Athletes" />
        <div className="text-center py-12">
          <p className="text-muted-foreground">Athlete not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackButton label="Back to Athletes" />

      {/* Full-width Summary Card */}
      <Card>
        <CardContent className="pt-6">
          {/* Top section: Name/Sport/University on left, Total Committed on right */}
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">
                {athlete.first_name} {athlete.last_name}
              </h1>
              <p className="text-muted-foreground">
                {athlete.sport && SPORT_LABELS[athlete.sport]}
              </p>
              {(athlete as any).university && (
                <Badge variant="outline">
                  {(athlete as any).university}
                </Badge>
              )}
            </div>
            
            {/* Total Committed Value with tooltip */}
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-help text-right">
                      <p className="text-sm text-muted-foreground mb-1">Total Committed</p>
                      <p className="text-3xl font-bold tabular-nums">
                        {formatCurrency(totals?.total || 0)}
                      </p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="end" className="max-w-xs bg-white text-foreground border shadow-md" hideArrow>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">Commitment Breakdown</p>
                      <div className="space-y-1 text-xs">
                        {(totals?.revShare || 0) > 0 && (
                          <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Revenue Share</span>
                            <span className="tabular-nums">{formatCurrency(totals?.revShare || 0)}</span>
                          </div>
                        )}
                        {hasIoi && (
                          <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">NIL Target</span>
                            <span className="tabular-nums">{formatCurrency(budget?.ioi || 0)}</span>
                          </div>
                        )}
                        {((totals?.totalSponsorships || 0) - (totals?.ioiSponsorships || 0)) > 0 && (
                          <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Other Sponsorships</span>
                            <span className="tabular-nums">{formatCurrency((totals?.totalSponsorships || 0) - (totals?.ioiSponsorships || 0))}</span>
                          </div>
                        )}
                        {(!totals?.revShare && !hasIoi && !totals?.totalSponsorships) && (
                          <p className="text-muted-foreground">No commitments yet</p>
                        )}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Bottom section: Contact info and Representation */}
          <div className="flex gap-12 border-t pt-6">
            {/* Contact Info */}
            <div className="space-y-2">
              {athlete.edu_email && (
                <p className="text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  {athlete.edu_email}
                </p>
              )}
              {athlete.secondary_email && (
                <p className="text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  {athlete.secondary_email}
                </p>
              )}
              {athlete.preferred_phone && (
                <p className="text-sm flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  {formatPhoneNumber(athlete.preferred_phone.phone_number)}
                  {athlete.preferred_phone.type && (
                    <span className="text-xs text-muted-foreground">
                      ({athlete.preferred_phone.type})
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Representation (Agent) */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Representation</p>
              {agentName ? (
                <p className="text-sm">{agentName}</p>
              ) : (
                <p className="text-sm italic text-muted-foreground">Not specified</p>
              )}
            </div>

            {/* Edit and Delete buttons */}
            <div className="ml-auto flex items-center gap-2">
              <EditAthleteDialog athlete={athlete} />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDeleteDialogOpen(true)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agreements and Sidebar row */}
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <ActiveAgreements
            athlete={athlete}
            totalContractValue={totalContractValue}
            athleteUuid={uuid}
          />
        </div>
        <div className="w-64 shrink-0 space-y-4">
          <NilTargetCard
            hasTarget={!!hasIoi}
            targetAmount={budget?.ioi || 0}
            raisedAmount={totals?.ioiSponsorships || 0}
            gapAmount={totals?.sponsorshipGap || 0}
            progressPercent={totals?.sponsorshipProgress || 0}
            isFullyFunded={totals?.isFullyFunded || false}
            onEditClick={() => setIoiDialogOpen(true)}
          />
          <SponsorsSection agreements={athleteAgreementsWithRelations} />
        </div>
      </div>

      {/* Edit IOI Dialog */}
      <EditIoiDialog
        athleteUuid={uuid}
        athleteId={uuid}
        open={ioiDialogOpen}
        onOpenChange={setIoiDialogOpen}
        currentIoi={budget?.ioi}
        onSaved={() => {
          // Refresh budget data after saving
          mutateBudget();
        }}
      />

      {/* Delete Athlete Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!isDeleting) setDeleteDialogOpen(open);
        }}
        onConfirm={async () => {
          setIsDeleting(true);
          try {
            const result = await deleteAthleteAction(uuid);
            if (!result.success) {
              throw new Error(result.error || "Failed to delete athlete");
            }
            // Invalidate react-query cache
            await queryClient.invalidateQueries({ queryKey: ["get", "/v1/student_athletes"] });
            await queryClient.invalidateQueries({ queryKey: ["get", `/v1/student_athletes/${uuid}`] });
            router.push("/athletes");
          } catch (error) {
            console.error("Failed to delete athlete:", error);
            setIsDeleting(false);
            alert("Failed to delete athlete. Please try again.");
          }
        }}
        isDeleting={isDeleting}
        title="Delete Athlete"
        description="Are you sure you want to delete this athlete? This action cannot be undone. All associated agreements and budget data will also be removed."
        itemName={`${athlete.first_name} ${athlete.last_name}`}
      />
    </div>
  );
}

export default AthletePage;
