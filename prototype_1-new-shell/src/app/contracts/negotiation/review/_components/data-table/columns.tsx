"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { GripVertical } from "lucide-react";
import { ConfirmRowEditDialog } from "./confirm-row-edit-dialog";
import { ConfirmRowDeleteDialog } from "./confirm-row-delete-dialog";
import {
  ExpandedBudgetPlan,
  ScheduledPaymentResponse,
  GetAgreementResponse,
} from "@/types/api-types";
import {
  formatCentstoUSD,
  toDisplayDate,
  toDisplayDateShort,
} from "@/lib/formatters";

interface UseNegotiationColumnsParams {
  agreement: GetAgreementResponse;
  budgetPlans?: Record<string, ExpandedBudgetPlan>;
}

function useNegotiationColumns(params: UseNegotiationColumnsParams) {
  const columns = React.useMemo<ColumnDef<ScheduledPaymentResponse>[]>(
    () => [
      {
        id: "grip",
        size: 36,
        cell: () => (
          <GripVertical className="w-4 h-4 text-muted-foreground cursor-pointer" />
        ),
      },
      {
        accessorKey: "not_before",
        header: "Payment Date",
        footer: () => <div className="font-medium">Total</div>,
        cell: (props) => (
          <div className="font-medium">
            {toDisplayDate(props.row.getValue("not_before"))}
          </div>
        ),
      },
      {
        id: "period",
        header: "Period",
        accessorFn: (row) =>
          `${toDisplayDateShort(row.not_before)} - ${toDisplayDate(row.not_after)}`,
        cell: (props) => (
          <div className="text-muted-foreground">
            {props.row.getValue("period")}
          </div>
        ),
      },
      {
        id: "amount",
        header: "Amount",
        accessorFn: (row) => row.ledger_balance?.balance ?? 0,
        footer: () =>
          formatCentstoUSD(params.agreement.total_scheduled_payments),
        cell: (props) => (
          <div className="font-medium">
            {formatCentstoUSD(props.row.getValue("amount"))}
          </div>
        ),
      },
      {
        accessorKey: "budget_plan_uuid",
        accessorFn: (row) =>
          params.budgetPlans &&
          row.budget_plan_uuid &&
          params.budgetPlans[row.budget_plan_uuid!]?.period?.name,
        header: "Cap Period",
        cell: (props) => (
          <div className="text-muted-foreground">
            {props.row.getValue("budget_plan_uuid")}
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="flex justify-end mr-2">Actions</div>,
        cell: (props) => {
          return (
            <div className="flex flex-row gap-4 justify-end mr-2">
              <ConfirmRowEditDialog
                agreement={params.agreement}
                exchangeUUID={props.row.original.exchange_uuid}
                amount={props.row.original.ledger_balance?.balance}
                paymentDate={props.row.original.not_before}
              />
              {params.agreement.workflow.type === "revshare" && (
                <ConfirmRowDeleteDialog
                  agreementUUID={params.agreement.uuid}
                  exchangeUUID={props.row.original.exchange_uuid}
                  amount={props.row.original.ledger_balance?.balance ?? 0}
                  paymentDate={props.row.original.not_before}
                />
              )}
            </div>
          );
        },
      },
    ],
    [params],
  );

  return columns;
}

export { useNegotiationColumns };
