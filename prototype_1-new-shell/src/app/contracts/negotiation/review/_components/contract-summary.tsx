import { formatCentstoUSD, toDisplayDate } from "@/lib/formatters";
import { GetAgreementResponse } from "@/types/api-types";

function ContractSummary(props: GetAgreementResponse) {
  return (
    <div className="flex items-center gap-6 pt-3 border-t">
      <div>
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
          Agreement Value
        </p>
        <p className="text-sm font-semibold text-foreground">
          {formatCentstoUSD(props.total_scheduled_payments ?? 0)}
        </p>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
          Start Date
        </p>
        <p className="text-sm font-semibold text-foreground">
          {props.effective_at && toDisplayDate(props.effective_at)}
        </p>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
          End Date
        </p>
        <p className="text-sm font-semibold text-foreground">
          {props.expired_after && toDisplayDate(props.expired_after)}
        </p>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
          Payments
        </p>
        <p className="text-sm font-semibold text-foreground">
          {props.scheduled_payments?.length}
        </p>
      </div>
    </div>
  );
}

export { ContractSummary };
