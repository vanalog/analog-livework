"use client";

import { useApi } from "@/lib/api";
import { toast } from "sonner";

function useDocumentDownload() {
  const $api = useApi();

  const mutation = $api.useMutation(
    "get",
    "/v1/threads/{thread_uuid}/documents/{document_uuid}",
    {
      onSuccess: (data, variables) => {
        const blob = data as unknown;

        if (!(blob instanceof Blob)) {
          console.error("Invalid response: expected Blob");
          return;
        }

        const allowedTypes = {
          "application/pdf": ".pdf",
          "application/msword": ".doc",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            ".docx",
        } as const;

        const fileExtension =
          allowedTypes[blob.type as keyof typeof allowedTypes];

        if (!fileExtension) {
          console.error("Invalid content type:", blob.type);
          return;
        }

        const documentUuid = variables.params.path.document_uuid;
        const sanitizedUuid = documentUuid.replace(/[^a-zA-Z0-9-_]/g, "");

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `document-${sanitizedUuid}${fileExtension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => window.URL.revokeObjectURL(url), 100);
      },
      onError: () => {
        toast.error("Failed to download document");
      },
    },
  );

  function handleDownload(
    threadUUID: string | undefined,
    documentUUID: string | undefined,
  ) {
    if (!threadUUID || !documentUUID) {
      toast.error("Failed to download document");
      return;
    }

    return mutation.mutate({
      params: {
        path: {
          thread_uuid: threadUUID,
          document_uuid: documentUUID,
        },
      },
      parseAs: "blob",
    });
  }

  return { handleDownload };
}

export { useDocumentDownload };
