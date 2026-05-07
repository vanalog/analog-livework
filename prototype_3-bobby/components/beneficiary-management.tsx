"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Users, ExternalLink, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

interface Beneficiary {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  university: string
  status: "verified" | "in_progress" | "needs_review" | "blocked"
  contractCount: number
  totalValue: number
  dateOfBirth: string
  address: {
    line1: string
    city: string
    state: string
    zip: string
  }
}

const mockBeneficiaries: Beneficiary[] = [
  {
    id: "osu-001",
    firstName: "Darius",
    lastName: "Thornton",
    email: "thornton.101@esu.edu",
    phone: "(614) 555-0101",
    university: "Example State University",
    status: "verified",
    contractCount: 3,
    totalValue: 175000,
    dateOfBirth: "2005-08-15",
    address: {
      line1: "1234 High Street",
      city: "Columbus",
      state: "OH",
      zip: "43201",
    },
  },
  {
    id: "osu-002",
    firstName: "Malik",
    lastName: "Crawford",
    email: "crawford.202@esu.edu",
    phone: "(614) 555-0102",
    university: "Example State University",
    status: "verified",
    contractCount: 2,
    totalValue: 130000,
    dateOfBirth: "2002-12-10",
    address: {
      line1: "5678 Lane Avenue",
      city: "Columbus",
      state: "OH",
      zip: "43210",
    },
  },
  {
    id: "osu-003",
    firstName: "Jaylen",
    lastName: "Porter",
    email: "porter.303@esu.edu",
    phone: "(614) 555-0103",
    university: "Example State University",
    status: "in_progress",
    contractCount: 1,
    totalValue: 120000,
    dateOfBirth: "2003-05-22",
    address: {
      line1: "9012 Olentangy River Road",
      city: "Columbus",
      state: "OH",
      zip: "43202",
    },
  },
  {
    id: "osu-004",
    firstName: "Terrance",
    lastName: "Mitchell",
    email: "mitchell.404@esu.edu",
    phone: "(614) 555-0104",
    university: "Example State University",
    status: "verified",
    contractCount: 2,
    totalValue: 100000,
    dateOfBirth: "2003-03-15",
    address: {
      line1: "3456 Kenny Road",
      city: "Columbus",
      state: "OH",
      zip: "43221",
    },
  },
  {
    id: "osu-005",
    firstName: "Brandon",
    lastName: "Hayes",
    email: "hayes.505@esu.edu",
    phone: "(614) 555-0105",
    university: "Example State University",
    status: "needs_review",
    contractCount: 1,
    totalValue: 90000,
    dateOfBirth: "2003-09-05",
    address: {
      line1: "6789 Bethel Road",
      city: "Columbus",
      state: "OH",
      zip: "43235",
    },
  },
  {
    id: "duke-001",
    firstName: "Cameron",
    lastName: "Brooks",
    email: "cameron.brooks@duke.edu",
    phone: "(919) 555-0201",
    university: "Duke University",
    status: "verified",
    contractCount: 2,
    totalValue: 85000,
    dateOfBirth: "2004-01-18",
    address: {
      line1: "123 Cameron Boulevard",
      city: "Durham",
      state: "NC",
      zip: "27708",
    },
  },
  {
    id: "duke-002",
    firstName: "Isaiah",
    lastName: "Washington",
    email: "isaiah.washington@duke.edu",
    phone: "(919) 555-0202",
    university: "Duke University",
    status: "in_progress",
    contractCount: 1,
    totalValue: 65000,
    dateOfBirth: "2004-06-25",
    address: {
      line1: "456 Blue Devil Lane",
      city: "Durham",
      state: "NC",
      zip: "27705",
    },
  },
  {
    id: "texas-001",
    firstName: "DeShawn",
    lastName: "Rivers",
    email: "deshawn.rivers@utexas.edu",
    phone: "(512) 555-0301",
    university: "University of Texas",
    status: "blocked",
    contractCount: 0,
    totalValue: 0,
    dateOfBirth: "2004-07-12",
    address: {
      line1: "321 Longhorn Way",
      city: "Austin",
      state: "TX",
      zip: "78712",
    },
  },
]

const universities = ["Example State University", "Duke University", "University of Texas"]

