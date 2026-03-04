# Vidar Governance Frontend v3 — AI Guardrails

This file is the single authoritative rule set for any AI, automation tool, or developer generating code in this repository.

Violation of these constraints introduces architectural drift and is not permitted.

---

## Core Principle

Vidar is a **backend-authoritative governance system**.

The frontend is a **zero-trust deterministic rendering client**.

All governance logic executes exclusively in the backend.

The frontend **never computes governance outcomes**.

---

## Hard Prohibitions

The frontend must never:

- execute governance rules
- compute violations
- compute scoring
- recompute snapshot hashes
- enforce amendment gates
- validate structural governance constraints
- derive authorization decisions
- simulate backend state transitions
- persist authoritative governance state
- access the database directly
- store production API keys
- call `fetch()` directly from components or query files
- apply optimistic updates to governance mutations (see below)

---

## Allowed Responsibilities

The frontend may:

- fetch governance data from the API via `fetcher.ts`
- validate API responses with Zod schemas before use
- manage server state using TanStack Query
- render deterministic UI
- submit mutation requests to backend endpoints via `mutateJSON()`
- display backend-computed evaluation results
- display backend-verified audit integrity results
- render role-aware UI based on backend authorization claims

Client-side caching is **non-authoritative**. The backend is the **source of truth**.

---

## Mandatory Data Flow

Every API interaction must follow this path — no shortcuts.

```
Backend API
  → fetcher.ts (fetchJSON / mutateJSON)
  → Zod schema validation
  → TanStack Query (createQuery / createMutation)
  → Svelte component
```

UI components must **never** call `fetch()` directly.

---

## No Optimistic Updates on Governance Mutations

Optimistic updates (updating the local TanStack Query cache before the backend confirms a result) are **prohibited for all governance mutations**.

Amendment status transitions, evaluation triggers, and all other governance mutations go through backend lifecycle gates. The outcome cannot be assumed in advance.

**Correct pattern — wait for confirmed backend response, then refresh:**
```typescript
createMutation({
  mutationFn: (req) => mutateJSON(url, "PATCH", req, SingleAmendmentSchema),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["amendments"] });
  },
});
```

**Prohibited pattern — do not assume the outcome:**
```typescript
onMutate: async (req) => {
  // ❌ Never do this for governance mutations
  queryClient.setQueryData(["amendments"], (old) => applyLocalUpdate(old, req));
}
```

If a UI loading state is needed during a mutation, use `isPending` from the mutation result — do not modify the cache.

---

## Required Patterns When Adding a New Endpoint

1. Add the TypeScript type to `api.types.ts`
2. Add the matching Zod schema to `api.schemas.ts`
3. Add the endpoint function to `src/lib/api/endpoints/<domain>.ts`
4. Add the TanStack Query hook to `src/lib/queries/<domain>.query.ts`
5. Consume from the Svelte component via the query hook only

---

## Frontend Stack

| Concern            | Tool                        |
|--------------------|-----------------------------|
| Framework          | Svelte 5                    |
| Language           | TypeScript (100%)           |
| Build              | Vite                        |
| Runtime Validation | Zod                         |
| Server State       | TanStack Svelte Query       |
| API Transport      | `fetcher.ts` (native fetch) |
| Unit Tests         | Vitest                      |
| E2E Tests          | Playwright                  |
| Modules            | ESM-only                    |

---

## Architecture Invariants

The frontend must remain:

- governance-logic free
- deterministic
- API-driven
- stateless with respect to governance decisions

The governance engine must remain **UI-independent**.

---

## Decision Rule

If a feature requires governance computation, it belongs in the **Governance API**, not the frontend. When in doubt, the backend decides.

If a design decision conflicts with these rules, **these rules take precedence**.
