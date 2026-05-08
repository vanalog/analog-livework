import { Controller, useFormContext } from "react-hook-form";
import { FileText, Handshake } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { RequiredAsterisk } from "@/components/core/required-asterisk";
import { type CreateAgreementFormData } from "../_hooks/use-define-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetWorkflows } from "../_hooks/use-get-workflows";

const AGREEMENT_OPTIONS = {
  revshare: {
    icon: Handshake,
    title: "Revenue Share",
    description: "Scheduled payments from the Benefits Pool",
    disabled: false,
  },
  ioi: {
    icon: FileText,
    title: "NIL Indication Of Interest",
    description: "Non-binding estimate of NIL earnings",
    disabled: false,
  },
};

function AgreementType() {
  const { control, setValue } = useFormContext<CreateAgreementFormData>();
  const { workflows, isLoading } = useGetWorkflows();

  if (isLoading || !workflows?.data) {
    return <Skeleton className="w-full h-46" />;
  }

  return (
    <Controller
      control={control}
      name="workflow_uuid"
      render={({ field, fieldState }) => (
        <Field className="gap-1">
          <FieldLabel>
            Agreement Type <RequiredAsterisk />
          </FieldLabel>
          <ToggleGroup
            type="single"
            variant="outline"
            size="lg"
            spacing={4}
            className="flex w-full items-stretch"
            value={field.value ?? ""}
            onValueChange={(uuid) => {
              const workflow = workflows.data?.find((w) => w.uuid === uuid);
              setValue("workflow_uuid", uuid);
              setValue("workflow_type", workflow?.type);
              setValue(
                "payment_frequency",
                workflow?.type === "ioi" ? "yearly" : "monthly",
              );
            }}
          >
            {workflows.data?.map((workflow) => {
              if (!workflow?.uuid || !workflow?.type) {
                return null;
              }

              const option =
                AGREEMENT_OPTIONS[
                  workflow.type as keyof typeof AGREEMENT_OPTIONS
                ];

              if (!option) {
                return null;
              }

              return (
                <ToggleGroupItem
                  key={workflow.uuid}
                  value={workflow.uuid}
                  className="flex flex-col flex-1 items-center gap-3 p-4 rounded-lg border-2 border-border data-[state=on]:border-foreground data-[state=on]:bg-muted/50 h-auto whitespace-normal"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                    <option.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">{option.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </div>
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export { AgreementType };
