"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Search,
  Filter,
  Send,
  Eye,
  MoreHorizontal,
  Download,
  X,
  Edit,
  Star,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { ContractFilters } from "./contracts2/contract-filters"
import { useRouter } from "next/navigation"
import { ContractWorkflowUploadModal } from "./contracts2/contract-workflow-upload-modal"
import { StatusChangeModal } from "./contracts2/status-change-modal"
import { ChangeHolderModal } from "./contracts2/change-holder-modal"
import { ContractWorkflowProvider, useContractWorkflow } from "@/lib/contract-workflow-context"
import { ProcessingStage } from "./contracts2/processing-stage"
import { ReviewStage } from "./contracts2/review-stage"
import { ActivationStage } from "./contracts2/activation-stage"
import { MultiSelect } from "@/components/ui/multi-select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"

type NegotiationStatus =
  | "draft-sent"
  | "in-redlining"
  | "internal-review" // Changed from "awaiting-conference"
  | "final-review"
  | "ready-to-sign"
  | "executed"

interface NegotiationStatusConfig {
  [key: string]: {
    label: string
    color: string
  }
}

interface ContractParticipant {
  id: string
  name: string
  role: "athlete" | "agent" | "athlete-counsel" | "university" | "university-counsel" | "sponsor"
  email: string
  lastAction?: string
  lastActionDate?: string
}

interface ContractVersion {
  id: string
  versionNumber: number
  uploadedDate: string
  uploadedBy: string
  uploadMethod: "email" | "manual"
  fileName: string
  sentTo?: string
  receivedFrom?: string
  changes?: string
  fileUrl?: string
}

interface ContractObligation {
  id: string
  amount: number
  recipient: string
  type: "one-time" | "recurring" | "milestone" | "conditional"
  status: "extracted" | "confirmed" | "edited" | "queued"
  dueDate?: string
  description: string
}

interface Contract {
  id: string
  title: string
  athlete: string
  athleteId: string
  source: "university" | "sponsor"
  agencyName: string
  negotiationStatus: NegotiationStatus
  currentHolder: string
  daysWithHolder: number
  totalValue: number
  startDate: string
  endDate: string
  participants: ContractParticipant[]
  versions: ContractVersion[]
  obligations?: ContractObligation[]
  obligationsCount?: number
  lastActivity: string
  lastActivityDate: string
  sport?: string
  isUrgent: boolean
  emailAddress?: string
  signedDate?: string
  flagged?: boolean // Added flagged property to track important contracts
  contractType?: "Revenue Share" | "Termination" | "NIL Contract"
  category?: "New Recruit" | "Transfer" | "Retention" | "Termination"
  lastUpdated: string // Added lastUpdated for the signedThisWeek calculation
  season?: string // Added season field for season filter
}

