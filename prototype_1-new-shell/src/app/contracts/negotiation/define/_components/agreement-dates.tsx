"use client";

import { Controller, useFormContext } from "react-hook-form";
import { DatePickerInput } from "@/components/core/form/date-picker-input";
import { RequiredAsterisk } from "@/components/core/required-asterisk";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { type CreateAgreementFormData } from "../_hooks/use-define-form";

function AgreementDates() {
  const { control } = useFormContext<CreateAgreementFormData>();

  return (
    <div className="flex gap-4 space-y-2">
      <div className="w-full">
        <Controller
          control={control}
          name="start_date"
          render={({ field, fieldState }) => (
            <Field className="gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel>
                Start Date <RequiredAsterisk />
              </FieldLabel>
              <DatePickerInput
                {...field}
                id={field.name}
                invalid={fieldState.invalid}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <div className="w-full">
        <Controller
          control={control}
          name="end_date"
          render={({ field, fieldState }) => (
            <Field className="gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel>
                End Date <RequiredAsterisk />
              </FieldLabel>
              <DatePickerInput
                {...field}
                id={field.name}
                invalid={fieldState.invalid}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </div>
  );
}

export { AgreementDates };
