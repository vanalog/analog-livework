"use client"

// Sponsor Detail Component
import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ArrowLeft,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Info,
  Download,
  CheckCircle,
  Clock,
  Eye,
  Upload,
  User,
  Search,
  ArrowUpRight,
  FileText,
  ExternalLink,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

// Contract workflow imports
import { ContractWorkflowProvider, useContractWorkflow } from "@/lib/contract-workflow-context"
import { ContractWorkflowUploadModal } from "./contracts2/contract-workflow-upload-modal"
import { ProcessingStage } from "./contracts2/processing-stage"
import { ReviewStage } from "./contracts2/review-stage"
import { ActivationStage } from "./contracts2/activation-stage"

// Build contract imports
import { BuildContractProvider, useBuildContract } from "@/lib/build-contract-context"
import { BuildDefineStage } from "./contracts2/build-define-stage"
import { BuildGenerateStage } from "./contracts2/build-generate-stage"
import { BuildReviewStage } from "./contracts2/build-review-stage"
import { BuildExportStage } from "./contracts2/build-export-stage"

interface SponsorDetailProps {
  sponsorId: string
}

// Mock sponsor data
const mockSponsorData: Record<string, any> = {
  s1: {
    name: "Nike Basketball Division",
    type: "For-Profit Business",
    status: "Active",
    contactName: "Sarah Johnson",
    contactTitle: "NIL Partnerships Manager",
    email: "sarah.johnson@nike.com",
    phone: "(503) 555-0123",
    website: "https://nike.com",
    address: {
      line1: "One Bowerman Drive",
      city: "Beaverton",
      state: "OR",
      zip: "97005",
    },
    // Pipeline stats
    committed: 200000,
    allocated: 125000,
    available: 75000,
    totalPaid: 45000,
    nextPaymentDate: "Apr 15, 2026",
    nextPaymentAmount: 15000,
    // Contracts
    contracts: [
      {
        id: "NIL-2025-DT-001",
        athleteId: "osu-001",
        athleteName: "Darius Thornton",
        sport: "Football",
        season: "2025-26",
        contractValue: 45000,
        obligations: "5 posts · 2 appearances",
        obligationProgress: "3/7 complete",
        progressPercent: 43,
        paymentTrigger: "Mixed",
        signatureStatus: "Signed",
        status: "Active",
        daysActive: 32,
      },
      {
        id: "NIL-2025-JP-002",
        athleteId: "osu-003",
        athleteName: "Jaylen Porter",
        sport: "Men's Basketball",
        season: "2025-26",
        contractValue: 35000,
        obligations: "3 posts · 1 event",
        obligationProgress: "1/4 complete",
        progressPercent: 25,
        paymentTrigger: "On Completion",
        signatureStatus: "Signed",
        status: "Active",
        daysActive: 28,
      },
      {
        id: "NIL-2025-MJ-003",
        athleteId: "1",
        athleteName: "Marcus Johnson",
        sport: "Men's Basketball",
        season: "2025-26",
        contractValue: 25000,
        obligations: "4 posts · 2 appearances",
        obligationProgress: "Not started",
        progressPercent: 0,
        paymentTrigger: "Upfront",
        signatureStatus: "Sent",
        status: "Pending",
        daysActive: 5,
      },
      {
        id: "NIL-2024-MC-004",
        athleteId: "osu-002",
        athleteName: "Malik Crawford",
        sport: "Football",
        season: "2024-25",
        contractValue: 20000,
        obligations: "2 posts · 1 appearance",
        obligationProgress: "3/3 complete",
        progressPercent: 100,
        paymentTrigger: "On Completion",
        signatureStatus: "Signed",
        status: "Completed",
        daysActive: 180,
      },
    ],
    // Upcoming payments
    upcomingPayments: [
      { id: "p1", date: "Apr 15, 2026", athleteName: "Darius Thornton", amount: 15000, contractId: "NIL-2025-DT-001", status: "Upcoming" },
      { id: "p2", date: "May 1, 2026", athleteName: "Jaylen Porter", amount: 35000, contractId: "NIL-2025-JP-002", status: "Upcoming" },
      { id: "p3", date: "Mar 20, 2026", athleteName: "Marcus Johnson", amount: 25000, contractId: "NIL-2025-MJ-003", status: "Scheduled" },
      { id: "p4", date: "Mar 5, 2026", athleteName: "Malik Crawford", amount: 10000, contractId: "NIL-2024-MC-004", status: "Processing" },
    ],
    // Deliverables
    upcomingDeliverables: [
      { id: "d1", type: "Social Media Post", athleteName: "Darius Thornton", progress: "1 of 5", deadline: "Mar 30, 2026", contractId: "NIL-2025-DT-001", status: "Pending", notes: "" },
      { id: "d2", type: "In-Person Appearance", athleteName: "Darius Thornton", progress: "0 of 2", deadline: "Apr 5, 2026", contractId: "NIL-2025-DT-001", status: "Pending", notes: "" },
      { id: "d3", type: "In-Person Appearance", athleteName: "Jaylen Porter", progress: "0 of 1", deadline: "Mar 1, 2026", contractId: "NIL-2025-JP-002", status: "Overdue", notes: "" },
      { id: "d4", type: "Social Media Post", athleteName: "Jaylen Porter", progress: "0 of 3", deadline: "Apr 10, 2026", contractId: "NIL-2025-JP-002", status: "Pending", notes: "" },
      { id: "d5", type: "Social Media Post", athleteName: "Marcus Johnson", progress: "0 of 4", deadline: "Apr 1, 2026", contractId: "NIL-2025-MJ-003", status: "Pending", notes: "" },
      { id: "d6", type: "In-Person Appearance", athleteName: "Marcus Johnson", progress: "0 of 2", deadline: "Apr 15, 2026", contractId: "NIL-2025-MJ-003", status: "Pending", notes: "" },
    ],
    completedDeliverables: [
      { id: "c1", type: "Social Media Post", athleteName: "Darius Thornton", completed: "Mar 15, 2026", contractId: "NIL-2025-DT-001", verifiedBy: "Brand Team", status: "Complete" },
      { id: "c2", type: "Social Media Post", athleteName: "Jaylen Porter", completed: "Mar 10, 2026", contractId: "NIL-2025-JP-002", verifiedBy: "Analog Admin", status: "Complete" },
      { id: "c3", type: "Social Media Post", athleteName: "Malik Crawford", completed: "Feb 15, 2026", contractId: "NIL-2024-MC-004", verifiedBy: "Brand Team", status: "Complete" },
      { id: "c4", type: "In-Person Appearance", athleteName: "Malik Crawford", completed: "Feb 28, 2026", contractId: "NIL-2024-MC-004", verifiedBy: "Analog Admin", status: "Complete" },
    ],
    // Documents
    contractDocuments: [
      { id: "doc1", name: "Nike NIL Agreement — Darius Thornton", type: "Contract", date: "Jan 16, 2026", relatedContract: "NIL-2025-DT-001", size: "2.4 MB" },
      { id: "doc2", name: "Nike NIL Agreement — Jaylen Porter", type: "Contract", date: "Jan 20, 2026", relatedContract: "NIL-2025-JP-002", size: "1.8 MB" },
      { id: "doc3", name: "Amendment 1 — Payment Schedule Revision", type: "Amendment", date: "Feb 1, 2026", relatedContract: "NIL-2025-DT-001", size: "840 KB" },
    ],
    sponsorDocuments: [
      { id: "sdoc1", name: "W-9 Tax Form", type: "Tax", date: "Dec 10, 2025", source: "On File", size: "95 KB" },
      { id: "sdoc2", name: "Sponsorship Agreement — Master", type: "Agreement", date: "Nov 15, 2025", source: "Nike Legal", size: "1.2 MB" },
    ],
    // Historical payments
    historicalPayments: [
      { id: "hp1", date: "Feb 1, 2026", athleteName: "Darius Thornton", amount: 14000, contractId: "NIL-2025-DT-001", type: "Scheduled Payment", status: "Paid" },
      { id: "hp2", date: "Jan 16, 2026", athleteName: "Darius Thornton", amount: 1500, contractId: "NIL-2025-DT-001", type: "Signing Bonus", status: "Paid" },
      { id: "hp3", date: "Jan 5, 2026", athleteName: "Malik Crawford", amount: 10000, contractId: "NIL-2024-MC-004", type: "Final Payment", status: "Paid" },
    ],
    // Recommended athletes (for Athletes tab recommendations section)
    recommendedAthletes: [
      { id: "osu-005", name: "Brandon Hayes", sport: "Football", reach: 425000, engagement: 4.8, existingContract: false },
      { id: "osu-006", name: "Tyler Washington", sport: "Men's Basketball", reach: 312000, engagement: 5.2, existingContract: false },
      { id: "osu-007", name: "Chris Martinez", sport: "Football", reach: 185000, engagement: 5.8, existingContract: false },
      { id: "2", name: "Sarah Williams", sport: "Men's Basketball", reach: 185000, engagement: 5.8, existingContract: false },
    ],
  },
  s2: {
    name: "Local Sports Medicine Clinic",
    type: "For-Profit Business",
    status: "Active",
    contactName: "Dr. Michael Chen",
    contactTitle: "Owner",
    email: "mchen@sportsmedicine.com",
    phone: "(555) 234-5678",
    website: "https://sportsmedicine.com",
    address: {
      line1: "456 Health Park Dr",
      city: "Columbus",
      state: "OH",
      zip: "43201",
    },
    committed: 50000,
    allocated: 25000,
    available: 25000,
    totalPaid: 0,
    nextPaymentDate: "Jun 15, 2026",
    nextPaymentAmount: 25000,
    contracts: [
      {
        id: "NIL-2025-SW-001",
        athleteId: "2",
        athleteName: "Sarah Williams",
        sport: "Men's Basketball",
        season: "2025-26",
        contractValue: 25000,
        obligations: "2 posts · 1 event",
        obligationProgress: "0/3 complete",
        progressPercent: 0,
        paymentTrigger: "On Completion",
        signatureStatus: "Signed",
        status: "Active",
        daysActive: 14,
      },
    ],
    upcomingPayments: [
      { id: "p1", date: "Jun 15, 2026", athleteName: "Sarah Williams", amount: 25000, contractId: "NIL-2025-SW-001", status: "Scheduled" },
    ],
    upcomingDeliverables: [
      { id: "d1", type: "Social Media Post", athleteName: "Sarah Williams", progress: "0 of 2", deadline: "Apr 1, 2026", contractId: "NIL-2025-SW-001", status: "Pending", notes: "" },
      { id: "d2", type: "In-Person Appearance", athleteName: "Sarah Williams", progress: "0 of 1", deadline: "Jun 1, 2026", contractId: "NIL-2025-SW-001", status: "Pending", notes: "" },
    ],
    completedDeliverables: [],
    contractDocuments: [
      { id: "doc1", name: "NIL Agreement — Sarah Williams", type: "Contract", date: "Feb 1, 2026", relatedContract: "NIL-2025-SW-001", size: "1.5 MB" },
    ],
    sponsorDocuments: [
      { id: "sdoc1", name: "W-9 Tax Form", type: "Tax", date: "Jan 15, 2026", source: "On File", size: "92 KB" },
    ],
    historicalPayments: [],
    recommendedAthletes: [
      { id: "osu-008", name: "Emma Rodriguez", sport: "Soccer", reach: 145000, engagement: 4.2, existingContract: false },
    ],
  },
}

