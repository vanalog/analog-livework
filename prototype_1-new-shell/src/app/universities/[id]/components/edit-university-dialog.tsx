"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { University, UniversityUpdate } from "@/types/database";
import { ConferenceCombobox } from "@/components/universities/conference-combobox";

interface EditUniversityDialogProps {
  university: University;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: UniversityUpdate) => Promise<void>;
}

export function EditUniversityDialog({
  university,
  open,
  onOpenChange,
  onSave,
}: EditUniversityDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: university.name,
    conference: university.conference || "",
    website: university.website || "",
    contact_name: university.contact_name || "",
    contact_email: university.contact_email || "",
    contact_phone: university.contact_phone || "",
  });

  // Reset form when university changes
  useEffect(() => {
    setFormData({
      name: university.name,
      conference: university.conference || "",
      website: university.website || "",
      contact_name: university.contact_name || "",
      contact_email: university.contact_email || "",
      contact_phone: university.contact_phone || "",
    });
  }, [university]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        name: formData.name.trim(),
        conference: formData.conference || null,
        website: formData.website.trim() || null,
        contact_name: formData.contact_name.trim() || null,
        contact_email: formData.contact_email.trim() || null,
        contact_phone: formData.contact_phone.trim() || null,
      });
    } catch (error) {
      console.error("Failed to update university:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit University</DialogTitle>
          <DialogDescription>
            Update university information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">University Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., University of Texas"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="conference">Conference</Label>
              <ConferenceCombobox
                id="conference"
                value={formData.conference}
                onChange={(val) =>
                  setFormData({ ...formData, conference: val })
                }
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
                placeholder="https://"
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-2 sm:col-span-2 pt-2 border-t">
              <p className="text-sm font-medium text-muted-foreground">Contact Information</p>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="contact_name">Contact Name</Label>
              <Input
                id="contact_name"
                value={formData.contact_name}
                onChange={(e) =>
                  setFormData({ ...formData, contact_name: e.target.value })
                }
                placeholder="e.g., John Smith"
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
                placeholder="contact@university.edu"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                type="tel"
                value={formData.contact_phone}
                onChange={(e) =>
                  setFormData({ ...formData, contact_phone: e.target.value })
                }
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.name.trim()}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
