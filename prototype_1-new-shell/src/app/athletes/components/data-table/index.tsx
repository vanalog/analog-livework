"use client";

import { useMemo } from "react";
import {
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useApi } from "@/lib/api";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { TableContent } from "@/components/core/data-table/table-content";
import { DataTablePagination } from "@/components/core/data-table/data-table-pagination";
import { ComboboxFilter } from "@/components/core/data-table/combobox-filter";
import { FilterBadge } from "@/components/core/data-table/filter-badge";
import { useAthleteColumns } from "./columns";
import { SelectFilter } from "@/components/core/data-table/select-filter";
import { sportOptions } from "@/lib/constants";

function DataTable() {
  const $api = useApi();
  const router = useRouter();

  const { data: athletesQuery, isLoading } = $api.useQuery(
    "get",
    "/v1/student_athletes",
  );

  const data = useMemo(() => {
    return athletesQuery?.data ?? [];
  }, [athletesQuery]);

  const columns = useAthleteColumns();
  const table = useReactTable({
    data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
    initialState: {
      globalFilter: "",
      columnFilters: [],
      pagination: {
        pageSize: 25,
        pageIndex: 0,
      },
    },
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const agencyColumn = table.getColumn("agency");
  const sportColumn = table.getColumn("sport");

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-full max-w-2xl" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-row gap-4">
        {agencyColumn && (
          <ComboboxFilter
            icon="briefcase"
            column={agencyColumn}
            label="Agency"
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
      <div className="flex flex-row justify-between items-center gap-4">
        <Input
          placeholder="Search Athletes..."
          className="max-w-md"
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
        onRowClick={(row) => router.push(`/athletes/${row.uuid}`)}
      />
      <DataTablePagination table={table} />
    </div>
  );
}

export { DataTable };
