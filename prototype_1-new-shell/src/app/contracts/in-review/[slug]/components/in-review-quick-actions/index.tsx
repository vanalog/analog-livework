import React from "react";
import { useRouter } from "next/navigation";
import { Download, Pencil, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadNewContractVersion } from "@/app/contracts/in-review/components/upload-new-contract-version-dialog";
import { ChangeStatusDialog } from "@/app/contracts/in-review/components/change-status-dialog";
import { useDocumentDownload } from "../../../hooks/use-document-download";
import { PriorityButton } from "@/app/contracts/in-review/components/priority-button";
import { ReadThreadResponse } from "@/types/api-types";

function InReviewQuickActions(props: { thread?: ReadThreadResponse }) {
  const { handleDownload } = useDocumentDownload();
  const router = useRouter();

  function downloadLatest(
    event: React.MouseEvent<HTMLButtonElement>,
    threadUUID: string | undefined,
    documentUUID: string | undefined,
  ) {
    event.stopPropagation();
    handleDownload(threadUUID, documentUUID);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <PriorityButton
          threadUuid={props.thread?.uuid}
          isPriority={props.thread?.is_priority ?? false}
          className="w-full justify-start"
        />
        <UploadNewContractVersion uuid={props.thread?.uuid}>
          <Button className="w-full justify-start" variant="outline">
            <Upload />
            Upload New Version
          </Button>
        </UploadNewContractVersion>
        {props.thread?.agreement_uuid && (
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start"
            onClick={() =>
              router.push(
                `/contracts/negotiation/review?agreement_uuid=${props.thread?.agreement_uuid}&beneficiary_party_uuid=${props.thread?.student_athlete?.uuid}&workflow_type=revshare`,
              )
            }
          >
            <Pencil />
            Edit Payment Schedule
          </Button>
        )}
        <ChangeStatusDialog
          uuid={props.thread?.uuid}
          currentStatus={props.thread?.status}
          title={props.thread?.title}
          athleteFirstName={props.thread?.student_athlete?.first_name}
          athleteLastName={props.thread?.student_athlete?.last_name}
        />
        <Button
          className="w-full justify-start"
          variant="outline"
          onClick={(e) =>
            downloadLatest(
              e,
              props.thread?.uuid,
              props.thread?.last_document_uuid,
            )
          }
        >
          <Download />
          Download Latest Version
        </Button>
      </CardContent>
    </Card>
  );
}

export { InReviewQuickActions };
