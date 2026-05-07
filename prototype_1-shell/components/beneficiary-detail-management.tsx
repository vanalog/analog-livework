"use client"

import { useState, useEffect, useRef } from "react"
import {
  ArrowLeft,
  FileText,
  Plus,
  Building,
  Download,
  AlertTriangle,
  Bell,
  Pencil,
  MoreVertical,
  Users,
  User,
  CheckCircle2,
  Clock,
  Send,
  Wallet,
  Hourglass,
  Landmark,
  CreditCard,
  ExternalLink,
  Search,
  Filter,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ContractWorkflowProvider, useContractWorkflow } from "@/lib/contract-workflow-context"
import { ContractWorkflowUploadModal } from "./contracts2/contract-workflow-upload-modal"
import { ProcessingStage } from "./contracts2/processing-stage"
import { ReviewStage } from "./contracts2/review-stage"
import { ActivationStage } from "./contracts2/activation-stage"

import { BuildContractProvider, useBuildContract } from "@/lib/build-contract-context"
import { BuildDefineStage } from "./contracts2/build-define-stage"
import { BuildGenerateStage } from "./contracts2/build-generate-stage"
import { BuildReviewStage } from "./contracts2/build-review-stage"
import { BuildExportStage } from "./contracts2/build-export-stage"

interface BeneficiaryDetailManagementProps {
  beneficiaryId: string
}

const mockDeliverables = {
  "1": [
    {
      id: "d1",
      title: "Youth Camp - Nike Basketball",
      dueDate: "2024-02-15",
      status: "overdue" as const,
      daysOverdue: 5,
      contractId: "c1",
      contractName: "NIL-2024-MJN-001",
      description: "Host youth basketball camp",
    },
    {
      id: "d2",
      title: "Social Media Posts - TechStart",
      dueDate: "2024-03-01",
      status: "due-soon" as const,
      daysUntilDue: 3,
      contractId: "c2",
      contractName: "Campus Bookstore",
      description: "2 of 5 posts completed",
      progress: { completed: 2, total: 5 },
    },
    {
      id: "d3",
      title: "Public Appearance - Elite Fitness",
      dueDate: "2024-03-15",
      status: "upcoming" as const,
      daysUntilDue: 17,
      contractId: "c3",
      contractName: "Regional Restaurant Chain",
      description: "Pregame meet & greet",
    },
  ],
  "2": [],
}

const mockCompensationBreakdown = {
  "1": {
    nilContracts: [
      { sponsor: "Nike", value: 45000 },
      { sponsor: "TechStart", value: 22000 },
      { sponsor: "Elite Fitness", value: 35500 },
      { sponsor: "Other (2)", value: 22500 },
    ],
    benefitsPool: [
      { name: "Base Revenue Share", value: 60000 },
      { name: "Performance Bonus", value: 15000 },
    ],
  },
  "2": {
    nilContracts: [
      { sponsor: "Campus Store", value: 25000 },
      { sponsor: "Local Business", value: 15000 },
    ],
    benefitsPool: [
      { name: "Base Revenue Share", value: 40000 },
      { name: "Performance Bonus", value: 10000 },
    ],
  },
}

