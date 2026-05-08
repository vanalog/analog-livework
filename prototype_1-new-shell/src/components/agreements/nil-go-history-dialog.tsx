"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NilGoStatusBadge } from "@/components/agreements/nil-go-status-badge";
import type { NilGoStatusEvent } from "@/types/database";

interface NilGoHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: NilGoStatusEvent[];
}

function formatEventTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Full chronological NIL Go history for a sponsorship agreement.
 *
 * Used when the inline history on the detail card has more than 3 entries.
 * Same row format as the inline list, just inside a scroll container so we
 * never overflow the dialog.
 */
export function NilGoHistoryDialog({
  open,
  onOpenChange,
  events,
}: NilGoHistoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>NIL Go History</DialogTitle>
          <DialogDescription>
            Every recorded NIL Go status change for this agreement, newest
            first.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No status changes recorded yet.
            </p>
          ) : (
            <ol className="relative space-y-4 border-l border-border pl-6">
              {events.map((event) => (
                <li key={event.id} className="relative">
                  <span className="absolute -left-[27px] top-1.5 flex h-3 w-3 items-center justify-center rounded-full border border-border bg-background">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <NilGoStatusBadge status={event.status} />
                    <span className="text-xs text-muted-foreground">
                      {formatEventTimestamp(event.created_at)}
                    </span>
                  </div>
                  {event.note && (
                    <p className="mt-1 text-sm text-foreground/80">
                      {event.note}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
