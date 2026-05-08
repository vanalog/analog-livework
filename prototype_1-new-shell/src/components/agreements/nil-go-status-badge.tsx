import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { NilGoStatus } from "@/types/database";

const STATUS_LABELS: Record<NilGoStatus, string> = {
  pending: "Pending",
  submitted: "Submitted",
  resubmitted: "Re-submitted",
  rejected: "Rejected",
  approved: "Approved",
};

// Each status gets a distinct, calm color drawn from the project's existing
// palette: neutrals for "in motion" states, blue for in-flight, amber for
// resubmitted (action required), red for rejected, emerald for approved.
const STATUS_CLASSES: Record<NilGoStatus, string> = {
  pending:
    "bg-muted text-muted-foreground hover:bg-muted border-border",
  submitted:
    "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200",
  resubmitted:
    "bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200",
  rejected:
    "bg-red-50 text-red-700 hover:bg-red-50 border-red-200",
  approved:
    "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200",
};

interface NilGoStatusBadgeProps {
  status: NilGoStatus | null | undefined;
  className?: string;
}

/**
 * Colored pill for an agreement's NIL Go clearinghouse status. Returns a
 * muted dash when the agreement isn't subject to NIL Go (e.g. revenue share)
 * so list rows render consistently.
 */
export function NilGoStatusBadge({ status, className }: NilGoStatusBadgeProps) {
  if (!status) {
    return <span className="text-muted-foreground">--</span>;
  }
  return (
    <Badge
      variant="outline"
      className={cn(STATUS_CLASSES[status], className)}
    >
      {STATUS_LABELS[status]}
    </Badge>
  );
}

export const NIL_GO_STATUS_OPTIONS: { value: NilGoStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "submitted", label: "Submitted" },
  { value: "resubmitted", label: "Re-submitted" },
  { value: "rejected", label: "Rejected" },
  { value: "approved", label: "Approved" },
];
