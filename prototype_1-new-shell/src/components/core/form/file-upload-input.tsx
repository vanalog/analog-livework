import React from "react";
import { File, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FileUploadInputProps {
  id?: string;
  value?: File | undefined;
  onChange?: (file: File | undefined) => void;
  invalid?: boolean;
}

function FileUploadInput(props: FileUploadInputProps) {
  const [internalFile, setInternalFile] = React.useState<File | undefined>(
    undefined,
  );

  const selectedFile = props.value !== undefined ? props.value : internalFile;
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || undefined;

    if (props.onChange) {
      props.onChange(file);
    } else {
      setInternalFile(file);
    }
  }

  return (
    <Card className="border-2 border-dashed border-muted-foreground/25 p-8 shadow-none">
      <div className="relative flex flex-col justify-center items-center">
        {selectedFile ? (
          <div className="flex items-center gap-2 text-sm text-foreground text-center font-medium">
            <File className="w-4 h-4" /> {selectedFile.name}
          </div>
        ) : (
          <>
            <Upload className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground text-center mb-2">
              Drag and drop files here or{" "}
              <span className="text-primary cursor-pointer hover:underline font-medium">
                browse
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              Accepts .pdf, .docx, .doc
            </p>
          </>
        )}
        <input
          id={props.id}
          name={props.id}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          accept=".pdf,.doc,.docx"
          type="file"
          onChange={handleFileChange}
          aria-invalid={props.invalid}
        />
      </div>
    </Card>
  );
}

export { FileUploadInput };
