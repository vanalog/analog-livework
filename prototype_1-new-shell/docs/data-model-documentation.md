# Analog NIL Platform - Data Model Documentation

## Overview

This document provides a comprehensive reference for the Analog NIL (Name, Image, Likeness) platform data model. Use this as the starting point for any new development chat.

**Key Architecture Decisions (Latest):**
- **Single-tenant prototype** - No workspace/multi-tenancy complexity
- **No "Threads"** - Use "Agreements" terminology everywhere
- **Full Supabase migration planned** - Replace external API with Supabase tables
- **University on Athlete** - Athletes have a direct `university` field, not workspace association

---

## Target Data Model (Supabase)

This is the **target schema** for the Supabase migration. The current app uses a mix of external APIs and mock data.

### Athletes Table
```sql
CREATE TABLE athletes (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  edu_email TEXT,                    -- University email
  secondary_email TEXT,              -- Personal email
  phone_number TEXT,                 -- Single phone, formatted (555) 123-4567
  sport TEXT NOT NULL,               -- 'football' | 'mens_basketball' | 'womens_basketball'
  graduation_year TEXT,
  university TEXT,                   -- Direct university name on athlete
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Agreements Table
Replaces the "Thread" concept. Single table with `type` discriminator.

```sql
CREATE TABLE agreements (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_uuid UUID NOT NULL REFERENCES athletes(uuid),
  type TEXT NOT NULL,                -- 'revenue_share' | 'sponsorship'
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft' | 'active' | 'completed' | 'terminated'
  total_value BIGINT NOT NULL,       -- in cents
  start_date DATE,
  end_date DATE,
  
  -- Revenue Share specific (nullable for sponsorships)
  revenue_share_percentage DECIMAL,
  
  -- Sponsorship specific (nullable for revenue share)
  sponsor_uuid UUID REFERENCES sponsors(uuid),
  campaign_uuid UUID REFERENCES campaigns(uuid),
  applies_to_ioi BOOLEAN DEFAULT true,  -- Counts toward athlete's IOI target?
  
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Sponsors Table
```sql
CREATE TABLE sponsors (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  total_budget BIGINT,               -- Optional budget cap, in cents
  status TEXT DEFAULT 'active',      -- 'active' | 'inactive'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Campaigns Table
```sql
CREATE TABLE campaigns (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_uuid UUID NOT NULL REFERENCES sponsors(uuid),
  name TEXT NOT NULL,
  description TEXT,
  budget BIGINT,                     -- Optional budget cap, in cents
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'draft',       -- 'draft' | 'active' | 'completed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Athlete Budgets Table
Stores IOI (Indication of Interest) targets per athlete.

```sql
CREATE TABLE athlete_budgets (
  athlete_uuid UUID PRIMARY KEY REFERENCES athletes(uuid),
  rev_share BIGINT DEFAULT 0,        -- Revenue share commitment, in cents
  ioi BIGINT,                        -- IOI target (nullable), in cents
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Universities Table (Optional)
For managing known universities with autocomplete.

```sql
CREATE TABLE universities (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  abbreviation TEXT,                 -- e.g., "UF", "OSU"
  conference TEXT,                   -- e.g., "SEC", "Big Ten"
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Entity Relationships

```
┌─────────────┐      ┌─────────────────┐      ┌─────────────┐
│  Athletes   │──────│   Agreements    │──────│  Sponsors   │
└─────────────┘      └─────────────────┘      └─────────────┘
       │                     │                       │
       │                     │                       │
       ▼                     │                       ▼
┌─────────────────┐          │              ┌─────────────┐
│ Athlete_Budgets │          │              │  Campaigns  │
│ (IOI targets)   │          └──────────────│             │
└─────────────────┘                         └─────────────┘
```

**Relationships:**
- Athlete → has one → Athlete Budget (IOI target + rev share base)
- Athlete → has many → Agreements
- Agreement → belongs to → Athlete
- Agreement (type=sponsorship) → belongs to → Sponsor
- Agreement (type=sponsorship) → optionally belongs to → Campaign
- Sponsor → has many → Campaigns
- Campaign → has many → Agreements (sponsorships)

---

## Budget Calculation Logic

### Per-Athlete Totals
```typescript
function calculateAthleteTotals(athleteUuid: string) {
  const budget = getAthleteBudget(athleteUuid);  // { revShare, ioi }
  const agreements = getAgreementsForAthlete(athleteUuid);
  
  const revShareAgreements = agreements.filter(a => a.type === 'revenue_share');
  const sponsorshipAgreements = agreements.filter(a => a.type === 'sponsorship');
  
  const revShare = sum(revShareAgreements.map(a => a.total_value)) + budget.revShare;
  const totalSponsorships = sum(sponsorshipAgreements.map(a => a.total_value));
  const ioiSponsorships = sum(sponsorshipAgreements.filter(a => a.applies_to_ioi).map(a => a.total_value));
  
  return {
    revShare,
    totalSponsorships,
    ioiSponsorships,
    total: revShare + totalSponsorships,
    sponsorshipGap: Math.max(0, (budget.ioi || 0) - ioiSponsorships),
    sponsorshipProgress: budget.ioi ? (ioiSponsorships / budget.ioi) * 100 : 0,
    isFullyFunded: budget.ioi ? ioiSponsorships >= budget.ioi : true
  };
}
```

### Roster Aggregates
```typescript
function calculateRosterTotals(athletes: Athlete[]) {
  return {
    totalAthletes: athletes.length,
    totalCommitted: sum(athletes.map(a => calculateAthleteTotals(a.uuid).total)),
    athletesWithGap: athletes.filter(a => !calculateAthleteTotals(a.uuid).isFullyFunded).length,
    fullyFunded: athletes.filter(a => calculateAthleteTotals(a.uuid).isFullyFunded).length,
    totalGap: sum(athletes.map(a => calculateAthleteTotals(a.uuid).sponsorshipGap))
  };
}
```

---

## Current State vs. Target State

| Entity | Current State | Target State |
|--------|--------------|--------------|
| Athletes | External API `/v1/student_athletes/*` | Supabase `athletes` table |
| Agreements | External API `/v1/threads/*` (called "Threads") | Supabase `agreements` table |
| Sponsors | Mock data in `/src/lib/mock-data.ts` | Supabase `sponsors` table |
| Campaigns | Mock data | Supabase `campaigns` table |
| Athlete Budgets | Mock data (`MOCK_ATHLETE_BUDGETS`) | Supabase `athlete_budgets` table |
| Universities | Hardcoded array `KNOWN_UNIVERSITIES` | Supabase `universities` table (optional) |

---

## CRUD Operations Status

All CRUD operations have UI components built. They are wired up but persistence is mocked (TODO: connect to Supabase).

| Entity | Create | Read | Update | Delete | Notes |
|--------|--------|------|--------|--------|-------|
| **Athletes** | `add-athlete-dialog.tsx` | `/athletes`, `/athletes/[uuid]` | `edit-athlete-dialog.tsx` | `DeleteConfirmationDialog` | Complete UI |
| **Sponsors** | `add-sponsor-dialog.tsx` | `/sponsors`, `/sponsors/[id]` | `edit-sponsor-dialog.tsx` | `DeleteConfirmationDialog` | Complete UI |
| **Campaigns** | `add-campaign-dialog.tsx` | `campaigns-section.tsx` | `edit-campaign-dialog.tsx` | `DeleteConfirmationDialog` | Complete UI |
| **Agreements** | Upload + `/contracts/negotiation/*` | Active agreements tables | Status changes only | Not built | Complex flow |
| **Athlete Budgets (IOI)** | Implicit on athlete | Athlete detail page | `edit-ioi-dialog.tsx` | Not needed | Tied to athlete |

### CRUD Component Locations

**Athletes:**
- Create: `/src/app/athletes/components/add-athlete-dialog.tsx`
- Edit: `/src/app/athletes/components/edit-athlete-dialog.tsx`
- Delete: Built into `/src/app/athletes/[uuid]/page.tsx`

**Sponsors:**
- Create: `/src/app/sponsors/components/add-sponsor-dialog.tsx`
- Edit: `/src/app/sponsors/[id]/components/edit-sponsor-dialog.tsx`
- Delete: Built into `/src/app/sponsors/[id]/page.tsx`

**Campaigns:**
- Create: `/src/app/sponsors/[id]/components/add-campaign-dialog.tsx`
- Edit: `/src/app/sponsors/[id]/components/edit-campaign-dialog.tsx`
- Delete: Built into `/src/app/sponsors/[id]/page.tsx` (via campaign-detail-dialog)

**Shared:**
- `DeleteConfirmationDialog`: `/src/components/core/delete-confirmation-dialog.tsx`

---

## Key Files Reference

### Types
- `/src/types/schema.d.ts` - Auto-generated OpenAPI types (external API)
- `/src/types/api-types.ts` - TypeScript type aliases

### Mock Data (to be replaced)
- `/src/lib/mock-data.ts` - Contains:
  - `mockSponsors`, `mockCampaigns`, `mockSponsorshipAgreements`
  - `MOCK_ATHLETE_BUDGETS`
  - `KNOWN_UNIVERSITIES` (hardcoded list)
  - Calculator functions: `calculateAthleteBudgetTotals()`, `getAthleteBudget()`

### Key Components
- `/src/app/roster/` - Roster listing with budget summaries
- `/src/app/athletes/[uuid]/page.tsx` - Athlete detail page
- `/src/app/athletes/components/add-athlete-dialog.tsx` - Create athlete
- `/src/app/athletes/components/edit-athlete-dialog.tsx` - Edit athlete
- `/src/app/sponsors/` - Sponsor management
- `/src/app/agreements/` - Agreement listing

### API Integration
- `/src/lib/api.tsx` - Current external API client (to be replaced with Supabase client)

---

## UI Patterns Established

### Athlete Detail Page
- Header: Name, Sport, University badge (from `athlete.university`)
- Total Committed with hover tooltip showing breakdown
- Edit button in top-right corner
- Contact section: emails, phone
- NIL Sponsorship Target: progress bar, funded/gap status
- Agreements table: Revenue Share + Sponsorships

### Roster Page
- Summary cards: Total Athletes, Total Committed, Athletes with Gap, Fully Funded
- Data table: Athlete, Sport, Rev Share, IOI Target, Sponsors, Progress %, Total

### Form Patterns
- Phone: Single field with `(555) 123-4567` auto-formatting
- University: ComboboxInput with search + "Add new" capability
- Sport: Select dropdown

---

## Migration Plan

### Phase 1: Supabase Setup
1. Create Supabase project
2. Create tables: `athletes`, `agreements`, `sponsors`, `campaigns`, `athlete_budgets`
3. Set up RLS policies
4. Create seed data from existing mock data

### Phase 2: Athletes Migration
1. Create Supabase client
2. Replace `/v1/student_athletes/*` calls with Supabase queries
3. Add `university` field support
4. Update create/edit dialogs

### Phase 3: Agreements Migration
1. Replace `/v1/threads/*` calls with Supabase `agreements` queries
2. Rename all "Thread" references to "Agreement" in codebase
3. Add sponsorship-specific fields (`sponsor_uuid`, `campaign_uuid`, `applies_to_ioi`)

### Phase 4: Sponsors & Campaigns
1. Replace mock data with Supabase queries
2. Build CRUD for sponsors and campaigns
3. Link sponsorship agreements to sponsors/campaigns

### Phase 5: Budget System
1. Replace `MOCK_ATHLETE_BUDGETS` with Supabase `athlete_budgets`
2. Update IOI editing to persist to database
3. Verify all calculations work with real data

---

## Important Notes

1. **All monetary values are in cents** - Divide by 100 for display

2. **Sport values**: `'football'` | `'mens_basketball'` | `'womens_basketball'`

3. **Agreement types**: `'revenue_share'` | `'sponsorship'`

4. **Agreement statuses**: `'draft'` | `'active'` | `'completed'` | `'terminated'`

5. **IOI (Indication of Interest)**: The sponsorship target amount a university commits to help an athlete achieve. Sponsorships with `applies_to_ioi: true` count toward this target.

6. **No multi-tenancy**: Single workspace/university context for this prototype

---

## Decisions Made in Previous Chat Session

1. Removed Representation (agency/agent) section from UI - simplified athlete cards
2. Moved Total Committed to header area with tooltip breakdown
3. University is a direct field on athlete, not workspace-derived
4. Phone simplified to single field with US formatting
5. University uses ComboboxInput with search + add-new pattern
6. "Thread" terminology replaced with "Agreement" everywhere
7. Full Supabase migration (not hybrid with external API)
