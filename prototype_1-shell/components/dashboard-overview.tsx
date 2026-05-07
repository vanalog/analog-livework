import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  ArrowRight,
  Wallet,
  DollarSign,
  TrendingUp,
  Building,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react"
import Link from "next/link"

const mockFundingActivity = [
  {
    id: 1,
    type: "Deposit",
    sponsor: "Nike Basketball Division",
    amount: 250000,
    date: "2024-06-02",
    icon: ArrowDownLeft,
    color: "text-green-600",
  },
  {
    id: 2,
    type: "Allocation",
    sponsor: "TechStart Solutions",
    athlete: "Jessica Chen",
    amount: 22000,
    date: "2024-06-01",
    icon: ArrowUpRight,
    color: "text-orange-600",
  },
  {
    id: 3,
    type: "Deposit",
    sponsor: "Elite Fitness Equipment Co.",
    amount: 150000,
    date: "2024-05-30",
    icon: ArrowDownLeft,
    color: "text-green-600",
  },
  {
    id: 4,
    type: "Allocation",
    sponsor: "Nike Basketball Division",
    athlete: "Marcus Johnson",
    amount: 45000,
    date: "2024-05-28",
    icon: ArrowUpRight,
    color: "text-orange-600",
  },
]

export function DashboardOverview() {
  const totalPreFunded = 1375000
  const totalAllocated = 352000
  const totalAvailable = 1023000

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Analog</h1>
        <p className="text-muted-foreground">Financial infrastructure platform for NIL contracts</p>
      </div>

      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Sponsor Funds Overview
              </CardTitle>
              <CardDescription>Real-time view of sponsor pre-funding and allocations</CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/funds">View All Funds</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pre-Funded</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(totalPreFunded / 1000).toFixed(0)}K</div>
                <p className="text-xs text-muted-foreground">Across all sponsors</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Allocated (Not Disbursed)</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">${(totalAllocated / 1000).toFixed(0)}K</div>
                <p className="text-xs text-muted-foreground">Committed to athletes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available for Allocation</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${(totalAvailable / 1000).toFixed(0)}K</div>
                <p className="text-xs text-muted-foreground">Ready to allocate</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Funding Activity</CardTitle>
              <CardDescription>Latest deposits and allocations</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/funds?tab=history" className="gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockFundingActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${activity.color}`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{activity.type}</span>
                      <Badge variant="outline" className="gap-1">
                        <Building className="w-3 h-3" />
                        {activity.sponsor}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.athlete ? `to ${activity.athlete} • ` : ""}
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className={`text-right font-mono font-semibold ${activity.color}`}>
                  {activity.type === "Deposit" ? "+" : "-"}${activity.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-dashed">
        <CardHeader>
          <CardTitle>Phase 1: Contract Vetting</CardTitle>
          <CardDescription>The current release focuses on contract vetting functionality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            In this initial phase, you can upload NIL contracts for AI-powered analysis and vetting. The system will
            extract key information and provide a recommendation.
          </p>

          <div className="flex justify-center py-6">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>

          <div className="flex justify-center">
            <Button asChild>
              <Link href="/contracts" className="gap-2">
                Go to Contract Vetting <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>Features planned for future releases</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <span>Entity Management (Athletes, Sponsors, Universities)</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <span>Financial Operations (Accounts, Transactions)</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <span>Workflow Automation (Onboarding, Disbursement)</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <span>Advanced Analytics and Reporting</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Analog</CardTitle>
            <CardDescription>Financial infrastructure for NIL contracts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Analog provides a comprehensive platform for managing Name, Image, and Likeness (NIL) contracts between
              athletes, sponsors, and universities. Our AI-powered tools streamline the contract vetting process,
              ensuring compliance and transparency.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
