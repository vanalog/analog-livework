import React from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThreadPriority } from "../../hooks/use-thread-priority";

interface PriorityButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  threadUuid?: string;
  isPriority?: boolean;
}

function PriorityButton(props: PriorityButtonProps) {
  const { togglePriority, isPending } = useThreadPriority();

  function onClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    togglePriority(props.threadUuid, props.isPriority);
  }

  return (
    <Button
      className={cn(props.className)}
      variant="outline"
      onClick={onClick}
      disabled={isPending}
    >
      <Star
        className={cn(props.isPriority && "fill-yellow-500 text-yellow-500")}
      />
      {props.isPriority ? "Unflag Contract" : "Flag as Important"}
    </Button>
  );
}

export { PriorityButton };
