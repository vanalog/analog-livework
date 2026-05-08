"use client";

import { useState, useMemo } from "react";
import { useSWRConfig } from "swr";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
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
import { Plus, FileText, Loader2 } from "lucide-react";
import { useAthletes, useSponsors } from "@/lib/hooks/use-data";
import { createAgreement } from "@/lib/data";
import type { AgreementInsert } from "@/types/database";

type AgreementType = "sponsorship" | "revenue_share";

type AddAgreementDialogProps = {
  defaultAthleteId?: string;
  defaultSponsorId?: string;
  defaultCampaignId?: string;
  trigger?: React.ReactNode;
  /** When true, only allows sponsorship agreements (hides revenue share option) */
  sponsorshipOnly?: boolean;
};

export function AddAgreementDialog({ defaultAthleteId, defaultSponsorId, defaultCampaignId, trigger, sponsorshipOnly }: AddAgreementDialogProps = {}) {
  const { mutate } = useSWRConfig();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Default to sponsorship when sponsorshipOnly is true or when a sponsor is pre-selected
  const [agreementType, setAgreementType] = useState<AgreementType>(
    sponsorshipOnly || defaultSponsorId ? "sponsorship" : "revenue_share"
  );
  const [formData, setFormData] = useState({
    athleteId: defaultAthleteId || "",
    sponsorId: defaultSponsorId || "",
    campaignId: defaultCampaignId || "",
    amount: "",
    appliesToIoi: true,
    startDate: "",
    endDate: "",
    notes: "",
  });

  // Fetch athletes and sponsors
  const { data: athletes } = useAthletes();
  const { data: sponsors } = useSponsors();
  // Campaign fetching disabled - feature hidden for now
  // const { data: campaigns } = useCampaignsBySponsor(formData.sponsorId || null);

  // Filter and sort athletes
  const sortedAthletes = useMemo(() => {
    if (!athletes) return [];
    return [...athletes]
      .filter((a) => a.status === "active")
      .sort((a, b) => (a.last_name || "").localeCompare(b.last_name || ""));
  }, [athletes]);

  // Filter and sort sponsors
  const sortedSponsors = useMemo(() => {
    if (!sponsors) return [];
    return [...sponsors].sort((a, b) => a.name.localeCompare(b.name));
  }, [sponsors]);

  const handleSponsorChange = (sponsorId: string) => {
    setFormData({
      ...formData,
      sponsorId,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const amountInCents = Math.round(parseFloat(formData.amount) * 100);

      // For revenue share, get the athlete's university_id
      const selectedAthlete = athletes?.find(a => a.id === formData.athleteId);
      const universityId = agreementType === "revenue_share" && selectedAthlete?.university_id 
        ? selectedAthlete.university_id 
        : null;

      const agreementData: AgreementInsert = {
        athlete_id: formData.athleteId,
        sponsor_id: agreementType === "sponsorship" ? formData.sponsorId : null,
        campaign_id: formData.campaignId || null,
        university_id: universityId,
        type: agreementType,
        amount_cents: amountInCents,
        applies_to_ioi: agreementType === "sponsorship" ? formData.appliesToIoi : false,
        start_date: formData.startDate || null,
        end_date: formData.endDate || null,
        status: "draft",
        // Sponsorships start at "pending" in the NIL Go workflow; revenue
        // share agreements don't go through the clearinghouse.
        nil_go_status: agreementType === "sponsorship" ? "pending" : null,
        notes: formData.notes || null,
      };

      await createAgreement(agreementData);

      // Invalidate agreements cache
      mutate("agreements");
      mutate("agreements-with-relations");

      // Reset form
      setFormData({
        athleteId: defaultAthleteId || "",
        sponsorId: defaultSponsorId || "",
        campaignId: defaultCampaignId || "",
        amount: "",
        appliesToIoi: true,
        startDate: "",
        endDate: "",
        notes: "",
      });
      // Reset to appropriate type based on context
      setAgreementType(sponsorshipOnly || defaultSponsorId ? "sponsorship" : "revenue_share");
      setOpen(false);
    } catch (error) {
      console.error("Failed to create agreement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid =
    formData.athleteId &&
    formData.amount &&
    parseFloat(formData.amount) > 0 &&
    formData.startDate &&
    formData.endDate &&
    // Sponsorship requires a sponsor
    (agreementType === "revenue_share" || formData.sponsorId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-50/50 hover:text-blue-700 hover:border-blue-300 shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Agreement
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Add New Agreement
          </DialogTitle>
          <DialogDescription>
            {sponsorshipOnly || defaultSponsorId
              ? "Create a new sponsorship agreement with an athlete."
              : "Create a new sponsorship or revenue share agreement with an athlete."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Agreement Type - only show when not restricted to sponsorship */}
          {!sponsorshipOnly && !defaultSponsorId && (
            <div className="space-y-2">
              <Label>Agreement Type *</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={agreementType === "revenue_share" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setAgreementType("revenue_share")}
                >
                  Revenue Share
                </Button>
                <Button
                  type="button"
                  variant={agreementType === "sponsorship" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setAgreementType("sponsorship")}
                >
                  Sponsorship
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {agreementType === "sponsorship"
                  ? "Sponsor-funded agreement with optional campaign"
                  : "Internal revenue share arrangement with athlete"}
              </p>
            </div>
          )}

          {/* Athlete */}
          <div className="space-y-2">
            <Label htmlFor="athlete">Athlete *</Label>
            <Select
              value={formData.athleteId}
              onValueChange={(value) =>
                setFormData({ ...formData, athleteId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select athlete" />
              </SelectTrigger>
              <SelectContent>
                {sortedAthletes.map((athlete) => (
                  <SelectItem key={athlete.id} value={athlete.id}>
                    <span>
                      {athlete.first_name} {athlete.last_name}
                    </span>
                    {athlete.sport && (
                      <span className="ml-2 text-muted-foreground capitalize">
                        ({athlete.sport.replace("_", " ")})
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sponsor (only for sponsorship type) */}
          {agreementType === "sponsorship" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="sponsor">Sponsor *</Label>
                {/* Lock sponsor when defaultSponsorId is provided (coming from sponsor page) */}
                {defaultSponsorId ? (
                  <Input
                    value={sortedSponsors.find(s => s.id === defaultSponsorId)?.name || "Loading..."}
                    disabled
                    className="bg-muted"
                  />
                ) : (
                  <Select
                    value={formData.sponsorId}
                    onValueChange={handleSponsorChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sponsor" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortedSponsors.map((sponsor) => (
                        <SelectItem key={sponsor.id} value={sponsor.id}>
                          {sponsor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Campaign selector hidden - feature disabled for now */}
            </>
          )}

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <CurrencyInput
              id="amount"
              value={formData.amount}
              onChange={(value) =>
                setFormData({ ...formData, amount: value })
              }
              placeholder="5,000"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
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
              <Label htmlFor="endDate">End Date *</Label>
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
          {agreementType === "sponsorship" && (
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="appliesToIoi" className="cursor-pointer">
                  Applies to IOI
                </Label>
                <p className="text-xs text-muted-foreground">
                  Does this agreement count toward the athlete&apos;s IOI target?
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
            <Label htmlFor="notes">Notes (optional)</Label>
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
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Agreement
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
