import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/core/back-button";
import { ReadThreadResponse } from "@/types/api-types";
import { useThreadPriority } from "../../hooks/use-thread-priority";
import { cn } from "@/lib/utils";
import { SPORT_LABELS } from "@/lib/constants";

function InReviewTitle(props: ReadThreadResponse) {
  const { togglePriority, isPending } = useThreadPriority();

  function handlePriorityClick() {
    togglePriority(props.uuid, props.is_priority);
  }

  return (
    <div className="flex gap-3 w-full justify-between items-start flex-wrap">
      <div className="flex items-center gap-3">
        <BackButton />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{props.title}</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePriorityClick}
              disabled={isPending}
            >
              <Star
                className={cn(
                  props.is_priority && "fill-yellow-600 text-yellow-600",
                )}
              />
              <span
                className={cn(
                  "font-medium",
                  props.is_priority
                    ? "text-yellow-600"
                    : "text-muted-foreground",
                )}
              >
                {props.is_priority ? "Priority" : "Flag as Priority"}
              </span>
            </Button>
          </div>
          <p className="text-muted-foreground text-sm">
            {`${props.student_athlete?.first_name} ${props.student_athlete?.last_name} • ${props.student_athlete?.sport && SPORT_LABELS[props.student_athlete.sport]}`}
          </p>
        </div>
      </div>
      {/*
      <Card className="px-4 py-6 bg-blue-50 border-blue-200 w-full lg:w-auto">
        <div className="flex items-center gap-2 py-4">
          <Mail className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-medium text-blue-900">
            Email Tracking:
          </span>{" "}
          <code className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-xs text-blue-900">
            contracts@goanalog.com
          </code>
          <Button variant="ghost" size="icon" className="w-auto h-auto">
            <Copy />
          </Button>
          <Button variant="ghost" size="icon" className="w-auto h-auto">
            <ExternalLink />
          </Button>
        </div>
      </Card>
      */}
    </div>
  );
}

export { InReviewTitle };
