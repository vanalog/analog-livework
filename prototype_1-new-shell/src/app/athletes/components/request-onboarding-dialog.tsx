import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { useApi } from "@/lib/api";
import type { StudentAthleteResponse } from "@/types/api-types";

function buildSchema(eduEmail: string) {
  return z.object({
    email: z
      .email("Please enter a valid email address.")
      .refine((val) => val === eduEmail, {
        message: "Email must match the student's verified university email.",
      }),
    confirmed: z
      .boolean()
      .refine((val) => val === true, "You must confirm before sending."),
  });
}

type OnboardingFormData = z.infer<ReturnType<typeof buildSchema>>;

interface RequestOnboardingDialogProps {
  athlete: StudentAthleteResponse;
}

const STATUS_MESSAGES: Record<number, string> = {
  400: "Invalid request — please check the email address.",
  401: "You are not authorized to perform this action.",
  403: "You do not have permission to invite this athlete.",
  404: "Athlete not found.",
  409: "This athlete already has an active payout account.",
  500: "Something went wrong on our end. Please try again.",
};

function RequestOnboardingDialog({ athlete }: RequestOnboardingDialogProps) {
  const $api = useApi();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);

  const athleteName = [athlete.first_name, athlete.last_name]
    .filter(Boolean)
    .join(" ");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(buildSchema(athlete.edu_email || "")),
    defaultValues: { email: athlete.edu_email || "", confirmed: false },
  });

  const mutation = $api.useMutation(
    "post",
    "/v1/student_athletes/{student_athlete_uuid}/invite",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["get", "/v1/student_athletes/{student_athlete_uuid}"],
        });
        toast.success(`Onboarding request sent to ${athlete.edu_email}.`);
        setOpen(false);
      },
      onError: (error: unknown) => {
        const status =
          error && typeof error === "object" && "status" in error
            ? (error as { status: number }).status
            : null;
        const message =
          (status && STATUS_MESSAGES[status]) ||
          "Failed to send onboarding request. Please try again.";
        toast.error(message);
      },
    },
  );

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (isOpen) {
      reset({ email: athlete.edu_email || "", confirmed: false });
    }
  }

  function onSubmit() {
    if (!athlete.uuid || mutation.isPending) return;
    mutation.mutate({
      params: { path: { student_athlete_uuid: athlete.uuid } },
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                disabled={!athlete.edu_email}
              >
                <Send className="w-3 h-3" />
                Request Account Onboarding
              </Button>
            </DialogTrigger>
          </span>
        </TooltipTrigger>
        {!athlete.edu_email && (
          <TooltipContent>
            No .edu email on file for this athlete
          </TooltipContent>
        )}
      </Tooltip>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Request Account Onboarding</DialogTitle>
        </DialogHeader>

        <form id="onboarding-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground">
              Verify the student&apos;s .edu email address and confirm
              onboarding for {athleteName}.
            </p>

            <FieldSet>
              <FieldGroup>
                <Field className="gap-1">
                  <FieldLabel htmlFor="onboarding-email">
                    Student .edu Email Address
                  </FieldLabel>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="onboarding-email"
                        type="email"
                        value={field.value}
                        onChange={field.onChange}
                        aria-invalid={errors.email ? "true" : "false"}
                      />
                    )}
                  />
                  {errors.email ? (
                    <FieldError>{errors.email.message}</FieldError>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      This must match the student&apos;s verified university
                      email.
                    </p>
                  )}
                </Field>
              </FieldGroup>
            </FieldSet>

            <div
              className={`rounded-md border p-4 ${errors.confirmed ? "border-destructive" : ""}`}
            >
              <div className="flex items-start gap-3">
                <Controller
                  name="confirmed"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="onboarding-confirm"
                      checked={field.value}
                      onCheckedChange={(val) => field.onChange(val === true)}
                      className="mt-0.5"
                    />
                  )}
                />
                <div className="space-y-1">
                  <label
                    htmlFor="onboarding-confirm"
                    className="text-sm leading-snug cursor-pointer"
                  >
                    I confirm that I am an authorized university administrator
                    and would like to initiate payout account onboarding for
                    this student-athlete.
                  </label>
                  {errors.confirmed && (
                    <FieldError>{errors.confirmed.message}</FieldError>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>

        <DialogFooter className="border-t pt-4">
          <DialogClose asChild>
            <Button variant="outline" disabled={mutation.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="onboarding-form"
            disabled={mutation.isPending}
            className="bg-black text-white hover:bg-black/80"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Onboarding Request
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { RequestOnboardingDialog };
