import { Column, ColumnFilter } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CURRENT_HOLDER_LABELS,
  THREAD_PRIORITY_LABELS,
  THREAD_STATUS_LABELS,
  CONTRACT_TYPE_LABELS,
  CONTRACT_GROUP_LABELS,
  SPORT_LABELS,
} from "@/lib/constants";

const COLUMNS_LABELS: Record<string, string> = {
  is_priority: "Priority",
  status: "Status",
  current_holder: "Holder",
  agency: "Agency",
  graduation_year: "Year",
  contract_type: "Type",
  contract_group: "Group",
  sport: "Sport",
};

const COLUMNS_VALUES: Record<string, string> = {
  ...CURRENT_HOLDER_LABELS,
  ...THREAD_STATUS_LABELS,
  ...THREAD_PRIORITY_LABELS,
  ...CONTRACT_TYPE_LABELS,
  ...CONTRACT_GROUP_LABELS,
  ...SPORT_LABELS,
};

type FilterBadgeProps<TData> = ColumnFilter & {
  column: Column<TData, unknown>;
};

function FilterBadge<TData>(props: FilterBadgeProps<TData>) {
  const label = COLUMNS_LABELS[props.id];
  // Normalize value to always be an array
  const values = Array.isArray(props.value)
    ? props.value
    : props.value
      ? [props.value]
      : [];

  function getDisplayValue(val: string | null): string {
    if (val === null) {
      return "(Empty)";
    }
    return COLUMNS_VALUES[val] ?? val;
  }

  function handleRemove(valueToRemove: string | null) {
    const newValues = values.filter((v) => v !== valueToRemove);
    props.column.setFilterValue(newValues.length > 0 ? newValues : undefined);
  }

  return (
    <>
      {values.map((val) => {
        const displayValue = getDisplayValue(val);
        const key = val === null ? "null" : val;
        return (
          <Badge
            key={`${props.id}-${key}`}
            className="flex flex-row items-center justify-between pr-0 rounded-full"
            variant="secondary"
          >
            {label}: {displayValue}{" "}
            <Button
              variant="ghost"
              className="w-2 h-2 gap-0"
              onClick={() => handleRemove(val)}
            >
              <X />
            </Button>
          </Badge>
        );
      })}
    </>
  );
}

export { FilterBadge };
