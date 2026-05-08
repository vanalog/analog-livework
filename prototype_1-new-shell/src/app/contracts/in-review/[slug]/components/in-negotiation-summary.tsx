"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CONTRACT_GROUP_LABELS,
  CONTRACT_TYPE_LABELS,
  SPORT_LABELS,
  THREAD_STATUS_LABELS,
} from "@/lib/constants";
import { formatCentstoUSD, formatDateShort } from "@/lib/formatters";
import { ReadThreadResponse } from "@/types/api-types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AgreementDetail = NonNullable<ReadThreadResponse["agreement"] | any>;

function MetaField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="text-sm font-medium">{children}</div>
    </div>
  );
}

function CapPeriodAllocations({ agreement }: { agreement: AgreementDetail }) {
  const allocations = useMemo(() => {
    const map: Record<string, number> = {};
    for (const exchange of agreement.ExchangesWithLedgerObligations ?? []) {
      if (
        exchange.BudgetPlanUUID &&
        exchange.Obligation?.LedgerBalanceObligation?.Balance
      ) {
        const key = exchange.BudgetPlanUUID;
        map[key] =
          (map[key] ?? 0) + exchange.Obligation.LedgerBalanceObligation.Balance;
      }
    }
    return Object.entries(map).map(([planUUID, amount]) => {
      const plan = agreement.BudgetPlans?.[planUUID];
      return {
        planUUID,
        periodName: plan?.Period?.Name ?? "Unknown Period",
        categoryName: plan?.Category?.Name ?? "",
        amount,
      };
    });
  }, [agreement]);

  if (allocations.length === 0) return null;

  const total = allocations.reduce((sum, a) => sum + a.amount, 0);
  const sharedCategory = allocations.every(
    (a) => a.categoryName === allocations[0]!.categoryName,
  )
    ? allocations[0]!.categoryName
    : null;

  return (
    <>
      <Separator />
      <div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Cap Period Allocations
          </span>
          {sharedCategory && (
            <span className="text-xs text-muted-foreground">
              {sharedCategory}
            </span>
          )}
        </div>
        <div className="divide-y divide-border">
          {allocations.map((allocation) => (
            <div
              key={allocation.planUUID}
              className="flex items-center justify-between py-1.5"
            >
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-medium">
                  {allocation.periodName}
                </span>
                {!sharedCategory && allocation.categoryName && (
                  <span className="text-xs text-muted-foreground">
                    · {allocation.categoryName}
                  </span>
                )}
              </div>
              <span className="text-sm font-semibold tabular-nums">
                {formatCentstoUSD(allocation.amount)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-1.5 mt-0.5 border-t border-border">
          <span className="text-xs text-muted-foreground">
            Total Agreement Value
          </span>
          <span className="text-sm font-bold tabular-nums">
            {formatCentstoUSD(total)}
          </span>
        </div>
      </div>
    </>
  );
}

function InNegotiationSummary(props: ReadThreadResponse) {
  const athleteName =
    [props.student_athlete?.first_name, props.student_athlete?.last_name]
      .filter(Boolean)
      .join(" ") || "—";

  return (
    <Card className="px-6 py-4 space-y-3">
      <div className="grid grid-cols-3 gap-x-8 gap-y-3">
        <MetaField label="Athlete">{athleteName}</MetaField>

        <MetaField label="Sport">
          {props.student_athlete?.sport
            ? SPORT_LABELS[props.student_athlete.sport]
            : "—"}
        </MetaField>

        <MetaField label="Term">
          {props.start_date && props.end_date
            ? `${formatDateShort(props.start_date)} – ${formatDateShort(props.end_date)}`
            : "—"}
        </MetaField>

        {props.status && (
          <MetaField label="Status">
            {THREAD_STATUS_LABELS[props.status]}
          </MetaField>
        )}

        <MetaField label="Type">
          {props.contract_type ? (
            <Badge variant="outline" className="w-fit text-xs font-medium">
              {CONTRACT_TYPE_LABELS[props.contract_type]}
            </Badge>
          ) : (
            "—"
          )}
        </MetaField>

        {props.contract_group && (
          <MetaField label="Group">
            {CONTRACT_GROUP_LABELS[props.contract_group]}
          </MetaField>
        )}

        {!props.agreement && props.total_value && (
          <MetaField label="Total Agreement Value">
            {formatCentstoUSD(props.total_value)}
          </MetaField>
        )}
      </div>

      {props.agreement && <CapPeriodAllocations agreement={props.agreement} />}
    </Card>
  );
}

export { InNegotiationSummary };
