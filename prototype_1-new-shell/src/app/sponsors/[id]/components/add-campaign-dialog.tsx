"use client";

import { useState } from "react";
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
import { Loader2 } from "lucide-react";
import { createCampaign } from "@/lib/data";
import type { CampaignInsert } from "@/types/database";

interface AddCampaignDialogProps {
  sponsorId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddCampaignDialog({
  sponsorId,
  open,
  onOpenChange,
  onSuccess,
}: AddCampaignDialogProps) {
  const { mutate } = useSWRConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    budget: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const budgetInCents = formData.budget
        ? Math.round(parseFloat(formData.budget) * 100)
        : 0;

      const campaignData: CampaignInsert = {
        sponsor_id: sponsorId,
        name: formData.name,
        description: formData.description || null,
        budget_cents: budgetInCents,
        start_date: null,
        end_date: null,
        status: "active",
      };

      await createCampaign(campaignData);

      // Invalidate campaigns cache
      mutate(`campaigns-sponsor-${sponsorId}`);

      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create campaign:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      budget: "",
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
    }
    onOpenChange(isOpen);
  };

  const isValid = formData.name.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Campaign</DialogTitle>
          <DialogDescription>
            Create a new campaign to group related sponsorship agreements.
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
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Campaign
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
