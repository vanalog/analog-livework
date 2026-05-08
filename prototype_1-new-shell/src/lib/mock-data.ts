// @ts-nocheck
// Mock data for prototype frontend
// This file contains sample data that mimics the backend API responses
// TypeScript checking disabled for prototype flexibility

import type { 
  Thread, 
  StudentAthleteWithContracts, 
  Participant,
  ThreadPost,
  ContractType,
  ContractGroup,
  CurrentHolder,
  ThreadStatus,
  Sport,
  ParticipantRole
} from "@/types/api-types";

// ============================================================================
// AGENCIES - Will become `agencies` table in Supabase
// ============================================================================
export const mockAgencies = [
  { uuid: "agency-001", name: "Elite Sports Management", contact_email: "contact@elitesports.com" },
  { uuid: "agency-002", name: "Prime Athletes Group", contact_email: "info@primeathletes.com" },
  { uuid: "agency-003", name: "Champion Representation", contact_email: "team@championrep.com" },
  { uuid: "agency-004", name: "Victory Sports Agency", contact_email: "hello@victorysports.com" },
  { uuid: "agency-005", name: "NextGen Athletics", contact_email: "support@nextgenathletics.com" },
  { uuid: "agency-006", name: "Gridiron Partners", contact_email: "deals@gridironpartners.com" },
  { uuid: "agency-007", name: "Courtside Management", contact_email: "info@courtsidemanagement.com" },
  { uuid: "agency-008", name: "Hoops & Dreams Agency", contact_email: "contact@hoopsdreams.com" },
];

// Helper to get agency by uuid
function getAgency(uuid: string) {
  return mockAgencies.find(a => a.uuid === uuid);
}

// ============================================================================
// UNIVERSITIES - Will become `universities` table in Supabase
// ============================================================================
export const mockUniversities = [
  { uuid: "univ-001", name: "University of Florida", abbreviation: "UF", conference: "SEC" },
  { uuid: "univ-002", name: "Ohio State University", abbreviation: "OSU", conference: "Big Ten" },
  { uuid: "univ-003", name: "University of Alabama", abbreviation: "UA", conference: "SEC" },
  { uuid: "univ-004", name: "University of Michigan", abbreviation: "UM", conference: "Big Ten" },
  { uuid: "univ-005", name: "Duke University", abbreviation: "Duke", conference: "ACC" },
];

// ============================================================================
// BRANDS/COMPANIES - Will become `brands` table in Supabase
// ============================================================================
export const mockBrands = [
  { uuid: "brand-001", name: "Nike", industry: "Apparel" },
  { uuid: "brand-002", name: "Adidas", industry: "Apparel" },
  { uuid: "brand-003", name: "Gatorade", industry: "Beverages" },
  { uuid: "brand-004", name: "Beats by Dre", industry: "Electronics" },
  { uuid: "brand-005", name: "State Farm", industry: "Insurance" },
  { uuid: "brand-006", name: "Coca-Cola", industry: "Beverages" },
  { uuid: "brand-007", name: "Under Armour", industry: "Apparel" },
  { uuid: "brand-008", name: "BMW", industry: "Automotive" },
  { uuid: "brand-009", name: "Oakley", industry: "Eyewear" },
  { uuid: "brand-010", name: "Red Bull", industry: "Beverages" },
  { uuid: "brand-011", name: "GameStop", industry: "Retail" },
  { uuid: "brand-012", name: "Chipotle", industry: "Food Service" },
  { uuid: "brand-013", name: "Local Ford Dealership", industry: "Automotive" },
  { uuid: "brand-014", name: "Downtown Athletics", industry: "Retail" },
  { uuid: "brand-015", name: "Campus Eats", industry: "Food Service" },
];

// ============================================================================
// SPONSORS - Companies/brands that create sponsorship agreements
// ============================================================================

export interface Sponsor {
  uuid: string;
  name: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  totalBudget?: number;        // Optional - in cents. If set, agreements draw down from this
  status: 'active' | 'inactive';
  createdAt: string;
}

export const mockSponsors: Sponsor[] = [
  {
    uuid: "sponsor-001",
    name: "Nike",
    industry: "Apparel",
    contactName: "Sarah Mitchell",
    contactEmail: "smitchell@nike.com",
    contactPhone: "+1-503-555-0100",
    website: "https://nike.com",
    totalBudget: 5000000000,    // $50M total budget
    status: 'active',
    createdAt: "2024-01-15",
  },
  {
    uuid: "sponsor-002",
    name: "Gatorade",
    industry: "Beverages",
    contactName: "Mike Thompson",
    contactEmail: "mthompson@gatorade.com",
    contactPhone: "+1-312-555-0200",
    website: "https://gatorade.com",
    totalBudget: 2500000000,    // $25M total budget
    status: 'active',
    createdAt: "2024-02-20",
  },
  {
    uuid: "sponsor-003",
    name: "State Farm",
    industry: "Insurance",
    contactName: "Jennifer Davis",
    contactEmail: "jdavis@statefarm.com",
    contactPhone: "+1-309-555-0300",
    website: "https://statefarm.com",
    totalBudget: 1500000000,    // $15M total budget
    status: 'active',
    createdAt: "2024-03-10",
  },
  {
    uuid: "sponsor-004",
    name: "Local Ford Dealership",
    industry: "Automotive",
    contactName: "Bob Richardson",
    contactEmail: "bob@localford.com",
    contactPhone: "+1-555-555-0400",
    // No website
    totalBudget: 50000000,      // $500K total budget
    status: 'active',
    createdAt: "2024-06-01",
  },
  {
    uuid: "sponsor-005",
    name: "Red Bull",
    industry: "Beverages",
    contactName: "Alex Kramer",
    contactEmail: "akramer@redbull.com",
    contactPhone: "+1-310-555-0500",
    website: "https://redbull.com",
    // No total budget set - unlimited/tracking only
    status: 'active',
    createdAt: "2024-04-15",
  },
  {
    uuid: "sponsor-006",
    name: "Under Armour",
    industry: "Apparel",
    contactName: "Chris Martinez",
    contactEmail: "cmartinez@underarmour.com",
    contactPhone: "+1-410-555-0600",
    website: "https://underarmour.com",
    totalBudget: 3000000000,    // $30M total budget
    status: 'active',
    createdAt: "2024-01-20",
  },
  {
    uuid: "sponsor-007",
    name: "Campus Eats",
    industry: "Food Service",
    contactName: "Lisa Wong",
    contactEmail: "lisa@campuseats.com",
    // No phone
    // No website
    // No budget - just tracking agreements
    status: 'active',
    createdAt: "2025-01-10",
  },
  {
    uuid: "sponsor-008",
    name: "Beats by Dre",
    industry: "Electronics",
    contactName: "Marcus Lee",
    contactEmail: "mlee@beatsbydre.com",
    contactPhone: "+1-424-555-0800",
    website: "https://beatsbydre.com",
    totalBudget: 1000000000,    // $10M total budget
    status: 'inactive',
    createdAt: "2023-11-01",
  },
];

// ============================================================================
// CAMPAIGNS - Optional groupings of agreements under a sponsor
// ============================================================================

export interface Campaign {
  uuid: string;
  sponsorUuid: string;
  name: string;
  description?: string;
  budget?: number;             // Optional - in cents. If set, associated agreements draw down
  startDate?: string;
  endDate?: string;
  status: 'active' | 'completed' | 'draft';
}

export const mockCampaigns: Campaign[] = [
  // Nike campaigns
  {
    uuid: "campaign-001",
    sponsorUuid: "sponsor-001",
    name: "Just Do It 2025",
    description: "Major spring campaign featuring college athletes",
    budget: 1500000000,        // $15M campaign budget
    startDate: "2025-03-01",
    endDate: "2025-08-31",
    status: 'active',
  },
  {
    uuid: "campaign-002",
    sponsorUuid: "sponsor-001",
    name: "Football Season 2025",
    description: "College football season promotional campaign",
    budget: 2000000000,        // $20M campaign budget
    startDate: "2025-08-15",
    endDate: "2026-01-15",
    status: 'draft',
  },
  {
    uuid: "campaign-003",
    sponsorUuid: "sponsor-001",
    name: "March Madness 2025",
    description: "NCAA basketball tournament campaign",
    budget: 800000000,         // $8M campaign budget
    startDate: "2025-03-01",
    endDate: "2025-04-15",
    status: 'completed',
  },
  // Gatorade campaigns
  {
    uuid: "campaign-004",
    sponsorUuid: "sponsor-002",
    name: "Hydration Heroes",
    description: "Year-round hydration awareness campaign",
    budget: 1000000000,        // $10M
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    status: 'active',
  },
  {
    uuid: "campaign-005",
    sponsorUuid: "sponsor-002",
    name: "Game Day Fuel",
    description: "Football game day promotions",
    // No budget set - draws from sponsor total
    startDate: "2025-09-01",
    endDate: "2025-12-31",
    status: 'active',
  },
  // State Farm campaigns
  {
    uuid: "campaign-006",
    sponsorUuid: "sponsor-003",
    name: "Good Neighbor Athletes",
    description: "Community engagement with student athletes",
    budget: 500000000,         // $5M
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    status: 'active',
  },
  // Under Armour campaigns
  {
    uuid: "campaign-007",
    sponsorUuid: "sponsor-006",
    name: "Will Finds A Way",
    description: "Athlete determination campaign",
    budget: 1200000000,        // $12M
    startDate: "2025-02-01",
    endDate: "2025-07-31",
    status: 'active',
  },
  // Red Bull campaign (sponsor has no budget)
  {
    uuid: "campaign-008",
    sponsorUuid: "sponsor-005",
    name: "Gives You Wings - College",
    description: "Energy for student athletes",
    budget: 400000000,         // $4M - campaign has budget even if sponsor doesn't
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    status: 'active',
  },
];

