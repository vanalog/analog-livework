"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";

import { Header } from "../_components/header";
import { AgreementType } from "./_components/agreement-type";
import { Parties } from "./_components/parties";
import { BudgetCategory } from "./_components/budget-category";
import { IoIBudgetPeriod } from "./_components/ioi-budget-period";
import { AgreementDates } from "./_components/agreement-dates";
import { BudgetPlanAllocation } from "./_components/budget-period-allocation";
import { BudgetImpactSidebar } from "../_components/budget-impact-sidebar";

import { useCreateAgreement } from "./_hooks/use-create-agreement";
import { useGetStudentAthlete } from "./_hooks/use-get-student-athlete";
import { useBudgetPlanSummaries } from "../_hooks/use-get-budget-plan-summaries";
import { useAmountsByBudgetPlan } from "../_hooks/use-amounts-by-budget-plan";
import {
  useDefineForm,
  CreateAgreementFormData,
} from "./_hooks/use-define-form";
import {
  CreateAgreementRequest,
  CreateAgreementResponse,
} from "@/types/api-types";
import { toISODate } from "@/lib/formatters";

export default function Define() {
  const router = useRouter();
  const params = useSearchParams();
  const { handleCreateAgreement, isPending } = useCreateAgreement();

  const beneficiaryPartyUUID = params.get("beneficiary_party_uuid");
  const { athlete, isLoading } = useGetStudentAthlete(beneficiaryPartyUUID);
  const { methods } = useDefineForm(athlete);

  const [
    startDate,
    endDate,
    budgetCategoryUUID,
    amountsByBudgetPlan,
    workflowUUID,
    workflowType,
  ] = methods.watch([
    "start_date",
    "end_date",
    "budget_category_uuid",
    "amounts_by_budget_plan",
    "workflow_uuid",
    "workflow_type",
    "payment_frequency",
  ]);

  const { budgetPlanSummaries, budgetPlanSummariesLoading } =
    useBudgetPlanSummaries(startDate, endDate, [budgetCategoryUUID]);

  useAmountsByBudgetPlan(
    budgetPlanSummariesLoading,
    amountsByBudgetPlan,
    budgetPlanSummaries,
    (values) => methods.setValue("amounts_by_budget_plan", values),
  );

  function onSuccess(data: CreateAgreementResponse) {
    router.replace(
      `/contracts/negotiation/generate?agreement_uuid=${data.agreement_uuid}&beneficiary_party_uuid=${beneficiaryPartyUUID}`,
    );
  }

  function onSubmit(data: CreateAgreementFormData) {
    const amountsByBudgetPlanUuid = Object.fromEntries(
      Object.entries(data.amounts_by_budget_plan).map(([k, v]) => [
        k,
        parseInt(v.amount, 10),
      ]),
    );

    const body: CreateAgreementRequest = {
      beneficiary_party_name: data.beneficiary_party_name,
      source_party_name: data.source_party_name,
      payment_frequency: data.payment_frequency,
      name: data.name,
      start_date: toISODate(data.start_date),
      end_date: toISODate(data.end_date),
      amounts_by_budget_plan_uuid: amountsByBudgetPlanUuid,
      workflow_uuid: data.workflow_uuid,
    };

    handleCreateAgreement(body, onSuccess);
  }

  if (isLoading) {
    <></>;
  }

  return (
    <>
      <div className="border-b px-6 pb-4">
        <Header step={0} />
      </div>
      <FormProvider {...methods}>
        <div className="flex-1 flex justify-center py-8 px-4 gap-8">
          <div className="w-full max-w-xl space-y-6">
            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-foreground">
                Build Agreement Schedule
              </h1>
              <p className="text-sm text-muted-foreground">
                Define the agreement parameters to generate a payment schedule
              </p>
            </div>
            <form
              className="space-y-6"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <FieldGroup>
                <AgreementType />
                <Parties />
                {workflowUUID && <BudgetCategory workflowUUID={workflowUUID} />}
                {workflowType === "ioi" && budgetCategoryUUID && (
                  <IoIBudgetPeriod budgetCategoryUUID={budgetCategoryUUID} />
                )}
                {workflowType === "revshare" && budgetCategoryUUID && (
                  <AgreementDates />
                )}
                <BudgetPlanAllocation
                  summaries={budgetPlanSummaries}
                  loading={budgetPlanSummariesLoading}
                />
                <div className="flex justify-between pt-4 border-t">
                  <Button variant="ghost">Cancel</Button>
                  <Button type="submit" disabled={isPending}>
                    Generate Schedule
                  </Button>
                </div>
              </FieldGroup>
            </form>
          </div>
          <BudgetImpactSidebar
            summaries={budgetPlanSummaries}
            loading={budgetPlanSummariesLoading}
            amountsByBudgetPlan={amountsByBudgetPlan ?? {}}
            amountsAreEstimated
          />
        </div>
      </FormProvider>
    </>
  );
}
