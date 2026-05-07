"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Upload, Calculator } from "lucide-react"

interface ContractActionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectUpload: () => void
  onSelectBuild: () => void
  athleteName: string
}

export function ContractActionModal({
  open,
  onOpenChange,
  onSelectUpload,
  onSelectBuild,
  athleteName,
}: ContractActionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Contract</DialogTitle>
          <DialogDescription>
            Choose how you&apos;d like to add a contract for {athleteName}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <button
            onClick={() => {
              onOpenChange(false)
              onSelectUpload()
            }}
            className="flex items-start gap-4 p-4 rounded-lg border-2 border-transparent hover:border-foreground/20 hover:bg-muted/50 transition-all text-left group"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted group-hover:bg-background transition-colors">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Upload Existing Contract</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Upload a signed or draft contract document for extraction and review
              </p>
            </div>
          </button>

          <button
            onClick={() => {
              onOpenChange(false)
              onSelectBuild()
            }}
            className="flex items-start gap-4 p-4 rounded-lg border-2 border-transparent hover:border-foreground/20 hover:bg-muted/50 transition-all text-left group"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted group-hover:bg-background transition-colors">
              <Calculator className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Build Schedule</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Generate a payment and obligation schedule to insert into a contract template
              </p>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