// ============================================================================
// SPONSORSHIP AGREEMENTS - Links sponsors/campaigns to athletes
// ============================================================================

export interface SponsorshipAgreement {
  uuid: string;
  athleteUuid: string;
  sponsorUuid: string;
  campaignUuid?: string;       // Optional - ties to specific campaign
  appliesToIoi: boolean;       // Does this draw down the athlete's IOI target?
  amount: number;              // in cents
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  description?: string;
}

export const mockSponsorshipAgreements: SponsorshipAgreement[] = [
  // Nike agreements
  {
    uuid: "agreement-001",
    athleteUuid: "athlete-001", // Marcus Johnson
    sponsorUuid: "sponsor-001",
    campaignUuid: "campaign-001", // Just Do It 2025
    appliesToIoi: true,
    amount: 500000000,         // $5M
    status: 'active',
    startDate: "2025-03-01",
    endDate: "2025-08-31",
    description: "Social media content and appearances",
  },
  {
    uuid: "agreement-002",
    athleteUuid: "athlete-009", // Jaylen Williams
    sponsorUuid: "sponsor-001",
    campaignUuid: "campaign-003", // March Madness 2025
    appliesToIoi: true,
    amount: 850000000,         // $8.5M
    status: 'completed',
    startDate: "2025-03-01",
    endDate: "2025-04-15",
    description: "Tournament promotional content",
  },
  {
    uuid: "agreement-003",
    athleteUuid: "athlete-016", // Aaliyah Davis
    sponsorUuid: "sponsor-001",
    campaignUuid: "campaign-001", // Just Do It 2025
    appliesToIoi: true,
    amount: 420000000,         // $4.2M
    status: 'active',
    startDate: "2025-03-01",
    endDate: "2025-08-31",
    description: "Brand ambassador and content creation",
  },
  {
    uuid: "agreement-004",
    athleteUuid: "athlete-014", // Marcus Green
    sponsorUuid: "sponsor-001",
    // No campaign - standalone agreement
    appliesToIoi: true,
    amount: 320000000,         // $3.2M
    status: 'active',
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    description: "Annual endorsement deal",
  },
  // Gatorade agreements
  {
    uuid: "agreement-005",
    athleteUuid: "athlete-002", // DeShawn Carter
    sponsorUuid: "sponsor-002",
    campaignUuid: "campaign-004", // Hydration Heroes
    appliesToIoi: true,
    amount: 150000000,         // $1.5M
    status: 'active',
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    description: "Hydration campaign spokesperson",
  },
  {
    uuid: "agreement-006",
    athleteUuid: "athlete-004", // Jamal Washington
    sponsorUuid: "sponsor-002",
    campaignUuid: "campaign-005", // Game Day Fuel
    appliesToIoi: true,
    amount: 650000000,         // $6.5M
    status: 'active',
    startDate: "2025-09-01",
    endDate: "2025-12-31",
    description: "Game day content and appearances",
  },
  {
    uuid: "agreement-007",
    athleteUuid: "athlete-016", // Aaliyah Davis
    sponsorUuid: "sponsor-002",
    campaignUuid: "campaign-004", // Hydration Heroes
    appliesToIoi: true,
    amount: 300000000,         // $3M
    status: 'active',
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    description: "Women's sports hydration campaign",
  },
  // State Farm agreements
  {
    uuid: "agreement-008",
    athleteUuid: "athlete-001", // Marcus Johnson
    sponsorUuid: "sponsor-003",
    campaignUuid: "campaign-006", // Good Neighbor Athletes
    appliesToIoi: true,
    amount: 250000000,         // $2.5M
    status: 'active',
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    description: "Community engagement ambassador",
  },
  // Local Ford Dealership agreements
  {
    uuid: "agreement-009",
    athleteUuid: "athlete-010", // Jordan Brooks
    sponsorUuid: "sponsor-004",
    // No campaign
    appliesToIoi: false,       // Local deal, doesn't apply to IOI
    amount: 50000000,          // $500K
    status: 'active',
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    description: "Local promotional appearances",
  },
  // Red Bull agreements
  {
    uuid: "agreement-010",
    athleteUuid: "athlete-007", // Malik Thompson
    sponsorUuid: "sponsor-005",
    campaignUuid: "campaign-008", // Gives You Wings
    appliesToIoi: true,
    amount: 380000000,         // $3.8M
    status: 'active',
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    description: "Energy brand ambassador",
  },
  // Under Armour agreements
  {
    uuid: "agreement-011",
    athleteUuid: "athlete-003", // Tyler Mitchell
    sponsorUuid: "sponsor-006",
    campaignUuid: "campaign-007", // Will Finds A Way
    appliesToIoi: true,
    amount: 280000000,         // $2.8M
    status: 'pending',
    startDate: "2025-02-01",
    endDate: "2025-07-31",
    description: "Campaign featured athlete",
  },
  {
    uuid: "agreement-012",
    athleteUuid: "athlete-006", // Darius Jenkins
    sponsorUuid: "sponsor-006",
    campaignUuid: "campaign-007", // Will Finds A Way
    appliesToIoi: true,
    amount: 180000000,         // $1.8M
    status: 'active',
    startDate: "2025-02-01",
    endDate: "2025-07-31",
    description: "Supporting campaign athlete",
  },
  {
    uuid: "agreement-013",
    athleteUuid: "athlete-019", // Trinity Williams
    sponsorUuid: "sponsor-006",
    // No campaign - standalone
    appliesToIoi: true,
    amount: 250000000,         // $2.5M
    status: 'active',
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    description: "Women's basketball endorsement",
  },
  // Campus Eats agreements (small local sponsor)
  {
    uuid: "agreement-014",
    athleteUuid: "athlete-020", // Destiny Harris
    sponsorUuid: "sponsor-007",
    // No campaign
    appliesToIoi: false,       // Local, doesn't apply to IOI
    amount: 45000000,          // $450K
    status: 'completed',
    startDate: "2024-09-01",
    endDate: "2024-12-31",
    description: "Social media promotion",
  },
  // Beats by Dre agreements (inactive sponsor)
  {
    uuid: "agreement-015",
    athleteUuid: "athlete-009", // Jaylen Williams
    sponsorUuid: "sponsor-008",
    // No campaign
    appliesToIoi: true,
    amount: 180000000,         // $1.8M
    status: 'pending',
    startDate: "2025-06-01",
    endDate: "2026-05-31",
    description: "Headphone endorsement deal",
  },
  {
    uuid: "agreement-016",
    athleteUuid: "athlete-011", // Terrell Davis
    sponsorUuid: "sponsor-008",
    // No campaign
    appliesToIoi: true,
    amount: 175000000,         // $1.75M
    status: 'active',
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    description: "Product placement and content",
  },
  // Additional agreements to diversify data
  {
    uuid: "agreement-017",
    athleteUuid: "athlete-015", // Sierra Thompson
    sponsorUuid: "sponsor-006",
    campaignUuid: "campaign-007", // Will Finds A Way
    appliesToIoi: true,
    amount: 320000000,         // $3.2M
    status: 'active',
    startDate: "2025-02-01",
    endDate: "2025-07-31",
    description: "Featured women's athlete",
  },
  {
    uuid: "agreement-018",
    athleteUuid: "athlete-007", // Malik Thompson
    sponsorUuid: "sponsor-001",
    campaignUuid: "campaign-002", // Football Season 2025
    appliesToIoi: true,
    amount: 450000000,         // $4.5M
    status: 'pending',
    startDate: "2025-08-15",
    endDate: "2026-01-15",
    description: "Football season featured athlete",
  },
];

// ============================================================================
// SPONSOR HELPER FUNCTIONS
// ============================================================================

export function getSponsorById(uuid: string): Sponsor | undefined {
  return mockSponsors.find(s => s.uuid === uuid);
}

export function getCampaignsBySponsor(sponsorUuid: string): Campaign[] {
  return mockCampaigns.filter(c => c.sponsorUuid === sponsorUuid);
}

export function getAgreementsBySponsor(sponsorUuid: string): SponsorshipAgreement[] {
  return mockSponsorshipAgreements.filter(a => a.sponsorUuid === sponsorUuid);
}

export function getAgreementsByCampaign(campaignUuid: string): SponsorshipAgreement[] {
  return mockSponsorshipAgreements.filter(a => a.campaignUuid === campaignUuid);
}

export function getAgreementsByAthlete(athleteUuid: string): SponsorshipAgreement[] {
  return mockSponsorshipAgreements.filter(a => a.athleteUuid === athleteUuid);
}

// Calculate sponsor budget totals
export function calculateSponsorBudgetTotals(sponsorUuid: string) {
  const sponsor = getSponsorById(sponsorUuid);
  const agreements = getAgreementsBySponsor(sponsorUuid);
  const campaigns = getCampaignsBySponsor(sponsorUuid);
  
  const totalCommitted = agreements
    .filter(a => a.status !== 'cancelled')
    .reduce((sum, a) => sum + a.amount, 0);
  
  const activeAgreements = agreements.filter(a => a.status === 'active').length;
  const pendingAgreements = agreements.filter(a => a.status === 'pending').length;
  
  return {
    totalBudget: sponsor?.totalBudget,
    totalCommitted,
    remaining: sponsor?.totalBudget ? sponsor.totalBudget - totalCommitted : undefined,
    progress: sponsor?.totalBudget ? (totalCommitted / sponsor.totalBudget) * 100 : undefined,
    campaignCount: campaigns.length,
    agreementCount: agreements.length,
    activeAgreements,
    pendingAgreements,
  };
}

