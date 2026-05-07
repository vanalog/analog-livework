"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Filter,
  MessageCircle,
  Send,
  Download,
  X,
  ArrowLeft,
  MoreHorizontal,
  MessageSquare,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem, // Added Tooltip imports
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSidebar } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation" // Add this import
import { useToast } from "@/hooks/use-toast" // Updated import path for useToast
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table" // Import Table components

import { ContractProcessing } from "@/components/contract-processing"
import { PartiesResolution } from "@/components/parties-resolution"
import { EnhancedPermissibilityReview } from "@/components/contracts/enhanced-permissibility-review"

type VettingStatus = "pass" | "fail" | "needs_review" | "processing" | null
type ActionType = "approve" | "escalate" | "deny" | "upload" // Added 'upload' action type
type ContractStatus =
  | "draft"
  | "in_review"
  | "approved"
  | "active"
  | "pending_signature"
  | "signed"
  | "archived"
  | "completed"
  | "on_hold"

interface ContractAnalysis {
  parties: string[]
  value: string
  term: string
  paymentFrequency: string
  status: VettingStatus
  uploadedAt: string
  fileName: string
  id: string
  contractTitle?: string
  uploadedBy?: string
  source?: string
  primaryParty?: string
  counterparty?: string
  disbursementType?: string
  plannedDisbursements: number
  startDate?: string
  endDate?: string
  effectiveDate?: string
  riskLevel?: "low" | "moderate" | "high"
  lastReviewedBy?: string
  title?: string
  athlete?: string
  sponsor?: string
  uploadDate?: string
  contractStatus?: ContractStatus
  paymentsCompleted?: number
  totalPayments?: number
  nextPaymentDate?: string
  nextPaymentAmount?: string
  daysOverdue?: number
  reviewProgress?: number
  totalReviewItems?: number
  paymentObligations?: { id: number; amount: string; dueDate: string; status: string; type: string }[]
  activityHistory?: { id: number; date: string; action: string; user: string }[]
  complianceScore?: number
  complianceDetails?: Record<string, string>
  completedDate?: string // Added for new KeyInfo logic
}

// Renamed to Contract for consistency with new KeyInfo function
type Contract = ContractAnalysis

interface ContractVersion {
  version: number
  uploadedBy: string
  uploadedAt: string
  changes?: string
}

interface EnhancedContract extends Contract {
  version?: number
  currentHolder?: string
  daysWithHolder?: number
  lastActivity?: string
  lastActivityDate?: string
  lastActivityUser?: string
  urgencyLevel?: "urgent" | "active" | "ready" | "signed"
  sport?: string // Added sport field
  contractType?: string // Added contractType field
  timeWithHolder?: string // Added timeWithHolder field
  season?: string
  sentDate?: string
}

