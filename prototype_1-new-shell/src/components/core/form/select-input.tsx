import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectInputItem = {
  value: string;
  label: string;
};

interface SelectInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  id?: string;
  items: SelectInputItem[];
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  invalid?: boolean;
}

function SelectInput(props: SelectInputProps) {
  const [internalValue, setInternalValue] = React.useState<string>("");

  const value = props.value !== undefined ? props.value : internalValue;
  function setValue(newValue: string) {
    if (props.onChange) {
      props.onChange(newValue);
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
        <SelectValue placeholder={props.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {props.items.map((c) => (
          <SelectItem key={c.value} value={c.value}>
            {c.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { SelectInput };
