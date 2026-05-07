// ============================================================
// Analog Financial — Standardized Demo Contract Dataset
// Based on OSU NIL License Agreement structure
// Fictional athlete: Marcus Williams
// ============================================================

// -- Contract Overview --

export const demoContract = {
  id: "contract-marcus-williams-osu",
  athleteName: "Marcus Williams",
  athleteInitials: "MW",
  sport: "Football",
  position: "Wide Receiver",
  sourceName: "The Ohio State University",
  sourceShortName: "Ohio State",
  sourceType: "Public University" as const,
  contractType: "NIL License Agreement",
  effectiveDate: "2026-01-16",
  termEndDate: "2028-01-15",
  statedTotal: 182500,
  computedTotal: 180000,
  discrepancy: 2500,
  discrepancyNote:
    "Stated total ($182,500) exceeds scheduled total ($180,000) by $2,500. Off-schedule payments (Signing Bonus $1,500 + Bowl Game $500 + Academic $500) account for the difference.",
  status: "needs-review" as const,
  uploadedDate: "2026-01-17",
  processedDate: "2026-01-17",
  overallConfidence: 0.91,
  fileName: "Williams_Marcus_NIL_OSU_2026.pdf",
  pageCount: 14,
}

// -- Parties --

export interface DemoParty {
  id: string
  role: "source" | "beneficiary"
  name: string
  entityType: string
  confidence: number
  extractedFrom: string
  flag?: string
}

export const demoParties: DemoParty[] = [
  {
    id: "party-osu",
    role: "source",
    name: "The Ohio State University",
    entityType: "Public University",
    confidence: 0.97,
    extractedFrom: "Section 1.1, Page 1",
  },
  {
    id: "party-marcus",
    role: "beneficiary",
    name: "Marcus Williams",
    entityType: "Individual",
    confidence: 0.98,
    extractedFrom: "Section 1.2, Page 1",
  },
]

// -- Scheduled Payments (24 months, front-loaded) --

export interface DemoScheduledPayment {
  id: string
  number: number
  date: string
  amount: number
  athleticSeason: string
  fiscalYear: string
  confidence: number
  flag?: string
}

