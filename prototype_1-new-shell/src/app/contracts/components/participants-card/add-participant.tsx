import { Button } from "@/components/ui/button";
import {
  Command,
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
import { useApi } from "@/lib/api";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { NewParticipant } from "./new-participant";
import { Participant } from "@/types/api-types";

type ListItem = {
  value: string;
  label: string;
};

function createFilter(items: ListItem[] | undefined) {
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

    // Indirect match (assumes API request is performing filtering where appropriate)
    return 0.1;
  };
}

function AddParticipant(props: { onAdd(participant: Participant): void }) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [items, setItems] = useState<ListItem[] | undefined>();
  const $api = useApi();

  const searchedParticipants = $api.useQuery(
    "get",
    "/v1/participants/list",
    {
      params: {
        query: {
          q: searchValue,
        },
      },
    },
    {
      enabled: !!searchValue,
    },
  );

  useEffect(() => {
    if (searchedParticipants.isLoading) {
      return;
    }

    setItems(searchedParticipants.data?.data);
  }, [searchedParticipants, searchValue]);

  const selectedParticipant = $api.useMutation(
    "get",
    "/v1/participants/{participant_uuid}",
  );

  function handleNew(participant: Participant) {
    props.onAdd(participant);
    setSearchValue("");
    setOpen(false);
  }

  async function handleExisting(participantUuid: string) {
    const participant = await selectedParticipant.mutateAsync({
      params: {
        path: {
          participant_uuid: participantUuid,
        },
      },
    });
    props.onAdd(participant);
    setSearchValue("");
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          <Plus size={16} />
          Add
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 pointer-events-auto" align="end">
        <Command filter={createFilter(items)}>
          <CommandInput
            className="h-9"
            value={searchValue}
            onValueChange={setSearchValue}
            placeholder="Search"
          />
          <CommandList>
            <CommandGroup forceMount>
              <CommandItem forceMount className="pl-0">
                <NewParticipant onSubmit={handleNew} />
              </CommandItem>
            </CommandGroup>
          </CommandList>
          <CommandList>
            <CommandGroup>
              {items?.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={handleExisting}
                >
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { AddParticipant };
