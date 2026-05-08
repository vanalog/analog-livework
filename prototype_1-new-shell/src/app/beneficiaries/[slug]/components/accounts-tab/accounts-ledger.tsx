import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/core/data-table";
import { columns, options } from "./columns";
import { data } from "./data";

function AccountsLedger() {
  return (
    <Card className="shadow-none">
      <CardContent>
        <DataTable
          loading={false}
          columns={columns}
          data={data || []}
          filterableColumn={{
            id: "status",
            allOptionText: "All statuses",
            options: options,
          }}
        />
      </CardContent>
    </Card>
  );
}

export { AccountsLedger };
