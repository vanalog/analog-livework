// SWR hooks for data fetching
import useSWR from "swr";
import {
  getAthletes,
  getAthletesWithBudgets,
  getSponsors,
  getSponsorById,
  getSponsorsWithBudgets,
  getCampaigns,
  getCampaignsBySponsor,
  getAgreements,
  getAgreementsWithRelations,
  getAgreementsBySponsor,
  getAgreementsBySponsorWithRelations,
  getAthleteBudgets,
  getUniversities,
  getUniversityById,
  getUniversitiesWithStats,
  getAthletesByUniversity,
  getAgreementsByUniversity,
  getAgents,
  getAgentById,
  getNilGoEventsByAgreement,
} from "@/lib/data";
import { getSports, getConferences } from "@/lib/data/taxonomy";

// Athletes
export function useAthletes() {
  return useSWR("athletes", getAthletes);
}

export function useAthletesWithBudgets() {
  return useSWR("athletes-with-budgets", getAthletesWithBudgets);
}

// Sponsors
export function useSponsors() {
  return useSWR("sponsors", getSponsors);
}

export function useSponsor(id: string) {
  return useSWR(`sponsor-${id}`, () => getSponsorById(id));
}

export function useSponsorsWithBudgets() {
  return useSWR("sponsors-with-budgets", getSponsorsWithBudgets);
}

// Campaigns
export function useCampaigns() {
  return useSWR("campaigns", getCampaigns);
}

export function useCampaignsBySponsor(sponsorId: string | null) {
  return useSWR(
    sponsorId ? `campaigns-sponsor-${sponsorId}` : null,
    sponsorId ? () => getCampaignsBySponsor(sponsorId) : null
  );
}

// Agreements
export function useAgreements() {
  return useSWR("agreements", getAgreements);
}

export function useAgreementsWithRelations() {
  return useSWR("agreements-with-relations", getAgreementsWithRelations);
}

export function useAgreementsBySponsor(sponsorId: string) {
  return useSWR(
    `agreements-sponsor-${sponsorId}`,
    () => getAgreementsBySponsor(sponsorId)
  );
}

export function useAgreementsBySponsorWithRelations(sponsorId: string) {
  return useSWR(
    `agreements-sponsor-relations-${sponsorId}`,
    () => getAgreementsBySponsorWithRelations(sponsorId)
  );
}

// Athlete Budgets
export function useAthleteBudgets() {
  return useSWR("athlete-budgets", getAthleteBudgets);
}

// Universities
export function useUniversities() {
  return useSWR("universities", getUniversities);
}

export function useUniversity(id: string | null) {
  return useSWR(
    id ? `university-${id}` : null,
    id ? () => getUniversityById(id) : null
  );
}

export function useUniversitiesWithStats() {
  return useSWR("universities-with-stats", getUniversitiesWithStats);
}

export function useAthletesByUniversity(universityId: string | null) {
  return useSWR(
    universityId ? `athletes-university-${universityId}` : null,
    universityId ? () => getAthletesByUniversity(universityId) : null
  );
}

export function useAgreementsByUniversity(universityId: string | null) {
  return useSWR(
    universityId ? `agreements-university-${universityId}` : null,
    universityId ? () => getAgreementsByUniversity(universityId) : null
  );
}

// Agents
export function useAgents() {
  return useSWR("agents", getAgents);
}

export function useAgent(id: string | null) {
  return useSWR(
    id ? `agent-${id}` : null,
    id ? () => getAgentById(id) : null
  );
}

// NIL Go status events (history log per agreement)
export function useNilGoEvents(agreementId: string | null) {
  return useSWR(
    agreementId ? `nil-go-events-${agreementId}` : null,
    agreementId ? () => getNilGoEventsByAgreement(agreementId) : null
  );
}

// Taxonomy
export function useSports() {
  return useSWR("sports", getSports);
}

export function useConferences() {
  return useSWR("conferences", getConferences);
}
