"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, ArrowUpRight, ArrowDownLeft, CreditCard, Building, TrendingDown } from "lucide-react"

const mockTransactions = [
  {
    id: 1,
    date: "2024-01-15",
    amount: "-$45,000.00",
    direction: "ACH Push",
    toFrom: "Marcus Johnson",
    method: "ACH",
    status: "completed",
    description: "NIL Contract Payment",
  },
  {
    id: 2,
    date: "2024-01-14",
    amount: "+$250,000.00",
    direction: "ACH Pull",
    toFrom: "Nike Inc.",
    method: "Wire",
    status: "completed",
    description: "Sponsor Funding",
  },
  {
    id: 3,
    date: "2024-01-13",
    amount: "-$8,500.00",
    direction: "ACH Push",
    toFrom: "Sarah Williams",
    method: "ACH",
    status: "pending",
    description: "NIL Contract Payment",
  },
  {
    id: 4,
    date: "2024-01-12",
    amount: "+$100,000.00",
    direction: "ACH Pull",
    toFrom: "University of Kentucky",
    method: "ACH",
    status: "completed",
    description: "University Funding",
  },
  {
    id: 5,
    date: "2024-01-11",
    amount: "-$12,500.00",
    direction: "ACH Push",
    toFrom: "David Chen",
    method: "ACH",
    status: "completed",
    description: "NIL Contract Payment",
  },
]

export function TransactionsManagement() {
  const totalIn = mockTransactions
    .filter((t) => t.amount.startsWith("+"))
    .reduce((sum, t) => sum + Number.parseFloat(t.amount.replace(/[+$,]/g, "")), 0)

  const totalOut = mockTransactions
    .filter((t) => t.amount.startsWith("-"))
    .reduce((sum, t) => sum + Math.abs(Number.parseFloat(t.amount.replace(/[-$,]/g, ""))), 0)

  const netCash = totalIn - totalOut

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">Monitor all financial transactions and cash flow</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Cash This Month</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${netCash.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {netCash > 0 ? "+" : ""}${(netCash * 0.12).toLocaleString()} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Money In</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+${totalIn.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From sponsors and universities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Money Out</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">-${totalOut.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">To athletes and entities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTransactions.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>All financial transactions and transfers</CardDescription>
          <div className="flex items-center gap-4 pt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search transactions..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>To/From</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell
                    className={`font-mono font-medium ${
                      transaction.amount.startsWith("+") ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.amount}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {transaction.direction === "ACH Push" ? (
                        <ArrowUpRight className="w-4 h-4 text-red-500" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4 text-green-500" />
                      )}
                      {transaction.direction}
                    </div>
                  </TableCell>
                  <TableCell>{transaction.toFrom}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {transaction.method === "Wire" ? (
                        <Building className="w-4 h-4" />
                      ) : (
                        <CreditCard className="w-4 h-4" />
                      )}
                      {transaction.method}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{transaction.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