export const demoScheduledPayments: DemoScheduledPayment[] = [
  { id: "sp-1", number: 1, date: "2026-02-01", amount: 14000, athleticSeason: "Offseason", fiscalYear: "FY2026", confidence: 0.82, flag: "Annex A not present in upload — amounts estimated" },
  { id: "sp-2", number: 2, date: "2026-03-01", amount: 12500, athleticSeason: "Offseason", fiscalYear: "FY2026", confidence: 0.82, flag: "Annex A not present in upload — amounts estimated" },
  { id: "sp-3", number: 3, date: "2026-04-01", amount: 11000, athleticSeason: "Spring Practice", fiscalYear: "FY2026", confidence: 0.82, flag: "Annex A not present in upload — amounts estimated" },
  { id: "sp-4", number: 4, date: "2026-05-01", amount: 10000, athleticSeason: "Spring Practice", fiscalYear: "FY2026", confidence: 0.82, flag: "Annex A not present in upload — amounts estimated" },
  { id: "sp-5", number: 5, date: "2026-06-01", amount: 9500, athleticSeason: "Offseason", fiscalYear: "FY2026", confidence: 0.82, flag: "Annex A not present in upload — amounts estimated" },
  { id: "sp-6", number: 6, date: "2026-07-01", amount: 9000, athleticSeason: "Preseason", fiscalYear: "FY2026", confidence: 0.82, flag: "Annex A not present in upload — amounts estimated" },
  { id: "sp-7", number: 7, date: "2026-08-01", amount: 8500, athleticSeason: "Preseason", fiscalYear: "FY2027", confidence: 0.82, flag: "Annex A not present in upload — amounts estimated" },
  { id: "sp-8", number: 8, date: "2026-09-01", amount: 8000, athleticSeason: "Regular Season", fiscalYear: "FY2027", confidence: 0.82, flag: "Annex A not present in upload — amounts estimated" },
  { id: "sp-9", number: 9, date: "2026-10-01", amount: 7500, athleticSeason: "Regular Season", fiscalYear: "FY2027", confidence: 0.82, flag: "Annex A not present in upload — amounts estimated" },
  { id: "sp-10", number: 10, date: "2026-11-01", amount: 7000, athleticSeason: "Regular Season", fiscalYear: "FY2027", confidence: 0.82, flag: "Annex A not present in upload — amounts estimated" },
  { id: "sp-11", number: 11, date: "2026-12-01", amount: 7000, athleticSeason: "Postseason", fiscalYear: "FY2027", confidence: 0.82, flag: "Annex A not present in upload — amounts estimated" },
  { id: "sp-12", number: 12, date: "2027-01-01", amount: 6500, athleticSeason: "Postseason", fiscalYear: "FY2027", confidence: 0.82, flag: "Annex A not present in upload — amounts estimated" },
  { id: "sp-13", number: 13, date: "2027-02-01", amount: 6500, athleticSeason: "Offseason", fiscalYear: "FY2027", confidence: 0.82, flag: "Annex A not present in upload — amounts estimated" },
  { id: "sp-14", number: 14, date: "2027-03-01", amount: 6000, athleticSeason: "Offseason", fiscalYear: "FY2027", confidence: 0.82, flag: "Annex A not present in upload — amounts estimated" },
  { id: "sp-15", number: 15, date: "2027-04-01", amount: 6000, athleticSeason: "Spring Practice", fiscalYear: "FY2027", confidence: 0.82, flag: "Annex A not present in upload — amounts estimated" },
  { id: "sp-16", number: 16, date: "2027-05-01", amount: 5500, athleticSeason: "Spring Practice", fiscalYear: "FY2027", confidence: 0.82, flag: "Annex A not present in upload — amounts estimated" },
  { id: "sp-17", number: 17, date: "2027-06-01", amount: 5500, athleticSeason: "Offseason", fiscalYear: "FY2027", confidence: 0.82, flag: "Annex A not present in upload — amounts estimated" },
  { id: "sp-18", number: 18, date: "2027-07-01", amount: 5000, athleticSeason: "Preseason", fiscalYear: "FY2027", confidence: 0.82, flag: "Annex A not present in upload — amounts estimated" },
  { id: "sp-19", number: 19, date: "2027-08-01", amount: 5000, athleticSeason: "Preseason", fiscalYear: "FY2028", confidence: 0.82, flag: "Annex A not present in upload — amounts estimated" },
  { id: "sp-20", number: 20, date: "2027-09-01", amount: 4500, athleticSeason: "Regular Season", fiscalYear: "FY2028", confidence: 0.82, flag: "Annex A not present in upload — amounts estimated" },
  { id: "sp-21", number: 21, date: "2027-10-01", amount: 4500, athleticSeason: "Regular Season", fiscalYear: "FY2028", confidence: 0.82, flag: "Annex A not present in upload — amounts estimated" },
  { id: "sp-22", number: 22, date: "2027-11-01", amount: 4000, athleticSeason: "Regular Season", fiscalYear: "FY2028", confidence: 0.82, flag: "Annex A not present in upload — amounts estimated" },
  { id: "sp-23", number: 23, date: "2027-12-01", amount: 4000, athleticSeason: "Postseason", fiscalYear: "FY2028", confidence: 0.82, flag: "Annex A not present in upload — amounts estimated" },
  { id: "sp-24", number: 24, date: "2028-01-01", amount: 3500, athleticSeason: "Postseason", fiscalYear: "FY2028", confidence: 0.82, flag: "Annex A not present in upload — amounts estimated" },
]

export const SCHEDULED_TOTAL = 180000

// -- Off-Schedule Payments --

