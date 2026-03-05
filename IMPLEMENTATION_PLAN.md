# Vidar Governance Frontend v3 — Implementation Plan

**Last Updated:** 2026-03-05

This document tracks the implementation status of the Vidar Governance Frontend v3 rebuild based on the analysis in `ZIP_ANALYSIS.md` and the current repository state.

---

## Implementation Status Summary

| Category | Total Items | Completed | Remaining |
|----------|-------------|-----------|-----------|
| **Infrastructure** | 9 | 6 | 3 |
| **Core Components** | 4 | 3 | 1 |
| **Query Hooks** | 5 | 4 | 1 |
| **Route Pages** | 5 | 0 | 5 |
| **Configuration** | 3 | 0 | 3 |

**Overall Progress:** 13/26 items completed (50%)

---

## Phase 1: Core Infrastructure ✅ PARTIAL

### Build & Testing Setup ✅
- [x] Vite configuration (`vite.config.ts`)
- [x] Vitest configuration (`vitest.config.ts`)
- [x] Playwright configuration (`playwright.config.ts`)
- [x] TypeScript configuration (`tsconfig.json`)
- [x] SvelteKit configuration (`svelte.config.js`)
- [x] Package.json with base dependencies

### Styling Infrastructure ❌
- [ ] Tailwind CSS configuration (`tailwind.config.js`)
- [ ] PostCSS configuration (`postcss.config.js`)
- [ ] Global styles with Tailwind directives (`src/app.css`)
- [ ] Tailwind CSS dependencies in package.json
  - Required: `tailwindcss ^3.4.0`
  - Required: `postcss ^8.4.0`
  - Required: `autoprefixer ^10.4.0`

**Status:** Build tooling complete. Styling infrastructure missing (critical blocker for UI implementation).

---

## Phase 2: API Layer & Type Safety ✅ COMPLETE

### Type Definitions ✅
- [x] TypeScript type definitions (`src/lib/types/api.types.ts`)
  - All domain types: ApiSystem, ApiEvaluationEvent, ApiAmendment, ApiRuleMetadata, ApiEstateHealth
  - All enum types: SovereigntyLevel, EvaluationOutcome, AmendmentStatus, RuleSeverity, RuleScope
  - Request/response envelopes: PaginatedResponse, SingleResponse, ApiErrorEnvelope
  - Query parameter types: ListSystemsParams, ListEvaluationsParams, ListAmendmentsParams, ListRulesParams
  - Mutation request types: CreateAmendmentRequest, UpdateAmendmentStatusRequest, TriggerEvaluationRequest

### Zod Schemas ✅
- [x] Zod validation schemas (`src/lib/schemas/api.schemas.ts`)
  - All enum schemas matching TypeScript types
  - All domain schemas with runtime validation
  - Pre-composed paginated schemas for all endpoints
  - Single response schemas for detail endpoints
  - Estate health schema

### API Transport Layer ✅
- [x] Typed fetch wrapper (`src/lib/api/fetcher.ts`)
  - fetchJSON with Zod validation
  - mutateJSON for POST/PATCH/DELETE
  - createQueryFn helper for TanStack Query
  - createMutationFn helper for TanStack Query
  - Auth token management (setAuthToken/clearAuthToken)
  - Request timeout and abort signal support
  - ApiError class for error handling

### API Endpoints ✅
- [x] Systems endpoints (`src/lib/api/endpoints/systems.ts`)
  - getSystems with filtering
  - getSystem by ID
- [x] Evaluations endpoints (`src/lib/api/endpoints/evaluations.ts`)
  - getEvaluations with filtering
  - triggerEvaluation
- [x] Amendments endpoints (`src/lib/api/endpoints/amendments.ts`)
  - getAmendments with filtering
  - createAmendment
  - updateAmendmentStatus
- [x] Rules endpoints (`src/lib/api/endpoints/rules.ts`)
  - getRules with filtering
- [x] Estate health endpoint (`src/lib/api/endpoints/estate.ts`)
  - getEstateHealth

**Status:** API layer 100% complete. All endpoints implemented with proper typing and validation.

---

## Phase 3: Query Hooks (TanStack Query) ✅ PARTIAL

