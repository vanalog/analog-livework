import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ThreadStatus } from "@/types/api-types";

const STATUS_CONFIG: Record<
  ThreadStatus,
  { label: string; className: string }
> = {
  drafting: {
    label: "Drafting",
    className: "bg-sky-100 text-sky-800",
  },
  draft_sent: {
    label: "Draft Sent",
    className: "bg-blue-100 text-blue-800",
  },
  in_redlining: {
    label: "In Redlining",
    className: "bg-purple-100 text-purple-800",
  },
  ready_to_sign: {
    label: "Ready to Sign",
    className: "bg-green-100 text-green-800",
  },
  executed: {
    label: "Executed",
    className: "bg-green-100 text-green-800",
  },
  active: {
    label: "Active",
    className: "bg-green-100 text-green-800",
  },
  terminated: {
    label: "Terminated",
    className: "bg-red-100 text-red-800",
  },
  expired: {
    label: "Expired",
    className: "bg-zinc-100 text-zinc-800",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-stone-100 text-stone-800",
  },
};

interface StatusBadgeProps {
  status: ThreadStatus;
}

const StatusBadge = memo(function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <Badge className={cn("font-semibold", config.className)}>
      {config.label}
    </Badge>
  );
});

export { StatusBadge };
