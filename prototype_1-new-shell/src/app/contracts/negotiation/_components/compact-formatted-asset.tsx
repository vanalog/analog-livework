import { Skeleton } from "@/components/ui/skeleton";
import { formatCompactAsset } from "@/lib/formatters";

export function CompactFormattedAsset(props: {
  disabled?: boolean;
  asset: string;
  amount: number;
}) {
  if (props.disabled) {
    return <Skeleton className="h-5 w-10" />;
  }

  return <>{formatCompactAsset(props.asset, props.amount)}</>;
}
