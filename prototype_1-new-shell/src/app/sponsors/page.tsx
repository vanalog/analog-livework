import DashboardLayout from "@/components/layout/dashboard";
import { SponsorsTable } from "./components/sponsors-table";
import { AddSponsorDialog } from "./components/add-sponsor-dialog";

export default function SponsorsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">Sponsors</h1>
            <p className="text-muted-foreground">
              Manage sponsor relationships and track budgets across campaigns
            </p>
          </div>
          <AddSponsorDialog />
        </div>
        <SponsorsTable />
      </div>
    </DashboardLayout>
  );
}