const recentContracts: EnhancedContract[] = [
  // Urgent contracts (waiting >3 days)
  {
    id: "c1",
    fileName: "JJ_Andrews_Revenue_Share.pdf",
    contractTitle: "Revenue Share Agreement",
    uploadedAt: "2024-11-03T14:30:00Z",
    status: "needs_review",
    contractStatus: "active", // Changed to 'active'
    parties: ["JJ Andrews", "University of Texas", "IMG Academy"],
    value: "$250,000",
    term: "24 months",
    paymentFrequency: "Quarterly",
    uploadedBy: "Mike Thompson",
    source: "University of Texas",
    primaryParty: "JJ Andrews",
    counterparty: "IMG Academy",
    disbursementType: "Quarterly",
    plannedDisbursements: 8,
    startDate: "2025-01-01",
    endDate: "2026-12-31",
    effectiveDate: "2025-01-01",
    riskLevel: "moderate",
    lastReviewedBy: "Mike Thompson, Agent",
    title: "Revenue Share Agreement",
    athlete: "JJ Andrews",
    sponsor: "IMG Academy",
    uploadDate: "2024-11-03T14:30:00Z",
    reviewProgress: 2,
    totalReviewItems: 5,
    complianceIssues: 0,
    complianceScore: 85,
    version: 2,
    currentHolder: "Agent",
    daysWithHolder: 3, // Updated daysWithHolder
    lastActivity: "Agent reviewing payment schedule structure", // Updated lastActivity
    lastActivityDate: "Nov 7",
    lastActivityUser: "Mike Thompson",
    urgencyLevel: "urgent",
    sport: "Football",
    contractType: "Revenue Share",
    timeWithHolder: "3 days", // Updated timeWithHolder
    season: "2024-25", // Added season
    sentDate: "2026-01-05", // Added sentDate
  },
  {
    id: "c2",
    fileName: "Billy_Richmond_NIL_Agreement.pdf",
    contractTitle: "NIL Endorsement Agreement",
    uploadedAt: "2024-11-04T10:15:00Z",
    status: "needs_review",
    contractStatus: "active", // Changed to 'active'
    parties: ["Billy Richmond", "USC", "Nike Inc."],
    value: "$150,000",
    term: "18 months",
    paymentFrequency: "Monthly",
    uploadedBy: "Sarah Chen, Agent",
    source: "USC",
    primaryParty: "Billy Richmond",
    counterparty: "Nike Inc.",
    disbursementType: "Monthly",
    plannedDisbursements: 18,
    startDate: "2025-01-01",
    endDate: "2026-06-30",
    effectiveDate: "2025-01-01",
    riskLevel: "low",
    lastReviewedBy: "Legal Team",
    title: "NIL Endorsement Agreement",
    athlete: "Billy Richmond",
    sponsor: "Nike Inc.",
    uploadDate: "2024-11-04T10:15:00Z",
    reviewProgress: 3,
    totalReviewItems: 5,
    complianceIssues: 0,
    complianceScore: 90,
    version: 4,
    currentHolder: "Legal",
    daysWithHolder: 2, // Updated daysWithHolder
    lastActivity: "Legal reviewing compliance requirements", // Updated lastActivity
    lastActivityDate: "Nov 6",
    lastActivityUser: "Sarah Chen",
    urgencyLevel: "urgent",
    sport: "Football",
    contractType: "NIL",
    timeWithHolder: "2 days", // Updated timeWithHolder
    season: "2024-25", // Added season
    sentDate: "2026-01-06", // Added sentDate
  },
  // Active contracts
  {
    id: "c3",
    fileName: "Carter_Knox_Revenue_Share.pdf",
    contractTitle: "Revenue Share Agreement",
    uploadedAt: "2024-11-09T09:00:00Z",
    status: "pass",
    contractStatus: "active", // Changed to 'active'
    parties: ["Carter Knox", "Alabama", "Under Armour"],
    value: "$180,000",
    term: "12 months",
    paymentFrequency: "Quarterly",
    uploadedBy: "You",
    source: "Alabama",
    primaryParty: "Carter Knox",
    counterparty: "Under Armour",
    disbursementType: "Quarterly",
    plannedDisbursements: 4,
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    effectiveDate: "2025-01-01",
    riskLevel: "low",
    lastReviewedBy: "You",
    title: "Revenue Share Agreement",
    athlete: "Carter Knox",
    sponsor: "Under Armour",
    uploadDate: "2024-11-09T09:00:00Z",
    reviewProgress: 3,
    totalReviewItems: 5,
    complianceIssues: 0,
    complianceScore: 95,
    version: 3,
    currentHolder: "Legal",
    daysWithHolder: 6, // Updated daysWithHolder
    lastActivity: "Legal reviewing final terms", // Updated lastActivity
    lastActivityDate: "today",
    lastActivityUser: "You",
    urgencyLevel: "active",
    sport: "Football",
    contractType: "Revenue Share",
    timeWithHolder: "6 days", // Updated timeWithHolder
    season: "2024-25", // Added season
    sentDate: "2026-01-02", // Added sentDate
  },
  {
    id: "c4",
    fileName: "Marcus_Williams_Revenue_Share.pdf",
    contractTitle: "Revenue Share Agreement",
    uploadedAt: "2024-11-08T14:30:00Z",
    status: "pass",
    contractStatus: "active", // Changed to 'active'
    parties: ["Marcus Williams", "Example State", "Adidas"],
    value: "$220,000",
    term: "24 months",
    paymentFrequency: "Quarterly",
    uploadedBy: "James Parker, Agent",
    source: "Example State",
    primaryParty: "Marcus Williams",
    counterparty: "Adidas",
    disbursementType: "Quarterly",
    plannedDisbursements: 8,
    startDate: "2025-02-01",
    endDate: "2027-01-31",
    effectiveDate: "2025-02-01",
    riskLevel: "low",
    lastReviewedBy: "Compliance Team",
    title: "Revenue Share Agreement",
    athlete: "Marcus Williams",
    sponsor: "Adidas",
    uploadDate: "2024-11-08T14:30:00Z",
    reviewProgress: 4,
    totalReviewItems: 5,
    complianceIssues: 0,
    complianceScore: 92,
    version: 2,
    currentHolder: "Under Review",
    daysWithHolder: 1, // Updated daysWithHolder
    lastActivity: "Under review by compliance", // Updated lastActivity
    lastActivityDate: "yesterday",
    lastActivityUser: "James Parker",
    urgencyLevel: "active",
    sport: "Football",
    contractType: "Revenue Share",
    timeWithHolder: "1 day", // Updated timeWithHolder
    season: "2024-25", // Added season
    sentDate: "2026-01-07", // Added sentDate
  },
  {
    id: "c5",
    fileName: "Jaylen_Cooper_NIL_Deal.pdf",
    contractTitle: "NIL Partnership",
    uploadedAt: "2024-11-07T11:20:00Z",
    status: "pass",
    contractStatus: "active", // Changed to 'active'
    parties: ["Jaylen Cooper", "LSU", "Gatorade"],
    value: "$125,000",
    term: "12 months",
    paymentFrequency: "Quarterly",
    uploadedBy: "Maria Lopez, Agent",
    source: "LSU",
    primaryParty: "Jaylen Cooper",
    counterparty: "Gatorade",
    disbursementType: "Quarterly",
    plannedDisbursements: 4,
    startDate: "2025-01-15",
    endDate: "2026-01-14",
    effectiveDate: "2025-01-15",
    riskLevel: "low",
    lastReviewedBy: "You",
    title: "NIL Partnership",
    athlete: "Jaylen Cooper",
    sponsor: "Gatorade",
    uploadDate: "2024-11-07T11:20:00Z",
    reviewProgress: 2,
    totalReviewItems: 5,
    complianceIssues: 0,
    complianceScore: 88,
    version: 1,
    currentHolder: "Agent",
    daysWithHolder: 4, // Updated daysWithHolder
    lastActivity: "Agent reviewing deliverables", // Updated lastActivity
    lastActivityDate: "Nov 7",
    lastActivityUser: "Maria Lopez",
    urgencyLevel: "active",
    sport: "Basketball",
    contractType: "NIL",
    timeWithHolder: "4 days", // Updated timeWithHolder
    season: "2024-25", // Added season
    sentDate: "2026-01-04", // Added sentDate
  },
  // Ready to sign contracts
  {
    id: "c6",
    fileName: "Marcus_Johnson_Revenue_Share.pdf",
    contractTitle: "Revenue Share Agreement",
    uploadedAt: "2024-10-28T09:30:00Z",
    status: "pass",
    contractStatus: "pending_signature", // Changed to 'pending_signature'
    parties: ["Marcus Johnson", "University of Kentucky", "Nike Inc."],
    value: "$210,000",
    term: "18 months",
    paymentFrequency: "Quarterly",
    uploadedBy: "John Doe, University Admin",
    source: "University of Kentucky",
    primaryParty: "Marcus Johnson",
    counterparty: "Nike Inc.",
    disbursementType: "Quarterly",
    plannedDisbursements: 6,
    startDate: "2025-01-01",
    endDate: "2026-06-30",
    effectiveDate: "2025-01-01",
    riskLevel: "low",
    lastReviewedBy: "Legal Team",
    title: "Revenue Share Agreement",
    athlete: "Marcus Johnson",
    sponsor: "Nike Inc.",
    uploadDate: "2024-10-28T09:30:00Z",
    reviewProgress: 5,
    totalReviewItems: 5,
    complianceIssues: 0,
    complianceScore: 98,
    version: 5,
    currentHolder: "All parties approved",
    daysWithHolder: 0,
    lastActivity: "Legal approved v5",
    lastActivityDate: "Nov 8",
    lastActivityUser: "Legal Team",
    urgencyLevel: "ready",
    sport: "Football",
    contractType: "Revenue Share",
    timeWithHolder: "0 days",
    season: "2024-25", // Added season
    sentDate: "2025-11-08", // Added sentDate
  },
  {
    id: "c7",
    fileName: "Emma_Rodriguez_Endorsement.pdf",
    contractTitle: "Brand Endorsement",
    uploadedAt: "2024-11-05T15:45:00Z",
    status: "pass",
    contractStatus: "approved", // Changed to 'approved'
    parties: ["Emma Rodriguez", "Stanford", "Puma"],
    value: "$95,000",
    term: "12 months",
    paymentFrequency: "Quarterly",
    uploadedBy: "Tom Wilson, Agent",
    source: "Stanford",
    primaryParty: "Emma Rodriguez",
    counterparty: "Puma",
    disbursementType: "Quarterly",
    plannedDisbursements: 4,
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    effectiveDate: "2025-01-01",
    riskLevel: "low",
    lastReviewedBy: "Compliance",
    title: "Brand Endorsement",
    athlete: "Emma Rodriguez",
    sponsor: "Puma",
    uploadDate: "2024-11-05T15:45:00Z",
    reviewProgress: 5,
    totalReviewItems: 5,
    complianceIssues: 0,
    complianceScore: 96,
    version: 3,
    currentHolder: "All parties approved",
    daysWithHolder: 0,
    lastActivity: "Compliance approved v3",
    lastActivityDate: "Nov 6",
    lastActivityUser: "Compliance Team",
    urgencyLevel: "ready",
    sport: "Soccer",
    contractType: "Endorsement",
    timeWithHolder: "0 days",
    season: "2024-25", // Added season
    sentDate: "2025-11-06", // Added sentDate
  },
  // Signed contracts
  {
    id: "c8",
    fileName: "Tyler_Davis_Revenue_Share.pdf",
    contractTitle: "Revenue Share Agreement - Executed",
    uploadedAt: "2024-10-15T10:00:00Z",
    status: "pass",
    contractStatus: "signed", // Changed to 'signed'
    parties: ["Tyler Davis", "Georgia", "Jordan Brand"],
    value: "$195,000",
    term: "12 months",
    paymentFrequency: "Quarterly",
    uploadedBy: "Rachel Green, Agent",
    source: "Georgia",
    primaryParty: "Tyler Davis",
    counterparty: "Jordan Brand",
    disbursementType: "Quarterly",
    plannedDisbursements: 4,
    startDate: "2024-11-01",
    endDate: "2025-10-31",
    effectiveDate: "2024-11-01",
    riskLevel: "low",
    lastReviewedBy: "All Parties",
    title: "Revenue Share Agreement - Executed",
    athlete: "Tyler Davis",
    sponsor: "Jordan Brand",
    uploadDate: "2024-10-15T10:00:00Z",
    paymentsCompleted: 0,
    totalPayments: 4,
    nextPaymentDate: "2024-11-01",
    nextPaymentAmount: "$48,750",
    complianceIssues: 0,
    complianceScore: 100,
    version: 3,
    currentHolder: "Signed",
    daysWithHolder: 0,
    lastActivity: "Contract fully executed",
    lastActivityDate: "Nov 1",
    lastActivityUser: "All Parties",
    urgencyLevel: "signed",
    sport: "Football",
    completedDate: "2024-11-01",
    contractType: "Revenue Share",
    timeWithHolder: "0 days",
    season: "2024-25", // Added season
    sentDate: "2024-11-01", // Added sentDate
  },
  {
    id: "c9",
    fileName: "Amanda_Chen_Sponsorship.pdf",
    contractTitle: "Sponsorship Agreement - Executed",
    uploadedAt: "2024-10-20T13:15:00Z",
    status: "pass",
    contractStatus: "signed", // Changed to 'signed'
    parties: ["Amanda Chen", "Duke", "New Balance"],
    value: "$140,000",
    term: "18 months",
    paymentFrequency: "Monthly",
    uploadedBy: "David Kim, Agent",
    source: "Duke",
    primaryParty: "Amanda Chen",
    counterparty: "New Balance",
    disbursementType: "Monthly",
    plannedDisbursements: 18,
    startDate: "2024-10-15",
    endDate: "2026-04-14",
    effectiveDate: "2024-10-15",
    riskLevel: "low",
    lastReviewedBy: "All Parties",
    title: "Sponsorship Agreement - Executed",
    athlete: "Amanda Chen",
    sponsor: "New Balance",
    uploadDate: "2024-10-20T13:15:00Z",
    paymentsCompleted: 1,
    totalPayments: 18,
    nextPaymentDate: "2024-11-15",
    nextPaymentAmount: "$7,778",
    complianceIssues: 0,
    complianceScore: 100,
    version: 2,
    currentHolder: "Signed",
    daysWithHolder: 0,
    lastActivity: "Contract fully executed",
    lastActivityDate: "Oct 28",
    lastActivityUser: "All Parties",
    urgencyLevel: "signed",
    sport: "Basketball",
    completedDate: "2024-10-28",
    contractType: "Sponsorship",
    timeWithHolder: "0 days",
    season: "2024-25", // Added season
    sentDate: "2024-10-28", // Added sentDate
  },
]

