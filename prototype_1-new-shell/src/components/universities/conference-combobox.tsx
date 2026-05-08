"use client";

import React from "react";
import { useSWRConfig } from "swr";
import { toast } from "sonner";
import { ComboboxInput } from "@/components/core/form/combobox-input";
import { useConferences } from "@/lib/hooks/use-data";
import { createConference } from "@/lib/data/taxonomy";

interface ConferenceComboboxProps {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  invalid?: boolean;
  placeholder?: string;
}

/**
 * Combobox for selecting a conference. Reads from the `conferences` table and
 * lets the user create a new conference inline — the new entry is persisted
 * to the DB so it shows up everywhere for all users.
 */
export function ConferenceCombobox({
  id,
  value,
  onChange,
  invalid,
  placeholder = "Search conference...",
}: ConferenceComboboxProps) {
  const { data: conferences } = useConferences();
  const { mutate } = useSWRConfig();

  const items = React.useMemo(() => {
    const byValue = new Map<string, { value: string; label: string }>();
    for (const c of conferences ?? []) {
      byValue.set(c.name, { value: c.name, label: c.name });
    }
    if (value && !byValue.has(value)) {
      byValue.set(value, { value, label: value });
    }
    return Array.from(byValue.values());
  }, [conferences, value]);

  const handleCreate = async (searchValue: string) => {
    const name = searchValue.trim();
    if (!name) return;

    const existing = (conferences ?? []).find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    if (existing) {
      onChange?.(existing.name);
      return;
    }

    try {
      const created = await createConference({
        name,
        sort_order: 500,
      });
      await mutate("conferences");
      onChange?.(created.name);
      toast.success(`Added "${name}" as a new conference`);
    } catch (err) {
      console.error("[v0] Failed to create conference:", err);
      toast.error("Could not add new conference");
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
      emptyStateLabel={(searchValue) =>
        `+ Add "${searchValue}" as new conference`
      }
      emptyStateAction={handleCreate}
    />
  );
}
