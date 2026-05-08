import React from "react";
import { Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DynamicIcon, type IconName } from "../dynamic-icons";

interface ToggleFilterProps<TData> {
  column: Column<TData, unknown>;
  label: string;
  icon: IconName;
}

function ToggleFilter<TData>(props: ToggleFilterProps<TData>) {
  const columnFilterValue = props.column.getFilterValue() as
    | boolean[]
    | undefined;

  const selectedValues = columnFilterValue || [];

  function toggleValue() {
    const newValues = selectedValues.includes(true)
      ? selectedValues.filter((v) => v !== true)
      : [...selectedValues, true];

    props.column.setFilterValue(newValues.length > 0 ? newValues : undefined);
  }

  return (
    <Button variant="outline" onClick={() => toggleValue()}>
      <DynamicIcon
        name={props.icon}
        className={cn(
          selectedValues.length > 0 && "fill-yellow-500 text-yellow-500",
        )}
      />{" "}
      {props.label}
    </Button>
  );
}

export { ToggleFilter };
