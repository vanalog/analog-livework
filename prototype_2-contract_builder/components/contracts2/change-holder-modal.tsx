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
import { Textarea } from "@/components/ui/textarea"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface ChangeHolderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contract?: {
    id: string
    title: string
    currentHolder: string
  }
}

const holderOptions = [
  { value: "With Athlete", label: "With Athlete" },
  { value: "With Agent", label: "With Agent" },
  { value: "With Athlete Counsel", label: "With Athlete Counsel" },
  { value: "With University", label: "With University" },
  { value: "With University Legal", label: "With University Legal" },
  { value: "With University Counsel", label: "With University Counsel" },
  { value: "With Big Ten", label: "With Big Ten" },
  { value: "All Parties", label: "All Parties" },
]

export function ChangeHolderModal({ open, onOpenChange, contract }: ChangeHolderModalProps) {
  const [newHolder, setNewHolder] = useState("")
  const [holderPopoverOpen, setHolderPopoverOpen] = useState(false)
  const [notes, setNotes] = useState("")
  const { toast } = useToast()

  const handleSave = () => {
    if (!newHolder) {
      toast({
        title: "Error",
        description: "Please select a new holder",
        variant: "destructive",
      })
      return
    }

    console.log("[v0] Changing holder for contract", contract?.id, "to", newHolder, "with notes:", notes)

    toast({
      title: "Holder Updated",
      description: `Contract holder changed to ${newHolder}`,
    })

    setNewHolder("")
    setNotes("")
    onOpenChange(false)
  }

  const handleCancel = () => {
    setNewHolder("")
    setNotes("")
    onOpenChange(false)
  }

  if (!contract) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Change Contract Holder</DialogTitle>
          <DialogDescription>
            Update the current holder for <span className="font-medium">{contract.title}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Current Holder</Label>
            <div className="text-sm text-muted-foreground">{contract.currentHolder}</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-holder">New Holder *</Label>
            <Popover open={holderPopoverOpen} onOpenChange={setHolderPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="new-holder"
                  variant="outline"
                  role="combobox"
                  aria-expanded={holderPopoverOpen}
                  className="w-full justify-between bg-transparent"
                >
                  {newHolder
                    ? holderOptions.find((option) => option.value === newHolder)?.label
                    : "Select new holder..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                  <CommandInput placeholder="Search holders..." />
                  <CommandList>
                    <CommandEmpty>No holder found.</CommandEmpty>
                    <CommandGroup>
                      {holderOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={(currentValue) => {
                            setNewHolder(currentValue === newHolder ? "" : currentValue)
                            setHolderPopoverOpen(false)
                          }}
                        >
                          <Check
                            className={cn("mr-2 h-4 w-4", newHolder === option.value ? "opacity-100" : "opacity-0")}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any relevant notes about this holder change..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Update Holder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
