"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ArrowLeft,
  Plus,
  Pencil,
  Mail,
  Phone,
  Globe,
  Info,
  Download,
  Upload,
  User,
  Search,
  ArrowUpRight,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

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
    committed: 200000,
    allocated: 125000,
    available: 75000,
    totalPaid: 45000,
    nextPaymentDate: "Apr 15, 2026",
    nextPaymentAmount: 15000,
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
    ],
    upcomingPayments: [
      { id: "p1", date: "Apr 15, 2026", athleteName: "Darius Thornton", amount: 15000, contractId: "NIL-2025-DT-001", status: "Upcoming" },
      { id: "p2", date: "May 1, 2026", athleteName: "Jaylen Porter", amount: 35000, contractId: "NIL-2025-JP-002", status: "Upcoming" },
      { id: "p3", date: "Mar 20, 2026", athleteName: "Marcus Johnson", amount: 25000, contractId: "NIL-2025-MJ-003", status: "Scheduled" },
    ],
    upcomingDeliverables: [
      { id: "d1", type: "Social Media Post", athleteName: "Darius Thornton", progress: "1 of 5", deadline: "Mar 30, 2026", contractId: "NIL-2025-DT-001", status: "Pending" },
      { id: "d2", type: "In-Person Appearance", athleteName: "Darius Thornton", progress: "0 of 2", deadline: "Apr 5, 2026", contractId: "NIL-2025-DT-001", status: "Pending" },
      { id: "d3", type: "In-Person Appearance", athleteName: "Jaylen Porter", progress: "0 of 1", deadline: "Mar 1, 2026", contractId: "NIL-2025-JP-002", status: "Overdue" },
    ],
    completedDeliverables: [
      { id: "c1", type: "Social Media Post", athleteName: "Darius Thornton", completed: "Mar 15, 2026", contractId: "NIL-2025-DT-001", verifiedBy: "Brand Team", status: "Complete" },
      { id: "c2", type: "Social Media Post", athleteName: "Jaylen Porter", completed: "Mar 10, 2026", contractId: "NIL-2025-JP-002", verifiedBy: "Analog Admin", status: "Complete" },
    ],
    contractDocuments: [
      { id: "doc1", name: "Nike NIL Agreement - Darius Thornton", type: "Contract", date: "Jan 16, 2026", relatedContract: "NIL-2025-DT-001", size: "2.4 MB" },
      { id: "doc2", name: "Nike NIL Agreement - Jaylen Porter", type: "Contract", date: "Jan 20, 2026", relatedContract: "NIL-2025-JP-002", size: "1.8 MB" },
    ],
    recommendedAthletes: [
      { id: "osu-005", name: "Brandon Hayes", sport: "Football", reach: 425000, engagement: 4.8, existingContract: false },
      { id: "osu-006", name: "Tyler Washington", sport: "Men's Basketball", reach: 312000, engagement: 5.2, existingContract: false },
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
        sport: "Women's Basketball",
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
      { id: "d1", type: "Social Media Post", athleteName: "Sarah Williams", progress: "0 of 2", deadline: "Apr 1, 2026", contractId: "NIL-2025-SW-001", status: "Pending" },
    ],
    completedDeliverables: [],
    contractDocuments: [
      { id: "doc1", name: "NIL Agreement - Sarah Williams", type: "Contract", date: "Feb 1, 2026", relatedContract: "NIL-2025-SW-001", size: "1.5 MB" },
    ],
    recommendedAthletes: [
      { id: "osu-008", name: "Emma Rodriguez", sport: "Soccer", reach: 145000, engagement: 4.2, existingContract: false },
    ],
  },
}

