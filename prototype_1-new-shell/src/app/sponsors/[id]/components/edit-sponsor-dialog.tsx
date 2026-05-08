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
import type { Sponsor, SponsorUpdate } from "@/types/database";

interface EditSponsorDialogProps {
  sponsor: Sponsor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (updates: SponsorUpdate) => void;
}



// Format phone number as user types
function formatPhoneNumber(value: string): string {
  // Remove all non-digits
  const digits = value.replace(/\D/g, "");
  
  // Format based on length
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  // For numbers longer than 10 digits (international), just format first 10
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

export function EditSponsorDialog({
  sponsor,
  open,
  onOpenChange,
  onSave,
}: EditSponsorDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    website: "",
    budget: "",
  });

  // Reset form when sponsor changes or dialog opens
  useEffect(() => {
    if (open && sponsor) {
      setFormData({
        name: sponsor.name,
        contact_name: sponsor.contact_name || "",
        contact_email: sponsor.contact_email || "",
        contact_phone: formatPhoneNumber(sponsor.contact_phone || ""),
        website: sponsor.website || "",
        budget: sponsor.budget_cents ? (sponsor.budget_cents / 100).toString() : "",
      });
    }
  }, [open, sponsor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const budgetInCents = formData.budget 
      ? Math.round(parseFloat(formData.budget) * 100) 
      : null;

    const updates: SponsorUpdate = {
      name: formData.name,
      contact_name: formData.contact_name || null,
      contact_email: formData.contact_email || null,
      contact_phone: formData.contact_phone || null,
      website: formData.website || null,
      budget_cents: budgetInCents,
    };

    onSave?.(updates);
  };

  // Only name is required
  const isValid = formData.name.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Sponsor</DialogTitle>
          <DialogDescription>
            Update sponsor information and contact details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Sponsor Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nike, Gatorade, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_name">Contact Name</Label>
              <Input
                id="contact_name"
                value={formData.contact_name}
                onChange={(e) =>
                  setFormData({ ...formData, contact_name: e.target.value })
                }
                placeholder="John Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) =>
                  setFormData({ ...formData, contact_email: e.target.value })
                }
                placeholder="contact@sponsor.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                type="tel"
                value={formData.contact_phone}
                onChange={(e) =>
                  setFormData({ ...formData, contact_phone: formatPhoneNumber(e.target.value) })
                }
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                placeholder="https://sponsor.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Sponsor Budget</Label>
            <CurrencyInput
              id="budget"
              value={formData.budget}
              onChange={(value) =>
                setFormData({ ...formData, budget: value })
              }
              placeholder="100,000"
            />
            <p className="text-xs text-muted-foreground">
              Optional total budget for this sponsor relationship.
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