// Format currency
const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`
  }
  return `$${value.toLocaleString()}`
}

const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`
  }
  return value.toLocaleString()
}

// Status badge styling
const getStatusBadgeClassName = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 border-green-200"
    case "Pending":
    case "Pending Signature":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Completed":
      return "bg-blue-100 text-blue-800 border-blue-200"
    default:
      return ""
  }
}

const getDeliverableStatusBadgeClassName = (status: string) => {
  switch (status) {
    case "Complete":
      return "bg-green-100 text-green-800 border-green-200"
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Overdue":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return ""
  }
}

const getPaymentStatusBadgeClassName = (status: string) => {
  switch (status) {
    case "Upcoming":
    case "Scheduled":
      return "bg-gray-100 text-gray-800 border-gray-200"
    case "Processing":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Overdue":
      return "bg-red-100 text-red-800 border-red-200"
    case "Paid":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return ""
  }
}

const getDocTypeBadgeClassName = (type: string) => {
  switch (type) {
    case "Contract":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Amendment":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Tax":
      return "bg-gray-100 text-gray-800 border-gray-200"
    case "Agreement":
      return "bg-purple-100 text-purple-800 border-purple-200"
    default:
      return ""
  }
}

export function SponsorDetail({ sponsorId }: SponsorDetailProps) {
  return (
    <ContractWorkflowProvider>
      <BuildContractProvider>
        <SponsorDetailInner sponsorId={sponsorId} />
      </BuildContractProvider>
    </ContractWorkflowProvider>
  )
}