const mockComplianceIssues = {
  c1: [
    {
      id: 1,
      title: "Missing disbursement trigger",
      description: "Payment schedule lacks specific performance milestones required for NIL compliance monitoring.",
      severity: "warning" as const,
      reference: {
        label: "NCAA NIL Policy § 12.5.2.1",
        url: "https://ncaa.org/nil-policy",
      },
    },
    {
      id: 2,
      title: "Termination clause imbalance",
      description: "Early termination conditions may disproportionately favor the sponsor over the student-athlete.",
      severity: "warning" as const,
      reference: {
        label: "Student-Athlete Rights Framework",
        url: "https://ncaa.org/student-athlete-rights",
      },
    },
  ],
  c2: [
    {
      id: 1,
      title: "Prohibited recruiting activities",
      description:
        "Contract language suggests potential recruiting inducements that violate NCAA transfer portal regulations.",
      severity: "critical" as const,
      reference: {
        label: "NCAA Bylaw 13.2.1",
        url: "https://ncaa.org/bylaws-13-2-1",
      },
    },
    {
      id: 2,
      title: "Missing state disclosure requirements",
      description: "California requires specific financial disclosures for NIL agreements exceeding $500 in value.",
      severity: "critical" as const,
      reference: {
        label: "California SB 206 § 67456(c)",
        url: "https://leginfo.legislature.ca.gov/sb206",
      },
    },
    {
      id: 3,
      title: "Intellectual property overreach",
      description: "Usage rights extend beyond reasonable scope for athlete's name, image, and likeness.",
      severity: "warning" as const,
      reference: {
        label: "NIL Rights Protection Guidelines",
        url: "https://ncaa.org/nil-rights-protection",
      },
    },
  ],
  c3: [
    {
      id: 1,
      title: "Pay-for-play violation",
      description:
        "Compensation structure directly ties payment to athletic performance, which is explicitly prohibited.",
      severity: "critical" as const,
      reference: {
        label: "NCAA Constitution 2.9",
        url: "https://ncaa.org/constitution-2-9",
      },
    },
    {
      id: 2,
      title: "Institutional involvement breach",
      description:
        "University appears to facilitate agreement in ways that exceed permitted institutional involvement.",
      severity: "critical" as const,
      reference: {
        label: "NCAA NIL Policy § 12.5.2.2",
        url: "https://ncaa.org/nil-policy-institutional",
      },
    },
  ],
}

const ITEMS_PER_PAGE = 10

const actionReasons = {
  approve: [
    "Contract meets all compliance requirements",
    "Terms are fair and reasonable",
    "All parties properly identified",
    "Payment structure is appropriate",
    "No red flags identified",
  ],
  escalate: [
    "Requires legal review",
    "Unusual payment terms",
    "High-value contract requiring additional approval",
    "Complex multi-party agreement",
    "Potential compliance concerns",
  ],
  deny: [
    "Non-compliant with NIL regulations",
    "Unfair terms to athlete",
    "Missing required documentation",
    "Missing required documentation",
    "Prohibited activities identified",
    "Conflict of interest detected",
    "Conflict of interest detected",
  ],
  upload: ["New Contract Upload"],
}

