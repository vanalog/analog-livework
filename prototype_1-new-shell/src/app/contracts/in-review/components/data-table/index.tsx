"use client";

import React, { useMemo } from "react";
import {
  SortingState,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ComboboxFilter } from "@/components/core/data-table/combobox-filter";
import { TableContent } from "@/components/core/data-table/table-content";
import { SelectFilter } from "@/components/core/data-table/select-filter";
import { DataTablePagination } from "@/components/core/data-table/data-table-pagination";
import { FilterBadge } from "@/components/core/data-table/filter-badge";
import { ToggleFilter } from "@/components/core/data-table/toggle-filter";
import { useInReviewColumns } from "./columns";
import {
  currentHolderOptions,
  threadStatusOptions,
  contractTypeOptions,
  contractGroupOptions,
  sportOptions,
} from "@/lib/constants";

function DataTable() {
  const $api = useApi();
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const { data: threadsQuery, isLoading } = $api.useQuery("get", "/v1/threads");
  const data = useMemo(() => {
    return threadsQuery?.data ?? [];
  }, [threadsQuery]);

  const columns = useInReviewColumns();
  const table = useReactTable({
    data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    initialState: {
      globalFilter: "",
      columnFilters: [],
      pagination: {
        pageSize: 25,
        pageIndex: 0,
      },
    },
    state: {
      sorting,
    },
    globalFilterFn: "includesString",
    autoResetPageIndex: false,
  });

  const priorityColumn = table.getColumn("is_priority");
  const statusColumn = table.getColumn("status");
  const agencyColumn = table.getColumn("agency");
  const currentHolderColumn = table.getColumn("current_holder");
  const contractTypeColumn = table.getColumn("contract_type");
  const contractGroupColumn = table.getColumn("contract_group");
  const sportColumn = table.getColumn("sport");

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex flex-row gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-10 w-full max-w-2xl" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4">
        {priorityColumn && (
          <ToggleFilter column={priorityColumn} icon="star" label="Priority" />
        )}
        {statusColumn && (
          <SelectFilter
            column={statusColumn}
            options={threadStatusOptions}
            label={"Status"}
            icon="funnel"
          />
        )}
        {agencyColumn && (
          <ComboboxFilter
            icon="briefcase"
            column={agencyColumn}
            label={"Agency"}
          />
        )}
        {currentHolderColumn && (
          <SelectFilter
            column={currentHolderColumn}
            options={currentHolderOptions}
            label={"Current holder"}
            icon="users"
          />
        )}
        {contractTypeColumn && (
          <SelectFilter
            column={contractTypeColumn}
            options={contractTypeOptions}
            label={"Type"}
            icon="contract"
          />
        )}
        {contractGroupColumn && (
          <SelectFilter
            column={contractGroupColumn}
            options={contractGroupOptions}
            label={"Group"}
            icon="group"
          />
        )}
        {sportColumn && (
          <SelectFilter
            column={sportColumn}
            options={sportOptions}
            label={"Sport"}
            icon="volleyball"
          />
        )}
      </div>
      <div className="flex flex-row justify-between items-center">
        <Input
          placeholder="Search Agreements, Athletes, or Agencies..."
          className="max-w-2xl"
          value={(table.getState().globalFilter as string) ?? ""}
          onChange={(event) =>
            table.setGlobalFilter(String(event.target.value))
          }
        />
        {table.getState().columnFilters.length > 0 && (
          <Button variant="ghost" onClick={() => table.setColumnFilters([])}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      {table.getState().columnFilters.length > 0 && (
        <div className="flex flex-row flex-wrap items-center gap-4">
          {table.getState().columnFilters.map((filter) => {
            const column = table.getColumn(filter.id);
            if (!column) return null;

            return (
              <FilterBadge
                key={filter.id}
                id={filter.id}
                value={filter.value}
                column={column}
              />
            );
          })}
        </div>
      )}
      <TableContent
        table={table}
        onRowClick={(row) => router.push(`/contracts/in-review/${row.uuid}`)}
      />
      <DataTablePagination table={table} />
    </div>
  );
}

export { DataTable };
