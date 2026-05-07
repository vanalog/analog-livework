"use client"

import { useState } from "react"
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
import {
  ArrowLeft,
  CheckCircle2,
  Edit2,
  Trash2,
  Plus,
  DollarSign,
  Calendar,
  Trophy,
  Zap,
  Clock,
  FileText,
  Sparkles,
  Play,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ContractObligation {
  id: string
  amount: number
  recipient: string
  type: "one-time" | "recurring" | "milestone" | "conditional"
  status: "extracted" | "confirmed" | "edited" | "queued"
  dueDate?: string
  description: string
  startDate?: string
  endDate?: string
  frequency?: string
  milestone?: string
  condition?: string
  contractReference?: {
    section: string
    page: number
    excerpt: string
  }
}

interface ActivationContract {
  id: string
  title: string
  athlete: string
  athleteId: string
  source: "university" | "sponsor"
  sourceName: string
  activationStatus: "extracting" | "review-obligations" | "ready-to-activate" | "active" | "completed"
  totalValue: number
  startDate: string
  endDate: string
  obligations: ContractObligation[]
  lastActivity: string
  lastActivityDate: string
  sport?: string
  signedDate?: string
}

const obligationTypeIcons = {
  "one-time": Calendar,
  recurring: Clock,
  milestone: Trophy,
  conditional: Zap,
}

const obligationTypeLabels = {
  "one-time": "One-Time Payment",
  recurring: "Recurring Payment",
  milestone: "Milestone-Based",
  conditional: "Conditional Payment",
}

const obligationStatusConfig = {
  extracted: {
    label: "Needs Review",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  },
  confirmed: { label: "Confirmed", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  edited: { label: "Edited", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  queued: { label: "Queued", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300" },
}

interface ActivationDetailProps {
  contract: ActivationContract
  onBack: () => void
}

export function ActivationDetail({ contract, onBack }: ActivationDetailProps) {
  const [obligations, setObligations] = useState<ContractObligation[]>(contract.obligations)
  const [editingObligation, setEditingObligation] = useState<ContractObligation | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [activateConfirmOpen, setActivateConfirmOpen] = useState(false)
  const [obligationToDelete, setObligationToDelete] = useState<string | null>(null)

  const reviewedCount = obligations.filter((o) => o.status === "confirmed" || o.status === "edited").length
  const totalObligationsValue = obligations.reduce((sum, o) => sum + o.amount, 0)
  const reviewProgress = (reviewedCount / obligations.length) * 100

  const canActivate = contract.activationStatus === "ready-to-activate" || reviewedCount === obligations.length

  const handleEditObligation = (obligation: ContractObligation) => {
    setEditingObligation({ ...obligation })
    setIsEditing(true)
  }

  const handleSaveObligation = () => {
    if (editingObligation) {
      setObligations(
        obligations.map((o) =>
          o.id === editingObligation.id ? { ...editingObligation, status: "edited" as const } : o,
        ),
      )
      setIsEditing(false)
      setEditingObligation(null)
    }
  }

  const handleConfirmObligation = (obligationId: string) => {
    setObligations(obligations.map((o) => (o.id === obligationId ? { ...o, status: "confirmed" as const } : o)))
  }

  const handleDeleteObligation = (obligationId: string) => {
    setObligationToDelete(obligationId)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = () => {
    if (obligationToDelete) {
      setObligations(obligations.filter((o) => o.id !== obligationToDelete))
      setDeleteConfirmOpen(false)
      setObligationToDelete(null)
    }
  }

  const handleAddObligation = () => {
    const newObligation: ContractObligation = {
      id: `manual-${Date.now()}`,
      amount: 0,
      recipient: contract.athlete,
      type: "one-time",
      status: "edited",
      description: "",
    }
    setEditingObligation(newObligation)
    setIsAdding(true)
    setIsEditing(true)
  }

  const handleSaveNewObligation = () => {
    if (editingObligation) {
      setObligations([...obligations, editingObligation])
      setIsEditing(false)
      setIsAdding(false)
      setEditingObligation(null)
    }
  }

  const handleConfirmAll = () => {
    setObligations(obligations.map((o) => (o.status === "extracted" ? { ...o, status: "confirmed" as const } : o)))
  }

  const handleActivateContract = () => {
    setActivateConfirmOpen(true)
  }

  const confirmActivation = () => {
    // In real implementation, this would trigger the activation flow
    console.log("Activating contract and queuing obligations for payment workflow")
    setActivateConfirmOpen(false)
    // Navigate to activated state or back to list
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{contract.title}</h1>
            <div className="mt-1 flex items-center gap-2 text-muted-foreground">
              <span>{contract.athlete}</span>
              <span>•</span>
              <span>{contract.sourceName}</span>
              {contract.sport && (
                <>
                  <span>•</span>
                  <span>{contract.sport}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleConfirmAll} disabled={reviewedCount === obligations.length}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Confirm All
          </Button>
          <Button onClick={handleActivateContract} disabled={!canActivate} className="bg-green-600 hover:bg-green-700">
            <Play className="mr-2 h-4 w-4" />
            Activate Contract
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card
        className={
          contract.activationStatus === "review-obligations"
            ? "border-yellow-300 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950"
            : ""
        }
      >
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  {contract.activationStatus === "extracting" && "Extracting Obligations..."}
                  {contract.activationStatus === "review-obligations" && "Review Extracted Obligations"}
                  {contract.activationStatus === "ready-to-activate" && "Ready to Activate"}
                  {contract.activationStatus === "active" && "Contract Active"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {contract.activationStatus === "extracting" &&
                    "AI is analyzing the contract and extracting payment obligations"}
                  {contract.activationStatus === "review-obligations" &&
                    "Review and confirm the obligations extracted from the signed contract"}
                  {contract.activationStatus === "ready-to-activate" &&
                    "All obligations confirmed - ready to activate and queue payments"}
                  {contract.activationStatus === "active" &&
                    "Contract is active and obligations are queued for payment workflow"}
                </p>
              </div>
              <Badge variant={contract.activationStatus === "active" ? "default" : "secondary"}>
                {contract.activationStatus}
              </Badge>
            </div>

            {/* Progress Bar */}
            {contract.activationStatus === "review-obligations" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Review Progress</span>
                  <span>
                    {reviewedCount} of {obligations.length} reviewed
                  </span>
                </div>
                <Progress value={reviewProgress} className="h-2" />
              </div>
            )}

            {/* Contract Details */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>Total Value: ${contract.totalValue.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>Obligations: ${totalObligationsValue.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {contract.startDate} - {contract.endDate}
                </span>
              </div>
              {contract.signedDate && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Signed {contract.signedDate}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Obligations List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Obligations ({obligations.length})</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Review and confirm obligations extracted from the contract
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleAddObligation}>
              <Plus className="mr-2 h-4 w-4" />
              Add Obligation
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {obligations.map((obligation) => {
            const TypeIcon = obligationTypeIcons[obligation.type]

            return (
              <Card key={obligation.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <TypeIcon className="h-5 w-5 text-primary" />
                    </div>

                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">
                              {obligation.description || obligationTypeLabels[obligation.type]}
                            </h4>
                            <Badge className={obligationStatusConfig[obligation.status].color}>
                              {obligationStatusConfig[obligation.status].label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            ${obligation.amount.toLocaleString()} to {obligation.recipient}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {obligation.status === "extracted" && (
                            <Button size="sm" variant="outline" onClick={() => handleConfirmObligation(obligation.id)}>
                              <CheckCircle2 className="mr-2 h-3 w-3" />
                              Confirm
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => handleEditObligation(obligation)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteObligation(obligation.id)}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        {obligation.type === "one-time" && obligation.dueDate && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Due: {obligation.dueDate}</span>
                          </div>
                        )}
                        {obligation.type === "recurring" && (
                          <>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>
                                {obligation.startDate} to {obligation.endDate}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{obligation.frequency}</span>
                            </div>
                          </>
                        )}
                        {obligation.type === "milestone" && obligation.milestone && (
                          <div className="flex items-center gap-1.5">
                            <Trophy className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{obligation.milestone}</span>
                          </div>
                        )}
                        {obligation.type === "conditional" && obligation.condition && (
                          <div className="flex items-center gap-1.5">
                            <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{obligation.condition}</span>
                          </div>
                        )}
                      </div>

                      {/* Contract Reference */}
                      {obligation.contractReference && (
                        <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <FileText className="h-3 w-3" />
                            <span>
                              {obligation.contractReference.section}, Page {obligation.contractReference.page}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed text-muted-foreground">
                            "{obligation.contractReference.excerpt}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {obligations.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
              <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No Obligations Extracted Yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The AI is analyzing the contract to extract payment obligations
              </p>
              <Button variant="outline" onClick={handleAddObligation}>
                <Plus className="mr-2 h-4 w-4" />
                Add Manual Obligation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit/Add Obligation Dialog */}
      <Dialog
        open={isEditing}
        onOpenChange={(open) => {
          setIsEditing(open)
          if (!open) {
            setEditingObligation(null)
            setIsAdding(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isAdding ? "Add New Obligation" : "Edit Obligation"}</DialogTitle>
            <DialogDescription>
              {isAdding
                ? "Add a payment obligation that was not automatically extracted"
                : "Make changes to the extracted obligation details"}
            </DialogDescription>
          </DialogHeader>
          {editingObligation && (
            <div className="space-y-4 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={editingObligation.amount}
                    onChange={(e) => setEditingObligation({ ...editingObligation, amount: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient *</Label>
                  <Input
                    id="recipient"
                    value={editingObligation.recipient}
                    onChange={(e) => setEditingObligation({ ...editingObligation, recipient: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Payment Type *</Label>
                <Select
                  value={editingObligation.type}
                  onValueChange={(value) => setEditingObligation({ ...editingObligation, type: value as any })}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">One-Time Payment</SelectItem>
                    <SelectItem value="recurring">Recurring Payment</SelectItem>
                    <SelectItem value="milestone">Milestone-Based</SelectItem>
                    <SelectItem value="conditional">Conditional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  value={editingObligation.description}
                  onChange={(e) => setEditingObligation({ ...editingObligation, description: e.target.value })}
                  placeholder="e.g., Signing bonus, Monthly stipend"
                />
              </div>

              {/* Type-specific fields */}
              {editingObligation.type === "one-time" && (
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={editingObligation.dueDate || ""}
                    onChange={(e) => setEditingObligation({ ...editingObligation, dueDate: e.target.value })}
                  />
                </div>
              )}

              {editingObligation.type === "recurring" && (
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={editingObligation.startDate || ""}
                      onChange={(e) => setEditingObligation({ ...editingObligation, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={editingObligation.endDate || ""}
                      onChange={(e) => setEditingObligation({ ...editingObligation, endDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select
                      value={editingObligation.frequency || ""}
                      onValueChange={(value) => setEditingObligation({ ...editingObligation, frequency: value })}
                    >
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {editingObligation.type === "milestone" && (
                <div className="space-y-2">
                  <Label htmlFor="milestone">Milestone Description</Label>
                  <Textarea
                    id="milestone"
                    value={editingObligation.milestone || ""}
                    onChange={(e) => setEditingObligation({ ...editingObligation, milestone: e.target.value })}
                    placeholder="e.g., Complete 10 social media posts"
                    rows={2}
                  />
                </div>
              )}

              {editingObligation.type === "conditional" && (
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition Description</Label>
                  <Textarea
                    id="condition"
                    value={editingObligation.condition || ""}
                    onChange={(e) => setEditingObligation({ ...editingObligation, condition: e.target.value })}
                    placeholder="e.g., Team reaches playoffs"
                    rows={2}
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false)
                setEditingObligation(null)
                setIsAdding(false)
              }}
            >
              Cancel
            </Button>
            <Button onClick={isAdding ? handleSaveNewObligation : handleSaveObligation}>
              {isAdding ? "Add Obligation" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Obligation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this obligation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activate Confirmation Dialog */}
      <Dialog open={activateConfirmOpen} onOpenChange={setActivateConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activate Contract</DialogTitle>
            <DialogDescription>
              This will activate the contract and queue all {obligations.length} obligations for the payment workflow.
              Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Obligations</span>
              <span className="font-semibold">{obligations.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Value</span>
              <span className="font-semibold">${totalObligationsValue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Reviewed</span>
              <span className="font-semibold">
                {reviewedCount} of {obligations.length}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActivateConfirmOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={confirmActivation}>
              Activate Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
