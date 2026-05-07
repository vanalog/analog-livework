"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Mail,
  Download,
  ExternalLink,
  Copy,
  Plus,
  X,
  Upload,
  MoreVertical,
  Edit,
  FileText,
  Star,
  Check,
  AlertTriangle,
  CheckCircle2,
  ArrowRightLeft,
  MessageSquare,
  Clock,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { StatusChangeModal } from "@/components/contracts2/status-change-modal"
import { ChangeHolderModal } from "@/components/contracts2/change-holder-modal"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ContractParticipant {
  id: string
  name: string
  role: "athlete" | "agent" | "athlete-counsel" | "university" | "university-counsel" | "sponsor"
  email: string
  lastAction?: string
  lastActionDate?: string
  isCurrentHolder?: boolean
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
  holder?: string
  daysWithHolder?: number
  summary?: string | null
}

interface Note {
  id: string
  author: string
  timestamp: string
  content: string
}

interface TimelineItem {
  id: string
  type: "version" | "note" | "email" | "status_change"
  timestamp: string
  actor: string
  // Version-specific
  versionNumber?: number
  filename?: string
  holder?: string
  isCurrent?: boolean
  summary?: string | null
  daysWithHolder?: number
  // Email-specific
  subject?: string
  preview?: string
  // Status change-specific
  fromStatus?: string
  toStatus?: string
  // Note-specific
  content?: string
}

interface ComplianceStatus {
  status: "clear" | "flagged"
  flaggedItems?: number
  reportUrl?: string
}

interface StageHistory {
  enteredAt?: string
  enteredBy?: string
}

interface NegotiationContract {
  id: string
  title: string
  athlete: string
  athleteId: string
  agency: string
  source: "university" | "sponsor"
  sourceName: string
  negotiationStatus: "draft-sent" | "in-redlining" | "internal-review" | "final-review" | "ready-to-sign" | "executed"
  currentHolder: string
  daysWithHolder: number
  totalValue: number
  startDate: string
  endDate: string
  participants: ContractParticipant[]
  versions: ContractVersion[]
  lastActivity: string
  lastActivityDate: string
  sport?: string
  isUrgent: boolean
  emailAddress: string
  contractType: "Revenue Share" | "NIL Sponsorship" | "Transfer Portal" | "Benefits Pool"
  group?: "New Recruit" | "Transfer" | "Retention" | "Termination"
  notes?: Note[]
  timeline?: TimelineItem[]
  complianceStatus?: ComplianceStatus
  stageHistory?: Record<string, StageHistory>
  daysInCurrentStage?: number
}

const roleLabels = {
  athlete: "Athlete",
  agent: "Agent",
  "athlete-counsel": "Athlete's Counsel",
  university: "University",
  "university-counsel": "University Counsel",
  sponsor: "Sponsor",
}

interface NegotiationDetailProps {
  contractId: string
}

