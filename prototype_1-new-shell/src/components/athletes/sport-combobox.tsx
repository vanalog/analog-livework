"use client";

import React from "react";
import { useSWRConfig } from "swr";
import { toast } from "sonner";
import { ComboboxInput } from "@/components/core/form/combobox-input";
import { useSports } from "@/lib/hooks/use-data";
import { createSport } from "@/lib/data/taxonomy";

/**
 * Converts free-text sport input to a stable key (lowercase, underscores).
 * e.g. "Curling" -> "curling", "Beach Volleyball" -> "beach_volleyball"
 */
function toSportKey(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "_")
    .replace(/^_+|_+$/g, "");
}

/**
 * Cleans free-text sport label for display: trimmed + title cased per word.
 */
function toSportLabel(input: string): string {
  return input
    .trim()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ");
}

interface SportComboboxProps {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  invalid?: boolean;
  placeholder?: string;
}

/**
 * Combobox for selecting a sport. Reads the canonical list from the `sports`
 * table and lets the user create a new sport inline — the new entry is
 * persisted to the DB so it shows up everywhere for all users.
 */
export function SportCombobox({
  id,
  value,
  onChange,
  invalid,
  placeholder = "Search sport...",
}: SportComboboxProps) {
  const { data: sports } = useSports();
  const { mutate } = useSWRConfig();

  const items = React.useMemo(() => {
    const byValue = new Map<string, { value: string; label: string }>();
    for (const s of sports ?? []) {
      byValue.set(s.key, { value: s.key, label: s.label });
    }
    // If the current value isn't in the list (e.g. legacy data), surface it
    // so the trigger can render a label instead of a blank.
    if (value && !byValue.has(value)) {
      byValue.set(value, {
        value,
        label: toSportLabel(value.replace(/_/g, " ")),
      });
    }
    return Array.from(byValue.values());
  }, [sports, value]);

  const handleCreate = async (searchValue: string) => {
    const key = toSportKey(searchValue);
    if (!key) return;
    const label = toSportLabel(searchValue);

    // Avoid dupes: if it already exists, just select it.
    const existing = (sports ?? []).find((s) => s.key === key);
    if (existing) {
      onChange?.(existing.key);
      return;
    }

    try {
      const created = await createSport({
        key,
        label,
        sort_order: 500,
      });
      await mutate("sports");
      onChange?.(created.key);
      toast.success(`Added "${label}" as a new sport`);
    } catch (err) {
      console.error("[v0] Failed to create sport:", err);
      toast.error("Could not add new sport");
    }
  };

  return (
    <ComboboxInput
      id={id}
      items={items}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      invalid={invalid}
      emptyStateLabel={(searchValue) => `+ Add "${searchValue}" as new sport`}
      emptyStateAction={handleCreate}
    />
  );
}
