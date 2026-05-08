import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { Upload, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { ComboboxInput } from "@/components/core/form/combobox-input";
import { CurrencyInput } from "@/components/core/form/currency-input";
import { DatePickerInput } from "@/components/core/form/date-picker-input";
import { FileUploadInput } from "@/components/core/form/file-upload-input";
import { SelectInput } from "@/components/core/form/select-input";
import { NotesInput } from "./notes-input";
import { PriorityInput } from "./priority-input";
import {
  CURRENT_HOLDER_VALUES,
  currentHolderOptions,
  THREAD_STATUS_VALUES,
  threadStatusOptions,
  MAX_FILE_SIZE,
  CONTRACT_TYPE_VALUES,
  CONTRACT_GROUP_VALUES,
  contractTypeOptions,
  contractGroupOptions,
  PARTICIPANT_ROLE_VALUES,
} from "@/lib/constants";
import { toast } from "sonner";
import { RequiredAsterisk } from "@/components/core/required-asterisk";
import { ParticipantsCard } from "@/app/contracts/components/participants-card";

const participantSchema = z.object({
  uuid: z.uuid(),
  first_name: z.string(),
  last_name: z.string(),
  role: z.enum(PARTICIPANT_ROLE_VALUES),
  email: z.email(),
});

const createThreadSchema = z.object({
  athleteUUID: z.guid(),
  contractType: z.enum(CONTRACT_TYPE_VALUES),
  contractGroup: z.enum(CONTRACT_GROUP_VALUES),
  agencyUUID: z
    .union([z.guid(), z.literal("")])
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  startDate: z.date(),
  endDate: z.date(),
  currentStatus: z.enum(THREAD_STATUS_VALUES),
  currentHolder: z.enum(CURRENT_HOLDER_VALUES),
  participants: z.optional(z.array(participantSchema)),
  notes: z.optional(z.string()),
  totalContractValue: z.string(),
  contract: z
    .file()
    .max(MAX_FILE_SIZE)
    .mime([
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]),
  isPriority: z.boolean(),
});

type ThreadFormData = z.infer<typeof createThreadSchema>;

function UploadContractDialog() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [participantsOpen, setParticipantsOpen] = React.useState(false);
  const [notesOpen, setNotesOpen] = React.useState(false);

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ThreadFormData>({
    resolver: zodResolver(createThreadSchema),
    defaultValues: {
      isPriority: false,
    },
  });

  const $api = useApi();
  const queryClient = useQueryClient();
  const athletesData = $api.useQuery("get", "/v1/student_athletes/list");
  const agenciesData = $api.useQuery("get", "/v1/agencies/list");
  const mutation = $api.useMutation("post", "/v1/threads", {
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["get", "/v1/threads"] });
      setDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Error uploading contract: ${error}`);
    },
  });
  const selectedParticipant = $api.useMutation(
    "get",
    "/v1/participants/{participant_uuid}",
  );

  const onAthleteChange = async (
    athleteUuid: string,
    onChange: (value: string) => void,
  ) => {
    const prevAthleteUuid = getValues("athleteUUID");
    onChange(athleteUuid);

    const prevAthlete = athletesData.data?.data?.find(
      (athlete) => athlete.value === prevAthleteUuid,
    );
    const nextAthlete = athletesData.data?.data?.find(
      (athlete) => athlete.value === athleteUuid,
    );

    const filteredParticipants = (getValues("participants") || []).filter(
      (p) => p.uuid !== prevAthlete?.agent_participant_uuid,
    );

    if (nextAthlete?.agent_participant_uuid) {
      const participant = await selectedParticipant.mutateAsync({
        params: {
          path: { participant_uuid: nextAthlete.agent_participant_uuid },
        },
      });

      if (
        participant.uuid &&
        participant.first_name &&
        participant.last_name &&
        participant.role &&
        participant.email
      ) {
        filteredParticipants.push({
          uuid: participant.uuid,
          first_name: participant.first_name,
          last_name: participant.last_name,
          role: participant.role,
          email: participant.email,
        });
      }
    }

    setValue("participants", filteredParticipants);
    setParticipantsOpen(filteredParticipants.length > 0);
  };

  const onSubmit: SubmitHandler<ThreadFormData> = (data) => {
    if (mutation.isPending) {
      return;
    }

    const result = createThreadSchema.safeParse(data);
    if (!result.success) {
      return;
    }

    const threadData = {
      student_athlete_uuid: data.athleteUUID,
      contract_type: data.contractType,
      contract_group: data.contractGroup,
      current_holder: data.currentHolder,
      start_date: data.startDate.toISOString(),
      expiry_date: data.endDate.toISOString(),
      total_value: parseFloat(data.totalContractValue) * 100,
      status: data.currentStatus,
      is_priority: data.isPriority,
      ...(data.agencyUUID && { agency_uuid: data.agencyUUID }),
      ...(data.participants && { participants: data.participants }),
      ...(data.notes && { note: data.notes }),
    };

    const formData = new FormData();
    formData.append("thread", JSON.stringify(threadData));
    formData.append("file", data.contract);

    mutation.mutate({
      // @ts-expect-error - FormData is correct for multipart/form-data
      body: formData,
    });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload /> Upload Agreement
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto max-h-screen w-full min-w-[50rem]">
        <DialogHeader>
          <DialogTitle>Upload Agreement</DialogTitle>
          <DialogDescription>Add a new agreement for review</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup>
              <div className="flex flex-row gap-4">
                <Field
                  className="gap-1 flex-1"
                  data-invalid={errors?.athleteUUID ? true : undefined}
                >
                  <FieldLabel htmlFor="athlete">
                    Athlete <RequiredAsterisk />{" "}
                  </FieldLabel>
                  <Controller
                    name="athleteUUID"
                    control={control}
                    render={({ field }) => (
                      <ComboboxInput
                        id="athlete"
                        items={athletesData.data?.data}
                        placeholder="Search by athlete name..."
                        value={field.value}
                        onChange={(e) => onAthleteChange(e, field.onChange)}
                        invalid={errors?.athleteUUID ? true : undefined}
                      />
                    )}
                  />
                  {errors?.athleteUUID && (
                    <FieldError>Athlete is required</FieldError>
                  )}
                </Field>
                <div className="flex flex-row gap-4 flex-1">
                  <Field
                    className="gap-1 flex-1 min-w-0"
                    data-invalid={errors?.contractType ? true : undefined}
                  >
                    <FieldLabel htmlFor="contractType">
                      Type <RequiredAsterisk />{" "}
                    </FieldLabel>
                    <Controller
                      name="contractType"
                      control={control}
                      render={({ field }) => (
                        <SelectInput
                          id="contractType"
                          items={contractTypeOptions}
                          placeholder="Select Type"
                          value={field.value}
                          onChange={field.onChange}
                          invalid={errors?.contractType ? true : undefined}
                        />
                      )}
                    />
                    {errors?.contractType && (
                      <FieldError>Type is required</FieldError>
                    )}
                  </Field>
                  <Field
                    className="gap-1 flex-1 min-w-0"
                    data-invalid={errors?.contractGroup ? true : undefined}
                  >
                    <FieldLabel htmlFor="contractGroup">
                      Group <RequiredAsterisk />{" "}
                    </FieldLabel>
                    <Controller
                      name="contractGroup"
                      control={control}
                      render={({ field }) => (
                        <SelectInput
                          id="contractGroup"
                          items={contractGroupOptions}
                          placeholder="Select Group"
                          value={field.value}
                          onChange={field.onChange}
                          invalid={errors?.contractGroup ? true : undefined}
                        />
                      )}
                    />
                    {errors?.contractGroup && (
                      <FieldError>Group is required</FieldError>
                    )}
                  </Field>
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <Field
                  className="gap-1"
                  data-invalid={errors?.agencyUUID ? true : undefined}
                >
                  <FieldLabel htmlFor="agency">Agency</FieldLabel>
                  <Controller
                    name="agencyUUID"
                    control={control}
                    render={({ field }) => (
                      <ComboboxInput
                        id="agency"
                        items={agenciesData.data?.data}
                        placeholder="Search by agency name..."
                        value={field.value}
                        onChange={field.onChange}
                        invalid={errors?.agencyUUID ? true : undefined}
                      />
                    )}
                  />
                </Field>
                <Field
                  className="gap-1"
                  data-invalid={errors?.totalContractValue ? true : undefined}
                >
                  <FieldLabel htmlFor="totalContractValue">
                    Total Agreement Value <RequiredAsterisk />{" "}
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
                    <FieldError>Agreement value is required</FieldError>
                  )}
                </Field>
              </div>
              <div className="flex flex-row gap-4">
                <Field
                  className="gap-1"
                  data-invalid={errors?.startDate ? true : undefined}
                >
                  <FieldLabel htmlFor="startDate">
                    Start Date <RequiredAsterisk />{" "}
                  </FieldLabel>
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
                  <FieldLabel htmlFor="endDate">
                    End Date <RequiredAsterisk />{" "}
                  </FieldLabel>
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
              <Field
                className="gap-1"
                data-invalid={errors?.contract ? true : undefined}
              >
                <FieldLabel htmlFor="fileUpload">
                  Upload Agreement Document <RequiredAsterisk />{" "}
                </FieldLabel>
                <Controller
                  name="contract"
                  control={control}
                  render={({ field }) => (
                    <FileUploadInput
                      id="fileUpload"
                      value={field.value}
                      onChange={field.onChange}
                      invalid={errors?.contract ? true : undefined}
                    />
                  )}
                />
                {errors?.contract && <FieldError>File is required</FieldError>}
              </Field>
              <Field className="gap-1">
                <Controller
                  name="isPriority"
                  control={control}
                  render={({ field }) => (
                    <PriorityInput
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </Field>
              <div className="flex flex-row gap-4">
                <Field
                  className="gap-1"
                  data-invalid={errors?.currentStatus ? true : undefined}
                >
                  <FieldLabel htmlFor="currentStatus">
                    Current Status <RequiredAsterisk />{" "}
                  </FieldLabel>
                  <Controller
                    name="currentStatus"
                    control={control}
                    render={({ field }) => (
                      <SelectInput
                        id="currentStatus"
                        items={threadStatusOptions}
                        placeholder="Select Status"
                        value={field.value}
                        onChange={field.onChange}
                        invalid={errors?.currentStatus ? true : undefined}
                      />
                    )}
                  />
                  {errors?.currentStatus && (
                    <FieldError>Current status is required</FieldError>
                  )}
                </Field>
                <Field
                  className="gap-1"
                  data-invalid={errors?.currentHolder ? true : undefined}
                >
                  <FieldLabel htmlFor="currentHolder">
                    Current Holder <RequiredAsterisk />{" "}
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
                  {errors?.currentHolder && (
                    <FieldError>Current holder is required</FieldError>
                  )}
                </Field>
              </div>
              <Collapsible
                open={participantsOpen}
                onOpenChange={setParticipantsOpen}
              >
                <Field className="gap-1">
                  <FieldLabel
                    htmlFor="participants"
                    className="flex items-center justify-between"
                  >
                    <span>Participants</span>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost">
                        {participantsOpen ? "Hide" : "Show"}
                      </Button>
                    </CollapsibleTrigger>
                  </FieldLabel>
                  <CollapsibleContent>
                    <Controller
                      name="participants"
                      control={control}
                      render={({ field }) => (
                        <ParticipantsCard
                          participants={field.value}
                          onAdd={(participant) => {
                            field.onChange([
                              ...(field.value || []),
                              participant,
                            ]);
                          }}
                          onDelete={(participant) => {
                            field.onChange(
                              Array.from(field.value || []).filter(
                                (p) => p.uuid !== participant.uuid,
                              ),
                            );
                          }}
                        />
                      )}
                    />
                  </CollapsibleContent>
                </Field>
              </Collapsible>
              <Collapsible open={notesOpen} onOpenChange={setNotesOpen}>
                <Field className="gap-1">
                  <FieldLabel
                    htmlFor="notes"
                    className="flex items-center justify-between"
                  >
                    <span>Notes</span>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost">
                        {notesOpen ? "Hide" : "Show"}
                      </Button>
                    </CollapsibleTrigger>
                  </FieldLabel>
                  <CollapsibleContent>
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
                  </CollapsibleContent>
                </Field>
              </Collapsible>
              <DialogFooter>
                <DialogClose asChild onClick={() => reset()}>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <div className="px-9">
                      <LoaderCircle className="animate-spin" />
                    </div>
                  ) : (
                    "Save changes"
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

export { UploadContractDialog };
