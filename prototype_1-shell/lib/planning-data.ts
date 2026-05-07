// ============================================================
// Planning Data - Cap Budget Management
// ============================================================

// Cap periods are fiscal years: July 1 - June 30
// Current cap period starts July 1, 2025

export interface Team {
  id: string
  name: string
  sport: string
  gender: "men" | "women"
  budget: number // Annual cap budget for this team
}

export interface RosterEntry {
  id: string
  athleteId: string
  athleteName: string
  teamId: string
  position: string
  graduatingYear: number
  capPeriod1: number // Jul '25 - Jun '26
  capPeriod2: number // Jul '26 - Jun '27
  capPeriod3: number // Jul '27 - Jun '28
  contractStatus: "none" | "in-review" | "active"
  contractId?: string
}

export interface NilSponsorshipEntry {
  id: string
  athleteId: string
  athleteName: string
  teamId: string
  position: string
  graduatingYear: number
  indicatedAmount: number // Total indicated NIL sponsorship value
  ioiStatus: "none" | "pending" | "active"
  ioiId?: string
}

// Cap period labels
export const CAP_PERIODS = [
  { id: "cp1", label: "Jul '25 - Jun '26", shortLabel: "FY26", startDate: "2025-07-01", endDate: "2026-06-30" },
  { id: "cp2", label: "Jul '26 - Jun '27", shortLabel: "FY27", startDate: "2026-07-01", endDate: "2027-06-30" },
  { id: "cp3", label: "Jul '27 - Jun '28", shortLabel: "FY28", startDate: "2027-07-01", endDate: "2028-06-30" },
] as const

// Hard-coded team budgets
export const TEAMS: Team[] = [
  {
    id: "mens-basketball",
    name: "Men's Basketball",
    sport: "Basketball",
    gender: "men",
    budget: 3000000, // $3M
  },
  {
    id: "womens-basketball",
    name: "Women's Basketball",
    sport: "Basketball",
    gender: "women",
    budget: 1300000, // $1.3M
  },
]

// Mock roster data - athletes with their cap period allocations
export const ROSTER_ENTRIES: RosterEntry[] = [
  // Men's Basketball - Active contracts
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
  },
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
  },
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
  },
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
  },
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
  },
  
  // Women's Basketball
  {
    id: "roster-wb-001",
    athleteId: "wb-001",
    athleteName: "Aaliyah Davis",
    teamId: "womens-basketball",
    position: "PG",
    graduatingYear: 2027,
    capPeriod1: 100000,
    capPeriod2: 120000,
    capPeriod3: 140000,
    contractStatus: "active",
    contractId: "contract-wb-001",
  },
  {
    id: "roster-wb-002",
    athleteId: "wb-002",
    athleteName: "Jordan Mitchell",
    teamId: "womens-basketball",
    position: "SG",
    graduatingYear: 2026,
    capPeriod1: 85000,
    capPeriod2: 95000,
    capPeriod3: 0,
    contractStatus: "active",
    contractId: "contract-wb-002",
  },
  {
    id: "roster-wb-003",
    athleteId: "wb-003",
    athleteName: "Maya Thompson",
    teamId: "womens-basketball",
    position: "SF",
    graduatingYear: 2028,
    capPeriod1: 60000,
    capPeriod2: 75000,
    capPeriod3: 90000,
    contractStatus: "none",
  },
  {
    id: "roster-wb-004",
    athleteId: "wb-004",
    athleteName: "Taylor Williams",
    teamId: "womens-basketball",
    position: "PF",
    graduatingYear: 2027,
    capPeriod1: 50000,
    capPeriod2: 65000,
    capPeriod3: 80000,
    contractStatus: "in-review",
    contractId: "contract-wb-004",
  },
]

