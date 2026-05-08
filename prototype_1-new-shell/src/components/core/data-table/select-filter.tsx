import React from "react";
import { Column } from "@tanstack/react-table";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
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

interface SelectFilterProps<TData> {
  column: Column<TData, unknown>;
  options: { label: string; value: string }[];
  label: string;
  icon?: IconName;
}

function SelectFilter<TData>(props: SelectFilterProps<TData>) {
  const columnFilterValue = props.column.getFilterValue() as
    | string[]
    | undefined;
  const [open, setOpen] = React.useState(false);

  const selectedValues = columnFilterValue || [];
  const selectedCount = selectedValues.length;

  function toggleValue(value: string) {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    props.column.setFilterValue(newValues.length > 0 ? newValues : undefined);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open}>
          <div className="flex flex-row items-center justify-center gap-2">
            {props.icon && (
              <DynamicIcon name={props.icon} className="h-4 w-4" />
            )}
            <p>
              {selectedCount > 0
                ? `${props.label} (${selectedCount})`
                : props.label}
            </p>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {props.options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => toggleValue(option.value)}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedValues.includes(option.value)
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

export { SelectFilter };
