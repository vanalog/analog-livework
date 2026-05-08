import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Beneficiary } from "../../types";
import { formatTimestampToReadable } from "@/lib/formatters";

function ActivityTab(props: Pick<Beneficiary, "activities">) {
  const lastIndex = props.activities.length - 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h3 className="text-2xl font-semibold">Activity Timeline</h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {props.activities.map((activity, index) => (
            <div key={activity.uuid} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0" />
                {index !== lastIndex && (
                  <div className="w-px h-8 bg-border mt-2" />
                )}
              </div>
              <div className="flex-1 min-w-0 pb-4">
                <p className="text-sm font-medium">{activity.event}</p>
                <p className="text-xs text-muted-foreground">
                  {formatTimestampToReadable(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export { ActivityTab };
