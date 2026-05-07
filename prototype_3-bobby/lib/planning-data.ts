// ============================================================
// Planning Data - Cap Budget Management
// ============================================================

// Cap periods are fiscal years: July 1 - June 30
// NIL budgets are calendar years (NIL 2026, NIL 2027)

export interface Team {
  id: string
  name: string
  sport: string
  gender: "men" | "women"
  budget: number // Annual Revenue Share cap budget
  nilBudget: number // Annual NIL marketing budget
}

export interface RosterEntry {
  id: string
  athleteId: string
  athleteName: string
  teamId: string
  position: string
  graduatingYear: number
  // Revenue Share allocations (fiscal year)
  capPeriod1: number // Jul '25 - Jun '26
  capPeriod2: number // Jul '26 - Jun '27
  capPeriod3: number // Jul '27 - Jun '28
  contractStatus: "none" | "in-review" | "active"
  contractId?: string
  // NIL allocations (calendar year)
  nil2026: number
  nil2027: number
  nilIoiStatus: "none" | "pending" | "active"
  nilIoiId?: string
}

// Back-compat: callers outside the team roster still reference this shape.
export interface NilSponsorshipEntry {
  id: string
  athleteId: string
  athleteName: string
  teamId: string
  position: string
  graduatingYear: number
  indicatedAmount: number
  ioiStatus: "none" | "pending" | "active"
  ioiId?: string
}

// Cap period labels (Revenue Share, fiscal years)
export const CAP_PERIODS = [
  { id: "cp1", label: "Jul '25 - Jun '26", shortLabel: "FY26", startDate: "2025-07-01", endDate: "2026-06-30" },
  { id: "cp2", label: "Jul '26 - Jun '27", shortLabel: "FY27", startDate: "2026-07-01", endDate: "2027-06-30" },
  { id: "cp3", label: "Jul '27 - Jun '28", shortLabel: "FY28", startDate: "2027-07-01", endDate: "2028-06-30" },
] as const

// NIL budget years (calendar years)
export const NIL_PERIODS = [
  { id: "nil2026", label: "NIL 2026", shortLabel: "NIL '26", field: "nil2026" as const },
  { id: "nil2027", label: "NIL 2027", shortLabel: "NIL '27", field: "nil2027" as const },
] as const

// Hard-coded team budgets
export const TEAMS: Team[] = [
  {
    id: "mens-basketball",
    name: "Men's Basketball",
    sport: "Men's Basketball",
    gender: "men",
    budget: 3000000, // $3M RS per cap period
    nilBudget: 2000000, // $2M NIL per calendar year
  },
  {
    id: "womens-basketball",
    name: "Women's Basketball",
    sport: "Women's Basketball",
    gender: "women",
    budget: 1300000, // $1.3M RS per cap period
    nilBudget: 800000, // $800K NIL per calendar year
  },
]