// NIL Sponsorship roster - Indications of Interest
// Uses real beneficiary IDs that exist in the system
export const NIL_SPONSORSHIP_ENTRIES: NilSponsorshipEntry[] = [
  // Men's Basketball - Some with active IOIs (using real beneficiary IDs)
  {
    id: "nil-mb-001",
    athleteId: "osu-003", // Jaylen Porter - Basketball
    athleteName: "Jaylen Porter",
    teamId: "mens-basketball",
    position: "PF",
    graduatingYear: 2026,
    indicatedAmount: 500000,
    ioiStatus: "active",
    ioiId: "ioi-mb-001",
  },
  {
    id: "nil-mb-002",
    athleteId: "duke-001", // Cameron Brooks - Basketball
    athleteName: "Cameron Brooks",
    teamId: "mens-basketball",
    position: "PG",
    graduatingYear: 2026,
    indicatedAmount: 350000,
    ioiStatus: "pending",
    ioiId: "ioi-mb-002",
  },
  {
    id: "nil-mb-003",
    athleteId: "duke-002", // Isaiah Washington - Basketball
    athleteName: "Isaiah Washington",
    teamId: "mens-basketball",
    position: "SG",
    graduatingYear: 2027,
    indicatedAmount: 150000,
    ioiStatus: "none",
  },
  // Women's Basketball
  {
    id: "nil-wb-001",
    athleteId: "osu-001", // Darius Thornton - for demo, using existing ID
    athleteName: "Darius Thornton",
    teamId: "womens-basketball",
    position: "WR",
    graduatingYear: 2027,
    indicatedAmount: 250000,
    ioiStatus: "active",
    ioiId: "ioi-wb-001",
  },
  {
    id: "nil-wb-002",
    athleteId: "osu-002", // Malik Crawford
    athleteName: "Malik Crawford",
    teamId: "womens-basketball",
    position: "QB",
    graduatingYear: 2026,
    indicatedAmount: 100000,
    ioiStatus: "none",
  },
]

// Existing athletes that can be added to rosters
export const EXISTING_ATHLETES = [
  // Men's Basketball players not yet on roster
  { id: "mb-006", name: "Devon Carter", sport: "Basketball", position: "PG", graduatingYear: 2028 },
  { id: "mb-007", name: "Andre Mitchell", sport: "Basketball", position: "SG", graduatingYear: 2027 },
  { id: "mb-008", name: "Kevin Brown", sport: "Basketball", position: "SF", graduatingYear: 2029 },
  { id: "mb-009", name: "James Harris", sport: "Basketball", position: "PF", graduatingYear: 2028 },
  { id: "mb-010", name: "Michael Scott", sport: "Basketball", position: "C", graduatingYear: 2027 },
  // Women's Basketball players not yet on roster
  { id: "wb-005", name: "Brianna Jackson", sport: "Basketball", position: "PG", graduatingYear: 2028 },
  { id: "wb-006", name: "Destiny Clark", sport: "Basketball", position: "SG", graduatingYear: 2027 },
  { id: "wb-007", name: "Kennedy White", sport: "Basketball", position: "SF", graduatingYear: 2029 },
  { id: "wb-008", name: "Jasmine Lee", sport: "Basketball", position: "PF", graduatingYear: 2028 },
  { id: "wb-009", name: "Morgan Taylor", sport: "Basketball", position: "C", graduatingYear: 2027 },
]

// Helper functions
export function getTeamById(teamId: string): Team | undefined {
  return TEAMS.find(t => t.id === teamId)
}

export function getRosterByTeam(teamId: string): RosterEntry[] {
  return ROSTER_ENTRIES.filter(r => r.teamId === teamId)
}

export function getNilSponsorshipRosterByTeam(teamId: string): NilSponsorshipEntry[] {
  return NIL_SPONSORSHIP_ENTRIES.filter(r => r.teamId === teamId)
}

export function getTeamTotals(teamId: string) {
  const roster = getRosterByTeam(teamId)
  const team = getTeamById(teamId)
  
  const totals = {
    capPeriod1: roster.reduce((sum, r) => sum + r.capPeriod1, 0),
    capPeriod2: roster.reduce((sum, r) => sum + r.capPeriod2, 0),
    capPeriod3: roster.reduce((sum, r) => sum + r.capPeriod3, 0),
  }
  
  const totalAllocated = totals.capPeriod1 + totals.capPeriod2 + totals.capPeriod3
  const totalBudget = team ? team.budget * 3 : 0 // 3 cap periods
  
  return {
    ...totals,
    totalAllocated,
    totalBudget,
    remaining: totalBudget - totalAllocated,
    athleteCount: roster.length,
    budget: team?.budget || 0,
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
