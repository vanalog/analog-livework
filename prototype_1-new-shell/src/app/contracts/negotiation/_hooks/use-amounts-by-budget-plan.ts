import { useEffect } from "react";
import { BudgetPlanAmounts } from "../_components/budget-impact-sidebar";
import { BudgetPlanSummaryResponse } from "@/types/api-types";

export function useAmountsByBudgetPlan(
  budgetPlanSummariesLoading: boolean,
  amountsByBudgetPlan: Record<string, BudgetPlanAmounts>,
  budgetPlanSummaries: BudgetPlanSummaryResponse[] | undefined,
  onAmountsChange?: (values: Record<string, BudgetPlanAmounts>) => void,
) {
  useEffect(() => {
    if (budgetPlanSummariesLoading) return;
    if (!amountsByBudgetPlan) return;

    const availableBudgetPlans = new Set(
      budgetPlanSummaries?.map((bps) => bps.uuid!),
    );
    const filteredAmountsByBudgetPlans = Object.fromEntries(
      Object.entries(amountsByBudgetPlan).filter(([bp]) =>
        availableBudgetPlans.has(bp),
      ),
    );
    if (onAmountsChange) {
      onAmountsChange(filteredAmountsByBudgetPlans);
    }
  }, [budgetPlanSummaries, budgetPlanSummariesLoading]);
}
