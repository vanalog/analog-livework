import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function UniversityAffliationCard() {
  return (
    <Card>
      <CardHeader className="gap-0">
        <CardTitle>
          <h3 className="text-2xl font-semibold">University Affliation</h3>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Users />
          </div>
          <div>
            <p className="font-medium">University of Florida</p>
            <p className="text-sm text-muted-foreground">Student-Athlete</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { UniversityAffliationCard };
