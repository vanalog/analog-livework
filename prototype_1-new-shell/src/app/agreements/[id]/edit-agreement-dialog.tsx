"use client";

import { useState, useEffect } from "react";
import { useSWRConfig } from "swr";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Loader2 } from "lucide-react";
import { updateAgreementAction } from "@/lib/data/actions";
import type { AgreementWithRelations } from "@/types/database";

interface EditAgreementDialogProps {
  agreement: AgreementWithRelations;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditAgreementDialog({
  agreement,
  open,
  onOpenChange,
}: EditAgreementDialogProps) {
  const { mutate } = useSWRConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    campaignId: "",
    appliesToIoi: false,
    startDate: "",
    endDate: "",
    notes: "",
  });

  // Campaign fetching disabled - feature hidden for now

  // Reset form when agreement changes or dialog opens
  useEffect(() => {
    if (open && agreement) {
      setFormData({
        amount: agreement.amount_cents
          ? (agreement.amount_cents / 100).toString()
          : "",
        campaignId: agreement.campaign_id || "",
        appliesToIoi: agreement.applies_to_ioi || false,
        startDate: agreement.start_date || "",
        endDate: agreement.end_date || "",
        notes: agreement.notes || "",
      });
    }
  }, [open, agreement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const amountInCents = formData.amount
        ? Math.round(parseFloat(formData.amount) * 100)
        : agreement.amount_cents;

      const result = await updateAgreementAction(agreement.id, {
        amount_cents: amountInCents,
        campaign_id: formData.campaignId || null,
        applies_to_ioi:
          agreement.type === "sponsorship" ? formData.appliesToIoi : false,
        start_date: formData.startDate || null,
        end_date: formData.endDate || null,
        notes: formData.notes || null,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to update agreement");
      }

      // Invalidate agreements cache
      mutate("agreements");
      mutate("agreements-with-relations");

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update agreement:", error);
      alert("Failed to update agreement. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = formData.amount && parseFloat(formData.amount) > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Edit Agreement
          </DialogTitle>
          <DialogDescription>
            Update the details of this{" "}
            {agreement.type === "sponsorship" ? "sponsorship" : "revenue share"}{" "}
            agreement.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <CurrencyInput
              id="amount"
              value={formData.amount}
              onChange={(value) => setFormData({ ...formData, amount: value })}
              placeholder="5,000"
            />
          </div>

          {/* Campaign selector hidden - feature disabled for now */}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          </div>

          {/* Applies to IOI - only for sponsorship agreements */}
          {agreement.type === "sponsorship" && (
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="appliesToIoi" className="cursor-pointer">
                  Applies to IOI
                </Label>
                <p className="text-xs text-muted-foreground">
                  Does this agreement count toward the athlete&apos;s IOI
                  target?
                </p>
              </div>
              <Switch
                id="appliesToIoi"
                checked={formData.appliesToIoi}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, appliesToIoi: checked })
                }
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Brief description of the agreement..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
