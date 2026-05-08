import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Payout } from "./columns";

const AvailableBadge = memo(function AvailableBadge() {
  return (
    <Badge variant="secondary" className="rounded-full font-semibold">
      Available
    </Badge>
  );
});

const PendingBadge = memo(function CompletedBadge() {
  return (
    <Badge variant="outline" className="rounded-full font-semibold">
      Pending
    </Badge>
  );
});

const PostedBadge = memo(function PostedBadge() {
  return (
    <Badge variant="secondary" className="rounded-full font-semibold">
      Posted
    </Badge>
  );
});

const CompletedBadge = memo(function CompletedBadge() {
  return <Badge className="rounded-full font-semibold">Completed</Badge>;
});

const UnknownRisk = () => null;

const TRANSACTION_STATUS_BADGES = {
  available: AvailableBadge,
  pending: PendingBadge,
  posted: PostedBadge,
  completed: CompletedBadge,
} as const;

interface TransactionStatusBadges {
  status: Payout["status"];
}

const TransactionStatusBadge = memo(function TransactionStatusBadge({
  status,
}: TransactionStatusBadges) {
  const BadgeComponent = TRANSACTION_STATUS_BADGES[status] ?? UnknownRisk;
  return <BadgeComponent />;
});

export { TransactionStatusBadge };
