"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScheduledPaymentResponse } from "@/types/api-types";
import { formatCentstoUSD, toDisplayDate } from "@/lib/formatters";
import { useSwapExchanges } from "../../_hooks/use-swap-exchanges";

interface ConfirmRowReorderDialogProps {
  agreementUUID: string | undefined;
  open: boolean;
  sourceRow: ScheduledPaymentResponse | undefined;
  targetRow: ScheduledPaymentResponse | undefined;
  reset: () => void;
}

function PaymentDate({ date }: { date: string | undefined }) {
  return <>{date ? toDisplayDate(date) : "-"}</>;
}

function ConfirmRowReorderDialog(props: ConfirmRowReorderDialogProps) {
  const { handleSwapExchanges } = useSwapExchanges(props.agreementUUID);

  function onSubmit() {
    if (!props.sourceRow || !props.targetRow) {
      return;
    }

    handleSwapExchanges(
      {
        first_obligation_uuid: props.sourceRow.obligation_uuid,
        second_obligation_uuid: props.targetRow.obligation_uuid,
      },
      props.reset,
    );
  }

  return (
    <Dialog
      open={props.open}
      onOpenChange={(open) => {
        if (!open) props.reset();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Payment Reorder</DialogTitle>
          <DialogDescription>
            This will swap the dates between these two payments. Are you sure?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-medium p-2 rounded bg-muted/50">
            <div>
              {props.sourceRow?.ledger_balance.balance
                ? formatCentstoUSD(props.sourceRow.ledger_balance.balance)
                : "-"}
            </div>
            <div className="flex gap-2 text-muted-foreground">
              <PaymentDate date={props.sourceRow?.not_before} />
              <div>→</div>
              <PaymentDate date={props.targetRow?.not_before} />
            </div>
          </div>
          <div className="flex justify-between text-sm font-medium p-2 rounded bg-muted/50">
            <div>
              {props.targetRow?.ledger_balance?.balance
                ? formatCentstoUSD(props.targetRow.ledger_balance?.balance)
                : "-"}
            </div>
            <div className="flex gap-2 text-muted-foreground">
              <PaymentDate date={props.targetRow?.not_before} />
              <div>→</div>
              <PaymentDate date={props.sourceRow?.not_before} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={props.reset}>
            Cancel
          </Button>
          <Button type="button" onClick={onSubmit}>
            Confirm swap
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ConfirmRowReorderDialog };
