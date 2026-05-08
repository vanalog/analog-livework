"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Header } from "../_components/header";
import { useExportAgreement } from "./_hooks/use-export-agreement";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCentstoUSD, toDisplayDate } from "@/lib/formatters";
import { useGetAgreement } from "../_hooks/use-get-agreement";
import { ScheduleTable } from "../_components/schedule-table";

export default function Export() {
  const params = useSearchParams();
  const agreementUUID = params.get("agreement_uuid");
  const beneficiaryPartyUUID = params.get("beneficiary_party_uuid");

  const { agreement, beneficiaryParty } = useGetAgreement(agreementUUID);

  const { handleExport, isPending, handleReturnToThread } = useExportAgreement(
    agreementUUID,
    beneficiaryPartyUUID,
    agreement?.workflow.uuid ?? "",
  );

  if (!agreement) {
    return <></>;
  }

  return (
    <>
      <div className="border-b px-6 pb-4 mb-4">
        <Header step={3} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 max-w-6xl mx-auto">
        <div className="lg:col-span-2">
          {agreement.scheduled_payments.length > 0 && (
            <ScheduleTable
              payments={agreement.scheduled_payments}
              total={agreement.total_scheduled_payments ?? 0}
            />
          )}
        </div>
        <div className="space-y-4">
          <Card className="py-4">
            <CardContent className="px-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Agreement Type
                </span>
                <Badge variant="outline">
                  {agreement.workflow.type === "ioi"
                    ? "Indication of Interest"
                    : "Revenue Share"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Athlete</span>
                <span className="text-sm font-medium">
                  {beneficiaryParty?.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Value
                </span>
                <span className="text-sm font-medium">
                  {formatCentstoUSD(agreement?.total_scheduled_payments ?? 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Payment Count
                </span>
                <span className="text-sm font-medium">
                  {agreement?.scheduled_payments.length}
                </span>
              </div>
              {agreement?.effective_at && agreement?.expired_after && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Date Range
                  </span>
                  <span className="text-sm font-medium">
                    {toDisplayDate(agreement?.effective_at)} –{" "}
                    {toDisplayDate(agreement?.expired_after)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="flex gap-2 items-center">
            <div className="text-sm font-medium">Agreement Template</div>
            <Badge variant="outline" className="text-sm">
              {agreement.workflow?.name}
            </Badge>
          </div>
          {agreement.thread_uuid ? (
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                If you need to make changes after the agreement has been saved:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Copy and paste the table into the latest version of the
                  agreement.
                </li>
                <li>
                  Email the updated agreement to your Analog Contracts account.
                </li>
                <li>Our team will reconcile the versions on the backend.</li>
              </ul>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              When the agreement is generated, scheduled payments are
              automatically applied to the budget, and the agreement is saved to
              the athlete.
            </p>
          )}
          {agreement.thread_uuid ? (
            <Button
              type="button"
              className="w-full"
              onClick={() => handleReturnToThread(agreement.thread_uuid)}
            >
              View Agreement
            </Button>
          ) : (
            <Button
              type="button"
              className="w-full"
              onClick={handleExport}
              disabled={isPending || !agreement?.workflow.uuid}
            >
              {isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <ArrowRight />
              )}
              {isPending ? "Creating agreement..." : "Create Agreement"}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