// Calculate campaign budget totals
export function calculateCampaignBudgetTotals(campaignUuid: string) {
  const campaign = mockCampaigns.find(c => c.uuid === campaignUuid);
  const agreements = getAgreementsByCampaign(campaignUuid);
  
  const totalCommitted = agreements
    .filter(a => a.status !== 'cancelled')
    .reduce((sum, a) => sum + a.amount, 0);
  
  return {
    budget: campaign?.budget,
    totalCommitted,
    remaining: campaign?.budget ? campaign.budget - totalCommitted : undefined,
    progress: campaign?.budget ? (totalCommitted / campaign.budget) * 100 : undefined,
    agreementCount: agreements.length,
  };
}

// Get all sponsors with their calculated budget data
export function getSponsorsWithBudgets() {
  return mockSponsors.map(sponsor => ({
    ...sponsor,
    budgetTotals: calculateSponsorBudgetTotals(sponsor.uuid),
  }));
}

// ============================================================================
// STUDENT ATHLETES - Will become `student_athletes` table in Supabase
// ============================================================================
export const mockAthletes: StudentAthleteWithContracts[] = [
  // FOOTBALL PLAYERS
  {
    uuid: "athlete-001",
    first_name: "Marcus",
    last_name: "Johnson",
    sport: "football",
    edu_email: "mjohnson@ufl.edu",
    secondary_email: "marcus.johnson@gmail.com",
    graduation_year: "2026",
    agency: getAgency("agency-001"),
    contract_count: 5,
    total_contract_value: 1250000000,
    phone_numbers: [{ uuid: "phone-001", number: "+15551234567", type: "mobile" }],
    addresses: [{
      uuid: "addr-001",
      street_address: "123 Campus Dr",
      locality: "Gainesville",
      region: "FL",
      postal_code: "32611",
      country_code: "US",
      type: "home",
      pref: 1,
    }],
  },
  {
    uuid: "athlete-002",
    first_name: "DeShawn",
    last_name: "Carter",
    sport: "football",
    edu_email: "dcarter@osu.edu",
    secondary_email: "deshawn.carter@gmail.com",
    graduation_year: "2027",
    agency: getAgency("agency-006"),
    contract_count: 2,
    total_contract_value: 450000000,
    phone_numbers: [{ uuid: "phone-002", number: "+15555551234", type: "mobile" }],
    addresses: [],
  },
  {
    uuid: "athlete-003",
    first_name: "Tyler",
    last_name: "Mitchell",
    sport: "football",
    edu_email: "tmitchell@ua.edu",
    graduation_year: "2026",
    agency: getAgency("agency-001"),
    contract_count: 3,
    total_contract_value: 680000000,
    phone_numbers: [],
    addresses: [],
  },
  {
    uuid: "athlete-004",
    first_name: "Jamal",
    last_name: "Washington",
    sport: "football",
    edu_email: "jwashington@umich.edu",
    secondary_email: "jamal.wash@outlook.com",
    graduation_year: "2025",
    agency: getAgency("agency-006"),
    contract_count: 4,
    total_contract_value: 920000000,
    phone_numbers: [{ uuid: "phone-003", number: "+15557778899", type: "mobile" }],
    addresses: [{
      uuid: "addr-002",
      street_address: "456 Stadium Way",
      locality: "Ann Arbor",
      region: "MI",
      postal_code: "48109",
      country_code: "US",
      type: "home",
      pref: 1,
    }],
  },
  {
    uuid: "athlete-005",
    first_name: "Chris",
    last_name: "Rodriguez",
    sport: "football",
    edu_email: "crodriguez@ufl.edu",
    graduation_year: "2028",
    contract_count: 1,
    total_contract_value: 175000000,
    phone_numbers: [],
    addresses: [],
  },
  {
    uuid: "athlete-006",
    first_name: "Darius",
    last_name: "Jenkins",
    sport: "football",
    edu_email: "djenkins@osu.edu",
    graduation_year: "2026",
    agency: getAgency("agency-001"),
    contract_count: 2,
    total_contract_value: 380000000,
    phone_numbers: [{ uuid: "phone-004", number: "+15552223344", type: "mobile" }],
    addresses: [],
  },
  {
    uuid: "athlete-007",
    first_name: "Malik",
    last_name: "Thompson",
    sport: "football",
    edu_email: "mthompson@ua.edu",
    secondary_email: "malik.t22@gmail.com",
    graduation_year: "2025",
    agency: getAgency("agency-006"),
    contract_count: 6,
    total_contract_value: 1450000000,
    phone_numbers: [],
    addresses: [],
  },
  {
    uuid: "athlete-008",
    first_name: "Brandon",
    last_name: "Lewis",
    sport: "football",
    edu_email: "blewis@umich.edu",
    graduation_year: "2027",
    agency: getAgency("agency-001"),
    contract_count: 1,
    total_contract_value: 95000000,
    phone_numbers: [],
    addresses: [],
  },

  // MEN'S BASKETBALL PLAYERS
  {
    uuid: "athlete-009",
    first_name: "Jaylen",
    last_name: "Williams",
    sport: "mens_basketball",
    edu_email: "jwilliams@duke.edu",
    secondary_email: "jaylen.w@gmail.com",
    graduation_year: "2025",
    agency: getAgency("agency-007"),
    contract_count: 7,
    total_contract_value: 2100000000,
    phone_numbers: [{ uuid: "phone-005", number: "+15559876543", type: "mobile" }],
    addresses: [],
  },
  {
    uuid: "athlete-010",
    first_name: "Jordan",
    last_name: "Brooks",
    sport: "mens_basketball",
    edu_email: "jbrooks@ufl.edu",
    graduation_year: "2025",
    agency: getAgency("agency-007"),
    contract_count: 4,
    total_contract_value: 780000000,
    phone_numbers: [],
    addresses: [],
  },
  {
    uuid: "athlete-011",
    first_name: "Terrell",
    last_name: "Davis",
    sport: "mens_basketball",
    edu_email: "tdavis@osu.edu",
    secondary_email: "terrell.davis@yahoo.com",
    graduation_year: "2026",
    agency: getAgency("agency-008"),
    contract_count: 3,
    total_contract_value: 520000000,
    phone_numbers: [{ uuid: "phone-006", number: "+15553334455", type: "mobile" }],
    addresses: [],
  },
  {
    uuid: "athlete-012",
    first_name: "Andre",
    last_name: "Moore",
    sport: "mens_basketball",
    edu_email: "amoore@duke.edu",
    graduation_year: "2027",
    agency: getAgency("agency-007"),
    contract_count: 2,
    total_contract_value: 340000000,
    phone_numbers: [],
    addresses: [],
  },
  {
    uuid: "athlete-013",
    first_name: "Kevin",
    last_name: "Patterson",
    sport: "mens_basketball",
    edu_email: "kpatterson@ua.edu",
    graduation_year: "2026",
    agency: getAgency("agency-008"),
    contract_count: 3,
    total_contract_value: 450000000,
    phone_numbers: [],
    addresses: [],
  },
  {
    uuid: "athlete-014",
    first_name: "Marcus",
    last_name: "Green",
    sport: "mens_basketball",
    edu_email: "mgreen@umich.edu",
    graduation_year: "2025",
    contract_count: 5,
    total_contract_value: 890000000,
    phone_numbers: [{ uuid: "phone-007", number: "+15556667788", type: "mobile" }],
    addresses: [],
  },

  // WOMEN'S BASKETBALL PLAYERS
  {
    uuid: "athlete-015",
    first_name: "Sierra",
    last_name: "Thompson",
    sport: "womens_basketball",
    edu_email: "sthompson@duke.edu",
    graduation_year: "2026",
    agency: getAgency("agency-003"),
    contract_count: 4,
    total_contract_value: 620000000,
    phone_numbers: [],
    addresses: [],
  },
  {
    uuid: "athlete-016",
    first_name: "Aaliyah",
    last_name: "Davis",
    sport: "womens_basketball",
    edu_email: "adavis@ufl.edu",
    secondary_email: "aaliyah.d@gmail.com",
    graduation_year: "2025",
    agency: getAgency("agency-003"),
    contract_count: 6,
    total_contract_value: 980000000,
    phone_numbers: [{ uuid: "phone-008", number: "+15554445566", type: "mobile" }],
    addresses: [{
      uuid: "addr-003",
      street_address: "789 Gator Lane",
      locality: "Gainesville",
      region: "FL",
      postal_code: "32601",
      country_code: "US",
      type: "home",
      pref: 1,
    }],
  },
  {
    uuid: "athlete-017",
    first_name: "Kayla",
    last_name: "Robinson",
    sport: "womens_basketball",
    edu_email: "krobinson@osu.edu",
    graduation_year: "2027",
    contract_count: 1,
    total_contract_value: 95000000,
    phone_numbers: [],
    addresses: [],
  },
  {
    uuid: "athlete-018",
    first_name: "Maya",
    last_name: "Jackson",
    sport: "womens_basketball",
    edu_email: "mjackson@ua.edu",
    graduation_year: "2026",
    agency: getAgency("agency-003"),
    contract_count: 3,
    total_contract_value: 420000000,
    phone_numbers: [],
    addresses: [],
  },
  {
    uuid: "athlete-019",
    first_name: "Trinity",
    last_name: "Williams",
    sport: "womens_basketball",
    edu_email: "twilliams@duke.edu",
    secondary_email: "trinity.wbb@gmail.com",
    graduation_year: "2025",
    agency: getAgency("agency-003"),
    contract_count: 5,
    total_contract_value: 750000000,
    phone_numbers: [{ uuid: "phone-009", number: "+15558889900", type: "mobile" }],
    addresses: [],
  },
  {
    uuid: "athlete-020",
    first_name: "Destiny",
    last_name: "Harris",
    sport: "womens_basketball",
    edu_email: "dharris@umich.edu",
    graduation_year: "2026",
    agency: getAgency("agency-003"),
    contract_count: 2,
    total_contract_value: 280000000,
    phone_numbers: [],
    addresses: [],
  },
  {
    uuid: "athlete-021",
    first_name: "Jasmine",
    last_name: "Brown",
    sport: "womens_basketball",
    edu_email: "jbrown@ufl.edu",
    graduation_year: "2028",
    contract_count: 1,
    total_contract_value: 120000000,
    phone_numbers: [],
    addresses: [],
  },
  {
    uuid: "athlete-022",
    first_name: "Brianna",
    last_name: "Scott",
    sport: "womens_basketball",
    edu_email: "bscott@osu.edu",
    graduation_year: "2025",
    agency: getAgency("agency-003"),
    contract_count: 4,
    total_contract_value: 560000000,
    phone_numbers: [],
    addresses: [],
  },
];