// Unified roster: each athlete has Revenue Share AND NIL allocations.
// Intentional mix:
//  - Some athletes have only Revenue Share
//  - Some athletes have only NIL
//  - Some athletes have both
export const ROSTER_ENTRIES: RosterEntry[] = [
  // ---------- Men's Basketball ----------
  // RS active, no NIL
  {
    id: "roster-mb-001",
    athleteId: "mb-001",
    athleteName: "Marcus Johnson",
    teamId: "mens-basketball",
    position: "PG",
    graduatingYear: 2027,
    capPeriod1: 150000,
    capPeriod2: 175000,
    capPeriod3: 200000,
    contractStatus: "active",
    contractId: "contract-mb-001",
    nil2026: 0,
    nil2027: 0,
    nilIoiStatus: "none",
  },
  // RS active + NIL planning
  {
    id: "roster-mb-002",
    athleteId: "mb-002",
    athleteName: "DeAndre Williams",
    teamId: "mens-basketball",
    position: "SG",
    graduatingYear: 2026,
    capPeriod1: 120000,
    capPeriod2: 140000,
    capPeriod3: 0,
    contractStatus: "active",
    contractId: "contract-mb-002",
    nil2026: 75000,
    nil2027: 0,
    nilIoiStatus: "none",
  },
  // RS in-review + NIL active
  {
    id: "roster-mb-003",
    athleteId: "mb-003",
    athleteName: "Jaylen Thompson",
    teamId: "mens-basketball",
    position: "SF",
    graduatingYear: 2028,
    capPeriod1: 100000,
    capPeriod2: 125000,
    capPeriod3: 150000,
    contractStatus: "in-review",
    contractId: "contract-mb-003",
    nil2026: 50000,
    nil2027: 75000,
    nilIoiStatus: "active",
    nilIoiId: "ioi-mb-003",
  },
  // RS planning, no NIL
  {
    id: "roster-mb-004",
    athleteId: "mb-004",
    athleteName: "Tyler Robinson",
    teamId: "mens-basketball",
    position: "PF",
    graduatingYear: 2027,
    capPeriod1: 80000,
    capPeriod2: 100000,
    capPeriod3: 120000,
    contractStatus: "none",
    nil2026: 0,
    nil2027: 0,
    nilIoiStatus: "none",
  },
  // RS planning + NIL planning
  {
    id: "roster-mb-005",
    athleteId: "mb-005",
    athleteName: "Chris Anderson",
    teamId: "mens-basketball",
    position: "C",
    graduatingYear: 2026,
    capPeriod1: 75000,
    capPeriod2: 90000,
    capPeriod3: 0,
    contractStatus: "none",
    nil2026: 40000,
    nil2027: 50000,
    nilIoiStatus: "none",
  },
  // No RS, NIL active only
  {
    id: "roster-mb-006",
    athleteId: "osu-003",
    athleteName: "Jaylen Porter",
    teamId: "mens-basketball",
    position: "PF",
    graduatingYear: 2026,
    capPeriod1: 0,
    capPeriod2: 0,
    capPeriod3: 0,
    contractStatus: "none",
    nil2026: 500000,
    nil2027: 0,
    nilIoiStatus: "active",
    nilIoiId: "ioi-mb-006",
  },
  // No RS, NIL pending only
  {
    id: "roster-mb-007",
    athleteId: "duke-001",
    athleteName: "Cameron Brooks",
    teamId: "mens-basketball",
    position: "PG",
    graduatingYear: 2026,
    capPeriod1: 0,
    capPeriod2: 0,
    capPeriod3: 0,
    contractStatus: "none",
    nil2026: 350000,
    nil2027: 0,
    nilIoiStatus: "pending",
    nilIoiId: "ioi-mb-007",
  },
  // No RS, NIL planning only
  {
    id: "roster-mb-008",
    athleteId: "duke-002",
    athleteName: "Isaiah Washington",
    teamId: "mens-basketball",
    position: "SG",
    graduatingYear: 2027,
    capPeriod1: 0,
    capPeriod2: 0,
    capPeriod3: 0,
    contractStatus: "none",
    nil2026: 150000,
    nil2027: 100000,
    nilIoiStatus: "none",
  },

  // ---------- Women's Basketball ----------
  // RS active, no NIL
  {
    id: "roster-wb-001",
    athleteId: "uconn-wbb-001",
    athleteName: "Jasmine Richardson",
    teamId: "womens-basketball",
    position: "PG",
    graduatingYear: 2026,
    capPeriod1: 160000,
    capPeriod2: 175000,
    capPeriod3: 0,
    contractStatus: "active",
    contractId: "contract-wb-001",
    nil2026: 0,
    nil2027: 0,
    nilIoiStatus: "none",
  },
  // RS active + NIL active
  {
    id: "roster-wb-002",
    athleteId: "sc-wbb-001",
    athleteName: "Kayla Henderson",
    teamId: "womens-basketball",
    position: "PF",
    graduatingYear: 2026,
    capPeriod1: 180000,
    capPeriod2: 200000,
    capPeriod3: 0,
    contractStatus: "active",
    contractId: "contract-wb-002",
    nil2026: 120000,
    nil2027: 0,
    nilIoiStatus: "active",
    nilIoiId: "ioi-wb-002",
  },
  // RS active, no NIL
  {
    id: "roster-wb-003",
    athleteId: "lsu-wbb-001",
    athleteName: "Taylor Brooks",
    teamId: "womens-basketball",
    position: "PF",
    graduatingYear: 2026,
    capPeriod1: 200000,
    capPeriod2: 225000,
    capPeriod3: 0,
    contractStatus: "active",
    contractId: "contract-wb-003",
    nil2026: 0,
    nil2027: 0,
    nilIoiStatus: "none",
  },
  // RS active + NIL planning
  {
    id: "roster-wb-004",
    athleteId: "iowa-wbb-001",
    athleteName: "Kennedy Carter",
    teamId: "womens-basketball",
    position: "PG",
    graduatingYear: 2026,
    capPeriod1: 155000,
    capPeriod2: 170000,
    capPeriod3: 0,
    contractStatus: "active",
    contractId: "contract-wb-004",
    nil2026: 60000,
    nil2027: 0,
    nilIoiStatus: "none",
  },
  // RS active, no NIL
  {
    id: "roster-wb-005",
    athleteId: "stan-wbb-001",
    athleteName: "Cameron Chen",
    teamId: "womens-basketball",
    position: "SF",
    graduatingYear: 2026,
    capPeriod1: 125000,
    capPeriod2: 140000,
    capPeriod3: 0,
    contractStatus: "active",
    contractId: "contract-wb-005",
    nil2026: 0,
    nil2027: 0,
    nilIoiStatus: "none",
  },
  // RS in-review + NIL pending
  {
    id: "roster-wb-006",
    athleteId: "uconn-wbb-002",
    athleteName: "Aaliyah Thompson",
    teamId: "womens-basketball",
    position: "SF",
    graduatingYear: 2027,
    capPeriod1: 105000,
    capPeriod2: 120000,
    capPeriod3: 135000,
    contractStatus: "in-review",
    contractId: "contract-wb-006",
    nil2026: 80000,
    nil2027: 95000,
    nilIoiStatus: "pending",
    nilIoiId: "ioi-wb-006",
  },
  // RS active + NIL active
  {
    id: "roster-wb-007",
    athleteId: "lsu-wbb-002",
    athleteName: "Nia Jackson",
    teamId: "womens-basketball",
    position: "SG",
    graduatingYear: 2027,
    capPeriod1: 110000,
    capPeriod2: 125000,
    capPeriod3: 140000,
    contractStatus: "active",
    contractId: "contract-wb-007",
    nil2026: 90000,
    nil2027: 100000,
    nilIoiStatus: "active",
    nilIoiId: "ioi-wb-007",
  },
  // RS planning + NIL planning
  {
    id: "roster-wb-008",
    athleteId: "iowa-wbb-002",
    athleteName: "Skylar Johnson",
    teamId: "womens-basketball",
    position: "SF",
    graduatingYear: 2027,
    capPeriod1: 95000,
    capPeriod2: 110000,
    capPeriod3: 125000,
    contractStatus: "none",
    nil2026: 50000,
    nil2027: 65000,
    nilIoiStatus: "none",
  },
  // RS active, no NIL
  {
    id: "roster-wb-009",
    athleteId: "texas-wbb-001",
    athleteName: "Jada Williams",
    teamId: "womens-basketball",
    position: "PF",
    graduatingYear: 2026,
    capPeriod1: 120000,
    capPeriod2: 135000,
    capPeriod3: 0,
    contractStatus: "active",
    contractId: "contract-wb-008",
    nil2026: 0,
    nil2027: 0,
    nilIoiStatus: "none",
  },
  // RS in-review, no NIL
  {
    id: "roster-wb-010",
    athleteId: "ucla-wbb-001",
    athleteName: "Alexis Turner",
    teamId: "womens-basketball",
    position: "SG",
    graduatingYear: 2026,
    capPeriod1: 100000,
    capPeriod2: 115000,
    capPeriod3: 0,
    contractStatus: "in-review",
    contractId: "contract-wb-009",
    nil2026: 0,
    nil2027: 0,
    nilIoiStatus: "none",
  },
  // No RS, NIL active only
  {
    id: "roster-wb-011",
    athleteId: "uconn-wbb-003",
    athleteName: "Destiny Williams",
    teamId: "womens-basketball",
    position: "C",
    graduatingYear: 2027,
    capPeriod1: 0,
    capPeriod2: 0,
    capPeriod3: 0,
    contractStatus: "none",
    nil2026: 175000,
    nil2027: 100000,
    nilIoiStatus: "active",
    nilIoiId: "ioi-wb-011",
  },
  // No RS, NIL pending only
  {
    id: "roster-wb-012",
    athleteId: "sc-wbb-002",
    athleteName: "Maya Robinson",
    teamId: "womens-basketball",
    position: "SG",
    graduatingYear: 2027,
    capPeriod1: 0,
    capPeriod2: 0,
    capPeriod3: 0,
    contractStatus: "none",
    nil2026: 185000,
    nil2027: 0,
    nilIoiStatus: "pending",
    nilIoiId: "ioi-wb-012",
  },
  // No RS, NIL active only
  {
    id: "roster-wb-013",
    athleteId: "stan-wbb-002",
    athleteName: "Zoe Martinez",
    teamId: "womens-basketball",
    position: "PG",
    graduatingYear: 2027,
    capPeriod1: 0,
    capPeriod2: 0,
    capPeriod3: 0,
    contractStatus: "none",
    nil2026: 150000,
    nil2027: 75000,
    nilIoiStatus: "active",
    nilIoiId: "ioi-wb-013",
  },
  // No RS, NIL planning only
  {
    id: "roster-wb-014",
    athleteId: "nd-wbb-002",
    athleteName: "Mia Sullivan",
    teamId: "womens-basketball",
    position: "PG",
    graduatingYear: 2027,
    capPeriod1: 0,
    capPeriod2: 0,
    capPeriod3: 0,
    contractStatus: "none",
    nil2026: 140000,
    nil2027: 0,
    nilIoiStatus: "none",
  },
]

