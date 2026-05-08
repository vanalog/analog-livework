import React from "react";
import ReactCurrencyInput from "react-currency-input-field";
import { cn } from "@/lib/utils";

interface CurrencyInputProps {
  id?: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
}

function CurrencyInput(props: CurrencyInputProps) {
  const [internalValue, setInternalValue] = React.useState<string | undefined>(
    "",
  );

  const value = props.value !== undefined ? props.value : internalValue;
  function setValue(newValue: string | undefined) {
    if (props.onChange) {
      props.onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  }

  return (
    <ReactCurrencyInput
      disabled={props.disabled}
      id={props.id}
      name={props.id}
      placeholder="$0.00"
      prefix="$"
      decimalsLimit={2}
      value={value}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        props.className,
      )}
      onValueChange={setValue}
      aria-invalid={props.invalid}
    />
  );
}

export { CurrencyInput };
