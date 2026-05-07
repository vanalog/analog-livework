"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"
import { DollarSign, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface CompensationData {
  totalContractValue: number
  sources: {
    revShare: number
    enhancements: number
    nilTotal: number
  }
  nilStatus: {
    committed: number
    gap: number
    percentFunded: number
  }
  seasons: Array<{
    season: string
    revShare: number
    enhancements: number
    nilIndicated: number
    nilCommitted: number
    nilGap: number
    total: number
  }>
  contractType: string
  hasNilComponent: boolean
  hasNilGap: boolean
}

interface CompensationOverviewCardProps {
  data: CompensationData
}

const COLORS = {
  revShare: "hsl(var(--chart-1))", // Primary blue
  enhancements: "hsl(var(--chart-2))", // Light blue
  nilCommitted: "hsl(var(--chart-3))", // Lighter blue
  nilGap: "hsl(var(--chart-4))", // Lightest blue (replacing amber)
}

// Helper function to format currency with M for millions, K for thousands
const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}MM`
  }
  return `$${(value / 1000).toFixed(0)}K`
}

export function CompensationOverviewCard({ data }: CompensationOverviewCardProps) {
  const universityCommitted = data.sources.revShare + data.sources.enhancements
  const osuCommitted = universityCommitted; // Declaring the osuCommitted variable

  // Prepare data for compensation sources donut
  const sourcesData = [
    { name: "RevShare", value: data.sources.revShare, color: COLORS.revShare },
    { name: "Enhancements", value: data.sources.enhancements, color: COLORS.enhancements },
    { name: "NIL (Total indicated)", value: data.sources.nilTotal, color: COLORS.nilCommitted },
  ].filter((item) => item.value > 0)

  // Prepare data for NIL funding status donut
  const nilStatusData = [
    { name: "NIL Committed", value: data.nilStatus.committed, color: COLORS.nilCommitted },
    { name: "NIL Gap (unfunded)", value: data.nilStatus.gap, color: COLORS.nilGap },
  ].filter((item) => item.value > 0)

  // Prepare data for stacked bar chart
  const seasonData = data.seasons.map((season) => ({
    season: season.season,
    RevShare: season.revShare,
    Enhancements: season.enhancements,
    "NIL Committed": season.nilCommitted,
    "NIL Gap": season.nilGap,
  }))

  // Calculate max season value for consistent scale
  const maxSeasonValue = Math.max(...data.seasons.map((s) => s.total))

  const chartConfig = {
    RevShare: {
      label: "RevShare",
      color: COLORS.revShare,
    },
    Enhancements: {
      label: "Enhancements",
      color: COLORS.enhancements,
    },
    "NIL Committed": {
      label: "NIL Committed",
      color: COLORS.nilCommitted,
    },
    "NIL Gap": {
      label: "NIL Gap",
      color: COLORS.nilGap,
    },
  }

  const renderCenterLabel = (value: string, subtext: string, isWarning = false) => {
    return (
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
        <tspan x="50%" dy="-0.5em" className="text-lg font-bold" fill={isWarning ? COLORS.nilGap : "currentColor"}>
          {value}
        </tspan>
        <tspan x="50%" dy="1.5em" className="text-xs" fill="hsl(var(--muted-foreground))">
          {subtext}
        </tspan>
      </text>
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-white p-2 shadow-sm">
          <div className="grid gap-2">
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
            </div>
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-xs text-muted-foreground">{entry.name}</span>
                </div>
                <span className="ml-auto text-xs font-medium">${Number(entry.value).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Compensation Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Total Contract Value */}
          <div className="bg-muted/30 rounded-lg border p-3 text-center">
            <div className="text-2xl font-bold text-foreground">{formatCurrency(data.totalContractValue)}</div>
            <div className="text-xs text-muted-foreground mt-1">Total Value</div>
          </div>

          {/* University Committed */}
          <div className="bg-muted/30 rounded-lg border p-3 text-center">
            <div className="text-2xl font-bold text-foreground">{formatCurrency(universityCommitted)}</div>
            <div className="text-xs text-muted-foreground mt-1">University Committed</div>
          </div>

          {/* NIL Committed */}
          <div className="bg-muted/30 rounded-lg border p-3 text-center">
            <div className="text-2xl font-bold text-foreground">{formatCurrency(data.nilStatus.committed)}</div>
            <div className="text-xs text-muted-foreground mt-1">NIL Committed</div>
          </div>

          {/* NIL Gap */}
          <div className="bg-muted/30 rounded-lg border p-3 text-center">
            <div
              className={`text-2xl font-bold flex items-center justify-center gap-1 ${data.nilStatus.gap > 0 ? "text-blue-600" : "text-muted-foreground"}`}
            >
              {data.nilStatus.gap > 0 && <AlertTriangle className="w-4 h-4" />}
              {formatCurrency(data.nilStatus.gap)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">NIL Gap</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Left Donut: Compensation Sources */}
          <div className="space-y-3">
            <div className="h-[150px]">
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={sourcesData}
                    cx="50%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="75%"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {sourcesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  {renderCenterLabel(formatCurrency(data.totalContractValue), "Total Value")}
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="text-sm font-semibold text-center mb-2">Compensation Sources</p>
              <div className="space-y-1.5">
                {sourcesData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Donut: NIL Funding Status */}
          <div className="space-y-3">
            {data.hasNilComponent ? (
              <>
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie
                        data={nilStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius="55%"
                        outerRadius="75%"
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {nilStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      {renderCenterLabel(`${data.nilStatus.percentFunded}%`, "Funded", data.nilStatus.gap > 0)}
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <p className="text-sm font-semibold text-center mb-2">NIL Funding Status</p>
                  <div className="space-y-1.5">
                    {nilStatusData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 ${item.name === "NIL Gap (unfunded)" ? "rounded-full" : "rounded-full"}`}
                            style={{
                              backgroundColor: item.color,
                              backgroundImage:
                                item.name === "NIL Gap (unfunded)"
                                  ? "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 4px)"
                                  : undefined,
                            }}
                          />
                          <span className="text-muted-foreground">{item.name}</span>
                        </div>
                        <span className="font-medium">{formatCurrency(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-[150px] flex items-center justify-center">
                <div className="text-center">
                  <Info className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No NIL Component</p>
                  <p className="text-xs text-muted-foreground mt-1">100% Revenue Sharing</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Season-by-Season Stacked Horizontal Bars */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Distribution by Season</h4>
          <div className="h-[120px]">
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={seasonData} layout="vertical" margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <XAxis type="number" domain={[0, maxSeasonValue]} hide />
                <YAxis type="category" dataKey="season" width={55} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Bar dataKey="RevShare" stackId="a" fill={COLORS.revShare} radius={[0, 0, 0, 0]} barSize={20} />
                <Bar dataKey="Enhancements" stackId="a" fill={COLORS.enhancements} radius={[0, 0, 0, 0]} barSize={20} />
                <Bar
                  dataKey="NIL Committed"
                  stackId="a"
                  fill={COLORS.nilCommitted}
                  radius={[0, 0, 0, 0]}
                  barSize={20}
                />
                <Bar
                  dataKey="NIL Gap"
                  stackId="a"
                  fill={COLORS.nilGap}
                  radius={[0, 8, 8, 0]}
                  fillOpacity={0.8}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.revShare }} />
              <span className="text-muted-foreground">RevShare</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.enhancements }} />
              <span className="text-muted-foreground">Enhancements</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.nilCommitted }} />
              <span className="text-muted-foreground">NIL Committed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.nilGap }} />
              <span className="text-muted-foreground">NIL Gap</span>
            </div>
          </div>
        </div>

        {/* Section 4: Compact Reference Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="h-9 text-xs">Season</TableHead>
                <TableHead className="h-9 text-xs text-right">RevShare</TableHead>
                <TableHead className="h-9 text-xs text-right">Enhancements</TableHead>
                <TableHead className="h-9 text-xs text-right">NIL Indicated</TableHead>
                <TableHead className="h-9 text-xs text-right">NIL Committed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.seasons.map((season, index) => (
                <TableRow key={index} className="h-9">
                  <TableCell className="text-xs font-medium">{season.season}</TableCell>
                  <TableCell className="text-xs text-right">{formatCurrency(season.revShare)}</TableCell>
                  <TableCell className="text-xs text-right">{formatCurrency(season.enhancements)}</TableCell>
                  <TableCell className="text-xs text-right">{formatCurrency(season.nilIndicated)}</TableCell>
                  <TableCell className="text-xs text-right">{formatCurrency(season.nilCommitted)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-semibold bg-muted/30 h-9">
                <TableCell className="text-xs">Total</TableCell>
                <TableCell className="text-xs text-right">
                  {formatCurrency(data.seasons.reduce((sum, s) => sum + s.revShare, 0))}
                </TableCell>
                <TableCell className="text-xs text-right">
                  {formatCurrency(data.seasons.reduce((sum, s) => sum + s.enhancements, 0))}
                </TableCell>
                <TableCell className="text-xs text-right">
                  {formatCurrency(data.seasons.reduce((sum, s) => sum + s.nilIndicated, 0))}
                </TableCell>
                <TableCell className="text-xs text-right">
                  {formatCurrency(data.seasons.reduce((sum, s) => sum + s.nilCommitted, 0))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Section 5: NIL Status Alert */}
        {data.hasNilComponent && data.hasNilGap && (
          <div className="rounded-lg border-l-4 border-blue-600 bg-blue-50 dark:bg-blue-950/20 p-3">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                  {formatCurrency(data.nilStatus.gap)} NIL indicated but not yet contracted
                </p>
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  {data.contractType} — awaiting sponsor commitment
                </p>
              </div>
            </div>
          </div>
        )}

        {data.hasNilComponent && !data.hasNilGap && (
          <div className="rounded-lg border-l-4 border-green-600 bg-green-50 dark:bg-green-950/20 p-3">
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  All NIL commitments backed by signed contracts
                </p>
              </div>
            </div>
          </div>
        )}

        {!data.hasNilComponent && (
          <div className="rounded-lg border-l-4 border-blue-600 bg-blue-50 dark:bg-blue-950/20 p-3">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  This contract is 100% Revenue Sharing — no external NIL component
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