export interface DemoOffSchedulePayment {
  id: string
  name: string
  trigger: string
  amount: number
  earliestDate: string
  latestDate?: string
  confidence: number
  flag?: string
}

export const demoOffSchedulePayments: DemoOffSchedulePayment[] = [
  {
    id: "os-1",
    name: "Signing Bonus",
    trigger: "Contract execution",
    amount: 1500,
    earliestDate: "2026-01-16",
    latestDate: "2026-01-21",
    confidence: 0.97,
  },
  {
    id: "os-2",
    name: "Bowl Game Appearance",
    trigger: "OSU appears in CFP Quarterfinal or better",
    amount: 500,
    earliestDate: "2026-12-20",
    latestDate: "2027-01-20",
    confidence: 0.78,
    flag: "Trigger conditions require verification",
  },
  {
    id: "os-3",
    name: "Academic Achievement",
    trigger: "Athlete achieves Dean's List (3.5+ GPA) in any semester",
    amount: 500,
    earliestDate: "2026-05-15",
    confidence: 0.78,
    flag: "GPA threshold requires verification",
  },
]

export const OFF_SCHEDULE_TOTAL = 2500
export const GRAND_TOTAL = 182500

// -- Obligations --

export interface DemoObligation {
  id: string
  code: string
  title: string
  description: string
  verification: string
  cadence: string
  gatesPayment: boolean
  gatesPaymentDetail?: string
  confidence: number
  flag?: string
}

export const demoObligations: DemoObligation[] = [
  {
    id: "ob-1",
    code: "OB-1",
    title: "Full-Time Enrollment",
    description:
      "Athlete must maintain full-time student status (minimum 12 credit hours per semester) throughout the contract term",
    verification: "University Registrar confirmation",
    cadence: "Each semester — August and January",
    gatesPayment: true,
    gatesPaymentDetail: "All payments within the affected semester suspend if unmet",
    confidence: 0.95,
  },
  {
    id: "ob-2",
    code: "OB-2",
    title: "NCAA Eligibility",
    description:
      "Athlete must maintain NCAA eligibility throughout the term. Any loss of eligibility triggers immediate suspension of all scheduled and off-schedule payments. Payments are reduced on a prorated daily basis for any period of ineligibility.",
    verification: "Athletic Department eligibility certification",
    cadence: "Each semester; continuous monitoring",
    gatesPayment: true,
    gatesPaymentDetail: "Immediate suspension, prorated by calendar day",
    confidence: 0.95,
  },
  {
    id: "ob-3",
    code: "OB-3",
    title: "Rules Compliance",
    description:
      "Athlete must comply with all policies, rules, and codes of conduct of Ohio State, the Big Ten Conference, the NCAA, and the College Sports Commission (CSC)",
    verification: "Ongoing institutional monitoring",
    cadence: "Continuous",
    gatesPayment: false,
    gatesPaymentDetail: "Breach triggers contract termination",
    confidence: 0.95,
  },
  {
    id: "ob-4",
    code: "OB-4",
    title: "Third-Party NIL Reporting",
    description:
      "Athlete must report any third-party NIL deal valued at $600 or more to the Institution and to the designated Reporting System. Failure to report is a material breach and triggers loss of Good Standing.",
    verification: "Submission to Institution's clearinghouse / Reporting System",
    cadence: "Per deal (event-triggered)",
    gatesPayment: false,
    gatesPaymentDetail: "Indirect — failure leads to loss of Good Standing, then payments suspend",
    confidence: 0.95,
  },
  {
    id: "ob-5",
    code: "OB-5",
    title: "Prohibited Conduct",
    description:
      "Athlete must not engage in conduct harmful to reputation. Prohibited NIL categories include: alcohol, tobacco, e-cigarettes, gambling, adult entertainment, illegal activities, hate speech. Personal conduct must avoid drugs, alcohol abuse, sexual misconduct, illegal gambling, and felonious conduct.",
    verification: "Ongoing; Institution monitors at its discretion",
    cadence: "Continuous",
    gatesPayment: false,
    gatesPaymentDetail: "Breach triggers termination",
    confidence: 0.95,
  },
  {
    id: "ob-6",
    code: "OB-6",
    title: "University Exclusivity",
    description:
      "Athlete may not use or authorize use of their NIL in connection with any other college or university during the contract term",
    verification: "Ongoing monitoring via Reporting System",
    cadence: "Continuous",
    gatesPayment: false,
    gatesPaymentDetail: "Breach triggers termination",
    confidence: 0.95,
  },
  {
    id: "ob-7",
    code: "OB-7",
    title: "Transfer Portal",
    description:
      "If the Athlete enters the NCAA transfer portal or transfers to another institution, Ohio State has no further payment obligation. Ohio State may seek prorated reimbursement of any amounts already paid for the remainder of the payment period in which the transfer occurs.",
    verification: "NCAA transfer portal monitoring",
    cadence: "Event-triggered",
    gatesPayment: true,
    gatesPaymentDetail: "Hard stop — all future payments terminate immediately",
    confidence: 0.95,
    flag: "Clawback mechanism (prorated reimbursement) exists — needs manual review if triggered",
  },
  {
    id: "ob-8",
    code: "OB-8",
    title: "Confidentiality",
    description:
      "Terms and conditions of this agreement may not be disclosed to any third party without Ohio State's prior written approval. Exception: disclosure to parents, guardians, attorneys, and advisors is permitted.",
    verification: "Not monitored; obligation on Athlete",
    cadence: "Ongoing; survives contract expiration by 5 years",
    gatesPayment: false,
    confidence: 0.95,
    flag: "Survives contract by 5 years",
  },
]

