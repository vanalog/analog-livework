import { useApi } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { CreateExchangeRequest } from "@/types/api-types";

export function useAddExchange(agreement_uuid: string | undefined) {
  const $api = useApi();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const { mutate, isPending } = $api.useMutation(
    "post",
    "/v2/workspaces/{workspace_uuid}/agreements/{agreement_uuid}/exchanges",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            "get",
            "/v2/workspaces/{workspace_uuid}/agreements/{agreement_uuid}/details",
            {
              params: {
                path: {
                  workspace_uuid: user?.preferred_workspace?.uuid,
                  agreement_uuid,
                },
              },
            },
          ],
        });
        queryClient.invalidateQueries({
          queryKey: [
            "get",
            "/v2/workspaces/{workspace_uuid}/budgets/plans/summaries",
            {
              params: {
                path: {
                  workspace_uuid: user?.preferred_workspace?.uuid,
                },
              },
            },
          ],
        });
      },
      onError: (error) => toast.warning(error.detail),
    },
  );

  function handleAddExchange(
    body: CreateExchangeRequest,
    onSuccess?: () => void,
  ) {
    mutate(
      {
        params: {
          path: {
            workspace_uuid: user?.preferred_workspace?.uuid ?? "",
            agreement_uuid: agreement_uuid ?? "",
          },
        },
        body,
      },
      { onSuccess },
    );
  }

  return { handleAddExchange, isPending };
}