const mockBeneficiaryData = {
  "1": {
    id: "1",
    firstName: "Marcus",
    lastName: "Johnson",
    email: "marcus.johnson@uod.edu",
    phone: "(555) 123-4567",
    dateOfBirth: "2003-04-22",
    ssn: "***-**-4567",
    address: {
      line1: "123 Campus Drive",
      city: "University City",
      state: "ST",
      zip: "12345",
    },
    university: "University of Example",
    universityId: "UOD-FB-2024-001",
    payoutAccountStatus: "active" as const,
    sport: "Basketball",
    position: "Point Guard ",
    year: "Junior",
    status: "Eligible" as const,
    statusUpdated: "1/15/2024",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Marcus Anthony Johnson",
    kycDateOfBirth: "**/**/2003",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/10/2024", detail: "Verified for Spring 2024" },
      gpaAboveThreshold: { status: true, verified: "1/7/2024", detail: "3.2 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2024", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "12/14/2023", detail: "Signed NIL policy v2.1" },
    },
    disbursementAllocation: {
      taxReserve: 15,
      privateClientAccount: 70,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 12500,
      privateClientAccount: 8750,
    },
    balancesUpdated: "12/30/2023",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 12500,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 8750,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 1/10/2024",
        lastDistribution: "1/15/2024",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Local Auto Dealership",
        type: "Endorsement",
        value: 45000,
        status: "active",
      },
      {
        id: "c2",
        sponsor: "Campus Bookstore",
        type: "Social Media",
        value: 25000,
        status: "active",
      },
      {
        id: "c3",
        sponsor: "Regional Restaurant Chain",
        type: "Appearance",
        value: 15000,
        status: "pending",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/14/2024",
        type: "Contract Payment",
        typeDetail: "Monthly payment - ...",
        gross: 3750,
        taxHeld: 563,
        netPaid: 3187,
        status: "completed",
      },
      {
        id: "2",
        date: "1/9/2024",
        type: "Bonus Payment",
        typeDetail: "Performance bonus ...",
        gross: 2500,
        taxHeld: 375,
        netPaid: 2125,
        status: "completed",
      },
      {
        id: "3",
        date: "1/7/2024",
        type: "Contract Payment",
        typeDetail: "Monthly payment - ...",
        gross: 2083,
        taxHeld: 312,
        netPaid: 1771,
        status: "completed",
      },
      {
        id: "4",
        date: "1/4/2024",
        type: "Trust Allocation",
        typeDetail: "Automatic trust fund...",
        gross: 1250,
        taxHeld: 0,
        netPaid: 1250,
        status: "completed",
      },
      {
        id: "5",
        date: "12/31/2023",
        type: "Contract Payment",
        typeDetail: "Monthly payment - ...",
        gross: 3750,
        taxHeld: 563,
        netPaid: 3187,
        status: "pending",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/15/2024",
        icon: "check",
      },
      {
        id: "2",
        title: "KYC Approved",
        detail: "Manual review completed - all documents verified by Sarah Williams",
        date: "1/10/2024",
        icon: "check",
      },
      {
        id: "3",
        title: "Contract Added",
        detail: "New contract c3 added - Regional Restaurant Chain by Mike Chen",
        date: "1/8/2024",
        icon: "file",
      },
    ],
  },
  "2": {
    id: "2",
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah.williams@duke.edu",
    phone: "(555) 987-6543",
    dateOfBirth: "2004-03-22",
    address: {
      line1: "456 Duke Street",
      city: "Durham",
      state: "NC",
      zip: "27708",
    },
    university: "Duke University",
    payoutAccountStatus: "needs_onboarding" as const,
    status: "in-progress" as const,
    totalContractValue: 85000,
    contractCount: 2,
    totalReceivedYTD: 15000,
    kycStatus: "in-progress" as const,
    complianceFlags: 1,
    escalated: false,
    revenueShare: 60000,
    nilSecured: 25000,
    gapToFill: 35000,
    departmentSavings: 25000,
    activeContracts: 1,
    pendingContracts: 1,
    deliverablesOnTrack: 75,
    nextPaymentDate: "2024-03-20",
    nextPaymentAmount: 7500,
  },
  "osu-001": {
    id: "osu-001",
    firstName: "Darius",
    lastName: "Thornton",
    email: "thornton.101@esu.edu",
    phone: "(614) 555-0101",
    dateOfBirth: "2005-08-15",
    ssn: "***-**-1234",
    address: {
      line1: "1234 High Street",
      city: "Columbus",
      state: "OH",
      zip: "43201",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-001",
    payoutAccountStatus: "active" as const,
    sport: "Football",
    position: "Wide Receiver",
    year: "Sophomore",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Darius James Thornton",
    kycDateOfBirth: "**/**/2005",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.5 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 20,
      privateClientAccount: 65,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 35000,
      privateClientAccount: 42500,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 35000,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 42500,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/20/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "The Ohio State University",
        type: "Revenue Share",
        value: 175000,
        status: "active",
      },
      {
        id: "c2",
        sponsor: "Nike",
        type: "NIL Sponsorship",
        value: 85000,
        status: "active",
      },
      {
        id: "c3",
        sponsor: "Gatorade",
        type: "NIL Sponsorship",
        value: 45000,
        status: "active",
      },
    ],
    nilIndicatedValue: 200000, // Total indicated from IOIs
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Nike",
        gross: 14583,
        taxHeld: 2916,
        netPaid: 11667,
        status: "completed",
      },
      {
        id: "2",
        date: "12/5/2025",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Nike",
        gross: 14583,
        taxHeld: 2916,
        netPaid: 11667,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
      {
        id: "2",
        title: "Contract Active",
        detail: "Nike endorsement deal activated",
        date: "8/20/2025",
        icon: "file",
      },
    ],
  },
  "osu-002": {
    id: "osu-002",
    firstName: "Malik",
    lastName: "Crawford",
    email: "crawford.202@esu.edu",
    phone: "(614) 555-0102",
    dateOfBirth: "2002-12-10",
    ssn: "***-**-5678",
    address: {
      line1: "5678 Lane Avenue",
      city: "Columbus",
      state: "OH",
      zip: "43210",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-002",
    sport: "Football",
    position: "Quarterback",
    year: "Senior",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Malik James Crawford",
    kycDateOfBirth: "**/**/2002",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.3 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 22,
      privateClientAccount: 68,
      paypal: 10,
    },
    currentBalances: {
      taxReserve: 28600,
      privateClientAccount: 35200,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 28600,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 35200,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/18/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "The Ohio State University",
        type: "Revenue Share",
        value: 130000,
        status: "active",
      },
      {
        id: "c2",
        sponsor: "Under Armour",
        type: "NIL Sponsorship",
        value: 65000,
        status: "active",
      },
    ],
    nilIndicatedValue: 100000,
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Revenue Share",
        gross: 10833,
        taxHeld: 2383,
        netPaid: 8450,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-003": {
    id: "osu-003",
    firstName: "Jaylen",
    lastName: "Porter",
    email: "porter.303@esu.edu",
    phone: "(614) 555-0103",
    dateOfBirth: "2003-05-22",
    ssn: "***-**-9012",
    address: {
      line1: "9012 Olentangy River Road",
      city: "Columbus",
      state: "OH",
      zip: "43202",
    },
    university: "Example State University",
    universityId: "ESU-BB-2024-003",
    sport: "Basketball",
    position: "Power Forward",
    year: "Junior",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Jaylen Marcus Porter",
    kycDateOfBirth: "**/**/2003",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.1 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 18,
      privateClientAccount: 70,
      paypal: 12,
    },
    currentBalances: {
      taxReserve: 21600,
      privateClientAccount: 32400,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 21600,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 32400,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/22/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "The Ohio State University",
        type: "Revenue Share",
        value: 90000,
        status: "active",
      },
      {
        id: "c2",
        sponsor: "Adidas",
        type: "NIL Sponsorship",
        value: 30000,
        status: "active",
      },
    ],
    nilIndicatedValue: 50000,
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Revenue Share",
        gross: 10000,
        taxHeld: 1800,
        netPaid: 8200,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-004": {
    id: "osu-004",
    firstName: "Terrance",
    lastName: "Mitchell",
    email: "mitchell.404@esu.edu",
    phone: "(614) 555-0104",
    dateOfBirth: "2003-03-15",
    ssn: "***-**-3456",
    address: {
      line1: "3456 Kenny Road",
      city: "Columbus",
      state: "OH",
      zip: "43221",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-004",
    sport: "Football",
    position: "Wide Receiver",
    year: "Junior",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Terrance David Mitchell",
    kycDateOfBirth: "**/**/2003",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.4 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 20,
      privateClientAccount: 65,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 20000,
      privateClientAccount: 28000,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 20000,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 28000,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/21/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "CAA Sports",
        type: "Representation",
        value: 100000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - CAA Sports",
        gross: 8333,
        taxHeld: 1667,
        netPaid: 6666,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-005": {
    id: "osu-005",
    firstName: "Brandon",
    lastName: "Hayes",
    email: "hayes.505@esu.edu",
    phone: "(614) 555-0105",
    dateOfBirth: "2003-09-05",
    ssn: "***-**-6789",
    address: {
      line1: "6789 Bethel Road",
      city: "Columbus",
      state: "OH",
      zip: "43235",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-005",
    sport: "Football",
    position: "Defensive End",
    year: "Junior",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Brandon Michael Hayes",
    kycDateOfBirth: "**/**/2003",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.2 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 19,
      privateClientAccount: 66,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 17100,
      privateClientAccount: 24900,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 17100,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 24900,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/19/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Under Armour",
        type: "Apparel Deal",
        value: 90000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Under Armour",
        gross: 7500,
        taxHeld: 1425,
        netPaid: 6075,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-006": {
    id: "osu-006",
    firstName: "TreVeyon",
    lastName: "Henderson",
    email: "henderson.901@esu.edu",
    phone: "(614) 555-0106",
    dateOfBirth: "2003-02-28",
    ssn: "***-**-9012",
    address: {
      line1: "9012 Sawmill Road",
      city: "Columbus",
      state: "OH",
      zip: "43235",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-006",
    sport: "Football",
    position: "Running Back",
    year: "Junior",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "TreVeyon Maurice Henderson",
    kycDateOfBirth: "**/**/2003",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.0 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 18,
      privateClientAccount: 67,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 14400,
      privateClientAccount: 21600,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 14400,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 21600,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/23/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Roc Nation Sports",
        type: "Management",
        value: 80000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Roc Nation Sports",
        gross: 6667,
        taxHeld: 1200,
        netPaid: 5467,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-007": {
    id: "osu-007",
    firstName: "Cody",
    lastName: "Simon",
    email: "simon.234@esu.edu",
    phone: "(614) 555-0107",
    dateOfBirth: "2002-07-18",
    ssn: "***-**-2345",
    address: {
      line1: "2345 Dublin Road",
      city: "Columbus",
      state: "OH",
      zip: "43221",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-007",
    sport: "Football",
    position: "Linebacker",
    year: "Senior",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Cody Allen Simon",
    kycDateOfBirth: "**/**/2002",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.3 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 20,
      privateClientAccount: 65,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 13000,
      privateClientAccount: 19500,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 13000,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 19500,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/17/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "WME Sports",
        type: "Representation",
        value: 65000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - WME Sports",
        gross: 5417,
        taxHeld: 1083,
        netPaid: 4334,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-008": {
    id: "osu-008",
    firstName: "Denzel",
    lastName: "Burke",
    email: "burke.567@esu.edu",
    phone: "(614) 555-0108",
    dateOfBirth: "2003-11-08",
    ssn: "***-**-5678",
    address: {
      line1: "5678 Riverside Drive",
      city: "Columbus",
      state: "OH",
      zip: "43202",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-008",
    sport: "Football",
    position: "Cornerback",
    year: "Junior",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Denzel Anthony Burke",
    kycDateOfBirth: "**/**/2003",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.1 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 19,
      privateClientAccount: 66,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 11400,
      privateClientAccount: 17100,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 11400,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 17100,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/24/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Priority Sports",
        type: "Management",
        value: 60000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Priority Sports",
        gross: 5000,
        taxHeld: 950,
        netPaid: 4050,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-009": {
    id: "osu-009",
    firstName: "Donovan",
    lastName: "Jackson",
    email: "jackson.890@esu.edu",
    phone: "(614) 555-0109",
    dateOfBirth: "2003-06-14",
    ssn: "***-**-8901",
    address: {
      line1: "8901 Henderson Road",
      city: "Columbus",
      state: "OH",
      zip: "43220",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-009",
    sport: "Football",
    position: "Offensive Guard",
    year: "Junior",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Donovan Keith Jackson",
    kycDateOfBirth: "**/**/2003",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.2 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 18,
      privateClientAccount: 67,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 9000,
      privateClientAccount: 13500,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 9000,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY ����� FDIC Insured",
        balance: 13500,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/25/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Athletes First",
        type: "Representation",
        value: 50000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Athletes First",
        gross: 4167,
        taxHeld: 750,
        netPaid: 3417,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-010": {
    id: "osu-010",
    firstName: "Caleb",
    lastName: "Downs",
    email: "downs.123@esu.edu",
    phone: "(614) 555-0110",
    dateOfBirth: "2005-04-12",
    ssn: "***-**-1234",
    address: {
      line1: "1234 Worthington Road",
      city: "Columbus",
      state: "OH",
      zip: "43235",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-010",
    sport: "Football",
    position: "Safety",
    year: "Sophomore",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Caleb James Downs",
    kycDateOfBirth: "**/**/2005",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.6 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 20,
      privateClientAccount: 65,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 16000,
      privateClientAccount: 24000,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 16000,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 24000,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/26/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Excel Sports Management",
        type: "Marketing",
        value: 80000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Excel Sports Management",
        gross: 6667,
        taxHeld: 1333,
        netPaid: 5334,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-011": {
    id: "osu-011",
    firstName: "JT",
    lastName: "Tuimoloau",
    email: "tuimoloau.456@esu.edu",
    phone: "(614) 555-0111",
    dateOfBirth: "2003-04-29",
    ssn: "***-**-4567",
    address: {
      line1: "4567 Powell Road",
      city: "Columbus",
      state: "OH",
      zip: "43065",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-011",
    sport: "Football",
    position: "Defensive End",
    year: "Junior",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Jerome Taoamoalii Tuimoloau",
    kycDateOfBirth: "**/**/2003",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.0 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 19,
      privateClientAccount: 66,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 13300,
      privateClientAccount: 19950,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 13300,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 19950,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/27/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Paradigm Sports",
        type: "Management",
        value: 70000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Paradigm Sports",
        gross: 5833,
        taxHeld: 1108,
        netPaid: 4725,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-012": {
    id: "osu-012",
    firstName: "Josh",
    lastName: "Simmons",
    email: "simmons.789@esu.edu",
    phone: "(614) 555-0112",
    dateOfBirth: "2003-10-23",
    ssn: "***-**-7890",
    address: {
      line1: "7890 Hayden Run Road",
      city: "Columbus",
      state: "OH",
      zip: "43235",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-012",
    sport: "Football",
    position: "Offensive Tackle",
    year: "Junior",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Joshua Robert Simmons",
    kycDateOfBirth: "**/**/2003",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.1 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 18,
      privateClientAccount: 67,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 10800,
      privateClientAccount: 16200,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 10800,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 16200,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/28/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Octagon",
        type: "Representation",
        value: 60000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Octagon",
        gross: 5000,
        taxHeld: 900,
        netPaid: 4100,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-013": {
    id: "osu-013",
    firstName: "Sonny",
    lastName: "Styles",
    email: "styles.012@esu.edu",
    phone: "(614) 555-0113",
    dateOfBirth: "2004-01-07",
    ssn: "***-**-0123",
    address: {
      line1: "0123 Reed Road",
      city: "Columbus",
      state: "OH",
      zip: "43220",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-013",
    sport: "Football",
    position: "Safety",
    year: "Sophomore",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Sonny Michael Styles",
    kycDateOfBirth: "**/**/2004",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.4 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 20,
      privateClientAccount: 65,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 12000,
      privateClientAccount: 18000,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 12000,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 18000,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/29/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Klutch Sports",
        type: "Management",
        value: 60000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Klutch Sports",
        gross: 5000,
        taxHeld: 1000,
        netPaid: 4000,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-014": {
    id: "osu-014",
    firstName: "Carnell",
    lastName: "Tate",
    email: "tate.345@esu.edu",
    phone: "(614) 555-0114",
    dateOfBirth: "2005-02-19",
    ssn: "***-**-3456",
    address: {
      line1: "3456 Trabue Road",
      city: "Columbus",
      state: "OH",
      zip: "43228",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-014",
    sport: "Football",
    position: "Wide Receiver",
    year: "Sophomore",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Carnell Dontae Tate",
    kycDateOfBirth: "**/**/2005",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.3 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 19,
      privateClientAccount: 66,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 9500,
      privateClientAccount: 14250,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 9500,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 14250,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/30/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Creative Artists Agency",
        type: "Representation",
        value: 50000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Creative Artists Agency",
        gross: 4167,
        taxHeld: 792,
        netPaid: 3375,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-011": {
    id: "osu-011",
    firstName: "JT",
    lastName: "Tuimoloau",
    email: "tuimoloau.456@esu.edu",
    phone: "(614) 555-0111",
    dateOfBirth: "2003-04-29",
    ssn: "***-**-4567",
    address: {
      line1: "4567 Powell Road",
      city: "Columbus",
      state: "OH",
      zip: "43065",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-011",
    sport: "Football",
    position: "Defensive End",
    year: "Junior",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Jerome Taoamoalii Tuimoloau",
    kycDateOfBirth: "**/**/2003",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.0 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 19,
      privateClientAccount: 66,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 13300,
      privateClientAccount: 19950,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 13300,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 19950,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/27/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Paradigm Sports",
        type: "Management",
        value: 70000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Paradigm Sports",
        gross: 5833,
        taxHeld: 1108,
        netPaid: 4725,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-012": {
    id: "osu-012",
    firstName: "Josh",
    lastName: "Simmons",
    email: "simmons.789@esu.edu",
    phone: "(614) 555-0112",
    dateOfBirth: "2003-10-23",
    ssn: "***-**-7890",
    address: {
      line1: "7890 Hayden Run Road",
      city: "Columbus",
      state: "OH",
      zip: "43235",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-012",
    sport: "Football",
    position: "Offensive Tackle",
    year: "Junior",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Joshua Robert Simmons",
    kycDateOfBirth: "**/**/2003",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.1 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 18,
      privateClientAccount: 67,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 10800,
      privateClientAccount: 16200,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 10800,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 16200,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/28/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Octagon",
        type: "Representation",
        value: 60000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Octagon",
        gross: 5000,
        taxHeld: 900,
        netPaid: 4100,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-013": {
    id: "osu-013",
    firstName: "Sonny",
    lastName: "Styles",
    email: "styles.012@esu.edu",
    phone: "(614) 555-0113",
    dateOfBirth: "2004-01-07",
    ssn: "***-**-0123",
    address: {
      line1: "0123 Reed Road",
      city: "Columbus",
      state: "OH",
      zip: "43220",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-013",
    sport: "Football",
    position: "Safety",
    year: "Sophomore",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Sonny Michael Styles",
    kycDateOfBirth: "**/**/2004",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.4 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 20,
      privateClientAccount: 65,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 12000,
      privateClientAccount: 18000,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 12000,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 18000,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/29/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Klutch Sports",
        type: "Management",
        value: 60000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Klutch Sports",
        gross: 5000,
        taxHeld: 1000,
        netPaid: 4000,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-014": {
    id: "osu-014",
    firstName: "Carnell",
    lastName: "Tate",
    email: "tate.345@esu.edu",
    phone: "(614) 555-0114",
    dateOfBirth: "2005-02-19",
    ssn: "***-**-3456",
    address: {
      line1: "3456 Trabue Road",
      city: "Columbus",
      state: "OH",
      zip: "43228",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-014",
    sport: "Football",
    position: "Wide Receiver",
    year: "Sophomore",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Carnell Dontae Tate",
    kycDateOfBirth: "**/**/2005",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.3 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 19,
      privateClientAccount: 66,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 9500,
      privateClientAccount: 14250,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 9500,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 14250,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/30/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Creative Artists Agency",
        type: "Representation",
        value: 50000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Creative Artists Agency",
        gross: 4167,
        taxHeld: 792,
        netPaid: 3375,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-011": {
    id: "osu-011",
    firstName: "JT",
    lastName: "Tuimoloau",
    email: "tuimoloau.456@esu.edu",
    phone: "(614) 555-0111",
    dateOfBirth: "2003-04-29",
    ssn: "***-**-4567",
    address: {
      line1: "4567 Powell Road",
      city: "Columbus",
      state: "OH",
      zip: "43065",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-011",
    sport: "Football",
    position: "Defensive End",
    year: "Junior",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Jerome Taoamoalii Tuimoloau",
    kycDateOfBirth: "**/**/2003",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.0 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 19,
      privateClientAccount: 66,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 13300,
      privateClientAccount: 19950,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 13300,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 19950,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/27/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Paradigm Sports",
        type: "Management",
        value: 70000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Paradigm Sports",
        gross: 5833,
        taxHeld: 1108,
        netPaid: 4725,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-012": {
    id: "osu-012",
    firstName: "Josh",
    lastName: "Simmons",
    email: "simmons.789@esu.edu",
    phone: "(614) 555-0112",
    dateOfBirth: "2003-10-23",
    ssn: "***-**-7890",
    address: {
      line1: "7890 Hayden Run Road",
      city: "Columbus",
      state: "OH",
      zip: "43235",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-012",
    sport: "Football",
    position: "Offensive Tackle",
    year: "Junior",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Joshua Robert Simmons",
    kycDateOfBirth: "**/**/2003",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.1 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 18,
      privateClientAccount: 67,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 10800,
      privateClientAccount: 16200,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 10800,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 16200,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/28/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Octagon",
        type: "Representation",
        value: 60000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Octagon",
        gross: 5000,
        taxHeld: 900,
        netPaid: 4100,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-013": {
    id: "osu-013",
    firstName: "Sonny",
    lastName: "Styles",
    email: "styles.012@esu.edu",
    phone: "(614) 555-0113",
    dateOfBirth: "2004-01-07",
    ssn: "***-**-0123",
    address: {
      line1: "0123 Reed Road",
      city: "Columbus",
      state: "OH",
      zip: "43220",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-013",
    sport: "Football",
    position: "Safety",
    year: "Sophomore",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Sonny Michael Styles",
    kycDateOfBirth: "**/**/2004",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.4 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 20,
      privateClientAccount: 65,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 12000,
      privateClientAccount: 18000,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 12000,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 18000,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/29/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Klutch Sports",
        type: "Management",
        value: 60000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Klutch Sports",
        gross: 5000,
        taxHeld: 1000,
        netPaid: 4000,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-014": {
    id: "osu-014",
    firstName: "Carnell",
    lastName: "Tate",
    email: "tate.345@esu.edu",
    phone: "(614) 555-0114",
    dateOfBirth: "2005-02-19",
    ssn: "***-**-3456",
    address: {
      line1: "3456 Trabue Road",
      city: "Columbus",
      state: "OH",
      zip: "43228",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-014",
    sport: "Football",
    position: "Wide Receiver",
    year: "Sophomore",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Carnell Dontae Tate",
    kycDateOfBirth: "**/**/2005",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.3 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 19,
      privateClientAccount: 66,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 9500,
      privateClientAccount: 14250,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 9500,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 14250,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/30/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Creative Artists Agency",
        type: "Representation",
        value: 50000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Creative Artists Agency",
        gross: 4167,
        taxHeld: 792,
        netPaid: 3375,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-011": {
    id: "osu-011",
    firstName: "JT",
    lastName: "Tuimoloau",
    email: "tuimoloau.456@esu.edu",
    phone: "(614) 555-0111",
    dateOfBirth: "2003-04-29",
    ssn: "***-**-4567",
    address: {
      line1: "4567 Powell Road",
      city: "Columbus",
      state: "OH",
      zip: "43065",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-011",
    sport: "Football",
    position: "Defensive End",
    year: "Junior",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Jerome Taoamoalii Tuimoloau",
    kycDateOfBirth: "**/**/2003",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.0 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 19,
      privateClientAccount: 66,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 13300,
      privateClientAccount: 19950,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 13300,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 19950,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/27/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Paradigm Sports",
        type: "Management",
        value: 70000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Paradigm Sports",
        gross: 5833,
        taxHeld: 1108,
        netPaid: 4725,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-012": {
    id: "osu-012",
    firstName: "Josh",
    lastName: "Simmons",
    email: "simmons.789@esu.edu",
    phone: "(614) 555-0112",
    dateOfBirth: "2003-10-23",
    ssn: "***-**-7890",
    address: {
      line1: "7890 Hayden Run Road",
      city: "Columbus",
      state: "OH",
      zip: "43235",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-012",
    sport: "Football",
    position: "Offensive Tackle",
    year: "Junior",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Joshua Robert Simmons",
    kycDateOfBirth: "**/**/2003",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.1 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 18,
      privateClientAccount: 67,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 10800,
      privateClientAccount: 16200,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 10800,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 16200,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/28/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Octagon",
        type: "Representation",
        value: 60000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Octagon",
        gross: 5000,
        taxHeld: 900,
        netPaid: 4100,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-013": {
    id: "osu-013",
    firstName: "Sonny",
    lastName: "Styles",
    email: "styles.012@esu.edu",
    phone: "(614) 555-0113",
    dateOfBirth: "2004-01-07",
    ssn: "***-**-0123",
    address: {
      line1: "0123 Reed Road",
      city: "Columbus",
      state: "OH",
      zip: "43220",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-013",
    sport: "Football",
    position: "Safety",
    year: "Sophomore",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Sonny Michael Styles",
    kycDateOfBirth: "**/**/2004",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.4 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 20,
      privateClientAccount: 65,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 12000,
      privateClientAccount: 18000,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 12000,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 18000,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/29/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Klutch Sports",
        type: "Management",
        value: 60000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Klutch Sports",
        gross: 5000,
        taxHeld: 1000,
        netPaid: 4000,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-014": {
    id: "osu-014",
    firstName: "Carnell",
    lastName: "Tate",
    email: "tate.345@esu.edu",
    phone: "(614) 555-0114",
    dateOfBirth: "2005-02-19",
    ssn: "***-**-3456",
    address: {
      line1: "3456 Trabue Road",
      city: "Columbus",
      state: "OH",
      zip: "43228",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-014",
    sport: "Football",
    position: "Wide Receiver",
    year: "Sophomore",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Carnell Dontae Tate",
    kycDateOfBirth: "**/**/2005",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.3 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 19,
      privateClientAccount: 66,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 9500,
      privateClientAccount: 14250,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 9500,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 14250,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/30/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Creative Artists Agency",
        type: "Representation",
        value: 50000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Creative Artists Agency",
        gross: 4167,
        taxHeld: 792,
        netPaid: 3375,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-011": {
    id: "osu-011",
    firstName: "JT",
    lastName: "Tuimoloau",
    email: "tuimoloau.456@esu.edu",
    phone: "(614) 555-0111",
    dateOfBirth: "2003-04-29",
    ssn: "***-**-4567",
    address: {
      line1: "4567 Powell Road",
      city: "Columbus",
      state: "OH",
      zip: "43065",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-011",
    sport: "Football",
    position: "Defensive End",
    year: "Junior",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Jerome Taoamoalii Tuimoloau",
    kycDateOfBirth: "**/**/2003",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.0 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 19,
      privateClientAccount: 66,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 13300,
      privateClientAccount: 19950,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 13300,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 19950,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/27/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Paradigm Sports",
        type: "Management",
        value: 70000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Paradigm Sports",
        gross: 5833,
        taxHeld: 1108,
        netPaid: 4725,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-012": {
    id: "osu-012",
    firstName: "Josh",
    lastName: "Simmons",
    email: "simmons.789@esu.edu",
    phone: "(614) 555-0112",
    dateOfBirth: "2003-10-23",
    ssn: "***-**-7890",
    address: {
      line1: "7890 Hayden Run Road",
      city: "Columbus",
      state: "OH",
      zip: "43235",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-012",
    sport: "Football",
    position: "Offensive Tackle",
    year: "Junior",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Joshua Robert Simmons",
    kycDateOfBirth: "**/**/2003",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.1 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 18,
      privateClientAccount: 67,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 10800,
      privateClientAccount: 16200,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 10800,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 16200,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/28/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Octagon",
        type: "Representation",
        value: 60000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Octagon",
        gross: 5000,
        taxHeld: 900,
        netPaid: 4100,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-013": {
    id: "osu-013",
    firstName: "Sonny",
    lastName: "Styles",
    email: "styles.012@esu.edu",
    phone: "(614) 555-0113",
    dateOfBirth: "2004-01-07",
    ssn: "***-**-0123",
    address: {
      line1: "0123 Reed Road",
      city: "Columbus",
      state: "OH",
      zip: "43220",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-013",
    sport: "Football",
    position: "Safety",
    year: "Sophomore",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Sonny Michael Styles",
    kycDateOfBirth: "**/**/2004",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.4 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 20,
      privateClientAccount: 65,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 12000,
      privateClientAccount: 18000,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 12000,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 18000,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/29/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Klutch Sports",
        type: "Management",
        value: 60000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Klutch Sports",
        gross: 5000,
        taxHeld: 1000,
        netPaid: 4000,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-014": {
    id: "osu-014",
    firstName: "Carnell",
    lastName: "Tate",
    email: "tate.345@esu.edu",
    phone: "(614) 555-0114",
    dateOfBirth: "2005-02-19",
    ssn: "***-**-3456",
    address: {
      line1: "3456 Trabue Road",
      city: "Columbus",
      state: "OH",
      zip: "43228",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-014",
    sport: "Football",
    position: "Wide Receiver",
    year: "Sophomore",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Carnell Dontae Tate",
    kycDateOfBirth: "**/**/2005",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.3 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 19,
      privateClientAccount: 66,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 9500,
      privateClientAccount: 14250,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 9500,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 14250,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/30/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Creative Artists Agency",
        type: "Representation",
        value: 50000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Creative Artists Agency",
        gross: 4167,
        taxHeld: 792,
        netPaid: 3375,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-011": {
    id: "osu-011",
    firstName: "JT",
    lastName: "Tuimoloau",
    email: "tuimoloau.456@esu.edu",
    phone: "(614) 555-0111",
    dateOfBirth: "2003-04-29",
    ssn: "***-**-4567",
    address: {
      line1: "4567 Powell Road",
      city: "Columbus",
      state: "OH",
      zip: "43065",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-011",
    sport: "Football",
    position: "Defensive End",
    year: "Junior",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Jerome Taoamoalii Tuimoloau",
    kycDateOfBirth: "**/**/2003",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.0 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 19,
      privateClientAccount: 66,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 13300,
      privateClientAccount: 19950,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 13300,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 19950,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/27/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Paradigm Sports",
        type: "Management",
        value: 70000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Paradigm Sports",
        gross: 5833,
        taxHeld: 1108,
        netPaid: 4725,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-012": {
    id: "osu-012",
    firstName: "Josh",
    lastName: "Simmons",
    email: "simmons.789@esu.edu",
    phone: "(614) 555-0112",
    dateOfBirth: "2003-10-23",
    ssn: "***-**-7890",
    address: {
      line1: "7890 Hayden Run Road",
      city: "Columbus",
      state: "OH",
      zip: "43235",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-012",
    sport: "Football",
    position: "Offensive Tackle",
    year: "Junior",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Joshua Robert Simmons",
    kycDateOfBirth: "**/**/2003",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.1 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 18,
      privateClientAccount: 67,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 10800,
      privateClientAccount: 16200,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 10800,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 16200,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/28/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Octagon",
        type: "Representation",
        value: 60000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Octagon",
        gross: 5000,
        taxHeld: 900,
        netPaid: 4100,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-013": {
    id: "osu-013",
    firstName: "Sonny",
    lastName: "Styles",
    email: "styles.012@esu.edu",
    phone: "(614) 555-0113",
    dateOfBirth: "2004-01-07",
    ssn: "***-**-0123",
    address: {
      line1: "0123 Reed Road",
      city: "Columbus",
      state: "OH",
      zip: "43220",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-013",
    sport: "Football",
    position: "Safety",
    year: "Sophomore",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Sonny Michael Styles",
    kycDateOfBirth: "**/**/2004",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.4 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 20,
      privateClientAccount: 65,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 12000,
      privateClientAccount: 18000,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 12000,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 18000,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/29/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Klutch Sports",
        type: "Management",
        value: 60000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Klutch Sports",
        gross: 5000,
        taxHeld: 1000,
        netPaid: 4000,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "osu-014": {
    id: "osu-014",
    firstName: "Carnell",
    lastName: "Tate",
    email: "tate.345@esu.edu",
    phone: "(614) 555-0114",
    dateOfBirth: "2005-02-19",
    ssn: "***-**-3456",
    address: {
      line1: "3456 Trabue Road",
      city: "Columbus",
      state: "OH",
      zip: "43228",
    },
    university: "Example State University",
    universityId: "ESU-FB-2024-014",
    sport: "Football",
    position: "Wide Receiver",
    year: "Sophomore",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Carnell Dontae Tate",
    kycDateOfBirth: "**/**/2005",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.3 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 19,
      privateClientAccount: 66,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 9500,
      privateClientAccount: 14250,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 9500,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 14250,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/30/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Creative Artists Agency",
        type: "Representation",
        value: 50000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Creative Artists Agency",
        gross: 4167,
        taxHeld: 792,
        netPaid: 3375,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "duke-001": {
    id: "duke-001",
    firstName: "Cameron",
    lastName: "Brooks",
    email: "cameron.brooks@duke.edu",
    phone: "(919) 555-0201",
    dateOfBirth: "2004-01-18",
    ssn: "***-**-2010",
    address: {
      line1: "123 Cameron Boulevard",
      city: "Durham",
      state: "NC",
      zip: "27708",
    },
    university: "Duke University",
    universityId: "DUKE-BB-2024-001",
    sport: "Basketball",
    position: "Point Guard",
    year: "Junior",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Approved" as const,
    kycVerifiedName: "Cameron Anthony Brooks",
    kycDateOfBirth: "**/**/2004",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.4 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 20,
      privateClientAccount: 65,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 17000,
      privateClientAccount: 25500,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 17000,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 25500,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 8/20/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Nike Basketball",
        type: "Endorsement",
        value: 85000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Nike Basketball",
        gross: 7083,
        taxHeld: 1417,
        netPaid: 5666,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Verified",
        detail: "Automatic eligibility check passed by System",
        date: "1/5/2026",
        icon: "check",
      },
    ],
  },
  "duke-002": {
    id: "duke-002",
    firstName: "Isaiah",
    lastName: "Washington",
    email: "isaiah.washington@duke.edu",
    phone: "(919) 555-0202",
    dateOfBirth: "2004-06-25",
    ssn: "***-**-2020",
    address: {
      line1: "456 Blue Devil Lane",
      city: "Durham",
      state: "NC",
      zip: "27705",
    },
    university: "Duke University",
    universityId: "DUKE-BB-2024-002",
    sport: "Basketball",
    position: "Shooting Guard",
    year: "Sophomore",
    status: "Eligible" as const,
    statusUpdated: "1/5/2026",
    kycStatus: "Pending" as const,
    kycVerifiedName: "Isaiah Marcus Washington",
    kycDateOfBirth: "**/**/2004",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: true, verified: "12/20/2025", detail: "3.2 GPA maintained" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: false, verified: "", detail: "Awaiting signature" },
    },
    disbursementAllocation: {
      taxReserve: 18,
      privateClientAccount: 67,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 11700,
      privateClientAccount: 17550,
    },
    balancesUpdated: "1/5/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 11700,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 17550,
        icon: "wallet",
      },
      {
        id: "3",
        type: "PayPal Wallet",
        status: "Connected: 9/01/2025",
        lastDistribution: "1/5/2026",
        icon: "credit-card",
      },
    ],
    activeContracts: [
      {
        id: "c1",
        sponsor: "Under Armour",
        type: "Apparel",
        value: 65000,
        status: "active",
      },
    ],
    disbursementHistory: [
      {
        id: "1",
        date: "1/5/2026",
        type: "Contract Payment",
        typeDetail: "Monthly payment - Under Armour",
        gross: 5417,
        taxHeld: 975,
        netPaid: 4442,
        status: "completed",
      },
    ],
    recentActivity: [
      {
        id: "1",
        title: "KYC Pending",
        detail: "Awaiting document verification",
        date: "1/5/2026",
        icon: "alert",
      },
    ],
  },
  "texas-001": {
    id: "texas-001",
    firstName: "DeShawn",
    lastName: "Rivers",
    email: "deshawn.rivers@utexas.edu",
    phone: "(512) 555-0301",
    dateOfBirth: "2004-07-12",
    ssn: "***-**-3010",
    address: {
      line1: "321 Longhorn Way",
      city: "Austin",
      state: "TX",
      zip: "78712",
    },
    university: "University of Texas",
    universityId: "UT-FB-2024-001",
    sport: "Football",
    position: "Cornerback",
    year: "Junior",
    status: "Ineligible" as const,
    statusUpdated: "1/10/2026",
    kycStatus: "Blocked" as const,
    kycVerifiedName: "DeShawn Marcus Rivers",
    kycDateOfBirth: "**/**/2004",
    eligibility: {
      enrolledFullTime: { status: true, verified: "1/3/2026", detail: "Verified for Spring 2026" },
      gpaAboveThreshold: { status: false, verified: "1/10/2026", detail: "GPA below 2.5 threshold" },
      noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration on file" },
      policyAgreementSigned: { status: true, verified: "8/15/2025", detail: "Signed NIL policy v3.0" },
    },
    disbursementAllocation: {
      taxReserve: 20,
      privateClientAccount: 65,
      paypal: 15,
    },
    currentBalances: {
      taxReserve: 0,
      privateClientAccount: 0,
    },
    balancesUpdated: "1/10/2026",
    connectedAccounts: [
      {
        id: "1",
        type: "Tax Reserve (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 0,
        icon: "shield",
      },
      {
        id: "2",
        type: "Private Client Account (HNB)",
        accountInfo: "X-X% APY • FDIC Insured",
        balance: 0,
        icon: "wallet",
      },
    ],
    activeContracts: [],
    disbursementHistory: [],
    recentActivity: [
      {
        id: "1",
        title: "Eligibility Blocked",
        detail: "GPA fell below minimum threshold",
        date: "1/10/2026",
        icon: "alert",
      },
    ],
  },
  // Men's Basketball roster athletes for Planning
  "mb-001": {
    id: "mb-001",
    firstName: "Marcus",
    lastName: "Williams",
    email: "marcus.williams@osu.edu",
    phone: "(614) 555-0101",
    dateOfBirth: "2004-03-15",
    ssn: "***-**-0101",
    address: { line1: "100 Woody Hayes Dr", city: "Columbus", state: "OH", zip: "43210" },
    university: "The Ohio State University",
    universityId: "OSU-MBB-001",
    payoutAccountStatus: "active" as const,
    sport: "Basketball",
    position: "PG",
    year: "Junior",
    status: "Eligible" as const,
    statusUpdated: "1/15/2026",
    kycStatus: "Approved" as const,
    eligibility: { enrolledFullTime: { status: true, verified: "1/10/2026", detail: "Verified" }, gpaAboveThreshold: { status: true, verified: "1/7/2026", detail: "3.4 GPA" }, noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration" }, policyAgreementSigned: { status: true, verified: "12/14/2025", detail: "Signed" } },
    disbursementAllocation: { taxReserve: 15, privateClientAccount: 70, paypal: 15 },
    currentBalances: { taxReserve: 15000, privateClientAccount: 75000 },
    connectedAccounts: [],
    activeContracts: [],
    disbursementHistory: [],
    recentActivity: [],
  },
  "mb-002": {
    id: "mb-002",
    firstName: "DeShawn",
    lastName: "Carter",
    email: "deshawn.carter@osu.edu",
    phone: "(614) 555-0102",
    dateOfBirth: "2003-11-22",
    ssn: "***-**-0102",
    address: { line1: "100 Woody Hayes Dr", city: "Columbus", state: "OH", zip: "43210" },
    university: "The Ohio State University",
    universityId: "OSU-MBB-002",
    payoutAccountStatus: "active" as const,
    sport: "Basketball",
    position: "SG",
    year: "Senior",
    status: "Eligible" as const,
    statusUpdated: "1/15/2026",
    kycStatus: "Approved" as const,
    eligibility: { enrolledFullTime: { status: true, verified: "1/10/2026", detail: "Verified" }, gpaAboveThreshold: { status: true, verified: "1/7/2026", detail: "3.2 GPA" }, noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration" }, policyAgreementSigned: { status: true, verified: "12/14/2025", detail: "Signed" } },
    disbursementAllocation: { taxReserve: 15, privateClientAccount: 70, paypal: 15 },
    currentBalances: { taxReserve: 12000, privateClientAccount: 60000 },
    connectedAccounts: [],
    activeContracts: [],
    disbursementHistory: [],
    recentActivity: [],
  },
  "mb-003": {
    id: "mb-003",
    firstName: "Jaylen",
    lastName: "Thompson",
    email: "jaylen.thompson@osu.edu",
    phone: "(614) 555-0103",
    dateOfBirth: "2005-06-08",
    ssn: "***-**-0103",
    address: { line1: "100 Woody Hayes Dr", city: "Columbus", state: "OH", zip: "43210" },
    university: "The Ohio State University",
    universityId: "OSU-MBB-003",
    payoutAccountStatus: "active" as const,
    sport: "Basketball",
    position: "SF",
    year: "Freshman",
    status: "Eligible" as const,
    statusUpdated: "1/15/2026",
    kycStatus: "Approved" as const,
    eligibility: { enrolledFullTime: { status: true, verified: "1/10/2026", detail: "Verified" }, gpaAboveThreshold: { status: true, verified: "1/7/2026", detail: "3.6 GPA" }, noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration" }, policyAgreementSigned: { status: true, verified: "12/14/2025", detail: "Signed" } },
    disbursementAllocation: { taxReserve: 15, privateClientAccount: 70, paypal: 15 },
    currentBalances: { taxReserve: 5000, privateClientAccount: 25000 },
    connectedAccounts: [],
    activeContracts: [],
    disbursementHistory: [],
    recentActivity: [],
  },
  "mb-004": {
    id: "mb-004",
    firstName: "Tyler",
    lastName: "Robinson",
    email: "tyler.robinson@osu.edu",
    phone: "(614) 555-0104",
    dateOfBirth: "2004-09-30",
    ssn: "***-**-0104",
    address: { line1: "100 Woody Hayes Dr", city: "Columbus", state: "OH", zip: "43210" },
    university: "The Ohio State University",
    universityId: "OSU-MBB-004",
    payoutAccountStatus: "needs_onboarding" as const,
    sport: "Basketball",
    position: "PF",
    year: "Sophomore",
    status: "Eligible" as const,
    statusUpdated: "1/15/2026",
    kycStatus: "Pending" as const,
    eligibility: { enrolledFullTime: { status: true, verified: "1/10/2026", detail: "Verified" }, gpaAboveThreshold: { status: true, verified: "1/7/2026", detail: "3.1 GPA" }, noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration" }, policyAgreementSigned: { status: true, verified: "12/14/2025", detail: "Signed" } },
    disbursementAllocation: { taxReserve: 15, privateClientAccount: 70, paypal: 15 },
    currentBalances: { taxReserve: 0, privateClientAccount: 0 },
    connectedAccounts: [],
    activeContracts: [],
    disbursementHistory: [],
    recentActivity: [],
  },
  "mb-005": {
    id: "mb-005",
    firstName: "Chris",
    lastName: "Anderson",
    email: "chris.anderson@osu.edu",
    phone: "(614) 555-0105",
    dateOfBirth: "2003-02-14",
    ssn: "***-**-0105",
    address: { line1: "100 Woody Hayes Dr", city: "Columbus", state: "OH", zip: "43210" },
    university: "The Ohio State University",
    universityId: "OSU-MBB-005",
    payoutAccountStatus: "needs_onboarding" as const,
    sport: "Basketball",
    position: "C",
    year: "Senior",
    status: "Eligible" as const,
    statusUpdated: "1/15/2026",
    kycStatus: "Pending" as const,
    eligibility: { enrolledFullTime: { status: true, verified: "1/10/2026", detail: "Verified" }, gpaAboveThreshold: { status: true, verified: "1/7/2026", detail: "2.9 GPA" }, noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration" }, policyAgreementSigned: { status: true, verified: "12/14/2025", detail: "Signed" } },
    disbursementAllocation: { taxReserve: 15, privateClientAccount: 70, paypal: 15 },
    currentBalances: { taxReserve: 0, privateClientAccount: 0 },
    connectedAccounts: [],
    activeContracts: [],
    disbursementHistory: [],
    recentActivity: [],
  },
  // Women's Basketball roster athletes for Planning
  "wb-001": {
    id: "wb-001",
    firstName: "Aaliyah",
    lastName: "Davis",
    email: "aaliyah.davis@osu.edu",
    phone: "(614) 555-0201",
    dateOfBirth: "2004-05-20",
    ssn: "***-**-0201",
    address: { line1: "100 Woody Hayes Dr", city: "Columbus", state: "OH", zip: "43210" },
    university: "The Ohio State University",
    universityId: "OSU-WBB-001",
    payoutAccountStatus: "active" as const,
    sport: "Basketball",
    position: "PG",
    year: "Sophomore",
    status: "Eligible" as const,
    statusUpdated: "1/15/2026",
    kycStatus: "Approved" as const,
    eligibility: { enrolledFullTime: { status: true, verified: "1/10/2026", detail: "Verified" }, gpaAboveThreshold: { status: true, verified: "1/7/2026", detail: "3.8 GPA" }, noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration" }, policyAgreementSigned: { status: true, verified: "12/14/2025", detail: "Signed" } },
    disbursementAllocation: { taxReserve: 15, privateClientAccount: 70, paypal: 15 },
    currentBalances: { taxReserve: 18000, privateClientAccount: 90000 },
    connectedAccounts: [],
    activeContracts: [],
    disbursementHistory: [],
    recentActivity: [],
  },
  "wb-002": {
    id: "wb-002",
    firstName: "Jordan",
    lastName: "Mitchell",
    email: "jordan.mitchell@osu.edu",
    phone: "(614) 555-0202",
    dateOfBirth: "2003-08-12",
    ssn: "***-**-0202",
    address: { line1: "100 Woody Hayes Dr", city: "Columbus", state: "OH", zip: "43210" },
    university: "The Ohio State University",
    universityId: "OSU-WBB-002",
    payoutAccountStatus: "active" as const,
    sport: "Basketball",
    position: "SG",
    year: "Senior",
    status: "Eligible" as const,
    statusUpdated: "1/15/2026",
    kycStatus: "Approved" as const,
    eligibility: { enrolledFullTime: { status: true, verified: "1/10/2026", detail: "Verified" }, gpaAboveThreshold: { status: true, verified: "1/7/2026", detail: "3.5 GPA" }, noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration" }, policyAgreementSigned: { status: true, verified: "12/14/2025", detail: "Signed" } },
    disbursementAllocation: { taxReserve: 15, privateClientAccount: 70, paypal: 15 },
    currentBalances: { taxReserve: 10000, privateClientAccount: 50000 },
    connectedAccounts: [],
    activeContracts: [],
    disbursementHistory: [],
    recentActivity: [],
  },
  "wb-003": {
    id: "wb-003",
    firstName: "Maya",
    lastName: "Thompson",
    email: "maya.thompson@osu.edu",
    phone: "(614) 555-0203",
    dateOfBirth: "2005-01-25",
    ssn: "***-**-0203",
    address: { line1: "100 Woody Hayes Dr", city: "Columbus", state: "OH", zip: "43210" },
    university: "The Ohio State University",
    universityId: "OSU-WBB-003",
    payoutAccountStatus: "needs_onboarding" as const,
    sport: "Basketball",
    position: "SF",
    year: "Freshman",
    status: "Eligible" as const,
    statusUpdated: "1/15/2026",
    kycStatus: "Pending" as const,
    eligibility: { enrolledFullTime: { status: true, verified: "1/10/2026", detail: "Verified" }, gpaAboveThreshold: { status: true, verified: "1/7/2026", detail: "3.7 GPA" }, noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration" }, policyAgreementSigned: { status: true, verified: "12/14/2025", detail: "Signed" } },
    disbursementAllocation: { taxReserve: 15, privateClientAccount: 70, paypal: 15 },
    currentBalances: { taxReserve: 0, privateClientAccount: 0 },
    connectedAccounts: [],
    activeContracts: [],
    disbursementHistory: [],
    recentActivity: [],
  },
  "wb-004": {
    id: "wb-004",
    firstName: "Taylor",
    lastName: "Williams",
    email: "taylor.williams@osu.edu",
    phone: "(614) 555-0204",
    dateOfBirth: "2004-11-05",
    ssn: "***-**-0204",
    address: { line1: "100 Woody Hayes Dr", city: "Columbus", state: "OH", zip: "43210" },
    university: "The Ohio State University",
    universityId: "OSU-WBB-004",
    payoutAccountStatus: "active" as const,
    sport: "Basketball",
    position: "PF",
    year: "Sophomore",
    status: "Eligible" as const,
    statusUpdated: "1/15/2026",
    kycStatus: "Approved" as const,
    eligibility: { enrolledFullTime: { status: true, verified: "1/10/2026", detail: "Verified" }, gpaAboveThreshold: { status: true, verified: "1/7/2026", detail: "3.3 GPA" }, noTransferPortal: { status: true, verified: "1/1/2026", detail: "No declaration" }, policyAgreementSigned: { status: true, verified: "12/14/2025", detail: "Signed" } },
    disbursementAllocation: { taxReserve: 15, privateClientAccount: 70, paypal: 15 },
    currentBalances: { taxReserve: 8000, privateClientAccount: 40000 },
    connectedAccounts: [],
    activeContracts: [],
    disbursementHistory: [],
    recentActivity: [],
  },
}

const mockContracts = [
  {
    id: "1",
    name: "Nike Endorsement Deal",
    status: "active",
    value: 45000,
    startDate: "2024-01-15",
    endDate: "2024-12-31",
    issues: 0,
    template: "Social Media Package", // Added template column
  },
  {
    id: "2",
    name: "Local Restaurant Partnership",
    status: "pending",
    value: 15000,
    startDate: "2024-03-01",
    endDate: "2024-08-31",
    issues: 2,
    template: "Appearance Package", // Added template column
  },
  {
    id: "3",
    name: "Social Media Campaign",
    status: "completed",
    value: 8500,
    startDate: "2023-09-01",
    endDate: "2023-12-31",
    issues: 0,
    template: "Content Creation", // Added template column
  },
]

const mockPayouts = [
  {
    id: "1",
    date: "2024-01-15",
    amount: "$15,000",
    status: "completed",
    contract: "Nike Endorsement Deal",
  },
  {
    id: "2",
    date: "2024-02-15",
    amount: "$15,000",
    status: "completed",
    contract: "Nike Endorsement Deal",
  },
  {
    id: "3",
    date: "2024-03-15",
    amount: "$15,000",
    status: "pending",
    contract: "Nike Endorsement Deal",
  },
]

const mockUpcomingDisbursements = [
  {
    id: "1",
    date: "2024-03-15",
    amount: "$15,000",
    contract: "Nike Endorsement Deal",
  },
  {
    id: "2",
    date: "2024-04-01",
    amount: "$7,500",
    contract: "Local Restaurant Partnership",
  },
  {
    id: "3",
    date: "2024-04-15",
    amount: "$15,000",
    contract: "Nike Endorsement Deal",
  },
]

const mockDocuments = [
  {
    id: "1",
    filename: "W-9_Marcus_Johnson.pdf",
    uploadDate: "2024-01-10",
    type: "W-9",
  },
  {
    id: "2",
    filename: "ID_Verification.pdf",
    uploadDate: "2024-01-10",
    type: "ID Verification",
  },
]

const mockActivity = [
  {
    id: "1",
    timestamp: "2024-01-15T10:30:00Z",
    description: "Contract activated: Nike Endorsement Deal",
    type: "contract",
  },
  {
    id: "2",
    timestamp: "2024-01-12T14:20:00Z",
    description: "KYC verification completed",
    type: "kyc",
  },
  {
    id: "3",
    timestamp: "2024-01-10T09:15:00Z",
    description: "Tax documents uploaded",
    type: "document",
  },
  {
    id: "4",
    timestamp: "2024-01-08T14:45:00Z",
    description: "Beneficiary profile created",
    type: "created",
  },
]

// Mock ledger data for accounts tab
const mockLedgerEntries = [
  {
    id: "1",
    date: "2024-01-15",
    contract: "Nike Endorsement Deal",
    event: "Allocation",
    amount: 45000,
    balanceAfter: 45000,
    status: "Posted",
  },
  {
    id: "2",
    date: "2024-01-20",
    contract: "Nike Endorsement Deal",
    event: "Milestone met",
    amount: 15000,
    balanceAfter: 45000,
    status: "Available",
  },
  {
    id: "3",
    date: "2024-01-25",
    contract: "Nike Endorsement Deal",
    event: "Transfer out",
    amount: -15000,
    balanceAfter: 30000,
    status: "Completed",
  },
  {
    id: "4",
    date: "2024-02-15",
    contract: "Nike Endorsement Deal",
    event: "Milestone met",
    amount: 15000,
    balanceAfter: 30000,
    status: "Available",
  },
  {
    id: "5",
    date: "2024-02-20",
    contract: "Nike Endorsement Deal",
    event: "Transfer out",
    amount: -15000,
    balanceAfter: 15000,
    status: "Completed",
  },
  {
    id: "6",
    date: "2024-03-01",
    contract: "Local Restaurant Partnership",
    event: "Allocation",
    amount: 15000,
    balanceAfter: 30000,
    status: "Posted",
  },
  {
    id: "7",
    date: "2024-03-15",
    contract: "Nike Endorsement Deal",
    event: "Milestone met",
    amount: 15000,
    balanceAfter: 30000,
    status: "Available",
  },
  {
    id: "8",
    date: "2024-03-20",
    contract: "Local Restaurant Partnership",
    event: "Transfer out",
    amount: -7500,
    balanceAfter: 22500,
    status: "Pending",
  },
]

// Mock data for connected accounts
const mockConnectedAccounts = [
  {
    id: "1",
    nickname: "Primary Checking",
    bankName: "Huntington Bank",
    accountNumber: "•••• 4321",
    accountType: "Checking",
    isDefault: true,
  },
  {
    id: "2",
    nickname: "Savings Account",
    bankName: "Wells Fargo",
    accountNumber: "•••• 7890",
    accountType: "Savings",
    isDefault: false,
  },
]

const mockSponsorAllocations = [
  {
    id: "1",
    sponsor: "Nike Basketball Division",
    pool: "Basketball Athletes Q2 2024",
    allocated: 45000,
    disbursed: 30000,
    remaining: 15000,
    status: "Active",
    startDate: "2024-01-15",
    nextPayment: "2024-06-15",
    nextPaymentAmount: 15000,
  },
  {
    id: "2",
    sponsor: "TechStart Solutions",
    pool: "Tech & Innovation Athletes",
    allocated: 22000,
    disbursed: 8000,
    remaining: 14000,
    status: "Active",
    startDate: "2024-03-01",
    nextPayment: "2024-07-01",
    nextPaymentAmount: 7000,
  },
  {
    id: "3",
    sponsor: "Elite Fitness Equipment Co.",
    pool: "Fitness & Wellness Program",
    allocated: 35500,
    disbursed: 12000,
    remaining: 23500,
    status: "Active",
    startDate: "2024-02-15",
    nextPayment: "2024-06-30",
    nextPaymentAmount: 11750,
  },
]

const mockPendingAllocations = [
  {
    id: "1",
    sponsor: "Regional Auto Dealership",
    pool: "Local Athletes Program",
    amount: 18000,
    requestDate: "2024-06-01",
    status: "Pending Approval",
    requestedBy: "Contract Manager",
  },
]

const mockAvailablePools = [
  {
    id: "POOL-001",
    sponsor: "Nike Basketball Division",
    name: "Basketball Athletes Q2 2024",
    available: 375000,
  },
  {
    id: "POOL-002",
    sponsor: "TechStart Solutions",
    name: "Tech & Innovation Athletes",
    available: 175000,
  },
  {
    id: "POOL-003",
    sponsor: "Elite Fitness Equipment Co.",
    name: "Fitness & Wellness Program",
    available: 305000,
  },
]

const mockAvailableSponsors = [
  {
    id: "1",
    name: "Walmart Foundation",
    available: 350000,
  },
  {
    id: "2",
    name: "John Tyson",
    available: 180000,
  },
  {
    id: "3",
    name: "Tyson Foods",
    available: 125000,
  },
]

function BeneficiaryDetailManagementInner({ beneficiaryId }: BeneficiaryDetailManagementProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<"Overview" | "Transactions" | "Deliverables" | "Documents">("Overview")
  const [accountsStatusFilter, setAccountsStatusFilter] = useState("all")
  const [connectedAccounts, setConnectedAccounts] = useState(mockConnectedAccounts)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [autoDistribute, setAutoDistribute] = useState(false)
  const [ledgerEntries, setLedgerEntries] = useState(mockLedgerEntries)
  const [transferForm, setTransferForm] = useState({
    toAccount: "",
    amount: "",
    notes: "",
  })
  const [transferError, setTransferError] = useState("")
  const [showAddAccountModal, setShowAddAccountModal] = useState(false)
  const [newAccount, setNewAccount] = useState({
    nickname: "",
    accountType: "Checking",
    routingNumber: "",
    accountNumber: "",
    accountHolderName: "",
  })
  const [showManualAllocationDialog, setShowManualAllocationDialog] = useState(false)
  const [manualAllocationForm, setManualAllocationForm] = useState({
    pool: "",
    amount: "",
    notes: "",
  })

  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  const [editProfileForm, setEditProfileForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    sport: "",
    position: "",
    graduatingClass: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  })

  const [showEditRepresentationModal, setShowEditRepresentationModal] = useState(false)
  const [editRepresentationForm, setEditRepresentationForm] = useState({
    agency: "",
    agencyWebsite: "",
    agencyEmail: "",
    agent: "",
    agentEmail: "",
    agentPhone: "",
  })
  const [showAddAgency, setShowAddAgency] = useState(false)
  const [showAddAgent, setShowAddAgent] = useState(false)
  const [agencySearchOpen, setAgencySearchOpen] = useState(false)
  const [agentSearchOpen, setAgentSearchOpen] = useState(false)

  // Payout account onboarding modal state
  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false)
  const [onboardingEmail, setOnboardingEmail] = useState("")
  const [onboardingConfirmed, setOnboardingConfirmed] = useState(false)

  // Contract upload workflow state
  const [contractWorkflowUploadOpen, setContractWorkflowUploadOpen] = useState(false)
  const [contractWorkflowActive, setContractWorkflowActive] = useState(false)
  const workflowCtx = useContractWorkflow()
  
  // Build Contract flow state
  const [buildContractActive, setBuildContractActive] = useState(false)
  const buildCtx = useBuildContract()
  const searchParams = useSearchParams()
  
  const handleBuildContractStart = () => {
    // Initialize build contract form with athlete data
    buildCtx.setFormData({
      athleteId: beneficiaryId,
      athleteName: `${beneficiary.firstName} ${beneficiary.lastName}`,
      athleteDetail: `${beneficiary.firstName} ${beneficiary.lastName} · ${(beneficiary as any).sport || "Football"} · ${(beneficiary as any).position || ""} · ${beneficiary.university}`,
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

  const mockRepresentation = {
    agency: "Excel Sports Management",
    agencyWebsite: "https://excelsm.com",
    agencyEmail: "info@excelsm.com",
    agent: "Mark Steinberg",
    agentEmail: "mark@excelsm.com",
    agentPhone: "(310) 555-0123",
  }

  const mockAgencies = [
    { id: "1", name: "Excel Sports Management", website: "https://excelsm.com", email: "info@excelsm.com" },
    { id: "2", name: "CAA Sports", website: "https://caasports.com", email: "info@caasports.com" },
    { id: "3", name: "Wasserman", website: "https://wasserman.com", email: "info@wasserman.com" },
    { id: "4", name: "Athletes First", website: "https://athletesfirst.com", email: "info@athletesfirst.com" },
  ]

  const mockAgents = [
    {
      id: "1",
      name: "Mark Steinberg",
      email: "mark@excelsm.com",
      phone: "(310) 555-0123",
      agency: "Excel Sports Management",
    },
    { id: "2", name: "Jimmy Sexton", email: "jimmy@caasports.com", phone: "(901) 555-0456", agency: "CAA Sports" },
    {
      id: "3",
      name: "Leigh Steinberg",
      email: "leigh@steinbergsports.com",
      phone: "(949) 555-0789",
      agency: "Steinberg Sports",
    },
  ]

  const beneficiary = mockBeneficiaryData[beneficiaryId as keyof typeof mockBeneficiaryData]

  // Payout account status per athlete: "active", "under_review", "pending_onboarding", or "needs_onboarding"
  const payoutAccountStatusMap: Record<string, "active" | "under_review" | "pending_onboarding" | "needs_onboarding"> = {
    "1": "active",
    "2": "needs_onboarding",
    "osu-001": "active",
    "osu-002": "under_review",
    "osu-003": "active",
    "osu-004": "needs_onboarding",
    "osu-005": "active",
    "osu-006": "pending_onboarding",
    "osu-007": "active",
    "osu-008": "needs_onboarding",
    "osu-009": "active",
    "osu-010": "under_review",
    "osu-011": "pending_onboarding",
    "osu-012": "needs_onboarding",
    "osu-013": "active",
    "osu-014": "pending_onboarding",
    "duke-001": "active",
    "duke-002": "under_review",
    "texas-001": "needs_onboarding",
    // Basketball roster for Planning
    "mb-001": "active",
    "mb-002": "active",
    "mb-003": "active",
    "mb-004": "needs_onboarding",
    "mb-005": "needs_onboarding",
    "wb-001": "active",
    "wb-002": "active",
    "wb-003": "needs_onboarding",
    "wb-004": "active",
  }
  const payoutAccountStatus = payoutAccountStatusMap[beneficiaryId] ?? "needs_onboarding"

  // Check if coming from Planning with revshare params
  const isFromPlanning = searchParams.get("build") === "revshare"
  const isFromIoiPlanning = searchParams.get("build") === "ioi"
  const planningCapPeriods = {
    cp1: parseInt(searchParams.get("cp1") || "0", 10),
    cp2: parseInt(searchParams.get("cp2") || "0", 10),
    cp3: parseInt(searchParams.get("cp3") || "0", 10),
  }
  const ioiAmount = parseInt(searchParams.get("amount") || "0", 10)

  if (!beneficiary) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Beneficiary not found</h1>
          <Button onClick={() => router.push("/beneficiaries")} className="mt-4">
            Back to Beneficiaries
          </Button>
        </div>
      </div>
    )
  }

  const disbursementHistory = Array.isArray(beneficiary.disbursementHistory) ? beneficiary.disbursementHistory : []
  const activeContracts = Array.isArray(beneficiary.activeContracts) ? beneficiary.activeContracts : []
  const recentActivity = Array.isArray(beneficiary.recentActivity) ? beneficiary.recentActivity : []
  const connectedAccountsData = Array.isArray(beneficiary.connectedAccounts) ? beneficiary.connectedAccounts : []

  // Auto-trigger build flow when coming from Planning with revshare params.
  // Placed after early return so beneficiary is guaranteed to exist.
  useEffect(() => {
    if (isFromPlanning && !buildContractActive) {
      const totalValue = planningCapPeriods.cp1 + planningCapPeriods.cp2 + planningCapPeriods.cp3
      
      // Build cap periods from the planning data
      // These correspond to the 3 cap periods: Jul '25 - Jun '26, Jul '26 - Jun '27, Jul '27 - Jun '28
      const capPeriods = [
        { id: "cap-0", label: "Jul '25 - Jun '26", startDate: "2025-07-01", endDate: "2026-06-30", amount: planningCapPeriods.cp1, percentage: 0, locked: false },
        { id: "cap-1", label: "Jul '26 - Jun '27", startDate: "2026-07-01", endDate: "2027-06-30", amount: planningCapPeriods.cp2, percentage: 0, locked: false },
        { id: "cap-2", label: "Jul '27 - Jun '28", startDate: "2027-07-01", endDate: "2028-06-30", amount: planningCapPeriods.cp3, percentage: 0, locked: false },
      ].filter(cp => cp.amount > 0) // Only include cap periods with values
      
      // Calculate percentages
      capPeriods.forEach(cp => {
        cp.percentage = totalValue > 0 ? Math.round((cp.amount / totalValue) * 100) : 0
      })
      
      // Determine start and end dates based on which cap periods have values
      const startDate = capPeriods.length > 0 ? capPeriods[0].startDate : "2025-07-01"
      const endDate = capPeriods.length > 0 ? capPeriods[capPeriods.length - 1].endDate : "2026-06-30"
      
      // Initialize build contract form with athlete data and pre-selected revenue share
      buildCtx.setFormData({
        athleteId: beneficiaryId,
        athleteName: `${beneficiary.firstName} ${beneficiary.lastName}`,
        athleteDetail: `${beneficiary.firstName} ${beneficiary.lastName} · ${(beneficiary as any).sport || "Basketball"} · ${(beneficiary as any).position || ""} · ${beneficiary.university}`,
        contractType: "revenue-share",
        totalValue: totalValue,
        startDate,
        endDate,
        capPeriods,
      })
      setBuildContractActive(true)
      buildCtx.setStage("define")
    }
    // Auto-trigger IOI build flow when coming from NIL Sponsorship planning
    if (isFromIoiPlanning && !buildContractActive) {
      buildCtx.setFormData({
        athleteId: beneficiaryId,
        athleteName: `${beneficiary.firstName} ${beneficiary.lastName}`,
        athleteDetail: `${beneficiary.firstName} ${beneficiary.lastName} · ${(beneficiary as any).sport || "Basketball"} · ${(beneficiary as any).position || ""} · ${beneficiary.university}`,
        contractType: "ioi",
        totalValue: ioiAmount,
      })
      setBuildContractActive(true)
      buildCtx.setStage("define")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deliverables = mockDeliverables[beneficiaryId as keyof typeof mockDeliverables] || []
  const compensationBreakdownData = mockCompensationBreakdown[beneficiaryId as keyof typeof mockCompensationBreakdown]

  const overdueDeliverables = deliverables.filter((d) => d.status === "overdue")
  const pendingDeliverables = deliverables.filter((d) => d.status !== "completed")

  // Calculate totals for compensation
  const totalNIL = compensationBreakdownData?.nilContracts.reduce((sum, c) => sum + c.value, 0) || 0
  const totalBenefits = compensationBreakdownData?.benefitsPool.reduce((sum, b) => sum + b.value, 0) || 0
  const totalCommitments = totalNIL + totalBenefits

  const eligibility = beneficiary.eligibility || {
    enrolledFullTime: { status: false, verified: "N/A", detail: "Not verified" },
    gpaAboveThreshold: { status: false, verified: "N/A", detail: "Not verified" },
    noTransferPortal: { status: false, verified: "N/A", detail: "Not verified" },
    policyAgreementSigned: { status: false, verified: "N/A", detail: "Not verified" },
  }
  const disbursementAllocation = beneficiary.disbursementAllocation || {
    taxReserve: 0,
    privateClientAccount: 0,
    paypal: 0,
  }
  const currentBalances = beneficiary.currentBalances || {
    taxReserve: 0,
    privateClientAccount: 0,
  }

  const totalDisbursed = disbursementHistory
    .filter((d) => d.status === "completed")
    .reduce((sum, d) => sum + d.netPaid, 0)

  const totalContractValue = activeContracts.reduce((sum, c) => sum + c.value, 0)

  const handleMakeDefault = (accountId: string) => {
    setConnectedAccounts((accounts) =>
      accounts.map((account) => ({
        ...account,
        isDefault: account.id === accountId,
      })),
    )
    toast({
      title: "Default account updated",
      description: "This account is now set as the default for transfers.",
    })
  }

  const handleRemoveAccount = (accountId: string) => {
    const accountToRemove = connectedAccounts.find((acc) => acc.id === accountId)
    setConnectedAccounts((accounts) => accounts.filter((account) => account.id !== accountId))

    // If we removed the default account, make the first remaining account default
    if (accountToRemove?.isDefault && connectedAccounts.length > 1) {
      const remainingAccounts = connectedAccounts.filter((account) => account.id !== accountId)
      if (remainingAccounts.length > 0) {
        setConnectedAccounts((accounts) =>
          accounts.map((account, index) => ({
            ...account,
            isDefault: index === 0,
          })),
        )
      }
    }

    toast({
      title: "Account removed",
      description: `${accountToRemove?.bankName} account has been removed.`,
    })
  }

  const handleAddAccount = () => {
    const newId = (connectedAccounts.length + 1).toString()
    const isFirstAccount = connectedAccounts.length === 0

    const accountToAdd = {
      id: newId,
      nickname: newAccount.nickname || `${newAccount.accountType} Account`,
      bankName: "New Bank", // Mock bank name
      accountNumber: `•••• ${newAccount.accountNumber.slice(-4)}`,
      accountType: newAccount.accountType,
      isDefault: isFirstAccount, // Make default if it's the first account
    }

    setConnectedAccounts((accounts) => [...accounts, accountToAdd])
    setShowAddAccountModal(false)
    setNewAccount({
      nickname: "",
      accountType: "Checking",
      routingNumber: "",
      accountNumber: "",
      accountHolderName: "",
    })

    toast({
      title: "External account added",
      description: isFirstAccount
        ? "This account has been set as your default."
        : "Account has been added successfully.",
    })
  }

  const maskAccountNumber = (value: string) => {
    // Show only last 4 digits, mask the rest
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length <= 4) return cleaned
    return "•".repeat(cleaned.length - 4) + cleaned.slice(-4)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "needs-review":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      case "blocked":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getContractStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getPayoutStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      case "blocked":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const calculateAllocatedFunds = () => {
    return mockLedgerEntries
      .filter((entry) => entry.event === "Allocation")
      .reduce((sum, entry) => sum + entry.amount, 0)
  }

  const calculateAvailableFunds = () => {
    return ledgerEntries.filter((entry) => entry.status === "Available").reduce((sum, entry) => sum + entry.amount, 0)
  }

  const calculateDisbursedFunds = () => {
    return ledgerEntries
      .filter((entry) => entry.event === "Transfer out" && entry.status === "Completed")
      .reduce((sum, entry) => sum + Math.abs(entry.amount), 0)
  }

  const handleTransferFunds = () => {
    const availableFunds = calculateAvailableFunds()
    const transferAmount = Number.parseFloat(transferForm.amount)

    if (transferAmount > availableFunds) {
      setTransferError("Amount exceeds available funds.")
      return
    }

    const selectedAccount = connectedAccounts.find((acc) => acc.id === transferForm.toAccount)
    if (!selectedAccount) return

    // Create new transfer entry
    const newEntry = {
      id: (ledgerEntries.length + 1).toString(),
      date: new Date().toISOString().split("T")[0],
      contract: "Multiple Contracts",
      event: `Transfer out to ${selectedAccount.bankName} ${selectedAccount.accountNumber}`,
      amount: -transferAmount,
      balanceAfter: ledgerEntries[ledgerEntries.length - 1]?.balanceAfter || 0,
      status: "Pending" as const,
    }

    setLedgerEntries((prev) => [...prev, newEntry])

    // Simulate processing delay
    setTimeout(() => {
      setLedgerEntries((prev) =>
        prev.map((entry) => (entry.id === newEntry.id ? { ...entry, status: "Completed" as const } : entry)),
      )
    }, 2000)

    setShowTransferModal(false)
    setTransferForm({ toAccount: "", amount: "", notes: "" })
    setTransferError("")
    toast({ title: "Transfer submitted", description: "Your transfer is being processed." })
  }

  const handleTransferMax = () => {
    const availableFunds = calculateAvailableFunds()
    setTransferForm((prev) => ({ ...prev, amount: availableFunds.toString() }))
    setTransferError("")
  }

  const handleAutoDistributeToggle = (enabled: boolean) => {
    setAutoDistribute(enabled)
    if (enabled) {
      toast({
        title: "Auto-distribute enabled",
        description: "Newly released funds will be automatically transferred to your default account.",
      })
    }
  }

  const getFilteredLedgerEntries = () => {
    if (accountsStatusFilter === "all") {
      return ledgerEntries
    }
    return ledgerEntries.filter((entry) => entry.status.toLowerCase() === accountsStatusFilter.toLowerCase())
  }

  const getLedgerStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "posted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      case "pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const handleManualAllocation = () => {
    const selectedPool = mockAvailablePools.find((p) => p.id === manualAllocationForm.pool)
    if (!selectedPool) return

    toast({
      title: "Allocation submitted",
      description: `$${Number.parseFloat(manualAllocationForm.amount).toLocaleString()} allocation from ${selectedPool.sponsor} is pending approval.`,
    })

    setShowManualAllocationDialog(false)
    setManualAllocationForm({ pool: "", amount: "", notes: "" })
  }

  const handleSendKYCInvite = () => {
    console.log("[v0] Sending KYC invite to", beneficiary.email)
    // Mock status update to In Progress
    alert("KYC invite sent! Status updated to In Progress.")
  }

  const handleUploadTaxForm = () => {
    console.log("[v0] Opening file picker for tax form upload")
    // Mock file upload
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".pdf,.doc,.docx"
    input.onchange = () => {
      if (input.files && input.files[0]) {
        alert(`Tax form "${input.files[0].name}" uploaded successfully!`)
      }
    }
    input.click()
  }

  const handleEscalate = () => {
    console.log("[v0] Escalating beneficiary to compliance")
    alert("Beneficiary escalated to Bank/Compliance team.")
  }

  const handleSubmitTransfer = () => {
    handleTransferFunds()
  }

  // Added handler for sending reminders
  const handleSendReminder = (deliverableId: string, deliverableTitle: string) => {
    toast({
      title: "Reminder sent",
      description: `Notification sent to athlete's mobile app for: ${deliverableTitle}`,
    })
  }

  // Added handler for viewing all tasks
  const handleViewAllTasks = () => {
    toast({
      title: "View all tasks",
      description: "Opening full deliverables list...",
    })
  }

  // Removed old overview, contracts, funding, compliance tabs and replaced with new structure
  const handleOpenEditProfile = () => {
    setEditProfileForm({
      firstName: beneficiary.firstName || "",
      middleName: "",
      lastName: beneficiary.lastName || "",
      suffix: "",
      sport: beneficiary.sport || "",
      position: beneficiary.position || "",
      graduatingClass: beneficiary.year || "",
      email: beneficiary.email || "",
      phone: beneficiary.phone || "",
      street: beneficiary.address?.line1 || "",
      city: beneficiary.address?.city || "",
      state: beneficiary.address?.state || "",
      zip: beneficiary.address?.zip || "",
    })
    setShowEditProfileModal(true)
  }

  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Athlete profile has been successfully updated.",
    })
    setShowEditProfileModal(false)
  }

  const handleOpenEditRepresentation = () => {
    setEditRepresentationForm({
      agency: mockRepresentation.agency || "",
      agencyWebsite: mockRepresentation.agencyWebsite || "",
      agencyEmail: mockRepresentation.agencyEmail || "",
      agent: mockRepresentation.agent || "",
      agentEmail: mockRepresentation.agentEmail || "",
      agentPhone: mockRepresentation.agentPhone || "",
    })
    setShowEditRepresentationModal(true)
  }

  const handleSaveRepresentation = () => {
    toast({
      title: "Representation updated",
      description: "Agency and agent information has been successfully updated.",
    })
    setShowEditRepresentationModal(false)
  }

  // Contract workflow handlers
  const handleWorkflowUploadComplete = (data: {
    fileName: string
    contractType: string
    group: string
    notes: string
  }) => {
    // Set the upload data in the workflow context
    workflowCtx.setUploadData({
      athleteId: beneficiaryId,
      athleteName: `${beneficiary.firstName} ${beneficiary.lastName}`,
      athleteDetail: `${beneficiary.firstName} ${beneficiary.lastName} · ${(beneficiary as any).sport || "Football"} · ${(beneficiary as any).position || ""} · ${beneficiary.university}`,
      contractType: data.contractType,
      fileName: data.fileName,
      notes: data.notes,
      contractId: `contract-${Date.now()}`,
    })
    // Move workflow to processing stage
    workflowCtx.setStage("processing")
    setContractWorkflowUploadOpen(false)
    setContractWorkflowActive(true)
  }

  const handleWorkflowComplete = () => {
    setContractWorkflowActive(false)
    workflowCtx.resetWorkflow()
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
  
  // Show Build Contract stages when active
  if (buildContractActive) {
    if (buildCtx.state.stage === "define") {
    return <BuildDefineStage
      onCancel={handleBuildContractCancel}
      fromPlanning={isFromPlanning || isFromIoiPlanning}
      planningCapPeriods={isFromPlanning ? planningCapPeriods : undefined}
    />
    }
    if (buildCtx.state.stage === "generate") {
      return <BuildGenerateStage />
    }
    if (buildCtx.state.stage === "review") {
      return <BuildReviewStage onBack={() => buildCtx.setStage("define")} />
    }
    if (buildCtx.state.stage === "export") {
      return <BuildExportStage onBack={() => buildCtx.setStage("review")} onComplete={handleBuildContractComplete} />
    }
  }
  
  return (
<div className="container mx-auto py-6 space-y-6">
  {/* Contract Workflow Upload Modal */}
  <ContractWorkflowUploadModal
  open={contractWorkflowUploadOpen}
  onOpenChange={setContractWorkflowUploadOpen}
  onUploaded={handleWorkflowUploadComplete}
  athleteName={`${beneficiary.firstName} ${beneficiary.lastName}`}
  athleteDetail={`${beneficiary.firstName} ${beneficiary.lastName} · ${(beneficiary as any).sport || "Football"} · ${(beneficiary as any).position || ""} · ${beneficiary.university}`}
  />

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => router.push("/beneficiaries")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Athletes
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2 cursor-pointer bg-white text-muted-foreground border-border/50 hover:bg-muted/50 hover:text-muted-foreground"
            onClick={() => router.push(`/contract/upload?athlete=${beneficiaryId}&type=beneficiary`)}
          >
            <Plus className="w-4 h-4" />
            Demo Contract
          </Button>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile and Active Contracts stacked */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
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
                  onClick={handleOpenEditProfile}
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
                    {beneficiary.firstName[0]}
                    {beneficiary.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {beneficiary.firstName} {beneficiary.lastName}
                      </h2>
                      <p className="text-muted-foreground">
                        {beneficiary.sport || "N/A"} • {beneficiary.position || "N/A"} • {beneficiary.year || "N/A"}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Building className="w-4 h-4" />
                        {beneficiary.university}
                      </div>
                      {beneficiary.universityId && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="w-4 h-4" />
                          ID: {beneficiary.universityId}
                        </div>
                      )}
                      {/* Payout Account Status */}
                      <div className="flex items-center gap-2 text-sm">
                        <Wallet className="w-4 h-4 text-muted-foreground" />
                        {payoutAccountStatus === "active" && (
                          <span className="flex items-center gap-1 text-emerald-600 font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            Payout Account Active
                          </span>
                        )}
                        {payoutAccountStatus === "under_review" && (
                          <span className="flex items-center gap-1 text-amber-600 font-medium">
                            <Clock className="w-4 h-4" />
                            Account Application Under Review
                          </span>
                        )}
                        {payoutAccountStatus === "pending_onboarding" && (
                          <span className="flex items-center gap-1 text-orange-500 font-medium">
                            <Hourglass className="w-4 h-4" />
                            Pending Onboarding
                          </span>
                        )}
                        {payoutAccountStatus === "needs_onboarding" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 gap-1 text-xs"
                            onClick={() => {
                              setOnboardingEmail(beneficiary.email || "")
                              setOnboardingConfirmed(false)
                              setOnboardingModalOpen(true)
                            }}
                          >
                            <Send className="w-3 h-3" />
                            Request Account Onboarding
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex flex-col gap-2">
                      <Badge variant="default">{beneficiary.status}</Badge>
                      {overdueDeliverables.length > 0 && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {overdueDeliverables.length} Overdue Task{overdueDeliverables.length > 1 ? "s" : ""}
                        </Badge>
                      )}
                      {beneficiary.statusUpdated && (
                        <p className="text-xs text-muted-foreground">Updated {beneficiary.statusUpdated}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        {beneficiary.email}
                      </p>
                      {beneficiary.phone && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          {beneficiary.phone}
                        </p>
                      )}
                    </div>
                    {beneficiary.address && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {beneficiary.address.line1},
                        </p>
                        <p className="text-sm text-muted-foreground ml-4">
                          {beneficiary.address.city}, {beneficiary.address.state} {beneficiary.address.zip}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column - Representation Sidebar (top row only) */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Representation
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-muted-foreground hover:text-foreground"
                  onClick={handleOpenEditRepresentation}
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockRepresentation.agency ? (
                <>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Agency</p>
                    <p className="font-semibold">{mockRepresentation.agency}</p>
                    {mockRepresentation.agencyWebsite && (
                      <a
                        href={mockRepresentation.agencyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {mockRepresentation.agencyWebsite}
                      </a>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Primary Agent</p>
                    <p className="font-semibold">{mockRepresentation.primaryAgent}</p>
                    {mockRepresentation.primaryAgentEmail && (
                      <p className="text-sm text-muted-foreground">{mockRepresentation.primaryAgentEmail}</p>
                    )}
                    {mockRepresentation.primaryAgentPhone && (
                      <p className="text-sm text-muted-foreground">{mockRepresentation.primaryAgentPhone}</p>
                    )}
                  </div>
                  {mockRepresentation.coAgent && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Co-Agent</p>
                      <p className="font-semibold">{mockRepresentation.coAgent}</p>
                      {mockRepresentation.coAgentEmail && (
                        <p className="text-sm text-muted-foreground">{mockRepresentation.coAgentEmail}</p>
                      )}
                    </div>
                  )}
                  {mockRepresentation.attorney && (
                    <div className="border-t pt-3">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Attorney</p>
                      <p className="font-semibold">{mockRepresentation.attorney}</p>
                      {mockRepresentation.attorneyFirm && (
                        <p className="text-sm text-muted-foreground">{mockRepresentation.attorneyFirm}</p>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No representation information on file.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="border-b">
        <nav className="flex gap-6" aria-label="Athlete detail tabs">
          {(["Overview", "Transactions", "Deliverables", "Documents"] as const).map((tab) => (
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

      {/* ===== TRANSACTIONS TAB (full width, outside grid) ===== */}
      {activeTab === "Transactions" && (
        <div className="space-y-4">
          {/* Compact balance bar */}
          <div className="flex items-center justify-between border rounded-lg px-4 py-2.5">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Revenue Share</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-muted-foreground">YTD Disbursed:</span>
                <span className="text-sm font-semibold">${beneficiaryId === "osu-001" ? "71,428" : "45,000"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-muted-foreground">Destination:</span>
                <span className="text-sm font-medium">Chase ••••4521</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 h-8">
              <Download className="w-3.5 h-3.5" />
              Export
            </Button>
          </div>

          {/* Upcoming Payments */}
          {(() => {
            const upcomingPayments = [
              { id: 1, dueDate: "Mar 17, 2026", description: "Monthly License Fee - Mar 2026", type: "Scheduled" as const, amount: 71428, status: "Pending Confirmation" as const, source: "Revenue Share" },
              { id: 2, dueDate: "Apr 17, 2026", description: "Monthly License Fee - Apr 2026", type: "Scheduled" as const, amount: 71428, status: "Upcoming" as const, source: "Revenue Share" },
              { id: 3, dueDate: "May 17, 2026", description: "Monthly License Fee - May 2026", type: "Scheduled" as const, amount: 71428, status: "Upcoming" as const, source: "Revenue Share" },
            ]

            const statusStyles: Record<string, { badge: string, icon: React.ReactNode }> = {
              "Pending Confirmation": { 
                badge: "border-amber-300 text-amber-700 bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:bg-amber-950/30",
                icon: <Clock className="w-3.5 h-3.5" />
              },
              "Ready for Release": { 
                badge: "border-emerald-300 text-emerald-700 bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:bg-emerald-950/30",
                icon: <CheckCircle2 className="w-3.5 h-3.5" />
              },
              "Upcoming": { 
                badge: "border-slate-300 text-slate-600 bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:bg-slate-950/30",
                icon: <Hourglass className="w-3.5 h-3.5" />
              },
            }

            return (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Upcoming Payments</CardTitle>
                      <p className="text-sm text-muted-foreground mt-0.5">Scheduled disbursements for this athlete</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-6">Due Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="pl-6 whitespace-nowrap font-medium">{payment.dueDate}</TableCell>
                          <TableCell>{payment.description}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs dark:bg-blue-950/30 dark:text-blue-400">
                              {payment.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{payment.source}</TableCell>
                          <TableCell className="text-right font-semibold">${payment.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`text-xs gap-1 ${statusStyles[payment.status].badge}`}>
                              {statusStyles[payment.status].icon}
                              {payment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="px-6 py-3 border-t bg-muted/30">
                    <p className="text-sm text-muted-foreground">
                      Next payment of <span className="font-medium text-foreground">$71,428</span> due <span className="font-medium text-foreground">Mar 17, 2026</span> — pending eligibility confirmation
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })()}

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Transaction History</CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">Completed disbursements and transfers</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search transactions..." className="pl-9 h-9" />
                </div>
                <Select defaultValue="all-types">
                  <SelectTrigger className="w-[140px] h-9">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-types">All Types</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="conditional">Conditional</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-time">
                  <SelectTrigger className="w-[140px] h-9">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-time">All Time</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                    <SelectItem value="90d">Last 90 Days</SelectItem>
                    <SelectItem value="ytd">Year to Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              {(() => {
                const transactions = [
                  { id: 1, date: "Feb 17, 2026", description: "Monthly License Fee - Feb 2026", type: "Scheduled" as const, amount: 71428, destination: "••••4521", status: "Complete" as const, releasedBy: "Sarah Johnson" },
                  { id: 2, date: "Jan 17, 2026", description: "Monthly License Fee - Jan 2026", type: "Scheduled" as const, amount: 71428, destination: "••••4521", status: "Complete" as const, releasedBy: "Sarah Johnson" },
                  { id: 3, date: "Jan 10, 2026", description: "Social Media Campaign Bonus", type: "Conditional" as const, amount: 5000, destination: "••••4521", status: "Complete" as const, releasedBy: "Mike Thompson" },
                  { id: 4, date: "Dec 17, 2025", description: "Monthly License Fee - Dec 2025", type: "Scheduled" as const, amount: 71428, destination: "••••4521", status: "Complete" as const, releasedBy: "Sarah Johnson" },
                  { id: 5, date: "Dec 5, 2025", description: "Community Appearance - Children's Hospital", type: "Conditional" as const, amount: 2500, destination: "••••4521", status: "Complete" as const, releasedBy: "Sarah Johnson" },
                  { id: 6, date: "Nov 17, 2025", description: "Monthly License Fee - Nov 2025", type: "Scheduled" as const, amount: 71428, destination: "••••4521", status: "Complete" as const, releasedBy: "Sarah Johnson" },
                  { id: 7, date: "Oct 17, 2025", description: "Monthly License Fee - Oct 2025", type: "Scheduled" as const, amount: 71428, destination: "••••4521", status: "Complete" as const, releasedBy: "Mike Thompson" },
                  { id: 8, date: "Sep 17, 2025", description: "Monthly License Fee - Sep 2025", type: "Scheduled" as const, amount: 71428, destination: "••••4521", status: "Complete" as const, releasedBy: "Sarah Johnson" },
                ]

                const typeBadgeStyle: Record<string, string> = {
                  Scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
                  Conditional: "bg-teal-100 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400",
                }

                const statusBadgeStyle: Record<string, string> = {
                  Complete: "border-emerald-300 text-emerald-700 bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:bg-emerald-950/30",
                  Processing: "border-blue-300 text-blue-700 bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:bg-blue-950/30",
                }

                return (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="pl-6">Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead>Destination</TableHead>
                          <TableHead>Released By</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((txn) => (
                          <TableRow key={txn.id}>
                            <TableCell className="pl-6 text-muted-foreground whitespace-nowrap">{txn.date}</TableCell>
                            <TableCell className="font-medium">{txn.description}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={`text-xs ${typeBadgeStyle[txn.type]}`}>
                                {txn.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-semibold whitespace-nowrap">
                              ${txn.amount.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <span className="text-sm font-mono text-muted-foreground">{txn.destination}</span>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{txn.releasedBy}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`text-xs ${statusBadgeStyle[txn.status]}`}>
                                {txn.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="px-6 py-4 border-t flex items-center justify-center">
                      <Button variant="outline" size="sm">
                        Load More
                      </Button>
                    </div>
                  </>
                )
              })()}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===== DOCUMENTS TAB (full width, outside grid) ===== */}
      {activeTab === "Documents" && (
        <div className="space-y-3">
          {/* Compact account details bar */}
          <div className="flex items-center justify-between border rounded-lg px-4 py-2.5">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Analog &middot; Huntington</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-muted-foreground">Available Balance:</span>
                <span className="text-sm font-semibold">${beneficiaryId === "osu-001" ? "145,834" : "0"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-muted-foreground">Connected:</span>
                <span className="text-sm font-medium">Chase ••••4521</span>
              </div>
            </div>
            <Button size="sm" className="gap-1.5 h-8">
              <Send className="w-3.5 h-3.5" />
              Initiate Transfer
            </Button>
          </div>

          {/* Contracts & Amendments */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Contracts & Amendments
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">Executed agreements and modifications</p>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Upload className="w-4 h-4" />
                  Upload
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Document Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Related Contract</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: 1, name: "NIL License Agreement - Executed", type: "Contract", date: "Jan 16, 2026", contract: "NIL License Agreement", size: "2.4 MB" },
                    { id: 2, name: "Amendment 1 - Payment Schedule Revision", type: "Amendment", date: "Jan 20, 2026", contract: "NIL License Agreement", size: "840 KB" },
                  ].map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="pl-6 font-medium">{doc.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${doc.type === "Contract" ? "border-blue-300 text-blue-700 bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:bg-blue-950/30" : "border-amber-300 text-amber-700 bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:bg-amber-950/30"}`}>
                          {doc.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">{doc.date}</TableCell>
                      <TableCell className="text-muted-foreground">{doc.contract}</TableCell>
                      <TableCell className="text-muted-foreground">{doc.size}</TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">View</Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                            <Download className="w-3 h-3" />
                            Download
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Monthly Statements */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Landmark className="w-4 h-4" />
                    Monthly Statements
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">FBO account statements from Analog &middot; Huntington</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Statement Period</TableHead>
                    <TableHead>Generated</TableHead>
                    <TableHead className="text-right">Opening Balance</TableHead>
                    <TableHead className="text-right">Closing Balance</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: 1, period: "January 2026", generated: "Feb 1, 2026", opening: "$131,834", closing: "$145,834", size: "320 KB" },
                    { id: 2, period: "December 2025", generated: "Jan 1, 2026", opening: "$126,500", closing: "$131,834", size: "290 KB" },
                    { id: 3, period: "November 2025", generated: "Dec 1, 2025", opening: "$126,500", closing: "$126,500", size: "210 KB" },
                  ].map((stmt) => (
                    <TableRow key={stmt.id}>
                      <TableCell className="pl-6 font-medium">{stmt.period}</TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">{stmt.generated}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{stmt.opening}</TableCell>
                      <TableCell className="text-right font-medium">{stmt.closing}</TableCell>
                      <TableCell className="text-muted-foreground">{stmt.size}</TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">View</Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                            <Download className="w-3 h-3" />
                            Download
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Tax Documents */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Tax Documents
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">Tax forms, withholding elections, and annual filings</p>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Upload className="w-4 h-4" />
                  Upload
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Document Name</TableHead>
                    <TableHead>Tax Year</TableHead>
                    <TableHead>Date Filed</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: 1, name: "1099-NEC", year: "2025", date: "Jan 31, 2026", source: "IRS / Analog", size: "180 KB" },
                    { id: 2, name: "W-9 - Taxpayer Identification", year: "2025", date: "Dec 10, 2025", source: "On File", size: "95 KB" },
                    { id: 3, name: "State Tax Withholding Election (OH)", year: "2025", date: "Dec 10, 2025", source: "On File", size: "110 KB" },
                  ].map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="pl-6 font-medium">{doc.name}</TableCell>
                      <TableCell className="text-muted-foreground">{doc.year}</TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">{doc.date}</TableCell>
                      <TableCell className="text-muted-foreground">{doc.source}</TableCell>
                      <TableCell className="text-muted-foreground">{doc.size}</TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">View</Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                            <Download className="w-3 h-3" />
                            Download
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>


        </div>
      )}

      {/* ===== DELIVERABLES TAB (full width, outside grid) ===== */}
      {activeTab === "Deliverables" && (
        <div className="space-y-6">
          {/* Upcoming / Active Deliverables */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Upcoming Deliverables
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">Active obligations that are pending or in progress</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all-contracts">
                    <SelectTrigger className="w-[180px] h-9">
                      <SelectValue placeholder="Contract" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-contracts">All Contracts</SelectItem>
                      <SelectItem value="nil-license">NIL License Agreement</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all-statuses">
                    <SelectTrigger className="w-[150px] h-9">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-statuses">All Statuses</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              {(() => {
                type UpcomingDeliverable = {
                  id: number
                  description: string
                  progress: string
                  deadline: string
                  contractName: string
                  status: "Overdue" | "In Progress" | "Pending"
                  notes?: string
                }
                const upcoming: UpcomingDeliverable[] = beneficiaryId === "osu-001"
                  ? [
                      { id: 1, description: "Brand ambassador training session", progress: "0 of 3 sessions", deadline: "Mar 30, 2026", contractName: "NIL License Agreement", status: "Pending", notes: "First session to be scheduled with brand team" },
                      { id: 2, description: "Promotional video shoot", progress: "0 of 2 videos", deadline: "Sep 30, 2026", contractName: "NIL License Agreement", status: "Pending" },
                      { id: 3, description: "Charity event participation", progress: "0 of 1", deadline: "Nov 15, 2026", contractName: "NIL License Agreement", status: "Pending" },
                      { id: 4, description: "Game-day jersey signing", progress: "0 of 4 events", deadline: "Dec 15, 2026", contractName: "NIL License Agreement", status: "Pending", notes: "Events to align with home football schedule" },
                      { id: 5, description: "Social media posts (collab posts)", progress: "2 of 8 posts", deadline: "Jan 30, 2027", contractName: "NIL License Agreement", status: "In Progress" },
                      { id: 6, description: "Media production time", progress: "1.5 of 6 hours", deadline: "Jan 30, 2027", contractName: "NIL License Agreement", status: "In Progress" },
                      { id: 7, description: "In-person appearances", progress: "0 of 2", deadline: "Jan 30, 2027", contractName: "NIL License Agreement", status: "Pending" },
                      { id: 8, description: "Autographed items", progress: "45 of 200 items", deadline: "Jan 30, 2027", contractName: "NIL License Agreement", status: "In Progress" },
                    ]
                  : [
                      { id: 1, description: "Social media posts", progress: "0 of 4 posts", deadline: "Jun 30, 2026", contractName: activeContracts[0]?.sponsor || "Contract", status: "Pending" },
                      { id: 2, description: "Brand appearances", progress: "0 of 2", deadline: "Jun 30, 2026", contractName: activeContracts[0]?.sponsor || "Contract", status: "Pending" },
                    ]

                const statusStyles: Record<string, string> = {
                  "Overdue": "border-red-300 text-red-700 bg-red-50 dark:border-red-700 dark:text-red-400 dark:bg-red-950/30",
                  "In Progress": "border-blue-300 text-blue-700 bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:bg-blue-950/30",
                  "Pending": "border-amber-300 text-amber-700 bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:bg-amber-950/30",
                }

                return (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-6">Deliverable</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Contract</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcoming.map((d) => (
                        <TableRow key={d.id}>
                          <TableCell className="pl-6 font-medium">{d.description}</TableCell>
                          <TableCell>
                            <span className="text-muted-foreground">{d.progress}</span>
                          </TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap">{d.deadline}</TableCell>
                          <TableCell>
                            <button
                              onClick={() => router.push(`/beneficiaries/${beneficiaryId}`)}
                              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                            >
                              {d.contractName}
                            </button>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`text-xs ${statusStyles[d.status]}`}>
                              {d.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                            {d.notes || "\u2014"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )
              })()}
            </CardContent>
          </Card>

          {/* Completed Deliverables */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Completed Deliverables
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">Fulfilled obligations and past activity</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              {(() => {
                const completed = beneficiaryId === "osu-001"
                  ? [
                      { id: 1, description: "Contract signing photo shoot", completedDate: "Jan 18, 2026", contractName: "NIL License Agreement", verifiedBy: "Brand Team" },
                      { id: 2, description: "Onboarding media kit submission", completedDate: "Jan 20, 2026", contractName: "NIL License Agreement", verifiedBy: "Analog Admin" },
                      { id: 3, description: "Initial social media announcement", completedDate: "Jan 22, 2026", contractName: "NIL License Agreement", verifiedBy: "Brand Team" },
                    ]
                  : [
                      { id: 1, description: "Onboarding media kit submission", completedDate: "Feb 1, 2026", contractName: activeContracts[0]?.sponsor || "Contract", verifiedBy: "Analog Admin" },
                    ]

                return (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-6">Deliverable</TableHead>
                        <TableHead>Completed</TableHead>
                        <TableHead>Contract</TableHead>
                        <TableHead>Verified By</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completed.map((d) => (
                        <TableRow key={d.id}>
                          <TableCell className="pl-6 font-medium">{d.description}</TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap">{d.completedDate}</TableCell>
                          <TableCell>
                            <button
                              onClick={() => router.push(`/beneficiaries/${beneficiaryId}`)}
                              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                            >
                              {d.contractName}
                            </button>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{d.verifiedBy}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs border-emerald-300 text-emerald-700 bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:bg-emerald-950/30">
                              Complete
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )
              })()}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab Content + Account Cards (Overview only) */}
      {activeTab === "Overview" && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* ===== OVERVIEW TAB ===== */}
          {activeTab === "Overview" && (
            <>

          {/* Financial Summary Cards */}
          {activeContracts.length > 0 && (() => {
            const paidToDate = (beneficiary as Record<string, unknown>).disbursementHistory
              ? ((beneficiary as Record<string, unknown>).disbursementHistory as Array<{ gross: number; status: string }>)
                  .filter((d) => d.status === "completed")
                  .reduce((sum, d) => sum + d.gross, 0)
              : 0
            const remaining = totalContractValue - paidToDate
            
            // Calculate breakdown by contract type
            const revenueShareValue = activeContracts
              .filter((c: { type: string }) => c.type === "Revenue Share")
              .reduce((sum: number, c: { value: number }) => sum + c.value, 0)
            const nilSponsorshipValue = activeContracts
              .filter((c: { type: string }) => c.type === "NIL Sponsorship")
              .reduce((sum: number, c: { value: number }) => sum + c.value, 0)
            
            // NIL Indicated value (from IOIs)
            const nilIndicatedValue = (beneficiary as Record<string, unknown>).nilIndicatedValue as number || 0
            
            // Derive next payment info based on the beneficiary
            const nextPaymentDate = beneficiaryId === "osu-001" ? "Feb 1, 2026" : "Feb 15, 2026"
            const nextPaymentAmount = beneficiaryId === "osu-001" ? 14000 : Math.round(totalContractValue / 12)

            return (
              <div className="grid grid-cols-4 gap-3">
                {/* Total Contract Value with breakdown */}
                <div className="border rounded-lg px-4 py-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Contract Value</p>
                  <p className="text-xl font-bold text-foreground mt-1">${totalContractValue.toLocaleString()}</p>
                  <div className="mt-2 pt-2 border-t space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Revenue Share</span>
                      <span className="font-medium">${revenueShareValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">NIL Sponsorship</span>
                      <span className="font-medium">${nilSponsorshipValue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* Paid to Date + Remaining combined */}
                <div className="border rounded-lg px-4 py-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Paid to Date</p>
                  <p className="text-xl font-bold text-foreground mt-1">${paidToDate.toLocaleString()}</p>
                  <div className="mt-2 pt-2 border-t">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Remaining</span>
                      <span className="font-medium">${remaining.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* NIL Sponsorship Card */}
                <div className="border rounded-lg px-4 py-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">NIL Sponsorship</p>
                  <p className="text-xl font-bold text-foreground mt-1">${nilSponsorshipValue.toLocaleString()}</p>
                  <div className="mt-2 pt-2 border-t space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Indicated</span>
                      <span className="font-medium">${nilIndicatedValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Committed</span>
                      <span className="font-medium">${nilSponsorshipValue.toLocaleString()}</span>
                    </div>
                    {nilIndicatedValue > nilSponsorshipValue && (
                      <div className="flex justify-between text-xs text-amber-600 dark:text-amber-400">
                        <span>Gap</span>
                        <span className="font-medium">${(nilIndicatedValue - nilSponsorshipValue).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Next Payment */}
                <div className="border rounded-lg px-4 py-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Next Payment</p>
                  <p className="text-lg font-bold text-foreground mt-1">{nextPaymentDate}</p>
                  <p className="text-xs text-muted-foreground">${nextPaymentAmount.toLocaleString()}</p>
                </div>
              </div>
            )
          })()}

          {activeContracts.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Active Contracts
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activeContracts.length} contract{activeContracts.length > 1 ? "s" : ""} • Total Value: $
                      {totalContractValue.toLocaleString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Download className="w-4 h-4" />
                    Export List
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Contract Name/ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Counterparty</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Days in Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeContracts.map((contract) => (
                      <TableRow
                        key={contract.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => router.push(`/contracts/${contract.id}`)}
                      >
                        <TableCell className="font-medium pl-6">{contract.id}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{contract.type}</Badge>
                        </TableCell>
                        <TableCell>{contract.sponsor}</TableCell>
                        <TableCell className="font-medium">${contract.value.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={contract.status === "active" ? "default" : "secondary"}>
                            {contract.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">32</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  router.push(`/contracts/${contract.id}`)
                                }}
                              >
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Edit</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Payments */}
          {activeContracts.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="w-5 h-5" />
                      Upcoming Payments
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Next 5 scheduled payments
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                {(() => {
                  const payments = beneficiaryId === "osu-001"
                    ? [
                        { id: 1, date: "Feb 1, 2026", amount: 14000, type: "Scheduled" as const, contractId: "c1", contractName: "NIL License Agreement", status: "Upcoming" as const },
                        { id: 2, date: "Mar 1, 2026", amount: 12500, type: "Scheduled" as const, contractId: "c1", contractName: "NIL License Agreement", status: "Upcoming" as const },
                        { id: 3, date: "Apr 1, 2026", amount: 11000, type: "Scheduled" as const, contractId: "c1", contractName: "NIL License Agreement", status: "Upcoming" as const },
                        { id: 4, date: "May 1, 2026", amount: 10000, type: "Scheduled" as const, contractId: "c1", contractName: "NIL License Agreement", status: "Upcoming" as const },
                        { id: 5, date: "Jun 1, 2026", amount: 9500, type: "Scheduled" as const, contractId: "c1", contractName: "NIL License Agreement", status: "Upcoming" as const },
                      ]
                    : [
                        { id: 1, date: "Feb 15, 2026", amount: Math.round(totalContractValue / 12), type: "Scheduled" as const, contractId: "c1", contractName: activeContracts[0]?.sponsor || "Contract", status: "Upcoming" as const },
                        { id: 2, date: "Mar 15, 2026", amount: Math.round(totalContractValue / 12), type: "Scheduled" as const, contractId: "c1", contractName: activeContracts[0]?.sponsor || "Contract", status: "Upcoming" as const },
                        { id: 3, date: "Apr 15, 2026", amount: Math.round(totalContractValue / 12), type: "Scheduled" as const, contractId: "c1", contractName: activeContracts[0]?.sponsor || "Contract", status: "Upcoming" as const },
                        { id: 4, date: "May 15, 2026", amount: Math.round(totalContractValue / 12), type: "Scheduled" as const, contractId: "c1", contractName: activeContracts[0]?.sponsor || "Contract", status: "Upcoming" as const },
                        { id: 5, date: "Jun 15, 2026", amount: Math.round(totalContractValue / 12), type: "Scheduled" as const, contractId: "c1", contractName: activeContracts[0]?.sponsor || "Contract", status: "Upcoming" as const },
                      ]

                  return (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="pl-6 w-10">#</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Contract</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell className="pl-6 text-muted-foreground">{p.id}</TableCell>
                            <TableCell>{p.date}</TableCell>
                            <TableCell className="font-medium">${p.amount.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="font-normal text-xs">
                                {p.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <button
                                onClick={() => router.push(`/beneficiaries/${beneficiaryId}`)}
                                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                              >
                                {p.contractName}
                              </button>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="text-xs border-blue-300 text-blue-700 bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:bg-blue-950/30"
                              >
                                {p.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )
                })()}
              </CardContent>
              <div className="px-6 py-3 border-t">
                <Button variant="link" className="w-full p-0 h-auto text-sm" onClick={() => setActiveTab("Transactions")}>
                  View All Transactions →
                </Button>
              </div>
            </Card>
          )}

          {/* Deliverables */}
          {activeContracts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Deliverables
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Athlete obligations across all contracts
                </p>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                {(() => {
                  type DeliverableItem = {
                    id: number
                    description: string
                    progress: string
                    deadline: string
                    contractId: string
                    contractName: string
                    status: "Pending" | "In Progress" | "Complete" | "Overdue"
                  }
                  const deliverables: DeliverableItem[] = beneficiaryId === "osu-001"
                    ? [
                        { id: 1, description: "Social media posts (collab posts)", progress: "0 of 8 posts", deadline: "Jan 30, 2027", contractId: "c1", contractName: "NIL License Agreement", status: "Pending" },
                        { id: 2, description: "Media production time", progress: "0 of 6 hours", deadline: "Jan 30, 2027", contractId: "c1", contractName: "NIL License Agreement", status: "Pending" },
                        { id: 3, description: "In-person appearances", progress: "0 of 2", deadline: "Jan 30, 2027", contractId: "c1", contractName: "NIL License Agreement", status: "Pending" },
                        { id: 4, description: "Autographed items", progress: "0 of 200 items", deadline: "Jan 30, 2027", contractId: "c1", contractName: "NIL License Agreement", status: "Pending" },
                        { id: 5, description: "Game-day jersey signing", progress: "0 of 4 events", deadline: "Dec 15, 2026", contractId: "c1", contractName: "NIL License Agreement", status: "Pending" },
                        { id: 6, description: "Promotional video shoot", progress: "0 of 2 videos", deadline: "Sep 30, 2026", contractId: "c1", contractName: "NIL License Agreement", status: "Pending" },
                        { id: 7, description: "Charity event participation", progress: "0 of 1", deadline: "Nov 15, 2026", contractId: "c1", contractName: "NIL License Agreement", status: "Pending" },
                        { id: 8, description: "Brand ambassador training session", progress: "0 of 3 sessions", deadline: "Mar 30, 2026", contractId: "c1", contractName: "NIL License Agreement", status: "Pending" },
                      ]
                    : [
                        { id: 1, description: "Social media posts", progress: "0 of 4 posts", deadline: "Jun 30, 2026", contractId: "c1", contractName: activeContracts[0]?.sponsor || "Contract", status: "Pending" },
                        { id: 2, description: "Brand appearances", progress: "0 of 2", deadline: "Jun 30, 2026", contractId: "c1", contractName: activeContracts[0]?.sponsor || "Contract", status: "Pending" },
                      ]

                  const statusStyles: Record<string, string> = {
                    "Pending": "border-amber-300 text-amber-700 bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:bg-amber-950/30",
                    "In Progress": "border-blue-300 text-blue-700 bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:bg-blue-950/30",
                    "Complete": "border-emerald-300 text-emerald-700 bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:bg-emerald-950/30",
                    "Overdue": "border-red-300 text-red-700 bg-red-50 dark:border-red-700 dark:text-red-400 dark:bg-red-950/30",
                  }

                  return (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="pl-6 w-10">#</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Deadline</TableHead>
                          <TableHead>Contract</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deliverables.map((d) => (
                          <TableRow key={d.id}>
                            <TableCell className="pl-6 text-muted-foreground">{d.id}</TableCell>
                            <TableCell className="font-medium">{d.description}</TableCell>
                            <TableCell className="text-muted-foreground">{d.progress}</TableCell>
                            <TableCell className="text-muted-foreground">{d.deadline}</TableCell>
                            <TableCell>
                              <button
                                onClick={() => router.push(`/beneficiaries/${beneficiaryId}`)}
                                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                              >
                                {d.contractName}
                              </button>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`text-xs ${statusStyles[d.status]}`}>
                                {d.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )
                })()}
              </CardContent>
              <div className="px-6 py-3 border-t">
                <Button variant="link" className="w-full p-0 h-auto text-sm" onClick={() => setActiveTab("Deliverables")}>
                  View All Deliverables →
                </Button>
              </div>
            </Card>
          )}

            </>
          )}



        </div>

        {/* Right Column - Always Visible Account Cards */}
        <div className="lg:col-span-1 space-y-6">

          {/* Pending Deliverables - only on Overview tab */}
          {activeTab === "Overview" && pendingDeliverables.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Pending Deliverables
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {pendingDeliverables.length} task{pendingDeliverables.length > 1 ? "s" : ""} need attention
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingDeliverables.slice(0, 3).map((deliverable) => (
                    <div key={deliverable.id} className="p-4 rounded-lg border bg-card">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            {deliverable.status === "overdue" && (
                              <Badge variant="destructive" className="mb-2">
                                OVERDUE
                              </Badge>
                            )}
                            {deliverable.status === "due-soon" && (
                              <Badge
                                variant="secondary"
                                className="mb-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                              >
                                DUE THIS WEEK
                              </Badge>
                            )}
                            {deliverable.status === "upcoming" && (
                              <Badge variant="secondary" className="mb-2">
                                UPCOMING
                              </Badge>
                            )}
                            <h4 className="font-semibold">{deliverable.title}</h4>
                            {deliverable.status === "overdue" && (
                              <p className="text-sm text-red-600 dark:text-red-400">
                                Was due {deliverable.dueDate} ({deliverable.daysOverdue} days ago)
                              </p>
                            )}
                            {deliverable.status === "due-soon" && (
                              <p className="text-sm text-muted-foreground">
                                Due {deliverable.dueDate} ({deliverable.daysUntilDue} days)
                              </p>
                            )}
                            {deliverable.status === "upcoming" && (
                              <p className="text-sm text-muted-foreground">Due {deliverable.dueDate}</p>
                            )}
                            {deliverable.description && (
                              <p className="text-sm text-muted-foreground mt-1">{deliverable.description}</p>
                            )}
                            <p className="text-sm text-muted-foreground mt-1">
                              Contract:{" "}
                              <button
                                onClick={() => router.push(`/contracts/${deliverable.contractId}`)}
                                className="text-blue-600 hover:underline"
                              >
                                {deliverable.contractName}
                              </button>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendReminder(deliverable.id, deliverable.title)}
                            className="gap-1"
                          >
                            <Bell className="w-3 h-3" />
                            Send Reminder
                          </Button>
                          {deliverable.progress ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/contracts/${deliverable.contractId}`)}
                            >
                              View Progress
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/contracts/${deliverable.contractId}`)}
                            >
                              View Contract
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="link" className="w-full mt-4 p-0 h-auto text-sm" onClick={() => setActiveTab("Deliverables")}>
                  View All Deliverables →
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Payout Account Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Landmark className="w-5 h-5" />
                Payout Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Analog &middot; Huntington</p>
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-300 text-emerald-700 bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:bg-emerald-950/30"
                >
                  Active
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Available Balance</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  ${beneficiaryId === "osu-001" ? "145,834" : "0"}
                </p>
              </div>
              <div className="border-t pt-3">
                <p className="text-sm text-muted-foreground">
                  Last deposit: Feb 1, 2026 &middot; $14,000
                </p>
              </div>
              <Button className="w-full gap-2">
                <Send className="w-4 h-4" />
                Initiate Transfer
              </Button>
              <button className="w-full text-center text-sm text-blue-600 hover:underline dark:text-blue-400">
                View Transaction History
              </button>
            </CardContent>
          </Card>

          {/* Connected Bank Account Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Connected Bank Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border flex items-center justify-center bg-muted/30">
                    <Landmark className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">Chase</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {"••••4521"}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-300 text-emerald-700 bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:bg-emerald-950/30"
                >
                  Connected
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Account Type</p>
                  <p className="text-sm font-medium">Checking</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Connection</p>
                  <p className="text-sm font-medium flex items-center gap-1">
                    Plaid
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </p>
                </div>
              </div>
              <div className="border-t pt-3">
                <p className="text-sm text-muted-foreground">
                  Linked on: Dec 15, 2025
                </p>
              </div>
              <button className="w-full text-center text-sm text-blue-600 hover:underline dark:text-blue-400">
                Manage Connection
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
      )}

      <Dialog open={showEditProfileModal} onOpenChange={setShowEditProfileModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update athlete profile information</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={editProfileForm.firstName}
                onChange={(e) => setEditProfileForm({ ...editProfileForm, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                value={editProfileForm.middleName}
                onChange={(e) => setEditProfileForm({ ...editProfileForm, middleName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={editProfileForm.lastName}
                onChange={(e) => setEditProfileForm({ ...editProfileForm, lastName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="suffix">Suffix</Label>
              <Input
                id="suffix"
                value={editProfileForm.suffix}
                onChange={(e) => setEditProfileForm({ ...editProfileForm, suffix: e.target.value })}
                placeholder="Jr., Sr., III, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sport">Sport</Label>
              <Select
                value={editProfileForm.sport}
                onValueChange={(value) => setEditProfileForm({ ...editProfileForm, sport: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Football">Football</SelectItem>
                  <SelectItem value="Basketball">Basketball</SelectItem>
                  <SelectItem value="Baseball">Baseball</SelectItem>
                  <SelectItem value="Soccer">Soccer</SelectItem>
                  <SelectItem value="Track & Field">Track & Field</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={editProfileForm.position}
                onChange={(e) => setEditProfileForm({ ...editProfileForm, position: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="graduatingClass">Graduating Class</Label>
              <Select
                value={editProfileForm.graduatingClass}
                onValueChange={(value) => setEditProfileForm({ ...editProfileForm, graduatingClass: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2027">2027</SelectItem>
                  <SelectItem value="2028">2028</SelectItem>
                  <SelectItem value="2029">2029</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editProfileForm.email}
                onChange={(e) => setEditProfileForm({ ...editProfileForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={editProfileForm.phone}
                onChange={(e) => setEditProfileForm({ ...editProfileForm, phone: e.target.value })}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={editProfileForm.street}
                onChange={(e) => setEditProfileForm({ ...editProfileForm, street: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={editProfileForm.city}
                onChange={(e) => setEditProfileForm({ ...editProfileForm, city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={editProfileForm.state}
                onChange={(e) => setEditProfileForm({ ...editProfileForm, state: e.target.value })}
                maxLength={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input
                id="zip"
                value={editProfileForm.zip}
                onChange={(e) => setEditProfileForm({ ...editProfileForm, zip: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditProfileModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Account Onboarding Modal */}
      <Dialog open={onboardingModalOpen} onOpenChange={setOnboardingModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Account Onboarding</DialogTitle>
            <DialogDescription>
              {"Verify the student's .edu email address and confirm onboarding for "}
              {beneficiary.firstName} {beneficiary.lastName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="onboarding-email">Student .edu Email Address</Label>
              <Input
                id="onboarding-email"
                type="email"
                placeholder="student@university.edu"
                value={onboardingEmail}
                onChange={(e) => setOnboardingEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {"This must match the student's verified university email."}
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-md border p-3">
              <input
                type="checkbox"
                id="onboarding-confirm"
                checked={onboardingConfirmed}
                onChange={(e) => setOnboardingConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="onboarding-confirm" className="text-sm leading-snug">
                I confirm that I am an authorized university administrator and would like
                to initiate payout account onboarding for this student-athlete.
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOnboardingModalOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!onboardingEmail.endsWith(".edu") || !onboardingConfirmed}
              onClick={() => {
                toast({
                  title: "Onboarding request sent",
                  description: `Account onboarding initiated for ${beneficiary.firstName} ${beneficiary.lastName} at ${onboardingEmail}.`,
                })
                setOnboardingModalOpen(false)
              }}
            >
              <Send className="w-4 h-4 mr-2" />
              Send Onboarding Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditRepresentationModal} onOpenChange={setShowEditRepresentationModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Representation</DialogTitle>
            <DialogDescription>Update agency and agent information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Agency</Label>
              <Popover open={agencySearchOpen} onOpenChange={setAgencySearchOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between bg-transparent">
                    {editRepresentationForm.agency || "Select agency..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search agencies..." />
                    <CommandList>
                      <CommandEmpty>
                        <div className="text-sm text-muted-foreground p-2">
                          No agency found.
                          <Button
                            variant="link"
                            size="sm"
                            className="ml-1 h-auto p-0"
                            onClick={() => {
                              setShowAddAgency(true)
                              setAgencySearchOpen(false)
                            }}
                          >
                            Add new agency
                          </Button>
                        </div>
                      </CommandEmpty>
                      <CommandGroup>
                        {mockAgencies.map((agency) => (
                          <CommandItem
                            key={agency.id}
                            value={agency.name}
                            onSelect={() => {
                              setEditRepresentationForm({
                                ...editRepresentationForm,
                                agency: agency.name,
                                agencyWebsite: agency.website,
                                agencyEmail: agency.email,
                              })
                              setAgencySearchOpen(false)
                            }}
                          >
                            {agency.name}
                          </CommandItem>
                        ))}
                        <CommandItem
                          onSelect={() => {
                            setShowAddAgency(true)
                            setAgencySearchOpen(false)
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add new agency
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {showAddAgency && (
              <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium">New Agency Details</p>
                <div className="space-y-2">
                  <Label htmlFor="agencyWebsite">Website (optional)</Label>
                  <Input
                    id="agencyWebsite"
                    value={editRepresentationForm.agencyWebsite}
                    onChange={(e) =>
                      setEditRepresentationForm({ ...editRepresentationForm, agencyWebsite: e.target.value })
                    }
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agencyEmail">Primary Email (optional)</Label>
                  <Input
                    id="agencyEmail"
                    type="email"
                    value={editRepresentationForm.agencyEmail}
                    onChange={(e) =>
                      setEditRepresentationForm({ ...editRepresentationForm, agencyEmail: e.target.value })
                    }
                    placeholder="info@agency.com"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <Label>Agent</Label>
              <Popover open={agentSearchOpen} onOpenChange={setAgentSearchOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between bg-transparent">
                    {editRepresentationForm.agent || "Select agent..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search agents..." />
                    <CommandList>
                      <CommandEmpty>
                        <div className="text-sm text-muted-foreground p-2">
                          No agent found.
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => {
                              setShowAddAgent(true)
                              setAgentSearchOpen(false)
                            }}
                          >
                            Add new agent
                          </Button>
                        </div>
                      </CommandEmpty>
                      <CommandGroup>
                        {mockAgents
                          .filter(
                            (agent) => !editRepresentationForm.agency || agent.agency === editRepresentationForm.agency,
                          )
                          .map((agent) => (
                            <CommandItem
                              key={agent.id}
                              value={agent.name}
                              onSelect={() => {
                                setEditRepresentationForm({
                                  ...editRepresentationForm,
                                  agent: agent.name,
                                  agentEmail: agent.email,
                                  agentPhone: agent.phone,
                                })
                                setAgentSearchOpen(false)
                              }}
                            >
                              <div>
                                <div>{agent.name}</div>
                                <div className="text-xs text-muted-foreground">{agent.agency}</div>
                              </div>
                            </CommandItem>
                          ))}
                        <CommandItem
                          onSelect={() => {
                            setShowAddAgent(true)
                            setAgentSearchOpen(false)
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add new agent
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {showAddAgent && (
              <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium">New Agent Details</p>
                <div className="space-y-2">
                  <Label htmlFor="agentEmail">Email (optional)</Label>
                  <Input
                    id="agentEmail"
                    type="email"
                    value={editRepresentationForm.agentEmail}
                    onChange={(e) =>
                      setEditRepresentationForm({ ...editRepresentationForm, agentEmail: e.target.value })
                    }
                    placeholder="agent@agency.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agentPhone">Phone (optional)</Label>
                  <Input
                    id="agentPhone"
                    type="tel"
                    value={editRepresentationForm.agentPhone}
                    onChange={(e) =>
                      setEditRepresentationForm({ ...editRepresentationForm, agentPhone: e.target.value })
                    }
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditRepresentationModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRepresentation}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function BeneficiaryDetailManagement({ beneficiaryId }: BeneficiaryDetailManagementProps) {
  return (
  <ContractWorkflowProvider>
    <BuildContractProvider>
      <BeneficiaryDetailManagementInner beneficiaryId={beneficiaryId} />
    </BuildContractProvider>
  </ContractWorkflowProvider>
  )
  }

export default BeneficiaryDetailManagement
