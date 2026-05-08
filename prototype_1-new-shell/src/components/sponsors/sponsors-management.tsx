"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

import {
  Search,
  Plus,
  MoreVertical,
  Building2,
  DollarSign,
  Eye,
  FileText,
} from "lucide-react"
import { useRouter } from "next/navigation"

const mockSponsors = [
  {
    id: "s1",
    name: "Nike Basketball Division",
    contactName: "Sarah Johnson",
    type: "Business",
    entityType: "For-Profit",
    kybStatus: "Verified",
    contractValue: 125000,
    athletes: 3,
    lastActivity: "Deposited Jan 10",
    currentBalance: 500000,
    allocatedFunds: 125000,
    uncommittedFunds: 375000,
    totalFunded: 500000,
    marketingFlex: 50000,
    status: "Active",
    campaigns: 2,
  },
  {
    id: "s2",
    name: "Local Sports Medicine Clinic",
    contactName: "Dr. Michael Chen",
    type: "Business",
    entityType: "For-Profit",
    kybStatus: "Pending",
    contractValue: 35000,
    athletes: 2,
    lastActivity: "Contract signed Jan 5",
    currentBalance: 150000,
    allocatedFunds: 35000,
    uncommittedFunds: 115000,
    totalFunded: 150000,
    marketingFlex: 15000,
    status: "Active",
    campaigns: 1,
  },
  {
    id: "s3",
    name: "Regional Auto Dealership",
    contactName: "Robert Davis",
    type: "Business",
    entityType: "For-Profit",
    kybStatus: "Not Started",
    contractValue: 22000,
    athletes: 1,
    lastActivity: "Deposited Dec 28",
    currentBalance: 75000,
    allocatedFunds: 22000,
    uncommittedFunds: 53000,
    totalFunded: 75000,
    marketingFlex: 10000,
    status: "Active",
    campaigns: 0,
  },
  {
    id: "s4",
    name: "TechStart Solutions",
    contactName: "Jennifer Lee",
    type: "Business",
    entityType: "For-Profit",
    kybStatus: "Verified",
    contractValue: 75000,
    athletes: 2,
    lastActivity: "Deposited Jan 8",
    currentBalance: 250000,
    allocatedFunds: 75000,
    uncommittedFunds: 175000,
    totalFunded: 300000,
    marketingFlex: 25000,
    status: "Active",
    campaigns: 3,
  },
  {
    id: "s5",
    name: "Elite Fitness Equipment Co.",
    contactName: "Amanda Foster",
    type: "Business",
    entityType: "For-Profit",
    kybStatus: "Verified",
    contractValue: 95000,
    athletes: 4,
    lastActivity: "Contract signed Jan 3",
    currentBalance: 400000,
    allocatedFunds: 95000,
    uncommittedFunds: 305000,
    totalFunded: 450000,
    marketingFlex: 40000,
    status: "Active",
    campaigns: 2,
  },
  {
    id: "s6",
    name: "Marcus Thompson Sr.",
    contactName: "Marcus Thompson Sr.",
    type: "Individual",
    entityType: "Individual Donor",
    kybStatus: "Failed",
    contractValue: 0,
    athletes: 0,
    lastActivity: "Failed verification Dec 15",
    currentBalance: 0,
    allocatedFunds: 0,
    uncommittedFunds: 0,
    totalFunded: 0,
    marketingFlex: 0,
    status: "Inactive",
    campaigns: 0,
  },
  {
    id: "s7",
    name: "John Tyson",
    contactName: "John Tyson",
    type: "Individual",
    entityType: "Individual Donor",
    kybStatus: "Verified",
    contractValue: 20000,
    athletes: 1,
    lastActivity: "Deposited Jan 12",
    currentBalance: 200000,
    allocatedFunds: 20000,
    uncommittedFunds: 180000,
    totalFunded: 200000,
    marketingFlex: 20000,
    status: "Active",
    campaigns: 1,
  },
  {
    id: "s8",
    name: "Walmart Foundation",
    contactName: "Patricia Williams",
    type: "Business",
    entityType: "Foundation",
    kybStatus: "Verified",
    contractValue: 150000,
    athletes: 5,
    lastActivity: "Deposited Jan 15",
    currentBalance: 500000,
    allocatedFunds: 150000,
    uncommittedFunds: 350000,
    totalFunded: 500000,
    marketingFlex: 75000,
    status: "Active",
    campaigns: 4,
  },
]