// Existing athletes that can be added to rosters (not yet assigned)
export const EXISTING_ATHLETES = [
  // Men's Basketball players not yet on roster
  { id: "mb-009", name: "Devon Carter", sport: "Men's Basketball", position: "PG", graduatingYear: 2028 },
  { id: "mb-010", name: "Andre Mitchell", sport: "Men's Basketball", position: "SG", graduatingYear: 2027 },
  { id: "mb-011", name: "Kevin Brown", sport: "Men's Basketball", position: "SF", graduatingYear: 2029 },
  { id: "mb-012", name: "James Harris", sport: "Men's Basketball", position: "PF", graduatingYear: 2028 },
  { id: "mb-013", name: "Michael Scott", sport: "Men's Basketball", position: "C", graduatingYear: 2027 },
  // Women's Basketball players not yet on roster
  { id: "sc-wbb-003", name: "Brianna Foster", sport: "Women's Basketball", position: "PG", graduatingYear: 2028 },
  { id: "ore-wbb-002", name: "Sierra Thompson", sport: "Women's Basketball", position: "PG", graduatingYear: 2028 },
  { id: "iowa-wbb-003", name: "Jordan Mitchell", sport: "Women's Basketball", position: "C", graduatingYear: 2028 },
  { id: "stan-wbb-003", name: "Simone Washington", sport: "Women's Basketball", position: "C", graduatingYear: 2028 },
  { id: "texas-wbb-002", name: "Avery Coleman", sport: "Women's Basketball", position: "SG", graduatingYear: 2027 },
  { id: "nd-wbb-001", name: "Olivia Burke", sport: "Women's Basketball", position: "SF", graduatingYear: 2026 },
  { id: "ore-wbb-001", name: "Imani Lewis", sport: "Women's Basketball", position: "C", graduatingYear: 2026 },
  { id: "lsu-wbb-003", name: "Morgan Davis", sport: "Women's Basketball", position: "PG", graduatingYear: 2026 },
]

