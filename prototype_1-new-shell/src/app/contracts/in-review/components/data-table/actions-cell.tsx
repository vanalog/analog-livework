import React from "react";
import { Download, Ellipsis, Eye, Upload, SquarePen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useDocumentDownload } from "../../hooks/use-document-download";
import { UploadNewContractVersion } from "@/app/contracts/in-review/components/upload-new-contract-version-dialog";
import { ChangeStatusDialog } from "@/app/contracts/in-review/components/change-status-dialog";
import { Thread } from "@/types/api-types";

type ActionsCellProps = Pick<
  Thread,
  "uuid" | "last_document_uuid" | "status" | "title" | "student_athlete"
>;

function ActionsCell(props: ActionsCellProps) {
  const { handleDownload } = useDocumentDownload();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const changeStatusTriggerRef = React.useRef<HTMLButtonElement>(null);
  const uploadVersionTriggerRef = React.useRef<HTMLButtonElement>(null);

  function downloadLatest(
    event: React.MouseEvent<HTMLDivElement>,
    threadUUID: string | undefined,
    documentUUID: string | undefined,
  ) {
    event.stopPropagation();
    handleDownload(threadUUID, documentUUID);
  }

  function handleChangeStatusClick() {
    setDropdownOpen(false);
    setTimeout(() => {
      changeStatusTriggerRef.current?.click();
    }, 0);
  }

  function handleUploadVersionClick() {
    setDropdownOpen(false);
    setTimeout(() => {
      uploadVersionTriggerRef.current?.click();
    }, 0);
  }

  return (
    <div className="flex justify-end pr-2" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} onClick={(e) => e.stopPropagation()}>
            <Ellipsis className="w-4 h-4 cursor-pointer" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Eye />
              <Link href={`/contracts/in-review/${props.uuid}`}>
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                handleChangeStatusClick();
              }}
            >
              <SquarePen />
              <p>Change Status</p>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                handleUploadVersionClick();
              }}
            >
              <Upload />
              <p>Upload New Version</p>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) =>
                downloadLatest(e, props.uuid, props.last_document_uuid)
              }
            >
              <Download />
              <p>Download Latest</p>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <ChangeStatusDialog
        uuid={props.uuid}
        currentStatus={props.status}
        title={props.title}
        athleteFirstName={props.student_athlete?.first_name}
        athleteLastName={props.student_athlete?.last_name}
      >
        <button ref={changeStatusTriggerRef} style={{ display: "none" }} />
      </ChangeStatusDialog>
      <UploadNewContractVersion uuid={props.uuid}>
        <button ref={uploadVersionTriggerRef} style={{ display: "none" }} />
      </UploadNewContractVersion>
    </div>
  );
}

export { ActionsCell };
