import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/core/status-badge";
import { ThreadStatus } from "@/types/api-types";
import { THREAD_STATUS_VALUES } from "@/lib/constants";

interface StatusSelectInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  id?: string;
  placeholder: string;
  value?: ThreadStatus;
  onChange?: (value: ThreadStatus) => void;
  invalid?: boolean;
}

function StatusSelectInput(props: StatusSelectInputProps) {
  const [internalValue, setInternalValue] = React.useState<string>("");

  const value = props.value !== undefined ? props.value : internalValue;
  function setValue(newValue: string) {
    if (props.onChange) {
      props.onChange(newValue as ThreadStatus);
    } else {
      setInternalValue(newValue);
    }
  }

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger
        id={props.id}
        className={props.className}
        aria-invalid={props.invalid}
      >
        <SelectValue placeholder={props.placeholder}>
          {value && <StatusBadge status={value as ThreadStatus} />}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {THREAD_STATUS_VALUES.map((status) => (
          <SelectItem key={status} value={status}>
            <StatusBadge status={status} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { StatusSelectInput };
