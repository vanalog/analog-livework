import { Status } from "../components/beneficiary-status-badge";

export interface Beneficiary {
  uuid: string;
  name: string;
  university: string;
  status: "verified" | "in-progress" | "needs-review" | "blocked";
  contractCount: number;
  totalValue: number;
  compliance: {
    documents: Document[];
    compliance_flags: ComplianceFlag[];
    kyc_statuses: KYCStatuses;
  };
  activities: Activity[];
}

export interface KYCStatuses {
  identity_verification: Status;
  document_review: Status;
  risk_assessment: number;
}

export interface Document {
  uuid: string;
  filename: string;
  type: string;
  date: string;
}

export interface ComplianceFlag {
  uuid: string;
  title: string;
  detail: string;
}

interface Activity {
  uuid: string;
  event: string;
  timestamp: string;
}