function SponsorDetailInner({ sponsorId }: SponsorDetailProps) {
  const router = useRouter()
  const sponsor = mockSponsorData[sponsorId] || mockSponsorData.s1

  const [activeTab, setActiveTab] = useState<"Overview" | "Contracts" | "Athletes" | "Deliverables" | "Payments" | "Documents">("Overview")
  const [paymentsView, setPaymentsView] = useState<"upcoming" | "historical">("upcoming")
  const [showEditContactModal, setShowEditContactModal] = useState(false)
  const [contractStatusFilter, setContractStatusFilter] = useState("all")
  const [contractSeasonFilter, setContractSeasonFilter] = useState("all")
  const [deliverableContractFilter, setDeliverableContractFilter] = useState("all")
  const [deliverableStatusFilter, setDeliverableStatusFilter] = useState("all")

  // Contract upload workflow state
  const [contractWorkflowUploadOpen, setContractWorkflowUploadOpen] = useState(false)
  const [contractWorkflowActive, setContractWorkflowActive] = useState(false)
  const workflowCtx = useContractWorkflow()
  
  // Build Contract flow state
  const [buildContractActive, setBuildContractActive] = useState(false)
  const buildCtx = useBuildContract()
  
  const handleBuildContractStart = () => {
    // Initialize build contract form with sponsor data (counterparty pre-filled)
    buildCtx.setFormData({
      contractType: "nil-sponsorship",
      counterpartyId: sponsorId,
      counterpartyName: sponsor.name,
    })
    setBuildContractActive(true)
    buildCtx.setStage("define")
  }
  
  const handleBuildContractComplete = () => {
    setBuildContractActive(false)
    buildCtx.resetBuildWorkflow()
  }
  
  const handleBuildContractCancel = () => {
    setBuildContractActive(false)
    buildCtx.resetBuildWorkflow()
  }

  const handleWorkflowUploadComplete = () => {
    setContractWorkflowUploadOpen(false)
    setContractWorkflowActive(true)
    workflowCtx.setStage("processing")
  }

  const handleWorkflowComplete = () => {
    setContractWorkflowActive(false)
    workflowCtx.resetWorkflow()
  }

  const handleWorkflowCancel = () => {
    setContractWorkflowActive(false)
    workflowCtx.resetWorkflow()
  }

  // Filter contracts
  const filteredContracts = sponsor.contracts.filter((c: any) => {
    const matchesStatus = contractStatusFilter === "all" || c.status.toLowerCase() === contractStatusFilter.toLowerCase()
    const matchesSeason = contractSeasonFilter === "all" || c.season === contractSeasonFilter
    return matchesStatus && matchesSeason
  })

  // Filter deliverables
  const filteredUpcomingDeliverables = sponsor.upcomingDeliverables.filter((d: any) => {
    const matchesContract = deliverableContractFilter === "all" || d.contractId === deliverableContractFilter
    const matchesStatus = deliverableStatusFilter === "all" || d.status.toLowerCase() === deliverableStatusFilter.toLowerCase()
    return matchesContract && matchesStatus
  })

  // Show upload workflow stages when active
  if (contractWorkflowActive) {
    if (workflowCtx.stage === "processing") {
      return <ProcessingStage onComplete={() => workflowCtx.setStage("review")} onCancel={handleWorkflowCancel} />
    }
    if (workflowCtx.stage === "review") {
      return <ReviewStage onComplete={() => workflowCtx.setStage("activation")} onCancel={handleWorkflowCancel} />
    }
    if (workflowCtx.stage === "activation") {
      return <ActivationStage onComplete={handleWorkflowComplete} onCancel={handleWorkflowCancel} />
    }
  }

  // Show Build Contract stages when active
  if (buildContractActive) {
    if (buildCtx.state.stage === "define") {
      return <BuildDefineStage onCancel={handleBuildContractCancel} />
    }
    if (buildCtx.state.stage === "generate") {
      return <BuildGenerateStage />
    }
    if (buildCtx.state.stage === "review") {
      return <BuildReviewStage />
    }
    if (buildCtx.state.stage === "export") {
      return <BuildExportStage onComplete={handleBuildContractComplete} onCancel={handleBuildContractCancel} />
    }
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto py-6 space-y-6">
        {/* Contract Workflow Upload Modal */}
        <ContractWorkflowUploadModal
          open={contractWorkflowUploadOpen}
          onOpenChange={setContractWorkflowUploadOpen}
          onUploaded={handleWorkflowUploadComplete}
          athleteName={sponsor.name}
        />

        {/* TOP ROW: Back button and action buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => router.push("/sponsors")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sponsors
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="gap-2 cursor-pointer"
              onClick={handleBuildContractStart}
            >
              <Plus className="w-4 h-4" />
              Build Contract
            </Button>
            <Button
              className="gap-2 cursor-pointer"
              onClick={() => setContractWorkflowUploadOpen(true)}
            >
              <Upload className="w-4 h-4" />
              Upload Contract
            </Button>
          </div>
        </div>

        {/* TWO-COLUMN HEADER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Sponsor Profile (~66%) */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowEditContactModal(true)}
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarFallback className="text-2xl bg-muted">
                      {sponsor.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-bold">{sponsor.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{sponsor.type}</Badge>
                          <Badge variant="outline" className={cn(
                            sponsor.status === "Active" && "bg-green-100 text-green-800 border-green-200"
                          )}>
                            {sponsor.status}
                          </Badge>
                        </div>
                        {/* Contact row */}
                        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            {sponsor.contactName}
                          </span>
                          <span className="text-muted-foreground/50">·</span>
                          {sponsor.website && (
                            <>
                              <a
                                href={sponsor.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-foreground transition-colors"
                              >
                                <Globe className="h-3.5 w-3.5" />
                                {sponsor.website.replace(/^https?:\/\//, "")}
                              </a>
                              <span className="text-muted-foreground/50">·</span>
                            </>
                          )}
                          <span className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" />
                            {sponsor.email}
                          </span>
                          <span className="text-muted-foreground/50">·</span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            {sponsor.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Pipeline Stats Row */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <span className="text-sm text-muted-foreground">Committed</span>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3.5 w-3.5 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-[200px]">Formally pledged. Funded or signed.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <p className="text-xl font-bold">{formatCurrency(sponsor.committed)}</p>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <span className="text-sm text-muted-foreground">Allocated</span>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3.5 w-3.5 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-[200px]">Tied to active athlete contracts.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <p className="text-xl font-bold">{formatCurrency(sponsor.allocated)}</p>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <span className="text-sm text-muted-foreground">Available</span>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3.5 w-3.5 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-[200px]">Committed minus allocated. Ready to deploy.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <p className="text-xl font-bold text-green-600">{formatCurrency(sponsor.available)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Budget Summary + Athlete Recommendations (~33%) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Budget Summary Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Budget Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm font-semibold">{sponsor.name}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Committed</span>
                    <span className="font-mono">${sponsor.committed.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Allocated</span>
                    <span className="font-mono">${sponsor.allocated.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Available</span>
                    <span className="font-mono text-green-600">${sponsor.available.toLocaleString()}</span>
                  </div>
                </div>
                {/* Allocation bar */}
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(sponsor.allocated / sponsor.committed) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {Math.round((sponsor.allocated / sponsor.committed) * 100)}% allocated
                </p>
                <Button variant="link" className="p-0 h-auto gap-1 text-sm" onClick={() => setActiveTab("Contracts")}>
                  View All Contracts
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* TAB BAR */}
        <div className="border-b">
          <nav className="flex gap-6" aria-label="Sponsor detail tabs">
            {(["Overview", "Contracts", "Athletes", "Deliverables", "Payments", "Documents"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* ===== OVERVIEW TAB ===== */}
        {activeTab === "Overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (~65%) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Active Contracts Preview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Active Contracts</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">NIL agreements funded by this sponsor</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="px-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Contract Name</TableHead>
                        <TableHead>Athlete</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Days Active</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sponsor.contracts.slice(0, 3).map((contract: any) => (
                        <TableRow key={contract.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-mono text-sm">{contract.id}</TableCell>
                          <TableCell>{contract.athleteName}</TableCell>
                          <TableCell className="font-mono">${contract.contractValue.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusBadgeClassName(contract.status)}>
                              {contract.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{contract.daysActive}</TableCell>
                        </TableRow>
                      ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="px-6 py-4 border-t">
                    <Button variant="link" className="p-0 h-auto gap-1" onClick={() => setActiveTab("Contracts")}>
                      View All Contracts
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Summary Stats Row */}
              <div className="grid grid-cols-4 gap-4">
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Total Committed</p>
                  <p className="text-2xl font-bold">${sponsor.committed.toLocaleString()}</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Total Allocated</p>
                  <p className="text-2xl font-bold">${sponsor.allocated.toLocaleString()}</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                  <p className="text-2xl font-bold">${sponsor.totalPaid.toLocaleString()}</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Next Payment Due</p>
                  <p className="text-lg font-bold">{sponsor.nextPaymentDate}</p>
                  <p className="text-sm text-muted-foreground">${sponsor.nextPaymentAmount.toLocaleString()}</p>
                </Card>
              </div>

              {/* Upcoming Payments Preview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Upcoming Payments</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Next scheduled payments from this sponsor</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="px-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10">#</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Athlete</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Contract</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sponsor.upcomingPayments.slice(0, 4).map((payment: any, index: number) => (
                          <TableRow key={payment.id}>
                            <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>{payment.athleteName}</TableCell>
                            <TableCell className="font-mono">${payment.amount.toLocaleString()}</TableCell>
                            <TableCell className="font-mono text-sm text-muted-foreground">{payment.contractId}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getPaymentStatusBadgeClassName(payment.status)}>
                                {payment.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="px-6 py-4 border-t">
                    <Button variant="link" className="p-0 h-auto gap-1" onClick={() => setActiveTab("Payments")}>
                      View All Payments
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Deliverables Preview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Deliverables</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Athlete obligations across this sponsor's active contracts</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="px-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10">#</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Athlete</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Deadline</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[...sponsor.completedDeliverables.slice(0, 2), ...sponsor.upcomingDeliverables.slice(0, 3)].map((deliverable: any, index: number) => (
                          <TableRow key={deliverable.id}>
                            <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                            <TableCell>{deliverable.type}</TableCell>
                            <TableCell>{deliverable.athleteName}</TableCell>
                            <TableCell>{deliverable.progress || "1 of 1"}</TableCell>
                            <TableCell className={deliverable.status === "Overdue" ? "text-red-600" : ""}>
                              {deliverable.deadline || deliverable.completed}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getDeliverableStatusBadgeClassName(deliverable.status)}>
                                {deliverable.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="px-6 py-4 border-t">
                    <Button variant="link" className="p-0 h-auto gap-1" onClick={() => setActiveTab("Deliverables")}>
                      View All Deliverables
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar (~33%) */}
            <div className="lg:col-span-1 space-y-6">
              {/* Budget Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Budget Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm font-medium">{sponsor.name}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Committed</span>
                      <span className="font-mono">${sponsor.committed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Allocated</span>
                      <span className="font-mono">${sponsor.allocated.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Available</span>
                      <span className="font-mono text-green-600">${sponsor.available.toLocaleString()}</span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(sponsor.allocated / sponsor.committed) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    {Math.round((sponsor.allocated / sponsor.committed) * 100)}% allocated
                  </p>
                  <Button variant="link" className="p-0 h-auto gap-1" onClick={() => setActiveTab("Contracts")}>
                    View All Contracts
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Button>
                </CardContent>
              </Card>

              {/* Athlete Recommendations Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Athlete Recommendations</CardTitle>
                  <p className="text-sm text-muted-foreground">Athletes aligned with this sponsor</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sponsor.recommendedAthletes.map((athlete: any) => (
                    <div key={athlete.id} className="flex items-center justify-between py-1">
                      <div>
                        <p className="font-medium">{athlete.name}</p>
                        <p className="text-sm text-muted-foreground">{athlete.sport} · {formatNumber(athlete.reach)} reach</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="link" className="p-0 h-auto gap-1">
                    View All Recommendations
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ===== CONTRACTS TAB ===== */}
        {activeTab === "Contracts" && (
          <div className="space-y-6">
            {/* Context bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-muted/30 rounded-lg border">
              <p className="text-sm">
                {sponsor.name} · <span className="font-medium">${sponsor.allocated.toLocaleString()}</span> allocated · {sponsor.contracts.length} contracts
              </p>
              <Button onClick={handleBuildContractStart} variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Build Contract
              </Button>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Contract History</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">All NIL agreements funded by this sponsor</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Download className="w-4 h-4" />
                    Export CSV
                  </Button>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search contracts..." className="pl-9 h-9" />
                  </div>
                  <Select value={contractStatusFilter} onValueChange={setContractStatusFilter}>
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={contractSeasonFilter} onValueChange={setContractSeasonFilter}>
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue placeholder="All Seasons" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Seasons</SelectItem>
                      <SelectItem value="2025-26">2025–26</SelectItem>
                      <SelectItem value="2024-25">2024–25</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="px-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Athlete</TableHead>
                        <TableHead>Contract Value</TableHead>
                        <TableHead>Obligations</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Signature</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                  <TableBody>
                    {filteredContracts.map((contract: any) => (
                      <TableRow key={contract.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <div>
                            <p className="font-medium">{contract.athleteName}</p>
                            <p className="text-sm text-muted-foreground">{contract.sport} · {contract.season}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">${contract.contractValue.toLocaleString()}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{contract.obligations}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500"
                                style={{ width: `${contract.progressPercent}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">{contract.obligationProgress}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {contract.paymentTrigger}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {contract.signatureStatus === "Signed" ? (
                            <span className="flex items-center gap-1 text-green-600 text-sm">
                              <CheckCircle className="w-4 h-4" />
                              Signed
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-yellow-600 text-sm">
                              <Clock className="w-4 h-4" />
                              Sent
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusBadgeClassName(contract.status)}>
                            {contract.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2">
                                <Eye className="w-4 h-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <Download className="w-4 h-4" />
                                Download PDF
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={7} className="text-right font-medium">
                          Total allocated: ${sponsor.allocated.toLocaleString()} across {filteredContracts.length} contracts
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ===== DELIVERABLES TAB ===== */}
        {activeTab === "Deliverables" && (
          <div className="space-y-6">
            {/* Upcoming Deliverables */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Upcoming Deliverables</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Active obligations pending or in progress</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={deliverableContractFilter} onValueChange={setDeliverableContractFilter}>
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="All Contracts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Contracts</SelectItem>
                        {sponsor.contracts.map((c: any) => (
                          <SelectItem key={c.id} value={c.id}>{c.id}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={deliverableStatusFilter} onValueChange={setDeliverableStatusFilter}>
                      <SelectTrigger className="w-[140px] h-9">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="px-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Deliverable</TableHead>
                        <TableHead>Athlete</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Contract</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUpcomingDeliverables.map((deliverable: any) => (
                        <TableRow key={deliverable.id}>
                          <TableCell>{deliverable.type}</TableCell>
                          <TableCell>{deliverable.athleteName}</TableCell>
                          <TableCell>{deliverable.progress}</TableCell>
                          <TableCell className={deliverable.status === "Overdue" ? "text-red-600" : ""}>
                            {deliverable.deadline}
                          </TableCell>
                          <TableCell className="font-mono text-sm text-muted-foreground">{deliverable.contractId}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getDeliverableStatusBadgeClassName(deliverable.status)}>
                              {deliverable.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{deliverable.notes || "—"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Completed Deliverables */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Completed Deliverables</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Fulfilled obligations and past activity</p>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="px-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Deliverable</TableHead>
                        <TableHead>Athlete</TableHead>
                        <TableHead>Completed</TableHead>
                        <TableHead>Contract</TableHead>
                        <TableHead>Verified By</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sponsor.completedDeliverables.map((deliverable: any) => (
                        <TableRow key={deliverable.id}>
                          <TableCell>{deliverable.type}</TableCell>
                          <TableCell>{deliverable.athleteName}</TableCell>
                          <TableCell>{deliverable.completed}</TableCell>
                          <TableCell className="font-mono text-sm text-muted-foreground">{deliverable.contractId}</TableCell>
                          <TableCell className="text-muted-foreground">{deliverable.verifiedBy}</TableCell>
                          <TableCell>
                            <span className="flex items-center gap-1 text-green-600 text-sm">
                              <CheckCircle className="w-4 h-4" />
                              Complete
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ===== ATHLETES TAB ===== */}
        {activeTab === "Athletes" && (
          <div className="space-y-6">
            {/* Engaged Athletes */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Engaged Athletes</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Athletes with active or historical contracts funded by this sponsor</p>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="px-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Athlete</TableHead>
                        <TableHead>Sport</TableHead>
                        <TableHead>Contract Value</TableHead>
                        <TableHead>Obligations</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sponsor.contracts.map((contract: any) => (
                        <TableRow key={contract.id}>
                          <TableCell className="font-medium">{contract.athleteName}</TableCell>
                          <TableCell className="text-muted-foreground">{contract.sport}</TableCell>
                          <TableCell className="font-mono">${contract.contractValue.toLocaleString()}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{contract.obligations}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{contract.obligationProgress}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusBadgeClassName(contract.status)}>
                              {contract.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="link" className="p-0 h-auto text-sm">
                              View Contract
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={6} className="text-right text-sm text-muted-foreground">
                          {sponsor.contracts.length} athletes · ${sponsor.allocated.toLocaleString()} total allocated
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Recommendations</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Athletes without a current contract who align with this sponsor's audience and objectives</p>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="px-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Athlete</TableHead>
                        <TableHead>Sport</TableHead>
                        <TableHead>Reach</TableHead>
                        <TableHead>Engagement Rate</TableHead>
                        <TableHead>Existing Contract</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sponsor.recommendedAthletes.map((athlete: any) => (
                        <TableRow key={athlete.id}>
                          <TableCell className="font-medium">{athlete.name}</TableCell>
                          <TableCell className="text-muted-foreground">{athlete.sport}</TableCell>
                          <TableCell className="font-mono">{formatNumber(athlete.reach)}</TableCell>
                          <TableCell className="font-mono">{athlete.engagement}%</TableCell>
                          <TableCell className="text-muted-foreground">{athlete.existingContract ? "Yes" : "—"}</TableCell>
                          <TableCell>
<Button variant="outline" size="sm" className="gap-1" onClick={handleBuildContractStart}>
                            <Plus className="w-3 h-3" />
                            Build Contract
                          </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ===== PAYMENTS TAB ===== */}
        {activeTab === "Payments" && (
          <div className="space-y-6">
            {/* Context bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-muted/30 rounded-lg border">
              <p className="text-sm">
                {sponsor.name} · <span className="font-medium">${sponsor.totalPaid.toLocaleString()}</span> paid to date
              </p>
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <Button
                  variant={paymentsView === "upcoming" ? "default" : "ghost"}
                  size="sm"
                  className="h-7 px-3"
                  onClick={() => setPaymentsView("upcoming")}
                >
                  Upcoming
                </Button>
                <Button
                  variant={paymentsView === "historical" ? "default" : "ghost"}
                  size="sm"
                  className="h-7 px-3"
                  onClick={() => setPaymentsView("historical")}
                >
                  Historical
                </Button>
              </div>
            </div>

            {paymentsView === "upcoming" && (
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Payments</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Scheduled payments pending or processing</p>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="px-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10">#</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Athlete</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Contract</TableHead>
                          <TableHead>Trigger</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sponsor.upcomingPayments.map((payment: any, index: number) => (
                          <TableRow key={payment.id}>
                            <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>{payment.athleteName}</TableCell>
                            <TableCell className="font-mono">${payment.amount.toLocaleString()}</TableCell>
                            <TableCell className="font-mono text-sm text-muted-foreground">{payment.contractId}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {payment.status === "Scheduled" ? "Scheduled" : "On Completion"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getPaymentStatusBadgeClassName(payment.status)}>
                                {payment.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {paymentsView === "historical" && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Completed payments to athletes</p>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="px-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Athlete</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Contract</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sponsor.historicalPayments.map((payment: any) => (
                          <TableRow key={payment.id}>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>{payment.athleteName}</TableCell>
                            <TableCell className="font-mono">${payment.amount.toLocaleString()}</TableCell>
                            <TableCell className="font-mono text-sm text-muted-foreground">{payment.contractId}</TableCell>
                            <TableCell className="text-muted-foreground">{payment.type}</TableCell>
                            <TableCell>
                              <span className="flex items-center gap-1 text-green-600 text-sm">
                                <CheckCircle className="w-4 h-4" />
                                Paid
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ===== DOCUMENTS TAB ===== */}
        {activeTab === "Documents" && (
          <div className="space-y-6">
            {/* Contracts & Amendments */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Contracts & Amendments</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Executed agreements and modifications</p>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Upload
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="px-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Related Contract</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sponsor.contractDocuments.map((doc: any) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">{doc.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getDocTypeBadgeClassName(doc.type)}>
                              {doc.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{doc.date}</TableCell>
                          <TableCell className="font-mono text-sm text-muted-foreground">{doc.relatedContract}</TableCell>
                          <TableCell className="text-muted-foreground">{doc.size}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-8 px-2">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 px-2">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Sponsor Documents */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Sponsor Documents</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">W-9s, agreements, and compliance documents</p>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Upload
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="px-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date Filed</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sponsor.sponsorDocuments.map((doc: any) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">{doc.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getDocTypeBadgeClassName(doc.type)}>
                              {doc.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{doc.date}</TableCell>
                          <TableCell className="text-muted-foreground">{doc.source}</TableCell>
                          <TableCell className="text-muted-foreground">{doc.size}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-8 px-2">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 px-2">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Contact Modal */}
        <Dialog open={showEditContactModal} onOpenChange={setShowEditContactModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Primary Contact</DialogTitle>
              <DialogDescription>Update the primary contact information for this sponsor.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Contact Name</Label>
                <Input defaultValue={sponsor.contactName} />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input defaultValue={sponsor.contactTitle} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" defaultValue={sponsor.email} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input defaultValue={sponsor.phone} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditContactModal(false)}>Cancel</Button>
              <Button onClick={() => setShowEditContactModal(false)}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
