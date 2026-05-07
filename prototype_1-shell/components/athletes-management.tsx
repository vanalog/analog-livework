"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Search, Plus, Upload, ChevronDown, ChevronLeft, ChevronRight, Check, Mail, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

type AthleteStatus = "verified" | "pending" | "invited"

interface Athlete {
  id: string
  name: string
  sport: string
  position: string
  graduatingYear: number
  status: AthleteStatus
  agent: string | null
  activeContracts: number
  totalValue: number
  paidToDate: number
  verified: string | null
}

const mockAthletes: Athlete[] = [
  // Verified Athletes - OSU
  {
    id: "osu-001",
    name: "Darius Thornton",
    sport: "Football",
    position: "WR",
    graduatingYear: 2027,
    status: "verified",
    agent: "Excel Sports",
    activeContracts: 3,
    totalValue: 175000,
    paidToDate: 58000,
    verified: "2026-01-03",
  },
  {
    id: "osu-002",
    name: "Malik Crawford",
    sport: "Football",
    position: "QB",
    graduatingYear: 2026,
    status: "verified",
    agent: "Athletes First",
    activeContracts: 2,
    totalValue: 130000,
    paidToDate: 43000,
    verified: "2025-08-18",
  },
  {
    id: "osu-003",
    name: "Jaylen Porter",
    sport: "Basketball",
    position: "PF",
    graduatingYear: 2026,
    status: "verified",
    agent: "Wasserman",
    activeContracts: 1,
    totalValue: 120000,
    paidToDate: 40000,
    verified: "2025-08-22",
  },
  {
    id: "osu-004",
    name: "Terrance Mitchell",
    sport: "Football",
    position: "WR",
    graduatingYear: 2026,
    status: "verified",
    agent: "CAA Sports",
    activeContracts: 2,
    totalValue: 100000,
    paidToDate: 33000,
    verified: "2025-08-15",
  },
  {
    id: "osu-005",
    name: "Brandon Hayes",
    sport: "Football",
    position: "DE",
    graduatingYear: 2026,
    status: "pending",
    agent: "Klutch Sports",
    activeContracts: 1,
    totalValue: 90000,
    paidToDate: 0,
    verified: null,
  },
  // Duke Athletes - Basketball
  {
    id: "duke-001",
    name: "Cameron Brooks",
    sport: "Basketball",
    position: "PG",
    graduatingYear: 2026,
    status: "verified",
    agent: "Excel Sports",
    activeContracts: 2,
    totalValue: 85000,
    paidToDate: 28000,
    verified: "2025-08-12",
  },
  {
    id: "duke-002",
    name: "Isaiah Washington",
    sport: "Basketball",
    position: "SG",
    graduatingYear: 2027,
    status: "pending",
    agent: "Athletes First",
    activeContracts: 1,
    totalValue: 65000,
    paidToDate: 0,
    verified: null,
  },
  // Texas Athletes
  {
    id: "texas-001",
    name: "DeShawn Rivers",
    sport: "Football",
    position: "CB",
    graduatingYear: 2026,
    status: "invited",
    agent: null,
    activeContracts: 0,
    totalValue: 0,
    paidToDate: 0,
    verified: null,
  },
  {
    id: "texas-002",
    name: "Jalen Carter",
    sport: "Football",
    position: "DL",
    graduatingYear: 2027,
    status: "verified",
    agent: "CAA Sports",
    activeContracts: 2,
    totalValue: 210000,
    paidToDate: 70000,
    verified: "2025-11-10",
  },
  {
    id: "texas-003",
    name: "Marcus Williams",
    sport: "Football",
    position: "QB",
    graduatingYear: 2028,
    status: "pending",
    agent: "Athletes First",
    activeContracts: 1,
    totalValue: 95000,
    paidToDate: 0,
    verified: null,
  },
  // Alabama Athletes
  {
    id: "bama-001",
    name: "Tyreek Johnson",
    sport: "Football",
    position: "RB",
    graduatingYear: 2026,
    status: "verified",
    agent: "Excel Sports",
    activeContracts: 4,
    totalValue: 320000,
    paidToDate: 128000,
    verified: "2025-06-15",
  },
  {
    id: "bama-002",
    name: "Caleb Robinson",
    sport: "Football",
    position: "LB",
    graduatingYear: 2027,
    status: "verified",
    agent: "Klutch Sports",
    activeContracts: 2,
    totalValue: 145000,
    paidToDate: 48000,
    verified: "2025-09-20",
  },
  {
    id: "bama-003",
    name: "Andre Davis",
    sport: "Football",
    position: "WR",
    graduatingYear: 2026,
    status: "verified",
    agent: "Wasserman",
    activeContracts: 3,
    totalValue: 275000,
    paidToDate: 91000,
    verified: "2025-07-08",
  },
  {
    id: "bama-004",
    name: "Kai Thompson",
    sport: "Football",
    position: "OL",
    graduatingYear: 2028,
    status: "pending",
    agent: "CAA Sports",
    activeContracts: 1,
    totalValue: 60000,
    paidToDate: 0,
    verified: null,
  },
  // Michigan Athletes
  {
    id: "mich-001",
    name: "Jordan Alexander",
    sport: "Football",
    position: "DE",
    graduatingYear: 2026,
    status: "verified",
    agent: "Athletes First",
    activeContracts: 3,
    totalValue: 195000,
    paidToDate: 65000,
    verified: "2025-08-01",
  },
  {
    id: "mich-002",
    name: "Elijah Moore",
    sport: "Football",
    position: "QB",
    graduatingYear: 2027,
    status: "verified",
    agent: "Excel Sports",
    activeContracts: 5,
    totalValue: 450000,
    paidToDate: 180000,
    verified: "2025-05-30",
  },
  {
    id: "mich-003",
    name: "Noah Bennett",
    sport: "Basketball",
    position: "C",
    graduatingYear: 2027,
    status: "verified",
    agent: "Wasserman",
    activeContracts: 2,
    totalValue: 110000,
    paidToDate: 36000,
    verified: "2025-10-12",
  },
  // Georgia Athletes
  {
    id: "uga-001",
    name: "Xavier Thomas",
    sport: "Football",
    position: "DL",
    graduatingYear: 2026,
    status: "verified",
    agent: "Klutch Sports",
    activeContracts: 3,
    totalValue: 285000,
    paidToDate: 95000,
    verified: "2025-07-22",
  },
  {
    id: "uga-002",
    name: "Rashad Green",
    sport: "Football",
    position: "CB",
    graduatingYear: 2027,
    status: "verified",
    agent: "CAA Sports",
    activeContracts: 2,
    totalValue: 160000,
    paidToDate: 53000,
    verified: "2025-09-14",
  },
  {
    id: "uga-003",
    name: "Chris Okonkwo",
    sport: "Football",
    position: "TE",
    graduatingYear: 2026,
    status: "pending",
    agent: "Athletes First",
    activeContracts: 1,
    totalValue: 75000,
    paidToDate: 0,
    verified: null,
  },
  // USC Athletes
  {
    id: "usc-001",
    name: "Dante Harris",
    sport: "Football",
    position: "WR",
    graduatingYear: 2027,
    status: "verified",
    agent: "Excel Sports",
    activeContracts: 4,
    totalValue: 380000,
    paidToDate: 152000,
    verified: "2025-06-20",
  },
  {
    id: "usc-002",
    name: "Aiden Nakamura",
    sport: "Football",
    position: "K/P",
    graduatingYear: 2028,
    status: "invited",
    agent: null,
    activeContracts: 0,
    totalValue: 0,
    paidToDate: 0,
    verified: null,
  },
  {
    id: "usc-003",
    name: "Tyler Scott",
    sport: "Basketball",
    position: "SF",
    graduatingYear: 2026,
    status: "verified",
    agent: "Wasserman",
    activeContracts: 2,
    totalValue: 140000,
    paidToDate: 46000,
    verified: "2025-08-25",
  },
  // LSU Athletes
  {
    id: "lsu-001",
    name: "Devin Jackson",
    sport: "Football",
    position: "RB",
    graduatingYear: 2027,
    status: "verified",
    agent: "Klutch Sports",
    activeContracts: 3,
    totalValue: 225000,
    paidToDate: 75000,
    verified: "2025-07-15",
  },
  {
    id: "lsu-002",
    name: "Jamal Foster",
    sport: "Football",
    position: "OL",
    graduatingYear: 2026,
    status: "verified",
    agent: "CAA Sports",
    activeContracts: 1,
    totalValue: 85000,
    paidToDate: 28000,
    verified: "2025-11-01",
  },
  {
    id: "lsu-003",
    name: "Miles Washington",
    sport: "Basketball",
    position: "PG",
    graduatingYear: 2028,
    status: "pending",
    agent: "Athletes First",
    activeContracts: 1,
    totalValue: 55000,
    paidToDate: 0,
    verified: null,
  },
  // Oregon Athletes
  {
    id: "ore-001",
    name: "Zion Fletcher",
    sport: "Football",
    position: "QB",
    graduatingYear: 2027,
    status: "verified",
    agent: "Excel Sports",
    activeContracts: 6,
    totalValue: 520000,
    paidToDate: 208000,
    verified: "2025-04-18",
  },
  {
    id: "ore-002",
    name: "Keegan Park",
    sport: "Football",
    position: "LB",
    graduatingYear: 2026,
    status: "verified",
    agent: "Wasserman",
    activeContracts: 2,
    totalValue: 130000,
    paidToDate: 43000,
    verified: "2025-09-05",
  },
  // Penn State Athletes
  {
    id: "psu-001",
    name: "Marcus Turner",
    sport: "Football",
    position: "DB",
    graduatingYear: 2026,
    status: "verified",
    agent: "Athletes First",
    activeContracts: 2,
    totalValue: 155000,
    paidToDate: 51000,
    verified: "2025-08-10",
  },
  {
    id: "psu-002",
    name: "Ryan O'Brien",
    sport: "Football",
    position: "TE",
    graduatingYear: 2027,
    status: "invited",
    agent: null,
    activeContracts: 0,
    totalValue: 0,
    paidToDate: 0,
    verified: null,
  },
  {
    id: "psu-003",
    name: "David Kim",
    sport: "Basketball",
    position: "SG",
    graduatingYear: 2028,
    status: "verified",
    agent: "Klutch Sports",
    activeContracts: 1,
    totalValue: 70000,
    paidToDate: 23000,
    verified: "2025-10-28",
  },
  // Clemson Athletes
  {
    id: "clem-001",
    name: "Jayden White",
    sport: "Football",
    position: "WR",
    graduatingYear: 2026,
    status: "verified",
    agent: "CAA Sports",
    activeContracts: 3,
    totalValue: 200000,
    paidToDate: 66000,
    verified: "2025-07-30",
  },
  {
    id: "clem-002",
    name: "Trevon Adams",
    sport: "Football",
    position: "DL",
    graduatingYear: 2027,
    status: "pending",
    agent: "Excel Sports",
    activeContracts: 1,
    totalValue: 80000,
    paidToDate: 0,
    verified: null,
  },
  // Florida Athletes
  {
    id: "uf-001",
    name: "Sebastian Torres",
    sport: "Football",
    position: "RB",
    graduatingYear: 2026,
    status: "verified",
    agent: "Wasserman",
    activeContracts: 2,
    totalValue: 165000,
    paidToDate: 55000,
    verified: "2025-06-28",
  },
  {
    id: "uf-002",
    name: "Lamar Griffin",
    sport: "Football",
    position: "CB",
    graduatingYear: 2028,
    status: "verified",
    agent: "Athletes First",
    activeContracts: 1,
    totalValue: 90000,
    paidToDate: 30000,
    verified: "2025-12-05",
  },
  {
    id: "uf-003",
    name: "Quincy Brown",
    sport: "Basketball",
    position: "PF",
    graduatingYear: 2027,
    status: "verified",
    agent: "Klutch Sports",
    activeContracts: 2,
    totalValue: 125000,
    paidToDate: 41000,
    verified: "2025-09-18",
  },
  // Notre Dame Athletes
  {
    id: "nd-001",
    name: "Patrick Sullivan",
    sport: "Football",
    position: "QB",
    graduatingYear: 2027,
    status: "verified",
    agent: "Excel Sports",
    activeContracts: 3,
    totalValue: 340000,
    paidToDate: 136000,
    verified: "2025-05-10",
  },
  {
    id: "nd-002",
    name: "Malik Jefferson",
    sport: "Football",
    position: "DE",
    graduatingYear: 2026,
    status: "verified",
    agent: "CAA Sports",
    activeContracts: 2,
    totalValue: 180000,
    paidToDate: 60000,
    verified: "2025-08-14",
  },
  // Tennessee Athletes
  {
    id: "tenn-001",
    name: "Bryson Cole",
    sport: "Football",
    position: "WR",
    graduatingYear: 2027,
    status: "verified",
    agent: "Wasserman",
    activeContracts: 2,
    totalValue: 150000,
    paidToDate: 50000,
    verified: "2025-10-01",
  },
  {
    id: "tenn-002",
    name: "Isaiah Reed",
    sport: "Basketball",
    position: "C",
    graduatingYear: 2026,
    status: "pending",
    agent: "Athletes First",
    activeContracts: 1,
    totalValue: 65000,
    paidToDate: 0,
    verified: null,
  },
  // Miami Athletes
  {
    id: "um-001",
    name: "Antonio Vargas",
    sport: "Football",
    position: "OL",
    graduatingYear: 2027,
    status: "verified",
    agent: "Klutch Sports",
    activeContracts: 1,
    totalValue: 95000,
    paidToDate: 31000,
    verified: "2025-11-15",
  },
  {
    id: "um-002",
    name: "D'Angelo Smith",
    sport: "Football",
    position: "DB",
    graduatingYear: 2026,
    status: "verified",
    agent: "Excel Sports",
    activeContracts: 3,
    totalValue: 240000,
    paidToDate: 80000,
    verified: "2025-07-02",
  },
]