### Implemented Query Hooks ✅
- [x] Systems query (`src/lib/queries/systems.query.ts`)
  - systemsQuery with filtering
  - systemQuery for single system
- [x] Evaluations query (`src/lib/queries/evaluations.query.ts`)
  - evaluationsQuery with filtering
- [x] Amendments query (`src/lib/queries/amendments.query.ts`)
  - amendmentsQuery with filtering
  - createAmendmentMutationFn
- [x] Estate health query (`src/lib/queries/estate.query.ts`)
  - estateHealthQuery

### Missing Query Hooks ❌
- [ ] Rules query (`src/lib/queries/rules.query.ts`)
  - rulesQuery with filtering (severity, scope, domain)

**Status:** 4/5 query hooks implemented (80%). Rules query missing.

---

## Phase 4: UI Components ✅ PARTIAL

### Common Components ✅
- [x] EmptyState (`src/lib/components/common/EmptyState.svelte`)
- [x] ErrorState (`src/lib/components/common/ErrorState.svelte`)
- [x] Loading (`src/lib/components/common/Loading.svelte`)

### Badge Components ✅ PARTIAL
- [x] SovereigntyBadge (`src/lib/components/ui/SovereigntyBadge.svelte`)
- [x] OutcomeBadge (`src/lib/components/ui/OutcomeBadge.svelte`)
- [x] SeverityBadge (`src/lib/components/ui/SeverityBadge.svelte`)
- [ ] AmendmentStatusBadge (`src/lib/components/ui/AmendmentStatusBadge.svelte`)
  - Color coding: PENDING (indigo), APPROVED (emerald), REJECTED (red), APPLIED (teal)
  - Required for Amendment Console implementation

**Status:** 6/7 components implemented (85%). AmendmentStatusBadge missing.

---

## Phase 5: Application Shell & Routing ✅ PARTIAL

### Layout Structure ✅ PARTIAL
- [x] Root layout (`src/routes/+layout.svelte`)
  - Basic sidebar navigation structure
  - QueryClientProvider setup
  - Navigation items defined
  - Note: May need enhancement when full implementations are added
- [x] Layout config (`src/routes/+layout.ts`)
  - SSR disabled (client-side SPA)

### Route Pages (All Placeholder) ❌
- [ ] Estate Overview (`src/routes/+page.svelte`)
  - **Current:** Placeholder stub with build instructions
  - **Required:** Three metric card sections (Systems, Last 30 Days, Advisory)
  - **API:** GET /api/internal/governance/estate-health
  - **Components:** MetricCard (to be created), Refresh button
  - **Data:** Display-only percentage calculations (no governance logic)

- [ ] System Explorer (`src/routes/systems/+page.svelte`)
  - **Current:** Placeholder stub with build instructions
  - **Required:** Two-panel layout (list w-72 + detail)
  - **API:** GET /api/internal/systems, GET /api/internal/systems/:id, GET /api/internal/evaluations
  - **Components:** SovereigntyBadge, OutcomeBadge, system list, evaluation history table
  - **Features:** Search/filter, system selection, evaluation history display

- [ ] System Detail (`src/routes/systems/[systemId]/+page.svelte`)
  - **Current:** Placeholder stub with build instructions
  - **Required:** System detail view with evaluation history
  - **API:** GET /api/internal/systems/:system_id
  - **Note:** Can be integrated into systems/+page.svelte instead of separate route

- [ ] Governance Trace (`src/routes/governance-trace/+page.svelte`)
  - **Current:** Placeholder stub with build instructions
  - **Required:** Full-width event list with filtering
  - **API:** GET /api/internal/evaluations
  - **Components:** OutcomeBadge, SeverityBadge, event list items
  - **Features:** Date/time filtering, outcome filtering, pagination

- [ ] Amendment Console (`src/routes/amendments/+page.svelte`)
  - **Current:** Placeholder stub with build instructions
  - **Required:** Two-panel layout (list w-80 + detail)
  - **API:** GET/POST/PATCH /api/internal/amendments
  - **Components:** AmendmentStatusBadge (to be created), status filter tabs, lifecycle action buttons
  - **Features:** Status filtering, amendment detail view, approve/reject actions with confirmation
  - **Important:** Mutations must use invalidateQueries (no optimistic updates)

