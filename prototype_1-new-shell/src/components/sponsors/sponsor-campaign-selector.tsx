"use client";

import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  mockSponsors,
  getCampaignsBySponsor,
  calculateSponsorBudgetTotals,
  calculateCampaignBudgetTotals,
  type Sponsor,
  type Campaign,
} from "@/lib/mock-data";

interface SponsorCampaignSelectorProps {
  selectedSponsorUuid?: string;
  selectedCampaignUuid?: string;
  appliesToIoi?: boolean;
  onSponsorChange: (sponsorUuid: string | undefined) => void;
  onCampaignChange: (campaignUuid: string | undefined) => void;
  onAppliesToIoiChange: (appliesToIoi: boolean) => void;
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function SponsorCampaignSelector({
  selectedSponsorUuid,
  selectedCampaignUuid,
  appliesToIoi = true,
  onSponsorChange,
  onCampaignChange,
  onAppliesToIoiChange,
}: SponsorCampaignSelectorProps) {
  const activeSponsors = useMemo(
    () => mockSponsors.filter((s) => s.status === "active"),
    []
  );

  const campaigns = useMemo(() => {
    if (!selectedSponsorUuid) return [];
    return getCampaignsBySponsor(selectedSponsorUuid).filter(
      (c) => c.status !== "completed"
    );
  }, [selectedSponsorUuid]);

  const selectedSponsor = useMemo(() => {
    if (!selectedSponsorUuid) return null;
    return mockSponsors.find((s) => s.uuid === selectedSponsorUuid);
  }, [selectedSponsorUuid]);

  const selectedCampaign = useMemo(() => {
    if (!selectedCampaignUuid) return null;
    return campaigns.find((c) => c.uuid === selectedCampaignUuid);
  }, [selectedCampaignUuid, campaigns]);

  const sponsorBudget = useMemo(() => {
    if (!selectedSponsorUuid) return null;
    return calculateSponsorBudgetTotals(selectedSponsorUuid);
  }, [selectedSponsorUuid]);

  const campaignBudget = useMemo(() => {
    if (!selectedCampaignUuid) return null;
    return calculateCampaignBudgetTotals(selectedCampaignUuid);
  }, [selectedCampaignUuid]);

  return (
    <div className="space-y-4">
      {/* Sponsor Selection */}
      <div className="space-y-2">
        <Label htmlFor="sponsor">Sponsor *</Label>
        <Select
          value={selectedSponsorUuid || ""}
          onValueChange={(value) => {
            onSponsorChange(value || undefined);
            onCampaignChange(undefined); // Reset campaign when sponsor changes
          }}
        >
          <SelectTrigger id="sponsor">
            <SelectValue placeholder="Select a sponsor" />
          </SelectTrigger>
          <SelectContent>
            {activeSponsors.map((sponsor) => {
              const budget = calculateSponsorBudgetTotals(sponsor.uuid);
              return (
                <SelectItem key={sponsor.uuid} value={sponsor.uuid}>
                  <div className="flex items-center justify-between gap-4">
                    <span>{sponsor.name}</span>
                    {sponsor.totalBudget !== undefined && budget.remaining !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        {formatCurrency(budget.remaining)} remaining
                      </span>
                    )}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {/* Sponsor budget info */}
        {selectedSponsor && sponsorBudget && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{selectedSponsor.industry}</span>
            {selectedSponsor.totalBudget !== undefined && (
              <>
                <span className="text-border">|</span>
                <span>
                  Budget: {formatCurrency(selectedSponsor.totalBudget)} (
                  {formatCurrency(sponsorBudget.remaining || 0)} remaining)
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Campaign Selection (optional) */}
      {selectedSponsorUuid && (
        <div className="space-y-2">
          <Label htmlFor="campaign">Campaign (optional)</Label>
          <Select
            value={selectedCampaignUuid || "none"}
            onValueChange={(value) =>
              onCampaignChange(value === "none" ? undefined : value)
            }
          >
            <SelectTrigger id="campaign">
              <SelectValue placeholder="Select a campaign (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">
                <span className="text-muted-foreground">No campaign (standalone)</span>
              </SelectItem>
              {campaigns.map((campaign) => {
                const budget = calculateCampaignBudgetTotals(campaign.uuid);
                return (
                  <SelectItem key={campaign.uuid} value={campaign.uuid}>
                    <div className="flex items-center gap-2">
                      <span>{campaign.name}</span>
                      <Badge
                        variant="secondary"
                        className={
                          campaign.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }
                      >
                        {campaign.status}
                      </Badge>
                      {campaign.budget !== undefined && budget.remaining !== undefined && (
                        <span className="text-xs text-muted-foreground">
                          ({formatCurrency(budget.remaining)} remaining)
                        </span>
                      )}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {/* Campaign budget info */}
          {selectedCampaign && campaignBudget && (
            <div className="text-sm text-muted-foreground">
              {selectedCampaign.description && (
                <p>{selectedCampaign.description}</p>
              )}
              {selectedCampaign.budget !== undefined && (
                <p className="mt-1">
                  Campaign budget: {formatCurrency(selectedCampaign.budget)} (
                  {formatCurrency(campaignBudget.remaining || 0)} remaining)
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Applies to IOI checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="appliesToIoi"
          checked={appliesToIoi}
          onCheckedChange={(checked) => onAppliesToIoiChange(checked === true)}
        />
        <Label htmlFor="appliesToIoi" className="text-sm font-normal">
          Applies to IOI target
        </Label>
      </div>
      <p className="text-xs text-muted-foreground -mt-2">
        Check this if this agreement should count toward the athlete&apos;s indication of
        interest target. Leave unchecked for local deals that don&apos;t factor into IOI tracking.
      </p>
    </div>
  );
}