const mockAgencies = [
  { id: "1", name: "Excel Sports", website: "excelsm.com", email: "contact@excelsm.com" },
  { id: "2", name: "Athletes First", website: "athletesfirst.com", email: "info@athletesfirst.com" },
  { id: "3", name: "Wasserman", website: "wasserman.com", email: "contact@wasserman.com" },
  { id: "4", name: "CAA Sports", website: "caasports.com", email: "info@caasports.com" },
  { id: "5", name: "Klutch Sports", website: "klutchsportsgroup.com", email: "contact@klutchsports.com" },
  { id: "6", name: "Vayner Sports", website: "vaynersports.com", email: "info@vaynersports.com" },
  { id: "7", name: "The Family", website: "thefamilysports.com", email: "contact@thefamily.com" },
]

const mockAgents = [
  { id: "1", name: "Mark Steinberg", agencyId: "1", email: "mark@excelsm.com", phone: "(310) 555-0101" },
  { id: "2", name: "David Dunn", agencyId: "2", email: "david@athletesfirst.com", phone: "(949) 555-0102" },
  { id: "3", name: "Casey Wasserman", agencyId: "3", email: "casey@wasserman.com", phone: "(310) 555-0103" },
  { id: "4", name: "Michael Levine", agencyId: "4", email: "michael@caasports.com", phone: "(424) 555-0104" },
  { id: "5", name: "Rich Paul", agencyId: "5", email: "rich@klutchsports.com", phone: "(216) 555-0105" },
  { id: "6", name: "Gary Vaynerchuk", agencyId: "6", email: "gary@vaynersports.com", phone: "(212) 555-0106" },
  { id: "7", name: "Eugene Parker", agencyId: "7", email: "eugene@thefamily.com", phone: "(404) 555-0107" },
]

