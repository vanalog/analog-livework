import { ColumnDef } from "@tanstack/react-table";
import { EventBadge } from "./event-badge";
import { formatCentstoUSD, formatISODate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { TransactionStatusBadge } from "./transaction-status-badge";

// TODO: because there is no contract associated with the
// "transfer-out" event, we could use a discrimated union
export interface Payout {
  date: string;
  contract: string | null;
  event: "allocation" | "milestone-met" | "transfer-out";
  amount: number;
  balance_after: number;
  status: "available" | "pending" | "posted" | "completed";
}

export const options = [
  { label: "Available", value: "available" },
  { label: "Pending", value: "pending" },
  { label: "Posted", value: "posted" },
  { label: "Completed", value: "completed" },
] as const;

export const columns: ColumnDef<Payout>[] = [
  {
    accessorKey: "date",
    header: () => (
      <div className="flex text-muted-foreground px-2 h-12 items-center">
        Date
      </div>
    ),
    cell: (props) => <>{formatISODate(props.row.getValue("date"))}</>,
  },
  {
    accessorKey: "contract",
    header: () => (
      <div className="flex text-muted-foreground px-2 h-12 items-center">
        Contract
      </div>
    ),
    cell: (props) => <>{props.row.getValue("contract")}</>,
  },
  {
    accessorKey: "event",
    header: () => (
      <div className="flex text-muted-foreground px-2 h-12 items-center">
        Event
      </div>
    ),
    cell: (props) => <EventBadge event={props.row.getValue("event")} />,
  },
  {
    accessorKey: "amount",
    header: () => (
      <div className="flex text-muted-foreground px-2 h-12 items-center justify-end">
        Amount
      </div>
    ),
    cell: (props) => {
      const amount: number = props.row.getValue("amount");
      return (
        <div
          className={cn(
            amount >= 0 ? "text-green-600" : "text-red-600",
            "text-right",
          )}
        >
          {formatCentstoUSD(amount)}
        </div>
      );
    },
  },
  {
    accessorKey: "balance_after",
    header: () => (
      <div className="flex text-muted-foreground px-2 h-12 items-center justify-end">
        Balance After
      </div>
    ),
    cell: (props) => (
      <div className="text-right">
        {formatCentstoUSD(props.row.getValue("balance_after"))}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="flex text-muted-foreground px-2 h-12 items-center">
        Status
      </div>
    ),
    cell: (props) => (
      <TransactionStatusBadge status={props.row.getValue("status")} />
    ),
  },
];
