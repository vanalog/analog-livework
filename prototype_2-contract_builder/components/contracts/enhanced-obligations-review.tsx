"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle2,
  Edit2,
  Plus,
  Trash2,
  Calendar,
  Trophy,
  Zap,
  DollarSign,
  User,
  AlertTriangle,
  Clock,
  FileText,
  RotateCcw,
  Copy,
  ChevronDown,
  ChevronUp,
  Save,
  Undo2,
  ChevronLeft,
  ChevronRight,
  X,
  TrendingUp,
  Pencil,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"
import { useSidebar } from "@/components/ui/sidebar"

type ObligationStatus = "unreviewed" | "confirmed" | "modified" | "manual" | "deleted"
type PaymentType = "one-time" | "recurring" | "milestone" | "conditional"

interface ObligationVersion {
  timestamp: string
  user: string
  changes: Record<string, { from: string; to: string }>
}

interface Obligation {
  id: string
  amount: number
  recipient: string
  paymentType: PaymentType
  status: ObligationStatus
  // confidence?: number
  contractReference?: {
    section: string
    page: number
    excerpt: string
  }
  // Type-specific fields
  date?: string
  startDate?: string
  endDate?: string
  frequency?: string
  milestone?: string
  expectedDate?: string
  condition?: string
  triggerEvent?: string
  // Metadata
  notes?: string
  validationWarnings?: string[]
  versions?: ObligationVersion[]
  deletedBy?: string
  deletedDate?: string
  deletionReason?: string
  originalValues?: Partial<Obligation>
}

const mockObligations: Obligation[] = [
  {
    id: "1",
    amount: 50000,
    recipient: "Marcus Johnson",
    paymentType: "one-time",
    status: "unreviewed",
    // confidence: 98,
    date: "2025-01-15",
    contractReference: {
      section: "Section 3.1",
      page: 5,
      excerpt:
        "Sponsor agrees to provide a one-time signing bonus of $50,000 to Athlete within 30 days of contract execution.",
    },
    validationWarnings: [],
    versions: [],
  },
  {
    id: "2",
    amount: 25000,
    recipient: "Marcus Johnson",
    paymentType: "milestone",
    status: "unreviewed",
    // confidence: 95,
    milestone: "Complete 10 social media posts",
    expectedDate: "2025-03-01",
    contractReference: {
      section: "Section 3.2",
      page: 6,
      excerpt:
        "Upon completion of 10 approved social media posts featuring Sponsor's products, Athlete shall receive $25,000.",
    },
    validationWarnings: [],
    versions: [],
  },
  {
    id: "3",
    amount: 15000,
    recipient: "Marcus Johnson",
    paymentType: "recurring",
    status: "unreviewed",
    // confidence: 99,
    startDate: "2025-02-01",
    endDate: "2025-07-01",
    frequency: "monthly",
    contractReference: {
      section: "Section 3.3",
      page: 6,
      excerpt: "Monthly retainer of $15,000 payable on the first day of each month for six months.",
    },
    validationWarnings: [],
    versions: [],
  },
  {
    id: "4",
    amount: 10000,
    recipient: "Marcus Johnson",
    paymentType: "conditional",
    status: "unreviewed",
    // confidence: 92,
    condition: "Team reaches playoffs",
    triggerEvent: "Playoff qualification announcement",
    contractReference: {
      section: "Section 3.4",
      page: 7,
      excerpt: "If Athlete's team qualifies for playoffs, Sponsor will pay a bonus of $10,000.",
    },
    validationWarnings: ["Amount exceeds typical conditional payment range"],
    versions: [],
  },
]

const paymentTypeIcons = {
  "one-time": Calendar,
  recurring: Clock,
  milestone: Trophy,
  conditional: Zap,
}

const statusConfig = {
  unreviewed: { label: "Pending Review", icon: Clock, color: "text-muted-foreground" },
  confirmed: { label: "Confirmed", icon: CheckCircle2, color: "text-green-600" },
  modified: { label: "Modified", icon: Edit2, color: "text-blue-600" },
  manual: { label: "Manually Added", icon: Plus, color: "text-purple-600" },
  deleted: { label: "Deleted", icon: Trash2, color: "text-red-600" },
}

const getObligationTitle = (obligation: Obligation): string => {
  if (obligation.milestone) return obligation.milestone
  if (obligation.condition) return obligation.condition
  if (obligation.frequency) return `${obligation.frequency} payment`
  if (obligation.paymentType === "one-time") return "One-time payment"
  return "Payment"
}

interface EnhancedObligationsReviewProps {
  contractId: string
  onNavigateToDetail?: (obligationId: string) => void
}

