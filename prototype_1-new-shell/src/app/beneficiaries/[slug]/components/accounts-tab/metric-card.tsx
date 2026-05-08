import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCentstoUSD } from "@/lib/formatters";

interface MetricCardProps {
  title: string;
  amount: number;
  description: string;
}

function MetricCard(props: MetricCardProps) {
  return (
    <Card className="gap-0 w-full shadow-none">
      <CardHeader>
        <CardTitle>
          <h3 className="text-sm font-medium text-muted-foreground">
            {props.title}
          </h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatCentstoUSD(props.amount)}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {props.description}
        </p>
      </CardContent>
    </Card>
  );
}

export { MetricCard };
