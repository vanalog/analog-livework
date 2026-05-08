import { HTMLAttributes } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCentstoUSD, formatISODate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { EnhancedObligation } from "./types";

interface UpcomingDisbursementsProps extends HTMLAttributes<HTMLDivElement> {
  disbursements: EnhancedObligation[];
}

function UpcomingDisbursements(props: UpcomingDisbursementsProps) {
  return (
    <Card className={cn(props.className, "w-full")}>
      <CardHeader className="gap-0">
        <CardTitle>
          <h3 className="text-2xl font-semibold">Upcoming Disbursements</h3>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {props.disbursements.map((payment) => (
          <Card key={""} className="shadow-none">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{formatCentstoUSD(0)}</p>
                  <p className="text-sm text-muted-foreground">
                    {payment.contract}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatISODate("")}</p>
                  <p className="text-xs text-muted-foreground">Due date</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

export { UpcomingDisbursements };
