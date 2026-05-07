"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Download,
  DollarSign,
  AlertCircle,
  CreditCard,
  Landmark,
  Wallet,
  Send,
  User,
  Mail,
  Copy,
  FileText,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CheckCircle2,
  Circle,
  Upload,
  MessageSquare,
} from "lucide-react"
import { useState } from "react"
import { ResultsDashboard } from "@/components/contracts/results-dashboard"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ActiveContractsManagement } from "@/components/active-contracts-management"
import { Contracts2Management } from "@/components/contracts2-management"
import { ClosedContractsManagement } from "@/components/closed-contracts-management"

const mockContracts = [
  {
    id: "c1",
    contractNumber: "ESU-FB-2025-047",
    contractTitle: "JJ Andrews Revenue Share Agreement",
    athlete: "JJ Andrews",
    sponsor: "Gatorade",
    sport: "Football",
    type: "Revenue Share",
    value: "$250,000",
    term: "12 months",
    currentVersion: 3,
    createdDate: "2024-11-06T14:14:00Z",
    status: "active",
    currentHolder: "Agent",
    holderName: "Mike Thompson",
    daysWithHolder: 4,
    lastActivity: "2024-11-04T09:30:00Z",
    trackingEmail: "jj-andrews-047@contracts.analog.com",
    participants: [
      {
        id: 1,
        name: "Mike Thompson",
        role: "Agent",
        organization: "Excel Sports Management",
        email: "mike.thompson@excelsports.com",
        lastActive: "2024-11-04T09:30:00Z",
        lastAction: "uploaded v2",
        status: "waiting",
        statusText: "Waiting on Mike",
      },
      {
        id: 2,
        name: "Sarah Chen",
        role: "Legal",
        organization: "Example State Legal",
        email: "sarah.chen@esu.edu",
        lastActive: "2024-11-08T07:30:00Z",
        lastAction: "uploaded v3",
        status: "approved",
        statusText: "Approved v3",
      },
      {
        id: 3,
        name: "JJ Andrews",
        role: "Athlete",
        organization: null,
        email: "jj.andrews@esu.edu",
        lastActive: null,
        lastAction: null,
        status: "ready",
        statusText: "Will sign when ready",
      },
    ],
    versions: [
      {
        version: 3,
        isCurrent: true,
        date: "2024-11-08T09:30:00Z",
        uploader: {
          name: "Sarah Chen",
          role: "University Legal",
        },
        source: "email",
        filename: "JJ_Andrews_RevShare_v3_legal.docx",
        notes: "Approved payment changes. Minor edits to Section 3 for clarity.",
        sentTo: "Agent",
        sentDate: "2024-11-04T09:30:00Z",
        daysAgo: 4,
      },
      {
        version: 2,
        isCurrent: false,
        date: "2024-11-07T11:03:00Z",
        uploader: {
          name: "Mike Thompson",
          role: "Excel Sports",
        },
        source: "email",
        filename: "JJ_Andrews_RevShare_v2_redlined.docx",
        notes: "Modified payment schedule to quarterly, reduced social posts from 5 to 3",
        sentTo: null,
        sentDate: null,
        daysAgo: null,
      },
      {
        version: 1,
        isCurrent: false,
        date: "2024-11-06T14:14:00Z",
        uploader: {
          name: "John Hitchcock",
          role: "University",
        },
        source: "analog",
        filename: "JJ_Andrews_RevShare_v1.docx",
        notes: "Initial draft from Big Ten template",
        sentTo: null,
        sentDate: null,
        daysAgo: null,
      },
    ],
  },
  {
    id: "c2",
    contractNumber: "NIL-2024-SWA-002",
    fileName: "Sponsorship_Sarah_Williams.pdf",
    contractTitle: "Local Sponsorship Agreement",
    uploadedAt: "2024-06-01T10:15:00Z",
    status: "active",
    athlete: "Sarah Williams",
    sponsor: "Adidas",
    university: "UCLA",
    value: "$35,000",
    term: "18 months",
    paymentFrequency: "Quarterly",
    uploadedBy: "Mike Chen, Athletic Director",
    startDate: "2024-05-01",
    endDate: "2025-10-31",
    effectiveDate: "2024-05-01",
    uploadDate: "2024-06-01T10:15:00Z",
    reviewedBy: "Tom Wilson, Legal Counsel",
    reviewDate: "2024-06-03T15:45:00Z",
    complianceScore: 88,
    disbursements: [
      {
        id: 1,
        title: "Q2 2024 payment",
        amount: "$5,833",
        dueDate: "2024-05-15",
        type: "recurring",
        status: "completed",
        completedDate: "2024-05-15",
        transactionId: "TXN-ADI-001",
        processor: "Automated Payment System",
        verificationDetails: "Bank verification • TXN-ADI-001",
        conditions: [],
        recipient: "Sarah Williams",
      },
      {
        id: 2,
        title: "Q3 2024 payment",
        amount: "$5,833",
        dueDate: "2024-08-15",
        type: "recurring",
        status: "completed",
        completedDate: "2024-08-17",
        transactionId: "TXN-ADI-002",
        processor: "Automated Payment System",
        verificationDetails: "Bank verification • TXN-ADI-002",
        conditions: [],
        recipient: "Sarah Williams",
      },
      {
        id: 3,
        title: "Q4 2024 payment",
        amount: "$5,833",
        dueDate: "2024-10-15",
        type: "recurring",
        status: "overdue",
        daysOverdue: 5,
        verificationDetails: "Payment overdue",
        conditions: [],
        recipient: "Sarah Williams",
      },
      {
        id: 4,
        title: "Q1 2025 payment",
        amount: "$5,833",
        dueDate: "2025-01-15",
        type: "recurring",
        status: "pending",
        verificationDetails: "Scheduled",
        conditions: [],
        recipient: "Sarah Williams",
      },
      {
        id: 5,
        title: "Q2 2025 payment",
        amount: "$5,833",
        dueDate: "2025-04-15",
        type: "recurring",
        status: "pending",
        verificationDetails: "Scheduled",
        conditions: [],
        recipient: "Sarah Williams",
      },
      {
        id: 6,
        title: "Final payment",
        amount: "$5,835",
        dueDate: "2025-07-15",
        type: "recurring",
        status: "pending",
        verificationDetails: "Scheduled",
        conditions: [],
        recipient: "Sarah Williams",
      },
    ],
    permissibilityReview: {
      itemsReviewed: 5,
      itemsCleared: 2,
      itemsQueuedForLegal: 2,
      itemsResolved: 2,
      outcomes: [
        {
          id: 1,
          title: "State disclosure requirements",
          severity: "high",
          resolution: "Queued for legal review",
          reviewerNotes: "California requires specific financial disclosures for NIL agreements exceeding $500.",
          governanceDoc: "California SB 206",
          governanceDocUrl: "/docs/california-sb-206.pdf",
        },
        {
          id: 2,
          title: "Payment frequency compliance",
          severity: "low",
          resolution: "Approved",
          reviewerNotes: "Quarterly payment structure is compliant with NCAA guidelines.",
          governanceDoc: "NCAA NIL Policy § 12.5.2.1",
          governanceDocUrl: "/docs/ncaa-nil-policy-12.5.2.1.pdf",
        },
        {
          id: 3,
          title: "Brand exclusivity clause",
          severity: "moderate",
          resolution: "Approved with conditions",
          reviewerNotes: "Exclusivity clause limited to footwear category only to avoid conflicts.",
          governanceDoc: "NCAA Bylaw 12.5.1",
          governanceDocUrl: "/docs/ncaa-bylaw-12.5.1.pdf",
        },
      ],
    },
    activityHistory: [
      {
        action: "Contract uploaded",
        user: "Mike Chen, Athletic Director",
        date: "2024-06-01T10:15:00Z",
        type: "upload",
      },
      {
        action: "Permissibility review completed",
        user: "Tom Wilson, Legal Counsel",
        date: "2024-06-03T15:45:00Z",
        type: "review",
      },
      {
        action: "Contract activated",
        user: "System",
        date: "2024-05-01T00:00:00Z",
        type: "system",
      },
      {
        action: "Payment of $5,833 processed",
        user: "Automated Payment System",
        date: "2024-05-15T09:00:00Z",
        type: "payment",
      },
      {
        action: "Payment of $5,833 processed",
        user: "Automated Payment System",
        date: "2024-08-17T09:00:00Z",
        type: "payment",
      },
      {
        action: "Payment overdue alert",
        user: "System",
        date: "2024-10-16T00:00:00Z",
        type: "system",
      },
    ],
  },
  {
    id: "c3",
    contractNumber: "NIL-2024-DCU-003",
    fileName: "NIL_David_Chen_Stanford.pdf",
    contractTitle: "Tech Startup Partnership",
    uploadedAt: "2024-05-30T16:45:00Z",
    status: "under_review",
    athlete: "David Chen",
    sponsor: "Under Armour",
    university: "Stanford University",
    value: "$28,000",
    term: "9 months",
    paymentFrequency: "Quarterly",
    uploadedBy: "Lisa Park, Compliance Officer",
    startDate: "2024-06-01",
    endDate: "2025-02-28",
    effectiveDate: "2024-06-01",
    uploadDate: "2024-05-30T16:45:00Z",
    reviewProgress: 60,
    permissibilityProgress: { reviewed: 3, total: 5 },
    obligationsProgress: { confirmed: 2, total: 3 },
    riskLevel: "high",
    disbursements: [],
    activityHistory: [
      {
        action: "Contract uploaded",
        user: "Lisa Park, Compliance Officer",
        date: "2024-05-30T16:45:00Z",
        type: "upload",
      },
      {
        action: "Automated analysis completed",
        user: "System",
        date: "2024-05-31T10:00:00Z",
        type: "system",
      },
      {
        action: "Issue flagged: Pay-for-play violation",
        user: "Compliance Assistant AI",
        date: "2024-05-31T10:05:00Z",
        type: "review",
      },
      {
        action: "Issue flagged: Institutional involvement breach",
        user: "Compliance Assistant AI",
        date: "2024-05-31T10:06:00Z",
        type: "review",
      },
      {
        action: "Assigned for review",
        user: "Sarah Johnson, Senior Analyst",
        date: "2024-06-01T09:30:00Z",
        type: "review",
      },
      {
        action: "3 of 5 permissibility items reviewed",
        user: "Sarah Johnson, Senior Analyst",
        date: "2024-06-02T14:30:00Z",
        type: "review",
      },
    ],
  },
  {
    id: "c4",
    contractNumber: "NIL-2024-TBR-004",
    fileName: "Basketball_Endorsement_Tyler_Brown.pdf",
    contractTitle: "Basketball Equipment Endorsement",
    uploadedAt: "2024-10-05T09:30:00Z",
    status: "under_review",
    athlete: "Tyler Brown",
    sponsor: "Wilson Sports",
    university: "Duke University",
    value: "$45,000",
    term: "24 months",
    paymentFrequency: "Quarterly",
    uploadedBy: "Sarah Johnson, Compliance Officer",
    startDate: "2024-11-01",
    endDate: "2026-10-31",
    effectiveDate: "2024-11-01",
    uploadDate: "2024-10-05T09:30:00Z",
    reviewProgress: 60,
    permissibilityProgress: { reviewed: 3, total: 5 },
    obligationsProgress: { confirmed: 2, total: 4 },
    disbursements: [],
    activityHistory: [
      {
        action: "Contract uploaded",
        user: "Sarah Johnson, Compliance Officer",
        date: "2024-10-05T09:30:00Z",
        type: "upload",
      },
      {
        action: "Permissibility review started",
        user: "Mike Wilson, Legal Analyst",
        date: "2024-10-05T10:00:00Z",
        type: "review",
      },
      {
        action: "3 of 5 permissibility items reviewed",
        user: "Mike Wilson, Legal Analyst",
        date: "2024-10-06T14:30:00Z",
        type: "review",
      },
    ],
  },
  {
    id: "c5",
    contractNumber: "NIL-2024-EMR-005",
    fileName: "Apparel_Deal_Emma_Rodriguez.pdf",
    contractTitle: "Apparel Brand Partnership",
    uploadedAt: "2023-08-15T11:00:00Z",
    status: "completed",
    athlete: "Emma Rodriguez",
    sponsor: "Under Armour",
    sport: "Volleyball", // Added sport
    type: "Endorsement", // Added type
    university: "Stanford University",
    value: "$28,000",
    term: "12 months",
    paymentFrequency: "Monthly",
    uploadedBy: "David Chen, Athletic Director",
    startDate: "2023-09-01",
    endDate: "2024-08-31",
    effectiveDate: "2023-09-01",
    uploadDate: "2023-08-15T11:00:00Z",
    reviewedBy: "Lisa Martinez, Compliance Lead",
    reviewDate: "2023-08-18T15:00:00Z",
    complianceScore: 96,
    completedDate: "2024-08-31",
    currentVersion: 2,
    createdDate: "2023-08-15T11:00:00Z",
    currentHolder: "Completed",
    holderName: null,
    daysWithHolder: 0,
    lastActivity: "2024-08-31T23:59:59Z",
    trackingEmail: "emma-rodriguez-005@contracts.analog.com",
    participants: [
      {
        id: 1,
        name: "Emma Rodriguez",
        role: "Athlete",
        organization: null,
        email: "emma.rodriguez@stanford.edu",
        lastActive: "2024-08-31T23:59:59Z",
        lastAction: "signed final version",
        status: "approved",
        statusText: "Signed and completed",
      },
      {
        id: 2,
        name: "Lisa Martinez",
        role: "Legal",
        organization: "Stanford Legal",
        email: "lisa.martinez@stanford.edu",
        lastActive: "2023-08-18T15:00:00Z",
        lastAction: "approved v2",
        status: "approved",
        statusText: "Approved final version",
      },
    ],
    versions: [
      {
        version: 2,
        isCurrent: true,
        date: "2023-08-18T15:00:00Z",
        uploader: {
          name: "Lisa Martinez",
          role: "Stanford Legal",
        },
        source: "analog",
        filename: "Apparel_Deal_Emma_Rodriguez_Final.pdf",
        notes: "Final version approved and signed by all parties",
        sentTo: null,
        sentDate: null,
        daysAgo: null,
      },
      {
        version: 1,
        isCurrent: false,
        date: "2023-08-15T11:00:00Z",
        uploader: {
          name: "David Chen",
          role: "Stanford Athletic Dept",
        },
        source: "analog",
        filename: "Apparel_Deal_Emma_Rodriguez_Draft.pdf",
        notes: "Initial contract draft",
        sentTo: null,
        sentDate: null,
        daysAgo: null,
      },
    ],
    disbursements: [
      {
        id: 1,
        title: "September 2023 payment",
        amount: "$2,333",
        dueDate: "2023-09-01",
        type: "recurring",
        status: "completed",
        completedDate: "2023-09-01",
        transactionId: "TXN-UA-001",
        processor: "Automated Payment System",
        verificationDetails: "Bank verification • TXN-UA-001",
        conditions: [],
        recipient: "Emma Rodriguez",
      },
      // ... more completed payments
    ],
    permissibilityReview: {
      itemsReviewed: 4,
      itemsCleared: 4,
      itemsQueuedForLegal: 0,
      itemsResolved: 0,
      outcomes: [
        {
          id: 1,
          title: "Payment structure compliance",
          severity: "low",
          resolution: "Approved",
          reviewerNotes: "Monthly payment structure is compliant with all regulations.",
          governanceDoc: "NCAA NIL Policy § 12.5.2.1",
          governanceDocUrl: "/docs/ncaa-nil-policy-12.5.2.1.pdf",
        },
      ],
    },
    activityHistory: [
      {
        action: "Contract uploaded",
        user: "David Chen, Athletic Director",
        date: "2023-08-15T11:00:00Z",
        type: "upload",
      },
      {
        action: "Contract activated",
        user: "System",
        date: "2023-09-01T00:00:00Z",
        type: "system",
      },
      {
        action: "Contract completed",
        user: "System",
        date: "2024-08-31T23:59:59Z",
        type: "system",
      },
    ],
  },
  {
    id: "c6",
    contractNumber: "NIL-2024-JWL-006",
    fileName: "Training_Partnership_Jake_Wilson.pdf",
    contractTitle: "Training Facility Partnership",
    uploadedAt: "2024-03-10T13:45:00Z",
    status: "paused",
    athlete: "Jake Wilson",
    sponsor: "24 Hour Fitness",
    university: "USC",
    value: "$22,000",
    term: "18 months",
    paymentFrequency: "Monthly",
    uploadedBy: "Rachel Green, Compliance Manager",
    startDate: "2024-04-01",
    endDate: "2025-09-30",
    effectiveDate: "2024-04-01",
    uploadDate: "2024-03-10T13:45:00Z",
    reviewedBy: "Tom Anderson, Legal Counsel",
    reviewDate: "2024-03-15T10:30:00Z",
    complianceScore: 92,
    pausedDate: "2024-09-15",
    pauseReason: "Athlete injury - temporary suspension per contract terms",
    disbursements: [
      {
        id: 1,
        title: "April 2024 payment",
        amount: "$1,222",
        dueDate: "2024-04-01",
        type: "recurring",
        status: "completed",
        completedDate: "2024-04-01",
        transactionId: "TXN-24F-001",
        processor: "Automated Payment System",
        verificationDetails: "Bank verification • TXN-24F-001",
        conditions: [],
        recipient: "Jake Wilson",
      },
      // ... more payments
    ],
    permissibilityReview: {
      itemsReviewed: 5,
      itemsCleared: 4,
      itemsQueuedForLegal: 1,
      itemsResolved: 1,
      outcomes: [
        {
          id: 1,
          title: "Facility usage terms",
          severity: "low",
          resolution: "Approved",
          reviewerNotes: "Facility usage terms are compliant with NCAA guidelines.",
          governanceDoc: "NCAA Bylaw 12.5.1",
          governanceDocUrl: "/docs/ncaa-bylaw-12.5.1.pdf",
        },
      ],
    },
    activityHistory: [
      {
        action: "Contract uploaded",
        user: "Rachel Green, Compliance Manager",
        date: "2024-03-10T13:45:00Z",
        type: "upload",
      },
      {
        action: "Contract activated",
        user: "System",
        date: "2024-04-01T00:00:00Z",
        type: "system",
      },
      {
        action: "Contract paused",
        user: "Rachel Green, Compliance Manager",
        date: "2024-09-15T14:20:00Z",
        type: "system",
      },
    ],
  },
  {
    id: "c7",
    contractNumber: "NIL-2024-DRF-007",
    fileName: "Draft_Agreement_Alex_Thompson.pdf",
    contractTitle: "Social Media Partnership (Draft)",
    uploadedAt: "2024-10-08T16:00:00Z",
    status: "draft",
    athlete: "Alex Thompson",
    sponsor: "TikTok",
    university: "University of Texas",
    value: "$15,000",
    term: "6 months",
    paymentFrequency: "Monthly",
    uploadedBy: "Jennifer Lee, Athletic Admin",
    startDate: "2024-11-01",
    endDate: "2025-04-30",
    effectiveDate: "2024-11-01",
    uploadDate: "2024-10-08T16:00:00Z",
    disbursements: [],
    activityHistory: [
      {
        action: "Contract uploaded",
        user: "Jennifer Lee, Athletic Admin",
        date: "2024-10-08T16:00:00Z",
        type: "upload",
      },
    ],
  },
]

