import { ColumnDef } from "@tanstack/react-table";
import { SquareArrowOutUpRight } from "lucide-react";
import { ComplianceSummaryBadge } from "@/components/core/compliance-summary-badge";
import { IssuesCountBadge } from "@/components/core/issues-count-badge";
import { formatISODate } from "@/lib/formatters";

const columns: ColumnDef<never>[] = [
  {
    accessorKey: "filename",
    header: () => (
      <div className="flex text-muted-foreground px-2 h-12 items-center">
        Contract Name
      </div>
    ),
    cell: (props) => <>{props.row.getValue("filename")}</>,
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="flex text-muted-foreground px-2 h-12 items-center">
        Status
      </div>
    ),
    cell: (props) => (
      <ComplianceSummaryBadge status={props.row.getValue("status")} />
    ),
  },
  {
    accessorKey: "start_at",
    header: () => (
      <div className="flex text-muted-foreground px-2 h-12 items-center">
        Start Date
      </div>
    ),
    cell: (props) => (
      <div className="text-muted-foreground">
        {formatISODate(props.row.getValue("start_at"))}
      </div>
    ),
  },
  {
    accessorKey: "end_at",
    header: () => (
      <div className="flex text-muted-foreground px-2 h-12 items-center">
        End Date
      </div>
    ),
    cell: (props) => (
      <div className="text-muted-foreground">
        {formatISODate(props.row.getValue("end_at"))}
      </div>
    ),
  },
  {
    accessorKey: "issues",
    header: () => (
      <div className="flex text-muted-foreground px-2 h-12 items-center">
        Issues
      </div>
    ),
    cell: (props) => {
      const issues = props.row.getValue("issues") as undefined;
      return <IssuesCountBadge count={(issues ?? []).length} />;
    },
  },
  {
    id: "link",
    header: () => <></>,
    cell: () => {
      return (
        <SquareArrowOutUpRight className="w-4 h-4 text-muted-foreground" />
      );
    },
  },
];

export { columns };
