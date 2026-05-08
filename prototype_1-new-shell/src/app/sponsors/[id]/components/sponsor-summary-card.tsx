"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Mail, Phone, Pencil, Trash2 } from "lucide-react";
import type { Sponsor } from "@/types/database";

interface BudgetTotals {
  totalBudget: number;
  totalCommitted: number;
  agreementCount: number;
}

interface SponsorSummaryCardProps {
  sponsor: Sponsor;
  budgetTotals: BudgetTotals;
  onEdit?: () => void;
  onDelete?: () => void;
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function SponsorSummaryCard({ 
  sponsor, 
  budgetTotals, 
  onEdit, 
  onDelete 
}: SponsorSummaryCardProps) {
  const hasBudget = budgetTotals.totalBudget > 0;
  const remaining = budgetTotals.totalBudget - budgetTotals.totalCommitted;

  return (
    <Card>
      <CardContent className="pt-6">
        {/* Top section: Name/Industry/Status on left, Committed amount on right */}
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{sponsor.name}</h1>
            <p className="text-muted-foreground">{sponsor.industry}</p>
          </div>
          
          {/* Total Committed Value */}
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Total Committed</p>
            <p className="text-3xl font-bold tabular-nums">
              {formatCurrency(budgetTotals.totalCommitted)}
            </p>
          </div>
        </div>

        {/* Contact info row */}
        <div className="flex flex-wrap items-center gap-6 border-t pt-6 text-sm">
          {(sponsor.contact_name || sponsor.contact_email) && (
            <div className="flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {sponsor.contact_name && <span>{sponsor.contact_name}</span>}
              {sponsor.contact_email && <span>{sponsor.contact_email}</span>}
            </div>
          )}
          {sponsor.contact_phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{sponsor.contact_phone}</span>
            </div>
          )}
          {sponsor.website && (
            <a
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:underline"
            >
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span>{sponsor.website.replace(/^https?:\/\//, "")}</span>
            </a>
          )}
        </div>

        {/* Budget overview row */}
        <div className="flex items-center gap-8 border-t pt-6 mt-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Budget</p>
            <p className="text-lg font-semibold">
              {hasBudget ? formatCurrency(budgetTotals.totalBudget) : "Not set"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className={`text-lg font-semibold ${
              hasBudget
                ? remaining > 0
                  ? "text-emerald-600"
                  : "text-red-600"
                : ""
            }`}>
              {hasBudget ? formatCurrency(remaining) : "No limit"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Agreements</p>
            <p className="text-lg font-semibold">{budgetTotals.agreementCount}</p>
          </div>

          {/* Edit and Delete buttons */}
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={onDelete} 
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
