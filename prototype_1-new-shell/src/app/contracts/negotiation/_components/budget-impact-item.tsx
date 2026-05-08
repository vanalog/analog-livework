import { formatCompactAsset, formatPercent } from "@/lib/formatters";
import { CompactFormattedAsset } from "./compact-formatted-asset";

export function BudgetImpactItem(props: {
  disabled?: boolean;
  periodName?: string;
  asset: string;
  thisContractTotal: number;
  planned: number;
  allocated: number;
  available: number;
}) {
  const overBudget = props.available < 0;
  const pctAvailable =
    props.planned === 0 ? 0 : Math.max(0, props.available / props.planned);

  return (
    <div
      className={`rounded-lg border p-4 transition-colors border-border bg-background ${overBudget && "border-red-200 bg-red-50/50"}`}
    >
      <div className="mb-3">
        <span className="text-base font-semibold text-foreground">
          {props.periodName}
        </span>
        {overBudget && (
          <span className="ml-2 text-xs font-medium text-red-600">
            Over Cap
          </span>
        )}
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            This Agreement
          </span>
          <span className="font-medium">
            <CompactFormattedAsset
              disabled={props.disabled}
              asset={props.asset}
              amount={props.thisContractTotal}
            />
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Active &amp; In Review</span>
          <span className="font-medium">
            <CompactFormattedAsset
              disabled={props.disabled}
              asset={props.asset}
              amount={props.allocated}
            />
          </span>
        </div>
        <div className="h-px bg-border my-1"></div>
        <div className="flex items-center justify-between">
          <span
            className={`font-medium ${overBudget ? "text-red-600" : " text-muted-foreground "}`}
          >
            Remaining Cap
          </span>
          <span
            className={`font-bold ${overBudget ? "text-red-600" : " text-emerald-600"}`}
          >
            <CompactFormattedAsset
              disabled={props.disabled}
              asset={props.asset}
              amount={props.available}
            />
          </span>
        </div>
      </div>
      <div className="mt-3">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${overBudget ? "bg-red-500" : "bg-emerald-500"}`}
            style={{
              width: overBudget ? "100%" : formatPercent(pctAvailable),
            }}
          ></div>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 text-right">
          {formatPercent(pctAvailable)} of{" "}
          {formatCompactAsset(props.asset, props.planned)} cap
        </p>
      </div>
    </div>
  );
}
