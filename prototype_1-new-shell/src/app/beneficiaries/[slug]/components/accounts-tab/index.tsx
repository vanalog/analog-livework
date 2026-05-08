import { MetricCard } from "./metric-card";
import { ConnectedAccounts } from "./connected-accounts";
import { AccountsLedger } from "./accounts-ledger";

export interface ConnectedAccount {
  uuid: string;
  institution: string;
  last_four: string;
  type: "checking" | "savings";
  name: string;
  is_default: boolean;
}

const accounts = [
  {
    uuid: "DF9DA112-0C4A-436B-9295-FBC02DD4E7BE",
    title: "Allocated Funds",
    amount: 7500000,
    description: "Across active contracts",
  },
  {
    uuid: "A1E8CC37-62AF-49E5-9342-90D310040531",
    title: "Available Funds",
    amount: 4500000,
    description: "Ready to transfer",
  },
  {
    uuid: "9C5BAFF2-AC5E-447E-9156-11C194917AC8",
    title: "Disbursed",
    amount: 3000000,
    description: "Paid year-to-date",
  },
];

const external_accounts: ConnectedAccount[] = [
  {
    uuid: "2F7E237B-47CD-4251-BF15-B1F66D747346",
    institution: "Huntington Bank",
    last_four: "4321",
    type: "checking",
    name: "Primary Checking",
    is_default: true,
  },
  {
    uuid: "A4606211-69A1-4464-A68C-5AE2F58EF4BF",
    institution: "Wells Fargo",
    last_four: "7890",
    type: "savings",
    name: "Savings Account",
    is_default: false,
  },
];

function AccountsTab() {
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 w-full mb-4">
        {accounts.map((account) => (
          <MetricCard
            key={account.uuid}
            title={account.title}
            amount={account.amount}
            description={account.description}
          />
        ))}
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Allocated = contract total. Available = released but not yet
        transferred. Disbursed = transfers completed.
      </p>
      <ConnectedAccounts
        className="mb-4"
        external_accounts={external_accounts}
      />
      <AccountsLedger />
    </>
  );
}

export { AccountsTab };
