"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/core/status-badge";
import { SportBadge } from "./sport-badge";
import { CurrentHolderBadge } from "./current-holder-badge";
import { ActionsCell } from "./actions-cell";
import { PriorityStar } from "./priority-star";
import { Thread, ContractType, ContractGroup, Sport } from "@/types/api-types";
import { formatCentstoUSD } from "@/lib/formatters";
import { CONTRACT_TYPE_LABELS, CONTRACT_GROUP_LABELS } from "@/lib/constants";

function useInReviewColumns() {
  const columns = React.useMemo<ColumnDef<Thread>[]>(
    () => [
      {
        size: 48,
        accessorKey: "is_priority",
        header: "",
        cell: (props) => {
          if (!props.row.original.uuid) return null;
          return (
            <PriorityStar
              threadUuid={props.row.original.uuid}
              isPriority={props.row.getValue("is_priority") ?? false}
            />
          );
        },
        filterFn: (row, columnId, filterValue: boolean[]) => {
          if (!filterValue || filterValue.length === 0) return true;
          const cellValue = row.getValue(columnId) as boolean;
          return filterValue.includes(cellValue);
        },
        enableGlobalFilter: false,
      },
      {
        accessorKey: "status",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Status
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: (props) => (
          <div className="flex items-center gap-2">
            {false && <CircleAlert className="h-4 w-4 text-red-500" />}
            <StatusBadge status={props.row.getValue("status")} />
          </div>
        ),
        filterFn: (row, columnId, filterValue: string[]) => {
          if (!filterValue || filterValue.length === 0) return true;
          const cellValue = row.getValue(columnId) as string;
          return filterValue.includes(cellValue);
        },
        enableGlobalFilter: false,
      },
      {
        size: 288,
        maxSize: 304,
        id: "filename",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Agreement
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        accessorFn: (row) => row.title,
        cell: (props) => (
          <span className="font-semibold">
            {props.row.getValue("filename")}
          </span>
        ),
      },
      {
        id: "athlete",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Athlete
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        accessorFn: (row) =>
          `${row.student_athlete?.first_name} ${row.student_athlete?.last_name}`,
      },
      {
        accessorKey: "agency",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Agency
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        accessorFn: (row) => row.agency?.name,
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
        accessorKey: "contract_type",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Type
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: (props) => {
          const contractType = props.row.getValue("contract_type");
          if (!contractType) return null;
          return (
            <span className="font-semibold">
              {CONTRACT_TYPE_LABELS[contractType as ContractType]}
            </span>
          );
        },
        filterFn: (row, columnId, filterValue: string[]) => {
          if (!filterValue || filterValue.length === 0) return true;
          const cellValue = row.getValue(columnId) as string;
          return filterValue.includes(cellValue);
        },
        enableGlobalFilter: false,
      },
      {
        accessorKey: "contract_group",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Group
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: (props) => {
          const contractGroup = props.row.getValue("contract_group");
          if (!contractGroup) return null;
          return (
            <span className="font-semibold">
              {CONTRACT_GROUP_LABELS[contractGroup as ContractGroup]}
            </span>
          );
        },
        filterFn: (row, columnId, filterValue: string[]) => {
          if (!filterValue || filterValue.length === 0) return true;
          const cellValue = row.getValue(columnId) as string;
          return filterValue.includes(cellValue);
        },
        enableGlobalFilter: false,
      },
      {
        id: "sport",
        accessorFn: (row) => row.student_athlete?.sport,
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Sport
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: (props) => <SportBadge sport={props.getValue() as Sport} />,
        enableGlobalFilter: false,
        filterFn: (row, columnId, filterValue: string[]) => {
          if (!filterValue || filterValue.length === 0) return true;
          return filterValue.includes(row.getValue(columnId));
        },
      },
      {
        accessorKey: "total_value",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Value
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: (props) => (
          <span className="font-bold">
            {formatCentstoUSD(props.row.getValue("total_value"))}
          </span>
        ),
        enableGlobalFilter: false,
      },
      {
        size: 112,
        accessorKey: "current_holder",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Current Holder
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: (props) => (
          <CurrentHolderBadge
            currentHolder={props.row.getValue("current_holder")}
          />
        ),
        filterFn: (row, columnId, filterValue: string[]) => {
          if (!filterValue || filterValue.length === 0) return true;
          const cellValue = row.getValue(columnId) as string;
          return filterValue.includes(cellValue);
        },
        enableGlobalFilter: false,
      },
      {
        accessorKey: "uuid",
        header: () => <div className="flex justify-end pr-2">Actions</div>,
        cell: (props) => (
          <ActionsCell
            uuid={props.row.original.uuid}
            last_document_uuid={props.row.original.last_document_uuid}
            status={props.row.original.status}
            title={props.row.original.title}
            student_athlete={props.row.original.student_athlete}
          />
        ),
        enableGlobalFilter: false,
      },
    ],
    [],
  );

  return columns;
}

export { useInReviewColumns };
