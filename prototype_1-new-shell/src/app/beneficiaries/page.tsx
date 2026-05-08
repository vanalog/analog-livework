"use client";

import { Plus } from "lucide-react";
import { DataTable } from "@/components/core/data-table";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import { useRouter } from "next/navigation";

// TODO: replace hardcoded data with API endpoint
// @ts-expect-error temporary data
const data: Beneficiary[] = [
  {
    uuid: "94B6C462-9C89-46B3-8BDA-A09674565624",
    name: "Marcus Johnson",
    university: "Duke University",
    status: "verified",
    contractCount: 3,
    totalValue: 12500000,
  },
  {
    uuid: "D05A2110-B84B-4629-93C1-3A1B6F4D714A",
    name: "Sarah Williams",
    university: "Stanford University",
    status: "in-progress",
    contractCount: 1,
    totalValue: 4500000,
  },
  {
    uuid: "55D98C0F-97D2-475E-AA11-EAD474203543",
    name: "Alex Chen",
    university: "University Of Michigan",
    status: "needs-review",
    contractCount: 2,
    totalValue: 7870000,
  },
  {
    uuid: "95D99158-E57B-4308-8CB5-5FFCF6BDFCDF",
    name: "Jordan Davis",
    university: "University Of Texas",
    status: "blocked",
    contractCount: 0,
    totalValue: 0,
  },
];

const options = [
  { label: "Verified", value: "verified" },
  { label: "In Progress", value: "in-progress" },
  { label: "Needs Review", value: "needs-review" },
  { label: "Blocked", value: "blocked" },
] as const;

function AddBeneficiary() {
  return (
    <Button>
      <Plus className="h-4 w-4" />
      New Beneficiary
    </Button>
  );
}

function Beneficiaries() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Beneficiaries</h1>
        <p className="text-muted-foreground">
          Manage student-athletes and view their linked contracts, compliance
          status, and payouts.
        </p>
      </div>
      <DataTable
        loading={false}
        columns={columns}
        data={data || []}
        searchableColumn="name"
        filterableColumn={{
          id: "status",
          allOptionText: "All statuses",
          options: options,
        }}
        onRowClick={(row) => router.push(`beneficiaries/${row.uuid}`)}
        createAction={<AddBeneficiary />}
        displayBorder
      />
    </div>
  );
}

export default Beneficiaries;