const footballPositions = ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "DB", "CB", "DE", "K/P"]
const basketballPositions = ["PG", "SG", "SF", "PF", "C"]
const allPositions = [...footballPositions, ...basketballPositions]

export function AthletesManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [sportFilters, setSportFilters] = useState<string[]>([])
  const [positionFilters, setPositionFilters] = useState<string[]>([])
  const [graduatingYearFilters, setGraduatingYearFilters] = useState<number[]>([])
  const [agencyFilters, setAgencyFilters] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(15)
  const [addAthleteOpen, setAddAthleteOpen] = useState(false)
  const [importAthletesOpen, setImportAthletesOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadResult, setUploadResult] = useState<{ success: number; failed: number } | null>(null)

  const [agencyOpen, setAgencyOpen] = useState(false)
  const [agencySearch, setAgencySearch] = useState("")
  const [agentOpen, setAgentOpen] = useState(false)
  const [agentSearch, setAgentSearch] = useState("")
  const [showNewAgencyFields, setShowNewAgencyFields] = useState(false)
  const [showNewAgentFields, setShowNewAgentFields] = useState(false)

  const [athleteForm, setAthleteForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    studentEmail: "",
    email: "",
    sport: "",
    position: "",
    graduatingClass: "",
    agencyId: "",
    agentId: "",
    newAgency: {
      name: "",
      website: "",
      email: "",
    },
    newAgent: {
      name: "",
      email: "",
      phone: "",
    },
    requestOnboarding: false,
  })

  const [modalStep, setModalStep] = useState<"form" | "confirm">("form")

  const [formErrors, setFormErrors] = useState({
    firstName: false,
    lastName: false,
  })

  const stats = {
    totalAthletes: mockAthletes.length,
    verified: mockAthletes.filter((a) => a.status === "verified").length,
    pending: mockAthletes.filter((a) => a.status === "pending").length,
    totalDisbursed: mockAthletes.reduce((sum, a) => sum + a.paidToDate, 0),
  }

  const filteredAthletes = mockAthletes.filter((athlete) => {
    const matchesSearch =
      searchQuery === "" ||
      athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      athlete.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      athlete.agent?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      athlete.sport.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSport = sportFilters.length === 0 || sportFilters.includes(athlete.sport)
    const matchesPosition = positionFilters.length === 0 || positionFilters.includes(athlete.position)
    const matchesGraduatingYear =
      graduatingYearFilters.length === 0 || graduatingYearFilters.includes(athlete.graduatingYear)
    const matchesAgency = agencyFilters.length === 0 || (athlete.agent && agencyFilters.includes(athlete.agent))

    return matchesSearch && matchesSport && matchesPosition && matchesGraduatingYear && matchesAgency
  })

  const totalPages = Math.ceil(filteredAthletes.length / rowsPerPage)
  const paginatedAthletes = filteredAthletes.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  // Reset to page 1 when filters change
  const resetPage = () => setCurrentPage(1)

  const toggleSportFilter = (sport: string) => {
    setSportFilters((prev) => (prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]))
    resetPage()
  }

  const togglePositionFilter = (position: string) => {
    setPositionFilters((prev) => (prev.includes(position) ? prev.filter((p) => p !== position) : [...prev, position]))
    resetPage()
  }

  const toggleGraduatingYearFilter = (year: number) => {
    setGraduatingYearFilters((prev) => (prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]))
    resetPage()
  }

  const toggleAgencyFilter = (agency: string) => {
    setAgencyFilters((prev) => (prev.includes(agency) ? prev.filter((a) => a !== agency) : [...prev, agency]))
    resetPage()
  }

  const uniqueSports = Array.from(new Set(mockAthletes.map((a) => a.sport))).sort()
  const uniqueGraduatingYears = Array.from(new Set(mockAthletes.map((a) => a.graduatingYear))).sort()
  const uniqueAgencies = Array.from(new Set(mockAthletes.map((a) => a.agent).filter((a) => a !== null))) as string[]

  const getStatusVariant = (status: AthleteStatus) => {
    switch (status) {
      case "verified":
        return "default"
      case "pending":
        return "secondary"
      case "invited":
        return "outline"
      default:
        return "secondary"
    }
  }

  const formatCurrency = (value: number) => {
    if (value === 0) return "—"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const handleAddAthleteNext = () => {
    const errors = {
      firstName: !athleteForm.firstName.trim(),
      lastName: !athleteForm.lastName.trim(),
    }

    setFormErrors(errors)

    if (errors.firstName || errors.lastName) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setModalStep("confirm")
  }

  const handleAddAthleteConfirm = () => {
    const onboardingMessage = athleteForm.requestOnboarding
      ? ". An onboarding invite will be sent to their email."
      : ""

    toast({
      title: "Athlete Added",
      description: `${athleteForm.firstName} ${athleteForm.lastName} has been added successfully${onboardingMessage}`,
    })

    setAddAthleteOpen(false)
    setModalStep("form")
    setAthleteForm({
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
      studentEmail: "",
      email: "",
      sport: "",
      position: "",
      graduatingClass: "",
      agencyId: "",
      agentId: "",
      newAgency: { name: "", website: "", email: "" },
      newAgent: { name: "", email: "", phone: "" },
      requestOnboarding: false,
    })
    setFormErrors({ firstName: false, lastName: false })
    setShowNewAgencyFields(false)
    setShowNewAgentFields(false)
    setAgencySearch("")
    setAgentSearch("")
  }

  const handleFileUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      })
      return
    }

    setUploadResult({ success: 15, failed: 2 })
    toast({
      title: "Import Complete",
      description: "Athletes have been imported successfully",
    })
  }

  const handleDownloadTemplate = () => {
    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded",
    })
  }

  const handleDownloadErrorReport = () => {
    toast({
      title: "Error Report Downloaded",
      description: "CSV error report has been downloaded",
    })
  }

  const handleViewImportedAthletes = () => {
    setImportAthletesOpen(false)
    toast({
      title: "Showing Imported Athletes",
      description: "Table updated to show newly imported athletes",
    })
  }

  const handleAthleteClick = (athlete: Athlete) => {
    router.push(`/beneficiaries/${athlete.id}`)
  }

  const handleResendInvitation = (athlete: Athlete) => {
    toast({
      title: "Invitation Resent",
      description: `Invitation email resent to ${athlete.name}`,
    })
  }

  const handleEditProfile = (athlete: Athlete) => {
    toast({
      title: "Edit Profile",
      description: `Opening edit modal for ${athlete.name}`,
    })
    // In a real implementation, this would open the Edit Profile modal
  }

  const handleContractsClick = (athleteId: string) => {
    window.location.href = `/contracts?beneficiary=${athleteId}`
  }

  const filteredAgencies = mockAgencies.filter((agency) =>
    agency.name.toLowerCase().includes(agencySearch.toLowerCase()),
  )

  const filteredAgents = mockAgents.filter((agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(agentSearch.toLowerCase())
    if (athleteForm.agencyId) {
      return matchesSearch && agent.agencyId === athleteForm.agencyId
    }
    return matchesSearch
  })

  const selectedAgency = mockAgencies.find((a) => a.id === athleteForm.agencyId)
  const selectedAgent = mockAgents.find((a) => a.id === athleteForm.agentId)

  const currentYear = new Date().getFullYear()
  const graduationYears = Array.from({ length: 7 }, (_, i) => currentYear + i)

  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Athletes</h1>
          <p className="text-muted-foreground">Manage athletes and contract negotiations</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={importAthletesOpen} onOpenChange={setImportAthletesOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Upload className="w-4 h-4" />
                Import Athletes
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">{/* Dialog content here */}</DialogContent>
          </Dialog>

          <Dialog open={addAthleteOpen} onOpenChange={(open) => { setAddAthleteOpen(open); if (!open) setModalStep("form") }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Athlete
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              {modalStep === "form" ? (
              <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Add New Athlete</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* First Name and Last Name on same row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      First Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Enter first name"
                      value={athleteForm.firstName}
                      onChange={(e) => {
                        setAthleteForm({ ...athleteForm, firstName: e.target.value })
                        setFormErrors({ ...formErrors, firstName: false })
                      }}
                      className={formErrors.firstName ? "border-destructive" : ""}
                    />
                    {formErrors.firstName && <p className="text-sm text-destructive">First name is required</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      Last Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Enter last name"
                      value={athleteForm.lastName}
                      onChange={(e) => {
                        setAthleteForm({ ...athleteForm, lastName: e.target.value })
                        setFormErrors({ ...formErrors, lastName: false })
                      }}
                      className={formErrors.lastName ? "border-destructive" : ""}
                    />
                    {formErrors.lastName && <p className="text-sm text-destructive">Last name is required</p>}
                  </div>
                </div>

                {/* Middle Name and Suffix on same row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                      id="middleName"
                      placeholder="Enter middle name"
                      value={athleteForm.middleName}
                      onChange={(e) => setAthleteForm({ ...athleteForm, middleName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="suffix">Suffix</Label>
                    <Select
                      value={athleteForm.suffix}
                      onValueChange={(value) => setAthleteForm({ ...athleteForm, suffix: value })}
                    >
                      <SelectTrigger id="suffix">
                        <SelectValue placeholder="Select suffix" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jr">Jr.</SelectItem>
                        <SelectItem value="sr">Sr.</SelectItem>
                        <SelectItem value="ii">II</SelectItem>
                        <SelectItem value="iii">III</SelectItem>
                        <SelectItem value="iv">IV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="athlete@example.com"
                      value={athleteForm.email}
                      onChange={(e) => setAthleteForm({ ...athleteForm, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="studentEmail">Student Email</Label>
                    <Input
                      id="studentEmail"
                      type="email"
                      placeholder="student@university.edu"
                      value={athleteForm.studentEmail}
                      onChange={(e) => setAthleteForm({ ...athleteForm, studentEmail: e.target.value })}
                    />
                  </div>
                </div>

                {/* Sport and Position on same row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sport">Sport</Label>
                    <Select
                      value={athleteForm.sport}
                      onValueChange={(value) => setAthleteForm({ ...athleteForm, sport: value })}
                    >
                      <SelectTrigger id="sport">
                        <SelectValue placeholder="Select sport" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="football">Football</SelectItem>
                        <SelectItem value="mens-basketball">Men's Basketball</SelectItem>
                        <SelectItem value="womens-basketball">Women's Basketball</SelectItem>
                        <SelectItem value="baseball">Baseball</SelectItem>
                        <SelectItem value="softball">Softball</SelectItem>
                        <SelectItem value="soccer">Soccer</SelectItem>
                        <SelectItem value="volleyball">Volleyball</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      placeholder="Enter position"
                      value={athleteForm.position}
                      onChange={(e) => setAthleteForm({ ...athleteForm, position: e.target.value })}
                    />
                  </div>
                </div>

                {/* Graduating Class full width */}
                <div className="space-y-2">
                  <Label htmlFor="graduatingClass">Graduating Class</Label>
                  <Select
                    value={athleteForm.graduatingClass}
                    onValueChange={(value) => setAthleteForm({ ...athleteForm, graduatingClass: value })}
                  >
                    <SelectTrigger id="graduatingClass">
                      <SelectValue placeholder="Select graduating class" />
                    </SelectTrigger>
                    <SelectContent>
                      {graduationYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 space-y-4 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground">Representation (Optional)</h3>

                  {/* Agency Combobox */}
                  <div className="space-y-2">
                    <Label htmlFor="agency">Agency</Label>
                    <Popover open={agencyOpen} onOpenChange={setAgencyOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={agencyOpen}
                          className="w-full justify-between font-normal bg-transparent"
                        >
                          {selectedAgency ? selectedAgency.name : "Select agency..."}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <Command>
                          <CommandInput
                            placeholder="Search agency..."
                            value={agencySearch}
                            onValueChange={setAgencySearch}
                          />
                          <CommandList>
                            <CommandEmpty>
                              <button
                                className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-sm"
                                onClick={() => {
                                  setShowNewAgencyFields(true)
                                  setAthleteForm({
                                    ...athleteForm,
                                    agencyId: "new",
                                    newAgency: { ...athleteForm.newAgency, name: agencySearch },
                                  })
                                  setAgencyOpen(false)
                                }}
                              >
                                <Plus className="inline w-4 h-4 mr-2" />
                                Add "{agencySearch}" as new agency
                              </button>
                            </CommandEmpty>
                            <CommandGroup>
                              {filteredAgencies.map((agency) => (
                                <CommandItem
                                  key={agency.id}
                                  value={agency.name}
                                  onSelect={() => {
                                    setAthleteForm({ ...athleteForm, agencyId: agency.id })
                                    setShowNewAgencyFields(false)
                                    setAgencyOpen(false)
                                    setAgencySearch("")
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      athleteForm.agencyId === agency.id ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  {agency.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* New Agency Fields - Inline Expansion */}
                  {showNewAgencyFields && athleteForm.agencyId === "new" && (
                    <div className="space-y-3 p-3 bg-muted/50 rounded-md border">
                      <div className="space-y-2">
                        <Label htmlFor="newAgencyName">Agency Name</Label>
                        <Input
                          id="newAgencyName"
                          placeholder="Enter agency name"
                          value={athleteForm.newAgency.name}
                          onChange={(e) =>
                            setAthleteForm({
                              ...athleteForm,
                              newAgency: { ...athleteForm.newAgency, name: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newAgencyWebsite">Website URL</Label>
                        <Input
                          id="newAgencyWebsite"
                          placeholder="www.example.com"
                          value={athleteForm.newAgency.website}
                          onChange={(e) =>
                            setAthleteForm({
                              ...athleteForm,
                              newAgency: { ...athleteForm.newAgency, website: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newAgencyEmail">Primary Email</Label>
                        <Input
                          id="newAgencyEmail"
                          placeholder="contact@example.com"
                          type="email"
                          value={athleteForm.newAgency.email}
                          onChange={(e) =>
                            setAthleteForm({
                              ...athleteForm,
                              newAgency: { ...athleteForm.newAgency, email: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* Agent Combobox */}
                  <div className="space-y-2">
                    <Label htmlFor="agent">Agent</Label>
                    <Popover open={agentOpen} onOpenChange={setAgentOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={agentOpen}
                          className="w-full justify-between font-normal bg-transparent"
                        >
                          {selectedAgent ? selectedAgent.name : "Select agent..."}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <Command>
                          <CommandInput
                            placeholder="Search agent..."
                            value={agentSearch}
                            onValueChange={setAgentSearch}
                          />
                          <CommandList>
                            <CommandEmpty>
                              <button
                                className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-sm"
                                onClick={() => {
                                  setShowNewAgentFields(true)
                                  setAthleteForm({
                                    ...athleteForm,
                                    agentId: "new",
                                    newAgent: { ...athleteForm.newAgent, name: agentSearch },
                                  })
                                  setAgentOpen(false)
                                }}
                              >
                                <Plus className="inline w-4 h-4 mr-2" />
                                Add "{agentSearch}" as new agent
                              </button>
                            </CommandEmpty>
                            <CommandGroup>
                              {/* Show agents from selected agency first if agency is selected */}
                              {athleteForm.agencyId &&
                                athleteForm.agencyId !== "new" &&
                                filteredAgents.filter((a) => a.agencyId === athleteForm.agencyId).length > 0 && (
                                  <>
                                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                      At {selectedAgency?.name}
                                    </div>
                                    {filteredAgents
                                      .filter((a) => a.agencyId === athleteForm.agencyId)
                                      .map((agent) => (
                                        <CommandItem
                                          key={agent.id}
                                          value={agent.name}
                                          onSelect={() => {
                                            setAthleteForm({ ...athleteForm, agentId: agent.id })
                                            setShowNewAgentFields(false)
                                            setAgentOpen(false)
                                            setAgentSearch("")
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              athleteForm.agentId === agent.id ? "opacity-100" : "opacity-0",
                                            )}
                                          />
                                          {agent.name}
                                        </CommandItem>
                                      ))}
                                  </>
                                )}
                              {/* Show other agents */}
                              {filteredAgents.filter((a) => a.agencyId !== athleteForm.agencyId).length > 0 && (
                                <>
                                  {athleteForm.agencyId && athleteForm.agencyId !== "new" && (
                                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                      Other Agents
                                    </div>
                                  )}
                                  {filteredAgents
                                    .filter((a) => a.agencyId !== athleteForm.agencyId)
                                    .map((agent) => (
                                      <CommandItem
                                        key={agent.id}
                                        value={agent.name}
                                        onSelect={() => {
                                          setAthleteForm({ ...athleteForm, agentId: agent.id })
                                          setShowNewAgentFields(false)
                                          setAgentOpen(false)
                                          setAgentSearch("")
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            athleteForm.agentId === agent.id ? "opacity-100" : "opacity-0",
                                          )}
                                        />
                                        {agent.name}
                                      </CommandItem>
                                    ))}
                                </>
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* New Agent Fields - Inline Expansion */}
                  {showNewAgentFields && athleteForm.agentId === "new" && (
                    <div className="space-y-3 p-3 bg-muted/50 rounded-md border">
                      <div className="space-y-2">
                        <Label htmlFor="newAgentName">Agent Name</Label>
                        <Input
                          id="newAgentName"
                          placeholder="Enter agent name"
                          value={athleteForm.newAgent.name}
                          onChange={(e) =>
                            setAthleteForm({
                              ...athleteForm,
                              newAgent: { ...athleteForm.newAgent, name: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newAgentEmail">Email</Label>
                        <Input
                          id="newAgentEmail"
                          placeholder="agent@example.com"
                          type="email"
                          value={athleteForm.newAgent.email}
                          onChange={(e) =>
                            setAthleteForm({
                              ...athleteForm,
                              newAgent: { ...athleteForm.newAgent, email: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newAgentPhone">Phone</Label>
                        <Input
                          id="newAgentPhone"
                          placeholder="(555) 123-4567"
                          type="tel"
                          value={athleteForm.newAgent.phone}
                          onChange={(e) =>
                            setAthleteForm({
                              ...athleteForm,
                              newAgent: { ...athleteForm.newAgent, phone: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Payout Account */}
                <div className="pt-4 space-y-3 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground">Payout Account</h3>
                  <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Switch
                        id="requestOnboarding"
                        checked={athleteForm.requestOnboarding}
                        onCheckedChange={(checked) => setAthleteForm({ ...athleteForm, requestOnboarding: checked })}
                      />
                      <div className="space-y-0.5">
                        <label htmlFor="requestOnboarding" className="text-sm font-semibold cursor-pointer">
                          Request account onboarding
                        </label>
                        <p className="text-sm text-muted-foreground">
                          {"Send a magic link to the athlete so they can set up their Analog payout account (identity verification, agreements, and bank connection)."}
                        </p>
                      </div>
                    </div>
                    {athleteForm.requestOnboarding && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground pl-12">
                        <Mail className="w-4 h-4 shrink-0" />
                        {"Onboarding invite will be sent to the athlete's email"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAddAthleteOpen(false)
                    setModalStep("form")
                    setAthleteForm({
                      firstName: "",
                      middleName: "",
                      lastName: "",
                      suffix: "",
                      studentEmail: "",
                      email: "",
                      sport: "",
                      position: "",
                      graduatingClass: "",
                      agencyId: "",
                      agentId: "",
                      newAgency: { name: "", website: "", email: "" },
                      newAgent: { name: "", email: "", phone: "" },
                      requestOnboarding: false,
                    })
                    setFormErrors({ firstName: false, lastName: false })
                    setShowNewAgencyFields(false)
                    setShowNewAgentFields(false)
                    setAgencySearch("")
                    setAgentSearch("")
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddAthleteNext}>Add Athlete</Button>
              </div>
              </>
              ) : (
              <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Confirm New Athlete</DialogTitle>
                <p className="text-sm text-muted-foreground">Please review the information below before submitting.</p>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="rounded-lg border divide-y">
                  {/* Name */}
                  <div className="flex items-center justify-between p-3">
                    <span className="text-sm text-muted-foreground">Name</span>
                    <span className="text-sm font-medium">
                      {athleteForm.firstName}
                      {athleteForm.middleName ? ` ${athleteForm.middleName}` : ""}
                      {` ${athleteForm.lastName}`}
                      {athleteForm.suffix ? ` ${athleteForm.suffix.toUpperCase() === "JR" ? "Jr." : athleteForm.suffix.toUpperCase() === "SR" ? "Sr." : athleteForm.suffix.toUpperCase()}` : ""}
                    </span>
                  </div>

                  {/* Email */}
                  {athleteForm.email && (
                    <div className="flex items-center justify-between p-3">
                      <span className="text-sm text-muted-foreground">Email</span>
                      <span className="text-sm font-medium">{athleteForm.email}</span>
                    </div>
                  )}

                  {/* Student Email */}
                  {athleteForm.studentEmail && (
                    <div className="flex items-center justify-between p-3">
                      <span className="text-sm text-muted-foreground">Student Email</span>
                      <span className="text-sm font-medium">{athleteForm.studentEmail}</span>
                    </div>
                  )}

                  {/* Sport */}
                  {athleteForm.sport && (
                    <div className="flex items-center justify-between p-3">
                      <span className="text-sm text-muted-foreground">Sport</span>
                      <span className="text-sm font-medium capitalize">{athleteForm.sport.replace("-", " ")}</span>
                    </div>
                  )}

                  {/* Position */}
                  {athleteForm.position && (
                    <div className="flex items-center justify-between p-3">
                      <span className="text-sm text-muted-foreground">Position</span>
                      <span className="text-sm font-medium">{athleteForm.position}</span>
                    </div>
                  )}

                  {/* Graduating Class */}
                  {athleteForm.graduatingClass && (
                    <div className="flex items-center justify-between p-3">
                      <span className="text-sm text-muted-foreground">Graduating Class</span>
                      <span className="text-sm font-medium">{athleteForm.graduatingClass}</span>
                    </div>
                  )}

                  {/* Agency */}
                  {(selectedAgency || (athleteForm.agencyId === "new" && athleteForm.newAgency.name)) && (
                    <div className="flex items-center justify-between p-3">
                      <span className="text-sm text-muted-foreground">Agency</span>
                      <span className="text-sm font-medium">
                        {athleteForm.agencyId === "new" ? `${athleteForm.newAgency.name} (New)` : selectedAgency?.name}
                      </span>
                    </div>
                  )}

                  {/* Agent */}
                  {(selectedAgent || (athleteForm.agentId === "new" && athleteForm.newAgent.name)) && (
                    <div className="flex items-center justify-between p-3">
                      <span className="text-sm text-muted-foreground">Agent</span>
                      <span className="text-sm font-medium">
                        {athleteForm.agentId === "new" ? `${athleteForm.newAgent.name} (New)` : selectedAgent?.name}
                      </span>
                    </div>
                  )}

                  {/* Payout Onboarding */}
                  <div className="flex items-center justify-between p-3">
                    <span className="text-sm text-muted-foreground">Payout Account Onboarding</span>
                    <span className={cn("text-sm font-medium", athleteForm.requestOnboarding ? "text-emerald-600" : "text-muted-foreground")}>
                      {athleteForm.requestOnboarding ? "Will be requested" : "Not requested"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setModalStep("form")}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Edit
                </Button>
                <Button onClick={handleAddAthleteConfirm}>Confirm & Add Athlete</Button>
              </div>
              </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search athletes..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); resetPage() }}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  All Sports
                  {sportFilters.length > 0 && (
                    <span className="ml-1 rounded-full px-1.5 py-0 text-xs bg-secondary text-secondary-foreground">
                      {sportFilters.length}
                    </span>
                  )}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {uniqueSports.map((sport) => (
                  <DropdownMenuCheckboxItem
                    key={sport}
                    checked={sportFilters.includes(sport)}
                    onCheckedChange={() => toggleSportFilter(sport)}
                  >
                    {sport}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* All Positions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  All Positions
                  {positionFilters.length > 0 && (
                    <span className="ml-1 rounded-full px-1.5 py-0 text-xs bg-secondary text-secondary-foreground">
                      {positionFilters.length}
                    </span>
                  )}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {footballPositions.map((position) => (
                  <DropdownMenuCheckboxItem
                    key={position}
                    checked={positionFilters.includes(position)}
                    onCheckedChange={() => togglePositionFilter(position)}
                  >
                    {position}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  All Graduating Years
                  {graduatingYearFilters.length > 0 && (
                    <span className="ml-1 rounded-full px-1.5 py-0 text-xs bg-secondary text-secondary-foreground">
                      {graduatingYearFilters.length}
                    </span>
                  )}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {uniqueGraduatingYears.map((year) => (
                  <DropdownMenuCheckboxItem
                    key={year}
                    checked={graduatingYearFilters.includes(year)}
                    onCheckedChange={() => toggleGraduatingYearFilter(year)}
                  >
                    {year}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  All Agencies
                  {agencyFilters.length > 0 && (
                    <span className="ml-1 rounded-full px-1.5 py-0 text-xs bg-secondary text-secondary-foreground">
                      {agencyFilters.length}
                    </span>
                  )}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {uniqueAgencies.sort().map((agency) => (
                  <DropdownMenuCheckboxItem
                    key={agency}
                    checked={agencyFilters.includes(agency)}
                    onCheckedChange={() => toggleAgencyFilter(agency)}
                  >
                    {agency}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Sport</TableHead>
                <TableHead>Position</TableHead>
                <TableHead className="text-center">Year</TableHead>
                <TableHead>Agency</TableHead>
                <TableHead className="text-center">Contracts</TableHead>
                <TableHead className="text-right">Commitments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAthletes.map((athlete) => (
                <TableRow
                  key={athlete.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleAthleteClick(athlete)}
                >
                  <TableCell>
                    <span className="font-medium">{athlete.name}</span>
                  </TableCell>
                  <TableCell>{athlete.sport}</TableCell>
                  <TableCell>{athlete.position}</TableCell>
                  <TableCell className="text-center">{athlete.graduatingYear}</TableCell>
                  <TableCell>{athlete.agent || "—"}</TableCell>
                  <TableCell className="text-center">
                    {athlete.activeContracts > 0 ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 p-0 h-auto font-normal"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleContractsClick(athlete.id)
                        }}
                      >
                        {athlete.activeContracts}
                      </Button>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(athlete.totalValue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 border-t mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                Showing {Math.min((currentPage - 1) * rowsPerPage + 1, filteredAthletes.length)}
                {" - "}
                {Math.min(currentPage * rowsPerPage, filteredAthletes.length)} of{" "}
                {filteredAthletes.length} athletes
              </span>
              <Select
                value={rowsPerPage.toString()}
                onValueChange={(value) => {
                  setRowsPerPage(Number(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[70px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span>per page</span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  if (totalPages <= 7) return true
                  if (page === 1 || page === totalPages) return true
                  if (Math.abs(page - currentPage) <= 1) return true
                  return false
                })
                .reduce<(number | string)[]>((acc, page, idx, arr) => {
                  if (idx > 0 && page - (arr[idx - 1] as number) > 1) {
                    acc.push("...")
                  }
                  acc.push(page)
                  return acc
                }, [])
                .map((page, idx) =>
                  typeof page === "string" ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-sm text-muted-foreground">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ),
                )}
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
