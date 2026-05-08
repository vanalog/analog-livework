import DashboardLayout from "@/components/layout/dashboard";
import { UniversitiesTable } from "./components/universities-table";
import { AddUniversityDialog } from "./components/add-university-dialog";

export default function UniversitiesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">Universities</h1>
            <p className="text-muted-foreground">
              View universities and their athletes across your roster
            </p>
          </div>
          <AddUniversityDialog />
        </div>
        <UniversitiesTable />
      </div>
    </DashboardLayout>
  );
}