// -- Termination Triggers --

export interface DemoTerminationTrigger {
  trigger: string
  paymentEffect: string
}

export const demoTerminationTriggers: DemoTerminationTrigger[] = [
  { trigger: "Transfer portal entry or transfer", paymentEffect: "All future payments terminate; potential clawback" },
  { trigger: "Criminal conviction or guilty plea", paymentEffect: "All future payments terminate" },
  { trigger: "Loss of NCAA eligibility", paymentEffect: "Payments suspend; prorated reduction" },
  { trigger: "Morals clause violation", paymentEffect: "All future payments terminate" },
  { trigger: "Rules violation (NCAA / Big Ten / CSC)", paymentEffect: "All future payments terminate" },
  { trigger: "Signs professional contract (Turns Pro)", paymentEffect: "All future payments terminate" },
  { trigger: "End of NCAA eligibility period", paymentEffect: "Contract expires naturally" },
  { trigger: "Change of law", paymentEffect: "Institution may terminate" },
]

// -- Extraction Flags --

export interface DemoExtractionFlag {
  item: string
  confidence: "high" | "medium"
  flag?: string
}

export const demoExtractionFlags: DemoExtractionFlag[] = [
  { item: "Ohio State University (Source)", confidence: "high" },
  { item: "Marcus Williams (Beneficiary)", confidence: "high" },
  { item: "Scheduled payments (full schedule)", confidence: "medium", flag: "Annex A not present in upload — amounts estimated" },
  { item: "Off-schedule: Signing Bonus", confidence: "high" },
  { item: "Off-schedule: Bowl Game Appearance", confidence: "medium", flag: "Trigger conditions require verification" },
  { item: "Off-schedule: Academic Achievement", confidence: "medium", flag: "GPA threshold requires verification" },
  { item: "Stated total ($182,500)", confidence: "high" },
  { item: "Computed total ($180,000 scheduled only)", confidence: "high", flag: "Mismatch until off-schedule total confirmed" },
  { item: "OB-1 Full-Time Enrollment", confidence: "high" },
  { item: "OB-2 NCAA Eligibility", confidence: "high" },
  { item: "OB-3 Rules Compliance", confidence: "high" },
  { item: "OB-4 NIL Reporting", confidence: "high" },
  { item: "OB-5 Prohibited Conduct", confidence: "high" },
  { item: "OB-6 University Exclusivity", confidence: "high" },
  { item: "OB-7 Transfer Portal", confidence: "high", flag: "Clawback clause noted" },
  { item: "OB-8 Confidentiality", confidence: "high", flag: "Survives contract by 5 years" },
]

