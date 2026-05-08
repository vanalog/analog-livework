"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Calendar, ChevronRight } from "lucide-react";
import type { Campaign, Agreement } from "@/types/database";

interface CampaignsSectionProps {
  campaigns: Campaign[];
  agreements: Agreement[];
  onAddCampaign?: () => void;
  onViewCampaign?: (campaign: Campaign) => void;
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}



export function CampaignsSection({
  campaigns,
  agreements,
  onAddCampaign,
  onViewCampaign,
}: CampaignsSectionProps) {
  // Compute agreement counts and totals per campaign
  const getCampaignStats = (campaignId: string) => {
    const campaignAgreements = agreements.filter(a => a.campaign_id === campaignId);
    const count = campaignAgreements.length;
    const totalCommitted = campaignAgreements.reduce((sum, a) => sum + (a.amount_cents || 0), 0);
    return { count, totalCommitted };
  };
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-medium">Campaigns</CardTitle>
        <Button variant="outline" size="sm" onClick={onAddCampaign}>
          <Plus className="mr-2 h-4 w-4" />
          Add Campaign
        </Button>
      </CardHeader>
      <CardContent>
        {campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">
              No campaigns yet. Create a campaign to group related agreements.
            </p>
            <Button variant="outline" className="mt-4" onClick={onAddCampaign}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Campaign
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead className="text-right">Agreements</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                  <TableHead className="text-right">Committed</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => {
                  const stats = getCampaignStats(campaign.id);
                  return (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <span className="font-medium">{campaign.name}</span>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {stats.count}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {campaign.budget_cents ? (
                          formatCurrency(campaign.budget_cents)
                        ) : (
                          <span className="text-muted-foreground">--</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(stats.totalCommitted)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewCampaign?.(campaign)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
