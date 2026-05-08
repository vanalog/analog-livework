import { CurrencyInput } from "@/components/core/form/currency-input";
import { fromAssetUnitAmount } from "@/lib/formatters";
import { BudgetPlanSummaryResponse } from "@/types/api-types";
import { useMemo } from "react";

export function AllocationInput(props: {
  summaries: BudgetPlanSummaryResponse[];
  loading: boolean;
  value: Record<
    string,
    {
      asset: string;
      amount: string;
      unitAmount: string;
    }
  >;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  onChange(...event: any[]): void;
  invalid: boolean;
}) {
  const amountsByBudgetPlan: typeof props.value = useMemo(() => {
    const summaries = props.summaries ?? {};
    const value = props.value ?? {};
    return summaries
      .map((summary) => summary.uuid!)
      .reduce<typeof value>(
        (prev, curr) => ({
          ...prev,
          [curr]: value[curr] ?? {
            amount: "",
            asset: "",
            unitAmount: "",
          },
        }),
        {},
      );
  }, [props]);
  return (
    <>
      {props.summaries.map((summary) => (
        <div
          key={summary.uuid}
          className="flex items-center justify-between px-4 py-3"
        >
          <div className="flex-1">
            <p className="text-sm font-medium">{summary.period?.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <CurrencyInput
              className="text-right"
              disabled={props.loading}
              value={props.value[summary.uuid!]?.unitAmount}
              onChange={(unitAmount) => {
                const amount = fromAssetUnitAmount(
                  summary.asset,
                  parseFloat(unitAmount ?? "0"),
                );
                const newValue = {
                  asset: summary.asset,
                  amount: amount.toString(),
                  unitAmount,
                };
                props.onChange({
                  ...amountsByBudgetPlan,
                  [summary.uuid!]: newValue,
                });
              }}
              invalid={props.invalid}
            />
          </div>
        </div>
      ))}
    </>
  );
}
