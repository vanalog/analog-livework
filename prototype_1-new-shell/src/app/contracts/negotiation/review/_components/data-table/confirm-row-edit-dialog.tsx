"use client";

import React from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Pencil } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { CurrencyInput } from "@/components/core/form/currency-input";
import { DatePickerInput } from "@/components/core/form/date-picker-input";
import { toDisplayDate, toISODate } from "@/lib/formatters";
import { useUpdateExchange } from "../../_hooks/use-update-exchange";
import { GetAgreementResponse } from "@/types/api-types";
import { isAfter, isBefore } from "date-fns";
import { UTCDate } from "@date-fns/utc";

const baseSchema = z.object({
  payment_date: z.date({ error: "Payment date is required" }),
  amount: z.string({ error: "Payment amount is required" }),
});

type UpdateExchangeRequestFormData = z.infer<typeof baseSchema>;

interface ConfirmRowEditDialogProps {
  agreement: GetAgreementResponse;
  exchangeUUID: string;
  amount: number;
  paymentDate: string;
}

function ConfirmRowEditDialog(props: ConfirmRowEditDialogProps) {
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
  }, [props]);

  const { control, handleSubmit } = useForm<UpdateExchangeRequestFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: String(props.amount / 100),
      payment_date: new UTCDate(props.paymentDate),
    },
  });

  const { handleUpdateExchange, isPending } = useUpdateExchange(
    props.agreement?.uuid,
  );

  function onSubmit(data: UpdateExchangeRequestFormData) {
    handleUpdateExchange(props.exchangeUUID, {
      amount: parseInt(data.amount) * 100,
      payment_date: toISODate(data.payment_date),
    });
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Pencil className="w-4 h-4 text-muted-foreground cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit, console.log)}>
          <DialogHeader>
            <DialogTitle>Confirm Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to save these changes to this payment?
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Controller
              control={control}
              name="amount"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Amount</FieldLabel>
                  <CurrencyInput
                    value={field.value}
                    onChange={field.onChange}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {props.agreement.workflow.type === "revshare" && (
              <Controller
                control={control}
                name="payment_date"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Payment Date</FieldLabel>
                    <DatePickerInput
                      value={field.value}
                      onChange={field.onChange}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                Save changes
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { ConfirmRowEditDialog };
