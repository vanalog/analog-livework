import { useApi } from "@/lib/api";

function useGetStudentAthlete(beneficiaryPartyUUID: string | null) {
  const $api = useApi();

  const { data, isLoading } = $api.useQuery(
    "get",
    "/v1/student_athletes/{student_athlete_uuid}",
    {
      params: { path: { student_athlete_uuid: beneficiaryPartyUUID ?? "" } },
      enabled: !!beneficiaryPartyUUID,
    },
  );

  return {
    athlete: data,
    isLoading,
  };
}

export { useGetStudentAthlete };
