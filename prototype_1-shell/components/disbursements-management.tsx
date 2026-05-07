"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
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
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Calendar,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  CalendarClock,
  Users,
  Banknote,
  Filter,
  Loader2,
  RefreshCw,
  MoreHorizontal,
  Eye,
  PauseCircle,
  XCircle,
  ArrowUpRight,
  FileText,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Target,
  DollarSign,
} from "lucide-react"
import { ResponsiveContainer, XAxis, YAxis, AreaChart, Area, Tooltip as RechartsTooltip } from "recharts"

// Types for clarity
type PaymentType = "revenue_share" | "conditional"
type PaymentStatus = "pending_confirmation" | "ready_for_release" | "processing" | "complete" | "scheduled" | "on_hold" | "canceled"

interface Payment {
  id: number
  athlete: string
  sport: string
  amount: number
  description: string
  contractId: string
  contractTitle: string
  dueDate: string
  type: PaymentType
  status: PaymentStatus
  // For revenue share
  eligibilityConfirmed?: boolean
  // For deliverable-based
  deliverableCondition?: string
  completionConfirmed?: boolean
  // For history
  releasedDate?: string
  confirmedBy?: string
  completedDate?: string
  // For processing
  processingStarted?: string
  // Destination account (last 4 digits)
  destinationAccount?: string
  // For hold/cancel/deny
  holdReason?: string
  cancelReason?: string
  denyReason?: string
}

// Disbursement timeline data
const disbursementData = [
  { period: "Jan 1", actual: 0, projected: 0 },
  { period: "Jan 15", actual: 425000, projected: 425000 },
  { period: "Feb 1", actual: 380000, projected: 380000 },
  { period: "Feb 15", actual: 520000, projected: 520000 },
  { period: "Mar 1", actual: 445000, projected: 445000 },
  { period: "Mar 15", actual: 390000, projected: 390000 },
  { period: "Apr 1", actual: 485000, projected: 485000 },
  { period: "Apr 15", actual: 520000, projected: 520000 },
  { period: "May 1", actual: 465000, projected: 465000 },
  { period: "May 15", actual: 510000, projected: 510000 },
  { period: "Jun 1", actual: 485000, projected: 485000 },
  { period: "Jun 15", actual: 575000, projected: 575000 },
  { period: "Jul 1", actual: null, projected: 485000 },
  { period: "Jul 15", actual: null, projected: 520000 },
  { period: "Aug 1", actual: null, projected: 565000 },
  { period: "Aug 15", actual: null, projected: 610000 },
  { period: "Sep 1", actual: null, projected: 545000 },
  { period: "Sep 15", actual: null, projected: 580000 },
  { period: "Oct 1", actual: null, projected: 625000 },
  { period: "Oct 15", actual: null, projected: 590000 },
  { period: "Nov 1", actual: null, projected: 535000 },
  { period: "Nov 15", actual: null, projected: 485000 },
  { period: "Dec 1", actual: null, projected: 420000 },
  { period: "Dec 15", actual: null, projected: 380000 },
]

const formatCurrency = (amount: number | null) => {
  if (amount === null) return "$0"
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
  return `$${amount.toLocaleString()}`
}

// Initial mock data - Revenue Share (RevShare Payroll)
const initialRevenueSharePayments: Payment[] = [
  // Pending Confirmation
  {
    id: 1,
    athlete: "Marcus Williams",
    sport: "Football",
    amount: 12500,
    description: "Monthly License Fee - Mar 2026",
    contractId: "osu-001",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-17",
    type: "revenue_share",
    status: "pending_confirmation",
    eligibilityConfirmed: false,
  },
  {
    id: 2,
    athlete: "Darius Thornton",
    sport: "Football",
    amount: 9500,
    description: "Monthly License Fee - Mar 2026",
    contractId: "osu-002",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-17",
    type: "revenue_share",
    status: "pending_confirmation",
    eligibilityConfirmed: false,
  },
  {
    id: 6,
    athlete: "Cameron Reid",
    sport: "Football",
    amount: 8000,
    description: "Monthly License Fee - Mar 2026",
    contractId: "osu-003",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-17",
    type: "revenue_share",
    status: "pending_confirmation",
    eligibilityConfirmed: false,
  },
  {
    id: 7,
    athlete: "Devon Mitchell",
    sport: "Football",
    amount: 7500,
    description: "Monthly License Fee - Mar 2026",
    contractId: "osu-005",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-17",
    type: "revenue_share",
    status: "pending_confirmation",
    eligibilityConfirmed: false,
  },
  {
    id: 10,
    athlete: "Quincy Adams",
    sport: "Football",
    amount: 6500,
    description: "Monthly License Fee - Mar 2026",
    contractId: "osu-009",
    contractTitle: "Roster Retention Package",
    dueDate: "2026-03-17",
    type: "revenue_share",
    status: "pending_confirmation",
    eligibilityConfirmed: false,
  },
  {
    id: 11,
    athlete: "Terrell Washington",
    sport: "Football",
    amount: 8500,
    description: "Monthly License Fee - Mar 2026",
    contractId: "osu-010",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-17",
    type: "revenue_share",
    status: "pending_confirmation",
    eligibilityConfirmed: false,
  },
  {
    id: 12,
    athlete: "Jordan Hayes",
    sport: "Basketball",
    amount: 5000,
    description: "Monthly License Fee - Mar 2026",
    contractId: "osu-007",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-17",
    type: "revenue_share",
    status: "pending_confirmation",
    eligibilityConfirmed: false,
  },
  {
    id: 13,
    athlete: "DeShawn Porter",
    sport: "Football",
    amount: 7000,
    description: "Monthly License Fee - Mar 2026",
    contractId: "osu-012",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-17",
    type: "revenue_share",
    status: "pending_confirmation",
    eligibilityConfirmed: false,
  },
  {
    id: 14,
    athlete: "Michael Chen",
    sport: "Baseball",
    amount: 4500,
    description: "Monthly License Fee - Mar 2026",
    contractId: "osu-014",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-17",
    type: "revenue_share",
    status: "pending_confirmation",
    eligibilityConfirmed: false,
  },
  {
    id: 15,
    athlete: "Brandon Scott",
    sport: "Football",
    amount: 9000,
    description: "Monthly License Fee - Mar 2026",
    contractId: "osu-015",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-17",
    type: "revenue_share",
    status: "pending_confirmation",
    eligibilityConfirmed: false,
  },
  // Ready for Release
  {
    id: 3,
    athlete: "Jaylen Carter",
    sport: "Basketball",
    amount: 7000,
    description: "Monthly License Fee - Mar 2026",
    contractId: "osu-006",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-17",
    type: "revenue_share",
    status: "ready_for_release",
    eligibilityConfirmed: true,
  },
  {
    id: 4,
    athlete: "Aiden Brooks",
    sport: "Football",
    amount: 6000,
    description: "Monthly License Fee - Mar 2026",
    contractId: "osu-004",
    contractTitle: "Transfer Portal - Rev Share",
    dueDate: "2026-03-17",
    type: "revenue_share",
    status: "ready_for_release",
    eligibilityConfirmed: true,
  },
  {
    id: 5,
    athlete: "Tyrell Jackson",
    sport: "Basketball",
    amount: 5500,
    description: "Monthly License Fee - Mar 2026",
    contractId: "osu-008",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-17",
    type: "revenue_share",
    status: "ready_for_release",
    eligibilityConfirmed: true,
  },
  {
    id: 16,
    athlete: "Xavier Thompson",
    sport: "Football",
    amount: 8500,
    description: "Monthly License Fee - Mar 2026",
    contractId: "osu-011",
    contractTitle: "Transfer Portal - Rev Share",
    dueDate: "2026-03-17",
    type: "revenue_share",
    status: "ready_for_release",
    eligibilityConfirmed: true,
  },
  {
    id: 17,
    athlete: "Chris Martinez",
    sport: "Football",
    amount: 7500,
    description: "Monthly License Fee - Mar 2026",
    contractId: "osu-014",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-17",
    type: "revenue_share",
    status: "ready_for_release",
    eligibilityConfirmed: true,
  },
  {
    id: 18,
    athlete: "Eric Johnson",
    sport: "Basketball",
    amount: 6000,
    description: "Monthly License Fee - Mar 2026",
    contractId: "osu-007",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-17",
    type: "revenue_share",
    status: "ready_for_release",
    eligibilityConfirmed: true,
  },
  // Upcoming scheduled - April
  {
    id: 8,
    athlete: "Marcus Williams",
    sport: "Football",
    amount: 12500,
    description: "Monthly License Fee - Apr 2026",
    contractId: "osu-001",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-04-01",
    type: "revenue_share",
    status: "scheduled",
  },
  {
    id: 9,
    athlete: "Darius Thornton",
    sport: "Football",
    amount: 9500,
    description: "Monthly License Fee - Apr 2026",
    contractId: "osu-002",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-04-01",
    type: "revenue_share",
    status: "scheduled",
  },
  {
    id: 19,
    athlete: "Jaylen Carter",
    sport: "Basketball",
    amount: 7000,
    description: "Monthly License Fee - Apr 2026",
    contractId: "osu-006",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-04-01",
    type: "revenue_share",
    status: "scheduled",
  },
  {
    id: 20,
    athlete: "Cameron Reid",
    sport: "Football",
    amount: 8000,
    description: "Monthly License Fee - Apr 2026",
    contractId: "osu-003",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-04-01",
    type: "revenue_share",
    status: "scheduled",
  },
  {
    id: 21,
    athlete: "Aiden Brooks",
    sport: "Football",
    amount: 6000,
    description: "Monthly License Fee - Apr 2026",
    contractId: "osu-004",
    contractTitle: "Transfer Portal - Rev Share",
    dueDate: "2026-04-01",
    type: "revenue_share",
    status: "scheduled",
  },
  {
    id: 22,
    athlete: "Tyrell Jackson",
    sport: "Basketball",
    amount: 5500,
    description: "Monthly License Fee - Apr 2026",
    contractId: "osu-008",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-04-01",
    type: "revenue_share",
    status: "scheduled",
  },
  {
    id: 23,
    athlete: "Devon Mitchell",
    sport: "Football",
    amount: 7500,
    description: "Monthly License Fee - Apr 2026",
    contractId: "osu-005",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-04-01",
    type: "revenue_share",
    status: "scheduled",
  },
  {
    id: 24,
    athlete: "Quincy Adams",
    sport: "Football",
    amount: 6500,
    description: "Monthly License Fee - Apr 2026",
    contractId: "osu-009",
    contractTitle: "Roster Retention Package",
    dueDate: "2026-04-01",
    type: "revenue_share",
    status: "scheduled",
  },
  {
    id: 25,
    athlete: "Terrell Washington",
    sport: "Football",
    amount: 8500,
    description: "Monthly License Fee - Apr 2026",
    contractId: "osu-010",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-04-01",
    type: "revenue_share",
    status: "scheduled",
  },
  {
    id: 26,
    athlete: "Jordan Hayes",
    sport: "Basketball",
    amount: 5000,
    description: "Monthly License Fee - Apr 2026",
    contractId: "osu-007",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-04-01",
    type: "revenue_share",
    status: "scheduled",
  },
  {
    id: 27,
    athlete: "Xavier Thompson",
    sport: "Football",
    amount: 8500,
    description: "Monthly License Fee - Apr 2026",
    contractId: "osu-011",
    contractTitle: "Transfer Portal - Rev Share",
    dueDate: "2026-04-01",
    type: "revenue_share",
    status: "scheduled",
  },
  {
    id: 28,
    athlete: "Chris Martinez",
    sport: "Football",
    amount: 7500,
    description: "Monthly License Fee - Apr 2026",
    contractId: "osu-014",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-04-01",
    type: "revenue_share",
    status: "scheduled",
  },
  // May scheduled
  {
    id: 29,
    athlete: "Marcus Williams",
    sport: "Football",
    amount: 12500,
    description: "Monthly License Fee - May 2026",
    contractId: "osu-001",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-05-01",
    type: "revenue_share",
    status: "scheduled",
  },
  {
    id: 30,
    athlete: "Darius Thornton",
    sport: "Football",
    amount: 9500,
    description: "Monthly License Fee - May 2026",
    contractId: "osu-002",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-05-01",
    type: "revenue_share",
    status: "scheduled",
  },
  {
    id: 31,
    athlete: "Jaylen Carter",
    sport: "Basketball",
    amount: 7000,
    description: "Monthly License Fee - May 2026",
    contractId: "osu-006",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-05-01",
    type: "revenue_share",
    status: "scheduled",
  },
  // June scheduled
  {
    id: 40,
    athlete: "Marcus Williams",
    sport: "Football",
    amount: 12500,
    description: "Monthly License Fee - Jun 2026",
    contractId: "osu-001",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-06-01",
    type: "revenue_share",
    status: "scheduled",
  },
  {
    id: 41,
    athlete: "Darius Thornton",
    sport: "Football",
    amount: 9500,
    description: "Monthly License Fee - Jun 2026",
    contractId: "osu-002",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-06-01",
    type: "revenue_share",
    status: "scheduled",
  },
]

