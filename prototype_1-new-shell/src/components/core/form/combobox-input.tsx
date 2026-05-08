"use client";

import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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

type ComboboxItem = {
  value: string;
  label: string;
};

interface ComboboxInputProps {
  items: ComboboxItem[] | undefined;
  placeholder: string;
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  invalid?: boolean;
  emptyStateLabel?: (value: string) => React.ReactNode;
  emptyStateAction?: (value: string) => void | Promise<void>;
}

function createComboboxFilter(items: ComboboxItem[] | undefined) {
  return (value: string, search: string) => {
    const item = items?.find(
      (i) => i.value.toLowerCase() === value.toLowerCase(),
    );
    if (!item) return 0;

    const label = item.label.toLowerCase();
    const searchLower = search.toLowerCase();

    // Exact match
    if (label === searchLower) return 1;

    // Starts with (higher priority)
    if (label.startsWith(searchLower)) return 0.9;

    // Contains
    if (label.includes(searchLower)) return 0.8;

    // Multi-word: all terms must appear
    const searchTerms = searchLower.split(/\s+/).filter(Boolean);
    if (
      searchTerms.length > 1 &&
      searchTerms.every((term) => label.includes(term))
    ) {
      return 0.7;
    }

    return 0;
  };
}

function ComboboxInput(props: ComboboxInputProps) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState("");
  const [searchValue, setSearchValue] = React.useState("");

  const value = props.value !== undefined ? props.value : internalValue;
  function setValue(newValue: string) {
    if (props.onChange) {
      props.onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          id={props.id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
          aria-invalid={props.invalid}
        >
          {value
            ? props.items?.find((item) => item.value === value)?.label
            : props.placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 pointer-events-auto" align="start">
        <Command filter={createComboboxFilter(props.items)}>
          <CommandInput
            placeholder={props.placeholder}
            className="h-9"
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
              {props.emptyStateAction && searchValue ? (
                <Button
                  variant="ghost"
                  className="w-full px-2 py-1.5 text-left text-sm hover:bg-accent rounded-sm"
                  onClick={() => {
                    props.emptyStateAction?.(searchValue);
                    setSearchValue("");
                    setOpen(false);
                  }}
                >
                  {props.emptyStateLabel?.(searchValue) ??
                    `+ Add "${searchValue}"`}
                </Button>
              ) : (
                "No entries found."
              )}
            </CommandEmpty>
            <CommandGroup>
              {props.items?.map((item) => {
                return (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {item.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === item.value ? "opacity-100" : "opacity-0",
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

export { ComboboxInput };