// -- Key Terms (for detail views) --

export const demoKeyTerms = {
  governingLaw: "State of Ohio",
  disputeResolution: "Binding arbitration in Columbus, Ohio",
  confidentiality: "5-year post-term survival; exceptions for family, attorneys, advisors",
  terminationNotice: "Written notice to Athlete's last known address",
  assignability: "Not assignable without written consent of both parties",
  amendment: "Amendments must be in writing and signed by both parties",
  severability: "Invalid provisions severable; remainder enforceable",
  goodStanding:
    "Athlete must be in Good Standing (enrolled, eligible, compliant, no outstanding reporting obligations) to receive payments",
}

// -- Helper: secondary contracts for list views that need multiple items --

export interface DemoSecondaryContract {
  id: string
  athleteName: string
  athleteInitials: string
  sport: string
  sourceName: string
  sourceShortName: string
  contractType: string
  statedTotal: number
  status: "needs-review" | "processing" | "active" | "flagged"
  uploadedDate: string
  effectiveDate: string
  termEndDate: string
  overallConfidence: number
}

export const demoSecondaryContracts: DemoSecondaryContract[] = [
  {
    id: "contract-jaylen-carter",
    athleteName: "Jaylen Carter",
    athleteInitials: "JC",
    sport: "Football",
    sourceName: "The Ohio State University",
    sourceShortName: "Ohio State",
    contractType: "NIL License Agreement",
    statedTotal: 95000,
    status: "active",
    uploadedDate: "2026-01-10",
    effectiveDate: "2026-01-10",
    termEndDate: "2027-01-09",
    overallConfidence: 0.96,
  },
  {
    id: "contract-aisha-patel",
    athleteName: "Aisha Patel",
    athleteInitials: "AP",
    sport: "Men's Basketball",
    sourceName: "The Ohio State University",
    sourceShortName: "Ohio State",
    contractType: "NIL License Agreement",
    statedTotal: 120000,
    status: "processing",
    uploadedDate: "2026-01-18",
    effectiveDate: "2026-02-01",
    termEndDate: "2027-01-31",
    overallConfidence: 0.88,
  },
  {
    id: "contract-tyler-robinson",
    athleteName: "Tyler Robinson",
    athleteInitials: "TR",
    sport: "Football",
    sourceName: "The Ohio State University",
    sourceShortName: "Ohio State",
    contractType: "NIL License Agreement",
    statedTotal: 75000,
    status: "flagged",
    uploadedDate: "2026-01-12",
    effectiveDate: "2026-01-15",
    termEndDate: "2027-01-14",
    overallConfidence: 0.72,
  },
  {
    id: "contract-sofia-chen",
    athleteName: "Sofia Chen",
    athleteInitials: "SC",
    sport: "Soccer",
    sourceName: "The Ohio State University",
    sourceShortName: "Ohio State",
    contractType: "NIL License Agreement",
    statedTotal: 62000,
    status: "active",
    uploadedDate: "2025-12-20",
    effectiveDate: "2026-01-01",
    termEndDate: "2026-12-31",
    overallConfidence: 0.94,
  },
  {
    id: "contract-jaylen-carter",
    athleteName: "Jaylen Carter",
    athleteInitials: "JC",
    sport: "Football",
    sourceName: "The Ohio State University",
    sourceShortName: "Ohio State",
    contractType: "NIL License Agreement",
    statedTotal: 95000,
    status: "needs-review",
    uploadedDate: "2026-02-02",
    effectiveDate: "2026-03-01",
    termEndDate: "2028-02-28",
    overallConfidence: 0.85,
  },
]
