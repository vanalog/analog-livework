"use client";

import { useState, useEffect } from "react";
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
import { CurrencyInput } from "@/components/ui/currency-input";
import { upsertAthleteBudget } from "@/lib/data";

interface EditIoiDialogProps {
  athleteUuid: string;
  athleteId: string; // The Supabase ID for the athlete
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentIoi?: number;
  onSaved?: () => void;
}

function formatCentsToInput(cents?: number): string {
  if (!cents) return "";
  return (cents / 100).toString();
}

function parseDollarsToСents(dollars: string): number {
  const parsed = parseFloat(dollars);
  if (isNaN(parsed)) return 0;
  return Math.round(parsed * 100);
}

export function EditIoiDialog({
  athleteUuid,
  athleteId,
  open,
  onOpenChange,
  currentIoi,
  onSaved,
}: EditIoiDialogProps) {
  const [ioiValue, setIoiValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setIoiValue(formatCentsToInput(currentIoi));
    }
  }, [open, currentIoi]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const targetCents = parseDollarsToСents(ioiValue);
      // Use current fiscal year
      const currentYear = new Date().getFullYear().toString();
      await upsertAthleteBudget(athleteId, currentYear, targetCents);
      onSaved?.();
      onOpenChange(false);
    } catch (error) {
      console.error("[v0] Failed to save IOI target:", error);
      alert("Failed to save target. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit NIL Sponsorship Target</DialogTitle>
          <DialogDescription>
            Set the NIL Sponsorship target for this athlete. Sponsorship 
            agreements can be marked as applying toward this target.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="ioi">NIL Sponsorship Target</Label>
            <CurrencyInput
              id="ioi"
              placeholder="0"
              value={ioiValue}
              onChange={(value) => setIoiValue(value)}
            />
            <p className="text-xs text-muted-foreground">
              Target sponsorship amount set by a facilitator (e.g., Buckeye
              Sports Group)
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
