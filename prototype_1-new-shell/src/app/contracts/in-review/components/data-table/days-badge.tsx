import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DaysBadgeProps {
  days: number;
}

const DaysBadge = memo(function DaysBadge({ days }: DaysBadgeProps) {
  if (!days) return null;

  return (
    <Badge
      className={cn(
        "font-semibold rounded-md",
        days > 5
          ? "bg-destructive text-white"
          : "bg-secondary text-secondary-foreground",
      )}
    >
      {days}d
    </Badge>
  );
});

export { DaysBadge };
