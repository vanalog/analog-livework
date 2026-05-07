"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CheckCircle2,
  Clock,
  DollarSign,
  Plus,
  Wallet,
  TrendingUp,
  AlertCircle,
  Check,
  X,
  Eye,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react"

const mockFundingRequests = [
  {
    id: "FR-001",
    sponsor: "Nike Basketball Division",
    amount: 250000,
    method: "Wire Transfer",
    requestDate: "2024-06-05",
    status: "Pending",
    priority: "High",
  },
  {
    id: "FR-002",
    sponsor: "TechStart Solutions",
    amount: 100000,
    method: "ACH",
    requestDate: "2024-06-04",
    status: "Pending",
    priority: "Medium",
  },
  {
    id: "FR-003",
    sponsor: "Elite Fitness Equipment Co.",
    amount: 75000,
    method: "Wire Transfer",
    requestDate: "2024-06-03",
    status: "Processing",
    priority: "Medium",
  },
]

const mockActivePools = [
  {
    id: "POOL-001",
    sponsor: "Nike Basketball Division",
    name: "Basketball Athletes Q2 2024",
    totalFunds: 500000,
    allocated: 125000,
    available: 375000,
    athletes: 3,
    created: "2024-01-15",
  },
  {
    id: "POOL-002",
    sponsor: "TechStart Solutions",
    name: "Tech & Innovation Athletes",
    totalFunds: 250000,
    allocated: 75000,
    available: 175000,
    athletes: 2,
    created: "2024-02-01",
  },
  {
    id: "POOL-003",
    sponsor: "Elite Fitness Equipment Co.",
    name: "Fitness & Wellness Program",
    totalFunds: 400000,
    allocated: 95000,
    available: 305000,
    athletes: 4,
    created: "2024-01-20",
  },
]

const mockAllocationQueue = [
  {
    id: "ALQ-001",
    athlete: "David Wilson",
    sponsor: "Nike Basketball Division",
    amount: 28000,
    requestDate: "2024-06-01",
    requestedBy: "Contract Manager",
    complianceCheck: "Passed",
    status: "Pending Approval",
  },
  {
    id: "ALQ-002",
    athlete: "Emily Rodriguez",
    sponsor: "TechStart Solutions",
    amount: 35000,
    requestDate: "2024-05-30",
    requestedBy: "Admin User",
    complianceCheck: "Passed",
    status: "Pending Approval",
  },
  {
    id: "ALQ-003",
    athlete: "James Thompson",
    sponsor: "Elite Fitness Equipment Co.",
    amount: 42000,
    requestDate: "2024-05-28",
    requestedBy: "Contract Manager",
    complianceCheck: "Review Required",
    status: "Pending Compliance",
  },
]

const mockTransactionHistory = [
  {
    id: "TXN-001",
    date: "2024-06-02",
    type: "Deposit",
    sponsor: "Nike Basketball Division",
    amount: 250000,
    method: "Wire Transfer",
    status: "Completed",
  },
  {
    id: "TXN-002",
    date: "2024-06-01",
    type: "Allocation",
    sponsor: "TechStart Solutions",
    athlete: "Jessica Chen",
    amount: -22000,
    status: "Completed",
  },
  {
    id: "TXN-003",
    date: "2024-05-30",
    type: "Deposit",
    sponsor: "Elite Fitness Equipment Co.",
    amount: 150000,
    method: "ACH",
    status: "Completed",
  },
  {
    id: "TXN-004",
    date: "2024-05-28",
    type: "Allocation",
    sponsor: "Nike Basketball Division",
    athlete: "Marcus Johnson",
    amount: -45000,
    status: "Completed",
  },
]

