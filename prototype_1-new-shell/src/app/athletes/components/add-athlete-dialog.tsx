import React from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { ComboboxInput } from "@/components/core/form/combobox-input";
import { SportCombobox } from "@/components/athletes/sport-combobox";
import { RequiredAsterisk } from "@/components/core/required-asterisk";
import { useApi } from "@/lib/api";
import type { Sport, StudentAthleteResponse } from "@/types/api-types";

import { useUniversities } from "@/lib/hooks/use-data";
import { AgentCombobox } from "@/components/agents/agent-combobox";

type AthleteFormData = z.infer<typeof athleteSchema>;

/**
 * University field with searchable combobox - fetches from database
 */
function UniversityFieldAdd({ control }: { control: ReturnType<typeof useForm<AthleteFormData>>["control"] }) {
  const { data: universities = [] } = useUniversities();
  
  const universityItems = universities.map((uni) => ({
    value: uni.id,
    label: uni.name,
  }));

  return (
    <Controller
      name="university_id"
      control={control}
      render={({ field, fieldState }) => (
        <Field
          className="gap-1"
          data-invalid={fieldState.invalid}
        >
          <FieldLabel htmlFor="university">
            University
          </FieldLabel>
          <ComboboxInput
            id="university"
            items={universityItems}
            placeholder="Search university..."
            value={field.value || ""}
            onChange={field.onChange}
          />
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
}

const currentYear = new Date().getFullYear();
const graduationYears = Array.from({ length: 11 }, (_, i) => currentYear + i);

const athleteSchema = z.object({
  edu_email: z
    .union([z.email("Please enter a valid email address"), z.literal("")])
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  secondary_email: z
    .union([z.email("Please enter a valid email address"), z.literal("")])
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  sport: z.string().min(1, "Please select a sport"),
  graduation_year: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  university_id: z.string().optional(),
  agent_id: z.string().optional(),
});

function AddAthleteDialog() {
  const $api = useApi();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);

  const router = useRouter();

  const { handleSubmit, reset, control, watch } =
    useForm<AthleteFormData>({
      resolver: zodResolver(athleteSchema),
      defaultValues: {
        edu_email: undefined,
        secondary_email: undefined,
        first_name: "",
        last_name: "",
        sport: undefined,
        graduation_year: "",
        university_id: "",
        agent_id: "",
      },
    });
  const [requestOnboarding, setRequestOnboarding] = React.useState(false);
  const eduEmail = watch("edu_email");

  React.useEffect(() => {
    if (!eduEmail) setRequestOnboarding(false);
  }, [eduEmail]);

  const inviteMutation = $api.useMutation(
    "post",
    "/v1/student_athletes/{student_athlete_uuid}/invite",
  );

  const createAthleteMutation = $api.useMutation(
    "post",
    "/v1/student_athletes",
    {
      onSuccess: async (response) => {
        const data = response as StudentAthleteResponse;
        // Invalidate and refetch to get the real server data
        queryClient.invalidateQueries({
          queryKey: ["get", "/v1/student_athletes"],
        });

        const fullName = [data.first_name, data.last_name]
          .map((s) => s?.trim())
          .filter((s) => s && s.length > 0)
          .join(" ");

        toast.success(`${fullName} has been added!`, {
          action: {
            label: "View",
            onClick() {
              router.push(`/athletes/${data.uuid}`);
            },
          },
        });

        if (requestOnboarding && data.uuid) {
          try {
            await inviteMutation.mutateAsync({
              params: { path: { student_athlete_uuid: data.uuid } },
            });
            toast.success("Onboarding invite sent.");
          } catch {
            toast.error(
              "Athlete created but the onboarding invite failed to send. You can retry from their profile.",
            );
          }
        }

        reset();
        setOpen(false);
        setRequestOnboarding(false);
      },
      onError: (error: unknown) => {
        // TODO: Update error to use ProblemDetails once implemented
        toast.error(
          `There was an error adding the athlete: ${typeof error === "string" ? "Email already exists" : "Please try again."}`,
        );
      },
    },
  );

  const isPending =
    createAthleteMutation.isPending ||
    inviteMutation.isPending;

  function onSubmit(data: AthleteFormData) {
    if (isPending) {
      return;
    }

    const result = athleteSchema.safeParse(data);
    if (!result.success) {
      return;
    }

    createAthleteMutation.mutate({
      body: { ...result.data, sport: result.data.sport as Sport },
    });
  }

  function handleDialogChange(isOpen: boolean) {
    setOpen(isOpen);

    if (!isOpen) {
      reset();
      setRequestOnboarding(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-50/50 hover:text-blue-700 hover:border-blue-300 shadow-sm" data-icon="inline-start">
          <Plus className="h-4 w-4" />
          Add Athlete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:w-full sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Athlete</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldSet>
            <FieldGroup>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col flex-1 gap-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Athlete Information
                  </h3>
                  <div className="flex gap-4">
                    <Controller
                      name="first_name"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field
                          className="gap-1"
                          data-invalid={fieldState.invalid}
                        >
                          <FieldLabel htmlFor="firstName">
                            First Name
                            <RequiredAsterisk />
                          </FieldLabel>
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="Enter first name"
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
                    <Controller
                      name="last_name"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field
                          className="gap-1"
                          data-invalid={fieldState.invalid}
                        >
                          <FieldLabel htmlFor="lastName">
                            Last Name
                            <RequiredAsterisk />
                          </FieldLabel>
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Enter last name"
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
                  </div>
                  <div className="flex gap-4">
                    <Controller
                      name="secondary_email"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field
                          className="gap-1"
                          data-invalid={fieldState.invalid}
                        >
                          <FieldLabel htmlFor="secondary_email">
                            Email
                          </FieldLabel>
                          <Input
                            id="secondary_email"
                            type="email"
                            placeholder="athlete@example.com"
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="edu_email"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field
                          className="gap-1"
                          data-invalid={fieldState.invalid}
                        >
                          <FieldLabel htmlFor="edu_email">
                            University Email
                          </FieldLabel>
                          <Input
                            id="edu_email"
                            type="email"
                            placeholder="student@university.edu"
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Controller
                      name="sport"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field
                          className="gap-1"
                          data-invalid={fieldState.invalid}
                        >
                          <FieldLabel htmlFor="sport">
                            Sport
                            <RequiredAsterisk />
                          </FieldLabel>
                          <SportCombobox
                            id="sport"
                            value={field.value}
                            onChange={field.onChange}
                            invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <UniversityFieldAdd control={control} />
                  </div>
                  <div className="flex gap-4">
                    <Controller
                      name="agent_id"
                      control={control}
                      render={({ field }) => (
                        <Field className="flex-1 gap-1">
                          <FieldLabel htmlFor="agent">Agent</FieldLabel>
                          <AgentCombobox
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="Select agent..."
                          />
                        </Field>
                      )}
                    />
                    <div className="flex-1" />
                  </div>
                  <Controller
                    name="graduation_year"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field
                        className="hidden w-fit gap-1"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldLabel htmlFor="graduation_year">
                          Graduating Year (Optional)
                        </FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger
                            id="graduation_year"
                            aria-invalid={fieldState.invalid}
                          >
                            <SelectValue placeholder="Select graduating class" />
                          </SelectTrigger>
                          <SelectContent>
                            {graduationYears.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild onClick={() => reset()}>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Athlete"
                  )}
                </Button>
              </DialogFooter>
            </FieldGroup>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { AddAthleteDialog };
