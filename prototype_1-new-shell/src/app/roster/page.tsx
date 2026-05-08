"use client";

import Layout from "@/components/layout/dashboard";
import { RosterTable } from "./components/roster-table";
import { AddAthleteDialog } from "@/app/athletes/components/add-athlete-dialog";

export default function RosterPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">Athletes</h1>
            <p className="text-muted-foreground">
              Track athlete commitments, revenue sharing, and sponsorship gaps
            </p>
          </div>
          <AddAthleteDialog />
        </div>
        <RosterTable />
      </div>
    </Layout>
  );
}