export function NegotiationDetail({ contractId }: NegotiationDetailProps) {
  const [contract, setContract] = useState<NegotiationContract | null>(null)
  const [newNote, setNewNote] = useState("")

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [sendDialogOpen, setSendDialogOpen] = useState(false)
  const [emailSetupDialogOpen, setEmailSetupDialogOpen] = useState(false)
  const [statusChangeModalOpen, setStatusChangeModalOpen] = useState(false)
  const [changeHolderModalOpen, setChangeHolderModalOpen] = useState(false)
  const [isFlagged, setIsFlagged] = useState(false)
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set())

  const { toast } = useToast()

  // Toggle version expansion
  const toggleVersionExpanded = (versionId: string) => {
    setExpandedVersions((prev) => {
      const next = new Set(prev)
      if (next.has(versionId)) {
        next.delete(versionId)
      } else {
        next.add(versionId)
      }
      return next
    })
  }

  // Group timeline items by version - activity items belong to the version that precedes them
  const groupTimelineByVersion = (timeline: TimelineItem[]) => {
    if (!timeline || timeline.length === 0) return []

    // Sort by timestamp descending (newest first)
    const sorted = [...timeline].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    const groups: { version: TimelineItem; activities: TimelineItem[] }[] = []
    let currentActivities: TimelineItem[] = []

    for (const item of sorted) {
      if (item.type === "version") {
        groups.push({
          version: item,
          activities: currentActivities,
        })
        currentActivities = []
      } else {
        currentActivities.push(item)
      }
    }

    // If there are orphan activities at the end (before any version), attach to last version or create placeholder
    if (currentActivities.length > 0 && groups.length > 0) {
      groups[groups.length - 1].activities.push(...currentActivities)
    }

    return groups
  }

  useEffect(() => {
    const contractDataMap: Record<string, NegotiationContract> = {
      "1": {
        id: "1",
        title: "2025-26 Benefits Pool Agreement",
        athlete: "Marcus Williams",
        athleteId: "ATH001",
        agency: "Excel Sports",
        source: "university",
        sourceName: "Example State University",
        negotiationStatus: "in-redlining",
        currentHolder: "With Agent",
        daysWithHolder: 3,
        totalValue: 425000,
  startDate: "Jan 2, 2025",
  endDate: "Dec 31, 2025",
  contractType: "Revenue Share",
  group: "Retention",
  daysInCurrentStage: 5,
        complianceStatus: {
          status: "flagged",
          flaggedItems: 2,
          reportUrl: "/reports/compliance/1.pdf",
        },
        stageHistory: {
          "draft-sent": { enteredAt: "Jan 2, 2025, 9:00 AM", enteredBy: "University Compliance" },
          "in-redlining": { enteredAt: "Jan 5, 2025, 2:30 PM", enteredBy: "System" },
        },
        participants: [
          {
            id: "p1",
            name: "Marcus Williams",
            role: "athlete",
            email: "mwilliams@email.com",
            isCurrentHolder: false,
          },
          {
            id: "p2",
            name: "James Chen",
            role: "agent",
            email: "jchen@excelsports.com",
            isCurrentHolder: true,
          },
          {
            id: "p3",
            name: "University Legal",
            role: "university-counsel",
            email: "legal@esu.edu",
            isCurrentHolder: false,
          },
          {
            id: "p4",
            name: "University Compliance",
            role: "university",
            email: "compliance@esu.edu",
            isCurrentHolder: false,
          },
        ],
        versions: [
          {
            id: "v1",
            versionNumber: 1,
            uploadedDate: "Jan 2, 2025",
            uploadedBy: "University Compliance",
            uploadMethod: "manual",
            fileName: "BenefitsPool_MWilliams_Draft.pdf",
            sentTo: "Agent",
            holder: "With University Legal",
            daysWithHolder: 3,
            summary: null,
          },
          {
            id: "v2",
            versionNumber: 2,
            uploadedDate: "Jan 5, 2025",
            uploadedBy: "Excel Sports",
            uploadMethod: "email",
            fileName: "BenefitsPool_MWilliams_Redline.pdf",
            receivedFrom: "jchen@excelsports.com",
            sentTo: "OSU",
            holder: "With University",
            daysWithHolder: 1,
            summary:
              "Agent requested modification to payment schedule in Section 4. Minor changes to termination language.",
          },
          {
            id: "v3",
            versionNumber: 3,
            uploadedDate: "Jan 8, 2025",
            uploadedBy: "University Legal",
            uploadMethod: "email",
            fileName: "BenefitsPool_MWilliams_v3.pdf",
            sentTo: "Agent",
            holder: "With Agent",
            daysWithHolder: 3,
            summary: "Accepted payment schedule changes. Updated clawback language per agent request.",
          },
        ],
        lastActivity: "University Legal sent to Agent",
        lastActivityDate: "Jan 8, 2025",
        sport: "Football",
        isUrgent: false,
        emailAddress: `contract-1@track.analog.app`,
        timeline: [
          {
            id: "t1",
            type: "note",
            timestamp: "2025-01-10T14:30:00Z",
            actor: "John H.",
            content: "Agent requested clarification on payment schedule structure. Sent updated terms via email.",
          },
          {
            id: "t2",
            type: "version",
            timestamp: "2025-01-08T10:00:00Z",
            actor: "University Legal",
            versionNumber: 3,
            filename: "BenefitsPool_MWilliams_v3.pdf",
            holder: "With Agent",
            isCurrent: true,
            summary: "Accepted payment schedule changes. Updated clawback language per agent request.",
            daysWithHolder: 3,
          },
          {
            id: "t3",
            type: "email",
            timestamp: "2025-01-07T15:30:00Z",
            actor: "James Chen",
            subject: "RE: Benefits Pool Agreement - Payment Terms",
            preview:
              "Thanks for the updated terms. We're reviewing the clawback language now and should have comments by EOD.",
          },
          {
            id: "t4",
            type: "status_change",
            timestamp: "2025-01-05T14:30:00Z",
            actor: "System",
            fromStatus: "Draft Sent",
            toStatus: "In Redlining",
          },
          {
            id: "t5",
            type: "version",
            timestamp: "2025-01-05T09:00:00Z",
            actor: "Excel Sports",
            versionNumber: 2,
            filename: "BenefitsPool_MWilliams_Redline.pdf",
            holder: "With University",
            isCurrent: false,
            summary:
              "Agent requested modification to payment schedule in Section 4. Minor changes to termination language.",
            daysWithHolder: 1,
          },
          {
            id: "t6",
            type: "note",
            timestamp: "2025-01-05T10:15:00Z",
            actor: "University Legal",
            content: "Received initial redlines from Excel Sports. Minor changes to termination language.",
          },
          {
            id: "t7",
            type: "version",
            timestamp: "2025-01-02T09:00:00Z",
            actor: "University Compliance",
            versionNumber: 1,
            filename: "BenefitsPool_MWilliams_Draft.pdf",
            holder: "With Agent",
            isCurrent: false,
            summary: null,
            daysWithHolder: 3,
          },
        ],
        notes: [
          {
            id: "n1",
            author: "John H.",
            timestamp: "Jan 6, 2025 2:30 PM",
            content: "Agent requested clarification on payment schedule structure. Sent updated terms via email.",
          },
          {
            id: "n2",
            author: "University Legal",
            timestamp: "Jan 5, 2025 10:15 AM",
            content: "Received initial redlines from Excel Sports. Minor changes to termination language.",
          },
        ],
      },
      "2": {
        id: "2",
        title: "Revenue Share - Transfer Portal",
        athlete: "Tyler Davis",
        athleteId: "ATH002",
        agency: "CAA",
        source: "university",
        sourceName: "Example State University",
        negotiationStatus: "draft-sent",
        currentHolder: "With Athlete",
        daysWithHolder: 1,
        totalValue: 650000,
  startDate: "Jun 1, 2025",
  endDate: "May 31, 2026",
  contractType: "Revenue Share",
  group: "Transfer",
  daysInCurrentStage: 1,
        complianceStatus: {
          status: "clear",
        },
        stageHistory: {
          "draft-sent": { enteredAt: "Jan 9, 2025, 10:00 AM", enteredBy: "University Compliance" },
        },
        participants: [
          { id: "p1", name: "Tyler Davis", role: "athlete", email: "tdavis@email.com", isCurrentHolder: true },
          { id: "p2", name: "Mike Johnson", role: "agent", email: "mjohnson@caa.com", isCurrentHolder: false },
          {
            id: "p3",
            name: "University Legal",
            role: "university-counsel",
            email: "legal@university.edu",
            isCurrentHolder: false,
          },
        ],
        versions: [
          {
            id: "v1",
            versionNumber: 1,
            uploadedDate: "Jan 9, 2025",
            uploadedBy: "University Compliance",
            uploadMethod: "email",
            fileName: "TransferPortal_TDavis_Draft.pdf",
            sentTo: "Athlete",
            holder: "With Athlete",
            daysWithHolder: 1,
            summary: null,
          },
        ],
        lastActivity: "Draft sent to athlete for initial review",
        lastActivityDate: "Jan 9, 2025",
        sport: "Football",
        isUrgent: false,
        emailAddress: `contract-2@track.analog.app`,
        timeline: [
          {
            id: "t1",
            type: "version",
            timestamp: "2025-01-09T10:00:00Z",
            actor: "University Compliance",
            versionNumber: 1,
            filename: "TransferPortal_TDavis_Draft.pdf",
            holder: "With Athlete",
            isCurrent: true,
            summary: null,
            daysWithHolder: 1,
          },
          {
            id: "t2",
            type: "note",
            timestamp: "2025-01-09T10:05:00Z",
            actor: "University Compliance",
            content: "Draft sent to Tyler Davis for initial review. High-priority transfer portal recruitment.",
          },
        ],
      },
      "3": {
        id: "3",
        title: "Roster Retention - Benefits Pool",
        athlete: "Brandon Smith",
        athleteId: "ATH003",
        agency: "Wasserman",
        source: "university",
        sourceName: "Example State University",
        negotiationStatus: "internal-review",
        currentHolder: "With Big Ten",
        daysWithHolder: 6,
        totalValue: 385000,
  startDate: "Feb 1, 2025",
  endDate: "Nov 30, 2025",
  contractType: "Revenue Share",
  group: "Retention",
  daysInCurrentStage: 6,
        complianceStatus: {
          status: "flagged",
          flaggedItems: 1,
          reportUrl: "/reports/compliance/3.pdf",
        },
        stageHistory: {
          "draft-sent": { enteredAt: "Jan 2, 2025, 9:00 AM", enteredBy: "University Compliance" },
          "in-redlining": { enteredAt: "Jan 3, 2025, 11:00 AM", enteredBy: "System" },
          "internal-review": { enteredAt: "Jan 4, 2025, 3:00 PM", enteredBy: "Kendra B." },
        },
        participants: [
          { id: "p1", name: "Brandon Smith", role: "athlete", email: "bsmith@email.com", isCurrentHolder: false },
          { id: "p2", name: "Sara Lopez", role: "agent", email: "slopez@wasserman.com", isCurrentHolder: false },
          {
            id: "p3",
            name: "Big Ten Counsel",
            role: "university-counsel",
            email: "counsel@bigten.org",
            isCurrentHolder: true,
          },
        ],
        versions: [
          {
            id: "v1",
            versionNumber: 1,
            uploadedDate: "Jan 4, 2025",
            uploadedBy: "University Compliance",
            uploadMethod: "manual",
            fileName: "RosterRetention_BSmith_Draft.pdf",
            sentTo: "Big Ten",
            holder: "With Big Ten",
            daysWithHolder: 6,
            summary: null,
          },
        ],
        lastActivity: "Awaiting Big Ten approval for roster eligibility terms",
        lastActivityDate: "Jan 4, 2025",
        sport: "Men's Basketball",
        isUrgent: true,
        emailAddress: `contract-3@track.analog.app`,
        timeline: [
          {
            id: "t1",
            type: "note",
            timestamp: "2025-01-08T09:00:00Z",
            actor: "Kendra B.",
            content: "Following up with Big Ten counsel on eligibility review. No response yet.",
          },
          {
            id: "t2",
            type: "status_change",
            timestamp: "2025-01-04T15:00:00Z",
            actor: "Kendra B.",
            fromStatus: "In Redlining",
            toStatus: "Internal Review",
          },
          {
            id: "t3",
            type: "version",
            timestamp: "2025-01-04T09:00:00Z",
            actor: "University Compliance",
            versionNumber: 1,
            filename: "RosterRetention_BSmith_Draft.pdf",
            holder: "With Big Ten",
            isCurrent: true,
            summary: null,
            daysWithHolder: 6,
          },
        ],
      },
      "4": {
        id: "4",
        title: "Transfer Portal Recruitment Package",
        athlete: "Jake Martinez",
        athleteId: "ATH004",
        agency: "CAA",
        source: "university",
        sourceName: "Example State University",
        negotiationStatus: "ready-to-sign",
        currentHolder: "With Athlete",
        daysWithHolder: 1,
        totalValue: 520000,
  startDate: "Feb 15, 2025",
  endDate: "Feb 14, 2026",
  contractType: "Revenue Share",
  group: "Transfer",
  daysInCurrentStage: 2,
        complianceStatus: {
          status: "clear",
        },
        stageHistory: {
          "draft-sent": { enteredAt: "Jan 3, 2025, 9:00 AM", enteredBy: "University Compliance" },
          "in-redlining": { enteredAt: "Jan 5, 2025, 10:00 AM", enteredBy: "System" },
          "internal-review": { enteredAt: "Jan 6, 2025, 2:00 PM", enteredBy: "University Legal" },
          "final-review": { enteredAt: "Jan 7, 2025, 11:00 AM", enteredBy: "Kendra B." },
          "ready-to-sign": { enteredAt: "Jan 8, 2025, 4:00 PM", enteredBy: "University Legal" },
        },
        participants: [
          { id: "p1", name: "Jake Martinez", role: "athlete", email: "jmartinez@email.com", isCurrentHolder: true },
          { id: "p2", name: "Tom Brady", role: "agent", email: "tbrady@caa.com", isCurrentHolder: false },
          {
            id: "p3",
            name: "University Legal",
            role: "university-counsel",
            email: "legal@university.edu",
            isCurrentHolder: false,
          },
        ],
        versions: [
          {
            id: "v1",
            versionNumber: 1,
            uploadedDate: "Jan 3, 2025",
            uploadedBy: "University Compliance",
            uploadMethod: "email",
            fileName: "TransferRecruitment_JMartinez_Draft.pdf",
            sentTo: "Athlete",
            holder: "With Agent",
            daysWithHolder: 2,
            summary: null,
          },
          {
            id: "v2",
            versionNumber: 2,
            uploadedDate: "Jan 9, 2025",
            uploadedBy: "Jake Martinez",
            uploadMethod: "email",
            fileName: "TransferRecruitment_JMartinez_Final.pdf",
            sentTo: "All Parties",
            holder: "With Athlete",
            daysWithHolder: 1,
            summary: "All parties agreed to final terms. Ready for signatures.",
          },
        ],
        lastActivity: "All parties ready to sign",
        lastActivityDate: "Jan 9, 2025",
        sport: "Football",
        isUrgent: false,
        emailAddress: `contract-4@track.analog.app`,
        timeline: [
          {
            id: "t1",
            type: "version",
            timestamp: "2025-01-09T10:00:00Z",
            actor: "Jake Martinez",
            versionNumber: 2,
            filename: "TransferRecruitment_JMartinez_Final.pdf",
            holder: "With Athlete",
            isCurrent: true,
            summary: "All parties agreed to final terms. Ready for signatures.",
            daysWithHolder: 1,
          },
          {
            id: "t2",
            type: "status_change",
            timestamp: "2025-01-08T16:00:00Z",
            actor: "University Legal",
            fromStatus: "Final Review",
            toStatus: "Ready to Sign",
          },
          {
            id: "t3",
            type: "note",
            timestamp: "2025-01-08T16:05:00Z",
            actor: "University Legal",
            content: "All terms approved. Contract ready for athlete signature.",
          },
        ],
      },
      "5": {
        id: "5",
        title: "2025 Scholarship Package",
        athlete: "Sarah Johnson",
        athleteId: "ATH005",
        agency: "Excel Sports",
        source: "university",
        sourceName: "Example State University",
        negotiationStatus: "final-review",
        currentHolder: "With Agent",
        daysWithHolder: 2,
        totalValue: 295000,
  startDate: "Aug 1, 2025",
  endDate: "May 31, 2026",
  contractType: "Revenue Share",
  group: "New Recruit",
  daysInCurrentStage: 3,
        complianceStatus: {
          status: "clear",
        },
        stageHistory: {
          "draft-sent": { enteredAt: "Jan 5, 2025, 9:00 AM", enteredBy: "University Compliance" },
          "in-redlining": { enteredAt: "Jan 6, 2025, 11:00 AM", enteredBy: "System" },
          "internal-review": { enteredAt: "Jan 7, 2025, 2:00 PM", enteredBy: "University Legal" },
          "final-review": { enteredAt: "Jan 8, 2025, 10:00 AM", enteredBy: "Kendra B." },
        },
        participants: [
          { id: "p1", name: "Sarah Johnson", role: "athlete", email: "sjohnson@email.com", isCurrentHolder: false },
          { id: "p2", name: "Rachel Green", role: "agent", email: "rgreen@excelsports.com", isCurrentHolder: true },
          {
            id: "p3",
            name: "University Legal",
            role: "university-counsel",
            email: "legal@university.edu",
            isCurrentHolder: false,
          },
        ],
        versions: [
          {
            id: "v1",
            versionNumber: 1,
            uploadedDate: "Jan 6, 2025",
            uploadedBy: "University Compliance",
            uploadMethod: "manual",
            fileName: "Scholarship_SJohnson_Draft.pdf",
            sentTo: "Agent",
            holder: "With Agent",
            daysWithHolder: 2,
            summary: null,
          },
          {
            id: "v2",
            versionNumber: 2,
            uploadedDate: "Jan 8, 2025",
            uploadedBy: "Sarah Johnson",
            uploadMethod: "email",
            fileName: "Scholarship_SJohnson_v2.pdf",
            sentTo: "University",
            holder: "With Agent",
            daysWithHolder: 2,
            summary: "Minor updates to academic eligibility requirements. Agent reviewing final terms.",
          },
        ],
        lastActivity: "Final review of academic eligibility clauses",
        lastActivityDate: "Jan 8, 2025",
        sport: "Volleyball",
        isUrgent: false,
        emailAddress: `contract-5@track.analog.app`,
        timeline: [
          {
            id: "t1",
            type: "version",
            timestamp: "2025-01-08T10:00:00Z",
            actor: "Sarah Johnson",
            versionNumber: 2,
            filename: "Scholarship_SJohnson_v2.pdf",
            holder: "With Agent",
            isCurrent: true,
            summary: "Minor updates to academic eligibility requirements. Agent reviewing final terms.",
            daysWithHolder: 2,
          },
          {
            id: "t2",
            type: "status_change",
            timestamp: "2025-01-08T10:00:00Z",
            actor: "Kendra B.",
            fromStatus: "Internal Review",
            toStatus: "Final Review",
          },
        ],
      },
      "6": {
        id: "6",
        title: "NIL Collective - Multi-Year",
        athlete: "Chris Anderson",
        athleteId: "ATH006",
        agency: "Octagon",
        source: "university",
        sourceName: "Example State University",
        negotiationStatus: "in-redlining",
        currentHolder: "With Agent",
        daysWithHolder: 8,
        totalValue: 780000,
  startDate: "Jan 1, 2025",
  endDate: "Dec 31, 2027",
  contractType: "Revenue Share",
  group: "Retention",
  daysInCurrentStage: 8,
        complianceStatus: {
          status: "flagged",
          flaggedItems: 3,
          reportUrl: "/reports/compliance/6.pdf",
        },
        stageHistory: {
          "draft-sent": { enteredAt: "Jan 1, 2025, 9:00 AM", enteredBy: "University Compliance" },
          "in-redlining": { enteredAt: "Jan 2, 2025, 2:00 PM", enteredBy: "System" },
        },
        participants: [
          { id: "p1", name: "Chris Anderson", role: "athlete", email: "canderson@email.com", isCurrentHolder: false },
          { id: "p2", name: "Michael Ross", role: "agent", email: "mross@octagon.com", isCurrentHolder: true },
          {
            id: "p3",
            name: "University Legal",
            role: "university-counsel",
            email: "legal@university.edu",
            isCurrentHolder: false,
          },
        ],
        versions: [
          {
            id: "v1",
            versionNumber: 1,
            uploadedDate: "Jan 2, 2025",
            uploadedBy: "University Compliance",
            uploadMethod: "email",
            fileName: "NIL_CAnderson_Draft.pdf",
            sentTo: "Agent",
            holder: "With Agent",
            daysWithHolder: 3,
            summary: null,
          },
          {
            id: "v2",
            versionNumber: 2,
            uploadedDate: "Jan 5, 2025",
            uploadedBy: "Chris Anderson",
            uploadMethod: "email",
            fileName: "NIL_CAnderson_Redlines.pdf",
            sentTo: "University",
            holder: "With Agent",
            daysWithHolder: 8,
            summary: "Agent negotiating multi-year guarantee terms. Significant changes to compensation structure.",
          },
        ],
        lastActivity: "Agent negotiating multi-year guarantee terms",
        lastActivityDate: "Jan 2, 2025",
        sport: "Men's Basketball",
        isUrgent: true,
        emailAddress: `contract-6@track.analog.app`,
        timeline: [
          {
            id: "t1",
            type: "note",
            timestamp: "2025-01-10T09:00:00Z",
            actor: "John H.",
            content: "Contract sitting with agent for 8 days. Need to escalate - this is overdue per our SLA.",
          },
          {
            id: "t2",
            type: "version",
            timestamp: "2025-01-05T10:00:00Z",
            actor: "Chris Anderson",
            versionNumber: 2,
            filename: "NIL_CAnderson_Redlines.pdf",
            holder: "With Agent",
            isCurrent: true,
            summary: "Agent negotiating multi-year guarantee terms. Significant changes to compensation structure.",
            daysWithHolder: 8,
          },
          {
            id: "t3",
            type: "email",
            timestamp: "2025-01-04T11:00:00Z",
            actor: "Michael Ross",
            subject: "RE: NIL Collective Agreement - Multi-Year Terms",
            preview:
              "We need more time to review the guarantee provisions. The multi-year structure is complex and our client wants clarity.",
          },
          {
            id: "t4",
            type: "status_change",
            timestamp: "2025-01-02T14:00:00Z",
            actor: "System",
            fromStatus: "Draft Sent",
            toStatus: "In Redlining",
          },
        ],
      },
      "7": {
        id: "7",
        title: "Benefits Pool Agreement",
        athlete: "David Thompson",
        athleteId: "ATH007",
        agency: "Wasserman",
        source: "university",
        sourceName: "Example State University",
        negotiationStatus: "draft-sent",
        currentHolder: "With Athlete",
        daysWithHolder: 2,
        totalValue: 410000,
  startDate: "Mar 1, 2025",
  endDate: "Dec 31, 2025",
  contractType: "Revenue Share",
  group: "New Recruit",
  daysInCurrentStage: 2,
        complianceStatus: {
          status: "clear",
        },
        stageHistory: {
          "draft-sent": { enteredAt: "Jan 8, 2025, 9:00 AM", enteredBy: "University Compliance" },
        },
        participants: [
          { id: "p1", name: "David Thompson", role: "athlete", email: "dthompson@email.com", isCurrentHolder: true },
          { id: "p2", name: "Kelly Davis", role: "agent", email: "kdavis@wasserman.com", isCurrentHolder: false },
          {
            id: "p3",
            name: "University Legal",
            role: "university-counsel",
            email: "legal@university.edu",
            isCurrentHolder: false,
          },
        ],
        versions: [
          {
            id: "v1",
            versionNumber: 1,
            uploadedDate: "Jan 8, 2025",
            uploadedBy: "University Compliance",
            uploadMethod: "email",
            fileName: "BenefitsPool_DThompson_Draft.pdf",
            sentTo: "Athlete",
            holder: "With Athlete",
            daysWithHolder: 2,
            summary: null,
          },
        ],
        lastActivity: "Initial draft sent to athlete",
        lastActivityDate: "Jan 8, 2025",
        sport: "Football",
        isUrgent: false,
        emailAddress: `contract-7@track.analog.app`,
        timeline: [
          {
            id: "t1",
            type: "version",
            timestamp: "2025-01-08T09:00:00Z",
            actor: "University Compliance",
            versionNumber: 1,
            filename: "BenefitsPool_DThompson_Draft.pdf",
            holder: "With Athlete",
            isCurrent: true,
            summary: null,
            daysWithHolder: 2,
          },
        ],
      },
      "8": {
        id: "8",
        title: "2025-26 Rev Share Agreement",
        athlete: "Jordan Mitchell",
        athleteId: "ATH008",
        agency: "Wasserman",
        source: "university",
        sourceName: "Example State University",
        negotiationStatus: "final-review",
        currentHolder: "With University Counsel",
        daysWithHolder: 2,
        totalValue: 520000,
  startDate: "Jul 15, 2025",
  endDate: "Jul 14, 2026",
  contractType: "Revenue Share",
  group: "Retention",
  daysInCurrentStage: 2,
        complianceStatus: {
          status: "clear",
        },
        stageHistory: {
          "draft-sent": { enteredAt: "Jan 5, 2025, 9:00 AM", enteredBy: "University Compliance" },
          "in-redlining": { enteredAt: "Jan 6, 2025, 11:00 AM", enteredBy: "System" },
          "internal-review": { enteredAt: "Jan 7, 2025, 2:00 PM", enteredBy: "University Legal" },
          "final-review": { enteredAt: "Jan 8, 2025, 10:00 AM", enteredBy: "Kendra B." },
        },
        participants: [
          { id: "p1", name: "Jordan Mitchell", role: "athlete", email: "jmitchell@email.com", isCurrentHolder: false },
          { id: "p2", name: "Jennifer Park", role: "agent", email: "jpark@wasserman.com", isCurrentHolder: false },
          {
            id: "p3",
            name: "University Counsel",
            role: "university-counsel",
            email: "counsel@university.edu",
            isCurrentHolder: true,
          },
        ],
        versions: [
          {
            id: "v1",
            versionNumber: 1,
            uploadedDate: "Jan 6, 2025",
            uploadedBy: "University Compliance",
            uploadMethod: "manual",
            fileName: "RevShare_JMitchell_Draft.pdf",
            sentTo: "University Counsel",
            holder: "With University Counsel",
            daysWithHolder: 2,
            summary: null,
          },
          {
            id: "v2",
            versionNumber: 2,
            uploadedDate: "Jan 8, 2025",
            uploadedBy: "Jordan Mitchell",
            uploadMethod: "email",
            fileName: "RevShare_JMitchell_v2.pdf",
            sentTo: "University Counsel",
            holder: "With University Counsel",
            daysWithHolder: 2,
            summary: "University Counsel reviewing termination clauses. Minor updates to Section 5.",
          },
        ],
        lastActivity: "University Counsel reviewing termination clauses",
        lastActivityDate: "Jan 8, 2025",
        sport: "Football",
        isUrgent: false,
        emailAddress: `contract-8@track.analog.app`,
        timeline: [
          {
            id: "t1",
            type: "version",
            timestamp: "2025-01-08T10:00:00Z",
            actor: "Jordan Mitchell",
            versionNumber: 2,
            filename: "RevShare_JMitchell_v2.pdf",
            holder: "With University Counsel",
            isCurrent: true,
            summary: "University Counsel reviewing termination clauses. Minor updates to Section 5.",
            daysWithHolder: 2,
          },
          {
            id: "t2",
            type: "status_change",
            timestamp: "2025-01-08T10:00:00Z",
            actor: "Kendra B.",
            fromStatus: "Internal Review",
            toStatus: "Final Review",
          },
        ],
      },
      "9": {
        id: "9",
        title: "Transfer Portal - Rev Share",
        athlete: "Chris Thompson",
        athleteId: "ATH009",
        agency: "Athletes First",
        source: "university",
        sourceName: "Example State University",
        negotiationStatus: "in-redlining",
        currentHolder: "With Agent",
        daysWithHolder: 5,
        totalValue: 780000,
  startDate: "May 15, 2025",
  endDate: "May 14, 2026",
  contractType: "Revenue Share",
  group: "New Recruit",
  daysInCurrentStage: 5,
        complianceStatus: {
          status: "clear",
        },
        stageHistory: {
          "draft-sent": { enteredAt: "Jan 4, 2025, 9:00 AM", enteredBy: "University Compliance" },
          "in-redlining": { enteredAt: "Jan 5, 2025, 2:00 PM", enteredBy: "System" },
        },
        participants: [
          { id: "p1", name: "Chris Thompson", role: "athlete", email: "cthompson@email.com", isCurrentHolder: false },
          { id: "p2", name: "Lisa Chen", role: "agent", email: "lchen@athletesfirst.com", isCurrentHolder: true },
          {
            id: "p3",
            name: "University Legal",
            role: "university-counsel",
            email: "legal@university.edu",
            isCurrentHolder: false,
          },
        ],
        versions: [
          {
            id: "v1",
            versionNumber: 1,
            uploadedDate: "Jan 5, 2025",
            uploadedBy: "University Compliance",
            uploadMethod: "email",
            fileName: "TransferPortal_CThompson_Draft.pdf",
            sentTo: "Agent",
            holder: "With Agent",
            daysWithHolder: 5,
            summary: null,
          },
        ],
        lastActivity: "Agent negotiating performance incentive terms",
        lastActivityDate: "Jan 5, 2025",
        sport: "Football",
        isUrgent: false,
        emailAddress: `contract-9@track.analog.app`,
        timeline: [
          {
            id: "t1",
            type: "email",
            timestamp: "2025-01-08T14:00:00Z",
            actor: "Lisa Chen",
            subject: "RE: Transfer Portal Agreement - Incentives",
            preview: "We'd like to discuss the performance incentive structure. Can we schedule a call for tomorrow?",
          },
          {
            id: "t2",
            type: "version",
            timestamp: "2025-01-05T10:00:00Z",
            actor: "University Compliance",
            versionNumber: 1,
            filename: "TransferPortal_CThompson_Draft.pdf",
            holder: "With Agent",
            isCurrent: true,
            summary: null,
            daysWithHolder: 5,
          },
          {
            id: "t3",
            type: "status_change",
            timestamp: "2025-01-05T14:00:00Z",
            actor: "System",
            fromStatus: "Draft Sent",
            toStatus: "In Redlining",
          },
        ],
      },
      "10": {
        id: "10",
        title: "Benefits Pool - Retention Agreement",
        athlete: "Devin Harris",
        athleteId: "ATH010",
        agency: "Vayner Sports",
        source: "university",
        sourceName: "Example State University",
        negotiationStatus: "internal-review",
        currentHolder: "With University",
        daysWithHolder: 2,
        totalValue: 410000,
  startDate: "Jul 1, 2025",
  endDate: "Jun 30, 2026",
  contractType: "Revenue Share",
  group: "Transfer",
  daysInCurrentStage: 2,
        complianceStatus: {
          status: "clear",
        },
        stageHistory: {
          "draft-sent": { enteredAt: "Jan 6, 2025, 9:00 AM", enteredBy: "University Compliance" },
          "in-redlining": { enteredAt: "Jan 7, 2025, 11:00 AM", enteredBy: "System" },
          "internal-review": { enteredAt: "Jan 8, 2025, 2:00 PM", enteredBy: "University Legal" },
        },
        participants: [
          { id: "p1", name: "Devin Harris", role: "athlete", email: "dharris@email.com", isCurrentHolder: false },
          { id: "p2", name: "Brandon Lee", role: "agent", email: "blee@vaynersports.com", isCurrentHolder: false },
          { id: "p3", name: "University Compliance", role: "university", email: "compliance@esu.edu", isCurrentHolder: true },
        ],
        versions: [
          {
            id: "v1",
            versionNumber: 1,
            uploadedDate: "Jan 8, 2025",
            uploadedBy: "University Compliance",
            uploadMethod: "manual",
            fileName: "Retention_DHarris_Draft.pdf",
            sentTo: "OSU",
            holder: "With University",
            daysWithHolder: 2,
            summary: null,
          },
        ],
        lastActivity: "OSU reviewing compliance requirements",
        lastActivityDate: "Jan 8, 2025",
        sport: "Football",
        isUrgent: false,
        emailAddress: `contract-10@track.analog.app`,
        timeline: [
          {
            id: "t1",
            type: "version",
            timestamp: "2025-01-08T10:00:00Z",
            actor: "University Compliance",
            versionNumber: 1,
            filename: "Retention_DHarris_Draft.pdf",
            holder: "With University",
            isCurrent: true,
            summary: null,
            daysWithHolder: 2,
          },
          {
            id: "t2",
            type: "status_change",
            timestamp: "2025-01-08T14:00:00Z",
            actor: "University Legal",
            fromStatus: "In Redlining",
            toStatus: "Internal Review",
          },
        ],
      },
    }

    const foundContract = contractDataMap[contractId]
    if (foundContract) {
      setContract(foundContract)
      setIsFlagged(foundContract.isUrgent || false)
    } else {
      setContract(null)
    }
  }, [contractId])

  if (!contract) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading contract...</div>
      </div>
    )
  }

  const currentVersion = contract.versions[contract.versions.length - 1]

  const handleBack = () => {
    window.history.back()
  }

  const handleAddNote = () => {
    if (!newNote.trim()) return

    const note: Note = {
      id: `n${Date.now()}`,
      author: "Current User",
      timestamp: new Date().toLocaleString(),
      content: newNote,
    }

    // Add to notes
    if (!contract.notes) {
      contract.notes = []
    }
    contract.notes.unshift(note)

    const timelineItem: TimelineItem = {
      id: `t${Date.now()}`,
      type: "note",
      timestamp: new Date().toISOString(),
      actor: "Current User",
      content: newNote,
    }
    if (!contract.timeline) {
      contract.timeline = []
    }
    contract.timeline.unshift(timelineItem)

    setNewNote("")
    setContract({ ...contract })
  }

  const getDaysWaitingColor = (days: number) => {
    if (days <= 3) return "text-muted-foreground"
    if (days <= 6) return "text-amber-600 dark:text-amber-500"
    return "text-red-600 dark:text-red-500"
  }

  const getDaysWaitingBg = (days: number) => {
    if (days <= 3) return ""
    if (days <= 6) return "bg-amber-50 dark:bg-amber-950/30"
    return "bg-red-50 dark:bg-red-950/30"
  }

  const workflowStages = [
    { key: "draft-sent", label: "Draft Sent" },
    { key: "in-redlining", label: "In Redlining" },
    { key: "internal-review", label: "Internal Review" },
    { key: "final-review", label: "Final Review" },
    { key: "ready-to-sign", label: "Ready to Sign" },
    { key: "executed", label: "Executed" },
  ]

  const currentStepIndex = workflowStages.findIndex((step) => step.key === contract.negotiationStatus)

  const handleTogglePriority = () => {
    setIsFlagged(!isFlagged)
    toast({
      title: isFlagged ? "Removed from Priority" : "Added to Priority",
      description: isFlagged
        ? "This contract is no longer marked as priority."
        : "This contract is now marked as priority.",
    })
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      return `${diffMinutes} minutes ago`
    }
    if (diffHours < 24) {
      return `${diffHours} hours ago`
    }
    if (diffDays < 7) {
      return `${diffDays} days ago`
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getTimelineBorderColor = (type: TimelineItem["type"]) => {
    switch (type) {
      case "version":
        return "border-l-blue-500"
      case "note":
        return "border-l-gray-400"
      case "email":
        return "border-l-purple-500"
      case "status_change":
        return "border-l-green-500"
      default:
        return "border-l-gray-300"
    }
  }

  const getTimelineIcon = (type: TimelineItem["type"]) => {
    switch (type) {
      case "version":
        return <FileText className="h-4 w-4 text-blue-600" />
      case "note":
        return <MessageSquare className="h-4 w-4 text-gray-500" />
      case "email":
        return <Mail className="h-4 w-4 text-purple-600" />
      case "status_change":
        return <ArrowRightLeft className="h-4 w-4 text-green-600" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" onClick={handleBack} className="mt-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{contract.title}</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTogglePriority}
                className="flex items-center gap-1.5 h-auto px-2 py-1 hover:bg-accent"
                title={isFlagged ? "Remove from Priority" : "Mark as Priority"}
              >
                <Star
                  className={`h-4 w-4 ${isFlagged ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                />
                <span className={`text-sm ${isFlagged ? "text-yellow-600 font-medium" : "text-muted-foreground"}`}>
                  {isFlagged ? "Priority" : "Flag as Priority"}
                </span>
              </Button>
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-sm text-muted-foreground">
              <span>{contract.athlete}</span>
              <span>•</span>
              <span>{contract.agency}</span>
              {contract.sport && (
                <>
                  <span>•</span>
                  <span>{contract.sport}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="py-6 px-8">
            <div className="flex items-center justify-between">
              {workflowStages.map((stage, index) => {
                const isCompleted = index < currentStepIndex
                const isCurrent = index === currentStepIndex
                const isExecuted = stage.key === "executed" && contract.negotiationStatus === "executed"
                const stageHistory = contract.stageHistory?.[stage.key]

                return (
                  <div key={stage.key} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`
                              flex items-center justify-center w-10 h-10 rounded-full border-2 font-medium text-sm cursor-default
                              ${isCompleted ? "bg-green-500 border-green-500 text-white" : ""}
                              ${isCurrent && !isExecuted ? "bg-blue-500 border-blue-500 text-white ring-4 ring-blue-100 dark:ring-blue-900" : ""}
                              ${isExecuted ? "bg-blue-500 border-blue-500 text-white" : ""}
                              ${!isCompleted && !isCurrent ? "bg-background border-muted-foreground/30 text-muted-foreground" : ""}
                            `}
                          >
                            {isCompleted ? <Check className="h-5 w-5" /> : index + 1}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="text-xs">
                          {stageHistory ? (
                            <div>
                              <div className="font-medium">{stage.label}</div>
                              <div className="text-muted-foreground">Entered: {stageHistory.enteredAt}</div>
                              {stageHistory.enteredBy && (
                                <div className="text-muted-foreground">By: {stageHistory.enteredBy}</div>
                              )}
                            </div>
                          ) : (
                            <div>{stage.label} - Not yet reached</div>
                          )}
                        </TooltipContent>
                      </Tooltip>
                      <span
                        className={`
                          mt-2 text-xs font-medium text-center whitespace-nowrap
                          ${isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"}
                        `}
                      >
                        {stage.label === "Internal Review" ? (
                          <>
                            Internal
                            <br />
                            Review
                          </>
                        ) : (
                          stage.label
                        )}
                      </span>
                    </div>
                    {index < workflowStages.length - 1 && (
                      <div
                        className={`
                          flex-1 h-0.5 mx-2 mt-[-1.5rem]
                          ${index < currentStepIndex ? "bg-green-500" : "bg-muted-foreground/30"}
                        `}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4 px-6">
            <div className="grid grid-cols-3 gap-x-6 gap-y-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">Athlete</div>
                <div className="font-medium">{contract.athlete}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">Sport</div>
                <div className="font-medium">{contract.sport}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">Value</div>
                <div className="font-semibold">${contract.totalValue.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">Agency</div>
                <div className="font-medium">{contract.agency}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">Term</div>
                <div className="font-medium">
                  {contract.startDate} - {contract.endDate}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">Type</div>
                <div className="font-medium">{contract.contractType}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">Group</div>
                <div className="font-medium">{contract.group || "—"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">Last Activity</div>
                <div className="font-medium flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  {contract.lastActivityDate}
                </div>
              </div>
              {contract.daysInCurrentStage !== undefined && (
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">Days in Stage</div>
                  <div className={`font-medium ${getDaysWaitingColor(contract.daysInCurrentStage)}`}>
                    {contract.daysInCurrentStage} {contract.daysInCurrentStage === 1 ? "day" : "days"}
                  </div>
                </div>
              )}
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">Compliance Check</div>
                <div className="flex items-center gap-2">
                  {contract.complianceStatus?.status === "clear" ? (
                    <div className="flex items-center gap-1.5 text-green-600 dark:text-green-500">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="font-medium">Clear</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">{contract.complianceStatus?.flaggedItems} items flagged</span>
                    </div>
                  )}
                  {contract.complianceStatus?.reportUrl && (
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                      <Download className="h-3 w-3 mr-1" />
                      Report
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Activity</h3>

              {/* Add Note Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleAddNote()
                    }
                  }}
                />
                <Button size="icon" onClick={handleAddNote}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Timeline with vertical line - Accordion structure */}
              <div className="relative">
                {/* Vertical timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                
                <div className="space-y-3">
                  {(() => {
                    const groups = groupTimelineByVersion(contract.timeline || [])
                    
                    if (groups.length === 0) {
                      return <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>
                    }

                    return groups.map((group) => {
                      const item = group.version
                      const activities = group.activities
                      const isExpanded = expandedVersions.has(item.id)
                      const hasActivities = activities.length > 0

                      return (
                        <div key={item.id} className="relative">
                          {/* Version Card - Full width, covers the line */}
                          <div
                            className={`
                              relative z-10 p-4 rounded-lg border bg-card
                              ${item.isCurrent ? "border-blue-300 bg-blue-50/50 dark:border-blue-700 dark:bg-blue-950/30" : ""}
                              ${item.daysWithHolder && item.daysWithHolder >= 7 ? getDaysWaitingBg(item.daysWithHolder) : ""}
                            `}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {/* FileText icon - always shown */}
                                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 shrink-0">
                                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <span
                                    className={`text-base font-semibold ${item.isCurrent ? "text-blue-700 dark:text-blue-400" : ""}`}
                                  >
                                    v{item.versionNumber}
                                  </span>
                                  <span className="text-sm truncate max-w-[200px]">{item.filename}</span>
                                  {item.isCurrent && (
                                    <Badge variant="default" className="text-xs bg-blue-600">
                                      CURRENT
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  {/* Potential conflicts indicator in upper right */}
                                  {contract.complianceStatus?.status === "flagged" && item.isCurrent && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="flex items-center gap-1 px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs">
                                          <AlertTriangle className="h-3 w-3" />
                                          <span>{contract.complianceStatus.flaggedItems} potential conflicts</span>
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">This version has {contract.complianceStatus.flaggedItems} potential compliance conflicts</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Version
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        View PDF
                                      </DropdownMenuItem>
                                      {contract.complianceStatus?.reportUrl && (
                                        <DropdownMenuItem>
                                          <AlertTriangle className="h-4 w-4 mr-2" />
                                          Download Conflict Report
                                        </DropdownMenuItem>
                                      )}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground pl-11">
                                <span>{item.holder}</span>
                                {item.daysWithHolder !== undefined && (
                                  <span className={getDaysWaitingColor(item.daysWithHolder)}>
                                    {item.daysWithHolder} {item.daysWithHolder === 1 ? "day" : "days"}
                                  </span>
                                )}
                                <span>{formatTimestamp(item.timestamp)}</span>
                                <span>by {item.actor}</span>
                              </div>
                              {item.summary && (
                                <p className="text-sm text-muted-foreground pl-11 border-t pt-2 mt-2">{item.summary}</p>
                              )}
                              {/* Expand/Collapse toggle at bottom left */}
                              {hasActivities && (
                                <button
                                  type="button"
                                  onClick={() => toggleVersionExpanded(item.id)}
                                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-2 pl-11"
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronDown className="h-3.5 w-3.5" />
                                      <span>Hide activity ({activities.length})</span>
                                    </>
                                  ) : (
                                    <>
                                      <ChevronRight className="h-3.5 w-3.5" />
                                      <span>Show activity ({activities.length})</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Collapsible Activities Section */}
                          {hasActivities && isExpanded && (
                            <div className="mt-2 space-y-2">
                              {activities.map((activity) => (
                                <div key={activity.id}>
                                  {/* Note Card - Smaller, to the right of timeline */}
                                  {activity.type === "note" && (
                                    <div className="relative pl-10">
                                      {/* Horizontal branch line */}
                                      <div className="absolute left-4 top-4 w-6 h-0.5 bg-border" />
                                      {/* Dot on the timeline */}
                                      <div className="absolute left-[14px] top-[14px] w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 z-10" />
                                      
                                      <div className="p-3 rounded-lg border bg-card text-sm">
                                        <div className="flex items-center gap-2 mb-1">
                                          <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                                          <span className="font-medium text-sm">{activity.actor}</span>
                                          <span className="text-xs text-muted-foreground">{formatTimestamp(activity.timestamp)}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground pl-5">{activity.content}</p>
                                      </div>
                                    </div>
                                  )}

                                  {/* Email Card - Smaller, to the right of timeline */}
                                  {activity.type === "email" && (
                                    <div className="relative pl-10">
                                      {/* Horizontal branch line */}
                                      <div className="absolute left-4 top-4 w-6 h-0.5 bg-border" />
                                      {/* Dot on the timeline */}
                                      <div className="absolute left-[14px] top-[14px] w-2 h-2 rounded-full bg-purple-500 z-10" />
                                      
                                      <div className="p-3 rounded-lg border border-l-2 border-l-purple-500 bg-card text-sm">
                                        <div className="flex items-center gap-2 mb-1">
                                          <Mail className="h-3.5 w-3.5 text-purple-600" />
                                          <span className="font-medium text-sm">{activity.actor}</span>
                                          <span className="text-xs text-muted-foreground">{formatTimestamp(activity.timestamp)}</span>
                                        </div>
                                        <div className="pl-5">
                                          <div className="text-sm font-medium">{activity.subject}</div>
                                          <p className="text-xs text-muted-foreground mt-0.5">{activity.preview}</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Status Change Card - Smaller, to the right of timeline */}
                                  {activity.type === "status_change" && (
                                    <div className="relative pl-10">
                                      {/* Horizontal branch line */}
                                      <div className="absolute left-4 top-4 w-6 h-0.5 bg-border" />
                                      {/* Dot on the timeline */}
                                      <div className="absolute left-[14px] top-[14px] w-2 h-2 rounded-full bg-green-500 z-10" />
                                      
                                      <div className="p-3 rounded-lg border border-l-2 border-l-green-500 bg-card text-sm">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <ArrowRightLeft className="h-3.5 w-3.5 text-green-600" />
                                          <Badge variant="secondary" className="text-xs h-5">
                                            {activity.fromStatus}
                                          </Badge>
                                          <span className="text-muted-foreground">→</span>
                                          <Badge variant="default" className="text-xs bg-green-600 h-5">
                                            {activity.toStatus}
                                          </Badge>
                                          <span className="text-xs text-muted-foreground ml-auto">
                                            {formatTimestamp(activity.timestamp)} by {activity.actor}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Participants</CardTitle>
                    <p className="text-xs text-muted-foreground">All parties involved in this contract</p>
                  </div>
                  <Button size="sm" variant="ghost" className="h-7 px-2">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {contract.participants.map((participant) => (
                  <Tooltip key={participant.id}>
                    <TooltipTrigger asChild>
                      <div
                        className={`
                          group flex items-start gap-3 rounded-lg border p-2 hover:bg-muted/50 cursor-default
                          ${participant.isCurrentHolder ? "border-blue-300 bg-blue-50/50 dark:border-blue-700 dark:bg-blue-950/30" : ""}
                        `}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {participant.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-sm">{participant.name}</div>
                            {participant.isCurrentHolder && (
                              <Badge variant="default" className="text-xs bg-blue-600 h-5">
                                Current Holder
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{roleLabels[participant.role]}</div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <div className="text-xs">
                        <div className="font-medium">{participant.email}</div>
                        <div className="text-muted-foreground">{roleLabels[participant.role]}</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
                <Button variant="outline" className="w-full justify-start text-sm h-9 bg-transparent" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Participant
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={handleTogglePriority}
                >
                  <Star className={`mr-2 h-4 w-4 ${isFlagged ? "fill-yellow-400 text-yellow-400" : ""}`} />
                  {isFlagged ? "Remove Priority" : "Flag as Important"}
                </Button>
                <Button className="w-full justify-start" onClick={() => setUploadDialogOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Version
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => setStatusChangeModalOpen(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Change Status
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  Download Latest Version
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upload Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload New Version</DialogTitle>
              <DialogDescription>
                Upload the next version of this contract. It will be tracked as v{contract.versions.length + 1}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="file">Contract File (PDF)</Label>
                <Input id="file" type="file" accept=".pdf" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sentTo">Sending To</Label>
                <Input id="sentTo" placeholder="e.g., University, Athlete, All Parties" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="changes">Summary of Changes</Label>
                <Textarea id="changes" placeholder="Brief description of what changed in this version..." rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setUploadDialogOpen(false)}>Upload Version</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Send Dialog */}
        <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Send Contract to Party</DialogTitle>
              <DialogDescription>
                Send the current version (v{currentVersion.versionNumber}) to one or more parties.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Recipients</Label>
                <div className="space-y-2">
                  {contract.participants.map((participant) => (
                    <label
                      key={participant.id}
                      className="flex items-center gap-2 rounded-lg border p-3 cursor-pointer hover:bg-muted/50"
                    >
                      <input type="checkbox" className="h-4 w-4" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{participant.name}</div>
                        <div className="text-xs text-muted-foreground">{participant.email}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea id="message" placeholder="Add a message to the recipients..." rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSendDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setSendDialogOpen(false)}>Send Contract</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Email Setup Dialog */}
        <Dialog open={emailSetupDialogOpen} onOpenChange={setEmailSetupDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Email Integration Setup</DialogTitle>
              <DialogDescription>How to use email to automatically track contract versions</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-muted p-4 space-y-3">
                <h4 className="font-semibold">How It Works</h4>
                <ol className="space-y-2 text-sm list-decimal list-inside">
                  <li>When exchanging contract versions, have all parties CC the contract email address</li>
                  <li>Analog automatically captures the PDF attachment and tracks it as a new version</li>
                  <li>The system records who sent it and who it was sent to</li>
                  <li>Version history updates automatically - no manual uploads needed</li>
                </ol>
              </div>
              <div className="space-y-2">
                <Label>This Contract's Email Address</Label>
                <div className="flex gap-2">
                  <Input value={contract.emailAddress} readOnly className="font-mono text-sm" />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(contract.emailAddress)
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-3 dark:bg-blue-950">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Tip:</strong> You can still manually upload versions if preferred. Both methods work together
                  seamlessly.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setEmailSetupDialogOpen(false)}>Got It</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Status Change Modal */}
        {contract && (
          <StatusChangeModal open={statusChangeModalOpen} onOpenChange={setStatusChangeModalOpen} contract={contract} />
        )}

        {/* Change Holder Modal */}
        {contract && (
          <ChangeHolderModal open={changeHolderModalOpen} onOpenChange={setChangeHolderModalOpen} contract={contract} />
        )}
      </div>
    </TooltipProvider>
  )
}