// Initial mock data - Conditional Performance Pay
const initialDeliverablePayments: Payment[] = [
  // Pending Confirmation
  {
    id: 101,
    athlete: "Marcus Williams",
    sport: "Football",
    amount: 5000,
    description: "Social Media Campaign - Spring Launch",
    contractId: "osu-001",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-17",
    type: "conditional",
    status: "pending_confirmation",
    deliverableCondition: "Post 3 Instagram stories featuring sponsor product",
    completionConfirmed: false,
  },
  {
    id: 103,
    athlete: "Aiden Brooks",
    sport: "Football",
    amount: 1500,
    description: "Media Appearance - Local TV",
    contractId: "osu-004",
    contractTitle: "Transfer Portal - Rev Share",
    dueDate: "2026-03-17",
    type: "conditional",
    status: "pending_confirmation",
    deliverableCondition: "Appear on Good Morning Columbus for 10-minute interview",
    completionConfirmed: false,
  },
  {
    id: 104,
    athlete: "Tyrell Jackson",
    sport: "Basketball",
    amount: 3000,
    description: "Youth Basketball Clinic",
    contractId: "osu-008",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-18",
    type: "conditional",
    status: "pending_confirmation",
    deliverableCondition: "Host 2-hour youth clinic at community center",
    completionConfirmed: false,
  },
  {
    id: 105,
    athlete: "Cameron Reid",
    sport: "Football",
    amount: 2500,
    description: "Podcast Appearance",
    contractId: "osu-003",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-16",
    type: "conditional",
    status: "pending_confirmation",
    deliverableCondition: "Record 45-minute podcast episode with Buckeye Talk",
    completionConfirmed: false,
  },
  {
    id: 106,
    athlete: "Jaylen Carter",
    sport: "Basketball",
    amount: 4000,
    description: "Brand Ambassador - Q1",
    contractId: "osu-006",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-17",
    type: "conditional",
    status: "pending_confirmation",
    deliverableCondition: "Complete quarterly brand ambassador obligations",
    completionConfirmed: false,
  },
  // Ready for Release
  {
    id: 102,
    athlete: "Jaylen Carter",
    sport: "Basketball",
    amount: 2500,
    description: "Autograph Session - Fan Event",
    contractId: "osu-006",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-15",
    type: "conditional",
    status: "ready_for_release",
    deliverableCondition: "Attend 2-hour autograph session at Schottenstein Center",
    completionConfirmed: true,
  },
  {
    id: 107,
    athlete: "Devon Mitchell",
    sport: "Football",
    amount: 2000,
    description: "Charity Golf Event",
    contractId: "osu-005",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-14",
    type: "conditional",
    status: "ready_for_release",
    deliverableCondition: "Participate in OSU charity golf tournament",
    completionConfirmed: true,
  },
  {
    id: 108,
    athlete: "Quincy Adams",
    sport: "Football",
    amount: 1800,
    description: "School Visit - Columbus City Schools",
    contractId: "osu-009",
    contractTitle: "Roster Retention Package",
    dueDate: "2026-03-13",
    type: "conditional",
    status: "ready_for_release",
    deliverableCondition: "Visit elementary school for reading program",
    completionConfirmed: true,
  },
  {
    id: 109,
    athlete: "Brandon Scott",
    sport: "Football",
    amount: 3500,
    description: "Commercial Shoot",
    contractId: "osu-015",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-12",
    type: "conditional",
    status: "ready_for_release",
    deliverableCondition: "Complete video commercial for local dealership",
    completionConfirmed: true,
  },
  // More pending confirmation items for pagination demo
  {
    id: 110,
    athlete: "Darius Thornton",
    sport: "Football",
    amount: 3500,
    description: "Social Media Post - Gameday",
    contractId: "osu-002",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-18",
    type: "conditional",
    status: "pending_confirmation",
    deliverableCondition: "Post gameday hype video on Instagram with #GoBucks",
    completionConfirmed: false,
  },
  {
    id: 111,
    athlete: "Andre Williams",
    sport: "Basketball",
    amount: 2000,
    description: "Fan Meet & Greet",
    contractId: "osu-007",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-19",
    type: "conditional",
    status: "pending_confirmation",
    deliverableCondition: "Attend 1-hour meet and greet at local sports store",
    completionConfirmed: false,
  },
  {
    id: 112,
    athlete: "Quincy Adams",
    sport: "Football",
    amount: 4500,
    description: "NIL Appearance - Car Dealership",
    contractId: "osu-009",
    contractTitle: "Roster Retention Package",
    dueDate: "2026-03-20",
    type: "conditional",
    status: "pending_confirmation",
    deliverableCondition: "Appear at dealership grand opening for 3 hours",
    completionConfirmed: false,
  },
  {
    id: 113,
    athlete: "Terrell Washington",
    sport: "Football",
    amount: 1800,
    description: "Video Message - Sponsor",
    contractId: "osu-010",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-17",
    type: "conditional",
    status: "pending_confirmation",
    deliverableCondition: "Record 30-second thank you video for sponsor social media",
    completionConfirmed: false,
  },
  {
    id: 114,
    athlete: "Xavier Thompson",
    sport: "Football",
    amount: 2800,
    description: "Podcast Guest Appearance",
    contractId: "osu-011",
    contractTitle: "Transfer Portal - Rev Share",
    dueDate: "2026-03-21",
    type: "conditional",
    status: "pending_confirmation",
    deliverableCondition: "Guest on Eleven Warriors podcast for 30 minutes",
    completionConfirmed: false,
  },
  {
    id: 115,
    athlete: "Tyler Robinson",
    sport: "Football",
    amount: 3200,
    description: "Charity Event - Children's Hospital",
    contractId: "osu-012",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-22",
    type: "conditional",
    status: "pending_confirmation",
    deliverableCondition: "Visit Nationwide Children's Hospital for patient meet",
    completionConfirmed: false,
  },
  {
    id: 116,
    athlete: "Brandon Lewis",
    sport: "Football",
    amount: 1500,
    description: "Social Media - Training Content",
    contractId: "osu-014",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-18",
    type: "conditional",
    status: "pending_confirmation",
    deliverableCondition: "Post 3 training videos on TikTok with sponsor gear",
    completionConfirmed: false,
  },
  {
    id: 117,
    athlete: "Marcus Johnson",
    sport: "Football",
    amount: 2200,
    description: "Radio Interview",
    contractId: "osu-015",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-19",
    type: "conditional",
    status: "pending_confirmation",
    deliverableCondition: "15-minute phone interview with 97.1 The Fan",
    completionConfirmed: false,
  },
  {
    id: 118,
    athlete: "Devon Mitchell",
    sport: "Football",
    amount: 5500,
    description: "Brand Partnership - Q1 Deliverables",
    contractId: "osu-005",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-23",
    type: "conditional",
    status: "pending_confirmation",
    deliverableCondition: "Complete all Q1 content obligations per sponsorship agreement",
    completionConfirmed: false,
  },
  {
    id: 119,
    athlete: "Jaylen Carter",
    sport: "Basketball",
    amount: 3000,
    description: "Youth Clinic - Spring Break",
    contractId: "osu-006",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-24",
    type: "conditional",
    status: "pending_confirmation",
    deliverableCondition: "Lead 2-hour basketball skills clinic for ages 8-12",
    completionConfirmed: false,
  },
  {
    id: 120,
    athlete: "Tyrell Jackson",
    sport: "Basketball",
    amount: 1800,
    description: "Photo Shoot - Media Day",
    contractId: "osu-008",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-20",
    type: "conditional",
    status: "pending_confirmation",
    deliverableCondition: "Attend 1-hour photo shoot for promotional materials",
    completionConfirmed: false,
  },
  {
    id: 121,
    athlete: "Aiden Brooks",
    sport: "Football",
    amount: 4000,
    description: "NIL Event - Restaurant Opening",
    contractId: "osu-004",
    contractTitle: "Transfer Portal - Rev Share",
    dueDate: "2026-03-25",
    type: "conditional",
    status: "pending_confirmation",
    deliverableCondition: "Attend restaurant soft opening and take photos with fans",
    completionConfirmed: false,
  },
  {
    id: 122,
    athlete: "Cameron Reid",
    sport: "Football",
    amount: 2600,
    description: "Social Campaign - March Madness",
    contractId: "osu-003",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-26",
    type: "conditional",
    status: "pending_confirmation",
    deliverableCondition: "Post 5 bracket-related content pieces during tournament",
    completionConfirmed: false,
  },
  {
    id: 123,
    athlete: "Marcus Williams",
    sport: "Football",
    amount: 6000,
    description: "Spring Game Promo",
    contractId: "osu-001",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-27",
    type: "conditional",
    status: "pending_confirmation",
    deliverableCondition: "Record video promoting spring game ticket sales",
    completionConfirmed: false,
  },
  {
    id: 124,
    athlete: "Darius Thornton",
    sport: "Football",
    amount: 2400,
    description: "Campus Tour Content",
    contractId: "osu-002",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-28",
    type: "conditional",
    status: "pending_confirmation",
    deliverableCondition: "Film day-in-the-life campus tour video for recruit website",
    completionConfirmed: false,
  },
]

