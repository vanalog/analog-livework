import React from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PriorityInputProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

function PriorityInput({ value, onChange }: PriorityInputProps) {
  return (
    <Button
      type="button"
      variant={value ? "default" : "outline"}
      onClick={() => onChange(!value)}
      className="font-medium flex items-center gap-2 p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors w-full text-left h-auto"
    >
      <Star
        className={cn(
          "size-5",
          value &&
            "fill-current transition-colors fill-yellow-500 text-yellow-500",
        )}
      />
      <div className="flex-1">
        <span
          className={cn("font-semibold text-base", value && "text-yellow-600")}
        >
          {value ? "Priority" : "Flag as Priority"}
        </span>
        <p className="text-xs text-muted-foreground">
          Mark this agreement for priority attention
        </p>
      </div>
    </Button>
  );
}

export { PriorityInput };
