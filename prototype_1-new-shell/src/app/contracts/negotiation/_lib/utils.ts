import { BudgetPlanAmounts } from "../_components/budget-impact-sidebar";

export function getTotalsByAsset(
  amountsByBudgetPlan: Record<string, BudgetPlanAmounts>,
) {
  if (!amountsByBudgetPlan) return [];

  const totalsByAsset = Object.values(amountsByBudgetPlan)
    .filter((x) => !!x.asset)
    .reduce<Record<string, number>>(
      (totals, curr) => ({
        ...totals,
        [curr.asset]: (totals[curr.asset] ?? 0) + parseFloat(curr.amount),
      }),
      {},
    );

  return Object.entries(totalsByAsset).map(([asset, amount]) => ({
    asset,
    amount,
  }));
}
