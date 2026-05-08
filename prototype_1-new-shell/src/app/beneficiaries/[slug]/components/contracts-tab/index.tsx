import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/core/data-table";
import { columns } from "./columns";

function ContractsTab() {
  return (
    <Card>
      <CardHeader className="gap-0">
        <CardTitle>
          <h3 className="text-2xl font-semibold">Linked Contracts</h3>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DataTable loading={false} columns={columns} data={[]} />
      </CardContent>
    </Card>
  );
}

export { ContractsTab };
