import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useApi } from "@/lib/api";
import {
  PARTICIPANT_ROLE_VALUES,
  participantRoleOptions,
} from "@/lib/constants";
import { Participant, ParticipantRole } from "@/types/api-types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { UserRoundPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const createParticipantSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.email(),
  role: z.enum(PARTICIPANT_ROLE_VALUES),
});

type CreateParticipantFormData = z.infer<typeof createParticipantSchema>;

export function NewParticipant(props: {
  onSubmit(participant: Participant): void;
  className?: string;
}) {
  const $api = useApi();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateParticipantFormData>({
    resolver: zodResolver(createParticipantSchema),
  });

  const createParticipant = $api.useMutation("post", "/v1/participants", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get", "/v1/participants/list"],
      });
    },
  });

  async function onSubmit(data: CreateParticipantFormData) {
    try {
      const participant = await createParticipant.mutateAsync({
        body: data,
      });

      toast.success("Participant created successfully");
      props.onSubmit(participant);
      setOpen(false);
      reset();
    } catch (error) {
      toast.error("Failed to create participant");
      console.error("Error creating participant:", error);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex h-5 w-full font-normal justify-start",
            props.className,
          )}
          onClick={() => setOpen(true)}
        >
          <UserRoundPlus size={16} />
          New participant
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Participant</DialogTitle>
          <DialogDescription>
            Add a new participant to this contract negotiation.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            handleSubmit(onSubmit)(ev);
          }}
          className="flex flex-col gap-4"
        >
          <Field>
            <FieldLabel>
              First Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input {...register("first_name")} placeholder="Enter first name" />
            <FieldError>{errors.first_name?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel>
              Last Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input {...register("last_name")} placeholder="Enter last name" />
            <FieldError>{errors.last_name?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel>
              Email <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              {...register("email")}
              type="email"
              placeholder="email@example.com"
            />
            <FieldError>{errors.email?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel>
              Participant Type <span className="text-destructive">*</span>
            </FieldLabel>
            <Select
              onValueChange={(value) =>
                setValue("role", value as ParticipantRole, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger aria-invalid={errors.role ? "true" : "false"}>
                <SelectValue placeholder="Select participant type" />
              </SelectTrigger>
              <SelectContent>
                {participantRoleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError className="wrap-anywhere">
              {errors.role?.message}
            </FieldError>
          </Field>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createParticipant.isPending}>
              {createParticipant.isPending ? "Adding..." : "Add Participant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
