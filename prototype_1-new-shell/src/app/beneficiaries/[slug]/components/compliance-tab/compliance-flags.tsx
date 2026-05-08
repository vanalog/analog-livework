import { HTMLAttributes } from "react";
import { CircleCheck, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ComplianceFlag } from "../../types";
import { cn } from "@/lib/utils";

interface ComplianceFlagsProps extends HTMLAttributes<HTMLDivElement> {
  flags: ComplianceFlag[];
}

function ComplianceFlags(props: ComplianceFlagsProps) {
  return (
    <Card className={cn(props.className, "shadow-none")}>
      <CardHeader>
        <CardTitle>
          <h3 className="text-2xl font-semibold">Compliance Flags</h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {props.flags.length > 0 ? (
          props.flags.map((flag) => (
            <Card
              key={flag.uuid}
              className="shadow-none border-amber-200 bg-amber-50"
            >
              <CardContent>
                <div className="flex items-center gap-4">
                  <TriangleAlert className="text-amber-600" />
                  <div>
                    <p className="font-medium text-amber-800 dark:text-amber-200">
                      {flag.title}
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      {flag.detail}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col justify-center items-center py-8">
            <CircleCheck className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              No compliance actions yet
            </h3>
            <p className="text-muted-foreground">
              All compliance checks are passing.
            </p>
          </div>
        )}
        <Separator className="mt-6" />
      </CardContent>
      <CardFooter>
        <Button variant="destructive">
          <TriangleAlert className="w-4 h-4" />
          Escalate to Bank/Compliance
        </Button>
      </CardFooter>
    </Card>
  );
}

export { ComplianceFlags };
