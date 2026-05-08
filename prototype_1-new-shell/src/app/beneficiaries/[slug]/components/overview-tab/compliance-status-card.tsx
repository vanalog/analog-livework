import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BeneficiaryStatusBadge } from "@/app/beneficiaries/components/beneficiary-status-badge";

function ComplianceStatusCard() {
  return (
    <Card>
      <CardHeader className="gap-0">
        <CardTitle>
          <h3 className="text-2xl font-semibold">Compliance Status</h3>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">KYC Status</span>
          <BeneficiaryStatusBadge status="verified" displayIcon={false} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Compliance Flags</span>
          <Badge variant="outline" className="rounded-full font-semibold">
            0 Flags
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Escalation Status</span>
          <Badge variant="outline" className="rounded-full font-semibold">
            Normal
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export { ComplianceStatusCard };