export function EnhancedObligationsReview({ contractId, onNavigateToDetail }: EnhancedObligationsReviewProps) {
  const [obligations, setObligations] = useState<Obligation[]>(mockObligations)
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const [editedObligation, setEditedObligation] = useState<Obligation | null>(null)
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [showDeletedItems, setShowDeletedItems] = useState(false)
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean
    type: "confirm" | "delete" | "reset"
    notes?: string
    deletionReason?: string
  }>({ open: false, type: "confirm" })
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const { toggleSidebar, state: sidebarState } = useSidebar()
  const [sidebarWasExpanded, setSidebarWasExpanded] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const focusedObligation = obligations.find((o) => o.id === focusedId)
  const visibleObligations = showDeletedItems ? obligations : obligations.filter((o) => o.status !== "deleted")

  const confirmedCount = obligations.filter((o) => o.status === "confirmed").length
  const modifiedCount = obligations.filter((o) => o.status === "modified").length
  const pendingCount = obligations.filter((o) => o.status === "unreviewed").length
  const currentIndex = focusedId ? visibleObligations.findIndex((o) => o.id === focusedId) : -1

  const contractValue = 200000 // This should come from contract data
  const totalObligations = obligations.filter((o) => o.status !== "deleted").reduce((sum, o) => sum + o.amount, 0)

  const runValidations = useCallback((obligation: Obligation): string[] => {
    const warnings: string[] = []

    if (obligation.amount > 100000) {
      warnings.push("Unusually high amount (exceeds $100,000)")
    }

    if (obligation.amount === 0) {
      warnings.push("Amount is zero")
    }

    if (!obligation.recipient) {
      warnings.push("Missing recipient")
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (obligation.paymentType === "one-time" && obligation.date) {
      const paymentDate = new Date(obligation.date)
      if (paymentDate < today) {
        warnings.push("Date is in the past")
      }
    }

    if (obligation.paymentType === "one-time" && !obligation.date) {
      warnings.push("Missing payment date")
    }

    if (obligation.paymentType === "recurring") {
      if (!obligation.startDate || !obligation.endDate) {
        warnings.push("Missing start or end date")
      } else {
        const startDate = new Date(obligation.startDate)
        const endDate = new Date(obligation.endDate)
        if (startDate < today) {
          warnings.push("Start date is in the past")
        }
        if (endDate < startDate) {
          warnings.push("End date is before start date")
        }
      }
      if (!obligation.frequency) {
        warnings.push("Missing frequency")
      }
    }

    if (obligation.paymentType === "milestone") {
      if (!obligation.milestone) {
        warnings.push("Missing milestone description")
      }
      if (obligation.expectedDate) {
        const expectedDate = new Date(obligation.expectedDate)
        if (expectedDate < today) {
          warnings.push("Expected date is in the past")
        }
      }
    }

    if (obligation.paymentType === "conditional" && !obligation.condition) {
      warnings.push("Missing condition description")
    }

    return warnings
  }, [])

  // Auto-save simulation
  useEffect(() => {
    if (hasUnsavedChanges && editedObligation) {
      setAutoSaveStatus("saving")
      const timer = setTimeout(() => {
        setAutoSaveStatus("saved")
        setTimeout(() => setAutoSaveStatus("idle"), 2000)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [hasUnsavedChanges, editedObligation])

  // Keyboard shortcuts
  useEffect(() => {
    if (!focusedId) return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.key) {
        case "Enter":
          if (!e.shiftKey) handleConfirm()
          break
        case "s":
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault()
            handleSaveChanges()
          }
          break
        case "Escape":
          handleBack()
          break
        case "ArrowLeft":
          handlePrevious()
          break
        case "ArrowRight":
          handleNext()
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [focusedId, editedObligation])

  useEffect(() => {
    if (focusedId) {
      setSidebarWasExpanded(sidebarState === "expanded")
      if (sidebarState === "expanded") {
        toggleSidebar()
      }
    } else {
      if (sidebarWasExpanded && sidebarState === "collapsed") {
        toggleSidebar()
      }
    }
  }, [focusedId])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [editedObligation?.notes])

  const handleObligationClick = (id: string) => {
    const obligation = obligations.find((o) => o.id === id)
    if (obligation) {
      setFocusedId(id)
      setEditedObligation({ ...obligation, originalValues: { ...obligation }, validationWarnings: [] })
      setHasUnsavedChanges(false)
    }
  }

  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (confirm("You have unsaved changes. Are you sure you want to go back?")) {
        setFocusedId(null)
        setEditedObligation(null)
        setHasUnsavedChanges(false)
      }
    } else {
      setFocusedId(null)
      setEditedObligation(null)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      handleObligationClick(visibleObligations[currentIndex - 1].id)
    }
  }

  const handleNext = () => {
    if (currentIndex < visibleObligations.length - 1) {
      handleObligationClick(visibleObligations[currentIndex + 1].id)
    }
  }

  const handleFieldChange = (field: keyof Obligation, value: any) => {
    if (!editedObligation) return
    const updated = { ...editedObligation, [field]: value }
    const warnings = runValidations(updated)
    setEditedObligation({ ...updated, validationWarnings: warnings })
    setHasUnsavedChanges(true)
  }

  const handleSaveChanges = () => {
    if (!editedObligation) return

    const updatedObligations = obligations.map((o) => {
      if (o.id === editedObligation.id) {
        const changes: Record<string, { from: string; to: string }> = {}
        Object.keys(editedObligation).forEach((key) => {
          const k = key as keyof Obligation
          if (
            editedObligation[k] !== o[k] &&
            k !== "versions" &&
            k !== "originalValues" &&
            k !== "validationWarnings"
          ) {
            changes[key] = { from: String(o[k]), to: String(editedObligation[k]) }
          }
        })

        const newVersion: ObligationVersion = {
          timestamp: new Date().toISOString(),
          user: "Current User",
          changes,
        }

        return {
          ...editedObligation,
          status: Object.keys(changes).length > 0 ? ("modified" as ObligationStatus) : o.status,
          versions: [...(o.versions || []), newVersion],
        }
      }
      return o
    })

    setObligations(updatedObligations)
    setHasUnsavedChanges(false)
    setAutoSaveStatus("saved")
  }

  const handleConfirm = () => {
    setConfirmModal({ open: true, type: "confirm", notes: editedObligation?.notes || "" })
  }

  const handleConfirmSubmit = () => {
    if (!editedObligation) return

    // Save changes before confirming
    handleSaveChanges()

    const updatedObligations = obligations.map((o) =>
      o.id === editedObligation.id ? { ...editedObligation, status: "confirmed" as ObligationStatus } : o,
    )

    setObligations(updatedObligations)
    setConfirmModal({ open: false, type: "confirm" })

    // Move to next obligation if available
    if (currentIndex < visibleObligations.length - 1) {
      handleNext()
    } else {
      handleBack() // Close detail view if it was the last item
    }
  }

  const handleDelete = () => {
    setConfirmModal({ open: true, type: "delete", deletionReason: "" })
  }

  const handleDeleteSubmit = () => {
    if (!editedObligation || !confirmModal.deletionReason) return

    const updatedObligations = obligations.map((o) =>
      o.id === editedObligation.id
        ? {
            ...o,
            status: "deleted" as ObligationStatus,
            deletedBy: "Current User",
            deletedDate: new Date().toISOString(),
            deletionReason: confirmModal.deletionReason,
          }
        : o,
    )

    setObligations(updatedObligations)
    setConfirmModal({ open: false, type: "delete" })
    handleBack() // Close detail view after deletion
  }

  const handleReset = () => {
    setConfirmModal({ open: true, type: "reset" })
  }

  const handleResetSubmit = () => {
    if (!editedObligation?.originalValues) return
    // Reset to original values, clear validation warnings and unsaved changes status
    setEditedObligation({
      ...editedObligation,
      ...editedObligation.originalValues,
      validationWarnings: [],
      notes: editedObligation.originalValues.notes || "",
    })
    setHasUnsavedChanges(false)
    setConfirmModal({ open: false, type: "reset" })
  }

  const handleDuplicate = () => {
    if (!editedObligation) return

    const newObligation: Obligation = {
      ...editedObligation,
      id: `manual-${Date.now()}`, // Use a more robust ID generation if needed
      status: "manual",
      // confidence: undefined,
      contractReference: undefined,
      versions: [],
      validationWarnings: [], // Clear warnings on duplication
      originalValues: undefined, // Clear original values
      notes: editedObligation.notes, // Keep notes from the duplicated obligation
    }

    setObligations([...obligations, newObligation])
    handleObligationClick(newObligation.id) // Focus on the newly created obligation
  }

  const handleRestore = () => {
    if (!editedObligation) return

    const updatedObligations = obligations.map((o) =>
      o.id === editedObligation.id
        ? {
            ...o,
            status: "unreviewed" as ObligationStatus, // Reset to unreviewed
            deletedBy: undefined,
            deletedDate: undefined,
            deletionReason: undefined,
          }
        : o,
    )

    setObligations(updatedObligations)
    handleBack() // Close detail view after restoring
  }

  const handleAddMissing = () => {
    const newObligation: Obligation = {
      id: `manual-${Date.now()}`, // Use a more robust ID generation if needed
      amount: 0,
      recipient: "",
      paymentType: "one-time",
      status: "manual",
      notes: "",
      validationWarnings: [],
      versions: [],
      originalValues: undefined, // Ensure originalValues is not present for manual entries
    }

    // Add the new obligation to the list
    setObligations([...obligations, newObligation])

    // Immediately set focus and edit state (don't wait for state update)
    setFocusedId(newObligation.id)
    setEditedObligation({ ...newObligation, originalValues: { ...newObligation }, validationWarnings: [] })
    setHasUnsavedChanges(false)

    // If onNavigateToDetail is provided, call it (for navigation from overview)
    if (onNavigateToDetail) {
      onNavigateToDetail(newObligation.id)
    }
  }

  const handleConfirmAll = () => {
    const updatedObligations = obligations.map((o) =>
      o.status === "unreviewed" ? { ...o, status: "confirmed" as ObligationStatus } : o,
    )
    setObligations(updatedObligations)
  }

  const handleExport = () => {
    console.log("Exporting payment schedule...")
    // Implement actual export logic here
  }

  const isFieldModified = (field: keyof Obligation): boolean => {
    if (!editedObligation?.originalValues) return false
    return editedObligation[field] !== editedObligation.originalValues[field]
  }

  const getOriginalValue = (field: keyof Obligation): any => {
    return editedObligation?.originalValues?.[field]
  }

  // If focused on an obligation, return two-panel layout
  if (focusedId && editedObligation) {
    const PaymentIcon = paymentTypeIcons[editedObligation.paymentType]

    return {
      listPanel: (
        <div className="sticky top-18 self-start">
          <Card className="h-[calc(100vh-12rem)] overflow-hidden">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-lg">Obligations Review</CardTitle>
              <div className="mt-2 space-y-1">
                <div className="text-sm text-muted-foreground">
                  {confirmedCount} confirmed, {modifiedCount} modified, {pendingCount} pending
                </div>
                <div className="text-sm font-medium">
                  Total: ${totalObligations.toLocaleString()} of ${contractValue.toLocaleString()}
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100%-6rem)] overflow-y-auto p-4">
              <div className="space-y-2">
                {visibleObligations.map((obligation) => {
                  const Icon = paymentTypeIcons[obligation.paymentType]
                  const isActive = obligation.id === focusedId
                  const isReviewed = obligation.status === "confirmed" || obligation.status === "modified"
                  const title = getObligationTitle(obligation)

                  return (
                    <button
                      key={obligation.id}
                      onClick={() => handleObligationClick(obligation.id)}
                      className={`w-full rounded-lg border p-3 text-left transition-all ${
                        isActive
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-card hover:border-primary/50"
                      } ${obligation.status === "deleted" ? "opacity-50" : ""}`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2 w-2 rounded-full flex-shrink-0 ${
                              isReviewed ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                            }`}
                          />
                          <Icon className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
                          <span className="text-sm font-semibold truncate flex-1">{title}</span>
                        </div>
                        <div className="flex items-center justify-between pl-6">
                          <span className="text-xs text-muted-foreground">${obligation.amount.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                            {obligation.recipient}
                          </span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              <Button onClick={handleAddMissing} variant="outline" className="mt-4 w-full bg-transparent" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Missing Obligation
              </Button>
            </CardContent>
          </Card>
        </div>
      ),
      detailPanel: (
        <AnimatePresence mode="wait">
          <motion.div
            key={focusedId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="relative flex h-full flex-col"
          >
            <Card className="flex h-full flex-col">
              <CardHeader className="sticky top-0 z-10 border-b bg-background pb-4">
                {/* Progress Indicator */}
                <div className="mb-3 flex items-center gap-1.5">
                  {visibleObligations.map((o, idx) => {
                    const isCompleted = o.status === "confirmed" || o.status === "modified"
                    const isCurrent = idx === currentIndex
                    return (
                      <TooltipProvider key={o.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleObligationClick(o.id)}
                              className={`h-2 rounded-full transition-all ${
                                isCurrent
                                  ? "w-8 bg-blue-500"
                                  : isCompleted
                                    ? "w-2 bg-green-500"
                                    : "w-2 bg-gray-300 dark:bg-gray-600"
                              }`}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              ${o.amount.toLocaleString()} - {o.paymentType} {isCompleted && "✓"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  })}
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        Item {currentIndex + 1} of {visibleObligations.length}
                      </span>
                      <span>•</span>
                      <span>{confirmedCount + modifiedCount} reviewed</span>
                    </div>
                    <CardTitle className="text-xl leading-tight flex items-center gap-2">
                      <PaymentIcon className="h-5 w-5 text-primary" />
                      {editedObligation.paymentType.charAt(0).toUpperCase() + editedObligation.paymentType.slice(1)} - $
                      {editedObligation.amount.toLocaleString()}
                    </CardTitle>
                  </div>

                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={handlePrevious} disabled={currentIndex === 0}>
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">← Arrow Left</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleNext}
                            disabled={currentIndex === visibleObligations.length - 1}
                          >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Arrow Right →</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <div className="h-6 w-px bg-border mx-1" />

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={handleBack}>
                            <X className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Esc</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {editedObligation.status === "manual" && (
                  <div className="mt-3">
                    <Badge variant="secondary" className="text-xs">
                      Manually Added
                    </Badge>
                  </div>
                )}
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-4 rounded-lg bg-muted/30 p-4">
                  <h3 className="text-sm font-semibold">Payment Details</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount *</Label>
                      <div className="group relative">
                        <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="amount"
                          type="number"
                          value={editedObligation.amount}
                          onChange={(e) => handleFieldChange("amount", Number(e.target.value))}
                          className={`pl-9 pr-8 border-2 bg-background transition-colors ${
                            isFieldModified("amount") ? "border-blue-300 dark:border-blue-700" : "border-border"
                          } focus:border-blue-500`}
                        />
                        <Pencil className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      {isFieldModified("amount") && (
                        <p className="text-xs text-muted-foreground">
                          Original: ${getOriginalValue("amount")?.toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recipient">Recipient *</Label>
                      <div className="group relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="recipient"
                          value={editedObligation.recipient}
                          onChange={(e) => handleFieldChange("recipient", e.target.value)}
                          className={`pl-9 pr-8 border-2 bg-background transition-colors ${
                            isFieldModified("recipient") ? "border-blue-300 dark:border-blue-700" : "border-border"
                          } focus:border-blue-500`}
                        />
                        <Pencil className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      {isFieldModified("recipient") && (
                        <p className="text-xs text-muted-foreground">Original: {getOriginalValue("recipient")}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentType">Payment Type *</Label>
                    <Select
                      value={editedObligation.paymentType}
                      onValueChange={(value) => handleFieldChange("paymentType", value as PaymentType)}
                    >
                      <SelectTrigger
                        id="paymentType"
                        className={`border-2 bg-background ${
                          isFieldModified("paymentType") ? "border-blue-300 dark:border-blue-700" : "border-border"
                        }`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one-time">One-time</SelectItem>
                        <SelectItem value="recurring">Recurring</SelectItem>
                        <SelectItem value="milestone">Milestone-based</SelectItem>
                        <SelectItem value="conditional">Conditional</SelectItem>
                      </SelectContent>
                    </Select>
                    {isFieldModified("paymentType") && (
                      <p className="text-xs text-muted-foreground">Original: {getOriginalValue("paymentType")}</p>
                    )}
                  </div>

                  {editedObligation.paymentType === "one-time" && (
                    <div className="space-y-2">
                      <Label htmlFor="date">Payment Date *</Label>
                      <div className="group relative">
                        <Input
                          id="date"
                          type="date"
                          value={editedObligation.date || ""}
                          onChange={(e) => handleFieldChange("date", e.target.value)}
                          className={`pr-8 border-2 bg-background transition-colors ${
                            isFieldModified("date") ? "border-blue-300 dark:border-blue-700" : "border-border"
                          } focus:border-blue-500`}
                        />
                        <Pencil className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      {isFieldModified("date") && (
                        <p className="text-xs text-muted-foreground">Original: {getOriginalValue("date")}</p>
                      )}
                    </div>
                  )}

                  {editedObligation.paymentType === "recurring" && (
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date *</Label>
                        <div className="group relative">
                          <Input
                            id="startDate"
                            type="date"
                            value={editedObligation.startDate || ""}
                            onChange={(e) => handleFieldChange("startDate", e.target.value)}
                            className={`pr-8 border-2 bg-background transition-colors ${
                              isFieldModified("startDate") ? "border-blue-300 dark:border-blue-700" : "border-border"
                            } focus:border-blue-500`}
                          />
                          <Pencil className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                        {isFieldModified("startDate") && (
                          <p className="text-xs text-muted-foreground">Original: {getOriginalValue("startDate")}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date *</Label>
                        <div className="group relative">
                          <Input
                            id="endDate"
                            type="date"
                            value={editedObligation.endDate || ""}
                            onChange={(e) => handleFieldChange("endDate", e.target.value)}
                            className={`pr-8 border-2 bg-background transition-colors ${
                              isFieldModified("endDate") ? "border-blue-300 dark:border-blue-700" : "border-border"
                            } focus:border-blue-500`}
                          />
                          <Pencil className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                        {isFieldModified("endDate") && (
                          <p className="text-xs text-muted-foreground">Original: {getOriginalValue("endDate")}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="frequency">Frequency *</Label>
                        <Select
                          value={editedObligation.frequency || ""}
                          onValueChange={(value) => handleFieldChange("frequency", value)}
                        >
                          <SelectTrigger
                            id="frequency"
                            className={`border-2 bg-background ${
                              isFieldModified("frequency") ? "border-blue-300 dark:border-blue-700" : "border-border"
                            }`}
                          >
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="annually">Annually</SelectItem>
                          </SelectContent>
                        </Select>
                        {isFieldModified("frequency") && (
                          <p className="text-xs text-muted-foreground">Original: {getOriginalValue("frequency")}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {editedObligation.paymentType === "milestone" && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="milestone">Milestone Description *</Label>
                        <div className="group relative">
                          <Input
                            id="milestone"
                            value={editedObligation.milestone || ""}
                            onChange={(e) => handleFieldChange("milestone", e.target.value)}
                            placeholder="e.g., Complete 10 social media posts"
                            className={`pr-8 border-2 bg-background transition-colors ${
                              isFieldModified("milestone") ? "border-blue-300 dark:border-blue-700" : "border-border"
                            } focus:border-blue-500`}
                          />
                          <Pencil className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                        {isFieldModified("milestone") && (
                          <p className="text-xs text-muted-foreground">Original: {getOriginalValue("milestone")}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expectedDate">Expected Date</Label>
                        <div className="group relative">
                          <Input
                            id="expectedDate"
                            type="date"
                            value={editedObligation.expectedDate || ""}
                            onChange={(e) => handleFieldChange("expectedDate", e.target.value)}
                            className={`pr-8 border-2 bg-background transition-colors ${
                              isFieldModified("expectedDate") ? "border-blue-300 dark:border-blue-700" : "border-border"
                            } focus:border-blue-500`}
                          />
                          <Pencil className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                        {isFieldModified("expectedDate") && (
                          <p className="text-xs text-muted-foreground">Original: {getOriginalValue("expectedDate")}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {editedObligation.paymentType === "conditional" && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="condition">Condition Description *</Label>
                        <div className="group relative">
                          <Input
                            id="condition"
                            value={editedObligation.condition || ""}
                            onChange={(e) => handleFieldChange("condition", e.target.value)}
                            placeholder="e.g., Team reaches playoffs"
                            className={`pr-8 border-2 bg-background transition-colors ${
                              isFieldModified("condition") ? "border-blue-300 dark:border-blue-700" : "border-border"
                            } focus:border-blue-500`}
                          />
                          <Pencil className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                        {isFieldModified("condition") && (
                          <p className="text-xs text-muted-foreground">Original: {getOriginalValue("condition")}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="triggerEvent">Trigger Event</Label>
                        <div className="group relative">
                          <Input
                            id="triggerEvent"
                            value={editedObligation.triggerEvent || ""}
                            onChange={(e) => handleFieldChange("triggerEvent", e.target.value)}
                            placeholder="e.g., Playoff qualification announcement"
                            className={`pr-8 border-2 bg-background transition-colors ${
                              isFieldModified("triggerEvent") ? "border-blue-300 dark:border-blue-700" : "border-border"
                            } focus:border-blue-500`}
                          />
                          <Pencil className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                        {isFieldModified("triggerEvent") && (
                          <p className="text-xs text-muted-foreground">Original: {getOriginalValue("triggerEvent")}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {editedObligation.validationWarnings && editedObligation.validationWarnings.length > 0 && (
                  <div
                    className={`rounded-lg border p-4 ${
                      editedObligation.validationWarnings.some((w) => w.includes("past"))
                        ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950"
                        : "border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        className={`h-5 w-5 flex-shrink-0 ${
                          editedObligation.validationWarnings.some((w) => w.includes("past"))
                            ? "text-red-600 dark:text-red-400"
                            : "text-orange-600 dark:text-orange-400"
                        }`}
                      />
                      <div className="flex-1">
                        <h4
                          className={`text-sm font-semibold ${
                            editedObligation.validationWarnings.some((w) => w.includes("past"))
                              ? "text-red-900 dark:text-red-100"
                              : "text-orange-900 dark:text-orange-100"
                          }`}
                        >
                          Validation Warnings
                        </h4>
                        <ul
                          className={`mt-2 space-y-1 text-sm ${
                            editedObligation.validationWarnings.some((w) => w.includes("past"))
                              ? "text-red-800 dark:text-red-200"
                              : "text-orange-800 dark:text-orange-200"
                          }`}
                        >
                          {editedObligation.validationWarnings.map((warning, idx) => (
                            <li key={idx}>• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {editedObligation.contractReference ? (
                  <div className="space-y-3 rounded-lg bg-muted/50 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold">Contract Language</h3>
                      <Badge variant="outline" className="text-xs">
                        {editedObligation.contractReference.section}, Page {editedObligation.contractReference.page}
                      </Badge>
                    </div>
                    <div className="rounded-lg border-2 border-primary/20 bg-background p-4">
                      <p className="text-sm leading-relaxed">{editedObligation.contractReference.excerpt}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <FileText className="mr-2 h-3 w-3" />
                      View in Full Contract
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed bg-muted/30 p-4">
                    <p className="text-sm text-muted-foreground">No contract reference - manually added obligation</p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notes">Document Your Decision</Label>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {(editedObligation.notes || "").length}/500 characters
                      </span>
                      {autoSaveStatus === "saving" && <span className="text-xs text-muted-foreground">Saving...</span>}
                      {autoSaveStatus === "saved" && <span className="text-xs text-green-600">Saved</span>}
                    </div>
                  </div>
                  <Textarea
                    ref={textareaRef}
                    id="notes"
                    value={editedObligation.notes || ""}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) {
                        handleFieldChange("notes", e.target.value)
                      }
                    }}
                    placeholder="Add clarification or special instructions..."
                    rows={3}
                    className="resize-none overflow-hidden border-2 bg-background focus:border-blue-500"
                  />
                </div>

                {/* Version History */}
                {editedObligation.versions && editedObligation.versions.length > 0 && (
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowVersionHistory(!showVersionHistory)}
                      className="flex w-full items-center justify-between text-sm font-semibold"
                    >
                      <span>Version History ({editedObligation.versions.length})</span>
                      {showVersionHistory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>

                    <AnimatePresence>
                      {showVersionHistory && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          {editedObligation.versions.map((version, idx) => (
                            <div key={idx} className="rounded-lg border bg-muted/30 p-3">
                              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                                <span>{version.user}</span>
                                <span>{new Date(version.timestamp).toLocaleString()}</span>
                              </div>
                              <div className="space-y-1 text-sm">
                                {Object.entries(version.changes).map(([field, change]) => (
                                  <div key={field} className="flex items-start gap-2">
                                    <span className="font-medium">{field}:</span>
                                    <span className="text-red-600 line-through">{change.from}</span>
                                    <span>→</span>
                                    <span className="text-green-600">{change.to}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Deleted Obligation Info */}
                {editedObligation.status === "deleted" && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
                    <div className="flex items-start gap-3">
                      <Trash2 className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-red-900 dark:text-red-100">Deleted Obligation</h4>
                        <p className="mt-1 text-sm text-red-800 dark:text-red-200">
                          Deleted by {editedObligation.deletedBy} on{" "}
                          {editedObligation.deletedDate && new Date(editedObligation.deletedDate).toLocaleString()}
                        </p>
                        {editedObligation.deletionReason && (
                          <p className="mt-2 text-sm text-red-800 dark:text-red-200">
                            Reason: {editedObligation.deletionReason}
                          </p>
                        )}
                        <Button onClick={handleRestore} variant="outline" size="sm" className="mt-3 bg-transparent">
                          <RotateCcw className="mr-2 h-3 w-3" />
                          Restore Obligation
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons - Only keep Reset, Save, and Duplicate in the card */}
                {editedObligation.status !== "deleted" && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button onClick={handleSaveChanges} variant="outline" disabled={!hasUnsavedChanges}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Save but keep in draft (Cmd+S)</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <div className="ml-auto flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button onClick={handleReset} variant="ghost" size="sm">
                              <Undo2 className="mr-2 h-4 w-4" />
                              Reset to Original
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Undo all changes</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button onClick={handleDuplicate} variant="ghost" size="sm">
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate Obligation
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy for similar payment</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      ),
      modal: (
        <>
          {/* Confirm Modal */}
          <Dialog
            open={confirmModal.open && confirmModal.type === "confirm"}
            onOpenChange={(open) => setConfirmModal({ ...confirmModal, open })}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Obligation</DialogTitle>
                <DialogDescription>Mark this obligation as confirmed and move to the next item.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="confirmNotes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="confirmNotes"
                    value={confirmModal.notes}
                    onChange={(e) => setConfirmModal({ ...confirmModal, notes: e.target.value })}
                    placeholder="Add any final notes..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmModal({ ...confirmModal, open: false })}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmSubmit} className="bg-green-600 hover:bg-green-700">
                  Confirm & Continue
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Modal */}
          <Dialog
            open={confirmModal.open && confirmModal.type === "delete"}
            onOpenChange={(open) => setConfirmModal({ ...confirmModal, open })}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Obligation</DialogTitle>
                <DialogDescription>
                  This obligation will be soft-deleted and can be restored later. Please provide a reason.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="deletionReason">Deletion Reason *</Label>
                  <Textarea
                    id="deletionReason"
                    value={confirmModal.deletionReason}
                    onChange={(e) => setConfirmModal({ ...confirmModal, deletionReason: e.target.value })}
                    placeholder="Why is this obligation being deleted?"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmModal({ ...confirmModal, open: false })}>
                  Cancel
                </Button>
                <Button onClick={handleDeleteSubmit} variant="destructive" disabled={!confirmModal.deletionReason}>
                  Delete Obligation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Reset Modal */}
          <Dialog
            open={confirmModal.open && confirmModal.type === "reset"}
            onOpenChange={(open) => setConfirmModal({ ...confirmModal, open: false })}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reset to Original</DialogTitle>
                <DialogDescription>
                  All changes will be discarded and the obligation will be reset to its original extracted values.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmModal({ ...confirmModal, open: false })}>
                  Cancel
                </Button>
                <Button onClick={handleResetSubmit} variant="destructive">
                  Reset Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ),
      actionHandlers: {
        onBack: handleBack,
        onConfirm: handleConfirm,
        onDelete: handleDelete,
        canConfirm: editedObligation.status !== "deleted",
        canDelete: editedObligation.status !== "deleted",
      },
    }
  }

  const chartData = [
    { month: "Jan", amount: 50000 },
    { month: "Feb", amount: 65000 },
    { month: "Mar", amount: 90000 },
    { month: "Apr", amount: 90000 },
    { month: "May", amount: 115000 },
    { month: "Jun", amount: 115000 },
  ]

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Obligation Schedule</CardTitle>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
              {confirmedCount} Confirmed
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {modifiedCount} Modified
            </Badge>
            <Badge variant="outline">{pendingCount} Pending</Badge>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            {confirmedCount + modifiedCount} of {obligations.filter((o) => o.status !== "deleted").length} reviewed
          </p>

          <div className="mt-4 flex gap-2">
            <Button onClick={handleConfirmAll} variant="outline" size="sm" disabled={pendingCount === 0}>
              Confirm All Remaining
            </Button>
            <Button onClick={handleExport} variant="outline" size="sm">
              Export Schedule
            </Button>
            <Button onClick={() => setShowDeletedItems(!showDeletedItems)} variant="ghost" size="sm">
              {showDeletedItems ? "Hide" : "View"} Deleted
            </Button>
          </div>

          {/* Hero Metrics */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-primary/5 p-4">
              <div className="text-sm text-muted-foreground">Total Value</div>
              <div className="mt-1 text-2xl font-bold text-foreground">${totalObligations.toLocaleString()}</div>
            </div>
            <div className="rounded-lg bg-secondary/5 p-4">
              <div className="text-sm text-muted-foreground">Payments</div>
              <div className="mt-1 text-2xl font-bold text-foreground">
                {obligations.filter((o) => o.status !== "deleted").length}
              </div>
            </div>
            <div className="rounded-lg bg-success/5 p-4">
              <div className="text-sm text-muted-foreground">Timeline</div>
              <div className="mt-1 text-2xl font-bold text-foreground">6 months</div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Payment Timeline Chart */}
          <div className="mb-6 rounded-lg border border-border bg-muted/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h4 className="font-semibold text-card-foreground">Cumulative Payment Schedule</h4>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Amount"]}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-card-foreground">Payment Obligations</h4>
            {visibleObligations.map((obligation, index) => {
              const TriggerIcon = paymentTypeIcons[obligation.paymentType]
              const statusLabel =
                obligation.status === "confirmed" || obligation.status === "modified" ? "Reviewed" : "Unreviewed"

              return (
                <motion.div
                  key={obligation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleObligationClick(obligation.id)}
                  className={`cursor-pointer rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 ${
                    obligation.status === "deleted" ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant={statusLabel === "Reviewed" ? "default" : "outline"} className="text-xs">
                          {statusLabel}
                        </Badge>
                        <Badge
                          variant={
                            obligation.paymentType === "one-time"
                              ? "default"
                              : obligation.paymentType === "milestone"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {obligation.paymentType === "one-time" && "Date-Based"}
                          {obligation.paymentType === "milestone" && "Milestone"}
                          {obligation.paymentType === "recurring" && "Recurring"}
                          {obligation.paymentType === "conditional" && "Conditional"}
                        </Badge>
                      </div>

                      <div className="mb-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-foreground">
                          ${obligation.amount.toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground">to {obligation.recipient}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TriggerIcon className="h-4 w-4" />
                        <span>
                          {/* Use getObligationTitle for title */}
                          {getObligationTitle(obligation)}
                        </span>
                        {(obligation.date || obligation.expectedDate) && (
                          <>
                            <span>•</span>
                            <span>{obligation.date || obligation.expectedDate}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <Button onClick={handleAddMissing} variant="outline" className="mt-4 w-full bg-transparent">
            <Plus className="mr-2 h-4 w-4" />
            Add Missing Obligation
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
