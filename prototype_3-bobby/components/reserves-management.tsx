import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Wallet, TrendingUp } from "lucide-react"

const mockReserves = [
  {
    id: 1,
    accountOwner: "Marcus Johnson",
    balance: "$45,000.00",
    accountType: "NIL Reserve",
    createdDate: "2024-01-15",
    status: "active",
  },
  {
    id: 2,
    accountOwner: "Nike Inc.",
    balance: "$250,000.00",
    accountType: "Sponsor Reserve",
    createdDate: "2024-01-10",
    status: "active",
  },
  {
    id: 3,
    accountOwner: "University of Kentucky",
    balance: "$100,000.00",
    accountType: "University Reserve",
    createdDate: "2024-01-08",
    status: "active",
  },
  {
    id: 4,
    accountOwner: "Sarah Williams",
    balance: "$8,500.00",
    accountType: "NIL Reserve",
    createdDate: "2024-01-12",
    status: "pending",
  },
]

export function ReservesManagement() {
  const totalBalance = mockReserves.reduce((sum, account) => {
    return sum + Number.parseFloat(account.balance.replace(/[$,]/g, ""))
  }, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reserve Accounts</h1>
          <p className="text-muted-foreground">Manage virtual reserve accounts for entities and contracts</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Account
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reserved</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across {mockReserves.length} accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockReserves.filter((account) => account.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockReserves.filter((account) => account.status === "pending").length} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(totalBalance / mockReserves.length).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Per account</p>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reserve Accounts</CardTitle>
          <CardDescription>Virtual accounts holding funds for contracts and disbursements</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Owner</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Account Type</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReserves.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.accountOwner}</TableCell>
                  <TableCell className="font-mono">{account.balance}</TableCell>
                  <TableCell>{account.accountType}</TableCell>
                  <TableCell>{new Date(account.createdDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={account.status === "active" ? "default" : "secondary"}>{account.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
