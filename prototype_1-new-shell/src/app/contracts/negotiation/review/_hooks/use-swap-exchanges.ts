import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";
import { useApi } from "@/lib/api";
import { SwapObligationDatesRequest } from "@/types/api-types";

export function useSwapExchanges(agreement_uuid: string | undefined) {
  const $api = useApi();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { mutate, isPending } = $api.useMutation(
    "post",
    "/v2/workspaces/{workspace_uuid}/agreements/{agreement_uuid}/obligations/swap",
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
      onError: (error) => toast.error(error.detail),
    },
  );

  function handleSwapExchanges(
    body: SwapObligationDatesRequest,
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

  return {
    handleSwapExchanges,
    isPending,
  };
}
