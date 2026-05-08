"use client";

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

interface BudgetProgressBarProps {
  progress: number;
  totalSponsorships: number;
  ioi: number;
}

export function BudgetProgressBar({
  progress,
  totalSponsorships,
  ioi,
}: BudgetProgressBarProps) {
  // Determine color based on progress - for athletes, exceeding target is GOOD
  const getProgressColor = (percent: number) => {
    if (percent >= 100) return "bg-emerald-500";
    if (percent >= 75) return "bg-emerald-400";
    if (percent >= 50) return "bg-amber-400";
    if (percent >= 25) return "bg-amber-500";
    return "bg-red-400";
  };

  const progressColor = getProgressColor(progress);
  const displayProgress = Math.min(100, progress);
  const isOverTarget = progress > 100;
  const surplusAmount = totalSponsorships - ioi;

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-2 w-full min-w-[100px] overflow-hidden rounded-full bg-muted">
        <div
          className={`absolute left-0 top-0 h-full transition-all ${progressColor}`}
          style={{ width: `${displayProgress}%` }}
        />
      </div>
      {isOverTarget ? (
        <span className="w-20 text-right text-xs font-medium tabular-nums text-emerald-600">
          +{formatCurrency(surplusAmount)}
        </span>
      ) : (
        <span className="w-12 text-right text-xs font-medium tabular-nums">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
}
