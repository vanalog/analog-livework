"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toDisplayDate } from "@/lib/formatters";

interface DatePickerInputProps {
  id?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  invalid?: boolean;
}

function DatePickerInput(props: DatePickerInputProps) {
  const [open, setOpen] = React.useState(false);
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    undefined,
  );

  const date = props.value !== undefined ? props.value : internalDate;
  function setDate(newDate: Date | undefined) {
    if (props.onChange) {
      props.onChange(newDate);
    } else {
      setInternalDate(newDate);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen} modal={false}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={props.id}
            className="justify-between font-normal"
            aria-invalid={props.invalid}
          >
            {date ? toDisplayDate(date) : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0 pointer-events-auto"
          align="start"
        >
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            startMonth={new Date(2025, 0)}
            endMonth={new Date(2035, 0)}
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
            timeZone="UTC"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export { DatePickerInput };
