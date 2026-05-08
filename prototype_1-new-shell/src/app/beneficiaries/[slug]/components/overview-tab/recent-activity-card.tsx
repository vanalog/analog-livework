import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function RecentActivityCard() {
  return (
    <Card className="w-full">
      <CardHeader className="gap-0">
        <CardTitle>
          <h3 className="text-2xl font-semibold">Recent Activity</h3>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                Contract activated: Nike Endorsement Deal
              </p>
              <p className="text-xs text-muted-foreground">1/15/2024</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">KYC verification completed</p>
              <p className="text-xs text-muted-foreground">1/12/2024</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">Tax documents uploaded</p>
              <p className="text-xs text-muted-foreground">1/10/2024</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { RecentActivityCard };
