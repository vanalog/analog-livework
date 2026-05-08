"use client";

import { UploadContractDialog } from "./components/upload-contract-dialog";
import { DataTable } from "./components/data-table";

function InNegotiationContracts() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Agreements in Review
            </h1>
            <p className="text-muted-foreground">
              Manage agreements currently in review
            </p>
          </div>
          <div className="flex flex-row gap-4">
            <UploadContractDialog />
          </div>
        </div>
        <DataTable />
      </div>
    </div>
  );
}

export default InNegotiationContracts;