export function ContractManagement() {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingFileName, setProcessingFileName] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null)
  const [selectedContract, setSelectedContract] = useState<ContractAnalysis | null>(null)
  const [activeTab, setActiveTab] = useState("list")
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sportFilter, setSportFilter] = useState<string>("all")
  const [isUrgentCollapsed, setIsUrgentCollapsed] = useState(false) // Added state for urgent contracts collapse
  const [seasonFilters, setSeasonFilters] = useState<string[]>([])

  const [contractsViewTab, setContractsViewTab] = useState<"live" | "negotiation">("live")

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentAction, setCurrentAction] = useState<ActionType | null>(null)
  const [selectedReason, setSelectedReason] = useState("")
  const [customReason, setCustomReason] = useState("")

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  // AI Chat state
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "assistant" as const,
      content: "",
      timestamp: new Date(),
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  // Sidebar state tracking
  const { toggleSidebar, state: sidebarState } = useSidebar()
  const [sidebarWasExpanded, setSidebarWasExpanded] = useState(false)

  const router = useRouter()
  const { toast } = useToast() // Initialize toast

  // Add these state variables after the existing state declarations
  const [issueModalOpen, setIssueModalOpen] = useState(false)
  const [currentIssueAction, setCurrentIssueAction] = useState<"review" | "escalate" | null>(null)
  const [selectedIssue, setSelectedIssue] = useState<any>(null)
  const [issueComment, setIssueComment] = useState("")

  const [backgroundProcessing, setBackgroundProcessing] = useState<{ [key: string]: boolean }>({})

  const [activeContractTab, setActiveContractTab] = useState("terms-payouts")
  const [isEditScheduleModalOpen, setIsEditScheduleModalOpen] = useState(false)
  const [showAIChat, setShowAIChat] = useState(false)

  const [showPartiesResolution, setShowPartiesResolution] = useState(false)

  // Add this useEffect after the existing state declarations
  useEffect(() => {
    const handleResetView = () => {
      setActiveTab("list")
      setSelectedContract(null)
      setAnalysis(null)
      setIsChatOpen(false)
    }

    window.addEventListener("resetContractView", handleResetView)

    return () => {
      window.removeEventListener("resetContractView", handleResetView)
    }
  }, [])

  // Update welcome message when contract changes
  useEffect(() => {
    if (selectedContract) {
      setChatMessages([
        {
          id: 1,
          type: "assistant" as const,
          content: `Hello! I'm your Compliance Assistant for the "${selectedContract.fileName}". I can help answer questions about compliance issues, policy references, and suggest resolutions. How can I help you today?`,
          timestamp: new Date(),
        },
      ])
    }
  }, [selectedContract])

  // Handle sidebar state when chat opens/closes
  useEffect(() => {
    if (isChatOpen) {
      // Remember if sidebar was expanded before opening chat
      setSidebarWasExpanded(sidebarState === "expanded")
      // Collapse sidebar if it's expanded
      if (sidebarState === "expanded") {
        toggleSidebar()
      }
    } else {
      // Re-expand sidebar if it was expanded before opening chat
      if (sidebarWasExpanded && sidebarState === "collapsed") {
        toggleSidebar()
      }
    }
  }, [isChatOpen])

  const getStatusDotColor = (status?: ContractStatus | string) => {
    switch (status) {
      case "draft":
        return "bg-gray-400"
      case "in_review":
        return "bg-blue-500"
      case "approved":
        return "bg-green-500"
      case "active":
        return "bg-green-500"
      case "pending_signature":
        return "bg-amber-500"
      case "signed":
        return "bg-green-500"
      case "archived":
        return "bg-gray-500"
      case "completed":
        return "bg-teal-500"
      case "on_hold":
        return "bg-orange-500"
      default:
        return "bg-gray-400"
    }
  }

  const liveContracts = recentContracts.filter((contract) => {
    const isLive =
      contract.contractStatus === "signed" ||
      contract.contractStatus === "completed" ||
      contract.contractStatus === "on-hold" ||
      contract.contractStatus === "archived"
    return isLive
  })

  const negotiationContracts = recentContracts.filter((contract) => {
    const isNegotiation =
      contract.contractStatus === "draft" ||
      contract.contractStatus === "in_review" ||
      contract.contractStatus === "under_review" ||
      contract.contractStatus === "active" || // "active" means being worked on (with agent/legal)
      contract.contractStatus === "pending_signature" ||
      contract.contractStatus === "approved"
    return isNegotiation
  })

  const urgentContracts = recentContracts.filter((contract) => contract.urgencyLevel === "urgent")

  const urgentNegotiationCount = urgentContracts.filter((contract) => {
    const isNegotiation =
      contract.contractStatus === "draft" ||
      contract.contractStatus === "in_review" ||
      contract.contractStatus === "under_review" ||
      contract.contractStatus === "active" || // Added active status
      contract.contractStatus === "pending_signature" ||
      contract.contractStatus === "approved"
    return isNegotiation
  }).length

  const currentTabContracts = contractsViewTab === "live" ? liveContracts : negotiationContracts

  const urgentContractsForTab = urgentContracts.filter((contract) => {
    const isNegotiation =
      contract.contractStatus === "draft" ||
      contract.contractStatus === "in_review" ||
      contract.contractStatus === "under_review" ||
      contract.contractStatus === "active" ||
      contract.contractStatus === "pending_signature" ||
      contract.contractStatus === "approved"

    if (contractsViewTab === "negotiation") {
      return isNegotiation
    } else {
      return !isNegotiation
    }
  })

  const filteredContracts = recentContracts.filter((c) => {
    if (contractsViewTab === "negotiation") {
      if (c.urgencyLevel === "signed") return false
    }

    const matchesSearch =
      c.athlete?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sponsor?.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    if (statusFilter !== "all") {
      // Map general status filters to more specific contract statuses
      if (
        statusFilter === "draft_sent" &&
        c.contractStatus !== "draft" &&
        c.urgencyLevel !== "active" &&
        c.urgencyLevel !== "urgent"
      )
        return false
      if (statusFilter === "ready_to_sign" && c.urgencyLevel !== "ready") return false
      // Add more specific status mappings if needed
      if (statusFilter === "active" && c.contractStatus !== "active") return false
      if (statusFilter === "in_review" && c.contractStatus !== "in_review" && c.contractStatus !== "under_review")
        return false
      if (statusFilter === "approved" && c.contractStatus !== "approved") return false
      if (statusFilter === "pending_signature" && c.contractStatus !== "pending_signature") return false
      if (statusFilter === "signed" && c.contractStatus !== "signed") return false
      if (statusFilter === "completed" && c.contractStatus !== "completed") return false
      if (statusFilter === "archived" && c.contractStatus !== "archived") return false
      if (statusFilter === "on_hold" && c.contractStatus !== "on_hold") return false
    }

    if (sportFilter !== "all" && c.sport !== sportFilter) return false

    if (seasonFilters.length > 0 && c.season && !seasonFilters.includes(c.season)) return false

    return true
  })

  const totalPages = Math.ceil(filteredContracts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  // const endIndex = startIndex + ITEMS_PER_PAGE // Not used in new table rendering
  // const currentContracts = filteredContracts.slice(startIndex, startIndex + ITEMS_PER_PAGE) // Not used in new table rendering

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setProcessingFileName(file.name)
    setIsProcessing(true)
  }

  const handleProcessingComplete = (success: boolean, error?: string) => {
    setIsProcessing(false)
    setIsUploadModalOpen(false) // Close modal after processing completes

    if (success) {
      // Simulate successful analysis
      const newAnalysis = {
        id: `c${Date.now()}`,
        parties: ["Marcus Johnson", "University of Kentucky", "Nike Inc."],
        value: "$45,000",
        term: "12 months",
        status: ["pass", "fail", "needs_review"][Math.floor(Math.random() * 3)] as VettingStatus,
        uploadedAt: new Date().toISOString(),
        fileName: processingFileName,
        contractTitle: "New NIL Agreement",
        uploadedBy: "Current User",
        source: "System Upload",
        primaryParty: "Marcus Johnson",
        counterparty: "Nike Inc.",
        disbursementType: "Monthly",
        plannedDisbursements: 12,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        effectiveDate: new Date().toISOString().split("T")[0],
        riskLevel: "moderate" as const,
        lastReviewedBy: "System Analysis",
        uploadDate: new Date().toISOString(),
        completedDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Added
        contractType: "NIL",
        timeWithHolder: "0 days",
        contractStatus: "draft", // Set a default status for new uploads
      }
      setAnalysis(newAnalysis)
      setSelectedContract(newAnalysis)
      setActiveTab("details")
    } else {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error || "An unexpected error occurred during upload.",
      })
    }
  }

  const handlePartiesResolution = () => {
    setIsProcessing(false)
    setShowPartiesResolution(true)
  }

  const handlePartiesResolutionComplete = () => {
    setShowPartiesResolution(false)
    handleProcessingComplete(true)
  }

  const handlePartiesResolutionBack = () => {
    setShowPartiesResolution(false)
    setIsProcessing(true)
  }

  const handleContinueInBackground = () => {
    setIsProcessing(false)
    setIsUploadModalOpen(false) // Close modal when continuing in background
    setBackgroundProcessing((prev) => ({
      ...prev,
      [processingFileName]: true,
    }))
    toast({
      title: "Processing in background",
      description: `"${processingFileName}" is being processed in the background. You will be notified upon completion.`,
    })
  }

  const handleProcessingCancel = () => {
    setIsProcessing(false)
    setSelectedFile(null)
    setProcessingFileName("")
    toast({
      title: "Processing cancelled",
      description: "The contract processing was cancelled.",
    })
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0])
    }
  }

  const getStatusColor = (status: VettingStatus | ContractStatus | string) => {
    switch (status) {
      case "pass":
      case "active":
      case "approved":
        return "default" // Use 'default' for success states
      case "needs_review":
      case "under_review":
      case "in_review":
        return "secondary" // Use 'secondary' for review states
      case "fail":
        return "destructive" // Use 'destructive' for failure states
      case "processing":
      case "draft":
      case "pending_signature":
        return "outline" // Use 'outline' for intermediate states
      case "completed":
      case "signed":
        return "default" // Signed/completed are also success states
      case "paused":
      case "archived":
        return "outline" // Archived/paused are often neutral/inactive
      default:
        return "secondary" // Default fallback
    }
  }

  const getContractStatusBadge = (status?: ContractStatus) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "under_review":
        return <Badge variant="secondary">Under Review</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "completed":
        return <Badge variant="default">Completed</Badge>
      case "paused":
        return <Badge variant="outline">Paused</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: VettingStatus) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "needs_review":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case "fail":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "processing":
        return <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: VettingStatus | ContractStatus | string) => {
    switch (status) {
      case "draft":
        return "Draft"
      case "in_review":
        return "In Review"
      case "approved":
        return "Approved"
      case "active":
        return "Active"
      case "pending_signature":
        return "Pending Signature"
      case "signed":
        return "Signed"
      case "archived":
        return "Archived"
      case "completed":
        return "Completed"
      case "on_hold":
        return "On Hold"
      // Legacy vetting statuses
      case "pass":
        return "Approved"
      case "needs_review":
        return "In Review"
      case "fail":
        return "Needs Attention"
      case "processing":
        return "Processing"
      default:
        return "Unknown"
    }
  }

  const getRiskLevelBadge = (riskLevel: "low" | "moderate" | "high") => {
    switch (riskLevel) {
      case "low":
        return (
          <Badge variant="secondary" className="text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30">
            Low Risk
          </Badge>
        )
      case "moderate":
        return (
          <Badge
            variant="secondary"
            className="text-orange-700 bg-orange-100 dark:text-orange-300 dark:bg-orange-900/30"
          >
            Moderate Risk
          </Badge>
        )
      case "high":
        return <Badge variant="destructive">High Risk</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getDaysUntilPayment = (dateString?: string) => {
    if (!dateString) return null
    const paymentDate = new Date(dateString)
    const today = new Date()
    const diffTime = paymentDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const resetAnalysis = () => {
    setSelectedFile(null)
    setAnalysis(null)
    setSelectedContract(null)
    setActiveTab("list")
  }

  const viewContractDetails = (contract: ContractAnalysis) => {
    router.push(`/contracts/${contract.id}`)
  }

  const handleUploadNew = () => {
    setSelectedContract(null)
    setAnalysis(null)
    setIsUploadModalOpen(true)
  }

  const resetUploadModal = () => {
    setSelectedFile(null)
    setAnalysis(null)
    setIsUploading(false)
    setDragActive(false)
    setIsUploadModalOpen(false)
  }

  const handleActionClick = (action: ActionType) => {
    setCurrentAction(action)
    setSelectedReason("")
    setCustomReason("")
    setIsModalOpen(true)
  }

  const handleModalConfirm = () => {
    if (!selectedReason && !customReason.trim()) {
      return // Don't allow confirmation without a reason
    }

    // Here you would typically make an API call to process the action
    console.log(`${currentAction} action confirmed with reason:`, selectedReason || customReason)

    setIsModalOpen(false)
    setCurrentAction(null)
    setSelectedReason("")
    setCustomReason("")

    if (currentAction === "upload") {
      setIsUploadModalOpen(true)
    }
  }

  const isConfirmDisabled = !selectedReason && !customReason.trim()

  const getActionTitle = (action: ActionType | null) => {
    switch (action) {
      case "approve":
        return "Approve Contract"
      case "escalate":
        return "Escalate Contract"
      case "deny":
        return "Deny Contract"
      case "upload":
        return "Upload New Contract"
      default:
        return ""
    }
  }

  const getActionDescription = (action: ActionType | null) => {
    switch (action) {
      case "approve":
        return "Please provide a reason for approving this contract."
      case "escalate":
        return "Please provide a reason for escalating this contract for further review."
      case "deny":
        return "Please provide a reason for denying this contract."
      case "upload":
        return "To upload a new contract, please provide a reason."
      default:
        return ""
    }
  }

  const getSeverityDot = (severity: "warning" | "critical") => {
    switch (severity) {
      case "warning":
        return <div className="w-2 h-2 rounded-full bg-orange-500" />
      case "critical":
        return <div className="w-2 h-2 rounded-full bg-red-500" />
    }
  }

  const getSeverityBadge = (severity: "warning" | "critical") => {
    switch (severity) {
      case "warning":
        return (
          <Badge
            variant="secondary"
            className="text-orange-700 bg-orange-100 dark:text-orange-300 dark:bg-orange-900/30"
          >
            Warning
          </Badge>
        )
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
    }
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMessage = {
      id: chatMessages.length + 1,
      type: "user" as const,
      content: chatInput,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: chatMessages.length + 2,
        type: "assistant" as const,
        content: generateAIResponse(chatInput),
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (question: string) => {
    const responses = [
      "Based on the contract analysis, this appears to be a standard NIL agreement with typical terms for athlete endorsements.",
      "The payment structure follows industry standards, with monthly disbursements over the contract term.",
      "I notice the contract includes standard termination clauses that protect both parties' interests.",
      "The intellectual property rights are clearly defined, giving the sponsor specific usage rights while protecting the athlete's broader image rights.",
      "This contract appears to comply with current NCAA NIL regulations, though I recommend reviewing the latest guidelines.",
      "The flagged clause contains language that could be interpreted as tying compensation to athletic performance, which violates NCAA NIL policy section 12.5.2.1.",
      "Kentucky's rules on royalty splits require clear documentation of percentage allocations and cannot exceed fair market value for services rendered.",
      "Rule §3.1 specifically prohibits institutional involvement in facilitating or negotiating NIL deals, which appears to be violated in section 4 of this contract.",
      "I recommend addressing the critical compliance issues before proceeding, particularly the payment structure that could be interpreted as pay-for-play.",
      "The contract risk assessment indicates medium-high risk due to multiple compliance issues that could affect athlete eligibility.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleBackToList = () => {
    setActiveTab("list")
    setSelectedContract(null)
    setAnalysis(null)
    setIsChatOpen(false)
  }

  const handleDownloadContract = () => {
    // Simulate contract download
    console.log("Downloading contract:", selectedContract?.fileName)
    // In a real implementation, this would trigger a file download
  }

  const toggleChatPanel = () => {
    setIsChatOpen(!isChatOpen)
  }

  // Add these functions after the existing handler functions
  const handleIssueAction = (action: "review" | "escalate", issue: any) => {
    setCurrentIssueAction(action)
    setSelectedIssue(issue)
    setIssueComment("")
    setIssueModalOpen(true)
  }

  const handleIssueModalConfirm = () => {
    if (!issueComment.trim()) {
      return // Don't allow confirmation without a comment
    }

    // Here you would typically make an API call to process the issue action
    console.log(
      `${currentIssueAction} action confirmed for issue:`,
      selectedIssue?.title,
      "with comment:",
      issueComment,
    )

    setIssueModalOpen(false)
    setCurrentIssueAction(null)
    setSelectedIssue(null)
    setIssueComment("")
  }

  const getIssueActionTitle = (action: "review" | "escalate" | null) => {
    switch (action) {
      case "review":
        return "Mark Issue as Reviewed"
      case "escalate":
        return "Escalate Issue"
      default:
        return ""
    }
  }

  const getIssueActionDescription = (action: "review" | "escalate" | null) => {
    switch (action) {
      case "review":
        return "Please provide comments on your review of this compliance issue."
      case "escalate":
        return "Please provide a reason for escalating this issue for further review."
      default:
        return ""
    }
  }

  const formatCurrentHolder = (contract: EnhancedContract) => {
    const holder = contract.currentHolder || "—"
    const days = contract.daysWithHolder || 0
    const sentDate = contract.sentDate || ""

    if (holder === "All parties approved") {
      return {
        text: "All parties approved",
        color: "text-green-600",
        days: 0,
        sentDate: "",
        lastActivity: contract.lastActivity || "",
      }
    }
    if (holder === "Signed") {
      return {
        text: "Signed",
        color: "text-gray-500",
        days: 0,
        sentDate: "",
        lastActivity: contract.lastActivity || "",
      }
    }
    if (holder === "Under Review") {
      return { text: "Under Review", color: "text-default", days, sentDate, lastActivity: contract.lastActivity || "" }
    }

    return { text: `With ${holder}`, color: "text-default", days, sentDate, lastActivity: contract.lastActivity || "" }
  }

  const renderContractDetails = (contract: ContractAnalysis) => {
    const complianceIssues = mockComplianceIssues[contract.id as keyof typeof mockComplianceIssues] || []

    // Generate contract summary
    const generateContractSummary = (contract: Contract) => {
      // Use Contract type
      const primaryParty = contract.primaryParty || contract.parties[0]
      const counterparty = contract.counterparty || contract.parties[contract.parties.length - 1]
      const disbursementType = contract.disbursementType || contract.paymentFrequency

      return `This NIL agreement establishes ${disbursementType.toLowerCase()} payments of ${contract.value} from ${counterparty} to ${primaryParty} over ${contract.term} in exchange for promotional activities and brand representation.`
    }

    const handleDownloadReport = () => {
      if (!selectedContract) return

      // Generate report content
      const reportContent = generateReportContent(selectedContract, complianceIssues)

      // Create and download file
      const blob = new Blob([reportContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${selectedContract.fileName.replace(".pdf", "")}_compliance_report.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    const handleEmailReport = () => {
      // Simple email capture - could be enhanced with a modal
      const email = prompt("Enter your email address to receive the compliance summary:")
      if (email && selectedContract) {
        console.log(`Sending report for ${selectedContract.fileName} to}`)
        // In real implementation, this would call an API
        alert("Report will be sent to your email shortly!")
      }
    }

    const generateReportContent = (contract: Contract, issues: any[]) => {
      // Use Contract type
      const riskLevel = issues.length === 0 ? "Low Risk" : issues.length <= 2 ? "Moderate Risk" : "High Risk"

      return `
          <!DOCTYPE html>
          <html>
          <head>
            <title>NIL Contract Compliance Report</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
              .section { margin-bottom: 30px; }
              .risk-badge { padding: 4px 12px; border-radius: 12px; font-weight: bold; }
              .low-risk { background: #dcfce7; color: #166534; }
              .moderate-risk { background: #fef3c7; color: #92400e; }
              .high-risk { background: #fecaca; color: #991b1b; }
              .issue { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
              .critical { border-left: 4px solid #ef4444; }
              .warning { border-left: 4px solid #f59e0b; }
              .policy-list { list-style: none; padding: 0;
              }
              .policy-list li { padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
              .policy-list li:last-child { border-bottom: none; }
              .checkmark { color: #10b981; margin-right: 8px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>NIL Contract Compliance Report</h1>
              <p>Generated by Analog's Legal Assistant</p>
              <p><strong>Contract:</strong> ${contract.fileName}</p>
              <p><strong>Analysis Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="section">
              <h2>Compliance Review Scope</h2>
              <p>The contract was analyzed against the following policies and legal frameworks:</p>
              <ul class="policy-list">
                <li><span class="checkmark">✓</span> Trump Executive Order – "Saving College Sports" (July 2025)</li>
                <li><span class="checkmark">✓</span> NCAA NIL Guidelines (June 2025)</li>
                <li><span class="checkmark">✓</span> Florida State NIL Law (HB 7051)</li>
                <li><span class="checkmark">✓</span> California SB 26</li>
                <li><span class="checkmark">✓</span> Texas HB 2804</li>
                <li><span class="checkmark">✓</span> Additional federal and state policies</li>
              </ul>
            </div>
            
            <div class="section">
              <h2>Risk Assessment</h2>
              <span class="risk-badge ${riskLevel.toLowerCase().replace(" ", "-")}">${riskLevel}</span>
              <p>${issues.length === 0 ? "No compliance issues detected." : `${issues.length} compliance issue${issues.length !== 1 ? "s" : ""} identified.`}</p>
            </div>
            
            <div class="section">
              <h2>Contract Summary</h2>
              <ul>
                <li><strong>Value:</strong> ${contract.value}</li>
                <li><strong>Term:</strong> ${contract.term}</li>
                <li><strong>Payment Frequency:</strong> ${contract.paymentFrequency}</li>
                <li><strong>Parties:</strong> ${contract.parties.join(", ")}</li>
              </ul>
            </div>
            
            <div class="section">
              <h2>Compliance Issues</h2>
              ${
                issues.length === 0
                  ? "<p>No issues found. This contract appears to comply with current NIL regulations.</p>"
                  : issues
                      .map(
                        (issue) => `
              <div class="issue ${issue.severity}">
                <h3>${issue.title}</h3>
                <p><strong>Severity:</strong> ${issue.severity === "critical" ? "Critical" : "Warning"}</p>
                <p><strong>Description:</strong> ${issue.description}</p>
                <p><strong>Policy Reference:</strong> ${issue.reference.label}</p>
              </div>
            `,
                      )
                      .join("")
              }
        </div>
        
        <div class="section">
          <h2>Next Steps</h2>
          <p>Review the flagged issues with legal counsel before contract execution. For questions about NIL compliance, contact Analog at compliance@analog.com</p>
        </div>
        
        <footer style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666;">
          <p>Report generated by Analog Financial Infrastructure Platform</p>
          <p>Visit analog.com for comprehensive NIL contract management solutions</p>
        </footer>
      </body>
      </html>
    `
    }

    const mockDisbursements = [
      {
        id: 1,
        title: "Signing bonus (25%)",
        amount: "$12,500",
        dueDate: "2024-01-15",
        type: "upfront",
        status: "completed",
        verificationDetails: "Bank verification • TXN-001",
        conditions: [],
      },
      {
        id: 2,
        title: "Season start milestone",
        amount: "$15,000",
        dueDate: "2024-08-15",
        type: "milestone",
        status: "completed",
        verificationDetails: "Coach certification • TXN-002",
        conditions: ["Coach certification", "≥ 3.0 GPA"],
      },
      {
        id: 3,
        title: "Mid-season performance",
        amount: "$10,000",
        dueDate: "2024-11-01",
        type: "milestone",
        status: "pending",
        verificationDetails: "Verification Pending",
        conditions: ["≥ 500 social media engagements", "Attend 2 promotional events"],
      },
      {
        id: 4,
        title: "Season completion bonus",
        amount: "$12,500",
        dueDate: "2025-03-15",
        type: "completion",
        status: "pending",
        verificationDetails: "Verification Pending",
        conditions: ["Complete full season", "Maintain eligibility"],
      },
    ]

    const totalAmount = 50000
    const disbursedAmount = 27500
    const progressPercentage = (disbursedAmount / totalAmount) * 100

    const nextDisbursement = mockDisbursements.find((d) => d.status === "pending")

    const getTypeColor = (type: string) => {
      switch (type) {
        case "upfront":
          return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
        case "milestone":
          return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
        case "completion":
          return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
        case "recurring":
          return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
        default:
          return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
      }
    }

    const getStatusColor = (status: string) => {
      switch (status) {
        case "completed":
          return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
        case "pending":
          return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
        case "blocked":
          return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
        default:
          return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
      }
    }

    return (
      <div className="space-y-6">
        <div className="border rounded-lg p-4 mb-6 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <h3 className="font-semibold">Contract Overview</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Download Contract
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowAIChat(!showAIChat)} className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Chat with AI
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Contract Summary</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{generateContractSummary(contract)}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge
                    variant={
                      contract.status === "active"
                        ? "default"
                        : contract.status === "needs_review"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {contract.status === "needs_review" ? "Needs Review" : contract.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Upload Date</span>
                  <span className="text-sm">
                    {contract.uploadDate ? new Date(contract.uploadDate).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Source</span>
                  <span className="text-sm">{contract.sponsor}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Uploaded By</span>
                  <span className="text-sm">Reid Butler, University Admin</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Flagged Issues</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-red-600">{complianceIssues.length} Issues found</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Reviewed By</span>
                  <span className="text-sm">Reid Butler</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-sm">Disbursement Progress</h4>
              <span className="text-sm font-medium">{progressPercentage.toFixed(0)}% complete</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mb-3">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Disbursed: ${disbursedAmount.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">Total: ${totalAmount.toLocaleString()}</span>
              {nextDisbursement && (
                <div className="text-right">
                  <div className="text-sm font-semibold">{nextDisbursement.amount}</div>
                  <div className="text-xs text-muted-foreground">
                    Due {new Date(nextDisbursement.dueDate).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeContractTab} onValueChange={setActiveContractTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="terms-payouts">Terms & Payouts</TabsTrigger>
            <TabsTrigger value="permissibility">Permissibility</TabsTrigger>
          </TabsList>

          {/* Terms & Payouts Tab */}
          <TabsContent value="terms-payouts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Schedule Card */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Schedule</h4>
                      <Button variant="outline" size="sm" onClick={() => setIsEditScheduleModalOpen(true)}>
                        Edit Schedule
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {mockDisbursements.map((disbursement, index) => (
                        <div key={disbursement.id} className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium flex-shrink-0">
                            {disbursement.status === "completed" ? <CheckCircle className="w-4 h-4" /> : index + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h5 className="font-medium text-sm">{disbursement.title}</h5>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground">
                                    Due {new Date(disbursement.dueDate).toLocaleDateString()}
                                  </span>
                                  <Badge variant="outline" className={`text-xs ${getTypeColor(disbursement.type)}`}>
                                    {disbursement.type}
                                  </Badge>
                                </div>
                              </div>

                              <div className="text-right flex-shrink-0">
                                <div className="font-semibold">{disbursement.amount}</div>
                                <Badge
                                  variant="outline"
                                  className={`text-xs mt-1 ${getStatusColor(disbursement.status)}`}
                                >
                                  {disbursement.status === "completed"
                                    ? "Completed"
                                    : disbursement.status === "pending"
                                      ? "Pending"
                                      : "Blocked"}
                                </Badge>
                              </div>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View details</DropdownMenuItem>
                                  <DropdownMenuItem>Edit</DropdownMenuItem>
                                  <DropdownMenuItem>Mark as complete</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">Cancel item</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            {disbursement.status === "completed" && (
                              <div className="text-xs text-muted-foreground mt-2">
                                {disbursement.verificationDetails}
                              </div>
                            )}

                            {disbursement.conditions.length > 0 && (
                              <div className="mt-2">
                                <span className="text-xs text-muted-foreground">Conditions:</span>
                                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                                  {disbursement.conditions.map((condition, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                                      {condition}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Rail - Contract Lifecycle and Statistics */}
              <div className="hidden lg:block space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-medium mb-4">Contract Lifecycle</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-sm">Contract Uploaded</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-sm">Legal Review Complete</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-sm">Awaiting Execution</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                        <span className="text-sm text-muted-foreground">Performance Tracking</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-medium mb-4">Contract Statistics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Days Active</span>
                        <span className="text-sm font-medium">45</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Amendments</span>
                        <span className="text-sm font-medium">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Reviews</span>
                        <span className="text-sm font-medium">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Last Activity</span>
                        <span className="text-sm font-medium">2 days ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="permissibility" className="space-y-6">
            <EnhancedPermissibilityReview contractId={contract.id} />
          </TabsContent>
        </Tabs>

        {/* Edit Schedule Modal */}
        <Dialog open={isEditScheduleModalOpen} onOpenChange={setIsEditScheduleModalOpen}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Schedule</DialogTitle>
              <DialogDescription>
                Modify disbursement schedule. Total amounts must equal contract value and dates must be within contract
                term.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Beneficiary Split
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockDisbursements.map((disbursement, index) => (
                      <tr key={disbursement.id} className="border-b">
                        <td className="p-4">
                          <input
                            type="date"
                            defaultValue={disbursement.dueDate}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                          />
                        </td>
                        <td className="p-4">
                          <input
                            type="text"
                            defaultValue={disbursement.amount.replace("$", "").replace(",", "")}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            placeholder="0.00"
                          />
                        </td>
                        <td className="p-4">
                          <select
                            defaultValue={disbursement.type}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                          >
                            <option value="upfront">Upfront</option>
                            <option value="milestone">Milestone</option>
                            <option value="completion">Completion</option>
                            <option value="recurring">Recurring</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <Input
                            type="text"
                            defaultValue="50/50"
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            placeholder="50/50"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Function to toggle season filters
  const toggleSeasonFilter = (season: string) => {
    setSeasonFilters((prev) => (prev.includes(season) ? prev.filter((s) => s !== season) : [...prev, season]))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Contract</DialogTitle>
            <DialogDescription>
              Upload a new contract for analysis. We support PDF, DOCX, and TXT formats.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col space-y-4">
            {isProcessing ? (
              <ContractProcessing
                fileName={processingFileName}
                onComplete={handleProcessingComplete}
                onCancel={handleProcessingCancel}
                onContinueInBackground={handleContinueInBackground}
                onPartiesResolution={handlePartiesResolution}
              />
            ) : (
              <>
                {showPartiesResolution ? (
                  <PartiesResolution
                    onComplete={handlePartiesResolutionComplete}
                    onBack={handlePartiesResolutionBack}
                  />
                ) : (
                  <>
                    <div
                      className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center ${
                        dragActive ? "border-primary bg-accent" : "border-muted-foreground/50"
                      }`}
                      onDragEnter={() => setDragActive(true)}
                      onDragLeave={() => setDragActive(false)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                    >
                      <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Drag and drop your file here or{" "}
                        <label htmlFor="file-upload" className="text-primary cursor-pointer">
                          browse
                        </label>
                      </p>
                      <Input type="file" id="file-upload" className="hidden" onChange={handleFileInputChange} />
                    </div>
                    {selectedFile && (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Selected file: {selectedFile.name}</p>
                        <Button variant="outline" size="sm" onClick={() => setSelectedFile(null)}>
                          Remove
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          <DialogFooter>
            <Button type="button" onClick={resetUploadModal} variant="secondary">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{getActionTitle(currentAction)}</DialogTitle>
            <DialogDescription>{getActionDescription(currentAction)}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {currentAction !== "upload" && ( // Only show reason selection for approve/escalate/deny
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reason" className="text-right">
                    Reason
                  </Label>
                  <Select onValueChange={setSelectedReason} defaultValue={selectedReason}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentAction &&
                        currentAction !== "upload" && // Ensure currentAction is not null before accessing actionReasons
                        actionReasons[currentAction]?.map(
                          (
                            reason, // Added ?. for safety
                          ) => (
                            <SelectItem key={reason} value={reason}>
                              {reason}
                            </SelectItem>
                          ),
                        )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customReason" className="text-right">
                    Custom Reason
                  </Label>
                  <Input
                    type="text"
                    id="customReason"
                    placeholder="Enter custom reason"
                    className="col-span-3"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                  />
                </div>
              </>
            )}
            {currentAction === "upload" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="uploadReason" className="text-right">
                  Reason
                </Label>
                <Select onValueChange={setSelectedReason} defaultValue={selectedReason}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {actionReasons.upload.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleModalConfirm} disabled={isConfirmDisabled}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Issue Action Modal */}
      <Dialog open={issueModalOpen} onOpenChange={setIssueModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{getIssueActionTitle(currentIssueAction)}</DialogTitle>
            <DialogDescription>{getIssueActionDescription(currentIssueAction)}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="issueComment" className="text-right">
                Comment
              </Label>
              <Textarea
                id="issueComment"
                placeholder="Enter your comments"
                className="col-span-3"
                value={issueComment}
                onChange={(e) => setIssueComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIssueModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleIssueModalConfirm} disabled={!issueComment.trim()}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="md:hidden">
        <Button variant="outline" size="icon" onClick={toggleSidebar}>
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {activeTab === "list" && (
        <>
          {/* Contract Count, Export, Upload button */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-muted-foreground" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Contracts</h1>
                {/* <p className="text-sm text-muted-foreground">{filteredContracts.length} total contracts</p> */}
                <p className="text-sm text-muted-foreground">{recentContracts.length} total contracts</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                onClick={() => {
                  handleActionClick("upload")
                }}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Contract
              </Button>
            </div>
          </div>

          <Tabs
            value={contractsViewTab}
            onValueChange={(value) => setContractsViewTab(value as "live" | "negotiation")}
            className="mb-6"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="live" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Live Contracts ({liveContracts.length})
              </TabsTrigger>
              <TabsTrigger value="negotiation" className="flex items-center gap-2 relative">
                <FileText className="w-4 h-4" />
                In Negotiation ({negotiationContracts.length})
                {urgentNegotiationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {urgentNegotiationCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Filter Section */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft_sent">Draft Sent</SelectItem>
                  <SelectItem value="ready_to_sign">Ready to Sign</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-[150px] justify-between bg-transparent">
                    {seasonFilters.length > 0 ? `Season (${seasonFilters.length})` : "All Seasons"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuCheckboxItem
                    checked={seasonFilters.includes("2024-25")}
                    onCheckedChange={() => toggleSeasonFilter("2024-25")}
                  >
                    2024-25
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={seasonFilters.includes("2025-26")}
                    onCheckedChange={() => toggleSeasonFilter("2025-26")}
                  >
                    2025-26
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={seasonFilters.includes("2026-27")}
                    onCheckedChange={() => toggleSeasonFilter("2026-27")}
                  >
                    2026-27
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={seasonFilters.includes("2027-28")}
                    onCheckedChange={() => toggleSeasonFilter("2027-28")}
                  >
                    2027-28
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Select value={sportFilter} onValueChange={setSportFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  <SelectItem value="Football">Football</SelectItem>
                  <SelectItem value="Basketball">Basketball</SelectItem>
                  <SelectItem value="Soccer">Soccer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {urgentContractsForTab.length > 0 && (
            <div className="space-y-4">
              <div
                className="flex items-center justify-between mb-4 cursor-pointer group"
                onClick={() => setIsUrgentCollapsed(!isUrgentCollapsed)}
              >
                <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                  URGENT ({urgentContractsForTab.length}) - Need attention now
                </h3>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  {isUrgentCollapsed ? (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      Expand
                    </>
                  ) : (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      Collapse
                    </>
                  )}
                </Button>
              </div>

              {!isUrgentCollapsed && (
                <div className="border border-red-200 rounded-lg bg-red-50/50 p-4">
                  <TooltipProvider>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[120px]">Status</TableHead>
                          <TableHead className="w-[250px]">Athlete</TableHead>
                          <TableHead>Contract Type</TableHead>
                          <TableHead>Sport</TableHead>
                          <TableHead>Season(s)</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Version</TableHead>
                          <TableHead>Current Holder</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {urgentContractsForTab.map((contract) => {
                          const holderInfo = formatCurrentHolder(contract)
                          return (
                            <TableRow
                              key={contract.id}
                              className="cursor-pointer hover:bg-accent/50"
                              onClick={() => router.push(`/contracts/${contract.id}`)}
                            >
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-2 h-2 rounded-full ${getStatusDotColor(contract.contractStatus)}`}
                                    title={getStatusLabel(contract.contractStatus || "")}
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-muted-foreground" />
                                  <span>{contract.athlete || contract.fileName}</span>
                                </div>
                              </TableCell>
                              <TableCell>{contract.contractType || "—"}</TableCell>
                              <TableCell>
                                {contract.sport ? <Badge variant="outline">{contract.sport}</Badge> : "—"}
                              </TableCell>
                              <TableCell>{contract.season || "—"}</TableCell>
                              <TableCell className="font-semibold">{contract.value}</TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="font-mono text-xs">
                                  v{contract.version || "1.0"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className={holderInfo.color}>{holderInfo.text}</span>
                                    {holderInfo.days > 0 && (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Badge
                                            variant="secondary"
                                            className={`${
                                              holderInfo.days >= 6
                                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                                : "bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-300"
                                            } cursor-help`}
                                          >
                                            [{holderInfo.days} days]
                                          </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>
                                            Sent to {contract.currentHolder} on{" "}
                                            {new Date(holderInfo.sentDate).toLocaleDateString("en-US", {
                                              month: "numeric",
                                              day: "numeric",
                                              year: "numeric",
                                            })}
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    )}
                                  </div>
                                  {holderInfo.lastActivity && (
                                    <div className="text-sm text-muted-foreground mt-1">{holderInfo.lastActivity}</div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    router.push(`/contracts/${contract.id}`)
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TooltipProvider>
                </div>
              )}
            </div>
          )}

          {/* All Contracts Table */}
          {filteredContracts.length > 0 ? (
            <TooltipProvider>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[250px]">Athlete</TableHead>
                    <TableHead>Contract Type</TableHead>
                    <TableHead>Sport</TableHead>
                    <TableHead>Season(s)</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Current Holder</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.slice(startIndex, startIndex + ITEMS_PER_PAGE).map((contract) => {
                    const holderInfo = formatCurrentHolder(contract)
                    return (
                      <TableRow
                        key={contract.id}
                        className="cursor-pointer hover:bg-accent/50"
                        onClick={() => router.push(`/contracts/${contract.id}`)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${getStatusDotColor(contract.contractStatus)}`}
                              title={getStatusLabel(contract.contractStatus || "")}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span>{contract.athlete || contract.fileName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{contract.contractType || "—"}</TableCell>
                        <TableCell>
                          {contract.sport ? <Badge variant="outline">{contract.sport}</Badge> : "—"}
                        </TableCell>
                        <TableCell>{contract.season || "—"}</TableCell>
                        <TableCell className="font-semibold">{contract.value}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-mono text-xs">
                            v{contract.version || "1.0"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={holderInfo.color}>{holderInfo.text}</span>
                              {holderInfo.days > 0 && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge
                                      variant="secondary"
                                      className={`${
                                        holderInfo.days >= 6
                                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                          : "bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-300"
                                      } cursor-help`}
                                    >
                                      [{holderInfo.days} days]
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      Sent to {contract.currentHolder} on{" "}
                                      {new Date(holderInfo.sentDate).toLocaleDateString("en-US", {
                                        month: "numeric",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                            {holderInfo.lastActivity && (
                              <div className="text-sm text-muted-foreground mt-1">{holderInfo.lastActivity}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/contracts/${contract.id}`)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TooltipProvider>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No contracts found matching your filters.</p>
            </div>
          )}
        </>
      )}

      {activeTab === "details" && selectedContract && (
        <>
          <div className="md:flex md:items-start md:justify-between md:space-x-4">
            <div className="w-full">
              <div className="mb-4 flex items-center justify-between">
                <Button variant="ghost" onClick={handleBackToList}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to List
                </Button>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={() => handleActionClick("approve")}>
                    Approve
                  </Button>
                  <Button variant="secondary" onClick={() => handleActionClick("escalate")}>
                    Escalate
                  </Button>
                  <Button variant="destructive" onClick={() => handleActionClick("deny")}>
                    Deny
                  </Button>
                </div>
              </div>
              {renderContractDetails(selectedContract)}
            </div>

            {showAIChat && (
              <div className="w-full md:w-96">
                <div className="border rounded-lg p-4 mb-6 bg-white dark:bg-gray-900">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      <h3 className="font-semibold">Compliance Assistant</h3>
                    </div>
                    <Button variant="ghost" size="sm" onClick={toggleChatPanel}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-400/50 scrollbar-track-gray-50 dark:scrollbar-thumb-gray-500/50 dark:scrollbar-track-gray-700 p-3 -m-3">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex flex-col ${message.type === "user" ? "items-end" : "items-start"}`}
                        >
                          <div
                            className={`rounded-md px-3 py-2 text-sm max-w-[240px] w-fit ${
                              message.type === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            {message.content}
                          </div>
                          <span className="text-xs text-muted-foreground mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex items-start">
                          <div className="rounded-md px-3 py-2 text-sm max-w-[240px] w-fit bg-secondary text-secondary-foreground">
                            Typing...
                          </div>
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleChatSubmit}>
                      <div className="flex rounded-md border border-input">
                        <Input
                          type="text"
                          placeholder="Ask a question..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          className="border-none shadow-none focus-visible:ring-0"
                        />
                        <Button type="submit" size="sm" className="rounded-l-none">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
