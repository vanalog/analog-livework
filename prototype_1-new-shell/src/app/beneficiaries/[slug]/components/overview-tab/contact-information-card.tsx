import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function ContactInformationCard() {
  return (
    <Card>
      <CardHeader className="gap-0">
        <CardTitle>
          <h3 className="text-2xl font-semibold">Contact Information</h3>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Email
          </label>
          <p className="text-sm">marcus.johnson@university.edu</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Phone
          </label>
          <p className="text-sm">(555) 123-4567</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Date of Birth
          </label>
          <p className="text-sm">8/14/2003</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Address
          </label>
          <p className="text-sm">123 Campus Drive</p>
          <p className="text-sm">Gainesville, FL 32611</p>
        </div>
      </CardContent>
    </Card>
  );
}

export { ContactInformationCard };