// ============================================================================
// PARTICIPANTS - Will become `participants` table in Supabase
// ============================================================================
const createParticipant = (
  uuid: string, 
  name: string, 
  email: string, 
  role: ParticipantRole
): Participant => ({
  uuid,
  entity: {
    uuid: `entity-${uuid}`,
    first_name: name.split(" ")[0],
    last_name: name.split(" ")[1] || "",
    email,
  },
  role,
});

const mockParticipants = {
  univLegal1: createParticipant("part-001", "Sarah Mitchell", "smitchell@ufl.edu", "university_counselor"),
  univLegal2: createParticipant("part-002", "Robert Chen", "rchen@osu.edu", "university_counselor"),
  univCompliance1: createParticipant("part-003", "Jennifer Adams", "jadams@ufl.edu", "university_compliance"),
  univCompliance2: createParticipant("part-004", "Michael Torres", "mtorres@duke.edu", "university_compliance"),
  univAdmin1: createParticipant("part-005", "David Wilson", "dwilson@ua.edu", "university_admin"),
  athleteAgent1: createParticipant("part-006", "James Robinson", "jrobinson@elitesports.com", "student_agent"),
  athleteAgent2: createParticipant("part-007", "Lisa Park", "lpark@primeathletes.com", "student_agent"),
  athleteCounsel1: createParticipant("part-008", "Thomas Wright", "twright@lawfirm.com", "student_counselor"),
  athleteParent1: createParticipant("part-009", "Patricia Johnson", "pjohnson@email.com", "student_parent"),
  athleteParent2: createParticipant("part-010", "Marcus Williams Sr", "mwilliams@email.com", "student_parent"),
};

// ============================================================================
// THREAD POSTS/NOTES - Will become `thread_posts` and `thread_notes` tables
// ============================================================================
const createPost = (uuid: string, content: string, daysAgo: number): ThreadPost => ({
  uuid,
  content,
  created_at: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
  user: {
    uuid: "user-001",
    first_name: "System",
    last_name: "Admin",
    email: "admin@analog.com",
  },
});

