"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Plus, Check, Trash2 } from "lucide-react";
import type { Campaign, AgreementWithRelations } from "@/types/database";
import { AddAgreementDialog } from "@/app/agreements/components/add-agreement-dialog";

interface CampaignDetailDialogProps {
  campaign: Campaign | null;
  agreements: AgreementWithRelations[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800",
  completed: "bg-slate-100 text-slate-800",
  draft: "bg-amber-100 text-amber-800",
};

export function CampaignDetailDialog({
  campaign,
  agreements,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: CampaignDetailDialogProps) {
  const router = useRouter();
  
  if (!campaign) return null;

  const totalCommitted = agreements.reduce(
    (sum, a) => sum + (a.amount_cents || 0),
    0
  );
  const hasBudget = campaign.budget_cents !== null && campaign.budget_cents !== undefined;
  const remaining = hasBudget ? campaign.budget_cents! - totalCommitted : null;
  const progress = hasBudget && campaign.budget_cents! > 0
    ? (totalCommitted / campaign.budget_cents!) * 100
    : 0;
  const cappedProgress = Math.min(100, progress);
  const progressColor =
    cappedProgress >= 90
      ? "bg-red-500"
      : cappedProgress >= 75
      ? "bg-amber-500"
      : "bg-emerald-500";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader className="pr-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-xl">{campaign.name}</DialogTitle>
              <Badge
                variant="secondary"
                className={statusColors[campaign.status || "draft"]}
              >
                {campaign.status || "draft"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onDelete}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {campaign.description && (
            <DialogDescription>{campaign.description}</DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {/* Budget overview */}
          <div className="rounded-lg border p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="text-xl font-bold">
                  {hasBudget ? formatCurrency(campaign.budget_cents!) : "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Committed</p>
                <p className="text-xl font-bold tabular-nums">
                  {formatCurrency(totalCommitted)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p
                  className={`text-xl font-bold tabular-nums ${
                    hasBudget
                      ? remaining! > 0
                        ? "text-emerald-600"
                        : "text-red-600"
                      : ""
                  }`}
                >
                  {hasBudget
                    ? formatCurrency(remaining!)
                    : "No limit"}
                </p>
              </div>
            </div>

            {hasBudget && (
              <div className="mt-4 space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Utilization</span>
                  <span className="tabular-nums font-medium">
                    {Math.round(cappedProgress)}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full ${progressColor} transition-all`}
                    style={{ width: `${cappedProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Agreements */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-medium">Agreements ({agreements.length})</h3>
              <AddAgreementDialog
                defaultSponsorId={campaign.sponsor_id}
                defaultCampaignId={campaign.id}
                trigger={
                  <Button size="sm" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Agreement
                  </Button>
                }
              />
            </div>

            {agreements.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No agreements in this campaign yet.
              </p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Athlete</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-center">NIL Target</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agreements.map((agreement) => (
                      <TableRow
                        key={agreement.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => router.push(`/agreements/${agreement.id}`)}
                      >
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {agreement.athlete.first_name}{" "}
                              {agreement.athlete.last_name}
                            </span>
                            <span className="text-xs text-muted-foreground capitalize">
                              {agreement.athlete.sport?.replace("_", " ")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right tabular-nums font-medium">
                          {formatCurrency(agreement.amount_cents || 0)}
                        </TableCell>
                        <TableCell className="text-center">
                          {agreement.applies_to_ioi ? (
                            <Check className="mx-auto h-4 w-4 text-emerald-600" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