export default function ContractDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const contractId = params.id as string
  const [activeTab, setActiveTab] = useState<"negotiation" | "terms">("negotiation")
  const [activityFilter, setActivityFilter] = useState("all")
  const [isTabLoading, setIsTabLoading] = useState(false)
  const [contractStatus, setContractStatus] = useState<string | null>(null)
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [noteText, setNoteText] = useState("")
  const [nilGoClearanceAcknowledged, setNilGoClearanceAcknowledged] = useState(false)
  // Added state for permissibility collapsible
  const [permissibilityOpen, setPermissibilityOpen] = useState(false)

  // The [id] dynamic route can conflict with static sub-routes in the next-lite runtime.
  // For reserved paths, render the correct component directly instead of the contract detail.
  const reservedPaths = ["active", "negotiation", "closed", "upload"]
  const isReservedPath = reservedPaths.includes(contractId)

  const contract = isReservedPath ? null : mockContracts.find((c) => c.id === contractId)

  if (isReservedPath) {
    if (contractId === "active") return <ActiveContractsManagement />
    if (contractId === "negotiation") return <Contracts2Management />
    if (contractId === "closed") return <ClosedContractsManagement />
    return null
  }

  if (!contract) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <h2 className="text-2xl font-bold">Contract Not Found</h2>
          <p className="text-muted-foreground">{"The contract you're looking for doesn't exist."}</p>
          <Button onClick={() => router.push("/contracts")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contracts
          </Button>
        </div>
      </div>
    )
  }

  const currentStatus = contractStatus || contract.status

  if (currentStatus === "under_review" || currentStatus === "draft") {
    if (currentStatus === "draft") {
      const handleBeginReview = () => {
        setContractStatus("under_review")
      }

      return (
        <div className="min-h-screen bg-background">
          <div className="container py-6 space-y-6">
            <div>
              <Button variant="ghost" onClick={() => router.push("/contracts")} className="mb-4 -ml-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Contracts
              </Button>
            </div>

            <Card className="border">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold mb-2">{contract.contractTitle}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {contract.athlete} • {contract.sponsor}
                    </p>
                  </div>
                  <Badge variant="outline" className="px-4 py-1.5 text-sm">
                    Draft
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Contract ID</div>
                    <div className="font-medium text-sm">{contract.contractNumber}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Value</div>
                    <div className="font-medium text-sm">{contract.value}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Term</div>
                    <div className="font-medium text-sm">{contract.term}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Uploaded</div>
                    <div className="font-medium text-sm">
                      {new Date(contract.uploadDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This contract has not been reviewed yet. Begin the review process to activate this contract.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-center pt-4">
                  <Button size="lg" onClick={handleBeginReview} className="bg-green-600 hover:bg-green-700">
                    Begin Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    const context = {
      type: "athlete" as const,
      name: contract.athlete,
      id: contractId,
    }

    const counterparty = {
      type: "sponsor" as const,
      name: contract.sponsor,
      id: contract.sponsor.toLowerCase().replace(/\s+/g, "-"),
    }

    return (
      <ResultsDashboard
        context={context}
        counterparty={counterparty}
        onStartOver={() => router.push("/contract/upload")}
        onSaveAndExit={() => router.push("/contracts")}
      />
    )
  }

  const totalAmount = Number.parseFloat(contract.value.replace(/[$,]/g, ""))
  const completedDisbursements = contract.disbursements.filter((d) => d.status === "completed")
  const overdueDisbursements = contract.disbursements.filter((d) => d.status === "overdue")
  const pendingDisbursements = contract.disbursements.filter((d) => d.status === "pending")
  const disbursedAmount = completedDisbursements.reduce(
    (sum, d) => sum + Number.parseFloat(d.amount.replace(/[$,]/g, "")),
    0,
  )
  const progressPercentage = totalAmount > 0 ? (disbursedAmount / totalAmount) * 100 : 0

  const startDate = new Date(contract.startDate)
  const today = new Date()
  const endDate = new Date(contract.endDate)
  const daysRemaining = Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  const isCompleted = currentStatus === "completed"
  const isPaused = currentStatus === "paused"
  const isExpired = daysRemaining < 0 && !isCompleted

  // Mock deliverables data
  const deliverables = [
    { id: 1, title: "Social Media Posts", completed: 5, total: 5, status: "completed", lastSubmitted: "2/15" },
    { id: 2, title: "Public Appearance", dueDate: "March 1", status: "pending" },
    { id: 3, title: "Youth Camp", dueDate: "Feb 15", status: "overdue" },
  ]

  const completedDeliverables = deliverables.filter((d) => d.status === "completed").length
  const pendingDeliverables = deliverables.filter((d) => d.status === "pending").length
  const overdueDeliverables = deliverables.filter((d) => d.status === "overdue").length

  // Payment timeline data for chart
  const timelineData = contract.disbursements
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .map((d, index, arr) => {
      const cumulativeAmount = arr
        .slice(0, index + 1)
        .filter((item) => item.status === "completed")
        .reduce((sum, item) => sum + Number.parseFloat(item.amount.replace(/[$,]/g, "")), 0)

      return {
        date: new Date(d.dueDate).toLocaleDateString("en-US", { month: "short" }),
        amount: cumulativeAmount,
      }
    })

  const getRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "today"
    if (diffDays === 1) return "tomorrow"
    if (diffDays === -1) return "yesterday"
    if (diffDays > 0 && diffDays <= 7) return `in ${diffDays} days`
    if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case "one-time":
        return CreditCard
      case "milestone":
        return Landmark
      case "recurring":
        return Wallet
      case "conditional":
        return AlertCircle
      default:
        return DollarSign
    }
  }

  const getStatusBadge = () => {
    // This logic is specific to c1 and might need adjustment for other contracts
    if (contract.id === "c1") {
      if (contract.daysWithHolder >= 4) {
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 px-3 py-1.5">
            With {contract.currentHolder} ({contract.daysWithHolder} days, 3 hours)
          </Badge>
        )
      }
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 px-3 py-1.5">
          With {contract.currentHolder} ({contract.daysWithHolder} days)
        </Badge>
      )
    }
    // Default badge for other contracts
    return getStatusBadgeOld(currentStatus)
  }

  const getStatusBadgeOld = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-600 hover:bg-green-700 px-4 py-1.5 text-sm shadow-md">
            Active
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 px-4 py-1.5 text-sm shadow-md">
            Completed
          </Badge>
        )
      case "paused":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 px-4 py-1.5 text-sm shadow-md">
            Paused
          </Badge>
        )
      case "under_review":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 px-4 py-1.5 text-sm shadow-md">
            Under Review
          </Badge>
        )
      case "draft":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 px-4 py-1.5 text-sm shadow-md">
            Draft
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="px-4 py-1.5 text-sm shadow-md">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "one-time":
        return "bg-blue-500 text-white"
      case "milestone":
        return "bg-purple-500 text-white"
      case "recurring":
        return "bg-green-500 text-white"
      case "conditional":
        return "bg-orange-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "pending":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const getActivityIconEmoji = (type: string) => {
    switch (type) {
      case "upload":
        return "📄"
      case "review":
        return "✅"
      case "payment":
        return "💰"
      case "system":
        return "🔔"
      case "note":
        return "📝"
      default:
        return "📋"
    }
  }

  const getParticipantStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "text-red-600"
      case "approved":
        return "text-green-600"
      case "ready":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  const getParticipantStatusIcon = (status: string) => {
    if (status === "waiting") return "🔴"
    if (status === "approved") return "✓"
    return "•"
  }

  const filteredActivity =
    activityFilter === "all"
      ? contract.activityHistory
      : contract.activityHistory.filter((a) => a.type === activityFilter)

  const handleTabChange = (value: string) => {
    setIsTabLoading(true)
    setActiveTab(value as "negotiation" | "terms")
    setTimeout(() => setIsTabLoading(false), 150)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const isUnderReview = currentStatus === "under_review"

  const handlePauseContract = () => {
    console.log("[v0] Pausing contract")
    // Show confirmation modal in real implementation
  }

  const handleResumeContract = () => {
    console.log("[v0] Resuming contract")
    setContractStatus("active")
  }

  const handleArchiveContract = () => {
    console.log("[v0] Archiving contract")
    // Show confirmation modal in real implementation
  }

  const handleMarkPaymentComplete = (paymentId: number) => {
    console.log("[v0] Marking payment complete:", paymentId)
    // Show confirmation modal for payments >$10K
  }

  const getWorkflowStage = () => {
    if (currentStatus === "signed" || currentStatus === "completed") return "signed"
    if (currentStatus === "active") return "negotiation"
    if (currentStatus === "draft") return "initial"
    return "negotiation"
  }

  const workflowStage = getWorkflowStage()

  const workflowStages = [
    { id: "initial", label: "Initial Draft", icon: FileText },
    { id: "negotiation", label: "Under Negotiation", icon: MessageSquare },
    { id: "signed", label: "Signed & Active", icon: CheckCircle2 },
  ]

  const getDaysAgoText = (dateString: string) => {
    const hoursAgo = Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60))
    if (hoursAgo < 24) return `${hoursAgo} hours ago`
    return `${Math.floor(hoursAgo / 24)} days ago`
  }

  const isUrgentAction = () => {
    return contract.daysWithHolder >= 3
  }

  const handleSendReminder = (paymentId?: number, participantName?: string) => {
    console.log("[v0] Sending reminder")
    toast({
      title: "Reminder sent",
      description: participantName ? `Reminder sent to ${participantName}` : "Reminder sent",
    })
  }

  const handleMarkDeliverableComplete = (deliverableId: number) => {
    console.log("[v0] Marking deliverable complete:", deliverableId)
  }

  const handleRequestUpdate = (deliverableId: number) => {
    console.log("[v0] Requesting update for deliverable:", deliverableId)
  }

  const handleWaiveRequirement = (deliverableId: number) => {
    console.log("[v0] Waiving requirement for deliverable:", deliverableId)
    // Show confirmation modal with note requirement
  }

  const handleSaveNote = () => {
    if (noteText.trim()) {
      console.log("[v0] Saving note:", noteText)
      // Add to activity timeline
      setNoteText("")
      setIsAddingNote(false)
    }
  }

  const getDaysRemainingDisplay = () => {
    if (isPaused) return "Contract Paused"
    if (isCompleted) return "Contract Completed"
    if (isExpired) return "Contract Expired"
    return daysRemaining.toString()
  }

  // Toast handlers for new actions
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contract.trackingEmail)
    toast({
      title: "Email copied",
      description: "Tracking email address copied to clipboard",
    })
  }

  const handleResendInstructions = () => {
    toast({
      title: "Instructions sent",
      description: "Email instructions have been sent to all participants",
    })
  }

  const handleUploadVersion = () => {
    toast({
      title: "Upload initiated",
      description: "Opening file upload dialog...",
    })
  }

  const handleDownloadVersion = (version: number, filename: string) => {
    toast({
      title: "Downloading",
      description: `Downloading ${filename}...`,
    })
  }

  const handleCompareVersions = (version: number) => {
    toast({
      title: "Comparing versions",
      description: `Opening comparison view for v${version} and v${version - 1}...`,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 pb-32 space-y-8">
        <div>
          <Button variant="ghost" onClick={() => router.push("/contracts")} className="mb-6 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contracts
          </Button>

          <div className="flex items-center gap-1 mb-6 border-b">
            <button
              onClick={() => setActiveTab("negotiation")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "negotiation"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Negotiation
            </button>
            <button
              onClick={() => setActiveTab("terms")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "terms"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Terms & Payouts
            </button>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-bold">{contract.contractTitle}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{contract.athlete}</span>
              <span>•</span>
              <span>{contract.sponsor}</span>
              <span>•</span>
              <span>{contract.value}</span>
              <span>•</span>
              <span>{contract.term}</span>
            </div>
          </div>
        </div>

        {activeTab === "negotiation" && (
          <>
            <Card className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Workflow Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between relative">
                  {workflowStages.map((stage, index) => {
                    const isActive = stage.id === workflowStage
                    const isCompleted =
                      (stage.id === "initial" && workflowStage !== "initial") ||
                      (stage.id === "negotiation" && workflowStage === "signed")
                    const StageIcon = stage.icon

                    return (
                      <div key={stage.id} className="flex items-center flex-1">
                        <div className="flex flex-col items-center gap-2 flex-1">
                          <div
                            className={`h-12 w-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                              isCompleted
                                ? "bg-green-500 border-green-500 text-white"
                                : isActive
                                  ? "bg-blue-500 border-blue-500 text-white"
                                  : "bg-background border-muted-foreground/30 text-muted-foreground"
                            }`}
                          >
                            <StageIcon className="h-5 w-5" />
                          </div>
                          <div className="text-center">
                            <div
                              className={`text-sm font-medium ${
                                isActive ? "text-foreground" : "text-muted-foreground"
                              }`}
                            >
                              {stage.label}
                            </div>
                          </div>
                        </div>
                        {index < workflowStages.length - 1 && (
                          <div className="flex-1 h-0.5 bg-muted-foreground/20 mx-2" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card
              className={`border-2 ${isUrgentAction() ? "border-red-300 bg-red-50/30" : "border-orange-300 bg-orange-50/30"}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg mb-2">Current Status</CardTitle>
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-3 w-3 rounded-full ${isUrgentAction() ? "bg-red-500 animate-pulse" : "bg-orange-500"}`}
                      />
                      <div>
                        <div className="font-semibold text-xl">Waiting on {contract.currentHolder}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {contract.daysWithHolder} days, {Math.floor(Math.random() * 24)} hours since last update
                          {isUrgentAction() && " • ⚠️ Action overdue"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="default" size="sm" onClick={() => handleSendReminder()}>
                    <Send className="mr-2 h-4 w-4" />
                    Send Reminder
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>
                    Current version: v{contract.currentVersion} • Sent to {contract.currentHolder}{" "}
                    {contract.daysWithHolder} days ago
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Negotiation Timeline</CardTitle>
                <p className="text-sm text-muted-foreground">Contract versions exchanged between parties</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {contract.versions.map((version, index) => {
                    const isLatest = index === 0
                    const isOriginal = version.version === 1

                    return (
                      <div key={version.version} className="relative">
                        {/* Timeline connector line */}
                        {index < contract.versions.length - 1 && (
                          <div className="absolute left-[19px] top-12 w-0.5 h-full bg-border" />
                        )}

                        <div className="flex gap-4">
                          {/* Timeline dot */}
                          <div className="relative flex-shrink-0 mt-1">
                            <div
                              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                isLatest ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {isOriginal ? <FileText className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
                            </div>
                          </div>

                          {/* Content */}
                          <div
                            className={`flex-1 pb-8 p-4 rounded-lg border ${
                              isLatest ? "bg-blue-50/50 border-blue-200" : "bg-card"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">Version {version.version}</h3>
                                {isLatest && <Badge className="bg-blue-100 text-blue-800">Current</Badge>}
                                {isOriginal && <Badge variant="outline">Original</Badge>}
                              </div>
                              <div className="text-sm text-muted-foreground">{getDaysAgoText(version.date)}</div>
                            </div>

                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{version.uploader.name}</span>
                                <span className="text-muted-foreground">({version.uploader.role})</span>
                                {version.source === "email" ? (
                                  <>
                                    <Mail className="h-4 w-4 text-muted-foreground ml-1" />
                                    <span className="text-muted-foreground">via email</span>
                                  </>
                                ) : (
                                  <span className="text-muted-foreground">• uploaded directly</span>
                                )}
                              </div>

                              {version.notes && (
                                <div className="p-3 bg-muted/50 rounded">
                                  <span className="font-medium">Changes:</span> {version.notes}
                                </div>
                              )}

                              {version.sentTo && (
                                <div className="flex items-center gap-2 text-orange-700 bg-orange-50 p-2 rounded">
                                  <ArrowRight className="h-4 w-4" />
                                  <span>Sent to {version.sentTo} for review</span>
                                </div>
                              )}

                              <div className="flex items-center gap-2 pt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDownloadVersion(version.version, version.filename)}
                                >
                                  <Download className="mr-2 h-3 w-3" />
                                  Download
                                </Button>
                                {version.version > 1 && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleCompareVersions(version.version)}
                                  >
                                    Compare to v{version.version - 1}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-blue-900 mb-1">Next Step</div>
                      <div className="text-sm text-blue-800 mb-3">
                        When {contract.currentHolder} sends the updated contract, forward it to{" "}
                        <code className="bg-white px-1.5 py-0.5 rounded font-mono text-xs">
                          {contract.trackingEmail}
                        </code>{" "}
                        to automatically create version {contract.currentVersion + 1}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="default" onClick={handleUploadVersion}>
                          <Upload className="mr-2 h-3 w-3" />
                          Upload New Version Manually
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleSendReminder()}>
                          Send Reminder to {contract.currentHolder}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contract Parties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {contract.participants.map((participant) => (
                    <div key={participant.id} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold shrink-0">
                          {participant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{participant.name}</div>
                          <div className="text-sm text-muted-foreground">{participant.role}</div>
                          {participant.organization && (
                            <div className="text-xs text-muted-foreground truncate">{participant.organization}</div>
                          )}
                        </div>
                      </div>

                      <div
                        className={`text-sm font-medium flex items-center gap-1.5 ${
                          participant.status === "waiting"
                            ? "text-red-600"
                            : participant.status === "approved"
                              ? "text-green-600"
                              : "text-gray-600"
                        }`}
                      >
                        {participant.status === "waiting" && <Circle className="h-3 w-3 fill-current" />}
                        {participant.status === "approved" && <CheckCircle2 className="h-3 w-3" />}
                        {participant.status === "ready" && <Circle className="h-3 w-3" />}
                        <span>{participant.statusText}</span>
                      </div>

                      {participant.lastActive && (
                        <div className="text-xs text-muted-foreground mt-2">
                          {getDaysAgoText(participant.lastActive)}
                        </div>
                      )}

                      {participant.status === "waiting" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-3 bg-transparent"
                          onClick={() => handleSendReminder(undefined, participant.name)}
                        >
                          <Send className="mr-2 h-3 w-3" />
                          Remind
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-base">Email-Based Workflow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">
                    All parties can send updated versions to this tracking address:
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-background rounded-lg border">
                    <code className="text-sm flex-1 font-mono break-all">{contract.trackingEmail}</code>
                    <Button size="sm" variant="ghost" onClick={handleCopyEmail} className="h-8 w-8 p-0 shrink-0">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopyEmail}>
                    <Copy className="mr-2 h-3 w-3" />
                    Copy Email
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleResendInstructions}>
                    <Mail className="mr-2 h-3 w-3" />
                    Resend Instructions
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Collapsible open={permissibilityOpen} onOpenChange={setPermissibilityOpen}>
              <Card>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">Compliance Review</CardTitle>
                        <p className="text-sm text-muted-foreground text-left mt-1">
                          Run permissibility checks on contract versions
                        </p>
                      </div>
                      {permissibilityOpen ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-3 pt-0">
                    <div className="flex items-center gap-3">
                      <Button variant="default" size="sm">
                        Run Check on v{contract.currentVersion}
                      </Button>
                      <Button variant="outline" size="sm">
                        View All Reports
                      </Button>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </>
        )}

        {activeTab === "terms" && (
          <>
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">Terms & Payouts</h2>
              <p className="text-muted-foreground">
                Payment schedules, disbursements, and contract obligations will appear here.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