// ============================================================================
// THREADS/AGREEMENTS - Will become `threads` table in Supabase
// ============================================================================
export const mockThreads: Thread[] = [
  // DRAFTING STATUS (5 agreements)
  {
    uuid: "thread-001",
    title: "University IOI - Kayla Robinson",
    status: "drafting",
    is_priority: false,
    current_holder: "with_university",
    contract_type: "ioi",
    contract_group: "new_recruit",
    total_value: 95000000,
    age: 2,
    start_date: "2025-06-01",
    end_date: "2029-06-01",
    student_athlete: {
      uuid: "athlete-017",
      first_name: "Kayla",
      last_name: "Robinson",
      sport: "womens_basketball",
    },
    last_document_uuid: "doc-001",
    participants: [mockParticipants.univLegal1, mockParticipants.univCompliance1],
    posts: [createPost("post-001", "Initial draft being prepared", 2)],
    notes: [],
  },
  {
    uuid: "thread-002",
    title: "Revenue Share Agreement - Chris Rodriguez",
    status: "drafting",
    is_priority: false,
    current_holder: "with_university",
    contract_type: "revenue_share",
    contract_group: "new_recruit",
    total_value: 175000000,
    age: 1,
    start_date: "2025-08-01",
    end_date: "2029-08-01",
    student_athlete: {
      uuid: "athlete-005",
      first_name: "Chris",
      last_name: "Rodriguez",
      sport: "football",
    },
    agency: getAgency("agency-001"),
    last_document_uuid: "doc-002",
    participants: [mockParticipants.univLegal1, mockParticipants.athleteAgent1],
    posts: [],
    notes: [],
  },
  {
    uuid: "thread-003",
    title: "New Recruit IOI - Brandon Lewis",
    status: "drafting",
    is_priority: true,
    current_holder: "with_university",
    contract_type: "ioi",
    contract_group: "new_recruit",
    total_value: 95000000,
    age: 3,
    start_date: "2025-07-01",
    end_date: "2029-07-01",
    student_athlete: {
      uuid: "athlete-008",
      first_name: "Brandon",
      last_name: "Lewis",
      sport: "football",
    },
    agency: getAgency("agency-001"),
    last_document_uuid: "doc-003",
    participants: [mockParticipants.univLegal2, mockParticipants.univCompliance1],
    posts: [createPost("post-002", "High priority recruit - expedited review requested", 3)],
    notes: [],
  },
  {
    uuid: "thread-004",
    title: "Initial IOI - Jasmine Brown",
    status: "drafting",
    is_priority: false,
    current_holder: "with_university",
    contract_type: "ioi",
    contract_group: "new_recruit",
    total_value: 120000000,
    age: 1,
    start_date: "2025-09-01",
    end_date: "2029-09-01",
    student_athlete: {
      uuid: "athlete-021",
      first_name: "Jasmine",
      last_name: "Brown",
      sport: "womens_basketball",
    },
    last_document_uuid: "doc-004",
    participants: [mockParticipants.univCompliance1],
    posts: [],
    notes: [],
  },
  {
    uuid: "thread-005",
    title: "Retention IOI - Andre Moore",
    status: "drafting",
    is_priority: false,
    current_holder: "with_university",
    contract_type: "ioi",
    contract_group: "retention",
    total_value: 340000000,
    age: 4,
    start_date: "2025-05-01",
    end_date: "2028-05-01",
    student_athlete: {
      uuid: "athlete-012",
      first_name: "Andre",
      last_name: "Moore",
      sport: "mens_basketball",
    },
    agency: getAgency("agency-007"),
    last_document_uuid: "doc-005",
    participants: [mockParticipants.univLegal1, mockParticipants.athleteAgent2],
    posts: [],
    notes: [],
  },

  // DRAFT SENT STATUS (6 agreements)
  {
    uuid: "thread-006",
    title: "University IOI - Jaylen Williams",
    status: "draft_sent",
    is_priority: false,
    current_holder: "with_athlete",
    contract_type: "ioi",
    contract_group: "retention",
    total_value: 850000000,
    age: 5,
    start_date: "2025-02-01",
    end_date: "2026-02-01",
    student_athlete: {
      uuid: "athlete-009",
      first_name: "Jaylen",
      last_name: "Williams",
      sport: "mens_basketball",
    },
    agency: getAgency("agency-007"),
    last_document_uuid: "doc-006",
    participants: [mockParticipants.univLegal1, mockParticipants.athleteAgent2, mockParticipants.athleteParent2],
    posts: [
      createPost("post-003", "Draft sent to athlete's agent for review", 5),
      createPost("post-004", "Agent confirmed receipt", 4),
    ],
    notes: [],
  },
  {
    uuid: "thread-007",
    title: "Transfer Agreement - Tyler Mitchell",
    status: "draft_sent",
    is_priority: true,
    current_holder: "with_athlete_legal",
    contract_type: "ioi",
    contract_group: "transfer",
    total_value: 420000000,
    age: 6,
    start_date: "2025-05-01",
    end_date: "2027-05-01",
    student_athlete: {
      uuid: "athlete-003",
      first_name: "Tyler",
      last_name: "Mitchell",
      sport: "football",
    },
    agency: getAgency("agency-001"),
    last_document_uuid: "doc-007",
    participants: [mockParticipants.univLegal2, mockParticipants.athleteCounsel1],
    posts: [createPost("post-005", "Draft under legal review", 6)],
    notes: [],
  },
  {
    uuid: "thread-008",
    title: "Nike Appearance Deal - Marcus Green",
    status: "draft_sent",
    is_priority: false,
    current_holder: "with_agent",
    contract_type: "third_party_nil",
    contract_group: "retention",
    total_value: 320000000,
    age: 4,
    start_date: "2025-03-01",
    end_date: "2026-03-01",
    student_athlete: {
      uuid: "athlete-014",
      first_name: "Marcus",
      last_name: "Green",
      sport: "mens_basketball",
    },
    last_document_uuid: "doc-008",
    participants: [mockParticipants.univCompliance2, mockParticipants.athleteAgent1],
    posts: [],
    notes: [],
  },
  {
    uuid: "thread-009",
    title: "Retention IOI - Destiny Harris",
    status: "draft_sent",
    is_priority: false,
    current_holder: "with_athlete",
    contract_type: "ioi",
    contract_group: "retention",
    total_value: 280000000,
    age: 3,
    start_date: "2025-04-01",
    end_date: "2028-04-01",
    student_athlete: {
      uuid: "athlete-020",
      first_name: "Destiny",
      last_name: "Harris",
      sport: "womens_basketball",
    },
    agency: getAgency("agency-003"),
    last_document_uuid: "doc-009",
    participants: [mockParticipants.univLegal1],
    posts: [],
    notes: [],
  },
  {
    uuid: "thread-010",
    title: "Under Armour Partnership - Darius Jenkins",
    status: "draft_sent",
    is_priority: true,
    current_holder: "with_athlete",
    contract_type: "third_party_nil",
    contract_group: "retention",
    total_value: 380000000,
    age: 7,
    start_date: "2025-01-15",
    end_date: "2027-01-15",
    student_athlete: {
      uuid: "athlete-006",
      first_name: "Darius",
      last_name: "Jenkins",
      sport: "football",
    },
    agency: getAgency("agency-001"),
    last_document_uuid: "doc-010",
    participants: [mockParticipants.univCompliance1, mockParticipants.athleteAgent1],
    posts: [createPost("post-006", "High-value NIL deal - compliance flagged for priority review", 7)],
    notes: [],
  },
  {
    uuid: "thread-011",
    title: "IOI Amendment - Kevin Patterson",
    status: "draft_sent",
    is_priority: false,
    current_holder: "with_agent",
    contract_type: "amendment",
    contract_group: "retention",
    total_value: 150000000,
    age: 2,
    start_date: "2025-06-01",
    end_date: "2026-06-01",
    student_athlete: {
      uuid: "athlete-013",
      first_name: "Kevin",
      last_name: "Patterson",
      sport: "mens_basketball",
    },
    agency: getAgency("agency-008"),
    last_document_uuid: "doc-011",
    participants: [mockParticipants.univLegal2, mockParticipants.athleteAgent2],
    posts: [],
    notes: [],
  },

  // IN REDLINING STATUS (8 agreements)
  {
    uuid: "thread-012",
    title: "Nike Endorsement Deal - Marcus Johnson",
    status: "in_redlining",
    is_priority: true,
    current_holder: "with_university_legal",
    contract_type: "third_party_nil",
    contract_group: "retention",
    total_value: 500000000,
    age: 12,
    start_date: "2025-01-15",
    end_date: "2027-01-15",
    student_athlete: {
      uuid: "athlete-001",
      first_name: "Marcus",
      last_name: "Johnson",
      sport: "football",
    },
    agency: getAgency("agency-001"),
    last_document_uuid: "doc-012",
    participants: [
      mockParticipants.univLegal1, 
      mockParticipants.univCompliance1, 
      mockParticipants.athleteAgent1,
      mockParticipants.athleteParent1
    ],
    posts: [
      createPost("post-007", "Initial review completed by compliance", 12),
      createPost("post-008", "Legal requested changes to exclusivity clause", 10),
      createPost("post-009", "Agent countered with modified terms", 8),
      createPost("post-010", "Reviewing counter-proposal", 5),
    ],
    notes: [],
  },
  {
    uuid: "thread-013",
    title: "Brand Ambassador Deal - Aaliyah Davis",
    status: "in_redlining",
    is_priority: false,
    current_holder: "with_agent",
    contract_type: "third_party_nil",
    contract_group: "retention",
    total_value: 420000000,
    age: 9,
    start_date: "2025-01-01",
    end_date: "2026-12-31",
    student_athlete: {
      uuid: "athlete-016",
      first_name: "Aaliyah",
      last_name: "Davis",
      sport: "womens_basketball",
    },
    agency: getAgency("agency-003"),
    last_document_uuid: "doc-013",
    participants: [mockParticipants.univCompliance1, mockParticipants.athleteAgent2],
    posts: [
      createPost("post-011", "NIL compliance review in progress", 9),
      createPost("post-012", "Minor redlines on social media requirements", 6),
    ],
    notes: [],
  },
  {
    uuid: "thread-014",
    title: "Gatorade Sponsorship - Jamal Washington",
    status: "in_redlining",
    is_priority: true,
    current_holder: "with_university_legal",
    contract_type: "third_party_nil",
    contract_group: "retention",
    total_value: 650000000,
    age: 15,
    start_date: "2025-02-01",
    end_date: "2027-02-01",
    student_athlete: {
      uuid: "athlete-004",
      first_name: "Jamal",
      last_name: "Washington",
      sport: "football",
    },
    agency: getAgency("agency-006"),
    last_document_uuid: "doc-014",
    participants: [
      mockParticipants.univLegal2, 
      mockParticipants.univCompliance2, 
      mockParticipants.athleteAgent1
    ],
    posts: [
      createPost("post-013", "Multi-year deal under negotiation", 15),
      createPost("post-014", "Exclusivity terms being finalized", 10),
      createPost("post-015", "Performance bonus structure under review", 5),
    ],
    notes: [],
  },
  {
    uuid: "thread-015",
    title: "Retention IOI - Trinity Williams",
    status: "in_redlining",
    is_priority: false,
    current_holder: "with_athlete_legal",
    contract_type: "ioi",
    contract_group: "retention",
    total_value: 380000000,
    age: 8,
    start_date: "2025-03-01",
    end_date: "2026-03-01",
    student_athlete: {
      uuid: "athlete-019",
      first_name: "Trinity",
      last_name: "Williams",
      sport: "womens_basketball",
    },
    agency: getAgency("agency-003"),
    last_document_uuid: "doc-015",
    participants: [mockParticipants.univLegal1, mockParticipants.athleteCounsel1],
    posts: [createPost("post-016", "Counsel reviewing payment schedule", 8)],
    notes: [],
  },
  {
    uuid: "thread-016",
    title: "Adidas Partnership - Jordan Brooks",
    status: "in_redlining",
    is_priority: false,
    current_holder: "with_agent",
    contract_type: "third_party_nil",
    contract_group: "retention",
    total_value: 280000000,
    age: 6,
    start_date: "2025-04-01",
    end_date: "2026-10-01",
    student_athlete: {
      uuid: "athlete-010",
      first_name: "Jordan",
      last_name: "Brooks",
      sport: "mens_basketball",
    },
    agency: getAgency("agency-007"),
    last_document_uuid: "doc-016",
    participants: [mockParticipants.univCompliance1, mockParticipants.athleteAgent2],
    posts: [],
    notes: [],
  },
  {
    uuid: "thread-017",
    title: "Revenue Share Amendment - Malik Thompson",
    status: "in_redlining",
    is_priority: true,
    current_holder: "with_university",
    contract_type: "amendment",
    contract_group: "retention",
    total_value: 200000000,
    age: 4,
    start_date: "2025-05-01",
    end_date: "2026-05-01",
    student_athlete: {
      uuid: "athlete-007",
      first_name: "Malik",
      last_name: "Thompson",
      sport: "football",
    },
    agency: getAgency("agency-006"),
    last_document_uuid: "doc-017",
    participants: [mockParticipants.univAdmin1, mockParticipants.univLegal2],
    posts: [createPost("post-017", "Performance incentive structure being negotiated", 4)],
    notes: [],
  },
  {
    uuid: "thread-018",
    title: "Beats by Dre Deal - Terrell Davis",
    status: "in_redlining",
    is_priority: false,
    current_holder: "with_athlete",
    contract_type: "third_party_nil",
    contract_group: "retention",
    total_value: 175000000,
    age: 5,
    start_date: "2025-06-01",
    end_date: "2026-06-01",
    student_athlete: {
      uuid: "athlete-011",
      first_name: "Terrell",
      last_name: "Davis",
      sport: "mens_basketball",
    },
    agency: getAgency("agency-008"),
    last_document_uuid: "doc-018",
    participants: [mockParticipants.univCompliance2],
    posts: [],
    notes: [],
  },
  {
    uuid: "thread-019",
    title: "Transfer IOI - DeShawn Carter",
    status: "in_redlining",
    is_priority: false,
    current_holder: "with_university_legal",
    contract_type: "ioi",
    contract_group: "transfer",
    total_value: 450000000,
    age: 10,
    start_date: "2025-01-01",
    end_date: "2028-01-01",
    student_athlete: {
      uuid: "athlete-002",
      first_name: "DeShawn",
      last_name: "Carter",
      sport: "football",
    },
    agency: getAgency("agency-006"),
    last_document_uuid: "doc-019",
    participants: [mockParticipants.univLegal2, mockParticipants.athleteAgent1, mockParticipants.athleteParent1],
    posts: [
      createPost("post-018", "Transfer portal timeline discussed", 10),
      createPost("post-019", "Academic requirements clause added", 7),
    ],
    notes: [],
  },

  // READY TO SIGN STATUS (5 agreements)
  {
    uuid: "thread-020",
    title: "Adidas Partnership - Sierra Thompson",
    status: "ready_to_sign",
    is_priority: true,
    current_holder: "all_parties",
    contract_type: "third_party_nil",
    contract_group: "retention",
    total_value: 320000000,
    age: 18,
    start_date: "2025-03-01",
    end_date: "2027-03-01",
    student_athlete: {
      uuid: "athlete-015",
      first_name: "Sierra",
      last_name: "Thompson",
      sport: "womens_basketball",
    },
    agency: getAgency("agency-003"),
    last_document_uuid: "doc-020",
    participants: [
      mockParticipants.univLegal1, 
      mockParticipants.univCompliance2, 
      mockParticipants.athleteAgent2
    ],
    posts: [
      createPost("post-020", "All parties have approved - ready for signatures", 1),
      createPost("post-021", "Signature ceremony scheduled for next week", 0),
    ],
    notes: [],
  },
  {
    uuid: "thread-021",
    title: "Retention IOI - Maya Jackson",
    status: "ready_to_sign",
    is_priority: false,
    current_holder: "all_parties",
    contract_type: "ioi",
    contract_group: "retention",
    total_value: 420000000,
    age: 14,
    start_date: "2025-04-01",
    end_date: "2028-04-01",
    student_athlete: {
      uuid: "athlete-018",
      first_name: "Maya",
      last_name: "Jackson",
      sport: "womens_basketball",
    },
    agency: getAgency("agency-003"),
    last_document_uuid: "doc-021",
    participants: [mockParticipants.univLegal2, mockParticipants.athleteAgent2],
    posts: [createPost("post-022", "Final review complete - awaiting signatures", 2)],
    notes: [],
  },
  {
    uuid: "thread-022",
    title: "Oakley Eyewear Deal - Jaylen Williams",
    status: "ready_to_sign",
    is_priority: true,
    current_holder: "all_parties",
    contract_type: "third_party_nil",
    contract_group: "retention",
    total_value: 180000000,
    age: 11,
    start_date: "2025-05-01",
    end_date: "2026-05-01",
    student_athlete: {
      uuid: "athlete-009",
      first_name: "Jaylen",
      last_name: "Williams",
      sport: "mens_basketball",
    },
    agency: getAgency("agency-007"),
    last_document_uuid: "doc-022",
    participants: [mockParticipants.univCompliance1, mockParticipants.athleteAgent2],
    posts: [],
    notes: [],
  },
  {
    uuid: "thread-023",
    title: "State Farm Promotion - Marcus Johnson",
    status: "ready_to_sign",
    is_priority: false,
    current_holder: "all_parties",
    contract_type: "third_party_nil",
    contract_group: "retention",
    total_value: 250000000,
    age: 9,
    start_date: "2025-02-15",
    end_date: "2026-02-15",
    student_athlete: {
      uuid: "athlete-001",
      first_name: "Marcus",
      last_name: "Johnson",
      sport: "football",
    },
    agency: getAgency("agency-001"),
    last_document_uuid: "doc-023",
    participants: [mockParticipants.univLegal1, mockParticipants.athleteAgent1],
    posts: [createPost("post-023", "Insurance compliance approved", 3)],
    notes: [],
  },
  {
    uuid: "thread-024",
    title: "Retention IOI - Brianna Scott",
    status: "ready_to_sign",
    is_priority: false,
    current_holder: "all_parties",
    contract_type: "ioi",
    contract_group: "retention",
    total_value: 560000000,
    age: 16,
    start_date: "2025-06-01",
    end_date: "2026-06-01",
    student_athlete: {
      uuid: "athlete-022",
      first_name: "Brianna",
      last_name: "Scott",
      sport: "womens_basketball",
    },
    agency: getAgency("agency-003"),
    last_document_uuid: "doc-024",
    participants: [mockParticipants.univCompliance1, mockParticipants.athleteCounsel1],
    posts: [],
    notes: [],
  },

  // EXECUTED STATUS (8 agreements - recently signed)
  {
    uuid: "thread-025",
    title: "Local Dealership Sponsorship - Jordan Brooks",
    status: "executed",
    is_priority: false,
    current_holder: "on_file",
    contract_type: "third_party_nil",
    contract_group: "retention",
    total_value: 50000000,
    age: 22,
    start_date: "2024-12-01",
    end_date: "2025-12-01",
    student_athlete: {
      uuid: "athlete-010",
      first_name: "Jordan",
      last_name: "Brooks",
      sport: "mens_basketball",
    },
    agency: getAgency("agency-007"),
    last_document_uuid: "doc-025",
    participants: [mockParticipants.univCompliance1],
    posts: [
      createPost("post-024", "Agreement executed and filed", 15),
      createPost("post-025", "First payment processed", 10),
    ],
    notes: [],
  },
  {
    uuid: "thread-026",
    title: "Red Bull Partnership - Malik Thompson",
    status: "executed",
    is_priority: false,
    current_holder: "on_file",
    contract_type: "third_party_nil",
    contract_group: "retention",
    total_value: 380000000,
    age: 25,
    start_date: "2024-11-15",
    end_date: "2026-11-15",
    student_athlete: {
      uuid: "athlete-007",
      first_name: "Malik",
      last_name: "Thompson",
      sport: "football",
    },
    agency: getAgency("agency-006"),
    last_document_uuid: "doc-026",
    participants: [mockParticipants.univLegal2, mockParticipants.athleteAgent1],
    posts: [createPost("post-026", "Multi-year deal fully executed", 20)],
    notes: [],
  },
  {
    uuid: "thread-027",
    title: "Retention IOI - Aaliyah Davis",
    status: "executed",
    is_priority: false,
    current_holder: "on_file",
    contract_type: "ioi",
    contract_group: "retention",
    total_value: 560000000,
    age: 30,
    start_date: "2024-10-01",
    end_date: "2026-05-01",
    student_athlete: {
      uuid: "athlete-016",
      first_name: "Aaliyah",
      last_name: "Davis",
      sport: "womens_basketball",
    },
    agency: getAgency("agency-003"),
    last_document_uuid: "doc-027",
    participants: [mockParticipants.univAdmin1, mockParticipants.athleteAgent2],
    posts: [],
    notes: [],
  },
  {
    uuid: "thread-028",
    title: "Chipotle NIL Deal - Terrell Davis",
    status: "executed",
    is_priority: false,
    current_holder: "on_file",
    contract_type: "third_party_nil",
    contract_group: "retention",
    total_value: 120000000,
    age: 28,
    start_date: "2024-11-01",
    end_date: "2025-11-01",
    student_athlete: {
      uuid: "athlete-011",
      first_name: "Terrell",
      last_name: "Davis",
      sport: "mens_basketball",
    },
    agency: getAgency("agency-008"),
    last_document_uuid: "doc-028",
    participants: [mockParticipants.univCompliance2],
    posts: [],
    notes: [],
  },
  {
    uuid: "thread-029",
    title: "University IOI - Jamal Washington",
    status: "executed",
    is_priority: false,
    current_holder: "on_file",
    contract_type: "ioi",
    contract_group: "retention",
    total_value: 720000000,
    age: 45,
    start_date: "2024-08-01",
    end_date: "2026-01-01",
    student_athlete: {
      uuid: "athlete-004",
      first_name: "Jamal",
      last_name: "Washington",
      sport: "football",
    },
    agency: getAgency("agency-006"),
    last_document_uuid: "doc-029",
    participants: [mockParticipants.univLegal1, mockParticipants.univCompliance1],
    posts: [],
    notes: [],
  },
  {
    uuid: "thread-030",
    title: "Nike Campus Store - Trinity Williams",
    status: "executed",
    is_priority: false,
    current_holder: "on_file",
    contract_type: "third_party_nil",
    contract_group: "retention",
    total_value: 95000000,
    age: 35,
    start_date: "2024-09-01",
    end_date: "2025-09-01",
    student_athlete: {
      uuid: "athlete-019",
      first_name: "Trinity",
      last_name: "Williams",
      sport: "womens_basketball",
    },
    agency: getAgency("agency-003"),
    last_document_uuid: "doc-030",
    participants: [mockParticipants.univCompliance1],
    posts: [],
    notes: [],
  },
  {
    uuid: "thread-031",
    title: "Retention IOI - Marcus Green",
    status: "executed",
    is_priority: false,
    current_holder: "on_file",
    contract_type: "ioi",
    contract_group: "retention",
    total_value: 450000000,
    age: 40,
    start_date: "2024-09-15",
    end_date: "2025-12-15",
    student_athlete: {
      uuid: "athlete-014",
      first_name: "Marcus",
      last_name: "Green",
      sport: "mens_basketball",
    },
    last_document_uuid: "doc-031",
    participants: [mockParticipants.univLegal2],
    posts: [],
    notes: [],
  },
  {
    uuid: "thread-032",
    title: "Under Armour Apparel - Tyler Mitchell",
    status: "executed",
    is_priority: false,
    current_holder: "on_file",
    contract_type: "third_party_nil",
    contract_group: "retention",
    total_value: 260000000,
    age: 32,
    start_date: "2024-10-15",
    end_date: "2026-04-15",
    student_athlete: {
      uuid: "athlete-003",
      first_name: "Tyler",
      last_name: "Mitchell",
      sport: "football",
    },
    agency: getAgency("agency-001"),
    last_document_uuid: "doc-032",
    participants: [mockParticipants.univCompliance2, mockParticipants.athleteAgent1],
    posts: [],
    notes: [],
  },

  // ACTIVE STATUS (5 agreements - in effect)
  {
    uuid: "thread-033",
    title: "University IOI - Marcus Johnson",
    status: "active",
    is_priority: false,
    current_holder: "on_file",
    contract_type: "ioi",
    contract_group: "retention",
    total_value: 1200000000,
    age: 120,
    start_date: "2024-01-15",
    end_date: "2026-01-15",
    student_athlete: {
      uuid: "athlete-001",
      first_name: "Marcus",
      last_name: "Johnson",
      sport: "football",
    },
    agency: getAgency("agency-001"),
    last_document_uuid: "doc-033",
    participants: [mockParticipants.univAdmin1, mockParticipants.athleteParent1],
    posts: [],
    notes: [],
  },
  {
    uuid: "thread-034",
    title: "Multi-Year IOI - Jaylen Williams",
    status: "active",
    is_priority: false,
    current_holder: "on_file",
    contract_type: "ioi",
    contract_group: "retention",
    total_value: 1850000000,
    age: 180,
    start_date: "2023-09-01",
    end_date: "2025-05-31",
    student_athlete: {
      uuid: "athlete-009",
      first_name: "Jaylen",
      last_name: "Williams",
      sport: "mens_basketball",
    },
    agency: getAgency("agency-007"),
    last_document_uuid: "doc-034",
    participants: [mockParticipants.univLegal1, mockParticipants.athleteAgent2],
    posts: [],
    notes: [],
  },
  {
    uuid: "thread-035",
    title: "Revenue Share - Aaliyah Davis",
    status: "active",
    is_priority: false,
    current_holder: "on_file",
    contract_type: "revenue_share",
    contract_group: "retention",
    total_value: 420000000,
    age: 150,
    start_date: "2023-11-01",
    end_date: "2025-11-01",
    student_athlete: {
      uuid: "athlete-016",
      first_name: "Aaliyah",
      last_name: "Davis",
      sport: "womens_basketball",
    },
    agency: getAgency("agency-003"),
    last_document_uuid: "doc-035",
    participants: [mockParticipants.univCompliance1],
    posts: [],
    notes: [],
  },
  {
    uuid: "thread-036",
    title: "Coca-Cola Partnership - Malik Thompson",
    status: "active",
    is_priority: false,
    current_holder: "on_file",
    contract_type: "third_party_nil",
    contract_group: "retention",
    total_value: 520000000,
    age: 200,
    start_date: "2023-07-01",
    end_date: "2025-07-01",
    student_athlete: {
      uuid: "athlete-007",
      first_name: "Malik",
      last_name: "Thompson",
      sport: "football",
    },
    agency: getAgency("agency-006"),
    last_document_uuid: "doc-036",
    participants: [mockParticipants.univLegal2],
    posts: [],
    notes: [],
  },
  {
    uuid: "thread-037",
    title: "BMW Ambassador - Sierra Thompson",
    status: "active",
    is_priority: false,
    current_holder: "on_file",
    contract_type: "third_party_nil",
    contract_group: "retention",
    total_value: 300000000,
    age: 90,
    start_date: "2024-04-01",
    end_date: "2026-04-01",
    student_athlete: {
      uuid: "athlete-015",
      first_name: "Sierra",
      last_name: "Thompson",
      sport: "womens_basketball",
    },
    agency: getAgency("agency-003"),
    last_document_uuid: "doc-037",
    participants: [mockParticipants.univCompliance2],
    posts: [],
    notes: [],
  },

  // TERMINATED/EXPIRED/CANCELLED STATUS (4 agreements)
  {
    uuid: "thread-038",
    title: "GameStop Promo - Kevin Patterson",
    status: "terminated",
    is_priority: false,
    current_holder: "on_file",
    contract_type: "third_party_nil",
    contract_group: "retention",
    total_value: 75000000,
    age: 60,
    start_date: "2024-06-01",
    end_date: "2025-06-01",
    student_athlete: {
      uuid: "athlete-013",
      first_name: "Kevin",
      last_name: "Patterson",
      sport: "mens_basketball",
    },
    agency: getAgency("agency-008"),
    last_document_uuid: "doc-038",
    participants: [mockParticipants.univLegal1],
    posts: [createPost("post-027", "Agreement terminated by mutual consent", 30)],
    notes: [],
  },
  {
    uuid: "thread-039",
    title: "Local Restaurant Deal - Andre Moore",
    status: "expired",
    is_priority: false,
    current_holder: "on_file",
    contract_type: "third_party_nil",
    contract_group: "retention",
    total_value: 25000000,
    age: 365,
    start_date: "2023-03-01",
    end_date: "2024-03-01",
    student_athlete: {
      uuid: "athlete-012",
      first_name: "Andre",
      last_name: "Moore",
      sport: "mens_basketball",
    },
    agency: getAgency("agency-007"),
    last_document_uuid: "doc-039",
    participants: [],
    posts: [],
    notes: [],
  },
  {
    uuid: "thread-040",
    title: "Downtown Athletics - Destiny Harris",
    status: "cancelled",
    is_priority: false,
    current_holder: "on_file",
    contract_type: "third_party_nil",
    contract_group: "retention",
    total_value: 45000000,
    age: 45,
    start_date: "2024-12-01",
    end_date: "2025-12-01",
    student_athlete: {
      uuid: "athlete-020",
      first_name: "Destiny",
      last_name: "Harris",
      sport: "womens_basketball",
    },
    agency: getAgency("agency-003"),
    last_document_uuid: "doc-040",
    participants: [mockParticipants.univCompliance1],
    posts: [createPost("post-028", "Deal cancelled - brand withdrew offer", 40)],
    notes: [],
  },
  {
    uuid: "thread-041",
    title: "Campus Eats Sponsorship - Chris Rodriguez",
    status: "cancelled",
    is_priority: false,
    current_holder: "on_file",
    contract_type: "third_party_nil",
    contract_group: "new_recruit",
    total_value: 15000000,
    age: 20,
    start_date: "2025-01-01",
    end_date: "2025-07-01",
    student_athlete: {
      uuid: "athlete-005",
      first_name: "Chris",
      last_name: "Rodriguez",
      sport: "football",
    },
    last_document_uuid: "doc-041",
    participants: [],
    posts: [createPost("post-029", "Cancelled - compliance issues identified", 18)],
    notes: [],
  },
];

