"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Download,
  ChevronLeft,
  ChevronRight,
  FileText,
  Scale,
  MessageSquare,
  Clock,
  User,
  X,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useSidebar } from "@/components/ui/sidebar" // Import useSidebar
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip" // Added Tooltip components

interface PermissibilityItem {
  id: string
  title: string
  excerpt: string
  contractSection: string
  contractPage: number
  contractContext: string
  governanceDoc: string
  governanceSection: string
  governanceUrl: string
  governanceQuote: string
  analysis: string
  severity: "compliant" | "warning" | "critical"
  suggestedResolution: string[]
  status: "unreviewed" | "cleared" | "queued" | "blocked"
  reviewedBy?: string
  reviewedAt?: string
  notes?: string
  businessImpact?: string
  similarIssues?: Array<{ contractName: string; resolution: string; date: string }>
}

interface ReviewAction {
  itemId: string
  action: "cleared" | "queued" | "blocked"
  timestamp: string
  user: string
  notes: string
}

interface EnhancedPermissibilityReviewProps {
  contractId: string
  onClose?: () => void
}

const mockPermissibilityItems: PermissibilityItem[] = [
  {
    id: "p1",
    title: "Payment Terms Compliant",
    excerpt: "Net 30 payment terms align with standard commercial practices...",
    contractSection: "Section 4.2",
    contractPage: 3,
    contractContext:
      "Payment shall be made within thirty (30) days of invoice receipt. All payments shall be made via wire transfer to the account specified by the Athlete. Late payments shall accrue interest at a rate of 1.5% per month.",
    governanceDoc: "NCAA Bylaw 12.5.2.1",
    governanceSection: "§ 12.5.2.1 - Payment Timing Requirements",
    governanceUrl: "https://ncaa.org/nil-policy",
    governanceQuote:
      "NIL compensation may be structured with payment terms that align with standard commercial practices, provided that payment timing does not create an impermissible inducement for enrollment or transfer.",
    analysis:
      "The 30-day payment terms are consistent with standard commercial practices and do not create timing-based inducements. The interest clause for late payments is reasonable and protects the athlete's interests.",
    severity: "compliant",
    suggestedResolution: ["No action required", "Document as compliant in final review"],
    status: "unreviewed",
    businessImpact: "Standard payment terms pose no compliance risk and align with industry best practices.",
    similarIssues: [
      { contractName: "Johnson-Adidas Agreement", resolution: "Approved with standard terms", date: "2025-01-15" },
      { contractName: "Williams-Nike Contract", resolution: "Approved without modifications", date: "2024-12-10" },
    ],
  },
  {
    id: "p2",
    title: "Termination Clause Imbalance",
    excerpt: "Either party may terminate with 60 days notice...",
    contractSection: "Section 12.3",
    contractPage: 11,
    contractContext:
      "Either party may terminate this Agreement with sixty (60) days written notice. Upon termination, Sponsor shall have the right to use any content created prior to termination date for an additional six (6) months.",
    governanceDoc: "Student-Athlete Rights Framework",
    governanceSection: "§ 3.4 - Termination Rights",
    governanceUrl: "https://ncaa.org/student-athlete-rights",
    governanceQuote:
      "NIL agreements should provide equitable termination rights to student-athletes. Post-termination usage rights should be clearly defined and not extend beyond reasonable commercial periods.",
    analysis:
      "The 60-day notice period is longer than the typical 30-day standard, which may disadvantage the athlete. The 6-month post-termination usage right could be problematic if the athlete wishes to sign with a competing brand.",
    severity: "warning",
    suggestedResolution: [
      "Negotiate notice period down to 30 days",
      "Limit post-termination usage to 90 days",
      "Add buyout clause for early termination",
    ],
    status: "unreviewed",
    businessImpact:
      "Extended notice period and post-termination rights may limit athlete's future opportunities and create competitive disadvantages.",
    similarIssues: [
      {
        contractName: "Davis-Under Armour Deal",
        resolution: "Negotiated to 30-day notice with 60-day usage",
        date: "2025-01-20",
      },
    ],
  },
  {
    id: "p3",
    title: "Prohibited Recruiting Activities",
    excerpt: "Contract language suggests potential recruiting inducements...",
    contractSection: "Section 2.5",
    contractPage: 5,
    contractContext:
      "Sponsor agrees to provide additional compensation of $25,000 if Athlete transfers to a university within the ACC conference. This bonus shall be paid within 30 days of enrollment confirmation.",
    governanceDoc: "NCAA Bylaw 13.2.1",
    governanceSection: "§ 13.2.1 - Recruiting Inducements",
    governanceUrl: "https://ncaa.org/bylaws-13-2-1",
    governanceQuote:
      "A member institution's staff member or any representative of its athletics interests shall not be involved, directly or indirectly, in making arrangements for or giving or offering to give any financial aid or other benefits to a prospective student-athlete or their relatives or friends, other than expressly permitted by NCAA legislation.",
    analysis:
      "This clause creates a direct financial inducement tied to transfer decisions, which violates NCAA recruiting regulations. The conference-specific language suggests coordination with institutional interests, which is prohibited.",
    severity: "critical",
    suggestedResolution: [
      "Remove transfer-contingent compensation entirely",
      "Restructure as performance-based compensation unrelated to school choice",
      "Consult with compliance office before proceeding",
    ],
    status: "unreviewed",
    businessImpact:
      "This clause creates severe NCAA violation risk that could result in athlete ineligibility, institutional sanctions, and contract nullification.",
    similarIssues: [
      {
        contractName: "Thompson-Regional Sports Brand",
        resolution: "Clause removed entirely after legal review",
        date: "2024-11-05",
      },
      {
        contractName: "Martinez-Apparel Company",
        resolution: "Restructured as performance bonus unrelated to school",
        date: "2024-10-22",
      },
    ],
  },
  {
    id: "p4",
    title: "Missing State Disclosure Requirements",
    excerpt: "California requires specific financial disclosures for NIL agreements...",
    contractSection: "N/A - Missing Provision",
    contractPage: 0,
    contractContext: "No disclosure provision found in contract.",
    governanceDoc: "California SB 206 § 67456(c)",
    governanceSection: "§ 67456(c) - Financial Disclosure Requirements",
    governanceUrl: "https://leginfo.legislature.ca.gov/sb206",
    governanceQuote:
      "A postsecondary educational institution shall require a student athlete to report to the institution, in a manner and time prescribed by the institution, the existence of any name, image, or likeness agreement and the value of any compensation received.",
    analysis:
      "California law requires athletes to disclose NIL agreements to their institution. The contract should include language requiring the athlete to comply with state disclosure requirements and provide a mechanism for institutional notification.",
    severity: "warning",
    suggestedResolution: [
      "Add disclosure compliance clause",
      "Include institutional notification requirement",
      "Specify disclosure timeline (typically within 7 days)",
    ],
    status: "unreviewed",
    businessImpact:
      "Missing disclosure provisions could result in state law violations and potential athlete eligibility issues in California.",
    similarIssues: [
      {
        contractName: "Lee-Tech Startup Agreement",
        resolution: "Added standard disclosure clause with 7-day timeline",
        date: "2025-01-18",
      },
    ],
  },
  {
    id: "p5",
    title: "Intellectual Property Overreach",
    excerpt: "Usage rights extend beyond reasonable scope...",
    contractSection: "Section 6.1",
    contractPage: 7,
    contractContext:
      "Athlete grants Sponsor perpetual, worldwide, royalty-free license to use Athlete's name, image, likeness, voice, signature, and biographical information in any and all media now known or hereafter developed, including but not limited to AI-generated content and deepfakes.",
    governanceDoc: "NIL Rights Protection Guidelines",
    governanceSection: "§ 2.3 - Scope of Rights Grants",
    governanceUrl: "https://ncaa.org/nil-rights-protection",
    governanceQuote:
      "NIL agreements should clearly define the scope and duration of rights granted. Perpetual licenses and overly broad usage rights may not adequately protect student-athlete interests and should be carefully reviewed.",
    analysis:
      "The perpetual license is problematic as it extends beyond the contract term. The inclusion of AI-generated content and deepfakes without limitations raises significant concerns about athlete control over their likeness.",
    severity: "critical",
    suggestedResolution: [
      "Limit license duration to contract term plus 1 year",
      "Exclude AI-generated content or add strict approval requirements",
      "Add moral rights protections",
      "Include right to review and approve all uses",
    ],
    status: "unreviewed",
    businessImpact:
      "Perpetual rights and AI usage without controls could damage athlete's brand, create reputational risks, and limit future commercial opportunities.",
    similarIssues: [
      {
        contractName: "Garcia-Fashion Brand Deal",
        resolution: "Limited to 2-year term with AI usage approval rights",
        date: "2025-01-12",
      },
    ],
  },
]

