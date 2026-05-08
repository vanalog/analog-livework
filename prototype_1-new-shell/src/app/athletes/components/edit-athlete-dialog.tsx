import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Pencil, Loader2 } from "lucide-react";
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
import { useApi } from "@/lib/api";
import type { Sport, StudentAthleteResponse } from "@/types/api-types";

import { ComboboxInput } from "@/components/core/form/combobox-input";
import { SportCombobox } from "@/components/athletes/sport-combobox";
import { RequiredAsterisk } from "@/components/core/required-asterisk";

import { useUniversities } from "@/lib/hooks/use-data";
import { AgentCombobox } from "@/components/agents/agent-combobox";

/**
 * Formats a phone number as user types (US format)
 */
function formatPhoneInput(value: string): string {
  // Remove all non-digits
  const digits = value.replace(/\D/g, "");

  // Limit to 10 digits
  const limited = digits.slice(0, 10);

  // Format based on length
  if (limited.length === 0) return "";
  if (limited.length <= 3) return `(${limited}`;
  if (limited.length <= 6) return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
  return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
}

/**
 * University field with searchable combobox - fetches from database
 */
function UniversityField({
  control,
}: {
  control: ReturnType<typeof useForm<AthleteFormData>>["control"];
}) {
  const { data: universities = [] } = useUniversities();

  const universityItems = universities.map((uni) => ({
    value: uni.id,
    label: uni.name,
  }));

  return (
    <Field className="flex-1 gap-1">
      <FieldLabel htmlFor="university">University</FieldLabel>
      <Controller
        name="university_id"
        control={control}
        render={({ field }) => (
          <ComboboxInput
            id="university"
            items={universityItems}
            placeholder="Search university..."
            value={field.value || ""}
            onChange={field.onChange}
          />
        )}
      />
    </Field>
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
  graduation_year: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  phone_number: z.string().optional(),
  sport: z.string().min(1, "Please select a sport"),
  university_id: z.string().optional(),
  agent_id: z.string().optional(),
});

export type AthleteFormData = z.infer<typeof athleteSchema>;

interface EditAthleteDialogProps {
  athlete: StudentAthleteResponse;
}

function getDefaultValues(athlete: StudentAthleteResponse): AthleteFormData {
  const extendedAthlete = athlete as StudentAthleteResponse & {
    agent_id?: string;
    university_id?: string;
  };
  return {
    edu_email: athlete.edu_email || "",
    secondary_email: athlete.secondary_email || "",
    first_name: athlete.first_name || "",
    last_name: athlete.last_name || "",
    graduation_year: athlete.graduation_year || "",
    sport: (athlete.sport as string) || "",
    phone_number: athlete.preferred_phone?.phone_number || "",
    university_id: extendedAthlete.university_id || "",
    agent_id: extendedAthlete.agent_id || "",
  };
}

