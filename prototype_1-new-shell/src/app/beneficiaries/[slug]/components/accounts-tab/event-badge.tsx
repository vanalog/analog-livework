import { memo } from "react";
import { Payout } from "./columns";

interface EventBadgeProps {
  event: Payout["event"];
}

const TRANSFER_OUT_LABEL = (
  <>
    <div>Transfer Out</div>
    <div className="text-xs text-muted-foreground">Transfer out (manual)</div>
  </>
);

const EVENT_LABELS = {
  allocation: "Allocation",
  "milestone-met": "Milestone met",
  "transfer-out": TRANSFER_OUT_LABEL,
} as const;

interface EventBadgeProps {
  event: Payout["event"];
}

const EventBadge = memo(function EventBadge({ event }: EventBadgeProps) {
  return EVENT_LABELS[event] ?? null;
});

export { EventBadge };
