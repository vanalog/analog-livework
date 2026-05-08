"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteAthleteAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("athletes").delete().eq("id", id);

    if (error) {
      console.error("[v0] Delete athlete error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/athletes");
    return { success: true };
  } catch (err) {
    console.error("[v0] Delete athlete exception:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function deleteSponsorAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("sponsors").delete().eq("id", id);

    if (error) {
      console.error("[v0] Delete sponsor error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/sponsors");
    return { success: true };
  } catch (err) {
    console.error("[v0] Delete sponsor exception:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function deleteAgreementAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("agreements").delete().eq("id", id);

    if (error) {
      console.error("[v0] Delete agreement error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/agreements");
    return { success: true };
  } catch (err) {
    console.error("[v0] Delete agreement exception:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function updateAgreementAction(
  id: string,
  updates: {
    amount_cents?: number;
    start_date?: string | null;
    end_date?: string | null;
    notes?: string | null;
    applies_to_ioi?: boolean;
    status?: string;
    campaign_id?: string | null;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("agreements")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("[v0] Update agreement error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/agreements");
    return { success: true };
  } catch (err) {
    console.error("[v0] Update agreement exception:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/**
 * Record a NIL Go status change on a sponsorship agreement.
 *
 * Atomically inserts a row in `nil_go_status_events` (the history log) and
 * updates the denormalized `agreements.nil_go_status` field so list views
 * and filters can stay simple. Both writes happen against the same Supabase
 * client, but to keep the contract explicit we surface a partial-failure
 * error if the second write breaks.
 */
export async function setNilGoStatusAction(
  agreementId: string,
  status: "pending" | "submitted" | "resubmitted" | "rejected" | "approved",
  note?: string | null
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error: eventError } = await supabase
      .from("nil_go_status_events")
      .insert({
        agreement_id: agreementId,
        status,
        note: note?.trim() ? note.trim() : null,
      });

    if (eventError) {
      console.error("[v0] Insert NIL Go event error:", eventError);
      return { success: false, error: eventError.message };
    }

    const { error: updateError } = await supabase
      .from("agreements")
      .update({ nil_go_status: status })
      .eq("id", agreementId);

    if (updateError) {
      console.error("[v0] Update agreement nil_go_status error:", updateError);
      return { success: false, error: updateError.message };
    }

    revalidatePath("/agreements");
    revalidatePath(`/agreements/${agreementId}`);
    return { success: true };
  } catch (err) {
    console.error("[v0] setNilGoStatus exception:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function deleteCampaignAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    
    // First, unlink any agreements from this campaign
    const { error: unlinkError } = await supabase
      .from("agreements")
      .update({ campaign_id: null })
      .eq("campaign_id", id);

    if (unlinkError) {
      console.error("[v0] Unlink agreements error:", unlinkError);
      return { success: false, error: unlinkError.message };
    }

    // Then delete the campaign
    const { error } = await supabase.from("campaigns").delete().eq("id", id);

    if (error) {
      console.error("[v0] Delete campaign error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/sponsors");
    return { success: true };
  } catch (err) {
    console.error("[v0] Delete campaign exception:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
