import { KycKybStatus } from "./kyc-kyb";
import { UploadedDocuments } from "./uploaded-documents";
import { ComplianceFlags } from "./compliance-flags";
import { Beneficiary } from "../../types";

function ComplianceTab(props: Pick<Beneficiary, "compliance">) {
  return (
    <>
      <div className="flex gap-6 w-full mb-6">
        <KycKybStatus
          className="w-full"
          identity_verification={
            props.compliance.kyc_statuses.identity_verification
          }
          document_review={props.compliance.kyc_statuses.document_review}
          risk_assessment={props.compliance.kyc_statuses.risk_assessment}
        />
        <UploadedDocuments
          className="w-full"
          documents={props.compliance.documents}
        />
      </div>
      <ComplianceFlags flags={props.compliance.compliance_flags} />
    </>
  );
}

export { ComplianceTab };
