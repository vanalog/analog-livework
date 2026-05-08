"use client";

import { useFormContext } from "react-hook-form";
import { RequiredAsterisk } from "@/components/core/required-asterisk";
import { Field, FieldLabel } from "@/components/ui/field";
import { type CreateAgreementFormData } from "../_hooks/use-define-form";
import { SelectInput } from "@/components/core/form/select-input";
import { useApi } from "@/lib/api";
import { useUser } from "@/hooks/use-user";
import { UTCDate } from "@date-fns/utc";
import { subDays } from "date-fns";

type IoIBudgetPeriodProps = {
  budgetCategoryUUID: string;
};

function IoIBudgetPeriod(props: IoIBudgetPeriodProps) {
  const { user } = useUser();
  const $api = useApi();
  const { setValue, watch } = useFormContext<CreateAgreementFormData>();

  const amountsByBudgetPlan = watch("amounts_by_budget_plan");
  const selectedUUID = Object.keys(amountsByBudgetPlan ?? {})[0];

  const { data: summaries } = $api.useQuery(
    "get",
    "/v2/workspaces/{workspace_uuid}/budgets/plans/summaries",
    {
      params: {
        path: { workspace_uuid: user?.preferred_workspace?.uuid ?? "" },
        query: {
          start: "2025-01-01",
          end: "2029-12-31",
          budget_category_uuid: [props.budgetCategoryUUID],
        },
      },
    },
    {
      enabled: !!props.budgetCategoryUUID && !!user?.preferred_workspace?.uuid,
      placeholderData: { data: [] },
      select(summaries) {
        return (summaries.data ?? []).flatMap((summary) =>
          summary.period?.name &&
          summary.uuid &&
          summary.asset &&
          summary.period.start_at &&
          summary.period.end_before
            ? [
                {
                  label: summary.period.name,
                  value: summary.uuid,
                  asset: summary.asset,
                  start_at: summary.period.start_at,
                  end_before: summary.period.end_before,
                },
              ]
            : [],
        );
      },
    },
  );

  return (
    <Field className="gap-1">
      <FieldLabel>
        Budget Year <RequiredAsterisk />
      </FieldLabel>
      <SelectInput
        value={selectedUUID}
        onChange={(uuid) => {
          const summary = summaries?.find((s) => s.value === uuid);
          setValue("amounts_by_budget_plan", {
            [uuid]: { asset: summary?.asset ?? "", amount: "", unitAmount: "" },
          });

          if (summary?.start_at) {
            setValue("start_date", new UTCDate(summary.start_at));
          }

          if (summary?.end_before) {
            setValue("end_date", subDays(new UTCDate(summary.end_before), 1));
          }
        }}
        id="ioi_budget_period"
        items={summaries ?? []}
        placeholder="Select Budget Year"
      />
    </Field>
  );
}

export { IoIBudgetPeriod };