export function EnhancedPermissibilityReview({ contractId, onClose }: EnhancedPermissibilityReviewProps) {
  const [items, setItems] = useState<PermissibilityItem[]>(mockPermissibilityItems)
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null)
  const [reviewHistory, setReviewHistory] = useState<ReviewAction[]>([])
  const [actionModalOpen, setActionModalOpen] = useState(false)
  const [currentAction, setCurrentAction] = useState<"cleared" | "queued" | "blocked" | null>(null)
  const [actionNotes, setActionNotes] = useState("")
  const [legalQueueVisible, setLegalQueueVisible] = useState(false)
  const [showMoreContext, setShowMoreContext] = useState(false)
  const [showSimilarIssues, setShowSimilarIssues] = useState(false)
  const [reviewNotes, setReviewNotes] = useState("")
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null) // Added textarea ref

  const { toggleSidebar, state: sidebarState } = useSidebar()
  const [sidebarWasExpanded, setSidebarWasExpanded] = useState(false)

  const focusedItem = items.find((item) => item.id === focusedItemId)
  const focusedIndex = items.findIndex((item) => item.id === focusedItemId)

  const stats = {
    total: items.length,
    reviewed: items.filter((item) => item.status !== "unreviewed").length,
    cleared: items.filter((item) => item.status === "cleared").length,
    queued: items.filter((item) => item.status === "queued").length,
    blocked: items.filter((item) => item.status === "blocked").length,
    compliant: items.filter((item) => item.severity === "compliant").length,
    warning: items.filter((item) => item.severity === "warning").length,
    critical: items.filter((item) => item.severity === "critical").length,
  }

  useEffect(() => {
    if (focusedItemId) {
      // Remember if sidebar was expanded before entering focused mode
      setSidebarWasExpanded(sidebarState === "expanded")
      // Collapse sidebar if it's expanded
      if (sidebarState === "expanded") {
        toggleSidebar()
      }
    } else {
      // Re-expand sidebar if it was expanded before entering focused mode
      if (sidebarWasExpanded && sidebarState === "collapsed") {
        toggleSidebar()
      }
    }
  }, [focusedItemId])

  useEffect(() => {
    if (!focusedItemId) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return

      switch (e.key) {
        case "Enter":
          handleActionClick("cleared")
          break
        case "l":
        case "L":
          handleActionClick("queued")
          break
        case "b":
        case "B":
          handleActionClick("blocked")
          break
        case "Escape":
          setFocusedItemId(null)
          break
        case "ArrowLeft":
          navigateToPrevious()
          break
        case "ArrowRight":
          navigateToNext()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [focusedItemId, focusedIndex])

  useEffect(() => {
    console.log("[v0] EnhancedPermissibilityReview mounted for contract:", contractId)
  }, [contractId])

  useEffect(() => {
    if (reviewNotes && focusedItemId) {
      const timer = setTimeout(() => {
        setLastSaved(new Date())
        console.log("[v0] Auto-saved review notes for item:", focusedItemId)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [reviewNotes, focusedItemId])

  useEffect(() => {
    if (focusedItemId) {
      setShowMoreContext(false)
      const item = items.find((i) => i.id === focusedItemId)
      setShowSimilarIssues(item?.similarIssues && item.similarIssues.length > 0 ? true : false)
      setReviewNotes(focusedItem?.notes || "")
      setLastSaved(null)
    }
  }, [focusedItemId])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [reviewNotes])

  const navigateToPrevious = () => {
    if (focusedIndex > 0) {
      setFocusedItemId(items[focusedIndex - 1].id)
    }
  }

  const navigateToNext = () => {
    if (focusedIndex < items.length - 1) {
      setFocusedItemId(items[focusedIndex + 1].id)
    }
  }

  const getRiskLevel = (severity: string) => {
    switch (severity) {
      case "compliant":
        return {
          level: "Low Risk",
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-100 dark:bg-green-900/30",
        }
      case "warning":
        return {
          level: "Medium Risk",
          color: "text-yellow-600 dark:text-yellow-400",
          bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
        }
      case "critical":
        return { level: "High Risk", color: "text-red-600 dark:text-red-400", bgColor: "bg-red-100 dark:bg-red-900/30" }
      default:
        return { level: "Unknown", color: "text-gray-600", bgColor: "bg-gray-100" }
    }
  }

  const getSmartDefaultAction = (severity: string): "cleared" | "queued" | "blocked" => {
    switch (severity) {
      case "compliant":
        return "cleared"
      case "warning":
        return "queued"
      case "critical":
        return "queued"
      default:
        return "queued"
    }
  }

  const handleActionClick = (action: "cleared" | "queued" | "blocked") => {
    setCurrentAction(action)
    setActionNotes(reviewNotes) // Pre-fill with review notes
    setActionModalOpen(true)
  }

  const handleActionConfirm = () => {
    if (!focusedItemId || !currentAction || !actionNotes.trim()) return

    const newAction: ReviewAction = {
      itemId: focusedItemId,
      action: currentAction,
      timestamp: new Date().toISOString(),
      user: "Current User", // In real app, get from auth context
      notes: actionNotes,
    }

    setReviewHistory([...reviewHistory, newAction])

    setItems(
      items.map((item) =>
        item.id === focusedItemId
          ? {
              ...item,
              status: currentAction,
              reviewedBy: "Current User",
              reviewedAt: new Date().toISOString(),
              notes: actionNotes, // Update notes from actionNotes
            }
          : item,
      ),
    )

    setActionModalOpen(false)
    setActionNotes("")
    setCurrentAction(null)

    // Auto-advance to next item
    if (focusedIndex < items.length - 1) {
      setFocusedItemId(items[focusedIndex + 1].id)
    } else {
      setFocusedItemId(null)
    }
  }

  const handleSendToLegal = () => {
    const queuedItems = items.filter((item) => item.status === "queued")
    // In real app, this would generate an email or notification
    console.log("Sending to legal:", queuedItems)
    alert(`${queuedItems.length} items queued for legal review`)
  }

  const getStatusBadge = (item: PermissibilityItem) => {
    switch (item.status) {
      case "cleared":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Cleared {item.reviewedBy && `(${item.reviewedBy.split(" ")[0]})`}
          </Badge>
        )
      case "queued":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
          >
            Pending Legal
          </Badge>
        )
      case "blocked":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Blocked
          </Badge>
        )
      default:
        return <Badge variant="outline">Unreviewed</Badge>
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "compliant":
        return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const handleItemClick = (itemId: string) => {
    console.log("[v0] Item clicked:", itemId)
    setFocusedItemId(itemId)
  }

  const getTextLines = (text: string) => {
    return text.split("\n").filter((line) => line.trim().length > 0)
  }

  const highlightConflictingText = (text: string, isContract: boolean) => {
    if (focusedItem?.severity === "compliant") return text

    // Simple highlighting logic - in real app, this would use NLP to identify conflicts
    const conflictPhrases = isContract
      ? ["$25,000 if Athlete transfers", "within the ACC conference", "perpetual", "AI-generated content"]
      : ["shall not be involved", "making arrangements", "not adequately protect"]

    let highlightedText = text
    conflictPhrases.forEach((phrase) => {
      if (text.toLowerCase().includes(phrase.toLowerCase())) {
        const regex = new RegExp(`(${phrase})`, "gi")
        highlightedText = highlightedText.replace(
          regex,
          '<mark class="bg-yellow-200 dark:bg-yellow-900/50 px-1 rounded">$1</mark>',
        )
      }
    })

    return highlightedText
  }

  const handleDownloadReport = () => {
    console.log("[v0] Generating compliance review report")
    alert("Generating PDF report with contract analysis and compliance notes...")
  }

  if (focusedItemId && focusedItem) {
    const riskLevel = getRiskLevel(focusedItem.severity)
    const smartDefault = getSmartDefaultAction(focusedItem.severity)
    const contractLines = getTextLines(focusedItem.contractContext)
    const governanceLines = getTextLines(focusedItem.governanceQuote)

    return {
      listPanel: (
        <div className="sticky top-18 self-start space-y-6">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-2xl">Permissibility Review</CardTitle>
            </CardHeader>

            <CardContent className="p-4">
              <div className="max-h-[calc(100vh-280px)] overflow-y-auto space-y-2">
                {items.map((item) => {
                  const isActive = item.id === focusedItemId
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`relative cursor-pointer rounded-lg border p-3 transition-all ${
                        isActive
                          ? "border-primary bg-primary/5 shadow-sm border-l-4"
                          : "border-border bg-white opacity-60 hover:opacity-100 hover:border-primary/30 dark:bg-card"
                      }`}
                      onClick={() => handleItemClick(item.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">{getSeverityIcon(item.severity)}</div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`text-sm font-semibold leading-tight truncate ${isActive ? "text-primary" : ""}`}
                          >
                            {item.title}
                          </h4>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {item.contractSection}, Page {item.contractPage}
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {item.status === "cleared" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                          {item.status === "queued" && <Clock className="h-4 w-4 text-yellow-600" />}
                          {item.status === "blocked" && <AlertTriangle className="h-4 w-4 text-red-600" />}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Legal Review Queue */}
          {stats.queued > 0 && (
            <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold leading-tight">Legal Review Queue</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{stats.queued} items pending legal review</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setLegalQueueVisible(!legalQueueVisible)}>
                      {legalQueueVisible ? "Hide" : "Show"} Items
                    </Button>
                    <Button size="sm" onClick={handleSendToLegal}>
                      Send to Legal
                    </Button>
                  </div>
                </div>

                {legalQueueVisible && (
                  <div className="mt-4 space-y-2">
                    {items
                      .filter((item) => item.status === "queued")
                      .map((item) => (
                        <div key={item.id} className="rounded-lg border bg-white p-3 dark:bg-card">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="text-sm font-medium leading-tight">{item.title}</h5>
                              <p className="mt-1 text-xs text-muted-foreground">{item.notes}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setFocusedItemId(item.id)}>
                              Review
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      ),
      detailPanel: (
        <AnimatePresence mode="wait">
          <motion.div
            key={focusedItemId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="relative flex h-full flex-col"
          >
            <Card className="flex h-full flex-col">
              <CardHeader className="border-b bg-muted/30">
                <div className="mb-3 flex items-center gap-1.5">
                  {items.map((item, idx) => {
                    const isCompleted = item.status !== "unreviewed"
                    const isCurrent = idx === focusedIndex
                    return (
                      <TooltipProvider key={item.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => setFocusedItemId(item.id)}
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
                              {item.title} {isCompleted && "✓"}
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
                        Item {focusedIndex + 1} of {items.length}
                      </span>
                      <span>•</span>
                      <span>{stats.reviewed} reviewed</span>
                    </div>
                    <CardTitle className="text-xl leading-tight">{focusedItem.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={navigateToPrevious} disabled={focusedIndex === 0}>
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
                            onClick={navigateToNext}
                            disabled={focusedIndex === items.length - 1}
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
                          <Button variant="ghost" size="icon" onClick={() => setFocusedItemId(null)}>
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

                <div className="mt-3 flex items-center gap-2 border-t pt-3">
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    <FileText className="mr-1.5 h-3.5 w-3.5" />
                    View Full Contract
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    Download Contract
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    Download All Governance Docs
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Issue Summary Card */}
                  <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <Badge className={`${riskLevel.bgColor} ${riskLevel.color} border-0`}>
                            {getSeverityIcon(focusedItem.severity)}
                            <span className="ml-1.5">{riskLevel.level}</span>
                          </Badge>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                                >
                                  <Info className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs max-w-xs">
                                  Risk levels indicate compliance severity and recommended action priority
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <p className="text-sm font-medium leading-relaxed">{focusedItem.analysis.split(".")[0]}.</p>
                      </div>
                    </div>

                    {focusedItem.businessImpact && (
                      <div className="mt-3 border-t border-primary/10 pt-3">
                        <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Why This Matters
                        </h4>
                        <p className="text-sm leading-relaxed text-foreground">{focusedItem.businessImpact}</p>
                      </div>
                    )}
                  </div>

                  {/* Document Comparison */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold leading-tight">Document Comparison</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowMoreContext(!showMoreContext)}
                        className="text-xs"
                      >
                        {showMoreContext ? (
                          <>
                            <ChevronUp className="mr-1 h-3.5 w-3.5" />
                            Show Less Context
                          </>
                        ) : (
                          <>
                            <ChevronDown className="mr-1 h-3.5 w-3.5" />
                            Show More Context
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      <div className="rounded-lg border bg-white dark:bg-card">
                        <div className="border-b bg-muted/50 px-4 py-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <h4 className="text-sm font-semibold leading-tight">Contract Excerpt</h4>
                          </div>
                          <Badge variant="outline" className="mt-1.5 text-xs">
                            {focusedItem.contractSection}, Page {focusedItem.contractPage}
                          </Badge>
                        </div>
                        <div className="p-4">
                          {showMoreContext && (
                            <p className="mb-3 font-mono text-xs leading-relaxed text-muted-foreground">
                              [Previous paragraphs would appear here...]
                            </p>
                          )}
                          <div className="rounded bg-yellow-50 p-3 dark:bg-yellow-900/20">
                            <div className="flex gap-3">
                              <div className="flex flex-col gap-1 text-xs text-muted-foreground font-mono select-none">
                                {contractLines.map((_, idx) => (
                                  <div key={idx} className="leading-relaxed">
                                    {idx + 1}
                                  </div>
                                ))}
                              </div>
                              <div className="flex-1">
                                <p
                                  className="font-mono text-sm leading-relaxed"
                                  dangerouslySetInnerHTML={{
                                    __html: highlightConflictingText(focusedItem.contractContext, true),
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          {showMoreContext && (
                            <p className="mt-3 font-mono text-xs leading-relaxed text-muted-foreground">
                              [Following paragraphs would appear here...]
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="rounded-lg border bg-white dark:bg-card">
                        <div className="border-b bg-muted/50 px-4 py-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Scale className="h-4 w-4 text-primary" />
                              <h4 className="text-sm font-semibold leading-tight">Governance Requirement</h4>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0"
                              onClick={() => window.open(focusedItem.governanceUrl, "_blank")}
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <div className="mt-1.5 flex items-center gap-2">
                            <span className="text-xs font-medium">{focusedItem.governanceDoc}</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <Badge variant="outline" className="mb-3 text-xs">
                            {focusedItem.governanceSection}
                          </Badge>
                          <div className="rounded border-l-4 border-primary bg-primary/5 p-3">
                            <div className="flex gap-3">
                              <div className="flex flex-col gap-1 text-xs text-muted-foreground font-mono select-none">
                                {governanceLines.map((_, idx) => (
                                  <div key={idx} className="leading-relaxed">
                                    {idx + 1}
                                  </div>
                                ))}
                              </div>
                              <div className="flex-1">
                                <p
                                  className="text-sm leading-relaxed"
                                  dangerouslySetInnerHTML={{
                                    __html: highlightConflictingText(focusedItem.governanceQuote, false),
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {focusedItem.severity !== "compliant" && (
                      <div className="mt-2 flex items-center justify-center">
                        <div className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-1.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span>Conflict Detected</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Analysis & Recommendations */}
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold leading-tight">Analysis & Recommendations</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="mb-2 text-sm font-medium leading-tight">Detailed Analysis</h4>
                        <p className="text-sm leading-relaxed text-muted-foreground">{focusedItem.analysis}</p>
                      </div>

                      {focusedItem.similarIssues && focusedItem.similarIssues.length > 0 && (
                        <div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowSimilarIssues(!showSimilarIssues)}
                            className="mb-2 h-auto p-0 text-sm font-medium hover:text-primary"
                          >
                            {showSimilarIssues ? (
                              <>
                                <ChevronUp className="mr-1 h-4 w-4" />
                                Hide Similar Issues
                              </>
                            ) : (
                              <>
                                <ChevronDown className="mr-1 h-4 w-4" />
                                Show Similar Issues ({focusedItem.similarIssues.length})
                              </>
                            )}
                          </Button>

                          {showSimilarIssues && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="rounded-lg border bg-blue-50/50 p-3 dark:bg-blue-950/20"
                            >
                              <h5 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                How Similar Issues Were Resolved
                              </h5>
                              <div className="space-y-2">
                                {focusedItem.similarIssues.map((issue, index) => (
                                  <div key={index} className="rounded-lg border bg-white p-3 dark:bg-card">
                                    <div className="mb-1 flex items-start justify-between gap-2">
                                      <span className="text-sm font-medium leading-tight">{issue.contractName}</span>
                                      <span className="text-xs text-muted-foreground">{issue.date}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                                      <p className="text-xs text-muted-foreground leading-relaxed">
                                        {issue.resolution}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold leading-tight text-blue-900 dark:text-blue-100">
                          Informational Only
                        </h4>
                        <p className="mt-1 text-sm leading-relaxed text-blue-800 dark:text-blue-200">
                          This issue is flagged for awareness only. No action required for executed contracts.
                        </p>
                      </div>
                    </div>
                  </div>

                  {focusedItem.status !== "unreviewed" && focusedItem.notes && (
                    <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
                      <h4 className="mb-2 text-sm font-semibold leading-tight">Review History</h4>
                      <div className="mb-2 flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {focusedItem.reviewedBy} •{" "}
                          {focusedItem.reviewedAt && new Date(focusedItem.reviewedAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{focusedItem.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      ),
      actionHandlers: {
        onClear: () => handleActionClick("cleared"),
        onQueue: () => handleActionClick("queued"),
        onBlock: () => handleActionClick("blocked"),
        onPrevious: navigateToPrevious,
        onNext: navigateToNext,
        onBack: () => setFocusedItemId(null),
        canGoPrevious: focusedIndex > 0,
        canGoNext: focusedIndex < items.length - 1,
        smartDefault, // Expose smart default for button styling
      },
      modal: (
        <Dialog open={actionModalOpen} onOpenChange={setActionModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentAction === "cleared" && "Approve with Notes"}
                {currentAction === "queued" && "Request Legal Opinion"}
                {currentAction === "blocked" && "Block Contract"}
              </DialogTitle>
              <DialogDescription>
                {currentAction === "cleared" && "Issue addressed or risk accepted"}
                {currentAction === "queued" && "Need expert guidance"}
                {currentAction === "blocked" && "Must fix before activation"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Add your notes here..."
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={4}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setActionModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleActionConfirm} disabled={!actionNotes.trim()}>
                  Confirm
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ),
    }
  }

  return (
    <div className="space-y-6">
      {/* Combined Permissibility Review Card */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-2xl">Permissibility Review</CardTitle>

          <div className="mt-4 rounded-lg border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
            <h3 className="mb-2 text-sm font-semibold leading-tight text-blue-900 dark:text-blue-100">
              Contract Analysis Summary
            </h3>
            <p className="mb-3 text-sm leading-relaxed text-blue-800 dark:text-blue-200">
              This contract appears compliant with 3 minor considerations around termination terms and IP usage. All
              issues are informational only as this contract has already been executed.
            </p>
            <Button variant="outline" size="sm" onClick={handleDownloadReport} className="bg-white dark:bg-card">
              <Download className="mr-2 h-4 w-4" />
              Download Review Report
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
              {stats.cleared} Cleared
            </Badge>
            <Badge
              variant="secondary"
              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
            >
              {stats.queued} Queued
            </Badge>
            <Badge variant="destructive">{stats.blocked} Blocked</Badge>
            <Badge variant="outline">{stats.total - stats.reviewed} Unreviewed</Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {stats.reviewed} of {stats.total} items reviewed
          </p>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-3">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="cursor-pointer rounded-lg border bg-white p-4 transition-all hover:border-primary/50 hover:shadow-md dark:bg-card"
                onClick={() => handleItemClick(item.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{getSeverityIcon(item.severity)}</div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold leading-tight">{item.title}</h4>
                        <p className="mt-1 text-sm text-muted-foreground">{item.excerpt}</p>
                      </div>
                      {getStatusBadge(item)}
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-4 border-t pt-3">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          <span>
                            {item.contractSection}, Page {item.contractPage}
                          </span>
                        </div>
                        <div className="h-3 w-px bg-border" />
                        <div className="flex items-center gap-1">
                          <Scale className="h-3 w-3" />
                          <span>{item.governanceDoc}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs text-primary hover:text-primary/80"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(item.governanceUrl, "_blank")
                            }}
                          >
                            <Download className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">Click to review details</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legal Review Queue */}
      {stats.queued > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold leading-tight">Legal Review Queue</h4>
                <p className="mt-1 text-sm text-muted-foreground">{stats.queued} items pending legal review</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setLegalQueueVisible(!legalQueueVisible)}>
                  {legalQueueVisible ? "Hide" : "Show"} Items
                </Button>
                <Button size="sm" onClick={handleSendToLegal}>
                  Send to Legal
                </Button>
              </div>
            </div>

            {legalQueueVisible && (
              <div className="mt-4 space-y-2">
                {items
                  .filter((item) => item.status === "queued")
                  .map((item) => (
                    <div key={item.id} className="rounded-lg border bg-white p-3 dark:bg-card">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="text-sm font-medium leading-tight">{item.title}</h5>
                          <p className="mt-1 text-xs text-muted-foreground">{item.notes}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setFocusedItemId(item.id)}>
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Review History */}
      {reviewHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Review History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reviewHistory.map((action, index) => {
                const item = items.find((i) => i.id === action.itemId)
                return (
                  <div key={index} className="flex items-start gap-3 border-l-2 border-primary pl-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item?.title}</span>
                        <Badge
                          variant={
                            action.action === "cleared"
                              ? "default"
                              : action.action === "queued"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-xs"
                        >
                          {action.action}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{action.notes}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{action.user}</span>
                        <span>•</span>
                        <Clock className="h-3 w-3" />
                        <span>{new Date(action.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
