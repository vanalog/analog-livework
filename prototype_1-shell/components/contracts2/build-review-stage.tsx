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
  GripVertical,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useBuildContract, type GeneratedPayment, type GeneratedObligation } from "@/lib/build-contract-context"
import { BuildStageProgress } from "./build-stage-progress"
import { CapPeriodSidebar } from "./cap-period-sidebar"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

// Format number with commas for display in inputs
function formatNumberWithCommas(num: number | string): string {
  const n = typeof num === "string" ? parseInt(num.replace(/,/g, ""), 10) : num
  if (isNaN(n) || n === 0) return ""
  return n.toLocaleString("en-US")
}

// Parse a comma-formatted string to a number
function parseFormattedNumber(str: string): number {
  const cleaned = str.replace(/[^0-9]/g, "")
  return cleaned ? parseInt(cleaned, 10) : 0
}

function formatDate(iso: string) {
  if (!iso) return "\u2014"
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

// Helper functions for table columns
function getPeriodRange(dateStr: string): string {
  if (!dateStr) return "\u2014"
  const d = new Date(dateStr + "T00:00:00")
  const y = d.getFullYear()
  const m = d.getMonth()
  const start = new Date(y, m, 1)
  const end = new Date(y, m + 1, 0)
  // Format as MM/DD/YYYY-MM/DD/YYYY
  const fmt = (dt: Date) => {
    const mm = String(dt.getMonth() + 1).padStart(2, '0')
    const dd = String(dt.getDate()).padStart(2, '0')
    const yyyy = dt.getFullYear()
    return `${mm}/${dd}/${yyyy}`
  }
  return `${fmt(start)}-${fmt(end)}`
}

function getFiscalYear(dateStr: string): string {
  if (!dateStr) return "\u2014"
  const d = new Date(dateStr + "T00:00:00")
  const m = d.getMonth()
  const y = d.getFullYear()
  return m >= 6 ? `FY${(y + 1).toString().slice(-2)}` : `FY${y.toString().slice(-2)}`
}

function getCapPeriod(dateStr: string): string {
  if (!dateStr) return "\u2014"
  const d = new Date(dateStr + "T00:00:00")
  const m = d.getMonth()
  const y = d.getFullYear()
  if (m >= 6) {
    const startYear = y.toString().slice(-2)
    const endYear = (y + 1).toString().slice(-2)
    return `7/1/${startYear}-6/30/${endYear}`
  } else {
    const startYear = (y - 1).toString().slice(-2)
    const endYear = y.toString().slice(-2)
    return `7/1/${startYear}-6/30/${endYear}`
  }
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

// Sortable payment row with drag handle
function SortablePaymentRow({
  payment,
  onUpdate,
  onDelete,
}: {
  payment: GeneratedPayment
  onUpdate: (id: string, updates: Partial<GeneratedPayment>) => void
  onDelete: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: payment.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const [editing, setEditing] = useState(false)
  const [draftAmount, setDraftAmount] = useState(payment.amount)
  const [draftDate, setDraftDate] = useState(payment.date)
  const [draftType, setDraftType] = useState(payment.type)
  const [draftCapApplicable, setDraftCapApplicable] = useState(payment.capApplicable)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const prepareSave = () => {
    setShowConfirmDialog(true)
  }

  const confirmSave = () => {
    onUpdate(payment.id, {
      amount: draftAmount,
      date: draftDate,
      type: draftType,
      capApplicable: draftCapApplicable,
      fiscalYear: getFiscalYear(draftDate),
      capPeriod: getCapPeriod(draftDate),
      edited: true,
    })
    setShowConfirmDialog(false)
    setEditing(false)
  }

  const cancel = () => {
    setDraftAmount(payment.amount)
    setDraftDate(payment.date)
    setDraftType(payment.type)
    setDraftCapApplicable(payment.capApplicable)
    setEditing(false)
  }

  const confirmDelete = () => {
    onDelete(payment.id)
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <tr ref={setNodeRef} style={style} className="border-b last:border-b-0 hover:bg-muted/20 transition-colors">
        {editing ? (
          <>
            <td className="py-2 px-2 w-8">
              <GripVertical className="h-4 w-4 text-muted-foreground/50" />
            </td>
            <td className="py-2 px-3">
              <Input type="date" value={draftDate} onChange={e => setDraftDate(e.target.value)} className="h-7 text-sm w-[130px]" />
            </td>
            <td className="py-2 px-3 text-sm text-muted-foreground whitespace-nowrap">{getPeriodRange(draftDate)}</td>
            <td className="py-2 px-3">
              <Input
                    type="text"
                    inputMode="numeric"
                    value={formatNumberWithCommas(draftAmount)}
                    onChange={e => {
                      setDraftAmount(parseFormattedNumber(e.target.value))
                    }}
                    onFocus={e => {
                      if (draftAmount === 0) e.target.value = ""
                    }}
                    className="h-7 text-sm w-[100px]"
                  />
            </td>
            <td className="py-2 px-3 text-sm text-muted-foreground text-center whitespace-nowrap">{getCapPeriod(draftDate)}</td>
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
            <td className="py-2 px-2 w-8" {...attributes} {...listeners}>
              <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab active:cursor-grabbing" />
            </td>
            <td className="py-2.5 px-3 text-sm font-medium text-foreground whitespace-nowrap">
              <div className="flex items-center gap-1.5">
                {formatDate(payment.date)}
                {payment.edited && <EditedBadge />}
              </div>
            </td>
            <td className="py-2.5 px-3 text-sm text-muted-foreground whitespace-nowrap">{getPeriodRange(payment.date)}</td>
            <td className="py-2.5 px-3 text-sm font-semibold text-foreground whitespace-nowrap">{formatCurrency(payment.amount)}</td>
            <td className="py-2.5 px-3 text-sm text-muted-foreground text-center whitespace-nowrap">{payment.capPeriod}</td>
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
              Are you sure you want to save these changes to this payment?
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
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium">{draftType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cap Applicable:</span>
              <span className="font-medium">{draftCapApplicable ? "Yes" : "No"}</span>
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
            <DialogTitle>Delete Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this payment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">{formatCurrency(payment.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Date:</span>
              <span className="font-medium">{formatDate(payment.date)}</span>
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

// Non-sortable row for conditional payments
function ConditionalPaymentRow({
  payment,
  onUpdate,
  onDelete,
}: {
  payment: GeneratedPayment
  onUpdate: (id: string, updates: Partial<GeneratedPayment>) => void
  onDelete: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draftAmount, setDraftAmount] = useState(payment.amount)
  const [draftDate, setDraftDate] = useState(payment.date)
  const [draftType, setDraftType] = useState(payment.type)
  const [draftCapApplicable, setDraftCapApplicable] = useState(payment.capApplicable)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const save = () => {
    onUpdate(payment.id, {
      amount: draftAmount,
      date: draftDate,
      type: draftType,
      capApplicable: draftCapApplicable,
      fiscalYear: getFiscalYear(draftDate),
      capPeriod: getCapPeriod(draftDate),
      edited: true,
    })
    setEditing(false)
  }

  const cancel = () => {
    setDraftAmount(payment.amount)
    setDraftDate(payment.date)
    setDraftType(payment.type)
    setDraftCapApplicable(payment.capApplicable)
    setEditing(false)
  }

  return (
    <>
      <tr className="border-b last:border-b-0 hover:bg-muted/20 transition-colors">
        {editing ? (
          <>
            <td className="py-2 px-3">
              <Input type="date" value={draftDate} onChange={e => setDraftDate(e.target.value)} className="h-7 text-sm w-[130px]" />
            </td>
            <td className="py-2 px-3 text-sm text-muted-foreground whitespace-nowrap">{getPeriodRange(draftDate)}</td>
            <td className="py-2 px-3">
              <Input
                    type="text"
                    inputMode="numeric"
                    value={formatNumberWithCommas(draftAmount)}
                    onChange={e => {
                      setDraftAmount(parseFormattedNumber(e.target.value))
                    }}
                    onFocus={e => {
                      if (draftAmount === 0) e.target.value = ""
                    }}
                    className="h-7 text-sm w-[100px]"
                  />
            </td>
            <td className="py-2 px-3 text-sm text-muted-foreground text-center whitespace-nowrap">{getCapPeriod(draftDate)}</td>
            <td className="py-2 px-3 text-right">
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={cancel}>
                  <X className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" className="h-7 text-xs px-2" onClick={save}>Save</Button>
              </div>
            </td>
          </>
        ) : (
          <>
            <td className="py-2.5 px-3 text-sm font-medium text-foreground whitespace-nowrap">
              <div className="flex items-center gap-1.5">
                {formatDate(payment.date)}
                {payment.edited && <EditedBadge />}
              </div>
            </td>
            <td className="py-2.5 px-3 text-sm text-muted-foreground whitespace-nowrap">{getPeriodRange(payment.date)}</td>
            <td className="py-2.5 px-3 text-sm font-semibold text-foreground whitespace-nowrap">{formatCurrency(payment.amount)}</td>
            <td className="py-2.5 px-3 text-sm text-muted-foreground text-center whitespace-nowrap">{payment.capPeriod}</td>
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

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Conditional Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this conditional payment?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">{formatCurrency(payment.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium">{payment.type}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { onDelete(payment.id); setShowDeleteConfirm(false) }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Deliverable row component
function DeliverableRow({
  deliverable,
  onUpdate,
  onDelete,
}: {
  deliverable: GeneratedObligation
  onUpdate: (id: string, updates: Partial<GeneratedObligation>) => void
  onDelete: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draftDesc, setDraftDesc] = useState(deliverable.description)
  const [draftDirection, setDraftDirection] = useState(deliverable.direction)
  const [draftQuantity, setDraftQuantity] = useState(deliverable.quantity)
  const [draftDueDate, setDraftDueDate] = useState(deliverable.dueDate)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const prepareSave = () => {
    setShowConfirmDialog(true)
  }

  const confirmSave = () => {
    onUpdate(deliverable.id, {
      description: draftDesc,
      direction: draftDirection,
      quantity: draftQuantity,
      dueDate: draftDueDate,
      edited: true,
    })
    setShowConfirmDialog(false)
    setEditing(false)
  }

  const cancel = () => {
    setDraftDesc(deliverable.description)
    setDraftDirection(deliverable.direction)
    setDraftQuantity(deliverable.quantity)
    setDraftDueDate(deliverable.dueDate)
    setEditing(false)
  }

  return (
    <>
      <tr className="border-b last:border-b-0 hover:bg-muted/20 transition-colors align-top">
        {editing ? (
          <>
            <td className="py-2 px-3"><Input value={draftDesc} onChange={e => setDraftDesc(e.target.value)} className="h-7 text-sm" /></td>
            <td className="py-2 px-3">
              <Select value={draftDirection} onValueChange={setDraftDirection}>
                <SelectTrigger className="h-7 text-sm w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Athlete → Sponsor">Athlete → Sponsor</SelectItem>
                  <SelectItem value="Sponsor → Athlete">Sponsor → Athlete</SelectItem>
                </SelectContent>
              </Select>
            </td>
            <td className="py-2 px-3"><Input value={draftQuantity} onChange={e => setDraftQuantity(e.target.value)} className="h-7 text-sm w-28" /></td>
            <td className="py-2 px-3"><Input type="date" value={draftDueDate} onChange={e => setDraftDueDate(e.target.value)} className="h-7 text-sm" /></td>
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
            <td className="py-2.5 px-3 text-sm text-muted-foreground">{formatDate(deliverable.dueDate)}</td>
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
              Are you sure you want to save these changes to this deliverable?
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
              <span className="font-medium">{formatDate(draftDueDate)}</span>
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
            <DialogTitle>Delete Deliverable</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this deliverable? This action cannot be undone.
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

 interface BuildReviewStageProps {
  onBack: () => void
  isEditing?: boolean
  }
  
  export function BuildReviewStage({ onBack, isEditing }: BuildReviewStageProps) {
  const {
    state,
    setStage,
    updatePayment,
    addPayment,
    deletePayment,
    updateConditionalPayment,
    addConditionalPayment,
    deleteConditionalPayment,
    updateObligation,
    addObligation,
    deleteObligation,
    reorderPayments,
  } = useBuildContract()

  const { formData, payments, conditionalPayments, obligations, scheduleTotal } = state

  const [paymentsOpen, setPaymentsOpen] = useState(true)
  const [conditionalOpen, setConditionalOpen] = useState(true)
  const [obligationsOpen, setObligationsOpen] = useState(true)
  const [deliverablesOpen, setDeliverablesOpen] = useState(true)
  
  // Add payment modal state
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false)
  const [showAddConditionalModal, setShowAddConditionalModal] = useState(false)
  const [showAddDeliverableModal, setShowAddDeliverableModal] = useState(false)
  
  const [newPaymentDate, setNewPaymentDate] = useState("")
  const [newPaymentAmount, setNewPaymentAmount] = useState(0)
  const [newPaymentType, setNewPaymentType] = useState("License Fee")
  const [newPaymentCapApplicable, setNewPaymentCapApplicable] = useState(true)
  
  const [newConditionalType, setNewConditionalType] = useState("")
  
  const [newOblDesc, setNewOblDesc] = useState("")
  const [newOblDirection, setNewOblDirection] = useState("Athlete → Sponsor")
  const [newOblQuantity, setNewOblQuantity] = useState("")
  const [newOblDueDate, setNewOblDueDate] = useState("")

  // Drag and drop reorder confirmation
  const [pendingReorder, setPendingReorder] = useState<{
    sourceId: string
    targetId: string
    sourceDate: string
    targetDate: string
    sourceAmount: number
    targetAmount: number
  } | null>(null)
  const [showReorderConfirm, setShowReorderConfirm] = useState(false)

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

  const sortedPayments = useMemo(() =>
    [...payments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [payments]
  )

  // For revenue share, total comes from cap periods; for other types, use totalValue
  const expectedTotal = formData.contractType === "revenue-share" 
    ? formData.capPeriods.reduce((sum, cp) => sum + cp.amount, 0)
    : formData.totalValue
  const isBalanced = scheduleTotal === expectedTotal
  const capPeriods = useMemo(() => {
    const periods = new Set(payments.map(p => p.capPeriod))
    return periods.size
  }, [payments])

  // Chart data
  const chartData = useMemo(() => {
    const dataByMonth: Record<string, { scheduled: number; conditional: number }> = {}

    // Aggregate scheduled payments
    payments.forEach(p => {
      const d = new Date(p.date + "T00:00:00")
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      if (!dataByMonth[key]) dataByMonth[key] = { scheduled: 0, conditional: 0 }
      dataByMonth[key].scheduled += p.amount
    })

    // Aggregate conditional payments
    conditionalPayments.forEach(p => {
      const d = new Date(p.date + "T00:00:00")
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      if (!dataByMonth[key]) dataByMonth[key] = { scheduled: 0, conditional: 0 }
      dataByMonth[key].conditional += p.amount
    })

    // Sort and format
    return Object.entries(dataByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => {
        const [y, m] = month.split("-")
        const date = new Date(Number(y), Number(m) - 1, 1)
        return {
          month: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          scheduled: data.scheduled,
          conditional: data.conditional,
        }
      })
  }, [payments, conditionalPayments])

  // Cap-applicable summary by period
  const capSummaryByPeriod = useMemo(() => {
    const summary: Record<string, number> = {}
    payments.filter(p => p.capApplicable).forEach(p => {
      if (!summary[p.capPeriod]) summary[p.capPeriod] = 0
      summary[p.capPeriod] += p.amount
    })
    return Object.entries(summary).map(([period, amount]) => ({
      period,
      amount,
    }))
  }, [payments])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const sourcePayment = sortedPayments.find(p => p.id === active.id)
      const targetPayment = sortedPayments.find(p => p.id === over.id)

      if (sourcePayment && targetPayment) {
        setPendingReorder({
          sourceId: sourcePayment.id,
          targetId: targetPayment.id,
          sourceDate: sourcePayment.date,
          targetDate: targetPayment.date,
          sourceAmount: sourcePayment.amount,
          targetAmount: targetPayment.amount,
        })
        setShowReorderConfirm(true)
      }
    }
  }

  const confirmReorder = () => {
    if (pendingReorder) {
      updatePayment(pendingReorder.sourceId, {
        date: pendingReorder.targetDate,
        fiscalYear: getFiscalYear(pendingReorder.targetDate),
        capPeriod: getCapPeriod(pendingReorder.targetDate),
        edited: true,
      })
      updatePayment(pendingReorder.targetId, {
        date: pendingReorder.sourceDate,
        fiscalYear: getFiscalYear(pendingReorder.sourceDate),
        capPeriod: getCapPeriod(pendingReorder.sourceDate),
        edited: true,
      })
    }
    setPendingReorder(null)
    setShowReorderConfirm(false)
  }

  const cancelReorder = () => {
    setPendingReorder(null)
    setShowReorderConfirm(false)
  }

  const openAddPaymentModal = () => {
    setNewPaymentDate("")
    setNewPaymentAmount(0)
    setNewPaymentType(formData.contractType === "revenue-share" ? "License Fee" : "Sponsorship Payment")
    setNewPaymentCapApplicable(true)
    setShowAddPaymentModal(true)
  }

  const confirmAddPayment = () => {
    if (!newPaymentDate || newPaymentAmount <= 0) return
    addPayment({
      id: `manual-payment-${Date.now()}`,
      date: newPaymentDate,
      amount: newPaymentAmount,
      type: newPaymentType,
      fiscalYear: getFiscalYear(newPaymentDate),
      capPeriod: getCapPeriod(newPaymentDate),
      capApplicable: newPaymentCapApplicable,
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
    addConditionalPayment({
      id: `conditional-${Date.now()}`,
      date: newPaymentDate,
      amount: newPaymentAmount,
      type: newConditionalType || "Performance Bonus",
      fiscalYear: getFiscalYear(newPaymentDate),
      capPeriod: getCapPeriod(newPaymentDate),
      capApplicable: newPaymentCapApplicable,
      edited: true,
    })
    setShowAddConditionalModal(false)
  }

const openAddDeliverableModal = () => {
    setNewOblDesc("")
    setNewOblDirection("Athlete → Sponsor")
    setNewOblQuantity("")
    setNewOblDueDate("")
    setShowAddDeliverableModal(true)
  }

  const confirmAddDeliverable = () => {
    if (!newOblDesc || !newOblQuantity) return
    addObligation({
      id: `deliverable-${Date.now()}`,
      type: "",
      description: newOblDesc,
      direction: newOblDirection,
      quantity: newOblQuantity,
      paymentAmount: 0,
      trigger: "on-completion",
      status: "pending",
      dueDate: newOblDueDate || formData.endDate,
      edited: true,
    })
    setShowAddDeliverableModal(false)
  }

  const contractTypeLabel = formData.contractType === "revenue-share" ? "Revenue Share" : "NIL Sponsorship"
  const conditionalTotal = conditionalPayments.reduce((s, p) => s + p.amount, 0)

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Stage progress */}
      <div className="border-b px-6 py-4">
        <BuildStageProgress currentStage="review" />
      </div>

      {/* Full-width layout */}
      <div className="flex-1 flex min-h-0">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto px-6 py-5 space-y-6">
            {/* Header */}
            <div>
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {isEditing ? "Cancel" : "Back"}
              </button>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-lg font-semibold text-foreground">
                    {isEditing ? "Edit Agreement" : "Review Schedule"}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {formData.athleteName} &middot; {contractTypeLabel}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs shrink-0">
                  {contractTypeLabel}
                </Badge>
              </div>

              {/* Summary sentence */}
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                This contract covers a {contractTypeLabel} between {formData.athleteName} and {formData.counterpartyName}, consisting of {payments.length} scheduled and {conditionalPayments.length} conditional payments across {obligations.length} deliverables, and {capPeriods} cap period{capPeriods !== 1 ? "s" : ""}.
              </p>

              {/* Key stats row */}
              <div className="flex items-center gap-6 mt-3 pt-3 border-t">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Contract Value</p>
                  <p className="text-sm font-semibold text-foreground">{formatCurrency(scheduleTotal)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Start Date</p>
                  <p className="text-sm font-semibold text-foreground">{formatDate(formData.startDate)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">End Date</p>
                  <p className="text-sm font-semibold text-foreground">{formatDate(formData.endDate)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Payments</p>
                  <p className="text-sm font-semibold text-foreground">{payments.length + conditionalPayments.length}</p>
                </div>
                {formData.contractType !== "revenue-share" && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Obligations</p>
                    <p className="text-sm font-semibold text-foreground">{obligations.length}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Timeline Chart */}
            {chartData.length > 0 && (
              <div className="border rounded-lg p-4">
                <ChartContainer
                  config={{
                    scheduled: { label: "Scheduled", color: "hsl(173, 58%, 39%)" },
                    conditional: { label: "Conditional", color: "hsl(43, 96%, 56%)" },
                  }}
                  className="h-[200px] w-full"
                >
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="fillScheduled" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(173, 58%, 39%)" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="hsl(173, 58%, 39%)" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="fillConditional" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(43, 96%, 56%)" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="hsl(43, 96%, 56%)" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" tickMargin={8} axisLine={false} />
                    <YAxis
                      className="text-xs"
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                      tickMargin={8}
                      axisLine={false}
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (!active || !payload || payload.length === 0) return null
                        const data = payload[0].payload
                        return (
                          <div className="rounded-lg border bg-background p-3 shadow-lg">
                            <p className="font-semibold mb-2">{data.month}</p>
                            <div className="grid gap-1.5">
                              <div className="flex items-center gap-2 text-xs">
                                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "hsl(173, 58%, 39%)" }} />
                                <span className="text-muted-foreground">Scheduled:</span>
                                <span className="font-medium ml-auto">{formatCurrency(data.scheduled)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "hsl(43, 96%, 56%)" }} />
                                <span className="text-muted-foreground">Conditional:</span>
                                <span className="font-medium ml-auto">{formatCurrency(data.conditional)}</span>
                              </div>
                            </div>
                          </div>
                        )
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="conditional"
                      stackId="1"
                      stroke="hsl(43, 96%, 56%)"
                      fill="url(#fillConditional)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="scheduled"
                      stackId="1"
                      stroke="hsl(173, 58%, 39%)"
                      fill="url(#fillScheduled)"
                      strokeWidth={2}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => <span className="text-xs text-muted-foreground ml-1">{value}</span>}
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            )}
          </div>
          
          {/* Main content area with optional sidebar for revenue-share */}
          <div className="max-w-[1200px] mx-auto px-6 pb-6">
            <div className={cn(
              "flex gap-6",
              formData.contractType !== "revenue-share" && "block"
            )}>
              {/* Main content area */}
              <div className={cn(
                "space-y-6",
                formData.contractType === "revenue-share" ? "flex-1 min-w-0" : "w-full"
              )}>
            
            {/* SCHEDULED PAYMENTS Section */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <button onClick={() => setPaymentsOpen(!paymentsOpen)} className="flex items-center gap-2 text-left py-1">
                  {paymentsOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  <h2 className="text-sm font-semibold text-foreground">
                    {formData.contractType === "revenue-share" ? "Revshare Payroll" : "Scheduled Payments"}
                  </h2>
                  <span className="text-xs text-muted-foreground">({payments.length})</span>
                </button>
                {paymentsOpen && (
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7" onClick={openAddPaymentModal}>
                    <Plus className="h-3 w-3" />
                    Add Scheduled Payment
                  </Button>
                )}
              </div>
              
              {/* Cap-applicable summary */}
              {paymentsOpen && capSummaryByPeriod.length > 0 && (
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                  <span className="font-medium">Cap-applicable by period:</span>
                  {capSummaryByPeriod.map(({ period, amount }) => (
                    <span key={period}>{period}: {formatCurrency(amount)}</span>
                  ))}
                </div>
              )}

              {paymentsOpen && (
                <div className="border rounded-lg overflow-x-auto">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/30">
                          <th className="w-8" />
                          <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Payment Date</th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Dates</th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Amount</th>
                          <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-28">Cap Period</th>
                          <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-24">Actions</th>
                        </tr>
                      </thead>
                      <SortableContext items={sortedPayments.map(p => p.id)} strategy={verticalListSortingStrategy}>
                        <tbody>
                          {sortedPayments.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-6 text-center text-sm text-muted-foreground">No payments added yet.</td>
                            </tr>
                          ) : (
                            sortedPayments.map(payment => (
                              <SortablePaymentRow
                                key={payment.id}
                                payment={payment}
                                onUpdate={updatePayment}
                                onDelete={deletePayment}
                              />
                            ))
                          )}
                        </tbody>
                      </SortableContext>
                      {sortedPayments.length > 0 && (
                        <tfoot>
                          <tr className="bg-muted/30">
                            <td />
                            <td className="py-2.5 px-3 text-sm font-semibold text-foreground">Total</td>
                            <td />
                            <td className="py-2.5 px-3 text-sm font-semibold text-foreground">{formatCurrency(scheduleTotal)}</td>
                            <td className="py-2.5 px-3 text-xs text-muted-foreground">{formatCurrency(payments.filter(p => p.capApplicable).reduce((s, p) => s + p.amount, 0))} cap-applicable</td>
                            <td />
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </DndContext>
                </div>
              )}
            </section>

            {/* CONDITIONAL PAYMENTS Section */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <button onClick={() => setConditionalOpen(!conditionalOpen)} className="flex items-center gap-2 text-left py-1">
                  {conditionalOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  <h2 className="text-sm font-semibold text-foreground">
                    {formData.contractType === "revenue-share" ? "Conditional Performance Pay" : "Conditional Payments"}
                  </h2>
                  <span className="text-xs text-muted-foreground">({conditionalPayments.length})</span>
                </button>
                {conditionalOpen && (
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7" onClick={openAddConditionalModal}>
                    <Plus className="h-3 w-3" />
                    Add Conditional Payment
                  </Button>
                )}
              </div>
              {conditionalOpen && (
                <div className="border rounded-lg overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Payment Date</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Dates</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Amount</th>
                        <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-28">Cap Period</th>
                        <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-24">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conditionalPayments.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-sm text-muted-foreground">No conditional payments added yet.</td>
                        </tr>
                      ) : (
                        conditionalPayments.map(payment => (
                          <ConditionalPaymentRow
                            key={payment.id}
                            payment={payment}
                            onUpdate={updateConditionalPayment}
                            onDelete={deleteConditionalPayment}
                          />
                        ))
                      )}
                    </tbody>
                    {conditionalPayments.length > 0 && (
                      <tfoot>
                        <tr className="bg-muted/30">
                          <td className="py-2.5 px-3 text-sm font-semibold text-foreground">Total</td>
                          <td />
                          <td className="py-2.5 px-3 text-sm font-semibold text-foreground">{formatCurrency(conditionalTotal)}</td>
                          <td className="py-2.5 px-3 text-xs text-muted-foreground">{formatCurrency(conditionalPayments.filter(p => p.capApplicable).reduce((s, p) => s + p.amount, 0))} cap-applicable</td>
                          <td />
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              )}
            </section>

            {/* OBLIGATIONS Section - Only for non-revenue-share contracts */}
            {formData.contractType !== "revenue-share" && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <button onClick={() => setObligationsOpen(!obligationsOpen)} className="flex items-center gap-2 text-left py-1">
                  {obligationsOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  <h2 className="text-sm font-semibold text-foreground">Obligations</h2>
                  <span className="text-xs text-muted-foreground">({obligations.length})</span>
                </button>
              </div>
              {obligationsOpen && (
                <div className="space-y-4">
                  {/* Deliverables Group */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between w-full px-4 py-2.5 bg-muted/30 border-b">
                      <button
                        onClick={() => setDeliverablesOpen(!deliverablesOpen)}
                        className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                      >
                        {deliverablesOpen ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                        <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Deliverables</span>
                        <span className="text-xs text-muted-foreground">({obligations.length})</span>
                      </button>
                      {deliverablesOpen && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-xs h-6 px-2"
                          onClick={() => openAddDeliverableModal()}
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
                            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-[18%]">Source → Beneficiary</th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-[17%]">Quantity</th>
                            <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-[18%]">Deadline</th>
                            <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wide w-[12%]">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {obligations.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-6 text-center text-sm text-muted-foreground">No deliverables added yet.</td>
                            </tr>
                          ) : (
                            obligations.map(obl => (
                              <DeliverableRow
                                key={obl.id}
                                deliverable={obl}
                                onUpdate={updateObligation}
                                onDelete={deleteObligation}
                              />
                            ))
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </section>
            )}
              </div>
              
              {/* Sidebar with cap period cards - only for revenue-share */}
              {formData.contractType === "revenue-share" && payments.length > 0 && (
                <div className="w-64 shrink-0 hidden lg:block">
                  <CapPeriodSidebar
                    currentContractPayments={[...payments, ...conditionalPayments].map(p => ({
                      date: p.date,
                      amount: p.amount,
                      capApplicable: p.capApplicable,
                    }))}
                    sport={formData.team === "mens-basketball" ? "MBB" : "WBB"}
                    editingContractId={state.editingContractId}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t px-6 py-4 flex items-center justify-between bg-background">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
          <CheckCircle className="h-4 w-4" />
          <span>
            {payments.length + conditionalPayments.length} payments totaling {formatCurrency(scheduleTotal)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setStage("export")}>
            <Check className="h-4 w-4 mr-1.5" />
            {isEditing ? "Continue to Save" : "Confirm & Save"}
          </Button>
        </div>
      </div>

      {/* Reorder Confirmation Dialog */}
      <Dialog open={showReorderConfirm} onOpenChange={setShowReorderConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Payment Reorder</DialogTitle>
            <DialogDescription>
              This will swap the dates between these two payments. Are you sure?
            </DialogDescription>
          </DialogHeader>
          {pendingReorder && (
            <div className="py-4 space-y-3 text-sm">
              <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                <span>{formatCurrency(pendingReorder.sourceAmount)}</span>
                <span className="text-muted-foreground">{formatDate(pendingReorder.sourceDate)} → {formatDate(pendingReorder.targetDate)}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                <span>{formatCurrency(pendingReorder.targetAmount)}</span>
                <span className="text-muted-foreground">{formatDate(pendingReorder.targetDate)} → {formatDate(pendingReorder.sourceDate)}</span>
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
            <DialogDescription>Add a new scheduled payment to this contract.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Date</label>
              <Input type="date" value={newPaymentDate} onChange={e => setNewPaymentDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="text"
                inputMode="numeric"
                value={formatNumberWithCommas(newPaymentAmount)}
                onChange={e => setNewPaymentAmount(parseFormattedNumber(e.target.value))}
                onFocus={e => {
                  if (newPaymentAmount === 0) e.target.value = ""
                }}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Input value={newPaymentType} onChange={e => setNewPaymentType(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPaymentModal(false)}>Cancel</Button>
            <Button onClick={confirmAddPayment} disabled={!newPaymentDate || newPaymentAmount <= 0}>Add Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Conditional Payment Modal */}
      <Dialog open={showAddConditionalModal} onOpenChange={setShowAddConditionalModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Conditional Payment</DialogTitle>
            <DialogDescription>Add a conditional payment (e.g., bonus) to this contract.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Date</label>
              <Input type="date" value={newPaymentDate} onChange={e => setNewPaymentDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="text"
                inputMode="numeric"
                value={formatNumberWithCommas(newPaymentAmount)}
                onChange={e => setNewPaymentAmount(parseFormattedNumber(e.target.value))}
                onFocus={e => {
                  if (newPaymentAmount === 0) e.target.value = ""
                }}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Input value={newConditionalType} onChange={e => setNewConditionalType(e.target.value)} placeholder="e.g., Bowl Game Appearance" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddConditionalModal(false)}>Cancel</Button>
            <Button onClick={confirmAddConditional} disabled={!newPaymentDate || newPaymentAmount <= 0}>Add Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Deliverable Modal */}
      <Dialog open={showAddDeliverableModal} onOpenChange={setShowAddDeliverableModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Deliverable</DialogTitle>
            <DialogDescription>Add a new deliverable obligation to this contract.</DialogDescription>
          </DialogHeader>
<div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input value={newOblDesc} onChange={e => setNewOblDesc(e.target.value)} placeholder="e.g., Social media posts" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Direction</label>
              <Select value={newOblDirection} onValueChange={setNewOblDirection}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Athlete → Sponsor">Athlete → Sponsor</SelectItem>
                  <SelectItem value="Sponsor → Athlete">Sponsor → Athlete</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input value={newOblQuantity} onChange={e => setNewOblQuantity(e.target.value)} placeholder="e.g., 8 posts" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Deadline</label>
              <Input type="date" value={newOblDueDate} onChange={e => setNewOblDueDate(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDeliverableModal(false)}>Cancel</Button>
            <Button onClick={confirmAddDeliverable} disabled={!newOblDesc || !newOblQuantity}>Add Deliverable</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
