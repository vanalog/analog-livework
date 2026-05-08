import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table } from "@tanstack/react-table";

interface FilterColumnProps {
  id: string;
  options: ReadonlyArray<{
    label: string;
    value: string;
  }>;
  allOptionText?: string;
}

interface FilterableColumnProps<TData> {
  filterableColumn: FilterColumnProps;
  loading?: boolean;
  table: Table<TData>;
}

function FilterableColumn<TData>(props: FilterableColumnProps<TData>) {
  return (
    <Select
      value={
        (props.table
          .getColumn(props.filterableColumn.id)
          ?.getFilterValue() as string) ?? "all"
      }
      onValueChange={(value) => {
        props.table
          .getColumn(props.filterableColumn.id)
          ?.setFilterValue(value === "all" ? "" : value);
      }}
      disabled={props.loading}
    >
      <SelectTrigger>
        <SelectValue placeholder={`Select ${props.filterableColumn.id}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="all">
            {props.filterableColumn.allOptionText ??
              `All ${props.filterableColumn.id}s`}
          </SelectItem>
          {props.filterableColumn.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export { FilterableColumn };
export type { FilterColumnProps };
