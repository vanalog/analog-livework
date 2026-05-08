import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, DollarSign, Pause } from "lucide-react";
import { ActiveContractsStatsProps } from "../types";
import { formatCentstoUSD } from "@/lib/formatters";

function ActiveContractsStats(props: ActiveContractsStatsProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between w-full gap-4">
      <Card className="flex-1">
        <CardHeader className="flex justify-between">
          <CardTitle>Active Contracts</CardTitle>
          <CheckCircle className="w-4 h-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {props.activeContracts}
          </div>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader className="flex justify-between">
          <CardTitle>Paused</CardTitle>
          <Pause className="w-4 h-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {props.pausedContracts}
          </div>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader className="flex justify-between">
          <CardTitle>Total Active Value</CardTitle>
          <DollarSign className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCentstoUSD(props.totalActiveValue)}
          </div>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader className="flex justify-between">
          <CardTitle>YTD Disbursed</CardTitle>
          <DollarSign className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCentstoUSD(props.disbursedYTD)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { ActiveContractsStats };
