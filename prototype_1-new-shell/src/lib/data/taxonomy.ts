// Data access for taxonomy lookup tables (sports, conferences).
// These tables back the /settings/taxonomy admin page and the Sport/Conference
// comboboxes used in the athlete and university dialogs.
import { createClient } from "@/lib/supabase/client";
import type {
  Sport,
  SportInsert,
  SportUpdate,
  Conference,
  ConferenceInsert,
  ConferenceUpdate,
} from "@/types/database";

// ============ SPORTS ============

export async function getSports(): Promise<Sport[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sports")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("label", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createSport(sport: SportInsert): Promise<Sport> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sports")
    .insert(sport)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSport(
  id: string,
  updates: SportUpdate
): Promise<Sport> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sports")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSport(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("sports").delete().eq("id", id);
  if (error) throw error;
}

/** Count how many athletes currently reference a given sport key. */
export async function countAthletesBySport(sportKey: string): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("athletes")
    .select("*", { count: "exact", head: true })
    .eq("sport", sportKey);

  if (error) throw error;
  return count ?? 0;
}

// ============ CONFERENCES ============

export async function getConferences(): Promise<Conference[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("conferences")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createConference(
  conference: ConferenceInsert
): Promise<Conference> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("conferences")
    .insert(conference)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateConference(
  id: string,
  updates: ConferenceUpdate
): Promise<Conference> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("conferences")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteConference(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("conferences").delete().eq("id", id);
  if (error) throw error;
}

/**
 * Rename a conference and cascade the change to every university currently
 * using the old name. Sports don't need this since `athletes.sport` stores
 * the stable `key`, not the mutable `label`.
 */
export async function renameConference(
  id: string,
  oldName: string,
  newName: string
): Promise<Conference> {
  const supabase = createClient();
  const trimmed = newName.trim();
  if (!trimmed) throw new Error("Conference name cannot be empty");

  // Update the conferences row first.
  const { data, error } = await supabase
    .from("conferences")
    .update({ name: trimmed, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;

  // Cascade to universities only if the name actually changed.
  if (oldName && oldName !== trimmed) {
    const { error: cascadeErr } = await supabase
      .from("universities")
      .update({ conference: trimmed })
      .eq("conference", oldName);
    if (cascadeErr) throw cascadeErr;
  }

  return data;
}

/** Count how many universities currently reference a given conference name. */
export async function countUniversitiesByConference(
  conferenceName: string
): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("universities")
    .select("*", { count: "exact", head: true })
    .eq("conference", conferenceName);

  if (error) throw error;
  return count ?? 0;
}
