"use client";

import { useState } from "react";
import {
  flexRender,
  Row,
  Table as TableInterface,
} from "@tanstack/react-table";
import { DragDropProvider } from "@dnd-kit/react";
import { DragEndEvent } from "@dnd-kit/dom";
import { useSortable, isSortableOperation } from "@dnd-kit/react/sortable";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { ConfirmRowReorderDialog } from "./confirm-row-reorder-dialog";
import { ScheduledPaymentResponse } from "@/types/api-types";

function DraggableRow({ row }: { row: Row<ScheduledPaymentResponse> }) {
  const { ref, isDragging } = useSortable({
    id: row.original.exchange_uuid,
    index: row.index,
  });

  return (
    <TableRow ref={ref} style={{ opacity: isDragging ? 0.8 : 1 }}>
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          style={{
            width: cell.column.getSize(),
            maxWidth: cell.column.columnDef.maxSize ?? cell.column.getSize(),
          }}
          className="truncate py-4 text-sm font-medium text-foreground"
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

interface TableContentDragDropProps {
  agreementUUID: string | undefined;
  table: TableInterface<ScheduledPaymentResponse>;
}

function TableContentDragDrop(props: TableContentDragDropProps) {
  const [dndKey, setDndKey] = useState(0);
  const [pendingSwap, setPendingSwap] = useState<{
    sourceRow: ScheduledPaymentResponse;
    targetRow: ScheduledPaymentResponse;
  } | null>(null);

  function handleDragEnd(event: Parameters<DragEndEvent>[0]) {
    if (event.canceled || !isSortableOperation(event.operation)) {
      return;
    }

    const { source } = event.operation;
    if (!source) {
      return;
    }

    const rows = props.table.getRowModel().rows;
    const sourceRow = rows.find(
      (r) => r.original.exchange_uuid === source.id,
    )?.original;

    const targetRow = rows[source.index]?.original;
    if (!sourceRow || !targetRow) {
      return;
    }

    if (sourceRow.obligation_uuid === targetRow.obligation_uuid) {
      return;
    }

    setPendingSwap({ sourceRow, targetRow });
  }

  function resetSwap() {
    setPendingSwap(null);
    setDndKey((k) => k + 1);
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <DragDropProvider key={dndKey} onDragEnd={handleDragEnd}>
        <Table>
          <TableHeader>
            {props.table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/30">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-xs font-medium text-muted-foreground uppercase"
                    >
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
            {props.table.getRowModel().rows?.length ? (
              props.table
                .getRowModel()
                .rows.map((row) => <DraggableRow key={row.id} row={row} />)
            ) : (
              <TableRow>
                <TableCell
                  colSpan={props.table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            {props.table.getFooterGroups().map((footerGroup) => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <TableCell key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext(),
                        )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableFooter>
        </Table>
      </DragDropProvider>
      <ConfirmRowReorderDialog
        agreementUUID={props.agreementUUID}
        open={pendingSwap !== null}
        sourceRow={pendingSwap?.sourceRow}
        targetRow={pendingSwap?.targetRow}
        reset={resetSwap}
      />
    </div>
  );
}

export { TableContentDragDrop };