// Add default sponsor data for any ID not in the mock
const defaultSponsor = {
  name: "Example Sponsor",
  type: "Business",
  status: "Active",
  contactName: "Contact Name",
  contactTitle: "Title",
  email: "contact@example.com",
  phone: "(555) 000-0000",
  website: "https://example.com",
  address: { line1: "123 Main St", city: "City", state: "ST", zip: "00000" },
  committed: 100000,
  allocated: 50000,
  available: 50000,
  totalPaid: 25000,
  nextPaymentDate: "May 1, 2026",
  nextPaymentAmount: 10000,
  contracts: [],
  upcomingPayments: [],
  upcomingDeliverables: [],
  completedDeliverables: [],
  contractDocuments: [],
  recommendedAthletes: [],
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

export function SponsorDetail({ sponsorId }: SponsorDetailProps) {
  const router = useRouter()
  const sponsor = mockSponsorData[sponsorId] || defaultSponsor

  const [activeTab, setActiveTab] = useState<"Overview" | "Contracts" | "Athletes" | "Deliverables" | "Payments" | "Documents">("Overview")
  const [paymentsView, setPaymentsView] = useState<"upcoming" | "historical">("upcoming")
  const [contractStatusFilter, setContractStatusFilter] = useState("all")
  const [deliverableStatusFilter, setDeliverableStatusFilter] = useState("all")

  // Filter contracts
  const filteredContracts = sponsor.contracts.filter((c: any) => {
    return contractStatusFilter === "all" || c.status.toLowerCase() === contractStatusFilter.toLowerCase()
  })

  // Filter deliverables
  const filteredUpcomingDeliverables = sponsor.upcomingDeliverables.filter((d: any) => {
    return deliverableStatusFilter === "all" || d.status.toLowerCase() === deliverableStatusFilter.toLowerCase()
  })

  return (
    <TooltipProvider>
      <div className="space-y-6">
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
            <Button variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Build Contract
            </Button>
            <Button className="gap-2">
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
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
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

          {/* Right Column - Budget Summary */}
          <div className="lg:col-span-1">
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
                      <p className="text-sm text-muted-foreground mt-1">Athlete obligations across this sponsor&apos;s active contracts</p>
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
                </CardContent>
              </Card>

              {/* Athlete Recommendations Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Athlete Recommendations</CardTitle>
                  <p className="text-sm text-muted-foreground">Athletes that may be a good fit</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sponsor.recommendedAthletes.map((athlete: any) => (
                    <div key={athlete.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium">{athlete.name}</p>
                        <p className="text-sm text-muted-foreground">{athlete.sport}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono">{formatNumber(athlete.reach)} reach</p>
                        <p className="text-xs text-muted-foreground">{athlete.engagement}% engagement</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="link" className="p-0 h-auto gap-1" onClick={() => setActiveTab("Athletes")}>
                    View All Athletes
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ===== CONTRACTS TAB ===== */}
        {activeTab === "Contracts" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Contracts</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">NIL agreements funded by {sponsor.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={contractStatusFilter} onValueChange={setContractStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contract ID</TableHead>
                    <TableHead>Athlete</TableHead>
                    <TableHead>Sport</TableHead>
                    <TableHead>Season</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Obligations</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Days Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.map((contract: any) => (
                    <TableRow key={contract.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">{contract.id}</TableCell>
                      <TableCell>{contract.athleteName}</TableCell>
                      <TableCell>{contract.sport}</TableCell>
                      <TableCell>{contract.season}</TableCell>
                      <TableCell className="font-mono">${contract.contractValue.toLocaleString()}</TableCell>
                      <TableCell>{contract.obligations}</TableCell>
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
            </CardContent>
          </Card>
        )}

        {/* ===== ATHLETES TAB ===== */}
        {activeTab === "Athletes" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Contracted Athletes</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Athletes with active contracts from {sponsor.name}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Athlete</TableHead>
                      <TableHead>Sport</TableHead>
                      <TableHead>Contract Value</TableHead>
                      <TableHead>Obligations</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sponsor.contracts.map((contract: any) => (
                      <TableRow key={contract.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">{contract.athleteName}</TableCell>
                        <TableCell>{contract.sport}</TableCell>
                        <TableCell className="font-mono">${contract.contractValue.toLocaleString()}</TableCell>
                        <TableCell>{contract.obligationProgress}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusBadgeClassName(contract.status)}>
                            {contract.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recommended Athletes</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Athletes that may be a good fit for {sponsor.name}</p>
                  </div>
                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input placeholder="Search athletes..." className="pl-10" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Athlete</TableHead>
                      <TableHead>Sport</TableHead>
                      <TableHead>Reach</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sponsor.recommendedAthletes.map((athlete: any) => (
                      <TableRow key={athlete.id}>
                        <TableCell className="font-medium">{athlete.name}</TableCell>
                        <TableCell>{athlete.sport}</TableCell>
                        <TableCell className="font-mono">{formatNumber(athlete.reach)}</TableCell>
                        <TableCell>{athlete.engagement}%</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">Create Contract</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ===== DELIVERABLES TAB ===== */}
        {activeTab === "Deliverables" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Upcoming Deliverables</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Pending obligations across all contracts</p>
                  </div>
                  <Select value={deliverableStatusFilter} onValueChange={setDeliverableStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Athlete</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Contract</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUpcomingDeliverables.map((deliverable: any) => (
                      <TableRow key={deliverable.id}>
                        <TableCell>{deliverable.type}</TableCell>
                        <TableCell>{deliverable.athleteName}</TableCell>
                        <TableCell>{deliverable.progress}</TableCell>
                        <TableCell className={deliverable.status === "Overdue" ? "text-red-600" : ""}>{deliverable.deadline}</TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">{deliverable.contractId}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getDeliverableStatusBadgeClassName(deliverable.status)}>
                            {deliverable.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Completed Deliverables</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Verified and fulfilled obligations</p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
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
                        <TableCell>{deliverable.verifiedBy}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getDeliverableStatusBadgeClassName(deliverable.status)}>
                            {deliverable.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ===== PAYMENTS TAB ===== */}
        {activeTab === "Payments" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payments</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Payment schedule and history</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant={paymentsView === "upcoming" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setPaymentsView("upcoming")}
                  >
                    Upcoming
                  </Button>
                  <Button 
                    variant={paymentsView === "historical" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setPaymentsView("historical")}
                  >
                    Historical
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Athlete</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Contract</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sponsor.upcomingPayments.map((payment: any) => (
                    <TableRow key={payment.id}>
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
            </CardContent>
          </Card>
        )}

        {/* ===== DOCUMENTS TAB ===== */}
        {activeTab === "Documents" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Documents</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Contract documents and related files</p>
                </div>
                <Button variant="outline" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Related Contract</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sponsor.contractDocuments.map((doc: any) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.type}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">{doc.relatedContract}</TableCell>
                      <TableCell>{doc.date}</TableCell>
                      <TableCell className="text-muted-foreground">{doc.size}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  )
}
