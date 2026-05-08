"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { createUniversity } from "@/lib/data";
import { ConferenceCombobox } from "@/components/universities/conference-combobox";

export function AddUniversityDialog() {
  const { mutate } = useSWRConfig();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    conference: "",
    website: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      await createUniversity({
        name: formData.name.trim(),
        conference: formData.conference || null,
        website: formData.website.trim() || null,
        logo_url: null,
        contact_name: formData.contact_name.trim() || null,
        contact_email: formData.contact_email.trim() || null,
        contact_phone: formData.contact_phone.trim() || null,
      });

      // Revalidate universities data
      mutate("universities");
      mutate("universities-with-stats");

      // Reset form and close dialog
      setFormData({
        name: "",
        conference: "",
        website: "",
        contact_name: "",
        contact_email: "",
        contact_phone: "",
      });
      setOpen(false);
    } catch (error) {
      console.error("Failed to create university:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-50/50 hover:text-blue-700 hover:border-blue-300 shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Add University
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add University</DialogTitle>
          <DialogDescription>
            Add a new university to your roster management system.
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
                placeholder="e.g., jsmith@university.edu"
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
                placeholder="e.g., (512) 555-1234"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.name.trim()}>
              {isSubmitting ? "Adding..." : "Add University"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
