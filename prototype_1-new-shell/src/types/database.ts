// Database types matching Supabase schema

export interface Athlete {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  sport: string;
  position: string | null;
  jersey_number: string | null;
  class_year: string | null;
  university: string | null;
  university_id: string | null;
  agent_id: string | null;
  status: "active" | "inactive" | "graduated";
  avatar_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Sponsor {
  id: string;
  name: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  industry: string | null;
  budget_cents: number | null;
  logo_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  sponsor_id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  budget_cents: number;
  status: "draft" | "active" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export type NilGoStatus =
  | "pending"
  | "submitted"
  | "resubmitted"
  | "rejected"
  | "approved";

export interface Agreement {
  id: string;
  athlete_id: string;
  sponsor_id: string | null;
  campaign_id: string | null;
  university_id: string | null;
  type: "revenue_share" | "sponsorship";
  amount_cents: number;
  applies_to_ioi: boolean;
  start_date: string | null;
  end_date: string | null;
  status: "draft" | "active" | "completed" | "terminated";
  /**
   * NIL Go clearinghouse submission status. Only meaningful for sponsorship
   * agreements; revenue share agreements stay NULL since they don't go
   * through NIL Go.
   */
  nil_go_status: NilGoStatus | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface NilGoStatusEvent {
  id: string;
  agreement_id: string;
  status: NilGoStatus;
  note: string | null;
  created_at: string;
}

export interface AthleteBudget {
  id: string;
  athlete_id: string;
  fiscal_year: string;
  total_budget_cents: number;
  spent_cents: number;
  created_at: string;
  updated_at: string;
}

export interface University {
  id: string;
  name: string;
  conference: string | null;
  logo_url: string | null;
  website: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Sport {
  id: string;
  key: string;
  label: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Conference {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type SportInsert = Omit<Sport, "id" | "created_at" | "updated_at">;
export type SportUpdate = Partial<SportInsert>;
export type ConferenceInsert = Omit<Conference, "id" | "created_at" | "updated_at">;
export type ConferenceUpdate = Partial<ConferenceInsert>;

// Extended types with relations
export interface AgreementWithRelations extends Agreement {
  athlete: Athlete;
  sponsor: Sponsor | null;
  campaign: Campaign | null;
}

export interface CampaignWithSponsor extends Campaign {
  sponsor: Sponsor;
}

// Insert types (without auto-generated fields)
export type AthleteInsert = Omit<Athlete, "id" | "created_at" | "updated_at">;
export type SponsorInsert = Omit<Sponsor, "id" | "created_at" | "updated_at">;
export type CampaignInsert = Omit<Campaign, "id" | "created_at" | "updated_at">;
export type AgreementInsert = Omit<Agreement, "id" | "created_at" | "updated_at">;
export type AthleteBudgetInsert = Omit<AthleteBudget, "id" | "created_at" | "updated_at">;
export type UniversityInsert = Omit<University, "id" | "created_at" | "updated_at">;
export type AgentInsert = Omit<Agent, "id" | "created_at" | "updated_at">;

// Update types (all fields optional except id)
export type AthleteUpdate = Partial<AthleteInsert>;
export type SponsorUpdate = Partial<SponsorInsert>;
export type CampaignUpdate = Partial<CampaignInsert>;
export type AgreementUpdate = Partial<AgreementInsert>;
export type AthleteBudgetUpdate = Partial<AthleteBudgetInsert>;
export type UniversityUpdate = Partial<UniversityInsert>;
export type AgentUpdate = Partial<AgentInsert>;
