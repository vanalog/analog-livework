"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { DeleteConfirmationDialog } from "@/components/core/delete-confirmation-dialog";
import DashboardLayout from "@/components/layout/dashboard";
import { SponsorSummaryCard } from "./components/sponsor-summary-card";
// CampaignsSection hidden - feature disabled for now
// import { CampaignsSection } from "./components/campaigns-section";
import { AgreementsSection } from "./components/agreements-section";
import { AthletesSection } from "./components/athletes-section";
// Campaign dialogs hidden - feature disabled for now
// import { CampaignDetailDialog } from "./components/campaign-detail-dialog";
import { EditSponsorDialog } from "./components/edit-sponsor-dialog";
// import { AddCampaignDialog } from "./components/add-campaign-dialog";
// import { EditCampaignDialog } from "./components/edit-campaign-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSponsor, useAgreementsBySponsor, useAgreementsBySponsorWithRelations } from "@/lib/hooks/use-data";
import { updateSponsor } from "@/lib/data";
import { deleteSponsorAction } from "@/lib/data/actions";
import type { SponsorUpdate } from "@/types/database";

export default function SponsorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { mutate } = useSWRConfig();

  // Fetch data from Supabase
  const { data: sponsor, isLoading: sponsorLoading, error: sponsorError, mutate: mutateSponsor } = useSponsor(id);
  // Campaign fetching disabled - feature hidden for now
  // const { data: campaigns = [] } = useCampaignsBySponsor(id);
  const { data: agreements = [] } = useAgreementsBySponsor(id);
  const { data: agreementsWithRelations = [] } = useAgreementsBySponsorWithRelations(id);

  // Campaign state disabled - feature hidden for now
  // const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [editSponsorOpen, setEditSponsorOpen] = useState(false);
  const [deleteSponsorOpen, setDeleteSponsorOpen] = useState(false);
  // const [addCampaignOpen, setAddCampaignOpen] = useState(false);
  // const [editCampaignOpen, setEditCampaignOpen] = useState(false);
  // const [deleteCampaignOpen, setDeleteCampaignOpen] = useState(false);

  // Calculate budget totals - always use sponsor-level budget
  const budgetTotals = {
    totalBudget: sponsor?.budget_cents || 0,
    totalCommitted: agreements.reduce((sum, a) => sum + (a.amount_cents || 0), 0),
    agreementCount: agreements.length,
  };

  const handleDeleteSponsor = async () => {
    try {
      const result = await deleteSponsorAction(id);
      if (!result.success) {
        throw new Error(result.error || "Failed to delete sponsor");
      }
      mutate("sponsors");
      mutate("sponsors-with-budgets");
      router.push("/sponsors");
    } catch (error) {
      console.error("[v0] Failed to delete sponsor:", error);
      alert("Failed to delete sponsor. Please try again.");
    }
  };

  const handleUpdateSponsor = async (updated: SponsorUpdate) => {
    try {
      await updateSponsor(id, updated);
      mutateSponsor();
      mutate("sponsors");
      setEditSponsorOpen(false);
    } catch (error) {
      console.error("[v0] Failed to update sponsor:", error);
      alert("Failed to update sponsor. Please try again.");
    }
  };

  if (sponsorLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-6 p-6">
          <Link href="/sponsors">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sponsors
            </Button>
          </Link>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (sponsorError || !sponsor) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-6 p-6">
          <Link href="/sponsors">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sponsors
            </Button>
          </Link>
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Sponsor not found</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6">
        <Link href="/sponsors">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sponsors
          </Button>
        </Link>
        <SponsorSummaryCard 
          sponsor={sponsor}
          budgetTotals={budgetTotals}
          onEdit={() => setEditSponsorOpen(true)}
          onDelete={() => setDeleteSponsorOpen(true)}
        />
        <div className="flex gap-6">
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {/* CampaignsSection hidden - feature disabled for now */}
            <AgreementsSection agreements={agreementsWithRelations} sponsorId={id} />
          </div>
          <div className="w-64 shrink-0">
            <AthletesSection agreements={agreementsWithRelations} />
          </div>
        </div>
      </div>

      {/* Campaign dialogs hidden - feature disabled for now */}

      {sponsor && (
        <EditSponsorDialog
          sponsor={sponsor}
          open={editSponsorOpen}
          onOpenChange={setEditSponsorOpen}
          onSave={handleUpdateSponsor}
        />
      )}

      <DeleteConfirmationDialog
        open={deleteSponsorOpen}
        onOpenChange={setDeleteSponsorOpen}
        onConfirm={handleDeleteSponsor}
        title="Delete Sponsor"
        description="Are you sure you want to delete this sponsor? This action cannot be undone. All associated agreements will also be removed."
        itemName={sponsor?.name}
      />
    </DashboardLayout>
  );
}