**Status:** 0/5 route pages implemented (0%). All are placeholder stubs.

---

## Phase 6: Utilities & Stores ✅

- [x] Constants (`src/lib/utils/constants.ts`)
- [x] Format utilities (`src/lib/utils/format.ts`)
- [x] Auth store (`src/lib/stores/auth.store.ts`)

**Status:** 100% complete.

---

## Critical Path to Production

### Immediate Blockers (P0)
1. **Tailwind CSS Setup** — Required for any UI to render correctly
   - Install dependencies: tailwindcss, postcss, autoprefixer
   - Add tailwind.config.js, postcss.config.js
   - Create app.css with Tailwind directives
   - Import app.css in root layout

### High Priority (P1)
2. **AmendmentStatusBadge Component** — Required for Amendment Console
3. **Rules Query Hook** — Completes API integration layer

### Implementation Priority (P2)
4. **Estate Overview Page** — Dashboard entry point
5. **System Explorer Page** — Core functionality
6. **Governance Trace Page** — Event history
7. **Amendment Console Page** — Workflow management

---

## Architecture Compliance Checklist

All implementations must adhere to these constraints (from `AI_GUARDRAILS.md`):

- [x] No governance logic execution in frontend
- [x] All data fetched via fetcher.ts (no direct fetch calls)
- [x] All responses validated with Zod schemas
- [x] TanStack Query used for server state management
- [x] No optimistic updates on governance mutations
- [x] Backend is authoritative source of truth
- [x] No direct database access
- [x] No production API keys stored in frontend
- [x] Bearer JWT token managed via auth store
- [x] 100% TypeScript (no JavaScript files)

**Status:** All architectural constraints followed in existing code. Must maintain in future implementations.

---

## Testing Status

### Unit Tests ❌
- [ ] No unit tests written yet
- [ ] Vitest configured but no test files exist

### E2E Tests ❌
- [ ] No E2E tests written yet
- [ ] Playwright configured but no test files exist

**Status:** Testing infrastructure ready, but no tests implemented.

---

## Documentation Status

### Required Documentation ✅
- [x] AI_GUARDRAILS.md — Frontend constraint set
- [x] CONTEXT.md — Project context for AI assistants
- [x] README.md — Repository overview
- [x] API_CONTRACT.md — Canonical API specification
- [x] UI_REFERENCE.md — Screen-by-screen UI specifications
- [x] EXAMPLE_PATTERNS.md — Code pattern examples
- [x] ZIP_ANALYSIS.md — Integration analysis and recommendations

### Reference Documentation ✅
- [x] RELEASE_v3.1.md — Release notes for v3.1 tag
- [x] This implementation plan

**Status:** Documentation 100% complete.

---

## Next Steps

1. **Install Tailwind CSS dependencies**
   ```bash
   cd frontend
   npm install -D tailwindcss@^3.4.0 postcss@^8.4.0 autoprefixer@^10.4.0
   ```

2. **Add Tailwind configuration files**
   - Create `tailwind.config.js`
   - Create `postcss.config.js`
   - Create `src/app.css` with Tailwind directives

3. **Import app.css in root layout**
   - Update `src/routes/+layout.svelte` to import app.css

4. **Create missing components**
   - AmendmentStatusBadge.svelte

5. **Create missing query hook**
   - rules.query.ts

6. **Implement route pages** (in order)
   - Estate Overview (dashboard entry point)
   - System Explorer (core functionality)
   - Governance Trace (event history)
   - Amendment Console (workflow management)

7. **Add tests**
   - Unit tests for utilities and helpers
   - E2E tests for critical user flows

---

## Notes

- All route pages have detailed build instructions in their placeholder files
- Refer to `UI_REFERENCE.md` for exact layout specifications
- Refer to `EXAMPLE_PATTERNS.md` for code patterns
- Refer to `API_CONTRACT.md` for endpoint specifications
- Amendment lifecycle states need backend confirmation before full implementation
- All implementations must maintain strict separation between UI and governance logic

---

**Document Purpose:** Track implementation progress and provide clear roadmap for completing the v3 rebuild.

**Update Frequency:** Update this document whenever implementation status changes.
