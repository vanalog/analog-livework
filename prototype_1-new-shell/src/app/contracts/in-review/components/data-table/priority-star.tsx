import React from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThreadPriority } from "../../hooks/use-thread-priority";

interface PriorityStarProps {
  threadUuid?: string;
  isPriority?: boolean;
}

function PriorityStar(props: PriorityStarProps) {
  const { togglePriority, isPending } = useThreadPriority();

  function onClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    togglePriority(props.threadUuid, props.isPriority);
  }

  return (
    <Button
      className="hover:bg-transparent"
      variant="ghost"
      onClick={onClick}
      disabled={isPending}
    >
      <Star
        className={cn(props.isPriority && "fill-yellow-500 text-yellow-500")}
      />
    </Button>
  );
}

export { PriorityStar };
