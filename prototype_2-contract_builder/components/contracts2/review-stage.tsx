"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  ChevronDown,
  ChevronRight,
  Pencil,
  Trash2,
  Plus,
  ArrowLeft,
  Check,
  X,
  Download,
  GripVertical,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useContractWorkflow, type ExtractedParty, type ExtractedExchange, type ExtractedDeliverable, type ExtractedTerm } from "@/lib/contract-workflow-context"
import { StageProgress } from "./stage-progress"
import { CapImpactChart } from "./cap-impact-chart"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts"

// Participant interface for people involved in contract negotiation
interface ContractParticipant {
  id: string
  name: string
  role: string
  email: string
  phone: string
}

// Participant row component with edit/delete confirmation
function ParticipantRow({
  participant,
  onUpdate,
  onDelete,
}: {
  participant: ContractParticipant
  onUpdate: (id: string, updates: Partial<ContractParticipant>) => void
  onDelete: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draftName, setDraftName] = useState(participant.name)
  const [draftRole, setDraftRole] = useState(participant.role)
  const [draftEmail, setDraftEmail] = useState(participant.email)
  const [draftPhone, setDraftPhone] = useState(participant.phone)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const prepareSave = () => {
    setShowConfirmDialog(true)
  }

  const confirmSave = () => {
    onUpdate(participant.id, {
      name: draftName,
      role: draftRole,
      email: draftEmail,
      phone: draftPhone,
    })
    setShowConfirmDialog(false)
    setEditing(false)
  }

  const cancel = () => {
    setDraftName(participant.name)
    setDraftRole(participant.role)
    setDraftEmail(participant.email)
    setDraftPhone(participant.phone)
    setEditing(false)
  }

  const confirmDelete = () => {
    onDelete(participant.id)
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <tr className="border-b last:border-b-0 transition-colors">
        {editing ? (
          <>
            <td className="py-2 px-3">
              <Input value={draftName} onChange={e => setDraftName(e.target.value)} className="h-7 text-sm" placeholder="Full Name" />
            </td>
            <td className="py-2 px-3">
              <Input value={draftRole} onChange={e => setDraftRole(e.target.value)} className="h-7 text-sm" placeholder="Role" />
            </td>
            <td className="py-2 px-3">
              <Input value={draftEmail} onChange={e => setDraftEmail(e.target.value)} className="h-7 text-sm" placeholder="email@example.com" type="email" />
            </td>
            <td className="py-2 px-3">
              <Input value={draftPhone} onChange={e => setDraftPhone(e.target.value)} className="h-7 text-sm" placeholder="(555) 555-5555" />
            </td>
            <td className="py-2 px-3 text-right">
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={cancel}>
                  <X className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" className="h-7 text-xs px-2" onClick={prepareSave}>Save</Button>
              </div>
            </td>
          </>
        ) : (
          <>
            <td className="py-2.5 px-3 text-sm font-medium text-foreground">{participant.name}</td>
            <td className="py-2.5 px-3 text-sm text-muted-foreground">{participant.role}</td>
            <td className="py-2.5 px-3 text-sm text-muted-foreground">{participant.email || "—"}</td>
            <td className="py-2.5 px-3 text-sm text-muted-foreground">{participant.phone || "—"}</td>
            <td className="py-2.5 px-3 text-right">
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setEditing(true)}>
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setShowDeleteConfirm(true)}>
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>
            </td>
          </>
        )}
      </tr>

      {/* Edit Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to save these changes to this participant?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{draftName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role:</span>
              <span className="font-medium">{draftRole}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{draftEmail || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone:</span>
              <span className="font-medium">{draftPhone || "—"}</span>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
            <Button onClick={confirmSave}>Confirm Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Participant</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this participant? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{participant.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role:</span>
              <span className="font-medium">{participant.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{participant.email || "—"}</span>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete Participant</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

function formatDate(iso: string) {
  if (!iso) return "\u2014"
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function ConfidenceBadge({ level, className }: { level: "high" | "medium" | "low"; className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] font-medium px-1.5 py-0",
        level === "high" && "border-emerald-300 text-emerald-700 bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:bg-emerald-950/30",
        level === "medium" && "border-amber-300 text-amber-700 bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:bg-amber-950/30",
        level === "low" && "border-amber-400 text-amber-800 bg-amber-100 dark:border-amber-600 dark:text-amber-300 dark:bg-amber-950/50",
        className
      )}
    >
      {level === "high" ? "High" : level === "medium" ? "Medium" : "Low"}
    </Badge>
  )
}


function EditedBadge() {
  return (
    <Badge
      variant="outline"
      className="text-[9px] font-medium px-1 py-0 border-blue-300 text-blue-700 bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:bg-blue-950/30"
    >
      Edited
    </Badge>
  )
}

// Deliverable row component
function DeliverableRow({
  deliverable,
  onUpdate,
  onDelete,
}: {
  deliverable: ExtractedDeliverable
  onUpdate: (id: string, updates: Partial<ExtractedDeliverable>) => void
  onDelete: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draftDesc, setDraftDesc] = useState(deliverable.description)
  const [draftDirection, setDraftDirection] = useState(deliverable.direction)
  const [draftQuantity, setDraftQuantity] = useState(deliverable.quantity)
  const [draftDeadline, setDraftDeadline] = useState(deliverable.deadline)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [pendingUpdates, setPendingUpdates] = useState<Partial<ExtractedDeliverable> | null>(null)

  const prepareSave = () => {
    const updates: Partial<ExtractedDeliverable> = {
      description: draftDesc,
      direction: draftDirection,
      quantity: draftQuantity,
      deadline: draftDeadline,
      edited: true,
    }
    setPendingUpdates(updates)
    setShowConfirmDialog(true)
  }

  const confirmSave = () => {
    if (pendingUpdates) {
      onUpdate(deliverable.id, pendingUpdates)
    }
    setShowConfirmDialog(false)
    setPendingUpdates(null)
    setEditing(false)
  }

  const cancelConfirm = () => {
    setShowConfirmDialog(false)
    setPendingUpdates(null)
  }

  const cancel = () => {
    setDraftDesc(deliverable.description)
    setDraftDirection(deliverable.direction)
    setDraftQuantity(deliverable.quantity)
    setDraftDeadline(deliverable.deadline)
    setEditing(false)
  }

  return (
    <>
      <tr className="border-b last:border-b-0 hover:bg-muted/20 transition-colors align-top">
        {editing ? (
          <>
            <td className="py-2 px-3"><Input value={draftDesc} onChange={e => setDraftDesc(e.target.value)} className="h-7 text-sm" /></td>
            <td className="py-2 px-3"><Input value={draftDirection} onChange={e => setDraftDirection(e.target.value)} className="h-7 text-sm w-36" /></td>
<td className="py-2 px-3"><Input value={draftQuantity} onChange={e => setDraftQuantity(e.target.value)} className="h-7 text-sm w-28" /></td>
  <td className="py-2 px-3"><Input type="date" value={draftDeadline} onChange={e => setDraftDeadline(e.target.value)} className="h-7 text-sm" /></td>
  <td className="py-2 px-3 text-right">
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={cancel}><X className="h-3.5 w-3.5" /></Button>
                <Button size="sm" className="h-7 text-xs px-2" onClick={prepareSave}>Save</Button>
              </div>
            </td>
          </>
        ) : (
          <>
            <td className="py-2.5 px-3 text-sm text-foreground">
              <div className="flex items-start gap-1.5">
                <span>{deliverable.description}</span>
                {deliverable.edited && <EditedBadge />}
              </div>
            </td>
            <td className="py-2.5 px-3 text-sm text-muted-foreground">{deliverable.direction}</td>
<td className="py-2.5 px-3 text-sm text-muted-foreground">{deliverable.quantity}</td>
  <td className="py-2.5 px-3 text-sm text-muted-foreground">{formatDate(deliverable.deadline)}</td>
  <td className="py-2.5 px-3 text-right">
              <div className="flex items-center justify-end gap-0.5">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setEditing(true)}>
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setShowDeleteConfirm(true)}>
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>
            </td>
          </>
        )}
      </tr>

      {/* Edit Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to save these changes to this obligation?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Description:</span>
              <span className="font-medium max-w-[200px] truncate">{draftDesc}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantity:</span>
              <span className="font-medium">{draftQuantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Deadline:</span>
              <span className="font-medium">{formatDate(draftDeadline)}</span>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={cancelConfirm}>Cancel</Button>
            <Button onClick={confirmSave}>Confirm Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Obligation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this obligation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Description:</span>
              <span className="font-medium max-w-[200px] truncate">{deliverable.description}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantity:</span>
              <span className="font-medium">{deliverable.quantity}</span>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { onDelete(deliverable.id); setShowDeleteConfirm(false) }}>Delete Obligation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Term row component
function TermRow({
  term,
  onUpdate,
  onDelete,
}: {
  term: ExtractedTerm
  onUpdate: (id: string, updates: Partial<ExtractedTerm>) => void
  onDelete: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draftDesc, setDraftDesc] = useState(term.description)
  const [draftDirection, setDraftDirection] = useState(term.direction)
  const [draftDuration, setDraftDuration] = useState<"Term" | "Post-term" | "N/A">(term.duration)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingUpdates, setPendingUpdates] = useState<Partial<ExtractedTerm> | null>(null)

  const prepareSave = () => {
    const updates: Partial<ExtractedTerm> = {
      description: draftDesc,
      direction: draftDirection,
      duration: draftDuration,
      edited: true,
    }
    setPendingUpdates(updates)
    setShowConfirmDialog(true)
  }

  const confirmSave = () => {
    if (pendingUpdates) {
      onUpdate(term.id, pendingUpdates)
    }
    setShowConfirmDialog(false)
    setPendingUpdates(null)
    setEditing(false)
  }

  const cancelConfirm = () => {
    setShowConfirmDialog(false)
    setPendingUpdates(null)
  }

  const cancel = () => {
    setDraftDesc(term.description)
    setDraftDirection(term.direction)
    setDraftDuration(term.duration)
    setEditing(false)
  }

  return (
    <>
      <tr className="border-b last:border-b-0 hover:bg-muted/20 transition-colors align-top">
        {editing ? (
          <>
            <td className="py-2 px-3"><Input value={draftDesc} onChange={e => setDraftDesc(e.target.value)} className="h-7 text-sm" /></td>
            <td className="py-2 px-3"><Input value={draftDirection} onChange={e => setDraftDirection(e.target.value)} className="h-7 text-sm w-36" /></td>
            <td className="py-2 px-3">
              <Select value={draftDuration} onValueChange={(v) => setDraftDuration(v as "Term" | "Post-term" | "N/A")}>
                <SelectTrigger className="h-7 text-sm w-28"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Term">Term</SelectItem>
                  <SelectItem value="Post-term">Post-term</SelectItem>
                  <SelectItem value="N/A">N/A</SelectItem>
                </SelectContent>
              </Select>
            </td>
            <td className="py-2 px-3"><ConfidenceBadge level={term.confidence} /></td>
            <td className="py-2 px-3 text-right">
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={cancel}><X className="h-3.5 w-3.5" /></Button>
                <Button size="sm" className="h-7 text-xs px-2" onClick={prepareSave}>Save</Button>
              </div>
            </td>
          </>
        ) : (
          <>
            <td className="py-2.5 px-3 text-sm text-foreground">
              <div className="flex items-start gap-1.5">
                <span>{term.description}</span>
                {term.edited && <EditedBadge />}
              </div>
            </td>
            <td className="py-2.5 px-3 text-sm text-muted-foreground">{term.direction}</td>
            <td className="py-2.5 px-3 text-sm text-muted-foreground">{term.duration}</td>
            <td className="py-2.5 px-3"><ConfidenceBadge level={term.confidence} /></td>
            <td className="py-2.5 px-3 text-right">
              <div className="flex items-center justify-end gap-0.5">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setEditing(true)}>
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onDelete(term.id)}>
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>
            </td>
          </>
        )}
      </tr>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to save these changes to this term? This will update the term record.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Description:</span>
              <span className="font-medium max-w-[200px] truncate">{draftDesc}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Direction:</span>
              <span className="font-medium">{draftDirection}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-medium">{draftDuration}</span>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={cancelConfirm}>Cancel</Button>
            <Button onClick={confirmSave}>Confirm Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Inline edit row for parties
function PartyRow({ party, onUpdate }: { party: ExtractedParty; onUpdate: (id: string, updates: Partial<ExtractedParty>) => void }) {
  const [editing, setEditing] = useState(false)
  const [draftFirstName, setDraftFirstName] = useState(party.firstName)
  const [draftLastName, setDraftLastName] = useState(party.lastName)
  const [draftRole, setDraftRole] = useState(party.role)
  const [draftEntityType, setDraftEntityType] = useState<"Person" | "Organization">(party.entityType)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const prepareSave = () => {
    setShowConfirmDialog(true)
  }

  const confirmSave = () => {
    onUpdate(party.id, {
      firstName: draftFirstName,
      lastName: draftLastName,
      name: `${draftFirstName} ${draftLastName}`,
      role: draftRole,
      entityType: draftEntityType,
      reviewed: true,
      edited: true,
    })
    setShowConfirmDialog(false)
    setEditing(false)
  }

  const cancel = () => {
    setDraftFirstName(party.firstName)
    setDraftLastName(party.lastName)
    setDraftRole(party.role)
    setDraftEntityType(party.entityType)
    setEditing(false)
  }

  const markReviewed = () => {
    onUpdate(party.id, { reviewed: true })
  }

  return (
    <>
      <tr className={cn(
        "border-b last:border-b-0 transition-colors",
        party.confidence === "low" && !party.reviewed && "bg-amber-50/50 dark:bg-amber-950/20"
      )}>
        {editing ? (
          <>
            <td className="py-2 px-3">
              <Input value={draftFirstName} onChange={e => setDraftFirstName(e.target.value)} className="h-7 text-sm" />
            </td>
            <td className="py-2 px-3">
              <Input value={draftLastName} onChange={e => setDraftLastName(e.target.value)} className="h-7 text-sm" />
            </td>
            <td className="py-2 px-3">
              <Input value={draftRole} onChange={e => setDraftRole(e.target.value)} className="h-7 text-sm" />
            </td>
            <td className="py-2 px-3">
              <Select value={draftEntityType} onValueChange={(v) => setDraftEntityType(v as "Person" | "Organization")}>
                <SelectTrigger className="h-7 text-sm w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Person">Person</SelectItem>
                  <SelectItem value="Organization">Organization</SelectItem>
                </SelectContent>
              </Select>
            </td>
            <td className="py-2.5 px-3"><ConfidenceBadge level={party.confidence} /></td>
            <td className="py-2 px-3 text-right">
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={cancel}>
                  <X className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" className="h-7 text-xs px-2" onClick={prepareSave}>Save</Button>
              </div>
            </td>
          </>
        ) : (
          <>
            <td className="py-2.5 px-3 text-sm font-medium text-foreground">
              <div className="flex items-center gap-1.5">
                {party.firstName}
                {party.edited && <EditedBadge />}
              </div>
            </td>
            <td className="py-2.5 px-3 text-sm font-medium text-foreground">{party.lastName}</td>
            <td className="py-2.5 px-3 text-sm text-muted-foreground">{party.role}</td>
            <td className="py-2.5 px-3 text-sm text-muted-foreground">{party.entityType}</td>
            <td className="py-2.5 px-3">
              <ConfidenceBadge level={party.confidence} />
            </td>
            <td className="py-2.5 px-3 text-right">
              <div className="flex items-center justify-end gap-1">
                {party.confidence === "low" && !party.reviewed && (
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2 border-amber-300 text-amber-700 hover:bg-amber-50" onClick={markReviewed}>
                    Confirm
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setEditing(true)}>
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>
            </td>
          </>
        )}
      </tr>

      {/* Edit Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to save these changes to this party?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{draftFirstName} {draftLastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Role:</span>
              <span className="font-medium">{draftRole}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Entity Type:</span>
              <span className="font-medium">{draftEntityType}</span>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
            <Button onClick={confirmSave}>Confirm Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Helpers for exchange columns
function getPeriodRange(dateStr: string): string {
  if (!dateStr) return "\u2014"
  const d = new Date(dateStr + "T00:00:00")
  const y = d.getFullYear()
  const m = d.getMonth()
  const start = new Date(y, m, 1)
  const end = new Date(y, m + 1, 0)
  const fmt = (dt: Date) => dt.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  return `${fmt(start)} \u2013 ${fmt(end)}, ${y}`
}

function getFiscalYear(dateStr: string): string {
  if (!dateStr) return "\u2014"
  const d = new Date(dateStr + "T00:00:00")
  const m = d.getMonth() // 0-indexed; Jul=6
  const y = d.getFullYear()
  // Fiscal year starts Jul 1 -- FY27 = Jul 2026 - Jun 2027
  return m >= 6 ? `FY${(y + 1).toString().slice(-2)}` : `FY${y.toString().slice(-2)}`
}

// Get Cap Period in date range format (7/1/25-6/30/26)
function getCapPeriod(dateStr: string): string {
  if (!dateStr) return "\u2014"
  const d = new Date(dateStr + "T00:00:00")
  const m = d.getMonth() // 0-indexed; Jul=6
  const y = d.getFullYear()
  // Cap period runs Jul 1 - Jun 30
  if (m >= 6) {
    // Jul-Dec: period is current year Jul 1 to next year Jun 30
    const startYear = y.toString().slice(-2)
    const endYear = (y + 1).toString().slice(-2)
    return `7/1/${startYear}-6/30/${endYear}`
  } else {
    // Jan-Jun: period is previous year Jul 1 to current year Jun 30
    const startYear = (y - 1).toString().slice(-2)
    const endYear = y.toString().slice(-2)
    return `7/1/${startYear}-6/30/${endYear}`
  }
}

// Get Cap Period key for grouping (e.g., "FY26" style for sorting)
function getCapPeriodKey(dateStr: string): string {
  if (!dateStr) return ""
  const d = new Date(dateStr + "T00:00:00")
  const m = d.getMonth()
  const y = d.getFullYear()
  return m >= 6 ? `${y}` : `${y - 1}`
}

function getAthleticSeason(dateStr: string): string {
  if (!dateStr) return "\u2014"
  const d = new Date(dateStr + "T00:00:00")
  const y = d.getFullYear()
  const m = d.getMonth() // 0-indexed; Jul=6
  // Athletic season runs roughly Jul - Jun, labelled as e.g. 2026-27
  if (m >= 6) return `${y}-${(y + 1).toString().slice(-2)}`
  return `${y - 1}-${y.toString().slice(-2)}`
}

function isConditional(cadence: string): boolean {
  const c = cadence.toLowerCase()
  return c.includes("conditional")
}

// Available cap periods for selection
const CAP_PERIODS = [
  { value: "2025", label: "7/1/25-6/30/26" },
  { value: "2026", label: "7/1/26-6/30/27" },
  { value: "2027", label: "7/1/27-6/30/28" },
  { value: "2028", label: "7/1/28-6/30/29" },
]

// Period options for selection
const PERIOD_OPTIONS = [
  { value: "2026-01", label: "Jan 1 - Jan 31, 2026" },
  { value: "2026-02", label: "Feb 1 - Feb 28, 2026" },
  { value: "2026-03", label: "Mar 1 - Mar 31, 2026" },
  { value: "2026-04", label: "Apr 1 - Apr 30, 2026" },
  { value: "2026-05", label: "May 1 - May 31, 2026" },
  { value: "2026-06", label: "Jun 1 - Jun 30, 2026" },
  { value: "2026-07", label: "Jul 1 - Jul 31, 2026" },
  { value: "2026-08", label: "Aug 1 - Aug 31, 2026" },
  { value: "2026-09", label: "Sep 1 - Sep 30, 2026" },
  { value: "2026-10", label: "Oct 1 - Oct 31, 2026" },
  { value: "2026-11", label: "Nov 1 - Nov 30, 2026" },
  { value: "2026-12", label: "Dec 1 - Dec 31, 2026" },
  { value: "2027-01", label: "Jan 1 - Jan 31, 2027" },
  { value: "2027-02", label: "Feb 1 - Feb 28, 2027" },
  { value: "2027-03", label: "Mar 1 - Mar 31, 2027" },
  { value: "2027-04", label: "Apr 1 - Apr 30, 2027" },
  { value: "2027-05", label: "May 1 - May 31, 2027" },
  { value: "2027-06", label: "Jun 1 - Jun 30, 2027" },
  { value: "2027-07", label: "Jul 1 - Jul 31, 2027" },
  { value: "2027-08", label: "Aug 1 - Aug 31, 2027" },
  { value: "2027-09", label: "Sep 1 - Sep 30, 2027" },
  { value: "2027-10", label: "Oct 1 - Oct 31, 2027" },
  { value: "2027-11", label: "Nov 1 - Nov 30, 2027" },
  { value: "2027-12", label: "Dec 1 - Dec 31, 2027" },
  { value: "2028-01", label: "Jan 1 - Jan 31, 2028" },
]

// Get period key from date string
function getPeriodKey(dateStr: string): string {
  if (!dateStr) return ""
  const d = new Date(dateStr + "T00:00:00")
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

// Non-sortable exchange row for conditional payments
function ExchangeRow({
  exchange,
  onUpdate,
  onDelete,
}: {
  exchange: ExtractedExchange
  onUpdate: (id: string, updates: Partial<ExtractedExchange>) => void
  onDelete: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draftAmount, setDraftAmount] = useState(exchange.amount)
  const [draftDate, setDraftDate] = useState(exchange.dateTrigger)
  const [draftCadence, setDraftCadence] = useState(exchange.cadence)
  const [draftType, setDraftType] = useState(exchange.type || "")
  const [draftCapApplicable, setDraftCapApplicable] = useState(exchange.capApplicable !== false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [pendingUpdates, setPendingUpdates] = useState<Partial<ExtractedExchange> | null>(null)

  const prepareSave = () => {
    const updates: Partial<ExtractedExchange> = {
      amount: draftAmount,
      dateTrigger: draftDate,
      cadence: draftCadence,
      type: draftType || undefined,
      capApplicable: draftCapApplicable,
      reviewed: true,
      edited: true,
    }
    setPendingUpdates(updates)
    setShowConfirmDialog(true)
  }

  const confirmSave = () => {
    if (pendingUpdates) {
      onUpdate(exchange.id, pendingUpdates)
    }
    setShowConfirmDialog(false)
    setPendingUpdates(null)
    setEditing(false)
  }

  const cancelConfirm = () => {
    setShowConfirmDialog(false)
    setPendingUpdates(null)
  }

  const cancel = () => {
    setDraftAmount(exchange.amount)
    setDraftDate(exchange.dateTrigger)
    setDraftCadence(exchange.cadence)
    setDraftType(exchange.type || "")
    setDraftCapApplicable(exchange.capApplicable !== false)
    setEditing(false)
  }

  const confirmDelete = () => {
    onDelete(exchange.id)
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <tr className={cn(
        "border-b last:border-b-0 transition-colors",
        exchange.confidence === "low" && !exchange.reviewed && "bg-amber-50/50 dark:bg-amber-950/20"
      )}>
        {editing ? (
          <>
            <td className="py-2 px-3"><Input type="date" value={draftDate} onChange={e => setDraftDate(e.target.value)} className="h-7 text-sm" /></td>
            <td className="py-2 px-3 text-sm text-muted-foreground">{getPeriodRange(draftDate)}</td>
            <td className="py-2 px-3"><Input type="number" value={draftAmount} onChange={e => setDraftAmount(Number(e.target.value))} className="h-7 text-sm w-24" /></td>
            <td className="py-2 px-3">
              <Input value={draftType} onChange={e => setDraftType(e.target.value)} placeholder="e.g. Bowl Game Bonus" className="h-7 text-sm w-40" />
            </td>
            <td className="py-2 px-3 text-sm text-muted-foreground text-center">{getFiscalYear(draftDate)}</td>
            <td className="py-2 px-3 text-center">
              <Checkbox
                checked={draftCapApplicable}
                onCheckedChange={(checked) => setDraftCapApplicable(checked === true)}
                className="mx-auto"
              />
            </td>
            <td className="py-2 px-3 text-sm text-muted-foreground text-center">{getCapPeriod(draftDate)}</td>
            <td className="py-2 px-3 text-right">
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={cancel}><X className="h-3.5 w-3.5" /></Button>
                <Button size="sm" className="h-7 text-xs px-2" onClick={prepareSave}>Save</Button>
              </div>
            </td>
          </>
        ) : (
          <>
            <td className="py-2.5 px-3 text-sm font-medium text-foreground">
              <div className="flex items-center gap-1.5">
                {formatDate(exchange.dateTrigger)}
                {exchange.edited && <EditedBadge />}
              </div>
            </td>
            <td className="py-2.5 px-3 text-sm text-muted-foreground">{getPeriodRange(exchange.dateTrigger)}</td>
            <td className="py-2.5 px-3 text-sm font-semibold text-foreground">{formatCurrency(exchange.amount)}</td>
            <td className="py-2.5 px-3 text-sm text-muted-foreground">
              {exchange.type || "Conditional Bonus"}
            </td>
            <td className="py-2.5 px-3 text-sm text-muted-foreground text-center">{getFiscalYear(exchange.dateTrigger)}</td>
            <td className="py-2.5 px-3 text-center">
              {exchange.capApplicable !== false ? (
                <Check className="h-4 w-4 text-emerald-600 mx-auto" />
              ) : (
                <X className="h-4 w-4 text-muted-foreground mx-auto" />
              )}
            </td>
            <td className="py-2.5 px-3 text-sm text-muted-foreground text-center">{getCapPeriod(exchange.dateTrigger)}</td>
            <td className="py-2.5 px-3 text-right">
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setEditing(true)}>
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setShowDeleteConfirm(true)}>
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>
            </td>
          </>
        )}
      </tr>

      {/* Edit Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to save these changes? This will update the payment record.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">{formatCurrency(draftAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Date:</span>
              <span className="font-medium">{formatDate(draftDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cap Applicable:</span>
              <span className="font-medium">{draftCapApplicable ? "Yes" : "No"}</span>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={cancelConfirm}>Cancel</Button>
            <Button onClick={confirmSave}>Confirm Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this payment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">{formatCurrency(exchange.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Date:</span>
              <span className="font-medium">{formatDate(exchange.dateTrigger)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium">{exchange.type || "Conditional Bonus"}</span>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Sortable exchange row with drag handle
function SortableExchangeRow({
  exchange,
  onUpdate,
  onDelete,
  isDragging,
}: {
  exchange: ExtractedExchange
  onUpdate: (id: string, updates: Partial<ExtractedExchange>) => void
  onDelete: (id: string) => void
  isDragging?: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: exchange.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const [editing, setEditing] = useState(false)
  const [draftAmount, setDraftAmount] = useState(exchange.amount)
  const [draftDate, setDraftDate] = useState(exchange.dateTrigger)
  const [draftCadence, setDraftCadence] = useState(exchange.cadence)
  const [draftType, setDraftType] = useState(exchange.type || "")
  const [draftCapApplicable, setDraftCapApplicable] = useState(exchange.capApplicable !== false)
  const [draftCapPeriod, setDraftCapPeriod] = useState(getCapPeriodKey(exchange.dateTrigger))
  const [draftPeriod, setDraftPeriod] = useState(getPeriodKey(exchange.dateTrigger))
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [pendingUpdates, setPendingUpdates] = useState<Partial<ExtractedExchange> | null>(null)

  const prepareSave = () => {
    const updates: Partial<ExtractedExchange> = {
      amount: draftAmount,
      dateTrigger: draftDate,
      cadence: draftCadence,
      type: draftType || undefined,
      capApplicable: draftCapApplicable,
      reviewed: true,
      edited: true,
    }
    setPendingUpdates(updates)
    setShowConfirmDialog(true)
  }

  const confirmSave = () => {
    if (pendingUpdates) {
      onUpdate(exchange.id, pendingUpdates)
    }
    setShowConfirmDialog(false)
    setPendingUpdates(null)
    setEditing(false)
  }

  const cancelConfirm = () => {
    setShowConfirmDialog(false)
    setPendingUpdates(null)
  }

  const cancel = () => {
    setDraftAmount(exchange.amount)
    setDraftDate(exchange.dateTrigger)
    setDraftCadence(exchange.cadence)
    setDraftType(exchange.type || "")
    setDraftCapApplicable(exchange.capApplicable !== false)
    setDraftCapPeriod(getCapPeriodKey(exchange.dateTrigger))
    setDraftPeriod(getPeriodKey(exchange.dateTrigger))
    setEditing(false)
  }

  const confirmDelete = () => {
    onDelete(exchange.id)
    setShowDeleteConfirm(false)
  }

  const conditional = isConditional(exchange.cadence)

  // Get display for cap period
  const capPeriodDisplay = CAP_PERIODS.find(p => p.value === draftCapPeriod)?.label || getCapPeriod(draftDate)

  return (
    <>
      <tr
        ref={setNodeRef}
        style={style}
        className={cn(
          "border-b last:border-b-0 transition-colors bg-background",
          exchange.confidence === "low" && !exchange.reviewed && "bg-amber-50/50 dark:bg-amber-950/20",
          isDragging && "opacity-50"
        )}
      >
        {editing ? (
          <>
            <td className="py-2 px-1 w-8">
              <div className="w-6 h-6" />
            </td>
            <td className="py-2 px-3"><Input type="date" value={draftDate} onChange={e => setDraftDate(e.target.value)} className="h-7 text-sm" /></td>
            <td className="py-2 px-3">
              <Select value={draftPeriod} onValueChange={setDraftPeriod}>
                <SelectTrigger className="h-7 text-sm w-44"><SelectValue placeholder="Select period" /></SelectTrigger>
                <SelectContent>
                  {PERIOD_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </td>
            <td className="py-2 px-3"><Input type="number" value={draftAmount} onChange={e => setDraftAmount(Number(e.target.value))} className="h-7 text-sm w-24" /></td>
            <td className="py-2 px-3">
              {conditional ? (
                <Input value={draftType} onChange={e => setDraftType(e.target.value)} placeholder="e.g. Bowl Game Bonus" className="h-7 text-sm w-40" />
              ) : (
                <Select value={draftCadence} onValueChange={(v) => { setDraftCadence(v); setDraftType(v === "One-time" ? "Signing Bonus" : "License Fee") }}>
                  <SelectTrigger className="h-7 text-sm w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">License Fee</SelectItem>
                    <SelectItem value="One-time">Signing Bonus</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </td>
            <td className="py-2 px-3 text-sm text-muted-foreground text-center">{getFiscalYear(draftDate)}</td>
            <td className="py-2 px-3 text-center">
              <Checkbox
                checked={draftCapApplicable}
                onCheckedChange={(checked) => setDraftCapApplicable(checked === true)}
                className="mx-auto"
              />
            </td>
            <td className="py-2 px-3">
              <Select value={draftCapPeriod} onValueChange={setDraftCapPeriod}>
                <SelectTrigger className="h-7 text-sm w-32"><SelectValue placeholder="Select period" /></SelectTrigger>
                <SelectContent>
                  {CAP_PERIODS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </td>
            <td className="py-2 px-3 text-right">
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={cancel}><X className="h-3.5 w-3.5" /></Button>
                <Button size="sm" className="h-7 text-xs px-2" onClick={prepareSave}>Save</Button>
              </div>
            </td>
          </>
        ) : (
          <>
            <td className="py-2.5 px-1 w-8">
              <button
                {...attributes}
                {...listeners}
                className="w-6 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-muted rounded"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </button>
            </td>
            <td className="py-2.5 px-3 text-sm font-medium text-foreground">
              <div className="flex items-center gap-1.5">
                {formatDate(exchange.dateTrigger)}
                {exchange.edited && <EditedBadge />}
              </div>
            </td>
            <td className="py-2.5 px-3 text-sm text-muted-foreground">{getPeriodRange(exchange.dateTrigger)}</td>
            <td className="py-2.5 px-3 text-sm font-semibold text-foreground">{formatCurrency(exchange.amount)}</td>
            <td className="py-2.5 px-3 text-sm text-muted-foreground">
              {exchange.type || (exchange.cadence === "One-time" ? "Signing Bonus" : "License Fee")}
            </td>
            <td className="py-2.5 px-3 text-sm text-muted-foreground text-center">{getFiscalYear(exchange.dateTrigger)}</td>
            <td className="py-2.5 px-3 text-center">
              {exchange.capApplicable !== false ? (
                <Check className="h-4 w-4 text-emerald-600 mx-auto" />
              ) : (
                <X className="h-4 w-4 text-muted-foreground mx-auto" />
              )}
            </td>
            <td className="py-2.5 px-3 text-sm text-muted-foreground text-center">{getCapPeriod(exchange.dateTrigger)}</td>
            <td className="py-2.5 px-3 text-right">
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setEditing(true)}>
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setShowDeleteConfirm(true)}>
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>
            </td>
          </>
        )}
      </tr>

      {/* Edit Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Changes</DialogTitle>
            <DialogDescription>
              Are you sure you want to save these changes? This will update the payment record.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">{formatCurrency(draftAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Date:</span>
              <span className="font-medium">{formatDate(draftDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cap Applicable:</span>
              <span className="font-medium">{draftCapApplicable ? "Yes" : "No"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cap Period:</span>
              <span className="font-medium">{capPeriodDisplay}</span>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={cancelConfirm}>Cancel</Button>
            <Button onClick={confirmSave}>Confirm Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this payment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">{formatCurrency(exchange.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Date:</span>
              <span className="font-medium">{formatDate(exchange.dateTrigger)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium">{exchange.type || (exchange.cadence === "One-time" ? "Signing Bonus" : "License Fee")}</span>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}



// Chart config
const paymentChartConfig = {
  scheduled: { label: "Scheduled", color: "hsl(160, 60%, 40%)" },
  conditional: { label: "Conditional", color: "hsl(40, 90%, 55%)" },
}

function formatCurrencyShort(v: number) {
  if (v >= 1000) return `$${Math.round(v / 1000)}k`
  return `$${v}`
}

function formatChartMonth(dateKey: string) {
  const [y, m] = dateKey.split("-")
  return new Date(Number(y), Number(m) - 1).toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

// Payment area chart using Recharts
function PaymentChart({ exchanges }: { exchanges: ExtractedExchange[] }) {
  const chartData = useMemo(() => {
    const grouped = new Map<string, { scheduled: number; conditional: number }>()

    exchanges.forEach(e => {
      if (!e.dateTrigger) return
      const d = new Date(e.dateTrigger + "T00:00:00")
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      const existing = grouped.get(key) || { scheduled: 0, conditional: 0 }
      if (isConditional(e.cadence)) {
        existing.conditional += e.amount
      } else {
        existing.scheduled += e.amount
      }
      grouped.set(key, existing)
    })

    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, val]) => ({
        date: key,
        scheduled: val.scheduled,
        conditional: val.conditional,
      }))
  }, [exchanges])

  if (chartData.length < 2) return null

  return (
    <div className="mb-4 border rounded-lg p-4 bg-background">
      <ChartContainer config={paymentChartConfig} className="h-[200px] w-full">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradScheduled2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(160, 60%, 40%)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="hsl(160, 60%, 40%)" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="gradConditional2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(40, 90%, 55%)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="hsl(40, 90%, 55%)" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
          <XAxis
            dataKey="date"
            tickFormatter={formatChartMonth}
            className="text-xs"
            tickMargin={8}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            className="text-xs"
            tickFormatter={formatCurrencyShort}
            tickMargin={8}
            axisLine={false}
            tickLine={false}
          />
          <ChartTooltip
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null
              const d = payload[0].payload
              return (
                <div className="rounded-lg border bg-background p-3 shadow-lg">
                  <p className="font-semibold mb-1 text-sm">{formatChartMonth(d.date)}</p>
                  {d.scheduled > 0 && (
                    <div className="flex items-center gap-2 text-xs">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "hsl(160, 60%, 40%)" }} />
                      <span className="text-muted-foreground">Scheduled:</span>
                      <span className="font-medium ml-auto">{formatCurrency(d.scheduled)}</span>
                    </div>
                  )}
                  {d.conditional > 0 && (
                    <div className="flex items-center gap-2 text-xs mt-1">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "hsl(40, 90%, 55%)" }} />
                      <span className="text-muted-foreground">Conditional:</span>
                      <span className="font-medium ml-auto">{formatCurrency(d.conditional)}</span>
                    </div>
                  )}
                </div>
              )
            }}
          />
          <Area
            type="monotone"
            dataKey="scheduled"
            stroke="hsl(160, 60%, 40%)"
            strokeWidth={2}
            fill="url(#gradScheduled2)"
          />
          <Area
            type="monotone"
            dataKey="conditional"
            stroke="hsl(40, 90%, 55%)"
            strokeWidth={2}
            fill="url(#gradConditional2)"
          />
          <Legend
            verticalAlign="bottom"
            height={28}
            formatter={(value: string) => {
              if (value === "scheduled") return "Scheduled"
              if (value === "conditional") return "Conditional"
              return value
            }}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "11px", color: "hsl(var(--muted-foreground))" }}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

// Cap period summary component
function CapPeriodSummary({ exchanges }: { exchanges: ExtractedExchange[] }) {
  const capTotals = useMemo(() => {
    const totals = new Map<string, { amount: number; display: string }>()
    exchanges.forEach(e => {
      if (!e.dateTrigger) return
      const key = getCapPeriodKey(e.dateTrigger)
      const display = getCapPeriod(e.dateTrigger)
      const existing = totals.get(key) || { amount: 0, display }
      existing.amount += e.amount
      totals.set(key, existing)
    })
    return Array.from(totals.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, val]) => val)
  }, [exchanges])

  if (capTotals.length === 0) return null

  return (
    <div className="flex items-center gap-2 flex-wrap mb-3 px-1">
      <span className="text-xs font-medium text-muted-foreground">Cap-applicable by period:</span>
      {capTotals.map((item, idx) => (
        <Badge
          key={idx}
          variant="outline"
          className="text-xs font-medium px-2 py-0.5 border-muted-foreground/20 text-foreground bg-muted/40"
        >
          {item.display}: {formatCurrency(item.amount)}
        </Badge>
      ))}
    </div>
  )
}

export function ReviewStage() {
  const {
    state, setStage, updateParty, updateExchange, addExchange, deleteExchange,
    
    updateDeliverable, addDeliverable, deleteDeliverable,
    updateTerm, addTerm, deleteTerm,
  } = useContractWorkflow()

  const [partiesOpen, setPartiesOpen] = useState(true)
  const [exchangesOpen, setExchangesOpen] = useState(true)
  const [obligationsOpen, setObligationsOpen] = useState(true)
  const [deliverablesOpen, setDeliverablesOpen] = useState(true)
  const [financialOpen, setFinancialOpen] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  // Add Obligation modal state
  const [showAddObligationModal, setShowAddObligationModal] = useState(false)
  const [newOblDesc, setNewOblDesc] = useState("")
  const [newOblDirection, setNewOblDirection] = useState("Athlete → Sponsor")
  const [newOblQuantity, setNewOblQuantity] = useState("")
  const [newOblDeadline, setNewOblDeadline] = useState("")
  
  // Drag and drop state for reordering payments
  const [pendingReorder, setPendingReorder] = useState<{
    sourceId: string
    targetId: string
    sourceDate: string
    targetDate: string
    sourceAmount: number
    targetAmount: number
  } | null>(null)
  const [showReorderConfirm, setShowReorderConfirm] = useState(false)

  // Add payment modal state
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false)
  const [showAddConditionalModal, setShowAddConditionalModal] = useState(false)
  const [newPaymentDate, setNewPaymentDate] = useState("")
  const [newPaymentAmount, setNewPaymentAmount] = useState(0)
  const [newPaymentType, setNewPaymentType] = useState("License Fee")
  const [newPaymentCadence, setNewPaymentCadence] = useState("Monthly")
  const [newPaymentCapApplicable, setNewPaymentCapApplicable] = useState(true)
  const [newConditionalType, setNewConditionalType] = useState("")

  // Participants state
  const [participants, setParticipants] = useState<ContractParticipant[]>([
    { id: "p1", name: "Marcus Williams", role: "Athlete", email: "marcus.williams@osu.edu", phone: "(614) 555-0101" },
    { id: "p2", name: "Sarah Thompson", role: "Agent", email: "sthompson@agency.com", phone: "(310) 555-0202" },
    { id: "p3", name: "Michael Chen", role: "University Counsel", email: "mchen@osu.edu", phone: "(614) 555-0303" },
  ])
  const [participantsOpen, setParticipantsOpen] = useState(true)
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false)
  const [newParticipantName, setNewParticipantName] = useState("")
  const [newParticipantRole, setNewParticipantRole] = useState("")
  const [newParticipantEmail, setNewParticipantEmail] = useState("")
  const [newParticipantPhone, setNewParticipantPhone] = useState("")

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const scheduledExchanges = useMemo(() =>
    state.exchanges
      .filter(e => !isConditional(e.cadence))
      .sort((a, b) => new Date(a.dateTrigger).getTime() - new Date(b.dateTrigger).getTime()),
    [state.exchanges]
  )

  const conditionalExchanges = useMemo(() =>
    state.exchanges.filter(e => isConditional(e.cadence)),
    [state.exchanges]
  )



  const scheduledTotal = useMemo(() =>
    scheduledExchanges.reduce((sum, e) => sum + e.amount, 0),
    [scheduledExchanges]
  )

  const conditionalTotal = useMemo(() =>
    conditionalExchanges.reduce((sum, e) => sum + e.amount, 0),
    [conditionalExchanges]
  )

  const hasUnreviewedLowConfidence = useMemo(() => {
    const unreviewedParties = state.parties.some(p => p.confidence === "low" && !p.reviewed)
    const unreviewedExchanges = state.exchanges.some(e => (e.confidence === "low") && !e.reviewed)
    return unreviewedParties || unreviewedExchanges
  }, [state.parties, state.exchanges])

  const openAddPaymentModal = () => {
    setNewPaymentDate("")
    setNewPaymentAmount(0)
    setNewPaymentType("License Fee")
    setNewPaymentCadence("Monthly")
    setNewPaymentCapApplicable(true)
    setShowAddPaymentModal(true)
  }

  const confirmAddPayment = () => {
    if (!newPaymentDate || newPaymentAmount <= 0) return
    const newId = `e${Date.now()}`
    addExchange({
      id: newId,
      amount: newPaymentAmount,
      dateTrigger: newPaymentDate,
      cadence: newPaymentCadence,
      type: newPaymentType,
      capApplicable: newPaymentCapApplicable,
      confidence: "high",
      reviewed: true,
      edited: true,
    })
    setShowAddPaymentModal(false)
  }

  const openAddConditionalModal = () => {
    setNewPaymentDate("")
    setNewPaymentAmount(0)
    setNewConditionalType("")
    setNewPaymentCapApplicable(true)
    setShowAddConditionalModal(true)
  }

  const confirmAddConditional = () => {
    if (!newPaymentDate || newPaymentAmount <= 0) return
    const newId = `ec${Date.now()}`
    addExchange({
      id: newId,
      amount: newPaymentAmount,
      dateTrigger: newPaymentDate,
      cadence: "Conditional",
      type: newConditionalType || "Performance Bonus",
      capApplicable: newPaymentCapApplicable,
      confidence: "high",
      reviewed: true,
      edited: true,
    })
    setShowAddConditionalModal(false)
  }

  // Participant CRUD handlers
  const openAddParticipantModal = () => {
    setNewParticipantName("")
    setNewParticipantRole("")
    setNewParticipantEmail("")
    setNewParticipantPhone("")
    setShowAddParticipantModal(true)
  }

  const confirmAddParticipant = () => {
    if (!newParticipantName || !newParticipantRole) return
    const newId = `p${Date.now()}`
    setParticipants(prev => [...prev, {
      id: newId,
      name: newParticipantName,
      role: newParticipantRole,
      email: newParticipantEmail,
      phone: newParticipantPhone,
    }])
    setShowAddParticipantModal(false)
  }

  const updateParticipant = (id: string, updates: Partial<ContractParticipant>) => {
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  const deleteParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id))
  }

  // Handle drag end for reordering scheduled payments
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const sourceExchange = scheduledExchanges.find(e => e.id === active.id)
      const targetExchange = scheduledExchanges.find(e => e.id === over.id)

      if (sourceExchange && targetExchange) {
        // Set up pending reorder for confirmation
        setPendingReorder({
          sourceId: sourceExchange.id,
          targetId: targetExchange.id,
          sourceDate: sourceExchange.dateTrigger,
          targetDate: targetExchange.dateTrigger,
          sourceAmount: sourceExchange.amount,
          targetAmount: targetExchange.amount,
        })
        setShowReorderConfirm(true)
      }
    }
  }

  // Confirm the payment date swap
  const confirmReorder = () => {
    if (pendingReorder) {
      // Swap the dates between the two exchanges
      updateExchange(pendingReorder.sourceId, {
        dateTrigger: pendingReorder.targetDate,
        edited: true,
        reviewed: true,
      })
      updateExchange(pendingReorder.targetId, {
        dateTrigger: pendingReorder.sourceDate,
        edited: true,
        reviewed: true,
      })
    }
    setPendingReorder(null)
    setShowReorderConfirm(false)
  }

  // Cancel the reorder
  const cancelReorder = () => {
    setPendingReorder(null)
    setShowReorderConfirm(false)
  }

  const openAddObligationModal = () => {
    setNewOblDesc("")
    setNewOblDirection("Athlete → Sponsor")
    setNewOblQuantity("")
    setNewOblDeadline("")
    setShowAddObligationModal(true)
  }
  
  const confirmAddObligation = () => {
    if (!newOblDesc || !newOblQuantity) return
    const newId = `d${Date.now()}`
    addDeliverable({
      id: newId,
      description: newOblDesc,
      direction: newOblDirection,
      quantity: newOblQuantity,
      deadline: newOblDeadline,
      confidence: "high",
      edited: true,
    })
    setShowAddObligationModal(false)
  }
  
  const handleAddDeliverable = () => {
    openAddObligationModal()
  }

  const handleAddTerm = () => {
    const newId = `t${Date.now()}`
    addTerm({
      id: newId,
      description: "",
      direction: "Mutual",
      duration: "Term",
      confidence: "medium",
      edited: true,
    })
  }

const handleConfirmAndSave = () => {
    setShowSuccess(true)
  }

  // Saving progress state for animation
  const [savingComplete, setSavingComplete] = useState(false)
  
  useEffect(() => {
    if (showSuccess && !savingComplete) {
      // Simulate saving animation - completes after 800ms
      const timer = setTimeout(() => {
        setSavingComplete(true)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [showSuccess, savingComplete])
  
  useEffect(() => {
    if (savingComplete) {
      // Wait a moment after completion before redirecting
      const timer = setTimeout(() => {
        setShowSuccess(false)
        setSavingComplete(false)
        setStage("activation")
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [savingComplete, setStage])

  if (showSuccess) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-4rem)]">
        {/* Stage progress at top */}
        <div className="border-b px-6 py-4">
          <StageProgress currentStage="review" />
        </div>
        
        {/* Saving content - centered */}
        <div className="flex-1 flex justify-center pt-16 pb-8">
          <div className="w-full max-w-lg space-y-6">
            {/* Contract info */}
            {state.uploadData && (
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground whitespace-nowrap">{state.uploadData.fileName}</span>
                </div>
                <p className="text-sm text-muted-foreground">{state.uploadData.athleteName}</p>
              </div>
            )}

            {/* Animated indicator - only show when not complete */}
            {!savingComplete && (
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border-2 border-muted-foreground/20" />
                  <div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
                  </div>
                </div>
              </div>
            )}
            
            {/* Completion indicator */}
            {savingComplete && (
              <div className="flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                  <Check className="w-7 h-7 text-emerald-600" />
                </div>
              </div>
            )}

            {/* Status message */}
            <p className="text-center text-sm font-medium text-foreground">
              {savingComplete ? "Review saved" : "Saving review..."}
            </p>

            {/* Saving card */}
            <div className="space-y-2">
              <div 
                className={`relative overflow-hidden rounded-lg border px-4 py-3 transition-all duration-300 ${
                  savingComplete 
                    ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20" 
                    : "border-foreground/20 bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${
                    savingComplete 
                      ? "text-emerald-700 dark:text-emerald-300" 
                      : "text-foreground font-medium"
                  }`}>
                    Saving Contract Review
                  </span>
                  <span className={savingComplete 
                    ? "text-emerald-600 dark:text-emerald-400 font-medium text-sm" 
                    : "text-muted-foreground text-sm"
                  }>
                    {savingComplete ? "Done" : "Saving..."}
                  </span>
                </div>
                {/* Progress bar at bottom - only when processing */}
                {!savingComplete && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted">
                    <div 
                      className="h-full bg-foreground animate-pulse"
                      style={{ width: "100%" }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Stage progress */}
      <div className="border-b px-6 py-4">
        <StageProgress currentStage="review" />
      </div>

      {/* Full-width layout */}
      <div className="flex-1 flex min-h-0">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto px-6 py-5 space-y-6">
            {/* Header */}
            <div>
              <button
                onClick={() => setStage("processing")}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </button>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Review Extracted Data</h1>
                  {state.uploadData && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {state.uploadData.athleteName} &middot; {state.uploadData.contractType}
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs h-8 shrink-0"
                  onClick={() => {
                    // Simulate downloading the original uploaded file
                    const link = document.createElement("a")
                    link.href = "#"
                    link.download = state.uploadData?.fileName || "contract.pdf"
                    link.click()
                  }}
                >
                  <Download className="h-3.5 w-3.5" />
                  Download Original
                </Button>
              </div>

              {/* Summary sentence */}
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                This contract covers a {state.uploadData?.contractType || "NIL License Agreement"} between{" "}
                {state.parties.find(p => p.role === "Beneficiary")?.name || "the athlete"} and{" "}
                {state.parties.find(p => p.role === "Source")?.name || "the institution"},{" "}
                consisting of {scheduledExchanges.length} scheduled and {conditionalExchanges.length} conditional payments across {state.deliverables.length} deliverables, {state.obligations.length} financial obligations, and {state.terms.length} terms.
              </p>

              {/* Key stats row */}
              <div className="flex items-center gap-6 mt-3 pt-3 border-t">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Contract Value</p>
                  <p className="text-sm font-semibold text-foreground">{formatCurrency(state.statedTotal)}</p>
                </div>
                {state.exchanges.length > 0 && (() => {
                  const sortedDates = state.exchanges
                    .map(e => e.dateTrigger)
                    .filter(Boolean)
                    .sort()
                  const earliest = sortedDates[0]
                  const latest = sortedDates[sortedDates.length - 1]
                  return (
                    <>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Start Date</p>
                        <p className="text-sm font-semibold text-foreground">{earliest ? formatDate(earliest) : "\u2014"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">End Date</p>
                        <p className="text-sm font-semibold text-foreground">{latest ? formatDate(latest) : "\u2014"}</p>
                      </div>
                    </>
                  )
                })()}
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Payments</p>
                  <p className="text-sm font-semibold text-foreground">{state.exchanges.length}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Obligations</p>
                  <p className="text-sm font-semibold text-foreground">{state.obligations.length}</p>
                </div>
              </div>
            </div>

            {/* PARTIES Section */}
            <section>
              <button onClick={() => setPartiesOpen(!partiesOpen)} className="flex items-center gap-2 w-full text-left py-1 mb-2">
                {partiesOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                <h2 className="text-sm font-semibold text-foreground">Parties</h2>
                <span className="text-xs text-muted-foreground">({state.parties.length})</span>
              </button>
              {partiesOpen && (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">First Name</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Last Name</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Role</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Entity Type</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-24">Confidence</th>
                        <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-28">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.parties.map(party => (
                        <PartyRow key={party.id} party={party} onUpdate={updateParty} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* PARTICIPANTS Section */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <button onClick={() => setParticipantsOpen(!participantsOpen)} className="flex items-center gap-2 text-left py-1">
                  {participantsOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  <h2 className="text-sm font-semibold text-foreground">Participants</h2>
                  <span className="text-xs text-muted-foreground">({participants.length})</span>
                </button>
                {participantsOpen && (
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7" onClick={openAddParticipantModal}>
                    <Plus className="h-3 w-3" />
                    Add Participant
                  </Button>
                )}
              </div>
              {participantsOpen && (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Role</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone</th>
                        <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-28">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-sm text-muted-foreground">No participants added yet.</td>
                        </tr>
                      ) : (
                        participants.map((participant) => (
                          <ParticipantRow
                            key={participant.id}
                            participant={participant}
                            onUpdate={updateParticipant}
                            onDelete={deleteParticipant}
                          />
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* CAP IMPACT CHART - only for Revenue Share contracts */}
            {state.uploadData?.contractType === "Revenue Share" && state.exchanges.length > 0 && (
              <section>
                <CapImpactChart
                  currentContractPayments={state.exchanges.map(e => ({
                    date: e.dateTrigger,
                    amount: e.amount,
                    capApplicable: true, // Assume all payments are cap-applicable for uploaded contracts
                  }))}
                  athleteName={state.uploadData?.athleteName}
                  defaultExpanded={true}
                />
              </section>
            )}

            {/* PAYMENT CHART */}
            <section>
              <PaymentChart exchanges={state.exchanges} />
            </section>

            {/* SCHEDULED PAYMENTS Section */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <button onClick={() => setExchangesOpen(!exchangesOpen)} className="flex items-center gap-2 text-left py-1">
                  {exchangesOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  <h2 className="text-sm font-semibold text-foreground">Scheduled Payments</h2>
                  <span className="text-xs text-muted-foreground">({scheduledExchanges.length})</span>
                </button>
                {exchangesOpen && (
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7" onClick={openAddPaymentModal}>
                    <Plus className="h-3 w-3" />
                    Add Scheduled Payment
                  </Button>
                )}
              </div>
              {exchangesOpen && (
                <>
                  <CapPeriodSummary exchanges={scheduledExchanges} />
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="border rounded-lg overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/30">
                            <th className="w-8 py-2 px-1" />
                            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Payment Date</th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Period</th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Amount</th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Type</th>
                            <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-16">Fiscal Yr</th>
                            <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-14">Cap</th>
                            <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-28">Cap Period</th>
                            <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-24">Actions</th>
                          </tr>
                        </thead>
                        <SortableContext
                          items={scheduledExchanges.map(e => e.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <tbody>
                            {scheduledExchanges.map((exchange) => (
                              <SortableExchangeRow
                                key={exchange.id}
                                exchange={exchange}
                                onUpdate={updateExchange}
                                onDelete={deleteExchange}
                              />
                            ))}
                          </tbody>
                        </SortableContext>
                        <tfoot>
                          <tr className="bg-muted/30">
                            <td className="py-2.5 px-1" />
                            <td className="py-2.5 px-3 text-sm font-semibold text-foreground" colSpan={2}>Total</td>
                            <td className="py-2.5 px-3 text-sm font-semibold text-foreground">{formatCurrency(scheduledTotal)}</td>
                            <td className="py-2.5 px-3 text-xs text-muted-foreground" colSpan={5}>
                              {formatCurrency(scheduledTotal)} cap-applicable
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </DndContext>
                </>
              )}
            </section>

            {/* CONDITIONAL PAYMENTS Section */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <button onClick={() => setExchangesOpen(!exchangesOpen)} className="flex items-center gap-2 text-left py-1">
                  {exchangesOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  <h2 className="text-sm font-semibold text-foreground">Conditional Payments</h2>
                  <span className="text-xs text-muted-foreground">({conditionalExchanges.length})</span>
                </button>
                {exchangesOpen && (
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7" onClick={openAddConditionalModal}>
                    <Plus className="h-3 w-3" />
                    Add Conditional Payment
                  </Button>
                )}
              </div>
              {exchangesOpen && (
                <div className="border rounded-lg overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Payment Date</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Period</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Amount</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Type</th>
                        <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-16">Fiscal Yr</th>
                        <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-14">Cap</th>
                        <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-28">Cap Period</th>
                        <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-24">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conditionalExchanges.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-6 text-center text-sm text-muted-foreground">No conditional payments extracted.</td>
                        </tr>
                      ) : (
                        conditionalExchanges.map((exchange) => (
                          <ExchangeRow
                            key={exchange.id}
                            exchange={exchange}
                            onUpdate={updateExchange}
                            onDelete={deleteExchange}
                          />
                        ))
                      )}
                    </tbody>
                    {conditionalExchanges.length > 0 && (
                      <tfoot>
                        <tr className="bg-muted/30">
                          <td className="py-2.5 px-3 text-sm font-semibold text-foreground" colSpan={2}>Total</td>
                          <td className="py-2.5 px-3 text-sm font-semibold text-foreground">{formatCurrency(conditionalTotal)}</td>
                          <td className="py-2.5 px-3 text-xs text-muted-foreground" colSpan={5}>
                            {formatCurrency(conditionalTotal)} cap-applicable
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              )}
            </section>

            {/* OBLIGATIONS Section — Grouped */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <button onClick={() => setObligationsOpen(!obligationsOpen)} className="flex items-center gap-2 text-left py-1">
                  {obligationsOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  <h2 className="text-sm font-semibold text-foreground">Obligations</h2>
                  <span className="text-xs text-muted-foreground">
                    ({state.deliverables.length + state.obligations.length + state.terms.length})
                  </span>
                </button>
              </div>
              {obligationsOpen && (
                <div className="space-y-4">
                  {/* Deliverables Group — expanded by default */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between w-full px-4 py-2.5 bg-muted/30 border-b">
                      <button
                        onClick={() => setDeliverablesOpen(!deliverablesOpen)}
                        className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                      >
                        {deliverablesOpen ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                        <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Deliverables</span>
                        <span className="text-xs text-muted-foreground">({state.deliverables.length})</span>
                      </button>
{deliverablesOpen && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-xs h-6 px-2"
                          onClick={() => openAddObligationModal()}
                        >
                          <Plus className="h-3 w-3" />
                          Add Deliverable
                        </Button>
                      )}
                    </div>
                    {deliverablesOpen && (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/10">
                            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-[35%]">Description</th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-[18%]">Source &rarr; Beneficiary</th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-[17%]">Quantity</th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-[18%]">Deadline</th>
                            <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-[12%]">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {state.deliverables.map((d) => (
                            <DeliverableRow
                              key={d.id}
                              deliverable={d}
                              onUpdate={updateDeliverable}
                              onDelete={deleteDeliverable}
                            />
                          ))}
                          {state.deliverables.length === 0 && (
                            <tr><td colSpan={5} className="py-6 text-center text-sm text-muted-foreground">No deliverables extracted.</td></tr>
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* Financial Group — collapsed by default, summary only */}
                  <div className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setFinancialOpen(!financialOpen)}
                      className="flex items-center justify-between w-full px-4 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {financialOpen ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                        <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Financial</span>
                      </div>
                    </button>
                    {financialOpen && (
                      <div className="border-t px-4 py-3">
                        <p className="text-sm text-muted-foreground">
                          {scheduledExchanges.length > 0 ? (
                            <>
                              {scheduledExchanges.length} installment payment{scheduledExchanges.length !== 1 ? "s" : ""} totaling{" "}
                              <span className="font-medium text-foreground">{formatCurrency(scheduledTotal)}</span>
                              {conditionalExchanges.length > 0 && (
                                <> plus {conditionalExchanges.length} conditional payment{conditionalExchanges.length !== 1 ? "s" : ""} totaling{" "}
                                <span className="font-medium text-foreground">{formatCurrency(conditionalTotal)}</span></>
                              )}
                              {" "}&mdash; see Scheduled Payments above.
                            </>
                          ) : (
                            "No financial obligations extracted."
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Terms & Conditions Group — collapsed by default */}
                  <div className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setTermsOpen(!termsOpen)}
                      className="flex items-center justify-between w-full px-4 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {termsOpen ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                        <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Terms & Conditions</span>
                        <span className="text-xs text-muted-foreground">({state.terms.length})</span>
                      </div>
                      {termsOpen && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-xs h-6 px-2"
                          onClick={(e) => { e.stopPropagation(); handleAddTerm() }}
                        >
                          <Plus className="h-3 w-3" />
                          Add
                        </Button>
                      )}
                    </button>
{termsOpen && (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-t border-b bg-muted/10">
                            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-40">Direction</th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-28">Duration</th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-24">Confidence</th>
                            <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-24">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {state.terms.map((t) => (
                            <TermRow
                              key={t.id}
                              term={t}
                              onUpdate={updateTerm}
                              onDelete={deleteTerm}
                            />
                          ))}
                          {state.terms.length === 0 && (
                            <tr><td colSpan={5} className="py-6 text-center text-sm text-muted-foreground">No terms extracted.</td></tr>
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 pb-6 border-t">
              <Button variant="outline" className="gap-1.5">
                Save Draft
              </Button>
              <Button
                onClick={handleConfirmAndSave}
                disabled={hasUnreviewedLowConfidence}
                className="bg-foreground text-background hover:bg-foreground/90 gap-1.5"
              >
                <Check className="w-4 h-4" />
                Confirm & Save
              </Button>
              {hasUnreviewedLowConfidence && (
                <p className="text-xs text-amber-600">Review all low-confidence fields before confirming.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reorder Confirmation Modal */}
      <Dialog open={showReorderConfirm} onOpenChange={setShowReorderConfirm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Confirm Payment Reorder</DialogTitle>
            <DialogDescription>
              You are about to swap the payment dates between two payments. This will update the fiscal year and cap period for both payments.
            </DialogDescription>
          </DialogHeader>
          {pendingReorder && (
            <div className="py-4 space-y-4">
              <div className="rounded-lg border p-3 space-y-2">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Payment 1</div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{formatCurrency(pendingReorder.sourceAmount)}</span>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground line-through">{formatDate(pendingReorder.sourceDate)}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium text-foreground">{formatDate(pendingReorder.targetDate)}</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Cap Period: {getCapPeriod(pendingReorder.sourceDate)} → {getCapPeriod(pendingReorder.targetDate)}
                </div>
              </div>
              <div className="rounded-lg border p-3 space-y-2">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Payment 2</div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{formatCurrency(pendingReorder.targetAmount)}</span>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground line-through">{formatDate(pendingReorder.targetDate)}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium text-foreground">{formatDate(pendingReorder.sourceDate)}</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Cap Period: {getCapPeriod(pendingReorder.targetDate)} → {getCapPeriod(pendingReorder.sourceDate)}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={cancelReorder}>Cancel</Button>
            <Button onClick={confirmReorder}>Confirm Swap</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Scheduled Payment Modal */}
      <Dialog open={showAddPaymentModal} onOpenChange={setShowAddPaymentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Scheduled Payment</DialogTitle>
            <DialogDescription>
              Enter the details for the new scheduled payment.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Date</label>
              <Input
                type="date"
                value={newPaymentDate}
                onChange={(e) => setNewPaymentDate(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                value={newPaymentAmount || ""}
                onChange={(e) => setNewPaymentAmount(Number(e.target.value))}
                placeholder="0.00"
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={newPaymentCadence} onValueChange={(v) => {
                setNewPaymentCadence(v)
                setNewPaymentType(v === "One-time" ? "Signing Bonus" : "License Fee")
              }}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">License Fee</SelectItem>
                  <SelectItem value="One-time">Signing Bonus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="cap-applicable"
                checked={newPaymentCapApplicable}
                onCheckedChange={(checked) => setNewPaymentCapApplicable(checked === true)}
              />
              <label htmlFor="cap-applicable" className="text-sm">Cap Applicable</label>
            </div>
            {newPaymentDate && (
              <div className="rounded-lg bg-muted/50 p-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fiscal Year:</span>
                  <span className="font-medium">{getFiscalYear(newPaymentDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cap Period:</span>
                  <span className="font-medium">{getCapPeriod(newPaymentDate)}</span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowAddPaymentModal(false)}>Cancel</Button>
            <Button onClick={confirmAddPayment} disabled={!newPaymentDate || newPaymentAmount <= 0}>
              Add Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Conditional Payment Modal */}
      <Dialog open={showAddConditionalModal} onOpenChange={setShowAddConditionalModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Conditional Payment</DialogTitle>
            <DialogDescription>
              Enter the details for the new conditional payment.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Date</label>
              <Input
                type="date"
                value={newPaymentDate}
                onChange={(e) => setNewPaymentDate(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                value={newPaymentAmount || ""}
                onChange={(e) => setNewPaymentAmount(Number(e.target.value))}
                placeholder="0.00"
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type / Description</label>
              <Input
                type="text"
                value={newConditionalType}
                onChange={(e) => setNewConditionalType(e.target.value)}
                placeholder="e.g. Bowl Game Bonus, Conference Championship"
                className="h-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="conditional-cap-applicable"
                checked={newPaymentCapApplicable}
                onCheckedChange={(checked) => setNewPaymentCapApplicable(checked === true)}
              />
              <label htmlFor="conditional-cap-applicable" className="text-sm">Cap Applicable</label>
            </div>
            {newPaymentDate && (
              <div className="rounded-lg bg-muted/50 p-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fiscal Year:</span>
                  <span className="font-medium">{getFiscalYear(newPaymentDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cap Period:</span>
                  <span className="font-medium">{getCapPeriod(newPaymentDate)}</span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowAddConditionalModal(false)}>Cancel</Button>
            <Button onClick={confirmAddConditional} disabled={!newPaymentDate || newPaymentAmount <= 0}>
              Add Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Participant Modal */}
      <Dialog open={showAddParticipantModal} onOpenChange={setShowAddParticipantModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Participant</DialogTitle>
            <DialogDescription>
              Enter the details for the new participant.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                type="text"
                value={newParticipantName}
                onChange={(e) => setNewParticipantName(e.target.value)}
                placeholder="Full name"
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={newParticipantRole} onValueChange={setNewParticipantRole}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Athlete">Athlete</SelectItem>
                  <SelectItem value="Agent">Agent</SelectItem>
                  <SelectItem value="Athlete Counsel">Athlete Counsel</SelectItem>
                  <SelectItem value="University Representative">University Representative</SelectItem>
                  <SelectItem value="University Counsel">University Counsel</SelectItem>
                  <SelectItem value="Sponsor">Sponsor</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={newParticipantEmail}
                onChange={(e) => setNewParticipantEmail(e.target.value)}
                placeholder="email@example.com"
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                type="tel"
                value={newParticipantPhone}
                onChange={(e) => setNewParticipantPhone(e.target.value)}
                placeholder="(555) 555-5555"
                className="h-9"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowAddParticipantModal(false)}>Cancel</Button>
            <Button onClick={confirmAddParticipant} disabled={!newParticipantName || !newParticipantRole}>
              Add Participant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Deliverable Modal */}
      <Dialog open={showAddObligationModal} onOpenChange={setShowAddObligationModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Deliverable</DialogTitle>
            <DialogDescription>
              Enter the details for the new deliverable.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                type="text"
                value={newOblDesc}
                onChange={(e) => setNewOblDesc(e.target.value)}
                placeholder="e.g. Social media posts"
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Direction</label>
              <Select value={newOblDirection} onValueChange={setNewOblDirection}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Athlete → Sponsor">Athlete → Sponsor</SelectItem>
                  <SelectItem value="Sponsor → Athlete">Sponsor → Athlete</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input
                type="text"
                value={newOblQuantity}
                onChange={(e) => setNewOblQuantity(e.target.value)}
                placeholder="e.g. 8 posts, 4 hours, 2 appearances"
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Deadline</label>
              <Input
                type="date"
                value={newOblDeadline}
                onChange={(e) => setNewOblDeadline(e.target.value)}
                className="h-9"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowAddObligationModal(false)}>Cancel</Button>
            <Button onClick={confirmAddObligation} disabled={!newOblDesc || !newOblQuantity}>Add Deliverable</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
