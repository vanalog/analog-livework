import { HTMLAttributes } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BeneficiaryStatusBadge } from "@/app/beneficiaries/components/beneficiary-status-badge";
import { KYCStatuses } from "../../types";
import { cn } from "@/lib/utils";

type KycKybStatusProps = KYCStatuses & HTMLAttributes<HTMLDivElement>;

function KycKybStatus(props: KycKybStatusProps) {
  return (
    <Card className={cn(props.className, "shadow-none")}>
      <CardHeader>
        <CardTitle>
          <h3 className="text-2xl font-semibold">KYC/KYB Status</h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Identity Verification</span>
            <BeneficiaryStatusBadge
              status={props.identity_verification}
              displayIcon={false}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Document Review</span>
            <BeneficiaryStatusBadge
              status={props.document_review}
              displayIcon={false}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Risk Assessment</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { KycKybStatus };