const mockContracts: Contract[] = [
  {
    id: "1",
    title: "2025-26 Benefits Pool Agreement",
    athlete: "Marcus Williams",
    athleteId: "ATH001",
    source: "university",
    agencyName: "Excel Sports",
    negotiationStatus: "in-redlining",
    currentHolder: "With Agent",
    daysWithHolder: 3,
    totalValue: 425000,
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    lastActivity: "Agent reviewing payment schedule structure",
    lastActivityDate: "2025-01-05",
    sport: "Football",
    isUrgent: false,
    flagged: false,
    contractType: "Revenue Share", // Updated type
    category: "Retention", // Updated category
    participants: [],
    versions: [],
    lastUpdated: "2d ago",
    season: "2025-26", // Added season
  },
  {
    id: "2",
    title: "Revenue Share - Transfer Portal",
    athlete: "Tyler Davis",
    athleteId: "ATH002",
    source: "university",
    agencyName: "CAA",
    negotiationStatus: "draft-sent",
    currentHolder: "With Athlete",
    daysWithHolder: 1,
    totalValue: 650000,
    startDate: "2025-06-01",
    endDate: "2026-05-31",
    lastActivity: "Draft sent to athlete for initial review",
    lastActivityDate: "2025-01-09",
    sport: "Football",
    isUrgent: false,
    flagged: false,
    contractType: "Revenue Share", // Updated type
    category: "Transfer", // Updated category
    participants: [],
    versions: [],
    lastUpdated: "1d ago",
    season: "2025-26", // Added season
  },
  {
    id: "3",
    title: "Roster Retention - Benefits Pool",
    athlete: "Brandon Smith",
    athleteId: "ATH003",
    source: "university",
    agencyName: "Wasserman",
    negotiationStatus: "internal-review",
    currentHolder: "With Big Ten",
    daysWithHolder: 6,
    totalValue: 385000,
    startDate: "2025-02-01",
    endDate: "2025-11-30",
    lastActivity: "Awaiting Big Ten approval for roster eligibility terms",
    lastActivityDate: "2025-01-02",
    sport: "Men's Basketball",
    isUrgent: true,
    flagged: true,
    contractType: "Revenue Share", // Updated type
    category: "Retention", // Updated category
    participants: [],
    versions: [],
    lastUpdated: "3d ago",
    season: "2024-25", // Added season
  },
  {
    id: "4",
    title: "Transfer Portal Recruitment Package",
    athlete: "Jake Martinez",
    athleteId: "ATH004",
    source: "university",
    agencyName: "CAA",
    negotiationStatus: "ready-to-sign",
    currentHolder: "With Athlete",
    daysWithHolder: 1,
    totalValue: 520000,
    startDate: "2025-02-15",
    endDate: "2026-02-14",
    lastActivity: "All parties ready to sign",
    lastActivityDate: "2025-01-09",
    sport: "Football",
    isUrgent: false,
    flagged: false,
    contractType: "Revenue Share", // Updated type
    category: "Transfer", // Updated category
    participants: [],
    versions: [],
    lastUpdated: "1d ago",
    season: "2024-25", // Added season
  },
  {
    id: "5",
    title: "2025 Scholarship Package",
    athlete: "Sarah Johnson",
    athleteId: "ATH005",
    source: "university",
    agencyName: "Excel Sports",
    negotiationStatus: "final-review",
    currentHolder: "With Agent",
    daysWithHolder: 2,
    totalValue: 295000,
    startDate: "2025-08-01",
    endDate: "2026-05-31",
    lastActivity: "Final review of academic eligibility clauses",
    lastActivityDate: "2025-01-06",
    sport: "Volleyball",
    isUrgent: false,
    flagged: false,
    contractType: "Revenue Share", // Updated type
    category: "New Recruit", // Updated category
    participants: [],
    versions: [],
    lastUpdated: "2d ago",
    season: "2025-26", // Added season
  },
  {
    id: "6",
    title: "NIL Collective - Multi-Year",
    athlete: "Chris Anderson",
    athleteId: "ATH006",
    source: "university",
    agencyName: "Octagon",
    negotiationStatus: "in-redlining",
    currentHolder: "With Agent",
    daysWithHolder: 8,
    totalValue: 780000,
    startDate: "2025-01-01",
    endDate: "2027-12-31",
    lastActivity: "Agent negotiating multi-year guarantee terms",
    lastActivityDate: "2024-12-31",
    sport: "Men's Basketball",
    isUrgent: true,
    flagged: true,
    contractType: "NIL Contract", // Updated type
    category: "Retention", // Updated category
    participants: [],
    versions: [],
    lastUpdated: "5d ago",
    season: "2025-26", // Added season
  },
  {
    id: "7",
    title: "Early Signing Period Commitment",
    athlete: "David Thompson",
    athleteId: "ATH007",
    source: "university",
    agencyName: "IMG",
    negotiationStatus: "countered",
    currentHolder: "With University Legal",
    daysWithHolder: 4,
    totalValue: 410000,
    startDate: "2025-08-01",
    endDate: "2026-05-31",
    lastActivity: "University Legal countered agent's proposed amendments",
    lastActivityDate: "2025-01-04",
    sport: "Football",
    isUrgent: false,
    flagged: false,
    contractType: "Revenue Share", // Updated type
    category: "New Recruit", // Updated category
    participants: [],
    versions: [],
    lastUpdated: "4d ago",
    season: "2025-26", // Added season
  },
  {
    id: "8",
    title: "Portal Transfer - Graduate",
    athlete: "Kevin Lee",
    athleteId: "ATH008",
    source: "university",
    agencyName: "Wasserman",
    negotiationStatus: "executed",
    currentHolder: "Filed",
    daysWithHolder: 0,
    totalValue: 340000,
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    lastActivity: "Contract executed and filed",
    lastActivityDate: "2025-01-06",
    sport: "Men's Basketball",
    isUrgent: false,
    flagged: false,
    contractType: "Revenue Share", // Updated type
    category: "Transfer", // Updated category
    participants: [],
    versions: [],
    lastUpdated: "2d ago",
    season: "2024-25", // Added season
  },
  {
    id: "9",
    title: "High School Recruit - 5-Star",
    athlete: "Jordan White",
    athleteId: "ATH009",
    source: "university",
    agencyName: "CAA",
    negotiationStatus: "in-redlining",
    currentHolder: "With Agent",
    daysWithHolder: 5,
    totalValue: 890000,
    startDate: "2025-08-01",
    endDate: "2026-12-31",
    lastActivity: "Agent requested changes to performance incentives",
    lastActivityDate: "2025-01-03",
    sport: "Football",
    isUrgent: true,
    flagged: true,
    contractType: "Revenue Share", // Updated type
    category: "New Recruit", // Updated category
    participants: [],
    versions: [],
    lastUpdated: "5d ago",
    season: "2025-26", // Added season
  },
  {
    id: "10",
    title: "Contract Termination - Early Exit",
    athlete: "Alex Rivera",
    athleteId: "ATH010",
    source: "university",
    agencyName: "Excel Sports",
    negotiationStatus: "internal-review",
    currentHolder: "With University Legal",
    daysWithHolder: 3,
    totalValue: 0,
    startDate: "2025-01-15",
    endDate: "2025-01-15",
    lastActivity: "Termination agreement pending legal review",
    lastActivityDate: "2025-01-05",
    sport: "Men's Basketball",
    isUrgent: true,
    flagged: false,
    contractType: "Termination", // Updated type
    category: "Termination", // Added termination category
    participants: [],
    versions: [],
    lastUpdated: "3d ago",
    season: "2024-25", // Added season
  },
  {
    id: "11",
    title: "2025-26 Benefits Pool Agreement",
    athlete: "Isaiah Walker",
    athleteId: "ATH011",
    source: "university",
    agencyName: "Independent",
    negotiationStatus: "draft-sent",
    currentHolder: "With Athlete",
    daysWithHolder: 2,
    totalValue: 275000,
    startDate: "2025-06-20",
    endDate: "2026-06-19",
    lastActivity: "Draft sent to athlete for review",
    lastActivityDate: "2025-01-06",
    sport: "Football",
    isUrgent: false,
    flagged: false, // Added flagged property
    contractType: "Revenue Share", // Updated type
    category: "New Recruit", // Updated category
    participants: [],
    versions: [],
    lastUpdated: "2d ago",
    season: "2025-26", // Added season
  },
  {
    id: "12",
    title: "Revenue Share - Transfer Portal",
    athlete: "Cameron Lee",
    athleteId: "ATH012",
    source: "university",
    agencyName: "Roc Nation",
    negotiationStatus: "in-redlining",
    currentHolder: "With Athlete Counsel",
    daysWithHolder: 4,
    totalValue: 595000,
    startDate: "2025-05-01",
    endDate: "2026-04-30",
    lastActivity: "Athlete Counsel reviewing liability provisions",
    lastActivityDate: "2025-01-04",
    sport: "Football",
    isUrgent: false,
    flagged: false,
    contractType: "Revenue Share", // Updated type
    category: "Transfer", // Updated category
    participants: [],
    versions: [],
    lastUpdated: "3d ago",
    season: "2025-26", // Added season
  },
  {
    id: "13",
    title: "2025-26 Rev Share Agreement",
    athlete: "Jaylen Brown",
    athleteId: "ATH013",
    source: "university",
    agencyName: "Excel Sports",
    negotiationStatus: "in-redlining",
    currentHolder: "With Agent",
    daysWithHolder: 6,
    totalValue: 550000,
    startDate: "2025-07-01",
    endDate: "2026-06-30",
    lastActivity: "Agent requesting payment schedule modifications",
    lastActivityDate: "2025-01-02",
    sport: "Football",
    isUrgent: true,
    flagged: false,
    contractType: "Revenue Share", // Updated type
    category: "Retention", // Updated category
    participants: [],
    versions: [],
    lastUpdated: "5d ago",
    season: "2025-26", // Added season
  },
  {
    id: "14",
    title: "Roster Retention - Benefits Pool",
    athlete: "Michael Davis",
    athleteId: "ATH014",
    source: "university",
    agencyName: "WME Sports",
    negotiationStatus: "final-review",
    currentHolder: "With University Counsel",
    daysWithHolder: 3,
    totalValue: 485000,
    startDate: "2025-08-15",
    endDate: "2026-08-14",
    lastActivity: "University Counsel finalizing terms",
    lastActivityDate: "2025-01-05",
    sport: "Football",
    isUrgent: false,
    flagged: false,
    contractType: "Revenue Share", // Updated type
    category: "Retention", // Updated category
    participants: [],
    versions: [],
    lastUpdated: "3d ago",
    season: "2025-26", // Added season
  },
  {
    id: "15",
    title: "Transfer Portal - Rev Share",
    athlete: "Antonio Garcia",
    athleteId: "ATH015",
    source: "university",
    agencyName: "CAA",
    negotiationStatus: "ready-to-sign",
    currentHolder: "All Parties",
    daysWithHolder: 1,
    totalValue: 720000,
    startDate: "2025-06-01",
    endDate: "2026-05-31",
    lastActivity: "Final version approved by all parties",
    lastActivityDate: "2025-01-07",
    sport: "Football",
    isUrgent: false,
    flagged: false,
    contractType: "Revenue Share", // Updated type
    category: "Transfer", // Updated category
    participants: [],
    versions: [],
    lastUpdated: "1d ago",
    season: "2025-26", // Added season
  },
  {
    id: "16",
    title: "2025-26 Benefits Pool Agreement",
    athlete: "Kevin Martinez",
    athleteId: "ATH016",
    source: "university",
    agencyName: "Klutch Sports",
    negotiationStatus: "in-redlining",
    currentHolder: "With University",
    daysWithHolder: 4,
    totalValue: 435000,
    startDate: "2025-07-01",
    endDate: "2026-06-30",
    lastActivity: "University reviewing roster retention requirements",
    lastActivityDate: "2025-01-04",
    sport: "Football",
    isUrgent: false,
    flagged: false,
    contractType: "Revenue Share", // Updated type
    category: "Retention", // Updated category
    participants: [],
    versions: [],
    lastUpdated: "3d ago",
    season: "2025-26", // Added season
  },
  {
    id: "17",
    title: "Revenue Share - Transfer Portal",
    athlete: "Deshawn Jackson",
    athleteId: "ATH017",
    source: "university",
    agencyName: "Athletes First",
    negotiationStatus: "draft-sent",
    currentHolder: "With Athlete",
    daysWithHolder: 1,
    totalValue: 695000,
    startDate: "2025-05-20",
    endDate: "2026-05-19",
    lastActivity: "Initial draft sent to athlete",
    lastActivityDate: "2025-01-07",
    sport: "Football",
    isUrgent: false,
    flagged: false, // Added flagged property
    contractType: "Revenue Share", // Updated type
    category: "Transfer", // Updated category
    participants: [],
    versions: [],
    lastUpdated: "1d ago",
    season: "2025-26", // Added season
  },
  {
    id: "18",
    title: "Roster Retention - Benefits Pool",
    athlete: "Malik Johnson",
    athleteId: "ATH018",
    source: "university",
    agencyName: "Wasserman",
    negotiationStatus: "internal-review", // Changed from "awaiting-conference"
    currentHolder: "With University",
    daysWithHolder: 2,
    totalValue: 355000,
    startDate: "2025-08-01",
    endDate: "2026-07-31",
    lastActivity: "University internal compliance review ongoing",
    lastActivityDate: "2025-01-06",
    sport: "Football",
    isUrgent: false,
    flagged: false,
    contractType: "Revenue Share", // Updated type
    category: "Retention", // Updated category
    participants: [],
    versions: [],
    lastUpdated: "2d ago",
    season: "2025-26", // Added season
  },
  {
    id: "19",
    title: "2025-26 Rev Share Agreement",
    athlete: "Trey Williams",
    athleteId: "ATH019",
    source: "university",
    agencyName: "Vayner Sports",
    negotiationStatus: "in-redlining",
    currentHolder: "With Agent",
    daysWithHolder: 7,
    totalValue: 615000,
    startDate: "2025-06-15",
    endDate: "2026-06-14",
    lastActivity: "Agent reviewing incentive structure language",
    lastActivityDate: "2025-01-01",
    sport: "Football",
    isUrgent: true,
    flagged: false,
    contractType: "Revenue Share", // Updated type
    category: "New Recruit", // Updated category
    participants: [],
    versions: [],
    lastUpdated: "6d ago",
    season: "2025-26", // Added season
  },
  {
    id: "20",
    title: "Transfer Portal - Rev Share",
    athlete: "Jalen Carter",
    athleteId: "ATH020",
    source: "university",
    agencyName: "Independent",
    negotiationStatus: "final-review",
    currentHolder: "With Athlete Counsel",
    daysWithHolder: 3,
    totalValue: 850000,
    startDate: "2025-05-01",
    endDate: "2026-04-30",
    lastActivity: "Athlete Counsel finalizing representation terms",
    lastActivityDate: "2025-01-05",
    sport: "Football",
    isUrgent: false,
    flagged: false,
    contractType: "Revenue Share", // Updated type
    category: "Transfer", // Updated category
    participants: [],
    versions: [],
    lastUpdated: "3d ago",
    season: "2025-26", // Added season
  },
  {
    id: "21",
    title: "2025-26 Benefits Pool Agreement",
    athlete: "Xavier Thomas",
    athleteId: "ATH021",
    source: "university",
    agencyName: "Roc Nation",
    negotiationStatus: "ready-to-sign",
    currentHolder: "All Parties",
    daysWithHolder: 1,
    totalValue: 465000,
    startDate: "2025-07-20",
    endDate: "2026-07-19",
    lastActivity: "All parties ready to execute",
    lastActivityDate: "2025-01-07",
    sport: "Football",
    isUrgent: false,
    flagged: false,
    contractType: "Revenue Share", // Updated type
    category: "New Recruit", // Updated category
    participants: [],
    versions: [],
    lastUpdated: "1d ago",
    season: "2025-26", // Added season
  },
  {
    id: "22",
    title: "Roster Retention - Benefits Pool",
    athlete: "Quincy Adams",
    athleteId: "ATH022",
    source: "university",
    agencyName: "WME Sports",
    negotiationStatus: "in-redlining",
    currentHolder: "With University Counsel",
    daysWithHolder: 5,
    totalValue: 395000,
    startDate: "2025-08-10",
    endDate: "2026-08-09",
    lastActivity: "University Counsel redlining termination language",
    lastActivityDate: "2025-01-03",
    sport: "Football",
    isUrgent: false,
    flagged: false,
    contractType: "Revenue Share", // Updated type
    category: "Retention", // Updated category
    participants: [],
    versions: [],
    lastUpdated: "4d ago",
    season: "2025-26", // Added season
  },
  {
    id: "23",
    title: "Revenue Share - Transfer Portal",
    athlete: "Noah Robinson",
    athleteId: "ATH023",
    source: "university",
    agencyName: "Excel Sports",
    negotiationStatus: "draft-sent",
    currentHolder: "With Agent",
    daysWithHolder: 2,
    totalValue: 575000,
    startDate: "2025-06-05",
    endDate: "2026-06-04",
    lastActivity: "Draft sent to agent for athlete review",
    lastActivityDate: "2025-01-06",
    sport: "Football",
    isUrgent: false,
    flagged: false,
    contractType: "Revenue Share", // Updated type
    category: "Transfer", // Updated category
    participants: [],
    versions: [],
    lastUpdated: "2d ago",
    season: "2025-26", // Added season
  },
  {
    id: "24",
    title: "2025-26 Rev Share Agreement",
    athlete: "Isaiah Bennett",
    athleteId: "ATH024",
    source: "university",
    agencyName: "CAA",
    negotiationStatus: "internal-review", // Changed from "awaiting-conference"
    currentHolder: "With University",
    daysWithHolder: 3,
    totalValue: 505000,
    startDate: "2025-07-01",
    endDate: "2026-06-30",
    lastActivity: "University reviewing Big Ten allocation compliance",
    lastActivityDate: "2025-01-05",
    sport: "Football",
    isUrgent: false,
    flagged: false,
    contractType: "Revenue Share", // Updated type
    category: "New Recruit", // Updated category
    participants: [],
    versions: [],
    lastUpdated: "3d ago",
    season: "2025-26", // Added season
  },
  {
    id: "25",
    title: "Contract Termination - Early Exit",
    athlete: "Marcus Williams",
    athleteId: "ATH025",
    source: "university",
    agencyName: "Excel Sports",
    negotiationStatus: "executed",
    currentHolder: "On File",
    daysWithHolder: 0,
    totalValue: 125000,
    startDate: "2024-08-01",
    endDate: "2024-12-31",
    lastActivity: "Executed and filed",
    lastActivityDate: "2024-12-20",
    sport: "Football",
    isUrgent: false,
    flagged: false,
    contractType: "Termination", // Updated type
    category: "Termination", // Updated category
    participants: [],
    versions: [],
    signedDate: "2024-12-20",
    lastUpdated: "20d ago",
    season: "2024-25", // Added season
  },
  {
    id: "26",
    title: "2025 Rev Share - Amendment",
    athlete: "Tyler Davis",
    athleteId: "ATH026",
    source: "university",
    agencyName: "CAA",
    negotiationStatus: "final-review",
    currentHolder: "With University",
    daysWithHolder: 1,
    totalValue: 50000,
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    lastActivity: "University reviewing amendment terms",
    lastActivityDate: "2025-01-07",
    sport: "Football",
    isUrgent: false,
    flagged: false,
    contractType: "Revenue Share", // Updated type
    category: "Retention", // Updated category
    participants: [],
    versions: [],
    lastUpdated: "1d ago",
    season: "2024-25", // Added season
  },
]

