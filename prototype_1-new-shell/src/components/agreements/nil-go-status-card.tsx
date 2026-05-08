"use client";

import { useState } from "react";
import { ShieldCheck, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NilGoStatusBadge } from "@/components/agreements/nil-go-status-badge";
import { NilGoUpdateDialog } from "@/components/agreements/nil-go-update-dialog";
import { NilGoHistoryDialog } from "@/components/agreements/nil-go-history-dialog";
import { useNilGoEvents } from "@/lib/hooks/use-data";
import type { NilGoStatus } from "@/types/database";

interface NilGoStatusCardProps {
  agreementId: string;
  currentStatus: NilGoStatus | null;
}

/**
 * Show no more than this many history rows inline on the detail page.
 * Anything beyond this is reachable via the "View all" history modal.
 */
const INLINE_HISTORY_LIMIT = 3;

function formatEventTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Compact NIL Go panel for a sponsorship agreement detail page.
 *
 * Designed to occupy a single column to the right of the agreement summary
 * card. Shows the current status, an "Update status" button that opens the
 * edit modal, and an inline timeline of the most recent status changes.
 * If history exceeds INLINE_HISTORY_LIMIT, a "View all" trigger opens a
 * dedicated dialog with the full list.
 */
export function NilGoStatusCard({
  agreementId,
  currentStatus,
}: NilGoStatusCardProps) {
  const { data: events = [], isLoading } = useNilGoEvents(agreementId);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const inlineEvents = events.slice(0, INLINE_HISTORY_LIMIT);
  const overflowCount = Math.max(0, events.length - INLINE_HISTORY_LIMIT);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">NIL Go Status</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Current status + update CTA */}
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Current status</p>
              <div className="mt-1.5">
                <NilGoStatusBadge status={currentStatus} />
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setUpdateOpen(true)}
            >
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Update status
            </Button>
          </div>

          {/* History */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">
                History
              </p>
              {overflowCount > 0 && (
                <button
                  type="button"
                  onClick={() => setHistoryOpen(true)}
                  className="text-xs font-medium text-foreground underline-offset-2 hover:underline"
                >
                  View all ({events.length})
                </button>
              )}
            </div>

            {isLoading ? (
              <p className="text-xs text-muted-foreground">Loading...</p>
            ) : inlineEvents.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No changes recorded yet.
              </p>
            ) : (
              <ol className="relative space-y-3 border-l border-border pl-4">
                {inlineEvents.map((event) => (
                  <li key={event.id} className="relative">
                    <span className="absolute -left-[19px] top-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full border border-border bg-background">
                      <span className="h-1 w-1 rounded-full bg-foreground" />
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <NilGoStatusBadge status={event.status} />
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {formatEventTimestamp(event.created_at)}
                    </p>
                    {event.note && (
                      <p className="mt-1 text-xs text-foreground/80">
                        {event.note}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </CardContent>
      </Card>

      <NilGoUpdateDialog
        agreementId={agreementId}
        currentStatus={currentStatus}
        open={updateOpen}
        onOpenChange={setUpdateOpen}
      />
      <NilGoHistoryDialog
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        events={events}
      />
    </>
  );
}
