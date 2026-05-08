"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { SportBadge } from "@/app/contracts/in-review/components/data-table/sport-badge";
import { StudentAthleteWithContracts, Sport } from "@/types/api-types";
import { formatCentstoUSD } from "@/lib/formatters";

function useAthleteColumns() {
  const columns = React.useMemo<ColumnDef<StudentAthleteWithContracts>[]>(
    () => [
      {
        id: "name",
        header: () => <span className="pl-2">Name</span>,
        accessorFn: (row) => `${row.first_name} ${row.last_name}`,
        cell: (props) => {
          return (
            <div className="p-2">
              <span className="font-semibold">
                {props.getValue() as string}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "sport",
        header: "Sport",
        cell: (props) => <SportBadge sport={props.getValue() as Sport} />,
        enableGlobalFilter: false,
        filterFn: (row, columnId, filterValue: string[]) => {
          if (!filterValue || filterValue.length === 0) return true;
          return filterValue.includes(row.getValue(columnId));
        },
      },
      {
        id: "agency",
        header: "Agency",
        accessorFn: (row) => row.agency?.name,
        cell: (props) => (
          <span className="font-medium">{props.getValue() as string}</span>
        ),
        enableGlobalFilter: false,
        filterFn: (row, _, filterValue: (string | null)[]) => {
          if (!filterValue || filterValue.length === 0) return true;

          const agencyName = row.original.agency?.name;

          return filterValue.some((value) => {
            // When filtering for null (empty values), check if agency is null/undefined
            if (value === null) {
              return row.original.agency == null;
            }

            return agencyName === value;
          });
        },
      },
      {
        accessorKey: "contract_count",
        header: () => <div className="text-center">Agreements</div>,
        cell: (props) => (
          <div className="text-center font-medium">
            {props.row.getValue("contract_count")}
          </div>
        ),
        enableGlobalFilter: false,
      },
      {
        accessorKey: "total_contract_value",
        header: () => <div className="text-right">Commitments</div>,
        cell: (props) => {
          const value = props.row.getValue("total_contract_value") as
            | number
            | undefined;
          return (
            <div className="text-right font-medium">
              {formatCentstoUSD(value ?? 0)}
            </div>
          );
        },
        enableGlobalFilter: false,
      },
    ],
    [],
  );

  return columns;
}

export { useAthleteColumns };
