import { Button } from "@/components/ui/button";
import { Participant } from "@/types/api-types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useState } from "react";

export function DeleteParticipant(props: {
  participant: Participant;
  onDelete(participant: Participant): void;
}) {
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  return (
    <Dialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
      <DialogTrigger>
        <X className="h-3 w-3" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove{" "}
            <strong>
              {props.participant.first_name} {props.participant.last_name}
            </strong>{" "}
            from this contract negotiation?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setDeleteAlertOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              props.onDelete(props.participant);
              setDeleteAlertOpen(false);
            }}
          >
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
