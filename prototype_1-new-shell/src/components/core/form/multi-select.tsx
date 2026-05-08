"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type MultiSelectOption = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  options: MultiSelectOption[];
  values: string[];
  onChange: (values: string[]) => void;
  label: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
  contentClassName?: string;
}

function createLabelFilter(options: MultiSelectOption[]) {
  return (value: string, search: string) => {
    const opt = options.find((o) => o.value === value);
    if (!opt) return 0;
    return opt.label.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
  };
}

function MultiSelect(props: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const selectedCount = props.values.length;

  function toggleValue(value: string) {
    const next = props.values.includes(value)
      ? props.values.filter((v) => v !== value)
      : [...props.values, value];
    props.onChange(next);
  }

  function getTriggerLabel() {
    if (selectedCount === 0) return props.label;
    if (selectedCount === 1) {
      const sel = props.options.find((o) => o.value === props.values[0]);
      return sel?.label ?? props.label;
    }
    return `${props.label} (${selectedCount})`;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between font-normal", props.className)}
        >
          <span
            className={cn(
              "truncate",
              selectedCount === 0 && "text-muted-foreground",
            )}
          >
            {getTriggerLabel()}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-[220px] p-0", props.contentClassName)}
        align="start"
      >
        <Command filter={createLabelFilter(props.options)}>
          {props.searchable && (
            <CommandInput
              placeholder={props.searchPlaceholder ?? "Search..."}
              className="h-9"
            />
          )}
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {props.options.map((option) => {
                const selected = props.values.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => toggleValue(option.value)}
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        selected ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { MultiSelect };
export type { MultiSelectOption };
