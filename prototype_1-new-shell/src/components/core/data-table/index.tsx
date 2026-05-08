"use client";

// TODO: Deprecate this component in favor of a more modular approach

import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { FilterableColumn, FilterColumnProps } from "./filterable-column";
import { SearchableColumn } from "./searchable-column";
import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  filterableColumn?: FilterColumnProps;
  searchableColumn?: string;
  onRowClick?: (row: TData) => void;
  createAction?: React.ReactNode;
  displayBorder?: boolean;
}

function DataTable<TData, TValue>({
  columns,
  data,
  searchableColumn,
  filterableColumn,
  onRowClick,
  loading = false,
  createAction,
  displayBorder = false,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 0,
      },
    },
    state: {
      columnFilters,
    },
  });

  return (
    <div className="space-y-4">
      {(searchableColumn || filterableColumn || createAction) && (
        <div className="flex gap-4 justify-between">
          <div className="flex gap-4">
            {searchableColumn && (
              <SearchableColumn
                searchableColumn={searchableColumn}
                loading={loading}
                table={table}
              />
            )}
            {filterableColumn && (
              <FilterableColumn
                filterableColumn={filterableColumn}
                loading={loading}
                table={table}
              />
            )}
          </div>
          {createAction && createAction}
        </div>
      )}
      <div className={cn(displayBorder && "border rounded-md")}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }, (_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {columns.map((_, cellIndex) => (
                    <TableCell
                      key={`skeleton-cell-${cellIndex}`}
                      className="p-4"
                    >
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(onRowClick && "cursor-pointer hover:bg-muted")}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-4 font-medium">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!loading && table.getPageCount() > 0 && (
        <DataTablePagination table={table} />
      )}
    </div>
  );
}

export { DataTable };
