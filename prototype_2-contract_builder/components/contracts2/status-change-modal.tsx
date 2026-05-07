"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

type NegotiationStatus =
  | "draft-sent"
  | "in-redlining"
  | "internal-review"
  | "final-review"
  | "ready-to-sign"
  | "executed"

interface StatusChangeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contractTitle: string
  contractAthlete: string
  currentStatus: NegotiationStatus
  onConfirm: (newStatus: NegotiationStatus) => void
}

const statusOptions: { value: NegotiationStatus; label: string; description: string }[] = [
  {
    value: "draft-sent",
    label: "Draft Sent",
    description: "Initial draft has been sent to relevant parties",
  },
  {
    value: "in-redlining",
    label: "In Redlining",
    description: "Contract is being actively negotiated and edited",
  },
  {
    value: "internal-review",
    label: "Internal Review",
    description: "Under review by internal team or compliance",
  },
  {
    value: "final-review",
    label: "Final Review",
    description: "Final review before sending for signatures",
  },
  {
    value: "ready-to-sign",
    label: "Ready to Sign",
    description: "All parties have approved and contract is ready for execution",
  },
  {
    value: "executed",
    label: "Executed",
    description: "Contract has been signed by all parties",
  },
]

const statusColors: Record<NegotiationStatus, string> = {
  "draft-sent": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "in-redlining": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "internal-review": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "final-review": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "ready-to-sign": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  executed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
}

export function StatusChangeModal({
  open,
  onOpenChange,
  contractTitle,
  contractAthlete,
  currentStatus,
  onConfirm,
}: StatusChangeModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<NegotiationStatus>(currentStatus)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = async () => {
    if (selectedStatus === currentStatus) {
      onOpenChange(false)
      return
    }

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    onConfirm(selectedStatus)
    setIsSubmitting(false)
    onOpenChange(false)
  }

  const currentOption = statusOptions.find((opt) => opt.value === currentStatus)
  const selectedOption = statusOptions.find((opt) => opt.value === selectedStatus)
  const hasChanged = selectedStatus !== currentStatus

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Change Contract Status</DialogTitle>
          <DialogDescription>
            Update the negotiation status for this contract. This will affect tracking and notifications.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Contract Info */}
          <div className="rounded-lg border bg-muted/50 p-3 space-y-1">
            <div className="text-sm font-medium">{contractTitle}</div>
            <div className="text-sm text-muted-foreground">{contractAthlete}</div>
          </div>

          {/* Current Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Current Status</Label>
            <div className="flex items-center gap-2">
              <Badge className={statusColors[currentStatus]}>{currentOption?.label}</Badge>
              <span className="text-sm text-muted-foreground">{currentOption?.description}</span>
            </div>
          </div>

          {/* New Status Selection */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium">
              New Status
            </Label>
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as NegotiationStatus)}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[option.value]}>{option.label}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedOption && <p className="text-sm text-muted-foreground">{selectedOption.description}</p>}
          </div>

          {/* Warning for status change */}
          {hasChanged && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/20 p-3">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-900 dark:text-amber-200">
                Changing the status will update the contract tracking and may trigger notifications to relevant parties.
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isSubmitting || !hasChanged}>
            {isSubmitting ? "Updating..." : "Confirm Change"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
