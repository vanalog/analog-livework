import { BudgetImpactItem } from "./budget-impact-item";
import { BudgetPlanSummaryResponse } from "@/types/api-types";
import { getTotalsByAsset } from "../_lib/utils";
import { useMemo } from "react";
import { CompactFormattedAsset } from "./compact-formatted-asset";

export interface BudgetPlanAmounts {
  asset: string;
  amount: string;
  unitAmount: string;
}

export function BudgetImpactSidebar(props: {
  summaries: BudgetPlanSummaryResponse[] | undefined;
  loading: boolean;
  amountsByBudgetPlan: Record<string, BudgetPlanAmounts>;
  amountsAreEstimated?: boolean;
}) {
  const totalsByAsset = useMemo(
    () => getTotalsByAsset(props.amountsByBudgetPlan),
    [props.amountsByBudgetPlan],
  );

  if (!props.loading && props.summaries === undefined) {
    return <></>;
  }

  return (
    <div className="hidden lg:block w-72 flex-shrink-0">
      <div className="sticky top-24"></div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Cap Period Impact
          </h3>
          <span className="text-xs text-muted-foreground">
            {totalsByAsset.map((tba) => (
              <CompactFormattedAsset
                key={tba.asset}
                asset={tba.asset}
                amount={tba.amount}
              />
            ))}
          </span>
        </div>
        <div className="space-y-3">
          {props.summaries?.map((summary) => {
            const abp = parseFloat(
              props.amountsByBudgetPlan[summary.uuid!]?.amount ?? "0",
            );
            const thisContractTotal = isNaN(abp) ? 0 : abp;
            const available =
              (summary.available ?? 0) -
              (props.amountsAreEstimated ? thisContractTotal : 0);
            return (
              <BudgetImpactItem
                key={summary.uuid}
                disabled={props.loading}
                periodName={summary.period?.name}
                asset={summary.asset}
                thisContractTotal={thisContractTotal}
                planned={summary.amount}
                allocated={summary.adjustment_total! + summary.exchange_total!}
                available={available}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