// Processing payments (in-flight)
const initialProcessingPayments: Payment[] = [
  {
    id: 301,
    athlete: "Tyler Robinson",
    sport: "Football",
    amount: 8000,
    description: "Monthly License Fee - Mar 2026",
    contractId: "osu-012",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-15",
    type: "revenue_share",
    status: "processing",
    processingStarted: "2026-03-16",
    confirmedBy: "Sarah Johnson",
    destinationAccount: "4829",
  },
  {
    id: 302,
    athlete: "Andre Williams",
    sport: "Basketball",
    amount: 6500,
    description: "Monthly License Fee - Mar 2026",
    contractId: "osu-007",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-03-15",
    type: "revenue_share",
    status: "processing",
    processingStarted: "2026-03-16",
    confirmedBy: "Mike Thompson",
    destinationAccount: "7156",
  },
  {
    id: 303,
    athlete: "Kevin Thompson",
    sport: "Football",
    amount: 2200,
    description: "Community Event Appearance",
    contractId: "osu-013",
    contractTitle: "Roster Retention Package",
    dueDate: "2026-03-14",
    type: "conditional",
    status: "processing",
    processingStarted: "2026-03-16",
    confirmedBy: "Sarah Johnson",
    destinationAccount: "3891",
  },
]

// Mock complete/history data
const initialCompletePayments: Payment[] = [
  {
    id: 201,
    athlete: "Marcus Williams",
    sport: "Football",
    amount: 12500,
    description: "Monthly License Fee - Feb 2026",
    contractId: "osu-001",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-02-15",
    type: "revenue_share",
    status: "complete",
    releasedDate: "2026-02-15",
    completedDate: "2026-02-16",
    confirmedBy: "Sarah Johnson",
    destinationAccount: "5247",
  },
  {
    id: 202,
    athlete: "Darius Thornton",
    sport: "Football",
    amount: 9500,
    description: "Monthly License Fee - Feb 2026",
    contractId: "osu-002",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-02-15",
    type: "revenue_share",
    status: "complete",
    releasedDate: "2026-02-15",
    completedDate: "2026-02-16",
    confirmedBy: "Sarah Johnson",
    destinationAccount: "8163",
  },
  {
    id: 203,
    athlete: "Jaylen Carter",
    sport: "Basketball",
    amount: 7000,
    description: "Monthly License Fee - Feb 2026",
    contractId: "osu-006",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-02-15",
    type: "revenue_share",
    status: "complete",
    releasedDate: "2026-02-15",
    completedDate: "2026-02-16",
    confirmedBy: "Mike Thompson",
    destinationAccount: "4592",
  },
  {
    id: 204,
    athlete: "Cameron Reid",
    sport: "Football",
    amount: 8000,
    description: "Monthly License Fee - Feb 2026",
    contractId: "osu-003",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-02-15",
    type: "revenue_share",
    status: "complete",
    releasedDate: "2026-02-16",
    completedDate: "2026-02-17",
    confirmedBy: "Sarah Johnson",
    destinationAccount: "7328",
  },
  {
    id: 205,
    athlete: "Marcus Williams",
    sport: "Football",
    amount: 3500,
    description: "Super Bowl Watch Party Appearance",
    contractId: "osu-001",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-02-09",
    type: "conditional",
    status: "complete",
    releasedDate: "2026-02-10",
    completedDate: "2026-02-11",
    confirmedBy: "Sarah Johnson",
    destinationAccount: "5247",
  },
  {
    id: 206,
    athlete: "Aiden Brooks",
    sport: "Football",
    amount: 6000,
    description: "Monthly License Fee - Feb 2026",
    contractId: "osu-004",
    contractTitle: "Transfer Portal - Rev Share",
    dueDate: "2026-02-15",
    type: "revenue_share",
    status: "complete",
    releasedDate: "2026-02-15",
    completedDate: "2026-02-16",
    confirmedBy: "Mike Thompson",
    destinationAccount: "9471",
  },
  {
    id: 207,
    athlete: "Tyrell Jackson",
    sport: "Basketball",
    amount: 5500,
    description: "Monthly License Fee - Feb 2026",
    contractId: "osu-008",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-02-15",
    type: "revenue_share",
    status: "complete",
    releasedDate: "2026-02-15",
    completedDate: "2026-02-16",
    confirmedBy: "Mike Thompson",
    destinationAccount: "2856",
  },
  {
    id: 208,
    athlete: "Devon Mitchell",
    sport: "Football",
    amount: 7500,
    description: "Monthly License Fee - Feb 2026",
    contractId: "osu-005",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-02-15",
    type: "revenue_share",
    status: "complete",
    releasedDate: "2026-02-16",
    completedDate: "2026-02-17",
    confirmedBy: "Sarah Johnson",
    destinationAccount: "6139",
  },
  {
    id: 209,
    athlete: "Jaylen Carter",
    sport: "Basketball",
    amount: 2000,
    description: "Community Event - Boys & Girls Club",
    contractId: "osu-006",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-02-08",
    type: "conditional",
    status: "complete",
    releasedDate: "2026-02-09",
    completedDate: "2026-02-10",
    confirmedBy: "Mike Thompson",
    destinationAccount: "4592",
  },
  {
    id: 210,
    athlete: "Quincy Adams",
    sport: "Football",
    amount: 6500,
    description: "Monthly License Fee - Feb 2026",
    contractId: "osu-009",
    contractTitle: "Roster Retention Package",
    dueDate: "2026-02-15",
    type: "revenue_share",
    status: "complete",
    releasedDate: "2026-02-15",
    completedDate: "2026-02-16",
    confirmedBy: "Sarah Johnson",
    destinationAccount: "3284",
  },
  // January payments
  {
    id: 213,
    athlete: "Marcus Williams",
    sport: "Football",
    amount: 12500,
    description: "Monthly License Fee - Jan 2026",
    contractId: "osu-001",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-01-15",
    type: "revenue_share",
    status: "complete",
    releasedDate: "2026-01-15",
    completedDate: "2026-01-16",
    confirmedBy: "Sarah Johnson",
    destinationAccount: "5247",
  },
  {
    id: 214,
    athlete: "Darius Thornton",
    sport: "Football",
    amount: 9500,
    description: "Monthly License Fee - Jan 2026",
    contractId: "osu-002",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-01-15",
    type: "revenue_share",
    status: "complete",
    releasedDate: "2026-01-15",
    completedDate: "2026-01-16",
    confirmedBy: "Sarah Johnson",
    destinationAccount: "8163",
  },
  {
    id: 215,
    athlete: "Jaylen Carter",
    sport: "Basketball",
    amount: 7000,
    description: "Monthly License Fee - Jan 2026",
    contractId: "osu-006",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-01-15",
    type: "revenue_share",
    status: "complete",
    releasedDate: "2026-01-15",
    completedDate: "2026-01-16",
    confirmedBy: "Mike Thompson",
  },
]

