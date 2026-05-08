import React from "react";
import { Column } from "@tanstack/react-table";
import { Check } from "lucide-react";
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
import { DynamicIcon, IconName } from "../dynamic-icons";

interface ComboboxFilterProps<TData> {
  column: Column<TData, unknown>;
  label: string;
  icon: IconName;
}

function useComboboxFilterOptions<TData>(column?: Column<TData, unknown>) {
  const [options, setOptions] = React.useState<
    { label: string; value: string }[]
  >([]);

  const facetedValues = column?.getFacetedUniqueValues();
  const facetedSize = facetedValues?.size ?? 0;

  React.useEffect(() => {
    if (!column) {
      setOptions([]);
      return;
    }

    const opts = Array.from(column.getFacetedUniqueValues().keys())
      .sort()
      .slice(0, 5000)
      .map((c) => ({
        label: c || "(No Agency)",
        value: c ?? "__EMPTY__",
      }));

    setOptions(opts);
  }, [column, facetedSize]);

  return options;
}

function ComboboxFilter<TData>(props: ComboboxFilterProps<TData>) {
  const [open, setOpen] = React.useState(false);
  const options = useComboboxFilterOptions(props.column);

  const columnFilterValue = props.column.getFilterValue() as
    | (string | null)[]
    | undefined;

  // Convert between filter values and display values
  function toDisplayValue(filterValue: unknown) {
    return filterValue === null ? "__EMPTY__" : filterValue;
  }

  function toFilterValue(displayValue: string) {
    return displayValue === "__EMPTY__" ? null : displayValue;
  }

  const selectedValues = columnFilterValue || [];
  const selectedCount = selectedValues.length;

  function toggleValue(displayValue: string) {
    const filterValue = toFilterValue(displayValue);
    const newValues = selectedValues.some((v) => v === filterValue)
      ? selectedValues.filter((v) => v !== filterValue)
      : [...selectedValues, filterValue];

    props.column.setFilterValue(newValues.length > 0 ? newValues : undefined);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open}>
          <DynamicIcon name={props.icon} className="h-2 w-2" />
          <p>
            {selectedCount > 0
              ? `${props.label} (${selectedCount})`
              : props.label}
          </p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => toggleValue(option.value)}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedValues.some(
                        (v) => toDisplayValue(v) === option.value,
                      )
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { ComboboxFilter };