// ============================================================================
// ATHLETE BUDGET DATA - Revenue Share, IOI, and Sponsorship tracking
// ============================================================================

export interface AthleteBudget {
  athleteUuid: string;
  revShare: number;        // University Revenue Share commitment (in cents)
  ioi: number;             // Indication of Interest - target sponsorship amount (in cents)
  sponsorships: {          // Individual sponsorship agreements
    sponsorUuid: string;
    sponsorName: string;
    amount: number;        // in cents
    status: 'active' | 'pending' | 'completed';
  }[];
}

export const mockAthleteBudgets: AthleteBudget[] = [
  // FOOTBALL - High value players with various gap scenarios
  {
    athleteUuid: "athlete-001", // Marcus Johnson - fully funded
    revShare: 500000000,        // $5M rev share
    ioi: 750000000,             // $7.5M IOI target
    sponsorships: [
      { sponsorUuid: "brand-001", sponsorName: "Nike", amount: 500000000, status: 'active' },
      { sponsorUuid: "brand-005", sponsorName: "State Farm", amount: 250000000, status: 'active' },
    ]
  },
  {
    athleteUuid: "athlete-002", // DeShawn Carter - has gap
    revShare: 300000000,        // $3M rev share
    ioi: 600000000,             // $6M IOI target
    sponsorships: [
      { sponsorUuid: "brand-003", sponsorName: "Gatorade", amount: 150000000, status: 'active' },
    ]
  },
  {
    athleteUuid: "athlete-003", // Tyler Mitchell - significant gap
    revShare: 400000000,        // $4M rev share
    ioi: 700000000,             // $7M IOI target
    sponsorships: [
      { sponsorUuid: "brand-007", sponsorName: "Under Armour", amount: 280000000, status: 'pending' },
    ]
  },
  {
    athleteUuid: "athlete-004", // Jamal Washington - well funded
    revShare: 450000000,        // $4.5M rev share
    ioi: 500000000,             // $5M IOI target
    sponsorships: [
      { sponsorUuid: "brand-003", sponsorName: "Gatorade", amount: 650000000, status: 'active' },
    ]
  },
  {
    athleteUuid: "athlete-005", // Chris Rodriguez - new recruit, large gap
    revShare: 175000000,        // $1.75M rev share
    ioi: 400000000,             // $4M IOI target
    sponsorships: []            // No sponsorships yet
  },
  {
    athleteUuid: "athlete-006", // Darius Jenkins - moderate gap
    revShare: 250000000,        // $2.5M rev share
    ioi: 450000000,             // $4.5M IOI target
    sponsorships: [
      { sponsorUuid: "brand-007", sponsorName: "Under Armour", amount: 180000000, status: 'active' },
    ]
  },
  {
    athleteUuid: "athlete-007", // Malik Thompson - overfunded
    revShare: 600000000,        // $6M rev share
    ioi: 800000000,             // $8M IOI target
    sponsorships: [
      { sponsorUuid: "brand-010", sponsorName: "Red Bull", amount: 380000000, status: 'active' },
      { sponsorUuid: "brand-001", sponsorName: "Nike", amount: 450000000, status: 'active' },
    ]
  },
  {
    athleteUuid: "athlete-008", // Brandon Lewis - needs sponsors
    revShare: 95000000,         // $950K rev share
    ioi: 250000000,             // $2.5M IOI target
    sponsorships: []            // No sponsorships
  },

  // MEN'S BASKETBALL
  {
    athleteUuid: "athlete-009", // Jaylen Williams - star player, well funded
    revShare: 800000000,        // $8M rev share
    ioi: 1200000000,            // $12M IOI target
    sponsorships: [
      { sponsorUuid: "brand-001", sponsorName: "Nike", amount: 850000000, status: 'active' },
      { sponsorUuid: "brand-009", sponsorName: "Oakley", amount: 180000000, status: 'active' },
      { sponsorUuid: "brand-004", sponsorName: "Beats by Dre", amount: 220000000, status: 'pending' },
    ]
  },
  {
    athleteUuid: "athlete-010", // Jordan Brooks - moderate gap
    revShare: 350000000,        // $3.5M rev share
    ioi: 500000000,             // $5M IOI target
    sponsorships: [
      { sponsorUuid: "brand-002", sponsorName: "Adidas", amount: 280000000, status: 'active' },
      { sponsorUuid: "brand-013", sponsorName: "Local Ford Dealership", amount: 50000000, status: 'active' },
    ]
  },
  {
    athleteUuid: "athlete-011", // Terrell Davis - needs more sponsors
    revShare: 280000000,        // $2.8M rev share
    ioi: 450000000,             // $4.5M IOI target
    sponsorships: [
      { sponsorUuid: "brand-004", sponsorName: "Beats by Dre", amount: 175000000, status: 'active' },
    ]
  },
  {
    athleteUuid: "athlete-012", // Andre Moore - new, large gap
    revShare: 200000000,        // $2M rev share
    ioi: 400000000,             // $4M IOI target
    sponsorships: []
  },
  {
    athleteUuid: "athlete-013", // Kevin Patterson - moderate
    revShare: 220000000,        // $2.2M rev share
    ioi: 380000000,             // $3.8M IOI target
    sponsorships: [
      { sponsorUuid: "brand-011", sponsorName: "GameStop", amount: 150000000, status: 'active' },
    ]
  },
  {
    athleteUuid: "athlete-014", // Marcus Green - well covered
    revShare: 400000000,        // $4M rev share
    ioi: 550000000,             // $5.5M IOI target
    sponsorships: [
      { sponsorUuid: "brand-001", sponsorName: "Nike", amount: 320000000, status: 'active' },
      { sponsorUuid: "brand-006", sponsorName: "Coca-Cola", amount: 170000000, status: 'active' },
    ]
  },

  // WOMEN'S BASKETBALL
  {
    athleteUuid: "athlete-015", // Sierra Thompson - well funded
    revShare: 350000000,        // $3.5M rev share
    ioi: 500000000,             // $5M IOI target
    sponsorships: [
      { sponsorUuid: "brand-002", sponsorName: "Adidas", amount: 320000000, status: 'active' },
      { sponsorUuid: "brand-012", sponsorName: "Chipotle", amount: 100000000, status: 'active' },
    ]
  },
  {
    athleteUuid: "athlete-016", // Aaliyah Davis - star, fully funded
    revShare: 500000000,        // $5M rev share
    ioi: 700000000,             // $7M IOI target
    sponsorships: [
      { sponsorUuid: "brand-001", sponsorName: "Nike", amount: 420000000, status: 'active' },
      { sponsorUuid: "brand-003", sponsorName: "Gatorade", amount: 300000000, status: 'active' },
    ]
  },
  {
    athleteUuid: "athlete-017", // Kayla Robinson - new recruit, needs sponsors
    revShare: 95000000,         // $950K rev share
    ioi: 200000000,             // $2M IOI target
    sponsorships: []
  },
  {
    athleteUuid: "athlete-018", // Maya Jackson - moderate gap
    revShare: 250000000,        // $2.5M rev share
    ioi: 400000000,             // $4M IOI target
    sponsorships: [
      { sponsorUuid: "brand-014", sponsorName: "Downtown Athletics", amount: 80000000, status: 'active' },
    ]
  },
  {
    athleteUuid: "athlete-019", // Trinity Williams - small gap
    revShare: 380000000,        // $3.8M rev share
    ioi: 500000000,             // $5M IOI target
    sponsorships: [
      { sponsorUuid: "brand-007", sponsorName: "Under Armour", amount: 250000000, status: 'active' },
    ]
  },
  {
    athleteUuid: "athlete-020", // Destiny Harris - needs sponsors
    revShare: 180000000,        // $1.8M rev share
    ioi: 350000000,             // $3.5M IOI target
    sponsorships: [
      { sponsorUuid: "brand-015", sponsorName: "Campus Eats", amount: 45000000, status: 'completed' },
    ]
  },
  {
    athleteUuid: "athlete-021", // Jasmine Brown - freshman, large gap
    revShare: 120000000,        // $1.2M rev share
    ioi: 280000000,             // $2.8M IOI target
    sponsorships: []
  },
  {
    athleteUuid: "athlete-022", // Brianna Scott - well funded
    revShare: 320000000,        // $3.2M rev share
    ioi: 450000000,             // $4.5M IOI target
    sponsorships: [
      { sponsorUuid: "brand-002", sponsorName: "Adidas", amount: 280000000, status: 'active' },
      { sponsorUuid: "brand-006", sponsorName: "Coca-Cola", amount: 130000000, status: 'active' },
    ]
  },
];

