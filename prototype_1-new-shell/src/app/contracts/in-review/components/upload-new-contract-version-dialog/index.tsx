import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
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
import { NotesInput } from "@/app/contracts/in-review/components/upload-contract-dialog/notes-input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SelectInput } from "@/components/core/form/select-input";
import { StatusSelectInput } from "@/app/contracts/in-review/[slug]/components/in-review-status-select-input";
import { useApi } from "@/lib/api";
import { DatePickerInput } from "@/components/core/form/date-picker-input";
import { CurrencyInput } from "@/components/core/form/currency-input";
import {
  CURRENT_HOLDER_VALUES,
  currentHolderOptions,
  THREAD_STATUS_VALUES,
  MAX_FILE_SIZE,
} from "@/lib/constants";
import { toast } from "sonner";

const uploadNewSchema = z.object({
  currentHolder: z.enum(CURRENT_HOLDER_VALUES),
  status: z.optional(z.enum(THREAD_STATUS_VALUES)),
  startDate: z.date(),
  endDate: z.date(),
  notes: z.optional(z.string()),
  totalContractValue: z.string(),
  file: z
    .file()
    .max(MAX_FILE_SIZE)
    .mime([
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]),
});

type NewVersionFormData = z.infer<typeof uploadNewSchema>;

interface UploadNewContractVersionProps {
  uuid: string | undefined;
  children?: React.ReactNode;
}

function UploadNewContractVersion(props: UploadNewContractVersionProps) {
  const $api = useApi();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<NewVersionFormData>({
    resolver: zodResolver(uploadNewSchema),
  });

  const mutation = $api.useMutation("post", "/v1/threads/{thread_uuid}/posts", {
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({
        queryKey: [
          "get",
          "/v1/threads/{thread_uuid}",
          { params: { path: { thread_uuid: props.uuid } } },
        ],
      });
      // Invalidate threads list query for table refresh
      queryClient.invalidateQueries({
        queryKey: ["get", "/v1/threads"],
      });
      setOpen(false);
      toast.success("New version uploaded successfully.");
    },
    onError: (error) => {
      toast.error(`Error uploading contract: ${error}`);
    },
  });

  const onSubmit: SubmitHandler<NewVersionFormData> = (data) => {
    if (mutation.isPending) {
      return;
    }

    const result = uploadNewSchema.safeParse(data);
    if (!result.success) {
      return;
    }

    const postData = {
      current_holder: data.currentHolder,
      start_date: data.startDate.toISOString(),
      expiry_date: data.endDate.toISOString(),
      total_value: parseFloat(data.totalContractValue) * 100,
      ...(data.notes && { note: data.notes }),
      ...(data.status && { status: data.status }),
    };

    const formData = new FormData();
    formData.append("post", JSON.stringify(postData));
    formData.append("file", data.file);

    mutation.mutate({
      params: {
        path: {
          thread_uuid: props.uuid ?? "",
        },
      },
      // @ts-expect-error - FormData is correct for multipart/form-data
      body: formData,
    });
  };

  function handleDialogChange(isOpen: boolean) {
    setOpen(isOpen);
    if (isOpen) {
      reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Upload New Version</DialogTitle>
          <DialogDescription>
            Upload the next version of this contract
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup className="gap-4">
              <Field
                className="gap-1"
                data-invalid={errors.file ? true : undefined}
              >
                <FieldLabel
                  htmlFor="file"
                  className="flex items-center justify-between"
                >
                  Contract File
                </FieldLabel>
                <Controller
                  name="file"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file);
                      }}
                      aria-invalid={errors.file ? true : undefined}
                      className="aria-[invalid]:file:text-destructive"
                    />
                  )}
                />
                {errors.file && <FieldError>{errors.file.message}</FieldError>}
              </Field>
              <Field
                className="gap-1"
                data-invalid={errors.currentHolder ? true : undefined}
              >
                <FieldLabel
                  htmlFor="currentHolder"
                  className="flex items-center justify-between"
                >
                  Current Holder
                </FieldLabel>
                <Controller
                  name="currentHolder"
                  control={control}
                  render={({ field }) => (
                    <SelectInput
                      id="currentHolder"
                      items={currentHolderOptions}
                      placeholder="Select Holder"
                      value={field.value}
                      onChange={field.onChange}
                      invalid={errors?.currentHolder ? true : undefined}
                    />
                  )}
                />
                {errors.currentHolder && (
                  <FieldError>Current holder is required</FieldError>
                )}
              </Field>
              <Field
                className="gap-1"
                data-invalid={errors.status ? true : undefined}
              >
                <FieldLabel
                  htmlFor="status"
                  className="flex items-center justify-between"
                >
                  Status
                </FieldLabel>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <StatusSelectInput
                      id="status"
                      placeholder="Select Status"
                      value={field.value}
                      onChange={field.onChange}
                      invalid={errors?.status ? true : undefined}
                    />
                  )}
                />
                {errors.status && (
                  <FieldError>{errors.status.message}</FieldError>
                )}
              </Field>
              <Field
                className="gap-1"
                data-invalid={errors?.totalContractValue ? true : undefined}
              >
                <FieldLabel htmlFor="totalContractValue">
                  Total Agreement Value
                </FieldLabel>
                <Controller
                  name="totalContractValue"
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                      id="totalContractValue"
                      value={field.value}
                      onChange={field.onChange}
                      invalid={errors?.totalContractValue ? true : undefined}
                    />
                  )}
                />
                {errors?.totalContractValue && (
                  <FieldError>Contract value is required</FieldError>
                )}
              </Field>
              <div className="flex flex-row gap-4">
                <Field
                  className="gap-1"
                  data-invalid={errors?.startDate ? true : undefined}
                >
                  <FieldLabel htmlFor="startDate">Start Date</FieldLabel>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <DatePickerInput
                        id="startDate"
                        value={field.value}
                        onChange={field.onChange}
                        invalid={errors?.startDate ? true : undefined}
                      />
                    )}
                  />
                  {errors?.startDate && (
                    <FieldError>Start date is required</FieldError>
                  )}
                </Field>
                <Field
                  className="gap-1"
                  data-invalid={errors?.endDate ? true : undefined}
                >
                  <FieldLabel htmlFor="endDate">End Date</FieldLabel>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                      <DatePickerInput
                        id="endDate"
                        value={field.value}
                        onChange={field.onChange}
                        invalid={errors?.endDate ? true : undefined}
                      />
                    )}
                  />
                  {errors?.endDate && (
                    <FieldError>End date is required</FieldError>
                  )}
                </Field>
              </div>
              <Field className="gap-1">
                <FieldLabel
                  htmlFor="notes"
                  className="flex items-center justify-between"
                >
                  Notes
                </FieldLabel>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <NotesInput
                      id="notes"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </Field>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" onClick={() => reset()}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <div className="px-9">
                      <LoaderCircle className="animate-spin" />
                    </div>
                  ) : (
                    "Upload Version"
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

export { UploadNewContractVersion };
