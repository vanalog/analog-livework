import DashboardLayout from "@/components/layout/dashboard";
import { AgreementsTable } from "./components/agreements-table";
import { AddAgreementDialog } from "./components/add-agreement-dialog";

export default function AgreementsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">Agreements</h1>
            <p className="text-muted-foreground">
              Manage sponsorship agreements and revenue share deals with athletes
            </p>
          </div>
          <AddAgreementDialog />
        </div>
        <AgreementsTable />
      </div>
    </DashboardLayout>
  );
}