export function FundManagement() {
  const [createPoolOpen, setCreatePoolOpen] = useState(false)
  const [selectedRequests, setSelectedRequests] = useState<string[]>([])

  const totalPending = mockFundingRequests.filter((r) => r.status === "Pending").reduce((sum, r) => sum + r.amount, 0)
  const totalPoolFunds = mockActivePools.reduce((sum, p) => sum + p.totalFunds, 0)
  const totalAllocated = mockActivePools.reduce((sum, p) => sum + p.allocated, 0)
  const totalAvailable = mockActivePools.reduce((sum, p) => sum + p.available, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fund Management</h1>
          <p className="text-muted-foreground">Manage sponsor funding, allocations, and transaction flow</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Pending Deposits</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalPending / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">
              {mockFundingRequests.filter((r) => r.status === "Pending").length} requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Pool Funds</h3>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalPoolFunds / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">{mockActivePools.length} active pools</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Allocated Funds</h3>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${(totalAllocated / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Not yet disbursed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Available to Allocate</h3>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${(totalAvailable / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Ready for allocation</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">
            Funding Requests
            {mockFundingRequests.filter((r) => r.status === "Pending").length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {mockFundingRequests.filter((r) => r.status === "Pending").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="pools">Active Pools</TabsTrigger>
          <TabsTrigger value="queue">
            Allocation Queue
            {mockAllocationQueue.filter((a) => a.status === "Pending Approval").length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {mockAllocationQueue.filter((a) => a.status === "Pending Approval").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        {/* Funding Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pending Funding Requests</CardTitle>
                  <CardDescription>Review and approve sponsor deposit requests</CardDescription>
                </div>
                {selectedRequests.length > 0 && (
                  <div className="flex gap-2">
                    <Button size="sm" className="gap-2">
                      <Check className="w-4 h-4" />
                      Approve Selected ({selectedRequests.length})
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                      <X className="w-4 h-4" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </TableHead>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Sponsor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockFundingRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <input type="checkbox" className="rounded border-gray-300" />
                      </TableCell>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>{request.sponsor}</TableCell>
                      <TableCell className="font-mono">${request.amount.toLocaleString()}</TableCell>
                      <TableCell>{request.method}</TableCell>
                      <TableCell>{request.requestDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            request.priority === "High"
                              ? "destructive"
                              : request.priority === "Medium"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {request.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={request.status === "Pending" ? "secondary" : "default"}>{request.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                            <Check className="w-3 h-3" />
                            Approve
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Pools Tab */}
        <TabsContent value="pools" className="space-y-4">
          <div className="flex justify-end">
            <Button className="gap-2" onClick={() => setCreatePoolOpen(true)}>
              <Plus className="w-4 h-4" />
              Create Pool
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockActivePools.map((pool) => (
              <Card key={pool.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{pool.name}</CardTitle>
                      <CardDescription className="text-xs">{pool.sponsor}</CardDescription>
                    </div>
                    <Badge variant="secondary">{pool.athletes} athletes</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Funds</span>
                      <span className="font-mono font-semibold">${pool.totalFunds.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Allocated</span>
                      <span className="font-mono text-orange-600">${pool.allocated.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Available</span>
                      <span className="font-mono text-green-600">${pool.available.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Allocation Progress</span>
                      <span>{((pool.allocated / pool.totalFunds) * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={(pool.allocated / pool.totalFunds) * 100} />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      Allocate Funds
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Allocation Queue Tab */}
        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Allocation Queue</CardTitle>
                  <CardDescription>Review and approve pending athlete allocations</CardDescription>
                </div>
                <Button size="sm" className="gap-2">
                  <Check className="w-4 h-4" />
                  Bulk Approve
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </TableHead>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Athlete</TableHead>
                    <TableHead>Sponsor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Compliance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAllocationQueue.map((allocation) => (
                    <TableRow key={allocation.id}>
                      <TableCell>
                        <input type="checkbox" className="rounded border-gray-300" />
                      </TableCell>
                      <TableCell className="font-medium">{allocation.id}</TableCell>
                      <TableCell>{allocation.athlete}</TableCell>
                      <TableCell>{allocation.sponsor}</TableCell>
                      <TableCell className="font-mono">${allocation.amount.toLocaleString()}</TableCell>
                      <TableCell>{allocation.requestDate}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{allocation.requestedBy}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            allocation.complianceCheck === "Passed"
                              ? "default"
                              : allocation.complianceCheck === "Review Required"
                                ? "secondary"
                                : "destructive"
                          }
                          className="gap-1"
                        >
                          {allocation.complianceCheck === "Passed" ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          {allocation.complianceCheck}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{allocation.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                            <Check className="w-3 h-3" />
                            Approve
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transaction History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Complete history of deposits and allocations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Sponsor</TableHead>
                    <TableHead>Athlete</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTransactionHistory.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {transaction.type === "Deposit" ? (
                            <ArrowDownLeft className="w-4 h-4 text-green-500" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-orange-500" />
                          )}
                          {transaction.type}
                        </div>
                      </TableCell>
                      <TableCell>{transaction.sponsor}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{transaction.athlete || "—"}</TableCell>
                      <TableCell
                        className={`font-mono font-semibold ${transaction.amount > 0 ? "text-green-600" : "text-orange-600"}`}
                      >
                        {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm">{transaction.method || "—"}</TableCell>
                      <TableCell>
                        <Badge variant="default">{transaction.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Pool Dialog */}
      <Dialog open={createPoolOpen} onOpenChange={setCreatePoolOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Allocation Pool</DialogTitle>
            <DialogDescription>Set up a new pool for allocating funds to athletes</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sponsor">Sponsor</Label>
              <Select>
                <SelectTrigger id="sponsor">
                  <SelectValue placeholder="Select sponsor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nike">Nike Basketball Division</SelectItem>
                  <SelectItem value="techstart">TechStart Solutions</SelectItem>
                  <SelectItem value="elite">Elite Fitness Equipment Co.</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pool-name">Pool Name</Label>
              <Input id="pool-name" placeholder="e.g., Basketball Athletes Q3 2024" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Initial Amount</Label>
              <Input id="amount" type="number" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input id="description" placeholder="Pool purpose and guidelines" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreatePoolOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setCreatePoolOpen(false)}>Create Pool</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
