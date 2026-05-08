import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, Clock } from "lucide-react";

type Status =
  | "verified"
  | "in-progress"
  | "needs-review"
  | "blocked"
  | "completed";

interface BeneficiaryStatusBadgeProps {
  status: "verified" | "in-progress" | "needs-review" | "blocked" | "completed";
  displayIcon?: boolean;
}

type BadgeProps = Pick<BeneficiaryStatusBadgeProps, "displayIcon">;

const VerifiedBadge = memo(function VerifiedBadge(props: BadgeProps) {
  return (
    <Badge className="rounded-full font-semibold bg-green-100 text-green-800">
      {props.displayIcon && <CircleCheck />} Verified
    </Badge>
  );
});

const CompletedBadge = memo(function CompletedBadge(props: BadgeProps) {
  return (
    <Badge className="rounded-full font-semibold bg-green-100 text-green-800">
      {props.displayIcon && <CircleCheck />} Completed
    </Badge>
  );
});

const InProgressBadge = memo(function InProgressBadge(props: BadgeProps) {
  return (
    <Badge className="rounded-full font-semibold bg-blue-100 text-blue-800">
      {props.displayIcon && <Clock />} In Progress
    </Badge>
  );
});

const NeedsReviewBadge = memo(function NeedsReviewBadge(props: BadgeProps) {
  void props;
  return (
    <Badge className="rounded-full font-semibold" variant="outline">
      Needs Review
    </Badge>
  );
});

const BlockedBadge = memo(function BlockedBadge(props: BadgeProps) {
  void props;
  return (
    <Badge className="rounded-full font-semibold" variant="destructive">
      Blocked
    </Badge>
  );
});

const BENEFICIARY_STATUS_BADGES = {
  verified: VerifiedBadge,
  "in-progress": InProgressBadge,
  "needs-review": NeedsReviewBadge,
  blocked: BlockedBadge,
  completed: CompletedBadge,
} as const;

const BeneficiaryStatusBadge = memo(function BeneficiaryStatusBadge({
  status,
  displayIcon = true,
}: BeneficiaryStatusBadgeProps) {
  const BadgeComponent = BENEFICIARY_STATUS_BADGES[status] || null;
  return <BadgeComponent displayIcon={displayIcon} />;
});

export { BeneficiaryStatusBadge };
export type { Status };
