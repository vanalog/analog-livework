import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";
import { useApi } from "@/lib/api";
import { UpdateExchangeRequest } from "@/types/api-types";

export function useUpdateExchange(agreement_uuid: string | undefined) {
  const $api = useApi();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { mutate, isPending } = $api.useMutation(
    "post",
    "/v2/workspaces/{workspace_uuid}/agreements/{agreement_uuid}/exchanges/{exchange_uuid}",
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
          ],
        });
      },
      onError: (error) => toast.error(error),
    },
  );

  function handleUpdateExchange(
    exchange_uuid: string,
    body: UpdateExchangeRequest,
    onSuccess?: () => void,
  ) {
    mutate(
      {
        params: {
          path: {
            workspace_uuid: user?.preferred_workspace?.uuid ?? "",
            agreement_uuid: agreement_uuid ?? "",
            exchange_uuid,
          },
        },
        body,
      },
      { onSuccess },
    );
  }

  return {
    handleUpdateExchange,
    isPending,
  };
}