// Currency formatting helpers
const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`
  }
  return `$${value.toLocaleString()}`
}

const formatCurrencyFull = (value: number): string => {
  return `$${value.toLocaleString()}`
}

export function SponsorsManagement() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [kybFilter, setKybFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const handleRowClick = (sponsorId: string) => {
    router.push(`/sponsors/${sponsorId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sponsors</h1>
          <p className="text-muted-foreground">Manage sponsor commitments and NIL allocations</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Sponsor
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Total Sponsors</h3>
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <p className="text-sm text-muted-foreground mt-1">
              6 Business · 2 Individual
            </p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Committed</h3>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$2.08M</div>
            <p className="text-sm text-muted-foreground mt-1">Across all active sponsors</p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Available</h3>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">$1.55M</div>
            <p className="text-sm text-muted-foreground mt-1">Uncommitted this season</p>
          </CardContent>
        </Card>
      </div>

      <div className="px-6 py-3 bg-muted/30 rounded-lg border">
        <p className="text-sm text-muted-foreground">
          Transfer window: April 6-21 · 3 sponsors with unallocated funds
        </p>
      </div>

      <div className="space-y-6">
          <Card className="border shadow-sm">
            <CardContent className="pt-6">
              <div className="space-y-1 mb-4">
                <h3 className="text-lg font-semibold">NIL Position</h3>
                <p className="text-sm text-muted-foreground">Committed and active contracts vs. indicated interest (IOI)</p>
              </div>
              <div className="h-[250px] flex items-center justify-center bg-muted/20 rounded-lg border border-dashed">
                <p className="text-muted-foreground text-sm">Chart coming soon</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search sponsors, contacts..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={kybFilter} onValueChange={setKybFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Verification Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="business">Businesses</SelectItem>
                    <SelectItem value="individual">Individuals</SelectItem>
                    <SelectItem value="pending">Pending Setup</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="last-activity">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-activity">Last Activity</SelectItem>
                    <SelectItem value="committed-desc">Committed Desc</SelectItem>
                    <SelectItem value="allocated-desc">Allocated Desc</SelectItem>
                    <SelectItem value="name-asc">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <input type="checkbox" className="rounded border-gray-300" />
                    </TableHead>
                    <TableHead>Sponsor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Season</TableHead>
                    <TableHead>Committed</TableHead>
                    <TableHead>Allocated</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSponsors.map((sponsor) => (
                    <TableRow
                      key={sponsor.id}
                      className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                        sponsor.status === "Inactive" ? "opacity-50" : ""
                      }`}
                      onClick={() => handleRowClick(sponsor.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded border-gray-300" />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{sponsor.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className={
                                sponsor.type === "Business"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-green-50 text-green-700 border-green-200"
                              }
                            >
                              {sponsor.type}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{sponsor.entityType}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">2025-26</TableCell>
                      <TableCell className="font-mono">${sponsor.currentBalance.toLocaleString()}</TableCell>
                      <TableCell className="font-mono">${sponsor.allocatedFunds.toLocaleString()}</TableCell>
                      <TableCell className="font-mono text-green-600">${sponsor.uncommittedFunds.toLocaleString()}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{sponsor.lastActivity}</TableCell>
                      <TableCell>
                        <Badge variant={sponsor.status === "Active" ? "default" : "secondary"}>{sponsor.status}</Badge>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleRowClick(sponsor.id)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit Sponsor</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <FileText className="w-4 h-4 mr-2" />
                              Create Sponsorship Contract
                            </DropdownMenuItem>
                            <DropdownMenuItem>Add Funding</DropdownMenuItem>
                            <DropdownMenuItem>Create Campaign</DropdownMenuItem>
                            {sponsor.status === "Inactive" && (
                              <DropdownMenuItem className="text-blue-600">Invite to reactivate</DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={6} className="text-right font-semibold">
                      Total Available:
                    </TableCell>
                    <TableCell className="font-mono font-bold text-green-600">
                      $1,553,000
                    </TableCell>
                    <TableCell colSpan={3} />
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
      </div>
    </div>
  )
}
