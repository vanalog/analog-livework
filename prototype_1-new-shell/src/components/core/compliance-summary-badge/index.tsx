import { memo } from "react";
import {
  CircleCheckBig,
  FileQuestion,
  TriangleAlert,
  CircleX,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ContractStatus } from "@/types/api-types";

const CompliantBadge = memo(function CompliantBadge() {
  return (
    <Badge className="rounded-full font-semibold">
      <CircleCheckBig className="w-4 h-4 text-green-500" />
      Compliant
    </Badge>
  );
});

const NeedsReviewBadge = memo(function NeedsReviewBadge() {
  return (
    <Badge variant="secondary" className="rounded-full font-semibold">
      <TriangleAlert className="w-4 h-4 text-orange-500" />
      Needs Review
    </Badge>
  );
});

const NonCompliantBadge = memo(function NonCompliantBadge() {
  return (
    <Badge variant="destructive" className="rounded-full">
      <CircleX className="w-4 h-4 text-destructive text-white" />
      Non-Compliant
    </Badge>
  );
});

const UnknownStatusBadge = memo(function UnknownStatusBadge() {
  return (
    <Badge variant="secondary" className="rounded-full">
      <FileQuestion className="w-4 h-4 text-orange-500" />
      Processing
    </Badge>
  );
});

const COMPLIANCE_BADGES = {
  approved: CompliantBadge,
  "under-review": NeedsReviewBadge,
  rejected: NonCompliantBadge,
} as const;

interface ComplianceSummaryBadgeProps {
  status: ContractStatus;
}

const ComplianceSummaryBadge = memo(function ComplianceSummaryBadge({
  status,
}: ComplianceSummaryBadgeProps) {
  const BadgeComponent = COMPLIANCE_BADGES[status] || UnknownStatusBadge;
  return <BadgeComponent />;
});

export { ComplianceSummaryBadge };
