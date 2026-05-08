import { memo } from "react";
import { Badge } from "@/components/ui/badge";

const CompletedBadge = memo(function CompletedBadge() {
  return (
    <Badge className="rounded-full font-semibold bg-green-100 text-green-800">
      Completed
    </Badge>
  );
});

const PendingBadge = memo(function PendingBadge() {
  return (
    <Badge className="rounded-full font-semibold bg-gray-100 text-gray-800">
      Pending
    </Badge>
  );
});

const UnknownStatusBadge = memo(function UnknownStatusBadge() {
  return null;
});

const DISBURSEMENT_BADGES = {
  completed: CompletedBadge,
  pending: PendingBadge,
} as const;

interface DisbursementBadgesProps {
  status: "completed" | "pending";
}

const DisbursementBadges = memo(function ComplianceSummaryBadge({
  status,
}: DisbursementBadgesProps) {
  const BadgeComponent = DISBURSEMENT_BADGES[status] || UnknownStatusBadge;
  return <BadgeComponent />;
});

export { DisbursementBadges };