export function BeneficiaryManagement() {
  const router = useRouter()
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(mockBeneficiaries)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [universityFilter, setUniversityFilter] = useState<string>("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newBeneficiary, setNewBeneficiary] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: {
      line1: "",
      city: "",
      state: "",
      zip: "",
    },
  })

  const getStatusColor = (status: Beneficiary["status"]) => {
    switch (status) {
      case "verified":
        return "default"
      case "in_progress":
        return "secondary"
      case "needs_review":
        return "outline"
      case "blocked":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusLabel = (status: Beneficiary["status"]) => {
    switch (status) {
      case "verified":
        return "Verified"
      case "in_progress":
        return "In Progress"
      case "needs_review":
        return "Needs Review"
      case "blocked":
        return "Blocked"
      default:
        return "Unknown"
    }
  }

  const filteredBeneficiaries = beneficiaries.filter((beneficiary) => {
    const matchesSearch = `${beneficiary.firstName} ${beneficiary.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || beneficiary.status === statusFilter
    const matchesUniversity = universityFilter === "all" || beneficiary.university === universityFilter

    return matchesSearch && matchesStatus && matchesUniversity
  })

  const handleAddBeneficiary = () => {
    const beneficiary: Beneficiary = {
      id: Date.now().toString(),
      firstName: newBeneficiary.firstName,
      lastName: newBeneficiary.lastName,
      email: newBeneficiary.email,
      phone: newBeneficiary.phone,
      university: "University TBD", // Would be selected in real implementation
      status: "needs_review",
      contractCount: 0,
      totalValue: 0,
      dateOfBirth: newBeneficiary.dateOfBirth,
      address: newBeneficiary.address,
    }

    setBeneficiaries([...beneficiaries, beneficiary])
    setNewBeneficiary({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: {
        line1: "",
        city: "",
        state: "",
        zip: "",
      },
    })
    setIsModalOpen(false)
  }

  const handleContractsClick = (beneficiaryId: string) => {
    // Mock navigation to contracts page with filter
    window.location.href = `/contracts?beneficiary=${beneficiaryId}`
  }

  const handleBeneficiaryClick = (beneficiaryId: string) => {
    router.push(`/beneficiaries/${beneficiaryId}`)
  }

  return (
    <main className="flex-1 px-6 py-6 bg-background">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Beneficiaries</h1>
          <p className="text-muted-foreground">
            Manage student-athletes and view their linked contracts, compliance status, and payouts.
          </p>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search beneficiaries..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={universityFilter} onValueChange={setUniversityFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="University" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Universities</SelectItem>
                  {universities.map((university) => (
                    <SelectItem key={university} value={university}>
                      {university}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="needs_review">Needs Review</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    New Beneficiary
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New Beneficiary</DialogTitle>
                    <DialogDescription>Enter the beneficiary's information to create their profile.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={newBeneficiary.firstName}
                          onChange={(e) => setNewBeneficiary({ ...newBeneficiary, firstName: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={newBeneficiary.lastName}
                          onChange={(e) => setNewBeneficiary({ ...newBeneficiary, lastName: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newBeneficiary.email}
                        onChange={(e) => setNewBeneficiary({ ...newBeneficiary, email: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={newBeneficiary.phone}
                        onChange={(e) => setNewBeneficiary({ ...newBeneficiary, phone: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={newBeneficiary.dateOfBirth}
                        onChange={(e) => setNewBeneficiary({ ...newBeneficiary, dateOfBirth: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="addressLine1">Address Line 1</Label>
                      <Input
                        id="addressLine1"
                        value={newBeneficiary.address.line1}
                        onChange={(e) =>
                          setNewBeneficiary({
                            ...newBeneficiary,
                            address: { ...newBeneficiary.address, line1: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={newBeneficiary.address.city}
                          onChange={(e) =>
                            setNewBeneficiary({
                              ...newBeneficiary,
                              address: { ...newBeneficiary.address, city: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={newBeneficiary.address.state}
                          onChange={(e) =>
                            setNewBeneficiary({
                              ...newBeneficiary,
                              address: { ...newBeneficiary.address, state: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input
                        id="zip"
                        value={newBeneficiary.address.zip}
                        onChange={(e) =>
                          setNewBeneficiary({
                            ...newBeneficiary,
                            address: { ...newBeneficiary.address, zip: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddBeneficiary}>Save Beneficiary</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {filteredBeneficiaries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No beneficiaries yet</h3>
                <p className="text-muted-foreground mb-4">Add your first beneficiary to begin linking contracts.</p>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button>Add Beneficiary</Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>University</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Contracts</TableHead>
                    <TableHead className="text-right">Total Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBeneficiaries.map((beneficiary) => (
                    <TableRow
                      key={beneficiary.id}
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleBeneficiaryClick(beneficiary.id)}
                    >
                      <TableCell className="font-medium">
                        {beneficiary.firstName} {beneficiary.lastName}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{beneficiary.university}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(beneficiary.status)}>{getStatusLabel(beneficiary.status)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 p-0 h-auto font-normal"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleContractsClick(beneficiary.id)
                          }}
                        >
                          {beneficiary.contractCount}
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${beneficiary.totalValue.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
