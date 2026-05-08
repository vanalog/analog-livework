import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { RequiredAsterisk } from "@/components/core/required-asterisk";
import { CreateAgreementFormData } from "../_hooks/use-define-form";

function Parties() {
  const { control } = useFormContext<CreateAgreementFormData>();

  return (
    <Controller
      control={control}
      name="beneficiary_party_name"
      render={({ field, fieldState }) => (
        <Field className="gap-1" data-invalid={fieldState.invalid}>
          <FieldLabel className="text-sm font-medium">
            Athlete <RequiredAsterisk />
          </FieldLabel>
          <Input
            {...field}
            id={field.name}
            aria-invalid={fieldState.invalid}
            className="mb-1"
          />
          <FieldDescription className="text-xs text-muted-foreground">
            Update to match the signing party, such as the athlete&apos;s legal
            name or LLC.
          </FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export { Parties };
