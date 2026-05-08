import React from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

interface NotesInputProps {
  id: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

function NotesInput(props: NotesInputProps) {
  const [internalValue, setInternalValue] = React.useState("");

  const notesValue = props.value !== undefined ? props.value : internalValue;
  function setNotesValue(newValue: string) {
    if (props.onChange) {
      props.onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  }

  return (
    <InputGroup id={props.id}>
      <InputGroupTextarea
        id="notes"
        placeholder={props.placeholder ?? "Add notes about this contract..."}
        value={notesValue}
        onChange={(e) => {
          if (e.target.value.length <= 500) {
            setNotesValue(e.target.value);
          }
        }}
        maxLength={500}
      />
      <InputGroupAddon align={"block-end"}>
        <InputGroupText className="text-xs text-muted-foreground">
          {notesValue.length}/500
        </InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  );
}

export { NotesInput };