// Get budget data for an athlete
export function getAthleteBudget(athleteUuid: string): AthleteBudget | undefined {
  return mockAthleteBudgets.find(b => b.athleteUuid === athleteUuid);
}

// Calculate totals for an athlete using the new sponsorship agreements
export function calculateAthleteBudgetTotals(budget: AthleteBudget) {
  // Get all sponsorship agreements for this athlete from the new system
  const athleteAgreements = getAgreementsByAthlete(budget.athleteUuid);
  
  // Total of all sponsorships (regardless of IOI flag)
  const totalSponsorships = athleteAgreements
    .filter(a => a.status !== 'cancelled')
    .reduce((sum, a) => sum + a.amount, 0);
  
  // Total that applies to IOI target
  const ioiSponsorships = athleteAgreements
    .filter(a => a.status !== 'cancelled' && a.appliesToIoi)
    .reduce((sum, a) => sum + a.amount, 0);
  
  const total = budget.revShare + budget.ioi; // Total = Rev Share + IOI Target
  const sponsorshipGap = Math.max(0, budget.ioi - ioiSponsorships);
  const sponsorshipProgress = budget.ioi > 0 ? (ioiSponsorships / budget.ioi) * 100 : 0;
  
  return {
    revShare: budget.revShare,
    ioi: budget.ioi,
    totalSponsorships,
    ioiSponsorships,
    total,
    sponsorshipGap,
    sponsorshipProgress: Math.min(100, sponsorshipProgress),
    sponsorCount: athleteAgreements.filter(a => a.status !== 'cancelled').length,
    isFullyFunded: ioiSponsorships >= budget.ioi,
  };
}

