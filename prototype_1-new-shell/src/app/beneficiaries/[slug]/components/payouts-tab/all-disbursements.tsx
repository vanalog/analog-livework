import { DataTable } from "@/components/core/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedObligation } from "./types";
import { columns } from "./columns";

interface AllDisbursementsProps {
  data: EnhancedObligation[];
}

function AllDisbursements(props: AllDisbursementsProps) {
  return (
    <Card>
      <CardHeader className="gap-0">
        <CardTitle>
          <h3 className="text-2xl font-semibold">All Disbursements</h3>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DataTable loading={false} data={props.data || []} columns={columns} />
      </CardContent>
    </Card>
  );
}

export { AllDisbursements };
