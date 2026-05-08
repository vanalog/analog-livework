"use client";

import { useState } from "react";
import { Download, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatCentstoUSD,
  toDisplayDate,
  toDisplayDateShort,
} from "@/lib/formatters";
import { ScheduledPaymentResponse } from "@/types/api-types";
import { UTCDate } from "@date-fns/utc";
import { format } from "date-fns";

interface ScheduleTableProps {
  payments: ScheduledPaymentResponse[];
  total: number;
}

function toNumericDate(timestamp: string): string {
  return format(new UTCDate(timestamp), "M/d/yyyy");
}

function centsToDollars(cents: number): string {
  return `$ ${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function csvField(value: string | number): string {
  const str = String(value);
  return str.includes(",") ? `"${str}"` : str;
}

function buildCsvContent(payments: ScheduledPaymentResponse[]): string {
  const header = ["Payment Period", "Dates", "Amount", "Payment Date"];
  const rows = payments.map((p, i) => [
    i + 1,
    `${toNumericDate(p.not_before)}-${toNumericDate(p.not_after)}`,
    centsToDollars(p.ledger_balance.balance),
    toNumericDate(p.not_before),
  ]);
  return [header, ...rows].map((r) => r.map(csvField).join(",")).join("\n");
}

function buildClipboardContent(payments: ScheduledPaymentResponse[]): string {
  const header = ["Period", "Dates", "Amount", "Payment Date"].join("\t");
  const rows = payments.map((p, i) =>
    [
      i + 1,
      `${toDisplayDateShort(p.not_before)}-${toDisplayDate(p.not_after)}`,
      formatCentstoUSD(p.ledger_balance.balance),
      toDisplayDate(p.not_before),
    ].join("\t"),
  );
  return [header, ...rows].join("\n");
}

function ScheduleTable({ payments, total }: ScheduleTableProps) {
  const [copied, setCopied] = useState(false);

  function handleDownloadCsv() {
    const csv = buildCsvContent(payments);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payment-schedule.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(buildClipboardContent(payments));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-foreground">
            {payments.length} Payments
          </span>
          <span className="text-sm text-muted-foreground">
            Total: {formatCentstoUSD(total)}
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDownloadCsv}>
            <Download />
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : "Copy Table"}
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Period</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Payment Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment, i) => (
            <TableRow key={payment.exchange_uuid}>
              <TableCell className="text-muted-foreground">{i + 1}</TableCell>
              <TableCell>
                {toDisplayDateShort(payment.not_before)}–
                {toDisplayDate(payment.not_after)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCentstoUSD(payment.ledger_balance.balance)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {toDisplayDate(payment.not_before)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2} className="font-medium">
              Total
            </TableCell>
            <TableCell className="text-right font-semibold tabular-nums">
              {formatCentstoUSD(total)}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

export { ScheduleTable };