const negotiationStatusConfig: NegotiationStatusConfig = {
  "draft-sent": { label: "Draft Sent", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  "in-redlining": {
    label: "In Redlining",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  },
  "internal-review": {
    // Added internal-review
    label: "Internal Review",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  },
  "final-review": {
    label: "Final Review",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  },
  "ready-to-sign": {
    label: "Ready to Sign",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  executed: { label: "Executed", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300" },
}

interface FilterState {
  statuses: NegotiationStatus[]
  holders: string[]
  sources: string[]
  athletes: string[]
  sports: string[]
  // Added categories filter
  categories: string[]
  // Added contract types filter
  contractTypes: string[]
  daysWithHolderMin: number | null
  daysWithHolderMax: number | null
  valueMin: number | null
  valueMax: number | null
  showUrgentOnly: boolean
  // Added flagged filter
  showFlaggedOnly: boolean
  seasons: string[] // Added season filter
}

// Wrapper component that provides the workflow context
export function Contracts2Management() {
  return (
    <ContractWorkflowProvider>
      <Contracts2ManagementInner />
    </ContractWorkflowProvider>
  )
}

function Contracts2ManagementInner() {
  const router = useRouter()
  const { toast } = useToast()
  const workflowCtx = useContractWorkflow()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [detailView, setDetailView] = useState<"list" | "negotiation-detail">("list")
  const [showFilters, setShowFilters] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [statusChangeModalOpen, setStatusChangeModalOpen] = useState(false)
  const [statusChangeContract, setStatusChangeContract] = useState<Contract | null>(null)
  const [changeHolderModalOpen, setChangeHolderModalOpen] = useState(false)
  const [changeHolderContract, setChangeHolderContract] = useState<Contract | null>(null)
  const [flaggedContracts, setFlaggedContracts] = useState<Set<string>>(
    new Set(mockContracts.filter((c) => c.flagged).map((c) => c.id)),
  )

  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const [activeCard, setActiveCard] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [contractWorkflowActive, setContractWorkflowActive] = useState(false)
  
  // Handle workflow upload completion - starts the processing stage
  const handleWorkflowUploadComplete = (data: {
    fileName: string
    contractType: string
    group: string
    notes: string
    athleteId?: string
    athleteName?: string
    athleteDetail?: string
  }) => {
    // Set upload data in workflow context
    workflowCtx.setUploadData({
      athleteId: data.athleteId || "selected-athlete",
      athleteName: data.athleteName || "Selected Athlete",
      athleteDetail: data.athleteDetail || "",
      contractType: data.contractType,
      fileName: data.fileName,
      notes: data.notes,
      contractId: `contract-${Date.now()}`,
    })
    // Move workflow to processing stage
    workflowCtx.setStage("processing")
    setIsUploadModalOpen(false)
    setContractWorkflowActive(true)
  }

  const handleWorkflowComplete = () => {
    setContractWorkflowActive(false)
    workflowCtx.resetWorkflow()
  }

  const [filters, setFilters] = useState<FilterState>({
    statuses: [],
    holders: [],
    sources: [],
    athletes: [],
    sports: [],
    // Added categories filter
    categories: [],
    // Added contract types filter
    contractTypes: [],
    daysWithHolderMin: null,
    daysWithHolderMax: null,
    valueMin: null,
    valueMax: null,
    showUrgentOnly: false,
    // Added flagged filter
    showFlaggedOnly: false,
    seasons: [], // Added seasons filter
  })

  const handleToggleFlag = (contractId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFlaggedContracts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(contractId)) {
        newSet.delete(contractId)
      } else {
        newSet.add(contractId)
      }
      return newSet
    })
  }

  const negotiationContracts = mockContracts

  // Need Your Action: contracts with OSU/internal team
  const needYourActionCount = negotiationContracts.filter(
    (c) =>
      c.negotiationStatus !== "executed" &&
      (c.currentHolder === "With University" ||
        c.currentHolder === "With University Counsel" ||
        c.currentHolder === "All Parties"),
  ).length

  // New Versions: inbound updates (using Draft Sent as proxy for new versions received)
  const newVersionsCount = negotiationContracts.filter((c) => c.negotiationStatus === "draft-sent").length

  // Out for Signature: sent to counterparty awaiting signature
  const outForSignatureCount = negotiationContracts.filter((c) => c.negotiationStatus === "ready-to-sign").length

  // Waiting on Big Ten: blocked pending conference approval
  const waitingOnBigTenCount = negotiationContracts.filter((c) => c.currentHolder === "With Big Ten").length

  const agreementsInReview = negotiationContracts.filter(
    (c) => c.negotiationStatus !== "executed" && c.negotiationStatus !== "filed",
  ).length
  const signedThisWeek = negotiationContracts.filter((c) => c.lastUpdated.includes("1d ago")).length

  const flaggedCount = flaggedContracts.size

  const applyFilters = (contracts: Contract[]) => {
    return contracts.filter((c) => {
      // Search query
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.athlete.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lastActivity.toLowerCase().includes(searchQuery.toLowerCase()) // Added search by last activity

      if (!matchesSearch) return false

      if (categoryFilter !== "all") {
        if (!c.category || c.category !== categoryFilter) return false
      }

      // Status filter
      if (filters.statuses.length > 0) {
        const status = c.negotiationStatus
        if (!filters.statuses.includes(status)) return false
      }

      // Holder filter
      if (filters.holders.length > 0) {
        if (!filters.holders.includes(c.currentHolder)) return false
      }

      // Source filter (now Agency filter)
      if (filters.sources.length > 0) {
        if (!filters.sources.includes(c.agencyName)) return false
      }

      // Athlete filter
      if (filters.athletes.length > 0) {
        if (!filters.athletes.includes(c.athlete)) return false
      }

      // Sport filter
      if (filters.sports.length > 0) {
        if (!c.sport || !filters.sports.includes(c.sport)) return false
      }

      // Added categories filter
      if (filters.categories.length > 0) {
        if (!c.category || !filters.categories.includes(c.category)) return false
      }

      // Added contract types filter
      if (filters.contractTypes.length > 0) {
        if (!c.contractType || !filters.contractTypes.includes(c.contractType)) return false
      }

      if (filters.seasons.length > 0) {
        if (!c.season || !filters.seasons.includes(c.season)) return false
      }

      // Days with holder filter
      if (filters.daysWithHolderMin !== null && c.daysWithHolder < filters.daysWithHolderMin) return false
      if (filters.daysWithHolderMax !== null && c.daysWithHolder > filters.daysWithHolderMax) return false

      // Value filter
      if (filters.valueMin !== null && c.totalValue < filters.valueMin) return false
      if (filters.valueMax !== null && c.totalValue > filters.valueMax) return false

      // Urgent only filter
      if (filters.showUrgentOnly && !c.isUrgent) return false

      // Flagged filter
      if (filters.showFlaggedOnly && !flaggedContracts.has(c.id)) return false

      return true
    })
  }

  // Sorting logic
  const sortContracts = (contracts: Contract[]) => {
    if (!sortColumn) return contracts

    return [...contracts].sort((a, b) => {
      let aValue: any = a[sortColumn as keyof Contract]
      let bValue: any = b[sortColumn as keyof Contract]

      // Handle specific column types for sorting
      if (sortColumn === "totalValue") {
        aValue = a.totalValue
        bValue = b.totalValue
      } else if (sortColumn === "daysWithHolder") {
        aValue = a.daysWithHolder
        bValue = b.daysWithHolder
      } else if (sortColumn === "lastUpdated") {
        // Simple string comparison for demonstration; proper date parsing would be better
        aValue = a.lastUpdated
        bValue = b.lastUpdated
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue === bValue) return 0
      return sortDirection === "asc" ? (aValue < bValue ? -1 : 1) : aValue > bValue ? -1 : 1
    })
  }

  const filteredNegotiationContracts = applyFilters(negotiationContracts)
  const sortedNegotiationContracts = sortContracts(filteredNegotiationContracts)

  const activeFilterCount =
    filters.statuses.length +
    filters.holders.length +
    filters.sources.length +
    filters.athletes.length +
    filters.sports.length +
    // Added categories to active filter count
    filters.categories.length +
    // Added contract types to active filter count
    filters.contractTypes.length +
    filters.seasons.length +
    (filters.daysWithHolderMin !== null ? 1 : 0) +
    (filters.daysWithHolderMax !== null ? 1 : 0) +
    (filters.valueMin !== null ? 1 : 0) +
    (filters.valueMax !== null ? 1 : 0) +
    (filters.showUrgentOnly ? 1 : 0) +
    // Include flagged filter in count
    (filters.showFlaggedOnly ? 1 : 0)

  const handleClearFilters = () => {
    setFilters({
      statuses: [],
      holders: [],
      sources: [],
      athletes: [],
      sports: [],
      // Added categories
      categories: [],
      // Reset contract types
      contractTypes: [],
      daysWithHolderMin: null,
      daysWithHolderMax: null,
      valueMin: null,
      valueMax: null,
      showUrgentOnly: false,
      // Reset flagged filter
      showFlaggedOnly: false,
      seasons: [],
    })
    setActiveCard(null) // Clear active card when clearing filters
    setCategoryFilter("all")
    // Reset sorting as well
    setSortColumn(null)
    setSortDirection("asc")
  }

  const handleViewNegotiationDetail = (contract: Contract) => {
    router.push(`/contracts/negotiation/${contract.id}`)
  }

  const handleBackToList = () => {
    setSelectedContract(null)
    setDetailView("list")
  }

  // Removed quick filters that are now handled by MultiSelect
  const handleQuickFilter = (filterType: "flagged" | "waiting-on-big-ten") => {
    const newFilters = { ...filters }

    switch (filterType) {
      case "flagged":
        newFilters.showFlaggedOnly = true
        break
      case "waiting-on-big-ten":
        newFilters.holders = ["With Big Ten"]
        break
    }

    setFilters(newFilters)
    setShowFilters(false) // Close filters dropdown if open
  }

  const handleCardClick = (cardType: "need-action" | "new-versions" | "out-for-signature") => {
    const newFilters = { ...filters }

    // Reset filters
    newFilters.statuses = []
    newFilters.holders = []

    switch (cardType) {
      case "need-action":
        newFilters.holders = ["With University", "With University Counsel", "All Parties"]
        break
      case "new-versions":
        newFilters.statuses = ["draft-sent"]
        break
      case "out-for-signature":
        newFilters.statuses = ["ready-to-sign"]
        break
    }

    setFilters(newFilters)
    setActiveCard(cardType)
  }

  const handleOpenStatusChange = (contract: Contract, e: React.MouseEvent) => {
    e.stopPropagation()
    setStatusChangeContract(contract)
    setStatusChangeModalOpen(true)
  }

  const handleOpenChangeHolder = (contract: Contract, e: React.MouseEvent) => {
    e.stopPropagation()
    setChangeHolderContract(contract)
    setChangeHolderModalOpen(true)
  }

  const handleStatusChange = (newStatus: NegotiationStatus) => {
    if (!statusChangeContract) return

    // In a real app, this would call an API to update the contract status
    console.log(
      `[v0] Changing status for contract ${statusChangeContract.id} from ${statusChangeContract.negotiationStatus} to ${newStatus}`,
    )

    // Here you would update the contract in your state/database
    // For now, we'll just log the change
    alert(`Status updated to: ${negotiationStatusConfig[newStatus].label}`)
  }

  const statusOptions = Array.from(new Set(mockContracts.map((c) => c.negotiationStatus)))
    .filter((status) => status && negotiationStatusConfig[status]) // Filter out undefined or missing configs
    .map((status) => ({
      label: negotiationStatusConfig[status].label,
      value: status,
    }))

  const agencyOptions = Array.from(new Set(mockContracts.map((c) => c.agencyName)))
    .filter((agency) => agency) // Filter out undefined values
    .sort()
    .map((agency) => ({
      label: agency,
      value: agency,
    }))

  const contractTypeOptions = [
    { label: "Revenue Share", value: "Revenue Share" },
    { label: "Termination", value: "Termination" },
    { label: "NIL Contract", value: "NIL Contract" },
  ]

  const groupOptions = [
    { label: "New Recruit", value: "New Recruit" },
    { label: "Transfer", value: "Transfer" },
    { label: "Retention", value: "Retention" },
    { label: "Termination", value: "Termination" },
  ]

  const getSentDate = (contract: Contract): string => {
    // Calculate sent date based on lastActivityDate
    const date = new Date(contract.lastActivityDate)
    return date.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })
  }

  const getHolderType = (currentHolder: string): string => {
    if (currentHolder.includes("Agent")) return "Agent"
    if (currentHolder.includes("Athlete")) return "Athlete"
    if (currentHolder.includes("OSU") || currentHolder.includes("University")) return "OSU"
    if (currentHolder.includes("Big Ten")) return "Big Ten"
    return currentHolder
  }

  const toggleSeasonFilter = (season: string) => {
    setFilters((prev) => ({
      ...prev,
      seasons: prev.seasons.includes(season) ? prev.seasons.filter((s) => s !== season) : [...prev.seasons, season],
    }))
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const renderSortIcon = (columnName: string) => {
    if (sortColumn !== columnName) return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  const sortedAndFilteredContracts = [...filteredNegotiationContracts].sort((a, b) => {
    if (!sortColumn) return 0

    let aValue: any
    let bValue: any

    // Map the button text to the actual contract property
    switch (sortColumn) {
      case "status":
        aValue = a.negotiationStatus
        bValue = b.negotiationStatus
        break
      case "contract":
        aValue = a.title
        bValue = b.title
        break
      case "athlete":
        aValue = a.athlete
        bValue = b.athlete
        break
      case "agency":
        aValue = a.agencyName
        bValue = b.agencyName
        break
      case "type":
        aValue = a.contractType || ""
        bValue = b.contractType || ""
        break
      case "group":
        aValue = a.category || ""
        bValue = b.category || ""
        break
      case "season":
        aValue = a.season || ""
        bValue = b.season || ""
        break
      case "value":
        aValue = a.totalValue
        bValue = b.totalValue
        break
      case "holder":
        aValue = a.currentHolder
        bValue = b.currentHolder
        break
      default:
        return 0
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  const getSortIndicator = (columnName: string) => {
    if (sortColumn !== columnName) return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  // Show workflow stages when active (takes over the full view)
  if (contractWorkflowActive && workflowCtx.state.stage !== "upload") {
    if (workflowCtx.state.stage === "processing") {
      return <ProcessingStage />
    }
    if (workflowCtx.state.stage === "review") {
      return <ReviewStage />
    }
    if (workflowCtx.state.stage === "activation") {
      return <ActivationStage onComplete={handleWorkflowComplete} />
    }
  }

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contract Negotiation Pipeline</h1>
          <p className="text-muted-foreground">Track and manage contracts through negotiation and execution</p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)} className="gap-2">
          + Upload Contract
        </Button>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-b py-2">
        <div className="flex items-center gap-1.5">
          <FileText className="h-4 w-4" />
          <span>
            <strong className="text-foreground">{agreementsInReview}</strong> agreements in review
          </span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4" />
          <span>
            <strong className="text-foreground">{signedThisWeek}</strong> signed this week
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card
          className={`border-red-200 bg-gradient-to-br from-red-50 to-white hover:shadow-md transition-shadow cursor-pointer ${
            activeCard === "need-action" ? "ring-2 ring-red-500" : ""
          }`}
          onClick={() => handleCardClick("need-action")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium text-red-900">Attention Needed</CardTitle>
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-900">{needYourActionCount}</div>
            <p className="text-xs text-red-600 mt-1">Requires your review</p>
          </CardContent>
        </Card>

        <Card
          className={`border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-shadow cursor-pointer ${
            activeCard === "new-versions" ? "ring-2 ring-blue-500" : ""
          }`}
          onClick={() => handleCardClick("new-versions")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium text-blue-900">New Versions</CardTitle>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-900">{newVersionsCount}</div>
            <p className="text-xs text-blue-600 mt-1">Inbound updates received</p>
          </CardContent>
        </Card>

        <Card
          className={`border-green-200 bg-gradient-to-br from-green-50 to-white hover:shadow-md transition-shadow cursor-pointer ${
            activeCard === "out-for-signature" ? "ring-2 ring-green-500" : ""
          }`}
          onClick={() => handleCardClick("out-for-signature")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium text-green-900">Out for Signature</CardTitle>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-900">{outForSignatureCount}</div>
            <p className="text-xs text-green-600 mt-1">Awaiting counterparty</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-gradient-to-br from-slate-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium text-slate-900">Avg. Time to Sign</CardTitle>
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-slate-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-slate-900">3.8</div>
            <p className="text-xs text-slate-600 mt-1">Days on average</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <MultiSelect
            options={statusOptions}
            selected={filters.statuses}
            onChange={(selected) => setFilters({ ...filters, statuses: selected as NegotiationStatus[] })}
            placeholder="Status"
            className="w-[200px]"
          />
          <MultiSelect
            options={agencyOptions}
            selected={filters.sources}
            onChange={(selected) => setFilters({ ...filters, sources: selected })}
            placeholder="Agency"
            className="w-[200px]"
          />
          <MultiSelect
            options={contractTypeOptions}
            selected={filters.contractTypes}
            onChange={(selected) => setFilters({ ...filters, contractTypes: selected })}
            placeholder="Type"
            className="w-[200px]"
          />
          <MultiSelect
            options={groupOptions}
            selected={filters.categories}
            onChange={(selected) => setFilters({ ...filters, categories: selected })}
            placeholder="Group"
            className="w-[200px]"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[150px] justify-between bg-transparent">
                {filters.seasons.length > 0 ? `Season (${filters.seasons.length})` : "All Seasons"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem
                checked={filters.seasons.includes("2024-25")}
                onCheckedChange={() => toggleSeasonFilter("2024-25")}
              >
                2024-25
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.seasons.includes("2025-26")}
                onCheckedChange={() => toggleSeasonFilter("2025-26")}
              >
                2025-26
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.seasons.includes("2026-27")}
                onCheckedChange={() => toggleSeasonFilter("2026-27")}
              >
                2026-27
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.seasons.includes("2027-28")}
                onCheckedChange={() => toggleSeasonFilter("2027-28")}
              >
                2027-28
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickFilter("flagged")}
            className="h-8 gap-1.5 text-xs"
          >
            <Star className="h-3.5 w-3.5" />
            Priority
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickFilter("waiting-on-big-ten")}
            className="h-8 gap-1.5 text-xs"
          >
            <AlertCircle className="h-3.5 w-3.5" />
            Waiting on Big Ten
          </Button>
          {(filters.statuses.length > 0 ||
            filters.sources.length > 0 ||
            filters.categories.length > 0 ||
            filters.contractTypes.length > 0 ||
            filters.seasons.length > 0 ||
            filters.daysWithHolderMin !== null ||
            filters.showFlaggedOnly) && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters} className="h-8 gap-1.5 text-xs">
              <X className="h-3.5 w-3.5" />
              Clear All Filters
            </Button>
          )}
        </div>
      </div>

      {/* Search and Detailed Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by athlete, contract title, or activity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        {/* <Button variant="outline" size="default" onClick={() => setFiltersOpen(true)}>
          <Filter className="mr-2 h-4 w-4" />
          Detailed Filters
        </Button> */}
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="relative">
          <Filter className="mr-2 h-4 w-4" />
          Detailed Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-2 h-5 min-w-5 rounded-full bg-primary p-0 px-1.5 text-xs text-primary-foreground">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="icon" onClick={handleClearFilters} title="Clear all filters">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showFilters && (
        <ContractFilters filters={filters} onFiltersChange={setFilters} allContracts={negotiationContracts} />
      )}

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.statuses.map((status) => (
            <Badge key={status} variant="secondary" className="gap-1 pr-1">
              Status: {status}
              <button
                type="button"
                className="ml-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log("[v0] Removing status filter:", status)
                  setFilters({ ...filters, statuses: filters.statuses.filter((s) => s !== status) })
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.holders.map((holder) => (
            <Badge key={holder} variant="secondary" className="gap-1 pr-1">
              Holder: {holder}
              <button
                type="button"
                className="ml-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log("[v0] Removing holder filter:", holder)
                  setFilters({ ...filters, holders: filters.holders.filter((h) => h !== holder) })
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.sources.map((source) => (
            <Badge key={source} variant="secondary" className="gap-1 pr-1">
              Agency: {source}
              <button
                type="button"
                className="ml-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log("[v0] Removing source filter:", source)
                  setFilters({ ...filters, sources: filters.sources.filter((s) => s !== source) })
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.athletes.map((athlete) => (
            <Badge key={athlete} variant="secondary" className="gap-1 pr-1">
              Athlete: {athlete}
              <button
                type="button"
                className="ml-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log("[v0] Removing athlete filter:", athlete)
                  setFilters({ ...filters, athletes: filters.athletes.filter((a) => a !== athlete) })
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.sports.map((sport) => (
            <Badge key={sport} variant="secondary" className="gap-1 pr-1">
              Sport: {sport}
              <button
                type="button"
                className="ml-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log("[v0] Removing sport filter:", sport)
                  setFilters({ ...filters, sports: filters.sports.filter((s) => s !== sport) })
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {/* Group filter display */}
          {filters.categories.map((category) => (
            <Badge key={category} variant="secondary" className="gap-1 pr-1">
              Group: {category}
              <button
                type="button"
                className="ml-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log("[v0] Removing category filter:", category)
                  setFilters({ ...filters, categories: filters.categories.filter((c) => c !== category) })
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {/* Added contract type filter display */}
          {filters.contractTypes.map((contractType) => (
            <Badge key={contractType} variant="secondary" className="gap-1 pr-1">
              Type: {contractType}
              <button
                type="button"
                className="ml-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log("[v0] Removing contractType filter:", contractType)
                  setFilters({ ...filters, contractTypes: filters.contractTypes.filter((ct) => ct !== contractType) })
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.seasons.map((season) => (
            <Badge key={season} variant="secondary" className="gap-1 pr-1">
              Season: {season}
              <button
                type="button"
                className="ml-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setFilters({ ...filters, seasons: filters.seasons.filter((s) => s !== season) })
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.daysWithHolderMin !== null && (
            <Badge variant="secondary" className="gap-1 pr-1">
              Min Days: {filters.daysWithHolderMin}
              <button
                type="button"
                className="ml-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log("[v0] Removing daysWithHolderMin filter")
                  setFilters({ ...filters, daysWithHolderMin: null })
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.daysWithHolderMax !== null && (
            <Badge variant="secondary" className="gap-1 pr-1">
              Max Days: {filters.daysWithHolderMax}
              <button
                type="button"
                className="ml-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log("[v0] Removing daysWithHolderMax filter")
                  setFilters({ ...filters, daysWithHolderMax: null })
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.valueMin !== null && (
            <Badge variant="secondary" className="gap-1 pr-1">
              Min Value: ${filters.valueMin.toLocaleString()}
              <button
                type="button"
                className="ml-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log("[v0] Removing valueMin filter")
                  setFilters({ ...filters, valueMin: null })
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.valueMax !== null && (
            <Badge variant="secondary" className="gap-1 pr-1">
              Max Value: ${filters.valueMax.toLocaleString()}
              <button
                type="button"
                className="ml-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log("[v0] Removing valueMax filter")
                  setFilters({ ...filters, valueMax: null })
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.showUrgentOnly && (
            <Badge variant="destructive" className="gap-1 pr-1">
              Urgent Only
              <button
                type="button"
                className="ml-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log("[v0] Removing showUrgentOnly filter")
                  setFilters({ ...filters, showUrgentOnly: false })
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.showFlaggedOnly && (
            <Badge variant="warning" className="gap-1 pr-1">
              Flagged Only
              <button
                type="button"
                className="ml-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log("[v0] Removing showFlaggedOnly filter")
                  setFilters({ ...filters, showFlaggedOnly: false })
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Contracts Table */}
      <Card>
        {/* Added CardHeader with title for the table */}
        <CardHeader>
          <CardTitle>Active Negotiations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="w-[200px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("status")}
                      className="h-8 px-2 hover:bg-transparent"
                    >
                      Status
                      {renderSortIcon("status")}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[250px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("contract")}
                      className="h-8 px-2 hover:bg-transparent"
                    >
                      Contract
                      {renderSortIcon("contract")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("athlete")}
                      className="h-8 px-2 hover:bg-transparent"
                    >
                      Athlete
                      {renderSortIcon("athlete")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("agency")}
                      className="h-8 px-2 hover:bg-transparent"
                    >
                      Agency
                      {renderSortIcon("agency")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("type")}
                      className="h-8 px-2 hover:bg-transparent"
                    >
                      Type
                      {renderSortIcon("type")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("group")}
                      className="h-8 px-2 hover:bg-transparent"
                    >
                      Group
                      {renderSortIcon("group")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("season")}
                      className="h-8 px-2 hover:bg-transparent"
                    >
                      Season
                      {renderSortIcon("season")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("value")}
                      className="h-8 px-2 hover:bg-transparent"
                    >
                      Value
                      {renderSortIcon("value")}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[280px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("holder")}
                      className="h-8 px-2 hover:bg-transparent"
                    >
                      Current Holder
                      {renderSortIcon("holder")}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TooltipProvider>
                  {sortedAndFilteredContracts.map((contract) => (
                    <TableRow
                      key={contract.id}
                      className="cursor-pointer hover:bg-accent/50"
                      onClick={() => router.push(`/contracts/negotiation/${contract.id}`)}
                    >
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => handleToggleFlag(contract.id, e)}
                        >
                          <Star
                            className={`h-4 w-4 transition-colors ${
                              flaggedContracts.has(contract.id)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-muted-foreground hover:text-yellow-500"
                            }`}
                          />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {contract.isUrgent && <AlertCircle className="h-4 w-4 text-red-500" />}
                          {contract.negotiationStatus && negotiationStatusConfig[contract.negotiationStatus] ? (
                            <Badge className={negotiationStatusConfig[contract.negotiationStatus].color}>
                              {negotiationStatusConfig[contract.negotiationStatus].label}
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex flex-col gap-1">
                          <span>{contract.title}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">v{contract.versions.length || 1}</span>
                            {contract.contractType && (
                              <Badge variant="outline" className="text-xs">
                                {contract.contractType}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{contract.athlete}</TableCell>
                      <TableCell>{contract.agencyName}</TableCell>
                      <TableCell>
                        {contract.contractType ? <Badge variant="outline">{contract.contractType}</Badge> : "—"}
                      </TableCell>
                      <TableCell>
                        {contract.category ? <Badge variant="outline">{contract.category}</Badge> : "—"}
                      </TableCell>
                      <TableCell>{contract.season || "—"}</TableCell>
                      <TableCell className="font-semibold">${contract.totalValue.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {contract.negotiationStatus === "executed"
                                ? contract.category
                                  ? `Filed: ${contract.category}`
                                  : "On File"
                                : contract.currentHolder}
                            </span>
                            {contract.negotiationStatus !== "executed" && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div>
                                    <Badge
                                      variant="secondary"
                                      className={`cursor-help ${
                                        contract.daysWithHolder >= 6
                                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                          : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                                      }`}
                                    >
                                      {contract.daysWithHolder} {contract.daysWithHolder === 1 ? "day" : "days"}
                                    </Badge>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Sent to {getHolderType(contract.currentHolder)} on {getSentDate(contract)}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">{contract.lastActivity}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/contracts/negotiation/${contract.id}`)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => handleOpenStatusChange(contract, e)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Change Status
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => handleOpenChangeHolder(contract, e)}>
                              <Send className="mr-2 h-4 w-4" />
                              Change Holder
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <Upload className="mr-2 h-4 w-4" />
                              Upload New Version
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <Send className="mr-2 h-4 w-4" />
                              Send to Party
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <Download className="mr-2 h-4 w-4" />
                              Download Latest
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TooltipProvider>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <ContractWorkflowUploadModal 
        open={isUploadModalOpen} 
        onOpenChange={setIsUploadModalOpen} 
        onUploaded={handleWorkflowUploadComplete}
      />
      {/* Passed contract to StatusChangeModal */}
      <StatusChangeModal
        open={statusChangeModalOpen}
        onOpenChange={setStatusChangeModalOpen}
        contract={statusChangeContract}
      />
      <ChangeHolderModal
        open={changeHolderModalOpen}
        onOpenChange={setChangeHolderModalOpen}
        contract={changeHolderContract}
      />
    </div>
  )
}
