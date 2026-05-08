import { GetAgreementResponse } from "@/types/api-types";

export function Description(props: GetAgreementResponse) {
  return (
    <p className="text-sm text-muted-foreground mb-3">
      Review the payment schedule for this athlete across{" "}
      {props.scheduled_payments.length} scheduled payments.
    </p>
  );
}
