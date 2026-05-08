"use client";

import React from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { TableContentDragDrop } from "./table-content-drag-drop";
import { useNegotiationColumns } from "./columns";
import { ExpandedBudgetPlan, GetAgreementResponse } from "@/types/api-types";

type DataTableProps = {
  agreement: GetAgreementResponse;
  budgetPlans?: Record<string, ExpandedBudgetPlan>;
};

function DataTable(props: DataTableProps) {
  const [data, setData] = React.useState(
    props.agreement.scheduled_payments ?? [],
  );

  React.useEffect(() => {
    setData(props.agreement.scheduled_payments ?? []);
  }, [props.agreement.scheduled_payments]);

  const columns = useNegotiationColumns({
    agreement: props.agreement,
    budgetPlans: props.budgetPlans,
  });

  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.exchange_uuid,
  });

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap mb-3 px-1"></div>
      <TableContentDragDrop
        table={table}
        agreementUUID={props.agreement.uuid}
      />
    </>
  );
}

export { DataTable };