// On hold payments
const initialOnHoldPayments: Payment[] = [
  {
    id: 401,
    athlete: "Jake Morrison",
    sport: "Football",
    amount: 5500,
    description: "Monthly License Fee - Mar 2026",
    contractId: "osu-013",
    contractTitle: "Roster Retention Package",
    dueDate: "2026-03-15",
    type: "revenue_share",
    status: "on_hold",
    holdReason: "Academic eligibility under review",
  },
]

// Canceled payments
const initialCanceledPayments: Payment[] = [
  {
    id: 501,
    athlete: "Ryan Peters",
    sport: "Football",
    amount: 4000,
    description: "Monthly License Fee - Feb 2026",
    contractId: "osu-014",
    contractTitle: "2025-26 Revenue Share Agreement",
    dueDate: "2026-02-15",
    type: "revenue_share",
    status: "canceled",
    cancelReason: "Athlete entered transfer portal",
  },
]



export function DisbursementsManagement() {
  const [activeTab, setActiveTab] = useState<"action" | "performance" | "transactions" | "upcoming">("action")
  const [sportFilter, setSportFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [upcomingTimeframe, setUpcomingTimeframe] = useState<"30" | "60" | "90" | "all">("60")
  const [transactionStatusFilter, setTransactionStatusFilter] = useState<string>("all")
  const [transactionSearchQuery, setTransactionSearchQuery] = useState("")
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<string>("all")
  const [transactionSportFilter, setTransactionSportFilter] = useState<string>("all")
  const [transactionDateFilter, setTransactionDateFilter] = useState<string>("all")
  
  // Performance Pay tab filters
  const [performanceSearchQuery, setPerformanceSearchQuery] = useState("")
  const [performanceSportFilter, setPerformanceSportFilter] = useState<string>("all")
  const [performanceStatusFilter, setPerformanceStatusFilter] = useState<string>("all")
  const [selectedPerformanceIds, setSelectedPerformanceIds] = useState<number[]>([])
  const [performancePage, setPerformancePage] = useState(1)
  const performancePageSize = 10
  
  // Live state for payments
  const [revenueSharePayments, setRevenueSharePayments] = useState<Payment[]>(initialRevenueSharePayments)
  const [deliverablePayments, setDeliverablePayments] = useState<Payment[]>(initialDeliverablePayments)
  const [processingPayments, setProcessingPayments] = useState<Payment[]>(initialProcessingPayments)
  const [completePayments, setCompletePayments] = useState<Payment[]>(initialCompletePayments)
  const [onHoldPayments, setOnHoldPayments] = useState<Payment[]>(initialOnHoldPayments)
  const [canceledPayments, setCanceledPayments] = useState<Payment[]>(initialCanceledPayments)
  
  // Selection state for batch operations
  const [selectedReleases, setSelectedReleases] = useState<Set<number>>(new Set())
  
  // Collapsible state for RevShare Payroll
  const [isPayrollExpanded, setIsPayrollExpanded] = useState(false)
  const [selectedPayrollIds, setSelectedPayrollIds] = useState<number[]>([])
  
  // Modal states
  const [confirmEligibilityItems, setConfirmEligibilityItems] = useState<Payment[]>([])
  const [confirmDeliverableItem, setConfirmDeliverableItem] = useState<Payment | null>(null)
  const [confirmDeliverableItems, setConfirmDeliverableItems] = useState<Payment[]>([])
  const [releasePaymentItems, setReleasePaymentItems] = useState<Payment[]>([])
  const [holdPaymentItem, setHoldPaymentItem] = useState<Payment | null>(null)
  const [cancelPaymentItem, setCancelPaymentItem] = useState<Payment | null>(null)
  const [denyPaymentItem, setDenyPaymentItem] = useState<Payment | null>(null)
  const [confirmationNote, setConfirmationNote] = useState("")
  const [deliverableNote, setDeliverableNote] = useState("")
  const [reinstatePaymentItem, setReinstatePaymentItem] = useState<Payment | null>(null)
  const [reinstateNote, setReinstateNote] = useState("")
  const [holdReason, setHoldReason] = useState("")
  const [cancelReason, setCancelReason] = useState("")
  const [denyReason, setDenyReason] = useState("")
  const [detailPayment, setDetailPayment] = useState<Payment | null>(null)

  // Combine all active payments for filtering
  const allPayments = useMemo(() => [...revenueSharePayments, ...deliverablePayments], [revenueSharePayments, deliverablePayments])
  
  // RevShare Payroll pending confirmation (for Action Queue)
  const pendingRevSharePayroll = useMemo(() => {
    return revenueSharePayments.filter(p => 
      p.status === "pending_confirmation"
    ).filter(p => {
      if (sportFilter !== "all" && p.sport !== sportFilter) return false
      if (searchQuery && !p.athlete.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  }, [revenueSharePayments, sportFilter, searchQuery])
  
  // Ready for release (both types)
  const readyForRelease = useMemo(() => {
    return allPayments.filter(p => 
      p.status === "ready_for_release"
    ).filter(p => {
      if (sportFilter !== "all" && p.sport !== sportFilter) return false
      if (searchQuery && !p.athlete.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  }, [allPayments, sportFilter, searchQuery])
  
  // Calculate totals
  const totalPendingPayrollAmount = pendingRevSharePayroll.reduce((sum, p) => sum + p.amount, 0)
  const totalReadyAmount = readyForRelease.reduce((sum, p) => sum + p.amount, 0)

  // Conditional Performance Pay (for Performance Pay tab) - only pending confirmation
  const conditionalPayments = useMemo(() => {
    return deliverablePayments.filter(p => {
      // Only show pending confirmation items
      if (p.status !== "pending_confirmation") return false
      // Search
      if (performanceSearchQuery) {
        const query = performanceSearchQuery.toLowerCase()
        const matchesSearch = 
          p.athlete.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          (p.deliverableCondition && p.deliverableCondition.toLowerCase().includes(query))
        if (!matchesSearch) return false
      }
      // Sport
      if (performanceSportFilter !== "all" && p.sport !== performanceSportFilter) return false
      return true
    })
  }, [deliverablePayments, performanceSearchQuery, performanceSportFilter, performanceStatusFilter])

  // Scheduled payments with timeframe filter
  const scheduledPayments = useMemo(() => {
    const today = new Date("2026-03-17")
    return revenueSharePayments.filter(p => {
      if (p.status !== "scheduled") return false
      if (upcomingTimeframe === "all") return true
      const dueDate = new Date(p.dueDate)
      const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntil <= parseInt(upcomingTimeframe)
    })
  }, [revenueSharePayments, upcomingTimeframe])

  // All transactions combined for the unified Transactions tab
  const allTransactions = useMemo(() => {
    return [
      ...processingPayments,
      ...completePayments,
      ...onHoldPayments,
      ...canceledPayments,
      ]
  }, [processingPayments, completePayments, onHoldPayments, canceledPayments])

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    const today = new Date("2026-03-17")
    return allTransactions.filter(p => {
      // Status filter
      if (transactionStatusFilter !== "all" && p.status !== transactionStatusFilter) return false
      // Type filter
      if (transactionTypeFilter !== "all") {
        if (transactionTypeFilter === "revenue_share" && p.type !== "revenue_share") return false
        if (transactionTypeFilter === "conditional" && p.type !== "conditional") return false
      }
      // Sport filter
      if (transactionSportFilter !== "all" && p.sport !== transactionSportFilter) return false
      // Date filter
      if (transactionDateFilter !== "all") {
        const txnDate = new Date(p.completedDate || p.processingStarted || p.dueDate)
        const daysDiff = Math.ceil((today.getTime() - txnDate.getTime()) / (1000 * 60 * 60 * 24))
        if (transactionDateFilter === "7" && daysDiff > 7) return false
        if (transactionDateFilter === "30" && daysDiff > 30) return false
        if (transactionDateFilter === "90" && daysDiff > 90) return false
      }
      // Search filter
      if (transactionSearchQuery) {
        const query = transactionSearchQuery.toLowerCase()
        const matchesSearch = 
          p.athlete.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.contractTitle.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }
      return true
    })
  }, [allTransactions, transactionStatusFilter, transactionSearchQuery, transactionTypeFilter, transactionSportFilter, transactionDateFilter])

  // Selection handlers for releases
  const toggleReleaseSelection = (id: number) => {
    const newSelected = new Set(selectedReleases)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedReleases(newSelected)
  }

  const selectAllReleases = () => {
    const ids = readyForRelease.map(p => p.id)
    setSelectedReleases(new Set(ids))
  }

  const clearReleaseSelection = () => {
    setSelectedReleases(new Set())
  }

  const handleBatchRelease = () => {
    const paymentsToRelease = readyForRelease.filter(p => selectedReleases.has(p.id))
    if (paymentsToRelease.length > 0) {
      setReleasePaymentItems(paymentsToRelease)
    }
  }

  // Confirm all RevShare Payroll eligibility
  const handleConfirmAllPayroll = () => {
    setConfirmEligibilityItems(pendingRevSharePayroll)
  }

  // Confirm eligibility - move to ready for release
  const handleConfirmEligibility = () => {
    const idsToConfirm = confirmEligibilityItems.map(p => p.id)
    
    // Update revenue share payments
    setRevenueSharePayments(prev => prev.map(p => {
      if (idsToConfirm.includes(p.id)) {
        return { ...p, status: "ready_for_release" as PaymentStatus, eligibilityConfirmed: true }
      }
      return p
    }))
    
    setConfirmEligibilityItems([])
    setConfirmationNote("")
    setSelectedPayrollIds([])
  }

// Confirm deliverable - move to ready for release
  const handleConfirmDeliverable = () => {
    if (!confirmDeliverableItem) return
    
    // Move from pending to ready for release
    setDeliverablePayments(prev => prev.map(p => {
      if (p.id === confirmDeliverableItem.id) {
        return { ...p, status: "ready_for_release" as PaymentStatus, completionConfirmed: true }
      }
      return p
    }))
    setConfirmDeliverableItem(null)
    setDeliverableNote("")
  }
  
  // Batch confirm deliverables
  const handleBatchConfirmDeliverables = () => {
    if (confirmDeliverableItems.length === 0) return
    
    const itemIds = confirmDeliverableItems.map(p => p.id)
    setDeliverablePayments(prev => prev.map(p => {
      if (itemIds.includes(p.id)) {
        return { ...p, status: "ready_for_release" as PaymentStatus, completionConfirmed: true }
      }
      return p
    }))
    setConfirmDeliverableItems([])
    setSelectedPerformanceIds([])
    setDeliverableNote("")
  }

  // Release payments - move to processing
  const handleReleasePayments = () => {
    const idsToRelease = releasePaymentItems.map(p => p.id)
    const today = new Date().toISOString().split('T')[0]
    
    // Create processing entries
    const newProcessing: Payment[] = releasePaymentItems.map(p => ({
      ...p,
      status: "processing" as PaymentStatus,
      processingStarted: today,
      confirmedBy: "Current User",
    }))
    
    setProcessingPayments(prev => [...newProcessing, ...prev])
    
    // Remove from revenue share or deliverable lists
    setRevenueSharePayments(prev => prev.filter(p => !idsToRelease.includes(p.id)))
    setDeliverablePayments(prev => prev.filter(p => !idsToRelease.includes(p.id)))
    
    setReleasePaymentItems([])
    clearReleaseSelection()
  }

  // Hold payment
  const handleHoldPayment = () => {
    if (!holdPaymentItem) return
    
    const holdEntry: Payment = {
      ...holdPaymentItem,
      status: "on_hold" as PaymentStatus,
      holdReason: holdReason,
    }
    
    setOnHoldPayments(prev => [holdEntry, ...prev])
    
    // Remove from current lists
    setRevenueSharePayments(prev => prev.filter(p => p.id !== holdPaymentItem.id))
    setDeliverablePayments(prev => prev.filter(p => p.id !== holdPaymentItem.id))
    
    setHoldPaymentItem(null)
    setHoldReason("")
  }

  // Cancel payment
  const handleCancelPayment = () => {
    if (!cancelPaymentItem || !cancelReason.trim()) return
    
    const cancelEntry: Payment = {
      ...cancelPaymentItem,
      status: "canceled" as PaymentStatus,
      cancelReason: cancelReason,
    }
    
    setCanceledPayments(prev => [cancelEntry, ...prev])
    
    // Remove from current lists
    setRevenueSharePayments(prev => prev.filter(p => p.id !== cancelPaymentItem.id))
    setDeliverablePayments(prev => prev.filter(p => p.id !== cancelPaymentItem.id))
    setOnHoldPayments(prev => prev.filter(p => p.id !== cancelPaymentItem.id))
    
    setCancelPaymentItem(null)
    setCancelReason("")
  }

  // Deny conditional payment (moves to canceled)
  const handleDenyPayment = () => {
    if (!denyPaymentItem || !denyReason.trim()) return
    
    const denyEntry: Payment = {
      ...denyPaymentItem,
      status: "canceled" as PaymentStatus,
      cancelReason: denyReason,
    }
    
    setCanceledPayments(prev => [denyEntry, ...prev])
    
    // Remove from deliverable lists
    setDeliverablePayments(prev => prev.filter(p => p.id !== denyPaymentItem.id))
    
    setDenyPaymentItem(null)
    setDenyReason("")
  }
  
  // Reinstate canceled payment
  const handleReinstatePayment = () => {
    if (!reinstatePaymentItem || !reinstateNote.trim()) return
    
    // Move back to pending confirmation based on type
    if (reinstatePaymentItem.type === "conditional") {
      setDeliverablePayments(prev => [...prev, { ...reinstatePaymentItem, status: "pending_confirmation" as PaymentStatus }])
    } else {
      setRevenueSharePayments(prev => [...prev, { ...reinstatePaymentItem, status: "pending_confirmation" as PaymentStatus }])
    }
    
    // Remove from canceled
    setCanceledPayments(prev => prev.filter(p => p.id !== reinstatePaymentItem.id))
    
    setReinstatePaymentItem(null)
    setReinstateNote("")
  }

  // Get unique sports for filter
  const sports = useMemo(() => {
    const sportSet = new Set(allPayments.map(p => p.sport))
    return Array.from(sportSet)
  }, [allPayments])

  // Count for Performance Pay tab (pending conditional payments)
  const pendingPerformanceCount = deliverablePayments.filter(p => p.status === "pending_confirmation").length

  // Tab definitions with counts
  const tabs = [
    { id: "action" as const, label: "Action Queue", count: pendingRevSharePayroll.length + readyForRelease.length },
    { id: "performance" as const, label: "Performance Pay", count: pendingPerformanceCount },
    { id: "transactions" as const, label: "Transactions", count: allTransactions.length },
    { id: "upcoming" as const, label: "Upcoming", count: scheduledPayments.length },
  ]

  // Calculate summary for release dialog
  const releaseSummary = useMemo(() => {
    if (releasePaymentItems.length === 0) return null
    const totalAmount = releasePaymentItems.reduce((sum, p) => sum + p.amount, 0)
    const athleteCount = new Set(releasePaymentItems.map(p => p.athlete)).size
    return { totalAmount, athleteCount, paymentCount: releasePaymentItems.length }
  }, [releasePaymentItems])

  // Status badge helper
  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "processing":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            Processing
          </Badge>
        )
      case "complete":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Complete
          </Badge>
        )
      case "on_hold":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
            <PauseCircle className="h-3 w-3 mr-1" />
            On Hold
          </Badge>
        )
      case "canceled":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Canceled
          </Badge>
        )

      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Type badge helper
  const getTypeBadge = (type: PaymentType) => {
    if (type === "revenue_share") {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
          RevShare Payroll
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="bg-teal-100 text-teal-700 text-xs">
        Performance Pay
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Athlete Disbursements</h1>
          <p className="text-muted-foreground">The Ohio State University / Benefits Pool / 2025-26</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Disbursement Timeline Chart - Compact */}
      <Card>
        <CardHeader className="py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Payout Schedule</CardTitle>
              <CardDescription className="text-xs ml-2">Bi-weekly disbursements with projections</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-3 pt-0">
          <div className="h-[120px]">
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={disbursementData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6b7280" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6b7280" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="period"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: "#6b7280" }}
                  interval={5}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: "#6b7280" }}
                  tickFormatter={(value) => formatCurrency(value)}
                  width={45}
                />
                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-white p-2 border rounded-lg shadow-lg">
                          <p className="font-medium text-xs">{label}</p>
                          <div className="space-y-1 mt-1">
                            <div className="flex justify-between gap-2">
                              <span className="text-xs text-muted-foreground">Amount:</span>
                              <span className="text-xs font-medium">
                                {formatCurrency(data.actual || data.projected)}
                              </span>
                            </div>
                            <div className="flex justify-between gap-2">
                              <span className="text-xs text-muted-foreground">Status:</span>
                              <span className="text-xs font-medium">
                                {data.actual !== null ? "Completed" : "Projected"}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#actualGradient)"
                  dot={false}
                  activeDot={{ r: 2, fill: "#3b82f6", strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="projected"
                  stroke="#6b7280"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  fill="url(#projectedGradient)"
                  dot={false}
                  activeDot={{ r: 2, fill: "#6b7280" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Filters Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search athletes..." 
              className="pl-8 w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={sportFilter} onValueChange={setSportFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Sports" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              {sports.map(sport => (
                <SelectItem key={sport} value={sport}>{sport}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tab Bar - Matching athlete page style */}
      <div className="border-b">
        <nav className="flex gap-6" aria-label="Disbursement tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 ${activeTab === tab.id ? "text-foreground" : "text-muted-foreground"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "action" && (
        <div className="space-y-6">
          {/* RevShare Payroll Section - Collapsible */}
          <Collapsible open={isPayrollExpanded} onOpenChange={setIsPayrollExpanded}>
            <div 
              className={`rounded-lg border bg-card transition-all ${isPayrollExpanded ? 'ring-2 ring-primary/20' : 'hover:border-primary/30 cursor-pointer'}`}
            >
              {/* Collapsed Header - Clickable to expand */}
              <div 
                className="flex items-center justify-between p-4"
                onClick={(e) => {
                  // Don't toggle if clicking on the button
                  if ((e.target as HTMLElement).closest('button')) return
                  setIsPayrollExpanded(!isPayrollExpanded)
                }}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isPayrollExpanded ? 'bg-primary text-primary-foreground' : 'bg-blue-100'}`}>
                    <DollarSign className={`h-5 w-5 ${isPayrollExpanded ? '' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-base">RevShare Payroll</h3>
                      <div className={`transition-transform ${isPayrollExpanded ? 'rotate-90' : ''}`}>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {pendingRevSharePayroll.length} athlete{pendingRevSharePayroll.length !== 1 ? 's' : ''} pending eligibility confirmation
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold">${totalPendingPayrollAmount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total payroll amount</p>
                  </div>
                  {pendingRevSharePayroll.length > 0 && (
                    <Button 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation()
                        if (selectedPayrollIds.length > 0) {
                          // Confirm only selected
                          const selectedPayments = pendingRevSharePayroll.filter(p => selectedPayrollIds.includes(p.id))
                          setConfirmEligibilityItems(selectedPayments)
                        } else {
                          handleConfirmAllPayroll()
                        }
                      }} 
                      className="gap-1.5"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {selectedPayrollIds.length > 0 
                        ? `Confirm Selected (${selectedPayrollIds.length})`
                        : "Confirm All Eligibility"
                      }
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Expanded Content */}
              <CollapsibleContent>
                <div className="border-t px-4 pb-4 pt-2">
                  {pendingRevSharePayroll.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <p>All eligibility confirmed</p>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-10">
                              <Checkbox 
                                checked={selectedPayrollIds.length === pendingRevSharePayroll.length && pendingRevSharePayroll.length > 0}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedPayrollIds(pendingRevSharePayroll.map(p => p.id))
                                  } else {
                                    setSelectedPayrollIds([])
                                  }
                                }}
                              />
                            </TableHead>
                            <TableHead>Athlete</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Contract</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="w-16">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendingRevSharePayroll.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>
                                <Checkbox 
                                  checked={selectedPayrollIds.includes(payment.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedPayrollIds(prev => [...prev, payment.id])
                                    } else {
                                      setSelectedPayrollIds(prev => prev.filter(id => id !== payment.id))
                                    }
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{payment.athlete}</p>
                                  <p className="text-xs text-muted-foreground">{payment.sport}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <p className="text-sm">{payment.description}</p>
                              </TableCell>
                              <TableCell>
                                <Link 
                                  href={`/contracts/active?contract=${payment.contractId}`}
                                  className="text-sm text-primary hover:underline flex items-center gap-1"
                                >
                                  <FileText className="h-3 w-3" />
                                  {payment.contractTitle}
                                </Link>
                              </TableCell>
                              <TableCell className="text-right">
                                <span className="font-semibold">
                                  ${payment.amount.toLocaleString()}
                                </span>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setDetailPayment(payment)}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setConfirmEligibilityItems([payment])}>
                                      <CheckCircle2 className="h-4 w-4 mr-2" />
                                      Confirm Eligibility
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setHoldPaymentItem(payment)}>
                                      <PauseCircle className="h-4 w-4 mr-2" />
                                      Put on Hold
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Ready for Release Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Ready for Release</CardTitle>
                    <CardDescription>{readyForRelease.length} payments confirmed and ready</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                    ${totalReadyAmount.toLocaleString()}
                  </Badge>
                  {readyForRelease.length > 0 && (
                    <>
                      {selectedReleases.size > 0 ? (
                        <Button size="sm" onClick={handleBatchRelease} className="gap-1">
                          <Banknote className="h-4 w-4" />
                          Release Selected ({selectedReleases.size})
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={selectAllReleases} className="gap-1">
                          <Users className="h-4 w-4" />
                          Select All
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {readyForRelease.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2" />
                  <p>No payments ready for release</p>
                  <p className="text-sm">Confirm eligibility above to move payments here</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox 
                            checked={selectedReleases.size === readyForRelease.length && readyForRelease.length > 0}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                selectAllReleases()
                              } else {
                                clearReleaseSelection()
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Athlete</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Contract</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="w-16">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {readyForRelease.map((payment) => (
                        <TableRow 
                          key={payment.id}
                          className={selectedReleases.has(payment.id) ? "bg-muted/50" : ""}
                        >
                          <TableCell>
                            <Checkbox 
                              checked={selectedReleases.has(payment.id)}
                              onCheckedChange={() => toggleReleaseSelection(payment.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{payment.athlete}</p>
                              <p className="text-xs text-muted-foreground">{payment.sport}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{payment.description}</p>
                          </TableCell>
                          <TableCell>
                            {getTypeBadge(payment.type)}
                          </TableCell>
                          <TableCell>
                            <Link 
                              href={`/contracts/active?contract=${payment.contractId}`}
                              className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                              <FileText className="h-3 w-3" />
                              {payment.contractTitle}
                            </Link>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-semibold">
                              ${payment.amount.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setDetailPayment(payment)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setReleasePaymentItems([payment])}>
                                  <Banknote className="h-4 w-4 mr-2" />
                                  Release
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => setCancelPaymentItem(payment)}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Cancel
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Pay Tab */}
      {activeTab === "performance" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by athlete, description, or condition..." 
                className="pl-8 w-[320px]"
                value={performanceSearchQuery}
                onChange={(e) => setPerformanceSearchQuery(e.target.value)}
              />
            </div>

            <Select value={performanceSportFilter} onValueChange={setPerformanceSportFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Sports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                {sports.map(sport => (
                  <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(performanceSearchQuery || performanceStatusFilter !== "all" || performanceSportFilter !== "all") && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setPerformanceSearchQuery("")
                  setPerformanceStatusFilter("all")
                  setPerformanceSportFilter("all")
                }}
                className="text-muted-foreground"
              >
                Clear filters
              </Button>
            )}
          </div>

          {/* Performance Pay Table */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100">
                    <Target className="h-4 w-4 text-teal-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Conditional Performance Pay</CardTitle>
                    <CardDescription>Review deliverable completion before approving payments ({conditionalPayments.length} pending)</CardDescription>
                  </div>
                </div>
                {conditionalPayments.length > 0 && (
                  <Button 
                    onClick={() => {
                      if (selectedPerformanceIds.length > 0) {
                        const selectedPayments = conditionalPayments.filter(p => selectedPerformanceIds.includes(p.id))
                        setConfirmDeliverableItems(selectedPayments)
                      }
                    }}
                    disabled={selectedPerformanceIds.length === 0}
                    className="gap-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {selectedPerformanceIds.length > 0 
                      ? `Approve Selected (${selectedPerformanceIds.length})`
                      : "Select to Approve"
                    }
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {conditionalPayments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-8 w-8 mx-auto mb-2" />
                  <p>No conditional payments to review</p>
                  {(performanceSearchQuery || performanceSportFilter !== "all") && (
                    <p className="text-sm mt-1">Try adjusting your filters</p>
                  )}
                </div>
              ) : (
                <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10">
                          <Checkbox 
                            checked={selectedPerformanceIds.length === conditionalPayments.slice((performancePage - 1) * performancePageSize, performancePage * performancePageSize).length && conditionalPayments.length > 0}
                            onCheckedChange={(checked) => {
                              const pageItems = conditionalPayments.slice((performancePage - 1) * performancePageSize, performancePage * performancePageSize)
                              if (checked) {
                                setSelectedPerformanceIds(prev => [...new Set([...prev, ...pageItems.map(p => p.id)])])
                              } else {
                                setSelectedPerformanceIds(prev => prev.filter(id => !pageItems.map(p => p.id).includes(id)))
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Athlete</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Contract</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="w-16">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {conditionalPayments.slice((performancePage - 1) * performancePageSize, performancePage * performancePageSize).map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedPerformanceIds.includes(payment.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedPerformanceIds(prev => [...prev, payment.id])
                                } else {
                                  setSelectedPerformanceIds(prev => prev.filter(id => id !== payment.id))
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{payment.athlete}</p>
                              <p className="text-xs text-muted-foreground">{payment.sport}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{payment.description}</p>
                          </TableCell>
                          <TableCell>
                            <Link 
                              href={`/contracts/active?contract=${payment.contractId}`}
                              className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                              <FileText className="h-3 w-3" />
                              {payment.contractTitle}
                            </Link>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-semibold">
                              ${payment.amount.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setDetailPayment(payment)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                {payment.status === "pending_confirmation" && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setConfirmDeliverableItem(payment)}>
                                      <CheckCircle2 className="h-4 w-4 mr-2" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      className="text-red-600"
                                      onClick={() => setDenyPaymentItem(payment)}
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Deny
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {payment.status === "ready_for_release" && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setReleasePaymentItems([payment])}>
                                      <Banknote className="h-4 w-4 mr-2" />
                                      Release
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      className="text-red-600"
                                      onClick={() => setCancelPaymentItem(payment)}
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Cancel
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {/* Pagination */}
                {conditionalPayments.length > performancePageSize && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {((performancePage - 1) * performancePageSize) + 1} to {Math.min(performancePage * performancePageSize, conditionalPayments.length)} of {conditionalPayments.length} items
                      {selectedPerformanceIds.length > 0 && ` (${selectedPerformanceIds.length} selected)`}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPerformancePage(prev => Math.max(1, prev - 1))}
                        disabled={performancePage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.ceil(conditionalPayments.length / performancePageSize) }, (_, i) => i + 1).map(page => (
                          <Button
                            key={page}
                            variant={page === performancePage ? "default" : "outline"}
                            size="sm"
                            className="w-8 h-8 p-0"
                            onClick={() => setPerformancePage(page)}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPerformancePage(prev => Math.min(Math.ceil(conditionalPayments.length / performancePageSize), prev + 1))}
                        disabled={performancePage >= Math.ceil(conditionalPayments.length / performancePageSize)}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === "transactions" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search transactions..." 
                className="pl-8 w-[200px]"
                value={transactionSearchQuery}
                onChange={(e) => setTransactionSearchQuery(e.target.value)}
              />
            </div>
            <Select value={transactionStatusFilter} onValueChange={setTransactionStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
                
              </SelectContent>
            </Select>
            <Select value={transactionTypeFilter} onValueChange={setTransactionTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="revenue_share">RevShare Payroll</SelectItem>
                <SelectItem value="conditional">Performance Pay</SelectItem>
              </SelectContent>
            </Select>
            <Select value={transactionSportFilter} onValueChange={setTransactionSportFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="All Sports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                <SelectItem value="Football">Football</SelectItem>
                <SelectItem value="Basketball">Basketball</SelectItem>
                <SelectItem value="Baseball">Baseball</SelectItem>
              </SelectContent>
            </Select>
            <Select value={transactionDateFilter} onValueChange={setTransactionDateFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            {(transactionStatusFilter !== "all" || transactionTypeFilter !== "all" || transactionSportFilter !== "all" || transactionDateFilter !== "all") && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setTransactionStatusFilter("all")
                  setTransactionTypeFilter("all")
                  setTransactionSportFilter("all")
                  setTransactionDateFilter("all")
                }}
                className="text-muted-foreground"
              >
                Clear filters
              </Button>
            )}
          </div>

          {/* Transactions Table */}
          <Card>
            <CardContent className="pt-6">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2" />
                  <p>No transactions found</p>
                  {(transactionStatusFilter !== "all" || transactionTypeFilter !== "all" || transactionSportFilter !== "all" || transactionDateFilter !== "all" || transactionSearchQuery) && (
                    <p className="text-sm mt-1">Try adjusting your filters</p>
                  )}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Athlete</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Contract</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="w-16">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{payment.athlete}</p>
                              <p className="text-xs text-muted-foreground">{payment.sport}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{payment.description}</p>
                          </TableCell>
                          <TableCell>
                            {getTypeBadge(payment.type)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(payment.status)}
                          </TableCell>
                          <TableCell>
                            <Link 
                              href={`/contracts/active?contract=${payment.contractId}`}
                              className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                              <FileText className="h-3 w-3" />
                              {payment.contractTitle}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {payment.completedDate || payment.processingStarted || payment.dueDate}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-semibold">
                              ${payment.amount.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setDetailPayment(payment)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                {payment.status === "on_hold" && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => {
                                      // Move from on_hold back to ready_for_release (confirm)
                                      setOnHoldPayments(prev => prev.filter(p => p.id !== payment.id))
                                      if (payment.type === "revenue_share") {
                                        setRevenueSharePayments(prev => [...prev, { ...payment, status: "ready_for_release" as PaymentStatus }])
                                      } else {
                                        setDeliverablePayments(prev => [...prev, { ...payment, status: "ready_for_release" as PaymentStatus }])
                                      }
                                    }}>
                                      <CheckCircle2 className="h-4 w-4 mr-2" />
                                      Confirm
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      className="text-red-600"
                                      onClick={() => setCancelPaymentItem(payment)}
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Cancel
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {payment.status === "canceled" && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setReinstatePaymentItem(payment)}>
                                      <RefreshCw className="h-4 w-4 mr-2" />
                                      Reinstate
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Upcoming Tab */}
      {activeTab === "upcoming" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Select 
                value={upcomingTimeframe} 
                onValueChange={(v) => setUpcomingTimeframe(v as typeof upcomingTimeframe)}
              >
                <SelectTrigger className="w-[160px]">
                  <CalendarClock className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">Next 30 days</SelectItem>
                  <SelectItem value="60">Next 60 days</SelectItem>
                  <SelectItem value="90">Next 90 days</SelectItem>
                  <SelectItem value="all">All scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              {scheduledPayments.length} scheduled payments totaling ${scheduledPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              {scheduledPayments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2" />
                  <p>No upcoming payments in this timeframe</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Athlete</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Contract</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="w-16">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scheduledPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{payment.athlete}</p>
                              <p className="text-xs text-muted-foreground">{payment.sport}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">{payment.description}</p>
                          </TableCell>
                          <TableCell>
                            <Link 
                              href={`/contracts/active?contract=${payment.contractId}`}
                              className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                              <FileText className="h-3 w-3" />
                              {payment.contractTitle}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{payment.dueDate}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-semibold">
                              ${payment.amount.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setDetailPayment(payment)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Confirm Eligibility Modal (RevShare Payroll) */}
      <Dialog open={confirmEligibilityItems.length > 0} onOpenChange={(open) => !open && setConfirmEligibilityItems([])}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Athlete Eligibility</DialogTitle>
            <DialogDescription>
              Confirm that {confirmEligibilityItems.length === 1 
                ? `${confirmEligibilityItems[0]?.athlete} is` 
                : `${confirmEligibilityItems.length} athletes are`
              } currently eligible and on the team roster.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {confirmEligibilityItems.length <= 3 ? (
              <div className="space-y-2">
                {confirmEligibilityItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span className="font-medium">{item.athlete}</span>
                    <span className="font-semibold">${item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-muted/50 rounded space-y-1">
                <p className="font-medium">{confirmEligibilityItems.length} athletes</p>
                <p className="text-2xl font-bold">
                  ${confirmEligibilityItems.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total payroll amount</p>
              </div>
            )}
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea 
                placeholder="Add any notes about this confirmation..."
                value={confirmationNote}
                onChange={(e) => setConfirmationNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmEligibilityItems([])}>
              Cancel
            </Button>
            <Button onClick={handleConfirmEligibility}>
              Confirm Eligibility
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Deliverable Modal (Performance Pay) */}
      <Dialog open={!!confirmDeliverableItem} onOpenChange={(open) => !open && setConfirmDeliverableItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Performance Payment</DialogTitle>
            <DialogDescription>
              Confirm that the deliverable condition has been met.
            </DialogDescription>
          </DialogHeader>
          {confirmDeliverableItem && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span className="font-medium">{confirmDeliverableItem.athlete}</span>
                  <span className="font-semibold">${confirmDeliverableItem.amount.toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Condition to verify</Label>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded text-sm">
                  {confirmDeliverableItem.deliverableCondition}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Confirmation notes</Label>
                <Textarea 
                  placeholder="Add details about how this condition was verified..."
                  value={confirmationNote}
                  onChange={(e) => setConfirmationNote(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeliverableItem(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDeliverable}>
              Approve Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Batch Approve Deliverables Modal */}
      <Dialog open={confirmDeliverableItems.length > 0} onOpenChange={(open) => !open && setConfirmDeliverableItems([])}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Approve Performance Payments</DialogTitle>
            <DialogDescription>
              Confirm that the deliverable conditions have been met for {confirmDeliverableItems.length} payment{confirmDeliverableItems.length !== 1 ? 's' : ''}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg text-center">
              <p className="text-3xl font-bold text-teal-700">
                ${confirmDeliverableItems.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
              </p>
              <p className="text-sm text-teal-600 mt-1">
                {confirmDeliverableItems.length} payment{confirmDeliverableItems.length !== 1 ? 's' : ''} to approve
              </p>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {confirmDeliverableItems.map(payment => (
                <div key={payment.id} className="flex justify-between items-center p-2 bg-muted/50 rounded text-sm">
                  <div>
                    <p className="font-medium">{payment.athlete}</p>
                    <p className="text-xs text-muted-foreground">{payment.description}</p>
                  </div>
                  <span className="font-semibold">${payment.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label>Approval notes (optional)</Label>
              <Textarea 
                placeholder="Add notes about this batch approval..."
                value={deliverableNote}
                onChange={(e) => setDeliverableNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeliverableItems([])}>
              Cancel
            </Button>
            <Button onClick={handleBatchConfirmDeliverables}>
              Approve All ({confirmDeliverableItems.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Release Payments Modal */}
      <Dialog open={releasePaymentItems.length > 0} onOpenChange={(open) => !open && setReleasePaymentItems([])}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Release Payments</DialogTitle>
            <DialogDescription>
              Authorize fund transfer to athlete accounts.
            </DialogDescription>
          </DialogHeader>
          {releaseSummary && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <p className="text-3xl font-bold text-green-700">
                  ${releaseSummary.totalAmount.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {releaseSummary.paymentCount} payment{releaseSummary.paymentCount !== 1 ? 's' : ''} to {releaseSummary.athleteCount} athlete{releaseSummary.athleteCount !== 1 ? 's' : ''}
                </p>
              </div>
              {releasePaymentItems.length <= 5 && (
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {releasePaymentItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-muted/50 rounded text-sm">
                      <span>{item.athlete}</span>
                      <span className="font-medium">${item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReleasePaymentItems([])}>
              Cancel
            </Button>
            <Button onClick={handleReleasePayments} className="bg-green-600 hover:bg-green-700">
              <Banknote className="h-4 w-4 mr-2" />
              Release Funds
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hold Payment Modal */}
      <Dialog open={!!holdPaymentItem} onOpenChange={(open) => !open && setHoldPaymentItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Put Payment on Hold</DialogTitle>
            <DialogDescription>
              This payment will be moved to the On Hold status and require review before release.
            </DialogDescription>
          </DialogHeader>
          {holdPaymentItem && (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                <div>
                  <p className="font-medium">{holdPaymentItem.athlete}</p>
                  <p className="text-sm text-muted-foreground">{holdPaymentItem.description}</p>
                </div>
                <span className="font-semibold">${holdPaymentItem.amount.toLocaleString()}</span>
              </div>
              <div className="space-y-2">
                <Label>Reason for hold <span className="text-red-500">*</span></Label>
                <Textarea 
                  placeholder="Explain why this payment is being placed on hold..."
                  value={holdReason}
                  onChange={(e) => setHoldReason(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setHoldPaymentItem(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleHoldPayment}
              disabled={!holdReason.trim()}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <PauseCircle className="h-4 w-4 mr-2" />
              Put on Hold
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Payment Modal */}
      <Dialog open={!!cancelPaymentItem} onOpenChange={(open) => !open && setCancelPaymentItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Payment</DialogTitle>
            <DialogDescription>
              This payment will be permanently canceled. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {cancelPaymentItem && (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded">
                <div>
                  <p className="font-medium">{cancelPaymentItem.athlete}</p>
                  <p className="text-sm text-muted-foreground">{cancelPaymentItem.description}</p>
                </div>
                <span className="font-semibold">${cancelPaymentItem.amount.toLocaleString()}</span>
              </div>
              <div className="space-y-2">
                <Label>Reason for cancellation <span className="text-red-500">*</span></Label>
                <Textarea 
                  placeholder="Explain why this payment is being canceled..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelPaymentItem(null)}>
              Go Back
            </Button>
            <Button 
              onClick={handleCancelPayment}
              disabled={!cancelReason.trim()}
              variant="destructive"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deny Payment Modal (Performance Pay) */}
      <Dialog open={!!denyPaymentItem} onOpenChange={(open) => !open && setDenyPaymentItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Deny Performance Payment</DialogTitle>
            <DialogDescription>
              This payment will be denied because the condition was not met.
            </DialogDescription>
          </DialogHeader>
          {denyPaymentItem && (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded">
                <div>
                  <p className="font-medium">{denyPaymentItem.athlete}</p>
                  <p className="text-sm text-muted-foreground">{denyPaymentItem.description}</p>
                </div>
                <span className="font-semibold">${denyPaymentItem.amount.toLocaleString()}</span>
              </div>
              <div className="space-y-2">
                <Label>Condition that was not met</Label>
                <div className="p-3 bg-muted/50 rounded text-sm">
                  {denyPaymentItem.deliverableCondition}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Reason for denial <span className="text-red-500">*</span></Label>
                <Textarea 
                  placeholder="Explain why this condition was not met..."
                  value={denyReason}
                  onChange={(e) => setDenyReason(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDenyPaymentItem(null)}>
              Go Back
            </Button>
            <Button 
              onClick={handleDenyPayment}
              disabled={!denyReason.trim()}
              variant="destructive"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Deny Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reinstate Payment Modal */}
      <Dialog open={!!reinstatePaymentItem} onOpenChange={(open) => !open && setReinstatePaymentItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reinstate Payment</DialogTitle>
            <DialogDescription>
              This will move the payment back to pending confirmation for review.
            </DialogDescription>
          </DialogHeader>
          {reinstatePaymentItem && (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded">
                <div>
                  <p className="font-medium">{reinstatePaymentItem.athlete}</p>
                  <p className="text-sm text-muted-foreground">{reinstatePaymentItem.description}</p>
                </div>
                <span className="font-semibold">${reinstatePaymentItem.amount.toLocaleString()}</span>
              </div>
              {reinstatePaymentItem.cancelReason && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Original cancellation reason</Label>
                  <div className="p-3 bg-muted/50 rounded text-sm">
                    {reinstatePaymentItem.cancelReason}
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label>Reason for reinstating <span className="text-red-500">*</span></Label>
                <Textarea 
                  placeholder="Explain why this payment is being reinstated..."
                  value={reinstateNote}
                  onChange={(e) => setReinstateNote(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReinstatePaymentItem(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleReinstatePayment}
              disabled={!reinstateNote.trim()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reinstate Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Details Modal */}
      <Dialog open={!!detailPayment} onOpenChange={(open) => !open && setDetailPayment(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {detailPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Athlete</Label>
                  <p className="font-medium">{detailPayment.athlete}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Sport</Label>
                  <p>{detailPayment.sport}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Amount</Label>
                  <p className="font-semibold text-lg">${detailPayment.amount.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <div className="mt-1">{getTypeBadge(detailPayment.type)}</div>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Description</Label>
                  <p>{detailPayment.description}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Contract</Label>
                  <Link 
                    href={`/contracts/active?contract=${detailPayment.contractId}`}
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    <FileText className="h-4 w-4" />
                    {detailPayment.contractTitle}
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
                {detailPayment.deliverableCondition && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Condition</Label>
                    <p className="text-sm bg-muted/50 p-2 rounded mt-1">{detailPayment.deliverableCondition}</p>
                  </div>
                )}
                {detailPayment.holdReason && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Hold Reason</Label>
                    <p className="text-sm bg-amber-50 p-2 rounded mt-1">{detailPayment.holdReason}</p>
                  </div>
                )}
                {detailPayment.cancelReason && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Cancel Reason</Label>
                    <p className="text-sm bg-red-50 p-2 rounded mt-1">{detailPayment.cancelReason}</p>
                  </div>
                )}
                {detailPayment.denyReason && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Denial Reason</Label>
                    <p className="text-sm bg-red-50 p-2 rounded mt-1">{detailPayment.denyReason}</p>
                  </div>
                )}
                {detailPayment.confirmedBy && (
                  <div>
                    <Label className="text-muted-foreground">Confirmed By</Label>
                    <p>{detailPayment.confirmedBy}</p>
                  </div>
                )}
                {detailPayment.completedDate && (
                  <div>
                    <Label className="text-muted-foreground">Completed</Label>
                    <p>{detailPayment.completedDate}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailPayment(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
