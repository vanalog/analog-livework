"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
}

// Format a number string with commas
function formatWithCommas(value: string): string {
  // Remove all non-digit characters except decimal point
  const cleaned = value.replace(/[^\d.]/g, "");
  
  // Split by decimal point
  const parts = cleaned.split(".");
  
  // Format the integer part with commas
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  // Join back with decimal if exists (limit to 2 decimal places)
  if (parts.length > 1) {
    return parts[0] + "." + parts[1].slice(0, 2);
  }
  
  return parts[0];
}

// Remove commas and return raw numeric string
function removeCommas(value: string): string {
  return value.replace(/,/g, "");
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    // Format the display value with commas
    const displayValue = formatWithCommas(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      // Remove commas before storing the raw value
      const rawValue = removeCommas(inputValue);
      
      // Only allow valid numeric input
      if (rawValue === "" || /^\d*\.?\d{0,2}$/.test(rawValue)) {
        onChange(rawValue);
      }
    };

    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          $
        </span>
        <Input
          ref={ref}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          className={cn("pl-7", className)}
          {...props}
        />
      </div>
    );
  }
);
CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
