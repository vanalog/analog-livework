import { useUser } from "@/hooks/use-user";
import { useApi } from "@/lib/api";
import { toISODate } from "@/lib/formatters";

// TODO: refine to only accept Date | undefined
export function useBudgetPlanSummaries(
  startDate: Date | string | undefined,
  endDate: Date | string | undefined,
  budgetCategoryUUIDs: string[],
) {
  const $api = useApi();
  const { user } = useUser();

  const { data, isLoading } = $api.useQuery(
    "get",
    "/v2/workspaces/{workspace_uuid}/budgets/plans/summaries",
    {
      params: {
        path: { workspace_uuid: user?.preferred_workspace?.uuid ?? "" },
        query: {
          start: (startDate && toISODate(startDate)) ?? "",
          end: (endDate && toISODate(endDate)) ?? "",
          budget_category_uuid: budgetCategoryUUIDs,
        },
      },
    },
    {
      enabled: !!startDate && !!endDate && budgetCategoryUUIDs.length > 0,
    },
  );

  return {
    budgetPlanSummaries: data?.data,
    budgetPlanSummariesLoading: isLoading,
  };
}