function EditAthleteDialog({ athlete }: EditAthleteDialogProps) {
  const $api = useApi();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<AthleteFormData>({
    resolver: zodResolver(athleteSchema),
    defaultValues: getDefaultValues(athlete),
  });

  const mutation = $api.useMutation(
    "patch",
    "/v1/student_athletes/{student_athlete_uuid}",
    {
      onSuccess: (response) => {
        const data = response as StudentAthleteResponse;
        // Invalidate and refetch to get the real server data
        queryClient.invalidateQueries({
          queryKey: ["get", "/v1/student_athletes/{student_athlete_uuid}"],
        });
        queryClient.invalidateQueries({
          queryKey: ["get", "/v1/student_athletes"],
        });

        const fullName = [data.first_name, data.last_name]
          .map((s) => s?.trim())
          .filter((s) => s && s.length > 0)
          .join(" ");

        toast.success(`${fullName} has been updated!`);

        setOpen(false);
      },
      onError: (error: unknown) => {
        toast.error(
          `There was an error updating the athlete: ${typeof error === "string" ? error : "Please try again."}`,
        );
      },
    },
  );

  function onSubmit(data: AthleteFormData) {
    if (mutation.isPending || !athlete.uuid) {
      return;
    }

    mutation.mutate({
      params: { path: { student_athlete_uuid: athlete.uuid } },
      body: { ...data, sport: data.sport as Sport },
    });
  }

  function handleDialogChange(isOpen: boolean) {
    setOpen(isOpen);

    if (isOpen) {
      reset(getDefaultValues(athlete));
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:w-full sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Athlete</DialogTitle>
        </DialogHeader>
        <form id="edit-athlete-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldSet>
            <FieldGroup>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col flex-1 gap-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Athlete Information
                  </h3>
                  <div className="flex gap-4">
                    <Field className="gap-1">
                      <FieldLabel htmlFor="firstName">
                        First Name
                        <RequiredAsterisk />
                      </FieldLabel>
                      <Controller
                        name="first_name"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="Enter first name"
                            value={field.value || ""}
                            onChange={field.onChange}
                            aria-invalid={errors.first_name ? "true" : "false"}
                          />
                        )}
                      />
                      {errors.first_name && (
                        <FieldError>{errors.first_name.message}</FieldError>
                      )}
                    </Field>
                    <Field className="gap-1">
                      <FieldLabel htmlFor="lastName">
                        Last Name
                        <RequiredAsterisk />
                      </FieldLabel>
                      <Controller
                        name="last_name"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Enter last name"
                            value={field.value || ""}
                            onChange={field.onChange}
                            aria-invalid={errors.last_name ? "true" : "false"}
                          />
                        )}
                      />
                      {errors.last_name && (
                        <FieldError>{errors.last_name.message}</FieldError>
                      )}
                    </Field>
                  </div>
                  <div className="flex gap-4">
                    <Field className="gap-1">
                      <FieldLabel htmlFor="secondary_email">Email</FieldLabel>
                      <Controller
                        name="secondary_email"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="secondary_email"
                            type="email"
                            placeholder="Enter personal email"
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            aria-invalid={
                              errors.secondary_email ? "true" : "false"
                            }
                          />
                        )}
                      />
                      {errors.secondary_email && (
                        <FieldError>
                          {errors.secondary_email.message}
                        </FieldError>
                      )}
                    </Field>
                    <Field className="gap-1">
                      <FieldLabel htmlFor="edu_email">
                        University Email
                      </FieldLabel>
                      <Controller
                        name="edu_email"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="edu_email"
                            type="email"
                            placeholder="Enter university email"
                            value={field.value || ""}
                            onChange={field.onChange}
                            aria-invalid={errors.edu_email ? "true" : "false"}
                          />
                        )}
                      />
                      {errors.edu_email && (
                        <FieldError>{errors.edu_email.message}</FieldError>
                      )}
                    </Field>
                  </div>
                  <div className="flex gap-4">
                    <Field className="flex-1 gap-1">
                      <FieldLabel htmlFor="sport">
                        Sport <RequiredAsterisk />
                      </FieldLabel>
                      <Controller
                        name="sport"
                        control={control}
                        render={({ field }) => (
                          <SportCombobox
                            id="sport"
                            value={field.value}
                            onChange={field.onChange}
                            invalid={errors.sport ? true : undefined}
                          />
                        )}
                      />
                      {errors.sport && (
                        <FieldError>{errors.sport.message}</FieldError>
                      )}
                    </Field>
                    <UniversityField control={control} />
                  </div>
                  <div className="flex gap-4">
                    <Field className="flex-1 gap-1">
                      <FieldLabel htmlFor="phone_number">
                        Phone Number
                      </FieldLabel>
                      <Controller
                        name="phone_number"
                        control={control}
                        render={({ field }) => (
                          <Input
                            id="phone_number"
                            type="tel"
                            placeholder="(555) 123-4567"
                            value={field.value || ""}
                            onChange={(e) => {
                              const formatted = formatPhoneInput(
                                e.target.value,
                              );
                              field.onChange(formatted);
                            }}
                          />
                        )}
                      />
                    </Field>
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
                  </div>
                  <Controller
                    name="graduation_year"
                    control={control}
                    render={({ field }) => (
                      <Field className="hidden w-fit gap-1">
                        <FieldLabel htmlFor="graduation_year">
                          Graduating Year (Optional)
                        </FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger
                            id="graduation_year"
                            aria-invalid={
                              errors.graduation_year ? "true" : "false"
                            }
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
                        {errors.graduation_year && (
                          <FieldError>
                            {errors.graduation_year.message}
                          </FieldError>
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
                <Button
                  type="submit"
                  form="edit-athlete-form"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
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

export { EditAthleteDialog };
