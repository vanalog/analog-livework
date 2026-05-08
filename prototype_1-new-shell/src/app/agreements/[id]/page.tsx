"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSWRConfig } from "swr";
import {
  FileText,
  Calendar,
  User,
  Building2,
  Trash2,
  Pencil,
  Check,
  X,
} from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard";
import { BackButton } from "@/components/core/back-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteConfirmationDialog } from "@/components/core/delete-confirmation-dialog";
import { EditAgreementDialog } from "./edit-agreement-dialog";
import { NilGoStatusCard } from "@/components/agreements/nil-go-status-card";
import { useAgreementsWithRelations } from "@/lib/hooks/use-data";
import { deleteAgreementAction } from "@/lib/data/actions";

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function AgreementDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { id } = params;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data: agreements, isLoading } = useAgreementsWithRelations();

  const agreement = useMemo(() => {
    if (!agreements) return null;
    return agreements.find((a) => a.id === id) || null;
  }, [agreements, id]);

  const handleDelete = async () => {
    try {
      const result = await deleteAgreementAction(id);
      if (!result.success) {
        throw new Error(result.error || "Failed to delete agreement");
      }
      mutate("agreements");
      mutate("agreements-with-relations");
      router.push("/agreements");
    } catch (error) {
      console.error("[v0] Failed to delete agreement:", error);
      alert("Failed to delete agreement. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!agreement) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <BackButton label="Back to Agreements" href="/agreements" />
          <div className="text-center py-12">
            <p className="text-muted-foreground">Agreement not found</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <BackButton label="Back to Agreements" href="/agreements" />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditDialogOpen(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
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

      {/* Summary + NIL Go (sponsorship only sits side-by-side at lg+) */}
      <div
        className={
          agreement.type === "sponsorship"
            ? "grid gap-6 lg:grid-cols-4"
            : undefined
        }
      >
        <Card
          className={
            agreement.type === "sponsorship" ? "lg:col-span-3" : undefined
          }
        >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-muted-foreground" />
                <CardTitle className="text-2xl">
                  {agreement.type === "sponsorship"
                    ? "Sponsorship Agreement"
                    : "Revenue Share Agreement"}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Badge
                  variant={
                    agreement.type === "sponsorship" ? "default" : "secondary"
                  }
                  className="capitalize"
                >
                  {agreement.type.replace("_", " ")}
                </Badge>
                {agreement.type === "sponsorship" && (
                  <Badge
                    variant={agreement.applies_to_ioi ? "default" : "outline"}
                    className="gap-1"
                  >
                    {agreement.applies_to_ioi ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    IOI
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Value</p>
              <p className="text-3xl font-bold tabular-nums">
                {formatCurrency(agreement.amount_cents)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Athlete */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                Athlete
              </div>
              <Link
                href={`/athletes/${agreement.athlete_id}`}
                className="font-medium hover:underline"
              >
                {agreement.athlete.first_name} {agreement.athlete.last_name}
              </Link>
              {agreement.athlete.sport && (
                <p className="text-sm text-muted-foreground capitalize">
                  {agreement.athlete.sport.replace("_", " ")}
                </p>
              )}
            </div>

            {/* Sponsor (if sponsorship) */}
            {agreement.type === "sponsorship" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  Sponsor
                </div>
                {agreement.sponsor ? (
                  <Link
                    href={`/sponsors/${agreement.sponsor_id}`}
                    className="font-medium hover:underline"
                  >
                    {agreement.sponsor.name}
                  </Link>
                ) : (
                  <p className="text-muted-foreground">-</p>
                )}
              </div>
            )}

            {/* Campaign section hidden - feature disabled for now */}

            {/* Dates */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Duration
              </div>
              <p className="font-medium">
                {formatDate(agreement.start_date)} -{" "}
                {formatDate(agreement.end_date)}
              </p>
            </div>
          </div>

          {/* Notes */}
          {agreement.notes && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Notes
              </h3>
              <p className="text-sm">{agreement.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

        {/* NIL Go column (sponsorship only) */}
        {agreement.type === "sponsorship" && (
          <div className="lg:col-span-1">
            <NilGoStatusCard
              agreementId={agreement.id}
              currentStatus={agreement.nil_go_status}
            />
          </div>
        )}
      </div>

      {/* Edit Dialog */}
        <EditAgreementDialog
          agreement={agreement}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />

        {/* Delete Dialog */}
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDelete}
          title="Delete Agreement"
          description="Are you sure you want to delete this agreement? This action cannot be undone."
          itemName={`${agreement.type.replace("_", " ")} agreement with ${agreement.athlete.first_name} ${agreement.athlete.last_name}`}
        />
      </div>
    </DashboardLayout>
  );
}
