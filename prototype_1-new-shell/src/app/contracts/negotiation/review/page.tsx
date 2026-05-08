"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, CircleCheck } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Header } from "../_components/header";
import { DataTable } from "./_components/data-table";
import { ContractSummary } from "./_components/contract-summary";
import { Description } from "./_components/description";
import { ConfirmRowAddDialog } from "./_components/confirm-row-add-dialog";
import {
  BudgetImpactSidebar,
  BudgetPlanAmounts,
} from "../_components/budget-impact-sidebar";
import { useBudgetPlanSummaries } from "../_hooks/use-get-budget-plan-summaries";
import { useGetAgreement } from "../_hooks/use-get-agreement";
import { formatCentstoUSD, toAssetUnitAmount } from "@/lib/formatters";

export default function Review() {
  const params = useSearchParams();
  const agreementUUID = params.get("agreement_uuid");
  const beneficiaryPartyUUID = params.get("beneficiary_party_uuid");
  const router = useRouter();

  const {
    agreement,
    sourceParty,
    beneficiaryParty,
    budgetPlans = {},
  } = useGetAgreement(agreementUUID);

  const { startDate, endDate, budgetCategoryUuids, amountsByBudgetPlan } =
    useMemo(() => {
      const never = {
        startDate: undefined,
        endDate: undefined,
        budgetCategoryUuids: [],
        amountsByBudgetPlan: {},
      };

      if (!agreement) return never;
      if (agreement.scheduled_payments.length === 0) return never;

      const dates = agreement.scheduled_payments.map((x) => x.not_before);
      const budgetCategoryUuids = Array.from(
        new Set(
          agreement.scheduled_payments
            .filter((x) => x.budget_plan_uuid)
            .map((x) => budgetPlans[x.budget_plan_uuid!])
            .filter((bp) => bp)
            .map((bp) => bp!.budget_category_uuid!),
        ),
      );

      const amountsByBudgetPlan = Object.entries(
        agreement.scheduled_payments
          .filter((x) => x.budget_plan_uuid)
          .map((x) => ({
            key: `${x.budget_plan_uuid}::${x.ledger_balance.asset}`,
            budget_plan_uuid: x.budget_plan_uuid!,
            asset: x.ledger_balance.asset,
            amount: x.ledger_balance.balance,
          }))
          .reduce<
            Record<
              string,
              { budget_plan_uuid: string; asset: string; amount: number }
            >
          >(
            (sums, curr) => ({
              ...sums,
              [curr.key]: {
                ...(sums[curr.key] ?? {
                  budget_plan_uuid: curr.budget_plan_uuid,
                  asset: curr.asset,
                }),
                amount: (sums[curr.key]?.amount ?? 0) + curr.amount,
              },
            }),
            {},
          ),
      ).reduce<Record<string, BudgetPlanAmounts>>(
        (prev, [_, curr]) => ({
          ...prev,
          [curr.budget_plan_uuid]: prev[curr.budget_plan_uuid] ?? {
            amount: `${curr.amount}`,
            asset: curr.asset,
            unitAmount: `${toAssetUnitAmount(curr.asset, curr.amount)}`,
          },
        }),
        {},
      );

      return {
        startDate: dates[0],
        endDate: dates[dates.length - 1],
        budgetCategoryUuids,
        amountsByBudgetPlan,
      };
    }, [agreement, budgetPlans]);

  const { budgetPlanSummaries, budgetPlanSummariesLoading } =
    useBudgetPlanSummaries(startDate, endDate, budgetCategoryUuids);

  return (
    <div className="space-y-4">
      <div className="border-b px-6 pb-4">
        <Header step={2} />
      </div>
      <div className="flex flex-col">
        <div className="space-y-6">
          <div>
            <div className="mb-2">
              <h1 className="text-lg font-semibold text-foreground">
                Review Schedule
              </h1>
            </div>
            {agreement && <Description {...agreement} />}
            {agreement && <ContractSummary {...agreement} />}
          </div>
          <div className="flex gap-8">
            <Collapsible defaultOpen className="flex-1">
              <div className="flex flex-row w-full justify-between">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="group hover:bg-white pl-0">
                    <ChevronRight className="ml-auto group-data-[state=open]:rotate-90 text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-foreground">
                      Scheduled Payments
                    </h2>{" "}
                    <span className="text-xs text-muted-foreground">
                      ({agreement?.scheduled_payments.length})
                    </span>
                  </Button>
                </CollapsibleTrigger>
                {agreement?.workflow.type === "revshare" && (
                  <ConfirmRowAddDialog
                    sourceAgreementPartyUUID={sourceParty?.uuid}
                    beneficiaryAgreementPartyUUID={beneficiaryParty?.uuid}
                    budgetPlanSummaries={budgetPlanSummaries}
                    agreement={agreement}
                  />
                )}
              </div>
              <CollapsibleContent>
                {agreement?.scheduled_payments && (
                  <DataTable agreement={agreement} budgetPlans={budgetPlans} />
                )}
              </CollapsibleContent>
            </Collapsible>
            <BudgetImpactSidebar
              summaries={budgetPlanSummaries}
              loading={budgetPlanSummariesLoading}
              amountsByBudgetPlan={amountsByBudgetPlan}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center border-t p-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-emerald-50 text-emerald-700">
          <CircleCheck className="w-4 h-4" />
          <span>
            {agreement?.scheduled_payments.length} payments totaling{" "}
            {formatCentstoUSD(agreement?.total_scheduled_payments ?? 0)}
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <Button
            type="button"
            onClick={() =>
              router.push(
                `/contracts/negotiation/export?agreement_uuid=${agreementUUID}&beneficiary_party_uuid=${beneficiaryPartyUUID}`,
              )
            }
          >
            Continue to Export
          </Button>
        </div>
      </div>
    </div>
  );
}
