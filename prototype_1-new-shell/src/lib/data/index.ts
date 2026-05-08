// Data access layer - client-side Supabase queries
import { createClient } from "@/lib/supabase/client";
import type {
  Athlete,
  AthleteInsert,
  AthleteUpdate,
  Sponsor,
  SponsorInsert,
  SponsorUpdate,
  Campaign,
  CampaignInsert,
  Agreement,
  AgreementInsert,
  AgreementWithRelations,
  AthleteBudget,
  University,
  UniversityInsert,
  UniversityUpdate,
  Agent,
  AgentInsert,
  AgentUpdate,
  NilGoStatusEvent,
} from "@/types/database";

// ============ ATHLETES ============

export async function getAthletes(): Promise<Athlete[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("athletes")
    .select("*")
    .order("last_name", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getAthleteById(id: string): Promise<Athlete | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("athletes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data;
}

export async function createAthlete(athlete: AthleteInsert): Promise<Athlete> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("athletes")
    .insert(athlete)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAthlete(
  id: string,
  updates: AthleteUpdate
): Promise<Athlete> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("athletes")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAthlete(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("athletes").delete().eq("id", id);

  if (error) throw error;
}

// ============ SPONSORS ============

export async function getSponsors(): Promise<Sponsor[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sponsors")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getSponsorById(id: string): Promise<Sponsor | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sponsors")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

export async function createSponsor(sponsor: SponsorInsert): Promise<Sponsor> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sponsors")
    .insert(sponsor)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSponsor(
  id: string,
  updates: SponsorUpdate
): Promise<Sponsor> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sponsors")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSponsor(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("sponsors").delete().eq("id", id);

  if (error) throw error;
}

// ============ CAMPAIGNS ============

export async function getCampaigns(): Promise<Campaign[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getCampaignsBySponsor(
  sponsorId: string
): Promise<Campaign[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("sponsor_id", sponsorId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createCampaign(
  campaign: CampaignInsert
): Promise<Campaign> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .insert(campaign)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============ AGREEMENTS ============

export async function getAgreements(): Promise<Agreement[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("agreements")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAgreementsWithRelations(): Promise<
  AgreementWithRelations[]
> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("agreements")
    .select(
      `
      *,
      athlete:athletes(*),
      sponsor:sponsors(*),
      campaign:campaigns(*)
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as AgreementWithRelations[];
}

export async function getAgreementsByAthlete(
  athleteId: string
): Promise<Agreement[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("agreements")
    .select("*")
    .eq("athlete_id", athleteId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAgreementsByAthleteWithRelations(
  athleteId: string
): Promise<AgreementWithRelations[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("agreements")
    .select(
      `
      *,
      athlete:athletes(*),
      sponsor:sponsors(*),
      campaign:campaigns(*)
    `
    )
    .eq("athlete_id", athleteId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as AgreementWithRelations[];
}

export async function getAgreementsBySponsor(
  sponsorId: string
): Promise<Agreement[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("agreements")
    .select("*")
    .eq("sponsor_id", sponsorId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAgreementsBySponsorWithRelations(
  sponsorId: string
): Promise<AgreementWithRelations[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("agreements")
    .select(
      `
      *,
      athlete:athletes(*),
      sponsor:sponsors(*),
      campaign:campaigns(*)
    `
    )
    .eq("sponsor_id", sponsorId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as AgreementWithRelations[];
}

export async function createAgreement(
  agreement: AgreementInsert
): Promise<Agreement> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("agreements")
    .insert(agreement)
    .select()
    .single();

  if (error) throw error;

  // Sponsorship agreements get an initial NIL Go history entry so the
  // timeline is never empty. Revenue share agreements skip this entirely.
  if (data && agreement.type === "sponsorship") {
    const { error: eventError } = await supabase
      .from("nil_go_status_events")
      .insert({
        agreement_id: data.id,
        status: agreement.nil_go_status ?? "pending",
        note: "Agreement created.",
      });
    if (eventError) {
      console.error("[v0] Initial NIL Go event insert failed:", eventError);
    }
  }

  return data;
}

export async function deleteAgreement(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("agreements").delete().eq("id", id);

  if (error) throw error;
}

// ============ ATHLETE BUDGETS ============

export async function getAthleteBudgets(): Promise<AthleteBudget[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("athlete_budgets")
    .select("*")
    .order("fiscal_year", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAthleteBudgetByAthleteAndYear(
  athleteId: string,
  fiscalYear: string
): Promise<AthleteBudget | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("athlete_budgets")
    .select("*")
    .eq("athlete_id", athleteId)
    .eq("fiscal_year", fiscalYear)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

export async function upsertAthleteBudget(
  athleteId: string,
  fiscalYear: string,
  totalBudgetCents: number
): Promise<AthleteBudget> {
  const supabase = createClient();
  
  // Check if a budget exists for this athlete/year
  const { data: existing } = await supabase
    .from("athlete_budgets")
    .select("id")
    .eq("athlete_id", athleteId)
    .eq("fiscal_year", fiscalYear)
    .single();

  if (existing) {
    // Update existing record
    const { data, error } = await supabase
      .from("athlete_budgets")
      .update({ total_budget_cents: totalBudgetCents })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // Insert new record
    const { data, error } = await supabase
      .from("athlete_budgets")
      .insert({
        athlete_id: athleteId,
        fiscal_year: fiscalYear,
        total_budget_cents: totalBudgetCents,
        spent_cents: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

// ============ AGGREGATED DATA ============

export interface SponsorWithBudgetTotals extends Sponsor {
  totalBudget: number;
  totalCommitted: number;
  campaignCount: number;
  agreementCount: number;
}

export async function getSponsorsWithBudgets(): Promise<
  SponsorWithBudgetTotals[]
> {
  const supabase = createClient();

  // Get sponsors
  const { data: sponsors, error: sponsorsError } = await supabase
    .from("sponsors")
    .select("*")
    .order("name", { ascending: true });

  if (sponsorsError) throw sponsorsError;

  // Get campaigns for budget totals
  const { data: campaigns, error: campaignsError } = await supabase
    .from("campaigns")
    .select("sponsor_id, budget_cents");

  if (campaignsError) throw campaignsError;

  // Get agreements for commitment totals
  const { data: agreements, error: agreementsError } = await supabase
    .from("agreements")
    .select("sponsor_id, amount_cents");

  if (agreementsError) throw agreementsError;

  // Aggregate data
  return (sponsors || []).map((sponsor) => {
    const sponsorCampaigns = (campaigns || []).filter(
      (c) => c.sponsor_id === sponsor.id
    );
    const sponsorAgreements = (agreements || []).filter(
      (a) => a.sponsor_id === sponsor.id
    );

    // Use sponsor-level budget directly, not campaign budgets
    const totalBudget = sponsor.budget_cents || 0;
    const totalCommitted = sponsorAgreements.reduce(
      (sum, a) => sum + (a.amount_cents || 0),
      0
    );

    return {
      ...sponsor,
      totalBudget,
      totalCommitted,
      campaignCount: sponsorCampaigns.length,
      agreementCount: sponsorAgreements.length,
    };
  });
}

export interface AthleteWithBudget extends Athlete {
  budget: {
    totalBudget: number;
    spent: number;
    revShare: number;
    sponsorships: number;
    sponsorCount: number;
  };
}

export async function getAthletesWithBudgets(): Promise<AthleteWithBudget[]> {
  const supabase = createClient();
  const currentYear = new Date().getFullYear().toString();

  // Get athletes
  const { data: athletes, error: athletesError } = await supabase
    .from("athletes")
    .select("*")
    .order("last_name", { ascending: true });

  if (athletesError) throw athletesError;

  // Get budgets for current year
  const { data: budgets, error: budgetsError } = await supabase
    .from("athlete_budgets")
    .select("*")
    .eq("fiscal_year", currentYear);

  if (budgetsError) throw budgetsError;

  // Get agreements (including applies_to_ioi flag)
  const { data: agreements, error: agreementsError } = await supabase
    .from("agreements")
    .select("athlete_id, sponsor_id, type, amount_cents, status, applies_to_ioi");

  if (agreementsError) throw agreementsError;

  // Aggregate data
  return (athletes || []).map((athlete) => {
    const budget = (budgets || []).find((b) => b.athlete_id === athlete.id);
    const athleteAgreements = (agreements || []).filter(
      (a) => a.athlete_id === athlete.id && a.status !== "terminated"
    );

    const revShare = athleteAgreements
      .filter((a) => a.type === "revenue_share")
      .reduce((sum, a) => sum + (a.amount_cents || 0), 0);

    const sponsorships = athleteAgreements
      .filter((a) => a.type === "sponsorship")
      .reduce((sum, a) => sum + (a.amount_cents || 0), 0);

    // Calculate sponsorships that apply to IOI target
    const ioiSpent = athleteAgreements
      .filter((a) => a.applies_to_ioi === true)
      .reduce((sum, a) => sum + (a.amount_cents || 0), 0);

    const uniqueSponsors = new Set(
      athleteAgreements.filter((a) => a.sponsor_id).map((a) => a.sponsor_id)
    );

    // totalBudget = IOI target, spent = sponsorships that apply to IOI
    return {
      ...athlete,
      budget: {
        totalBudget: budget?.total_budget_cents || 0, // IOI target
        spent: ioiSpent, // Sponsorships that count toward IOI
        revShare,
        sponsorships,
        sponsorCount: uniqueSponsors.size,
      },
    };
  });
}

// ============ UNIVERSITIES ============

export async function getUniversities(): Promise<University[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("universities")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getUniversityById(id: string): Promise<University | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("universities")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

export async function createUniversity(university: UniversityInsert): Promise<University> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("universities")
    .insert(university)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUniversity(
  id: string,
  updates: UniversityUpdate
): Promise<University> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("universities")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteUniversity(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("universities").delete().eq("id", id);

  if (error) throw error;
}

export interface UniversityWithStats extends University {
  athleteCount: number;
  totalNilValue: number;
  sports: string[];
  agents: { id: string; name: string }[];
  agreementCount: number;
  totalAgreementValue: number;
}

export async function getUniversitiesWithStats(): Promise<UniversityWithStats[]> {
  const supabase = createClient();

  // Get universities
  const { data: universities, error: universitiesError } = await supabase
    .from("universities")
    .select("*")
    .order("name", { ascending: true });

  if (universitiesError) throw universitiesError;

  // Get athletes with their university_id
  const { data: athletes, error: athletesError } = await supabase
    .from("athletes")
    .select("university_id, sport");

  if (athletesError) throw athletesError;

  // Get agreements for NIL totals
  const { data: agreements, error: agreementsError } = await supabase
    .from("agreements")
    .select("athlete_id, amount_cents, status");

  if (agreementsError) throw agreementsError;

  // Get revenue share agreements where university is counterparty
  const { data: revenueShareAgreements, error: revShareError } = await supabase
    .from("agreements")
    .select("university_id, amount_cents, status")
    .eq("type", "revenue_share")
    .neq("status", "terminated");

  if (revShareError) throw revShareError;

  // Create athlete ID to university_id mapping (also used to resolve agents)
  const { data: athletesList, error: athletesListError } = await supabase
    .from("athletes")
    .select("id, university_id, agent_id");

  if (athletesListError) throw athletesListError;

  const athleteUniversityMap = new Map(
    (athletesList || []).map((a) => [a.id, a.university_id])
  );

  // Fetch agents so we can display name alongside the id we filter on.
  const { data: agentsList, error: agentsListError } = await supabase
    .from("agents")
    .select("id, name");

  if (agentsListError) throw agentsListError;

  const agentById = new Map(
    (agentsList || []).map((a) => [a.id, a.name as string])
  );

  // Aggregate data
  return (universities || []).map((university) => {
    const universityAthletes = (athletes || []).filter(
      (a) => a.university_id === university.id
    );

    // Get unique sports
    const sports = [...new Set(universityAthletes.map((a) => a.sport).filter(Boolean))];

    // Calculate total NIL value for athletes at this university
    const universityAthletesFull = (athletesList || []).filter(
      (a) => a.university_id === university.id
    );
    const universityAthleteIds = new Set(universityAthletesFull.map((a) => a.id));

    // Collect unique agents across this university's athletes
    const agentIdsSeen = new Set<string>();
    const universityAgents: { id: string; name: string }[] = [];
    for (const a of universityAthletesFull) {
      const agentId = a.agent_id as string | null;
      if (!agentId || agentIdsSeen.has(agentId)) continue;
      agentIdsSeen.add(agentId);
      const name = agentById.get(agentId);
      if (name) universityAgents.push({ id: agentId, name });
    }
    universityAgents.sort((x, y) => x.name.localeCompare(y.name));

    const totalNilValue = (agreements || [])
      .filter(
        (a) =>
          universityAthleteIds.has(a.athlete_id) &&
          a.status !== "terminated"
      )
      .reduce((sum, a) => sum + (a.amount_cents || 0), 0);

    // Calculate revenue share agreements where this university is counterparty
    const universityRevenueShareAgreements = (revenueShareAgreements || []).filter(
      (a) => a.university_id === university.id
    );
    const agreementCount = universityRevenueShareAgreements.length;
    const totalAgreementValue = universityRevenueShareAgreements.reduce(
      (sum, a) => sum + (a.amount_cents || 0), 0
    );

    return {
      ...university,
      athleteCount: universityAthletes.length,
      totalNilValue,
      sports,
      agents: universityAgents,
      agreementCount,
      totalAgreementValue,
    };
  });
}

export async function getAthletesByUniversity(universityId: string): Promise<Athlete[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("athletes")
    .select("*")
    .eq("university_id", universityId)
    .order("last_name", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getAgreementsByUniversity(universityId: string): Promise<Agreement[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("agreements")
    .select("*")
    .eq("university_id", universityId)
    .eq("type", "revenue_share")
    .neq("status", "terminated")
    .order("amount_cents", { ascending: false });

  if (error) throw error;
  return data || [];
}

// ============ AGENTS ============

export async function getAgents(): Promise<Agent[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getAgentById(id: string): Promise<Agent | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

export async function createAgent(agent: AgentInsert): Promise<Agent> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("agents")
    .insert(agent)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAgent(
  id: string,
  updates: AgentUpdate
): Promise<Agent> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("agents")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAgent(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("agents").delete().eq("id", id);

  if (error) throw error;
}

// ============ NIL GO STATUS EVENTS ============

/**
 * Fetch the chronological history of NIL Go status changes for a single
 * sponsorship agreement. Newest first.
 */
export async function getNilGoEventsByAgreement(
  agreementId: string
): Promise<NilGoStatusEvent[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("nil_go_status_events")
    .select("*")
    .eq("agreement_id", agreementId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}
