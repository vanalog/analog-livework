import { useApi } from "@/lib/api";
import { useUser } from "@/hooks/use-user";

function useGetWorkflows() {
  const $api = useApi();
  const { user } = useUser();

  const { data: workflows, isLoading } = $api.useQuery(
    "get",
    "/v2/workspaces/{workspace_uuid}/workflows",
    {
      params: {
        path: { workspace_uuid: user?.preferred_workspace?.uuid ?? "" },
      },
    },
    {
      enabled: !!user?.preferred_workspace?.uuid,
    },
  );

  return { workflows, isLoading };
}

export { useGetWorkflows };
