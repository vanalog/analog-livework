"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Download,
  Search,
  Calendar,
  FileText,
  Eye,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Info,
  Users,
  Building2,
} from "lucide-react"

interface Transaction {
  id: string
  date: string
  account: "Benefits Pool" | "Committed Funds"
  type: "Funding" | "Internal Transfer" | "Disbursement"
  description: string
  amount: number
  status: "Completed" | "Pending" | "Failed"
  reference?: string
}

const mockTransactions: Transaction[] = [
  {
    id: "TXN-2025-001",
    date: "2025-01-24",
    account: "Committed Funds",
    type: "Disbursement",
    description: "ACH payout to Marcus Johnson - Football",
    amount: -15000,
    status: "Completed",
    reference: "CONTRACT-FB-2024-089",
  },
  {
    id: "TXN-2025-002",
    date: "2025-01-23",
    account: "Benefits Pool",
    type: "Funding",
    description: "Monthly allocation from Athletic Department",
    amount: 850000,
    status: "Completed",
    reference: "ALLOC-JAN-2025",
  },
  {
    id: "TXN-2025-003",
    date: "2025-01-23",
    account: "Committed Funds",
    type: "Disbursement",
    description: "ACH payout to Sarah Williams - Basketball",
    amount: -8500,
    status: "Completed",
    reference: "CONTRACT-BB-2024-156",
  },
  {
    id: "TXN-2025-004",
    date: "2025-01-22",
    account: "Benefits Pool",
    type: "Internal Transfer",
    description: "Transferred to FBO for Athlete Contract #234",
    amount: -45000,
    status: "Completed",
    reference: "TRANSFER-FBO-Q1",
  },
  {
    id: "TXN-2025-005",
    date: "2025-01-22",
    account: "Committed Funds",
    type: "Disbursement",
    description: "ACH payout to David Chen - Swimming",
    amount: -3200,
    status: "Failed",
    reference: "CONTRACT-SW-2024-203",
  },
  {
    id: "TXN-2025-006",
    date: "2025-01-21",
    account: "Benefits Pool",
    type: "Internal Transfer",
    description: "Contract termination - funds returned from FBO",
    amount: 12000,
    status: "Completed",
    reference: "CONTRACT-TN-2024-078",
  },
  {
    id: "TXN-2025-007",
    date: "2025-01-21",
    account: "Committed Funds",
    type: "Disbursement",
    description: "ACH payout to Emma Rodriguez - Soccer",
    amount: -6800,
    status: "Pending",
    reference: "CONTRACT-SC-2024-134",
  },
  {
    id: "TXN-2025-008",
    date: "2025-01-20",
    account: "Committed Funds",
    type: "Disbursement",
    description: "ACH payout to James Thompson - Track & Field",
    amount: -4500,
    status: "Completed",
    reference: "CONTRACT-TF-2024-167",
  },
]

