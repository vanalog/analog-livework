"use client";

import { Pencil, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

interface NilTargetCardProps {
  hasTarget: boolean;
  targetAmount: number;
  raisedAmount: number;
  gapAmount: number;
  progressPercent: number;
  isFullyFunded: boolean;
  onEditClick: () => void;
}

export function NilTargetCard({
  hasTarget,
  targetAmount,
  raisedAmount,
  gapAmount,
  progressPercent,
  isFullyFunded,
  onEditClick,
}: NilTargetCardProps) {
  const cappedProgress = Math.min(100, progressPercent);
  const progressColor =
    cappedProgress >= 100
      ? "bg-emerald-500"
      : cappedProgress >= 75
        ? "bg-emerald-400"
        : cappedProgress >= 50
          ? "bg-amber-500"
          : cappedProgress >= 25
            ? "bg-amber-400"
            : "bg-slate-300";

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Target className="h-4 w-4" />
          NIL Target
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-7 text-xs"
            onClick={onEditClick}
          >
            <Pencil className="mr-1 h-3 w-3" />
            {hasTarget ? "Edit" : "Set"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {hasTarget ? (
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold tabular-nums">
                {formatCurrency(targetAmount)}
              </span>
              {isFullyFunded ? (
                raisedAmount > targetAmount ? (
                  <span className="text-sm font-semibold text-emerald-600 tabular-nums">
                    +{formatCurrency(raisedAmount - targetAmount)} over
                  </span>
                ) : (
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                    Funded
                  </Badge>
                )
              ) : (
                <span className="text-sm text-muted-foreground tabular-nums">
                  {formatCurrency(gapAmount)} gap
                </span>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatCurrency(raisedAmount)} raised</span>
                <span className={progressPercent > 100 ? "text-emerald-600 font-medium" : ""}>
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full ${progressColor} transition-all`}
                  style={{ width: `${cappedProgress}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No target set
          </p>
        )}
      </CardContent>
    </Card>
  );
}