// Helper functions
export function getTeamById(teamId: string): Team | undefined {
  return TEAMS.find(t => t.id === teamId)
}

export function getRosterByTeam(teamId: string): RosterEntry[] {
  return ROSTER_ENTRIES.filter(r => r.teamId === teamId)
}

// Back-compat: planning-landing still calls this. Derive from unified roster —
// only include athletes with any NIL activity.
export function getNilSponsorshipRosterByTeam(teamId: string): NilSponsorshipEntry[] {
  return ROSTER_ENTRIES
    .filter(r => r.teamId === teamId && (r.nil2026 > 0 || r.nil2027 > 0 || r.nilIoiStatus !== "none"))
    .map(r => ({
      id: `nil-${r.id}`,
      athleteId: r.athleteId,
      athleteName: r.athleteName,
      teamId: r.teamId,
      position: r.position,
      graduatingYear: r.graduatingYear,
      indicatedAmount: r.nil2026 + r.nil2027,
      ioiStatus: r.nilIoiStatus,
      ioiId: r.nilIoiId,
    }))
}

export function getTeamTotals(teamId: string) {
  const roster = getRosterByTeam(teamId)
  const team = getTeamById(teamId)
  
  const totals = {
    capPeriod1: roster.reduce((sum, r) => sum + r.capPeriod1, 0),
    capPeriod2: roster.reduce((sum, r) => sum + r.capPeriod2, 0),
    capPeriod3: roster.reduce((sum, r) => sum + r.capPeriod3, 0),
    nil2026: roster.reduce((sum, r) => sum + r.nil2026, 0),
    nil2027: roster.reduce((sum, r) => sum + r.nil2027, 0),
  }
  
  const rsAllocated = totals.capPeriod1 + totals.capPeriod2 + totals.capPeriod3
  const nilAllocated = totals.nil2026 + totals.nil2027
  // NOTE: `totalAllocated` and `totalBudget` preserve their original RS-only
  // semantics so existing callers (e.g. planning-landing) keep working.
  // Use the RS/NIL-prefixed fields for the new unified view.
  const rsBudget = team ? team.budget * 3 : 0
  const nilBudget = team ? team.nilBudget * 2 : 0
  const totalBudget = rsBudget
  const totalAllocated = rsAllocated
  const grandAllocated = rsAllocated + nilAllocated
  const grandBudget = rsBudget + nilBudget
  
  return {
    ...totals,
    rsAllocated,
    nilAllocated,
    totalAllocated,
    totalBudget,
    rsBudget,
    nilBudget,
    grandAllocated,
    grandBudget,
    remaining: totalBudget - totalAllocated,
    athleteCount: roster.length,
    budget: team?.budget || 0,
    nilBudgetPerYear: team?.nilBudget || 0,
  }
}

export function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`
  }
  return `$${amount.toLocaleString()}`
}

export function formatCurrencyFull(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
