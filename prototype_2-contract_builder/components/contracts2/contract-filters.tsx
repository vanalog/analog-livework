"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface FilterState {
  statuses: string[]
  holders: string[]
  sources: string[]
  athletes: string[]
  sports: string[]
  daysWithHolderMin: number | null
  daysWithHolderMax: number | null
  valueMin: number | null
  valueMax: number | null
  showUrgentOnly: boolean
  showFlaggedOnly: boolean // Added showFlaggedOnly filter
}

interface Contract {
  id: string
  currentHolder: string
  agencyName?: string
  sourceName?: string
  athlete: string
  sport?: string
  negotiationStatus?: string
  activationStatus?: string
  stage: "negotiation" | "activation"
}

interface ContractFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  activeTab?: "negotiation" | "activation"
  allContracts: Contract[]
}

export function ContractFilters({
  filters,
  onFiltersChange,
  activeTab = "negotiation",
  allContracts,
}: ContractFiltersProps) {
  // Extract unique values for filter options
  const uniqueHolders = Array.from(new Set(allContracts.map((c) => c.currentHolder))).sort()
  const uniqueAgencies = Array.from(new Set(allContracts.map((c) => c.agencyName || c.sourceName || "")))
    .filter(Boolean)
    .sort()
  const uniqueAthletes = Array.from(new Set(allContracts.map((c) => c.athlete))).sort()
  const uniqueSports = Array.from(new Set(allContracts.map((c) => c.sport).filter(Boolean) as string[])).sort()

  const negotiationStatuses = [
    { value: "draft-sent", label: "Draft Sent" },
    { value: "in-redlining", label: "In Redlining" },
    { value: "internal-review", label: "Internal Review" },
    { value: "final-review", label: "Final Review" },
    { value: "ready-to-sign", label: "Ready to Sign" },
    { value: "executed", label: "Executed" },
  ]

  const activationStatuses = [
    { value: "extracting", label: "Extracting Obligations" },
    { value: "review-obligations", label: "Review Obligations" },
    { value: "ready-to-activate", label: "Ready to Activate" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
  ]

  const statusOptions = activeTab === "negotiation" ? negotiationStatuses : activationStatuses

  const handleStatusToggle = (status: string) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status]
    onFiltersChange({ ...filters, statuses: newStatuses })
  }

  const handleHolderToggle = (holder: string) => {
    const newHolders = filters.holders.includes(holder)
      ? filters.holders.filter((h) => h !== holder)
      : [...filters.holders, holder]
    onFiltersChange({ ...filters, holders: newHolders })
  }

  const handleSourceToggle = (source: string) => {
    const newSources = filters.sources.includes(source)
      ? filters.sources.filter((s) => s !== source)
      : [...filters.sources, source]
    onFiltersChange({ ...filters, sources: newSources })
  }

  const handleAthleteToggle = (athlete: string) => {
    const newAthletes = filters.athletes.includes(athlete)
      ? filters.athletes.filter((a) => a !== athlete)
      : [...filters.athletes, athlete]
    onFiltersChange({ ...filters, athletes: newAthletes })
  }

  const handleSportToggle = (sport: string) => {
    const newSports = filters.sports.includes(sport)
      ? filters.sports.filter((s) => s !== sport)
      : [...filters.sports, sport]
    onFiltersChange({ ...filters, sports: newSports })
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Status Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Status</Label>
            <div className="space-y-2">
              {statusOptions.map((status) => (
                <div key={status.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status.value}`}
                    checked={filters.statuses.includes(status.value)}
                    onCheckedChange={() => handleStatusToggle(status.value)}
                  />
                  <label
                    htmlFor={`status-${status.value}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {status.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Current Holder Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Current Holder</Label>
            <div className="max-h-48 space-y-2 overflow-y-auto">
              {uniqueHolders.map((holder) => (
                <div key={holder} className="flex items-center space-x-2">
                  <Checkbox
                    id={`holder-${holder}`}
                    checked={filters.holders.includes(holder)}
                    onCheckedChange={() => handleHolderToggle(holder)}
                  />
                  <label
                    htmlFor={`holder-${holder}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {holder}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Agency Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Agency</Label>
            <div className="max-h-48 space-y-2 overflow-y-auto">
              {uniqueAgencies.map((agency) => (
                <div key={agency} className="flex items-center space-x-2">
                  <Checkbox
                    id={`source-${agency}`}
                    checked={filters.sources.includes(agency)}
                    onCheckedChange={() => handleSourceToggle(agency)}
                  />
                  <label
                    htmlFor={`source-${agency}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {agency}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Athlete Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Athlete</Label>
            <div className="max-h-48 space-y-2 overflow-y-auto">
              {uniqueAthletes.map((athlete) => (
                <div key={athlete} className="flex items-center space-x-2">
                  <Checkbox
                    id={`athlete-${athlete}`}
                    checked={filters.athletes.includes(athlete)}
                    onCheckedChange={() => handleAthleteToggle(athlete)}
                  />
                  <label
                    htmlFor={`athlete-${athlete}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {athlete}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Sport Filter */}
          {uniqueSports.length > 0 && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Sport</Label>
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {uniqueSports.map((sport) => (
                  <div key={sport} className="flex items-center space-x-2">
                    <Checkbox
                      id={`sport-${sport}`}
                      checked={filters.sports.includes(sport)}
                      onCheckedChange={() => handleSportToggle(sport)}
                    />
                    <label
                      htmlFor={`sport-${sport}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {sport}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Days with Holder Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Days with Holder</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="days-min" className="text-xs text-muted-foreground">
                  Min
                </Label>
                <Input
                  id="days-min"
                  type="number"
                  placeholder="0"
                  value={filters.daysWithHolderMin ?? ""}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      daysWithHolderMin: e.target.value ? Number.parseInt(e.target.value) : null,
                    })
                  }
                  min={0}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="days-max" className="text-xs text-muted-foreground">
                  Max
                </Label>
                <Input
                  id="days-max"
                  type="number"
                  placeholder="30"
                  value={filters.daysWithHolderMax ?? ""}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      daysWithHolderMax: e.target.value ? Number.parseInt(e.target.value) : null,
                    })
                  }
                  min={0}
                />
              </div>
            </div>
          </div>

          {/* Contract Value Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Contract Value</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="value-min" className="text-xs text-muted-foreground">
                  Min ($)
                </Label>
                <Input
                  id="value-min"
                  type="number"
                  placeholder="0"
                  value={filters.valueMin ?? ""}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      valueMin: e.target.value ? Number.parseInt(e.target.value) : null,
                    })
                  }
                  min={0}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="value-max" className="text-xs text-muted-foreground">
                  Max ($)
                </Label>
                <Input
                  id="value-max"
                  type="number"
                  placeholder="1000000"
                  value={filters.valueMax ?? ""}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      valueMax: e.target.value ? Number.parseInt(e.target.value) : null,
                    })
                  }
                  min={0}
                />
              </div>
            </div>
          </div>

          {/* Priority Filters (for negotiation tab) */}
          {activeTab === "negotiation" && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Priority</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="flagged-only"
                    checked={filters.showFlaggedOnly}
                    onCheckedChange={(checked) => onFiltersChange({ ...filters, showFlaggedOnly: checked as boolean })}
                  />
                  <label
                    htmlFor="flagged-only"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                  >
                    Show Flagged Only
                    <Badge
                      variant="secondary"
                      className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                    >
                      ⭐
                    </Badge>
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="urgent-only"
                    checked={filters.showUrgentOnly}
                    onCheckedChange={(checked) => onFiltersChange({ ...filters, showUrgentOnly: checked as boolean })}
                  />
                  <label
                    htmlFor="urgent-only"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                  >
                    Show Urgent Only
                    <Badge variant="destructive" className="text-xs">
                      4+ days
                    </Badge>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