// Get all athletes with their budget data for roster view
export function getRosterWithBudgets() {
  return mockAthletes.map(athlete => {
    const budget = getAthleteBudget(athlete.uuid);
    const totals = budget ? calculateAthleteBudgetTotals(budget) : {
      revShare: 0,
      ioi: 0,
      totalSponsorships: 0,
      total: 0,
      sponsorshipGap: 0,
      sponsorshipProgress: 0,
      sponsorCount: 0,
      isFullyFunded: false,
    };
    
    return {
      ...athlete,
      budget: totals,
    };
  });
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Get athlete by UUID
export function getAthleteByUuid(uuid: string): StudentAthleteWithContracts | undefined {
  return mockAthletes.find((a) => a.uuid === uuid);
}

// Get thread by UUID
export function getThreadByUuid(uuid: string): Thread | undefined {
  return mockThreads.find((t) => t.uuid === uuid);
}

// Get threads for an athlete
export function getThreadsForAthlete(athleteUuid: string): Thread[] {
  return mockThreads.filter((t) => t.student_athlete?.uuid === athleteUuid);
}

// Get agency by UUID
export function getAgencyByUuid(uuid: string) {
  return mockAgencies.find((a) => a.uuid === uuid);
}

// Get all threads by status
export function getThreadsByStatus(status: ThreadStatus): Thread[] {
  return mockThreads.filter((t) => t.status === status);
}

// Get thread stats
export function getThreadStats() {
  const statuses: ThreadStatus[] = ['drafting', 'draft_sent', 'in_redlining', 'ready_to_sign', 'executed', 'active', 'terminated', 'expired', 'cancelled'];
  
  return statuses.reduce((acc, status) => {
    acc[status] = mockThreads.filter(t => t.status === status).length;
    return acc;
  }, {} as Record<ThreadStatus, number>);
}

// Summary statistics
export const mockStats = {
  totalAthletes: mockAthletes.length,
  totalThreads: mockThreads.length,
  totalContractValue: mockThreads.reduce((sum, t) => sum + (t.total_value || 0), 0),
  threadsByStatus: getThreadStats(),
  athletesBySport: {
    football: mockAthletes.filter(a => a.sport === 'football').length,
    mens_basketball: mockAthletes.filter(a => a.sport === 'mens_basketball').length,
    womens_basketball: mockAthletes.filter(a => a.sport === 'womens_basketball').length,
  },
};
