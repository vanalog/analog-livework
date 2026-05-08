import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUser } from "@/hooks/use-user";
import { StudentAthleteResponse } from "@/types/api-types";

const schema = z
  .object({
    name: z.string().min(1),
    source_party_name: z.string(),
    beneficiary_party_name: z.string().min(1, { error: "Name is required" }),
    start_date: z.date({ error: "Start date is required" }),
    end_date: z.date({ error: "End date is required" }),
    payment_frequency: z.enum([
      "weekly",
      "biweekly",
      "monthly",
      "quarterly",
      "yearly",
    ]),
    budget_category_uuid: z.uuid({ error: "Cap period category is required" }),
    workflow_uuid: z.uuid(),
    workflow_type: z.string().optional(),
    amounts_by_budget_plan: z.record(
      z.uuid(),
      z.object({
        asset: z.string({ error: "asset required" }),
        amount: z.string(),
        unitAmount: z.string(),
      }),
      { error: "Cap period allocation is required" },
    ),
  })
  .refine((data) => data.end_date > data.start_date, {
    error: "End date must be after start date",
    path: ["end_date"],
  });

export type CreateAgreementFormData = z.infer<typeof schema>;

export function useDefineForm(athlete: StudentAthleteResponse | undefined) {
  const { user } = useUser();

  const methods = useForm<CreateAgreementFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      payment_frequency: undefined,
      beneficiary_party_name: "",
      source_party_name: user?.preferred_workspace?.name,
    },
  });

  const workflowUUID = methods.watch("workflow_uuid");

  React.useEffect(() => {
    methods.reset({
      beneficiary_party_name: `${athlete?.first_name} ${athlete?.last_name}`,
      source_party_name: user?.preferred_workspace?.name,
      name: `${athlete?.first_name} ${athlete?.last_name} - ${user?.preferred_workspace?.name} NIL License Agreement`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.preferred_workspace, athlete]);

  React.useEffect(() => {
    methods.resetField("budget_category_uuid");
  }, [workflowUUID]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    methods,
  };
}
