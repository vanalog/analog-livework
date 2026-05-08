import { HTMLAttributes } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCentstoUSD } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface TotalReceivedYTDProps extends HTMLAttributes<HTMLDivElement> {
  amount: number;
}

function TotalReceivedYTD(props: TotalReceivedYTDProps) {
  return (
    <Card className={cn(props.className, "w-full")}>
      <CardHeader className="gap-0">
        <CardTitle>
          <h3 className="text-2xl font-semibold">Total Received YTD</h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatCentstoUSD(props.amount)}
        </div>
        <p className="text-sm text-muted-foreground">Across all contracts</p>
      </CardContent>
    </Card>
  );
}

export { TotalReceivedYTD };
