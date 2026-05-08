import { ColumnDef } from "@tanstack/react-table";
import { DisbursementBadges } from "./disbursement-status-badge";
import { EnhancedObligation } from "./types";
import { formatCentstoUSD, formatISODate } from "@/lib/formatters";

const columns: ColumnDef<EnhancedObligation>[] = [
  {
    accessorKey: "payment_date",
    header: () => (
      <div className="flex text-muted-foreground px-2 h-12 items-center">
        Date
      </div>
    ),
    cell: (props) => <>{formatISODate(props.row.getValue("payment_date"))}</>,
  },
  {
    accessorKey: "amount",
    header: () => (
      <div className="flex text-muted-foreground px-2 h-12 items-center">
        Amount
      </div>
    ),
    cell: (props) => <>{formatCentstoUSD(props.row.getValue("amount"))}</>,
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="flex text-muted-foreground px-2 h-12 items-center">
        Status
      </div>
    ),
    cell: (props) => (
      <DisbursementBadges status={props.row.getValue("status")} />
    ),
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
];

export { columns };
