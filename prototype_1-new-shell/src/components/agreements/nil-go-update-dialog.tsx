"use client";

import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NIL_GO_STATUS_OPTIONS } from "@/components/agreements/nil-go-status-badge";
import { setNilGoStatusAction } from "@/lib/data/actions";
import type { NilGoStatus } from "@/types/database";

interface NilGoUpdateDialogProps {
  agreementId: string;
  currentStatus: NilGoStatus | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal for setting a NIL Go status on a sponsorship agreement.
 *
 * The form is intentionally small (status + optional note) since admins
 * will use this frequently. Submitting writes one new history event and
 * updates the denormalized status atomically via `setNilGoStatusAction`.
 */
export function NilGoUpdateDialog({
  agreementId,
  currentStatus,
  open,
  onOpenChange,
}: NilGoUpdateDialogProps) {
  const { mutate } = useSWRConfig();
  const [status, setStatus] = useState<NilGoStatus>(
    currentStatus ?? "pending"
  );
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset local form whenever the dialog reopens or the current status
  // changes so we don't show stale values from a previous edit.
  useEffect(() => {
    if (open) {
      setStatus(currentStatus ?? "pending");
      setNote("");
      setError(null);
    }
  }, [open, currentStatus]);

  async function handleSave() {
    setIsSaving(true);
    setError(null);
    const result = await setNilGoStatusAction(
      agreementId,
      status,
      note || null
    );
    setIsSaving(false);

    if (!result.success) {
      setError(result.error || "Could not save NIL Go status.");
      return;
    }

    mutate("agreements");
    mutate("agreements-with-relations");
    mutate(`nil-go-events-${agreementId}`);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update NIL Go Status</DialogTitle>
          <DialogDescription>
            Record a new status with the NIL Go clearinghouse. Optionally add
            a note for the history log.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="nil-go-modal-status">Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as NilGoStatus)}
            >
              <SelectTrigger id="nil-go-modal-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NIL_GO_STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nil-go-modal-note">Note (optional)</Label>
            <Textarea
              id="nil-go-modal-note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add context for this status change"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