export function AccountsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [accountFilter, setAccountFilter] = useState<string>("all")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || transaction.status.toLowerCase() === statusFilter
    const matchesType = typeFilter === "all" || transaction.type === typeFilter
    const matchesAccount = accountFilter === "all" || transaction.account === accountFilter

    return matchesSearch && matchesStatus && matchesType && matchesAccount
  })

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getTypeIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "Disbursement":
        return <ArrowUpRight className="w-4 h-4 text-red-500" />
      case "Funding":
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />
      case "Internal Transfer":
        return <RefreshCw className="w-4 h-4 text-blue-500" />
    }
  }

  const getTypeColor = (type: Transaction["type"]) => {
    switch (type) {
      case "Funding":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Internal Transfer":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Disbursement":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reserve Fund Management</h1>
            <p className="text-muted-foreground">University Benefits Pool and committed funds oversight</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>
                  The University Benefits Pool and Committed Funds Accounts represent the full lifecycle of NIL reserve
                  management, from initial funding to final disbursement.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

      </div>

      {/* Primary Account Tiles */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Benefits Pool Account</CardTitle>
              </div>
              <Badge variant="secondary" className="text-xs">
                Primary Reserve
              </Badge>
            </div>
            <CardDescription className="text-sm">
              University Benefits Pool Reserve for NIL Disbursements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-3xl font-bold text-blue-600">$10.2M</div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div>
                <div className="text-lg font-semibold">$6.8M</div>
                <p className="text-xs text-muted-foreground">Uncommitted Funds</p>
              </div>
              <div>
                <div className="text-lg font-semibold">$3.4M</div>
                <p className="text-xs text-muted-foreground">Available to Commit</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">Committed Funds Account</CardTitle>
              </div>
              <Badge variant="secondary" className="text-xs">
                Athlete FBO
              </Badge>
            </div>
            <CardDescription className="text-sm">
              Committed but not yet disbursed funds, held for individual athletes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-3xl font-bold text-green-600">$4.6M</div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div>
                <div className="text-lg font-semibold">127</div>
                <p className="text-xs text-muted-foreground">Active Commitments</p>
              </div>
              <div>
                <div className="text-lg font-semibold">$36.2K</div>
                <p className="text-xs text-muted-foreground">Avg. Commitment</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Center & Activity Summary */}
      <div className="grid gap-6 xl:grid-cols-4">
        {/* Statements, Reports & Compliance */}
        <div className="xl:col-span-3">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Statements, Reports & Compliance</CardTitle>
              <CardDescription>Download financial documents, audit trails, and compliance reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* Column 1: Monthly Statements */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">Monthly Statements</h4>
                  <div className="space-y-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left">
                            <FileText className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">January 2025 Benefits Pool</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>January 2025 Benefits Pool Statement (2.4 MB)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left">
                            <FileText className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">January 2025 Committed Funds</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>January 2025 Committed Funds Statement (1.8 MB)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left">
                            <FileText className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">December 2024 Benefits Pool</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>December 2024 Benefits Pool Statement (2.1 MB)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Column 2: Transaction Reports */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">Transaction Reports</h4>
                  <div className="space-y-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left">
                            <Download className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">Q4 2024 Full Report</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Q4 2024 Full Transaction Report (156 KB)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left">
                            <Download className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">Q3 2024 Full Report</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Q3 2024 Full Transaction Report (142 KB)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Column 3: NCAA & Compliance Reports */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">NCAA & Compliance</h4>
                  <div className="space-y-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left">
                            <FileText className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">Benefits Pool Activity</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Benefits Pool Activity Report (Last exported: June 28, 2024)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left">
                            <FileText className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">FBO Account Summary</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>FBO Account Summary (Last exported: June 25, 2024)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left">
                            <FileText className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">Fund Flow Analysis</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Fund Flow Analysis (Last exported: June 20, 2024)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Column 4: Custom Exports */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">Custom Exports</h4>
                  <div className="space-y-2">
                    <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">Custom Date Range</span>
                    </button>

                    <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left">
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">NCAA Compliance Report</span>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Summary Card */}
        <div className="xl:col-span-1">
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle>Activity Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between items-center py-1 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Transactions Today</span>
                  <span className="font-bold">12</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">This Week</span>
                  <span className="font-bold">47</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Failed Transactions</span>
                  <span className="font-bold text-red-600">2</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-muted-foreground">Pending Review</span>
                  <span className="font-bold text-yellow-600">3</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transaction Activity Ledger */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div>
              <CardTitle>Transaction Activity</CardTitle>
              <CardDescription>
                Fund movement activity across Benefits Pool and Committed Funds accounts
              </CardDescription>
            </div>
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-4">
              <div className="relative w-full lg:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto">
                <Select value={accountFilter} onValueChange={setAccountFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Accounts</SelectItem>
                    <SelectItem value="Benefits Pool">Benefits Pool</SelectItem>
                    <SelectItem value="Committed Funds">Committed Funds</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Funding">Funding</SelectItem>
                    <SelectItem value="Internal Transfer">Internal Transfer</SelectItem>
                    <SelectItem value="Disbursement">Disbursement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div className="min-w-[800px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] min-w-[100px] sticky left-0 bg-background z-10">Date</TableHead>
                      <TableHead className="w-[140px] min-w-[140px]">Account</TableHead>
                      <TableHead className="w-[160px] min-w-[160px]">Type</TableHead>
                      <TableHead className="min-w-[250px]">Description</TableHead>
                      <TableHead className="w-[120px] min-w-[120px] text-right">Amount</TableHead>
                      <TableHead className="w-[100px] min-w-[100px]">Status</TableHead>
                      <TableHead className="w-[60px] min-w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium sticky left-0 bg-background z-10">
                          {new Date(transaction.date).toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs whitespace-nowrap">
                            {transaction.account}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(transaction.type)}
                            <Badge className={`${getTypeColor(transaction.type)} text-xs whitespace-nowrap`}>
                              {transaction.type}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div>
                                  <div className="font-medium truncate max-w-[300px]">{transaction.description}</div>
                                  {transaction.reference && (
                                    <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                                      {transaction.reference}
                                    </div>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-sm">
                                <div>
                                  <div className="font-medium">{transaction.description}</div>
                                  {transaction.reference && (
                                    <div className="text-xs text-muted-foreground mt-1">{transaction.reference}</div>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`font-medium whitespace-nowrap ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(transaction.status)} text-xs whitespace-nowrap`}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setSelectedTransaction(transaction)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Transaction Details</DialogTitle>
                                <DialogDescription>Transaction ID: {transaction.id}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Date</label>
                                    <p className="text-sm text-muted-foreground">
                                      {new Date(transaction.date).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Account</label>
                                    <p className="text-sm text-muted-foreground">{transaction.account}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Type</label>
                                    <p className="text-sm text-muted-foreground">{transaction.type}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Amount</label>
                                    <p
                                      className={`text-sm font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                                    >
                                      {transaction.amount > 0 ? "+" : ""}$
                                      {Math.abs(transaction.amount).toLocaleString()}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Status</label>
                                    <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Description</label>
                                  <p className="text-sm text-muted-foreground">{transaction.description}</p>
                                </div>
                                {transaction.reference && (
                                  <div>
                                    <label className="text-sm font-medium">Reference</label>
                                    <p className="text-sm text-muted-foreground">{transaction.reference}</p>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
