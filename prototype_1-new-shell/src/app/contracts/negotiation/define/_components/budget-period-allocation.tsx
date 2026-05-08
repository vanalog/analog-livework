import { Controller, useFormContext } from "react-hook-form";
import { RequiredAsterisk } from "@/components/core/required-asterisk";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { type CreateAgreementFormData } from "../_hooks/use-define-form";
import { BudgetPlanSummaryResponse } from "@/types/api-types";
import { useMemo } from "react";
import { CompactFormattedAsset } from "../../_components/compact-formatted-asset";
import { AllocationInput } from "./allocation-input";
import { getTotalsByAsset } from "../../_lib/utils";

export function BudgetPlanAllocation(props: {
  summaries: BudgetPlanSummaryResponse[] | undefined;
  loading: boolean;
}) {
  const { control, watch } = useFormContext<CreateAgreementFormData>();
  const [amountsByBudgetPlan] = watch(["amounts_by_budget_plan"]);
  const totalsByAsset = useMemo(
    () => getTotalsByAsset(amountsByBudgetPlan),
    [amountsByBudgetPlan],
  );

  if (!props.loading && props.summaries === undefined) {
    return <></>;
  }

  return (
    <Controller
      control={control}
      name="amounts_by_budget_plan"
      render={({ field, fieldState }) => (
        <Field className="gap-1" data-invalid={fieldState.invalid}>
          <div className="flex items-center justify-between">
            <FieldLabel>
              Cap Period Allocation <RequiredAsterisk />
            </FieldLabel>
            {!!totalsByAsset.length && (
              <span className="text-sm text-muted-foreground">
                Total:{" "}
                <span className="font-semibold text-foreground">
                  {totalsByAsset.map((tba) => (
                    <CompactFormattedAsset
                      key={tba.asset}
                      asset={tba.asset}
                      amount={tba.amount}
                    />
                  ))}
                </span>
              </span>
            )}
          </div>
          <div className="rounded-lg border divide-y">
            <AllocationInput
              summaries={props.summaries ?? []}
              loading={props.loading}
              value={field.value ?? {}}
              onChange={field.onChange}
              invalid={fieldState.invalid}
            />
            <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
              <p className="text-sm font-medium">Total Agreement Value</p>
              <p className="text-sm font-bold">
                {totalsByAsset.map((tba) => (
                  <CompactFormattedAsset
                    key={tba.asset}
                    asset={tba.asset}
                    amount={tba.amount}
                  />
                ))}
              </p>
            </div>
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
