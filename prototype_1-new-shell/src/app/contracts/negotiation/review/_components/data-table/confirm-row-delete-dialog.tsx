"use client";

import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCentstoUSD, toDisplayDate } from "@/lib/formatters";
import { useDeleteExchange } from "../../_hooks/use-delete-exchange";

interface ConfirmRowDeleteDialogProps {
  agreementUUID: string | undefined;
  exchangeUUID: string;
  amount: number;
  paymentDate: string;
}

function ConfirmRowDeleteDialog(props: ConfirmRowDeleteDialogProps) {
  const { handleDeleteExchange } = useDeleteExchange(props.agreementUUID);

  function onConfirm() {
    handleDeleteExchange(props.exchangeUUID);
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Trash2 className="w-4 h-4 text-muted-foreground cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Payment</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this payment? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 text-sm py-4">
          <div className="flex justify-between">
            <div className="text-muted-foreground">Amount:</div>
            <div className="font-medium">{formatCentstoUSD(props.amount)}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-muted-foreground">Payment Date:</div>
            <div className="font-medium">
              {toDisplayDate(props.paymentDate)}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" type="button" onClick={onConfirm}>
            Delete payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ConfirmRowDeleteDialog };
