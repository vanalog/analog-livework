import { ColumnDef } from "@tanstack/react-table";
import { SquareArrowOutUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BeneficiaryStatusBadge } from "./components/beneficiary-status-badge";
import { formatCentstoUSD } from "@/lib/formatters";
import { Beneficiary } from "./[slug]/types";

const columns: ColumnDef<Beneficiary>[] = [
  {
    accessorKey: "name",
    header: () => (
      <div className="flex text-muted-foreground px-2 h-12 items-center">
        Name
      </div>
    ),
    cell: (props) => (
      <div className="flex gap-2 items-center">
        {props.row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "university",
    header: () => (
      <div className="flex text-muted-foreground px-2 h-12 items-center">
        University
      </div>
    ),
    cell: (props) => (
      <div className="flex gap-2 items-center">
        <Badge variant="outline" className="rounded-full font-semibold">
          {props.row.getValue("university")}
        </Badge>
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
      <div className="flex gap-2 items-center">
        <BeneficiaryStatusBadge status={props.row.getValue("status")} />
      </div>
    ),
  },
  {
    accessorKey: "contractCount",
    header: () => (
      <div className="flex text-muted-foreground px-2 h-12 items-center">
        Contracts
      </div>
    ),
    cell: (props) => (
      <div className="flex gap-2 items-center">
        {props.row.getValue("contractCount")}
        <SquareArrowOutUpRight className="h-4 w-4" />
      </div>
    ),
  },
  {
    accessorKey: "totalValue",
    header: () => (
      <div className="flex text-muted-foreground px-2 h-12 items-center justify-end">
        Total Value
      </div>
    ),
    cell: (props) => {
      const value = props.row.getValue("totalValue");
      return (
        <div className="flex gap-2 justify-end">
          {formatCentstoUSD(value as number)}
        </div>
      );
    },
  },
];

export { columns };
