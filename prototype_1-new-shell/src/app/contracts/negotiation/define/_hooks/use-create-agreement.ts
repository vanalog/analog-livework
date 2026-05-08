import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useApi } from "@/lib/api";
import { useUser } from "@/hooks/use-user";
import {
  CreateAgreementRequest,
  CreateAgreementResponse,
} from "@/types/api-types";

export function useCreateAgreement() {
  const $api = useApi();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const { mutate, isPending } = $api.useMutation(
    "post",
    "/v2/workspaces/{workspace_uuid}/agreements",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            "get",
            "/v2/workspaces/{workspace_uuid}/budgets/plans/summaries",
          ],
        });
      },
      onError: (error) => toast.error(error),
    },
  );

  function handleCreateAgreement(
    body: CreateAgreementRequest,
    onSuccess?: (data: CreateAgreementResponse) => void,
  ) {
    mutate(
      {
        params: {
          path: { workspace_uuid: user?.preferred_workspace?.uuid ?? "" },
        },
        body,
      },
      { onSuccess },
    );
  }

  return { handleCreateAgreement, isPending };
}
