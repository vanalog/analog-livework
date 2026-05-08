import { HTMLAttributes } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { formatISODate } from "@/lib/formatters";
import { Document } from "../../types";
import { cn } from "@/lib/utils";

interface UploadedDocumentsProps extends HTMLAttributes<HTMLDivElement> {
  documents: Document[];
}

function UploadedDocuments(props: UploadedDocumentsProps) {
  return (
    <Card className={cn(props.className, "shadow-none")}>
      <CardHeader>
        <CardTitle>
          <h3 className="text-2xl font-semibold">Uploaded Documents</h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {props.documents.map((document) => (
            <Card key={document.uuid} className="shadow-none">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{document.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {document.type}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatISODate(document.date)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export { UploadedDocuments };
