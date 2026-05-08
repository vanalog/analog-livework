"use client";

import { Controller, useFormContext } from "react-hook-form";
import { RequiredAsterisk } from "@/components/core/required-asterisk";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { type CreateAgreementFormData } from "../_hooks/use-define-form";
import { SelectInput } from "@/components/core/form/select-input";
import { useApi } from "@/lib/api";
import { useUser } from "@/hooks/use-user";

type BudgetCategoryProps = {
  workflowUUID: string;
};

function BudgetCategory(props: BudgetCategoryProps) {
  const { user } = useUser();
  const $api = useApi();
  const { control } = useFormContext<CreateAgreementFormData>();

  const { data: budgetCategories } = $api.useQuery(
    "get",
    "/v2/workspaces/{workspace_uuid}/workflows/{workflow_uuid}/budgets/categories",
    {
      params: {
        path: {
          workspace_uuid: user?.preferred_workspace?.uuid ?? "",
          workflow_uuid: props.workflowUUID,
        },
      },
    },
    {
      enabled: !!user?.preferred_workspace?.uuid && !!props.workflowUUID,
      placeholderData: { data: [] },
      select(listResponse) {
        return listResponse.data?.map((budgetCategory) => ({
          label: budgetCategory.name,
          value: budgetCategory.uuid,
        }));
      },
    },
  );

  return (
    <Controller
      control={control}
      name="budget_category_uuid"
      render={({ field, fieldState }) => (
        <Field className="gap-1" data-invalid={fieldState.invalid}>
          <FieldLabel>
            Cap Period Category <RequiredAsterisk />
          </FieldLabel>
          <SelectInput
            {...field}
            id={field.name}
            items={budgetCategories ?? []}
            placeholder="Select Category"
            invalid={fieldState.invalid}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export { BudgetCategory };
