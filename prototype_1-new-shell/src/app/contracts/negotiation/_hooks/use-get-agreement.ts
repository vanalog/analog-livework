import { useUser } from "@/hooks/use-user";
import { useApi } from "@/lib/api";

export function useGetAgreement(agreement_uuid: string | null) {
  const $api = useApi();
  const user = useUser();

  const { data: agreement, isLoading } = $api.useQuery(
    "get",
    "/v2/workspaces/{workspace_uuid}/agreements/{agreement_uuid}/details",
    {
      params: {
        path: {
          workspace_uuid: user.user?.preferred_workspace?.uuid ?? "",
          agreement_uuid: agreement_uuid ?? "",
        },
      },
      enabled: !!user.user?.preferred_workspace?.uuid && agreement_uuid,
    },
  );

  // TODO: remove once parties have explicit source/beneficiary roles
  const partyUUIDs = {
    source_agreement_party_uuid:
      agreement?.scheduled_payments?.[0]?.source_agreement_party_uuid,
    beneficiary_agreement_party_uuid:
      agreement?.scheduled_payments?.[0]?.beneficiary_agreement_party_uuid,
  };

  const sourceParty = agreement?.parties?.find(
    (p) => p.uuid === partyUUIDs.source_agreement_party_uuid,
  );
  const beneficiaryParty = agreement?.parties?.find(
    (p) => p.uuid === partyUUIDs.beneficiary_agreement_party_uuid,
  );
  const budgetPlans = agreement?.budget_plans;

  return {
    agreement,
    agreementIsLoading: isLoading,
    sourceParty,
    beneficiaryParty,
    budgetPlans,
  };
}
