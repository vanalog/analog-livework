"use client";

import { use, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSWRConfig } from "swr";
import { ArrowLeft } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/core/delete-confirmation-dialog";
import DashboardLayout from "@/components/layout/dashboard";
import { UniversitySummaryCard } from "./components/university-summary-card";
import { UniversityAthletesSidebar } from "./components/university-athletes-sidebar";
import { UniversityAgreementsSection } from "./components/university-agreements-section";
import { EditUniversityDialog } from "./components/edit-university-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUniversity, useAthletesByUniversity, useAgreementsByUniversity } from "@/lib/hooks/use-data";
import { updateUniversity, deleteUniversity } from "@/lib/data";
import type { UniversityUpdate } from "@/types/database";

export default function UniversityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { mutate } = useSWRConfig();

  // Fetch data from Supabase
  const { data: university, isLoading: universityLoading, error: universityError, mutate: mutateUniversity } = useUniversity(id);
  const { data: athletes = [] } = useAthletesByUniversity(id);
  const { data: agreements = [] } = useAgreementsByUniversity(id);

  const [editUniversityOpen, setEditUniversityOpen] = useState(false);
  const [deleteUniversityOpen, setDeleteUniversityOpen] = useState(false);

  // Calculate totals
  const totalCommitted = useMemo(
    () => agreements.reduce((sum, a) => sum + (a.amount_cents || 0), 0),
    [agreements]
  );

  // Create athlete name lookup for agreements section
  const athleteNames = useMemo(() => {
    const lookup: Record<string, { first_name: string; last_name: string; sport: string }> = {};
    athletes.forEach((a) => {
      lookup[a.id] = { first_name: a.first_name, last_name: a.last_name, sport: a.sport || "" };
    });
    return lookup;
  }, [athletes]);

  const handleDeleteUniversity = async () => {
    try {
      await deleteUniversity(id);
      mutate("universities");
      mutate("universities-with-stats");
      router.push("/universities");
    } catch (error) {
      console.error("Failed to delete university:", error);
      alert("Failed to delete university. Please try again.");
    }
  };

  const handleUpdateUniversity = async (updated: UniversityUpdate) => {
    try {
      await updateUniversity(id, updated);
      mutateUniversity();
      mutate("universities");
      mutate("universities-with-stats");
      setEditUniversityOpen(false);
    } catch (error) {
      console.error("Failed to update university:", error);
      alert("Failed to update university. Please try again.");
    }
  };

  if (universityLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-6 p-6">
          <Link href="/universities">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Universities
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

  if (universityError || !university) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-6 p-6">
          <Link href="/universities">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Universities
            </Button>
          </Link>
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">University not found</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6">
        <Link href="/universities">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Universities
          </Button>
        </Link>
        
        <UniversitySummaryCard 
          university={university}
          totalCommitted={totalCommitted}
          agreementCount={agreements.length}
          athleteCount={athletes.length}
          onEdit={() => setEditUniversityOpen(true)}
          onDelete={() => setDeleteUniversityOpen(true)}
        />

        {/* Two-column layout: Agreements on left, Athletes on right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UniversityAgreementsSection 
              agreements={agreements}
              universityId={id}
              athleteNames={athleteNames}
            />
          </div>
          <div className="lg:col-span-1">
            <UniversityAthletesSidebar athletes={athletes} />
          </div>
        </div>
      </div>

      {university && (
        <EditUniversityDialog
          university={university}
          open={editUniversityOpen}
          onOpenChange={setEditUniversityOpen}
          onSave={handleUpdateUniversity}
        />
      )}

      <DeleteConfirmationDialog
        open={deleteUniversityOpen}
        onOpenChange={setDeleteUniversityOpen}
        onConfirm={handleDeleteUniversity}
        title="Delete University"
        description="Are you sure you want to delete this university? This action cannot be undone. Athletes will remain in the system but will no longer be associated with this university."
        itemName={university?.name}
      />
    </DashboardLayout>
  );
}
