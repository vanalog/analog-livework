"use client";
import { ActiveContractsStats } from "./components/active-contracts-stats";
import { activeContractsStats } from "./data";

function ActiveContracts() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Active Contracts
          </h1>
          <p className="text-muted-foreground">
            Manage signed and active NIL contracts
          </p>
        </div>
        <ActiveContractsStats {...activeContractsStats} />
      </div>
    </div>
  );
}

export default ActiveContracts;
