import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface InNegotiationTimingProps {
  currentParty: string;
  days: number;
}

function InNegotiationTiming(props: InNegotiationTimingProps) {
  const alert = props.days > 5;

  return (
    <Card
      className={
        alert ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
      }
    >
      <div className="flex items-center gap-3 px-4 py-2">
        <Clock className={alert ? "text-red-600" : "text-green-600"} />
        <span
          className={
            alert
              ? "text-sm text-red-900 font-semibold"
              : "text-sm text-green-900 font-semibold"
          }
        >
          Waiting on {props.currentParty} for {props.days} days
        </span>
      </div>
    </Card>
  );
}

export { InNegotiationTiming };
