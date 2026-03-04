# Vidar Governance Frontend v3 — Project Context

Single canonical context file for AI assistants working in this repository.

Replaces: Context_vA1.rtf, Context_vH.rtf

---

## AI Instruction

When generating code for this repository:

1. Read `CONTEXT.md` first (this file).
2. Follow `AI_GUARDRAILS.md` strictly.
3. Use `API_CONTRACT.md` for all request and response structures.
4. Use `api.types.ts` and `api.schemas.ts` when generating any API code.

Do not invent API shapes or governance logic.

---

## What This Project Is

A complete ground-up rebuild of the Vidar Governance UI (v3).

The previous frontend (v2.2) used React, Jest, Axios, and mixed JS/TS. It has been frozen and cloned locally as a reference only. Nothing from v2.2 is being carried forward — the new frontend is built from scratch.

---

## Core Architectural Invariant

```
Frontend  = zero-trust deterministic rendering client
Backend   = authoritative governance engine
```

All governance logic executes exclusively on the backend.

The frontend renders backend state. It never computes governance outcomes.

---

## Absolute Constraints (Non-Negotiable)

The frontend must **never**:

- execute governance rules
- compute violations or scores
- recompute snapshot hashes
- enforce amendment gates
- derive authorization decisions
- validate structural governance constraints
- simulate backend state transitions
- persist authoritative governance state
- access the database directly
- store production API keys

See `AI_GUARDRAILS.md` for the full rule set including code patterns.

---

## Frontend Responsibilities

The frontend may only:

- fetch governance data from the API
- validate API responses using Zod
- manage server state with TanStack Query
- render deterministic UI
- submit mutation requests to the backend
- display backend-provided evaluation results and audit integrity results
- render role-aware UI based on backend-issued JWT claims

Client-side caching is **non-authoritative**. The backend is the **source of truth**.

---

## Technology Stack

| Concern            | Tool                         |
|--------------------|------------------------------|
| Framework          | Svelte 5                     |
| Language           | TypeScript (100%)            |
| Build              | Vite                         |
| Runtime Validation | Zod                          |
| Server State       | TanStack Svelte Query        |
| API Transport      | `fetcher.ts` (native fetch)  |
| Unit Tests         | Vitest                       |
| E2E Tests          | Playwright                   |
| Modules            | ESM-only                     |
| Auth               | OIDC / OAuth2 → Bearer JWT   |

---

## System Components

### Web Frontend (this repo)
Browser SPA. Renders governance state, evaluation outcomes, violation summaries, amendment workflows, audit chain integrity. No governance logic.

### Governance API (backend — not this repo)
Executes governance rules, computes violations and scores, enforces amendment lifecycle, persists evaluation results, maintains audit chains, computes snapshot hashes. The only component allowed to execute governance logic.

### Data Store
SQL database. Accessible only by the Governance API.

### Identity Provider
OIDC / OAuth2. Issues JWTs consumed by the frontend and validated by the backend.

---

## Communication Model

```
Frontend → Governance API     HTTPS / JSON, Bearer JWT, Zod-validated
Frontend → Identity Provider  OIDC login flow
API      → Data Store         SQL
API      → Identity Provider  JWT validation
API      → Telemetry Stack    metrics / logs / traces
```

---

## Development Environment

Work is performed inside a Kavia AI workspace.

The v3 frontend lives in a new container/project, separate from the frozen v2.2 reference.

---

## Rebuild Objectives

- Replace Jest → Vitest
- Full TypeScript migration (100%)
- Full Svelte 5 migration
- Replace Axios → typed native Fetch wrapper (`fetcher.ts`)
- Add Zod runtime validation on all API responses
- Adopt TanStack Svelte Query for all server state
- Add Playwright E2E tests
- Enable component-level performance tracing
- ESM-only module system

---

## Instructions to AI

- Maintain strict separation between UI and governance logic.
- Treat the backend as the authoritative system at all times.
- Never introduce rule evaluation, scoring, or hash computation into the frontend.
- Follow Svelte 5 patterns — use runes (`$state`, `$derived`, `$effect`) not legacy stores where possible.
- Prioritise deterministic UI rendering over client-side inference.
- When uncertain whether logic belongs in the frontend, it belongs in the backend.
