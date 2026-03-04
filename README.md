# Vidar Governance Frontend v3

A complete rebuild of the Vidar Governance UI using Svelte 5, TypeScript, TanStack Query, and Zod.

---

## For Kavia

This repository is the foundation for the v3 frontend rebuild.

### How to use this repo

When creating a new Kavia project from this repository:

1. Select **Manual Configuration**
2. Upload these files in this order when prompted for existing documents:
   - `CONTEXT.md`
   - `AI_GUARDRAILS.md`
   - `frontend/API_CONTRACT.md`
   - `frontend/UI_REFERENCE.md`
   - `frontend/EXAMPLE_PATTERNS.md`
   - `frontend/src/lib/types/api.types.ts`
   - `frontend/src/lib/schemas/api.schemas.ts`
   - `frontend/src/lib/api/fetcher.ts`

3. The pre-built files in `src/` are already correct — do not regenerate them.

### What is already built (do not regenerate)

| File | Purpose |
|------|---------|
| `src/lib/api/fetcher.ts` | Typed fetch wrapper with auth, timeout, abort |
| `src/lib/types/api.types.ts` | All API TypeScript types |
| `src/lib/schemas/api.schemas.ts` | All Zod validation schemas |
| `src/lib/components/ui/SovereigntyBadge.svelte` | Badge component |
| `src/lib/components/ui/OutcomeBadge.svelte` | Badge component |
| `src/lib/components/ui/SeverityBadge.svelte` | Badge component |

### What Kavia should build

- `src/routes/+layout.svelte` — app shell with sidebar navigation
- `src/routes/+page.svelte` — Estate Overview screen
- `src/routes/systems/+page.svelte` — System Explorer screen
- `src/routes/governance-trace/+page.svelte` — Governance Trace screen
- `src/routes/amendments/+page.svelte` — Amendment Console screen
- `src/lib/api/endpoints/*.ts` — endpoint functions
- `src/lib/queries/*.query.ts` — TanStack Query hooks

See `frontend/UI_REFERENCE.md` for screen-by-screen specifications.
See `frontend/EXAMPLE_PATTERNS.md` for required code patterns.

---

## Architecture

Frontend = zero-trust deterministic rendering client.
Backend = authoritative governance engine.

The frontend renders backend state. It never computes governance outcomes.

See `AI_GUARDRAILS.md` for the full constraint set.

---

## Stack

| Concern | Tool |
|---------|------|
| Framework | Svelte 5 |
| Language | TypeScript (100%) |
| Build | Vite |
| Runtime Validation | Zod |
| Server State | TanStack Svelte Query |
| API Transport | `fetcher.ts` (native fetch) |
| Unit Tests | Vitest |
| E2E Tests | Playwright |
| Modules | ESM-only |

---

## Development

```bash
cd frontend
npm install
npm run dev
```
