import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";

interface SearchableColumnProps<TData> {
  searchableColumn: string;
  loading?: boolean;
  table: Table<TData>;
}

function SearchableColumn<TData>(props: SearchableColumnProps<TData>) {
  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={`Search by ${props.searchableColumn.toLowerCase()}...`}
        value={
          (props.table
            .getColumn(props.searchableColumn)
            ?.getFilterValue() as string) ?? ""
        }
        onChange={(event) =>
          props.table
            .getColumn(props.searchableColumn)
            ?.setFilterValue(event.target.value)
        }
        className="pl-9"
        disabled={props.loading}
      />
    </div>
  );
}

export { SearchableColumn };
