"use client";

import { useState, useEffect } from "react";
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

import type { Campaign, CampaignUpdate } from "@/types/database";

interface EditCampaignDialogProps {
  campaign: Campaign | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (campaign: CampaignUpdate) => void;
}

export function EditCampaignDialog({
  campaign,
  open,
  onOpenChange,
  onSave,
}: EditCampaignDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    budget: "",
  });

  // Reset form when campaign changes or dialog opens
  useEffect(() => {
    if (open && campaign) {
      setFormData({
        name: campaign.name,
        description: campaign.description || "",
        budget: campaign.budget_cents ? (campaign.budget_cents / 100).toString() : "",
      });
    }
  }, [open, campaign]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign) return;

    const budgetInCents = formData.budget
      ? Math.round(parseFloat(formData.budget) * 100)
      : undefined;

    const updatedCampaign: CampaignUpdate = {
      name: formData.name,
      description: formData.description || undefined,
      budget_cents: budgetInCents,
    };

    onSave?.(updatedCampaign);
    onOpenChange(false);
  };

  const isValid = formData.name.trim().length > 0;

  if (!campaign) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Edit Campaign</DialogTitle>
          <DialogDescription>
            Update campaign details and settings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Spring 2025 Promo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of the campaign goals and scope..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Campaign Budget</Label>
            <CurrencyInput
              id="budget"
              value={formData.budget}
              onChange={(value) =>
                setFormData({ ...formData, budget: value })
              }
              placeholder="1,000,000"
            />
            <p className="text-xs text-muted-foreground">
              Leave blank for no budget limit.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
