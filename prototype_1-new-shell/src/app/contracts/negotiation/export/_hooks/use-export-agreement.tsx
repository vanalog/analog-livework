import { useUser } from "@/hooks/use-user";
import { useApi } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ExportResponse = { thread_uuid: string };

const STATUS_MESSAGES: Record<number, string> = {
  400: "Invalid request — please check that all required fields are filled in.",
  403: "You do not have permission to export this agreement.",
  404: "Agreement or template not found.",
  500: "Something went wrong on our end. Please try again.",
};

export function useExportAgreement(
  agreementUUID: string | null,
  beneficiaryPartyUUID: string | null,
  workflowUUID: string | null,
) {
  const $api = useApi();
  const { user } = useUser();
  const router = useRouter();
  const queryClient = useQueryClient();

  const exportAgreement = $api.useMutation(
    "post",
    "/v2/workspaces/{workspace_uuid}/agreements/{agreement_uuid}/export",
    {
      onSuccess: (data) => {
        const { thread_uuid } = data as unknown as ExportResponse;
        queryClient.invalidateQueries({
          queryKey: [
            "get",
            "/v2/workspaces/{workspace_uuid}/agreements/{agreement_uuid}/details",
          ],
        });
        router.push(`/contracts/in-review/${thread_uuid}`);
      },
      onError: (error) => {
        const status =
          error && typeof error === "object" && "status" in error
            ? (error as { status: number }).status
            : null;

        const message =
          (status && STATUS_MESSAGES[status]) ||
          "Failed to create contract. Please try again.";

        toast.error(message);
      },
    },
  );

  function handleExport() {
    if (!agreementUUID || !beneficiaryPartyUUID) {
      toast.error("Could not export agreement");
      return;
    }

    if (!workflowUUID) {
      toast.error("Please select a contract template before exporting.");
      return;
    }

    exportAgreement.mutate({
      params: {
        path: {
          workspace_uuid: user?.preferred_workspace?.uuid ?? "",
          agreement_uuid: agreementUUID,
        },
      },
      body: {
        student_athlete_uuid: beneficiaryPartyUUID,
        workflow_uuid: workflowUUID,
      },
    });
  }

  function handleReturnToThread(threadUUID: string | undefined) {
    if (!threadUUID) {
      toast.error("Could not find agreement");
      return;
    }
    router.replace(`/contracts/in-review/${threadUUID}`);
  }

  return {
    handleExport,
    isPending: exportAgreement.isPending,
    handleReturnToThread,
  };
}
