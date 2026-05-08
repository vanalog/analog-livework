import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { DatePickerInput } from "@/components/core/form/date-picker-input";
import { CurrencyInput } from "@/components/core/form/currency-input";
import { RequiredAsterisk } from "@/components/core/required-asterisk";
import {
  BudgetPlanSummaryResponse,
  CreateExchangeRequest,
  GetAgreementResponse,
} from "@/types/api-types";
import { toDisplayDate, toISODate } from "@/lib/formatters";
import { isAfter, isBefore } from "date-fns";
import { useAddExchange } from "../_hooks/use-add-exchange";

const baseSchema = z.object({
  payment_date: z.date({ error: "Payment date is required" }),
  amount: z.string({ error: "Payment amount is required" }),
});

type CreateExchangeRequestFormData = z.infer<typeof baseSchema>;

type ConfirmRowAddDialogProps = {
  sourceAgreementPartyUUID: string | undefined;
  beneficiaryAgreementPartyUUID: string | undefined;
  budgetPlanSummaries?: BudgetPlanSummaryResponse[];
  agreement: GetAgreementResponse | undefined;
};

function ConfirmRowAddDialog(props: ConfirmRowAddDialogProps) {
  const { handleAddExchange } = useAddExchange(props.agreement?.uuid);

  const [open, setOpen] = React.useState(false);

  const schema = React.useMemo(() => {
    return baseSchema.superRefine((data, ctx) => {
      if (
        props.agreement?.effective_at &&
        isBefore(data.payment_date, props.agreement.effective_at)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["payment_date"],
          message: `Payment date must be on or after ${toDisplayDate(props.agreement.effective_at)}`,
        });
      }

      if (
        props.agreement?.expired_after &&
        isAfter(data.payment_date, props.agreement.expired_after)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["payment_date"],
          message: `Payment date must be on or before ${toDisplayDate(props.agreement.expired_after)}`,
        });
      }
    });
  }, [props.agreement?.effective_at, props.agreement?.expired_after]);

  const { control, handleSubmit, reset, watch } =
    useForm<CreateExchangeRequestFormData>({
      resolver: zodResolver(schema),
    });

  const paymentDate = watch("payment_date");

  const matchingPlan = React.useMemo(() => {
    if (!paymentDate || !props.budgetPlanSummaries?.length) {
      return undefined;
    }

    return props.budgetPlanSummaries.find((plan) => {
      const startAt = plan.period?.start_at;
      const endBefore = plan.period?.end_before;

      if (!startAt || !endBefore) {
        return false;
      }

      return (
        paymentDate >= new Date(startAt) && paymentDate < new Date(endBefore)
      );
    });
  }, [paymentDate, props.budgetPlanSummaries]);

  const hasPlans = Boolean(props.budgetPlanSummaries?.length);
  const dateIsOutOfRange = hasPlans && paymentDate != null && !matchingPlan;

  function onOpenChange(open: boolean) {
    setOpen(open);

    if (!open) {
      reset();
    }
  }

  function onSubmit(data: CreateExchangeRequestFormData) {
    if (
      props.sourceAgreementPartyUUID == null ||
      props.beneficiaryAgreementPartyUUID == null
    ) {
      toast.error("Missing agreement party information");
      return;
    }

    if (dateIsOutOfRange) return;

    const body: CreateExchangeRequest = {
      amount: parseFloat(data.amount) * 100,
      payment_date: toISODate(data.payment_date),
      not_before: toISODate(data.payment_date),
      source_agreement_party_uuid: props.sourceAgreementPartyUUID,
      beneficiary_agreement_party_uuid: props.beneficiaryAgreementPartyUUID,
      budget_plan_uuid: matchingPlan?.uuid,
    };

    handleAddExchange(body, () => {
      setOpen(false);
      reset();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="xs">
          <Plus />
          Add Scheduled Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Scheduled Payment</DialogTitle>
          <DialogDescription>
            Add a new scheduled payment to this contract
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4 mb-4">
            <Controller
              control={control}
              name="payment_date"
              render={({ field, fieldState }) => (
                <Field
                  className="gap-1"
                  data-invalid={fieldState.invalid || dateIsOutOfRange}
                >
                  <FieldLabel>
                    Payment Date <RequiredAsterisk />
                  </FieldLabel>
                  <DatePickerInput
                    value={field.value}
                    onChange={field.onChange}
                    invalid={fieldState.invalid || dateIsOutOfRange}
                    aria-invalid={fieldState.invalid || dateIsOutOfRange}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  {!fieldState.invalid && dateIsOutOfRange && (
                    <FieldError
                      errors={[
                        {
                          message:
                            "Payment date must fall within a budget plan period",
                        },
                      ]}
                    />
                  )}
                  {!fieldState.invalid && matchingPlan?.period?.name && (
                    <div className="px-3 py-2 rounded-md border bg-muted/30 mt-2">
                      <p className="text-xs text-muted-foreground">
                        Cap Period
                      </p>
                      <p className="text-sm font-medium">
                        {matchingPlan.period.name}
                      </p>
                    </div>
                  )}
                </Field>
              )}
            />
            <Controller
              control={control}
              name="amount"
              render={({ field, fieldState }) => (
                <Field className="gap-1" data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Amount <RequiredAsterisk />
                  </FieldLabel>
                  <CurrencyInput
                    value={field.value}
                    onChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add Payment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { ConfirmRowAddDialog };
