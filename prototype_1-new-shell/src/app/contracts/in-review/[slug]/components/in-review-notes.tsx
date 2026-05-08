"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useApi } from "@/lib/api";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatDateShort } from "@/lib/formatters";
import { ReadThreadResponse } from "@/types/api-types";
import { Field, FieldError } from "@/components/ui/field";

const addNoteSchema = z.object({
  note: z.string().min(1, "This field is required"),
});

type AddNoteFormData = z.infer<typeof addNoteSchema>;

function InReviewNotes(props: ReadThreadResponse) {
  const $api = useApi();
  const queryClient = useQueryClient();

  const mutation = $api.useMutation("post", "/v1/threads/{thread_uuid}/notes");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddNoteFormData>({
    resolver: zodResolver(addNoteSchema),
  });

  const onSubmit: SubmitHandler<AddNoteFormData> = async (data) => {
    const result = addNoteSchema.safeParse(data);
    if (!result.success) {
      return;
    }

    await mutation.mutateAsync(
      {
        params: { path: { thread_uuid: props.uuid ?? "" } },
        body: { content: result.data.note },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [
              "get",
              "/v1/threads/{thread_uuid}",
              { params: { path: { thread_uuid: props.uuid } } },
            ],
          });
          reset();
        },
        onError: (error) => {
          toast.error(`Error creating note: ${error}`);
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="font-semibold">Notes & Activity</span>
        </CardTitle>
        <CardAction>
          <div className="px-2 py-0.5 text-xs font-medium bg-secondary">
            {props?.notes?.length ?? 0}
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-2">
            <Field>
              <Input
                {...register("note")}
                placeholder="Add a note…"
                disabled={mutation.isPending}
              />

              <FieldError>{errors.note?.message}</FieldError>
            </Field>
            <Button disabled={mutation.isPending}>
              <Plus size={16} />
            </Button>
          </div>
        </form>
        {props?.notes?.map((note) => (
          <div key={note.uuid} className="space-y-2">
            <div className="p-3 rounded-lg border bg-muted/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold">
                  {note.posted_by?.first_name} {note.posted_by?.last_name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {note.posted_at && formatDateShort(note.posted_at, true)}
                </span>
              </div>
              <p className="text-sm">{note.note_content}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export { InReviewNotes };
