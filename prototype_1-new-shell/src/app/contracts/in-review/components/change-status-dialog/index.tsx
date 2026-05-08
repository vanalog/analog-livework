import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, TriangleAlert, SquarePen } from "lucide-react";
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
  FieldSet,
} from "@/components/ui/field";
import { StatusSelectInput } from "@/app/contracts/in-review/[slug]/components/in-review-status-select-input";
import { StatusBadge } from "@/components/core/status-badge";
import { useApi } from "@/lib/api";
import { ThreadStatus } from "@/types/api-types";
import {
  THREAD_STATUS_VALUES,
  THREAD_STATUS_DESCRIPTIONS,
} from "@/lib/constants";

const changeStatusSchema = z.object({
  status: z.enum(THREAD_STATUS_VALUES),
});

type ChangeStatusFormData = z.infer<typeof changeStatusSchema>;

interface ChangeStatusDialogProps {
  uuid: string | undefined;
  currentStatus: ThreadStatus | undefined;
  title: string | undefined;
  athleteFirstName: string | undefined;
  athleteLastName: string | undefined;
  children?: React.ReactNode;
}

function ChangeStatusDialog(props: ChangeStatusDialogProps) {
  const $api = useApi();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);

  // Build athlete name internally
  const athleteName =
    props.athleteFirstName && props.athleteLastName
      ? `${props.athleteFirstName} ${props.athleteLastName}`
      : undefined;

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<ChangeStatusFormData>({
    resolver: zodResolver(changeStatusSchema),
    defaultValues: {
      status: props.currentStatus,
    },
  });

  const selectedStatus = watch("status");
  const hasStatusChanged =
    selectedStatus && selectedStatus !== props.currentStatus;

  const mutation = $api.useMutation("patch", "/v1/threads/{thread_uuid}", {
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({
        queryKey: [
          "get",
          "/v1/threads/{thread_uuid}",
          { params: { path: { thread_uuid: props.uuid } } },
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["get", "/v1/threads"],
      });
      setOpen(false);
      toast.success("Status updated.");
    },
    onError: (error) => {
      toast.error(`Error changing status: ${error}`);
    },
  });

  const onSubmit: SubmitHandler<ChangeStatusFormData> = (data) => {
    if (mutation.isPending) {
      return;
    }

    const result = changeStatusSchema.safeParse(data);
    if (!result.success) {
      return;
    }

    mutation.mutate({
      params: {
        path: {
          thread_uuid: props.uuid ?? "",
        },
      },
      body: {
        status: data.status,
      },
    });
  };

  function handleDialogChange(isOpen: boolean) {
    setOpen(isOpen);
    if (isOpen) {
      reset({ status: props.currentStatus });
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        {props.children ?? (
          <Button className="w-full justify-start" variant="outline">
            <SquarePen />
            Change Status
          </Button>
        )}
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Change Contract Status</DialogTitle>
          <DialogDescription>
            Update the negotiation status for this contract. This will affect
            tracking and notifications.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup className="gap-4">
              <div className="rounded-lg border bg-muted/50 p-3 space-y-1">
                <div className="font-semibold">{props.title}</div>
                <div className="text-sm text-muted-foreground">
                  {athleteName}
                </div>
              </div>

              <div className="space-y-2">
                <FieldLabel>Current Status</FieldLabel>
                <div className="flex items-center gap-2">
                  {props.currentStatus && (
                    <>
                      <StatusBadge status={props.currentStatus} />
                      <span className="text-sm text-muted-foreground">
                        {THREAD_STATUS_DESCRIPTIONS[props.currentStatus]}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <Field
                className="gap-1"
                data-invalid={errors.status ? true : undefined}
              >
                <FieldLabel htmlFor="newStatus">New Status</FieldLabel>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <StatusSelectInput
                      id="newStatus"
                      placeholder="Select new status"
                      value={field.value}
                      onChange={field.onChange}
                      invalid={errors?.status ? true : undefined}
                    />
                  )}
                />
                {selectedStatus && (
                  <div className="text-sm text-muted-foreground">
                    {THREAD_STATUS_DESCRIPTIONS[selectedStatus]}
                  </div>
                )}
                {errors.status && (
                  <FieldError>{errors.status.message}</FieldError>
                )}
              </Field>

              {hasStatusChanged && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50  p-3">
                  <TriangleAlert className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-900 ">
                    Changing the status will update the contract tracking.
                  </p>
                </div>
              )}

              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    onClick={() => reset({ status: props.currentStatus })}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <div className="px-9">
                      <LoaderCircle className="animate-spin" />
                    </div>
                  ) : (
                    "Confirm Change"
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

export { ChangeStatusDialog };
