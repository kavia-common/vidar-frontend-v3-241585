# Vidar Governance Frontend v3 — Example Implementation Patterns

Canonical implementation examples for this repository.

AI tools and developers must follow these patterns when generating new code.

If generated code conflicts with these examples, these examples take precedence.

---

## Stack Notes for AI

- Framework: **Svelte 5** — use runes (`$state`, `$derived`, `$effect`) where appropriate
- Server state: **TanStack Svelte Query v5** — the correct function is `createQuery` / `createMutation`, NOT `useQuery` / `useMutation` (those are the React API and will not work here)
- In Svelte templates, TanStack Query results are reactive stores — access them with the `$` prefix: `$query.data`, `$query.isPending`, `$query.isError`
- All imports use SvelteKit path aliases: `$lib/...`

---

## 1. Basic Query Pattern

Location: `src/lib/queries/systems.query.ts`

```ts
import { createQueryFn } from "$lib/api/fetcher";
import { PaginatedSystemsSchema } from "$lib/schemas/api.schemas";

// Bind URL and schema once. Use in createQuery({ queryFn: ... }).
export const systemsQueryFn = createQueryFn(
  "/api/internal/systems",
  PaginatedSystemsSchema
);
```

---

## 2. Filtered Query Pattern (with query parameters)

Use `ListXxxParams` types from `api.types.ts` to build URLs.
Use `URLSearchParams` — do not concatenate strings manually.

Location: `src/lib/queries/systems.query.ts`

```ts
import { createQueryFn } from "$lib/api/fetcher";
import { PaginatedSystemsSchema } from "$lib/schemas/api.schemas";
import type { ListSystemsParams } from "$lib/types/api.types";

export function filteredSystemsQueryFn(params: ListSystemsParams = {}) {
  const qs = new URLSearchParams();

  if (params.page !== undefined)              qs.set("page", String(params.page));
  if (params.page_size !== undefined)         qs.set("page_size", String(params.page_size));
  if (params.layer_id !== undefined)          qs.set("layer_id", String(params.layer_id));
  if (params.sovereignty_level !== undefined) qs.set("sovereignty_level", params.sovereignty_level);
  if (params.is_active !== undefined)         qs.set("is_active", String(params.is_active));

  const url = `/api/internal/systems?${qs.toString()}`;
  return createQueryFn(url, PaginatedSystemsSchema);
}
```

---

## 3. Svelte Component — Query Usage

Use `createQuery` (not `useQuery`).
Access result via `$queryResult` store syntax in the template.

```svelte
<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";
  import { systemsQueryFn } from "$lib/queries/systems.query";

  const systemsResult = createQuery({
    queryKey: ["systems"],
    queryFn: systemsQueryFn,
  });
</script>

{#if $systemsResult.isPending}
  <p>Loading systems...</p>
{:else if $systemsResult.isError}
  <p>Error loading systems.</p>
{:else}
  <ul>
    {#each $systemsResult.data.items as system (system.system_id)}
      <li>{system.system_name}</li>
    {/each}
  </ul>
{/if}
```

---

## 4. Mutation Pattern

Use `createMutationFn` to bind the URL, method, and schema once.
Use `createMutation` from TanStack Svelte Query.
Always invalidate the relevant query cache in `onSuccess` — never use `onMutate` optimistic updates.

Location: `src/lib/queries/amendments.query.ts`

```ts
import { createMutationFn } from "$lib/api/fetcher";
import { SingleAmendmentSchema } from "$lib/schemas/api.schemas";
import type { CreateAmendmentRequest, ApiAmendment } from "$lib/types/api.types";

export const createAmendmentMutationFn =
  createMutationFn<CreateAmendmentRequest, ApiAmendment>(
    "/api/internal/amendments",
    "POST",
    SingleAmendmentSchema
  );
```

Usage in a Svelte component:

```svelte
<script lang="ts">
  import { createMutation, useQueryClient } from "@tanstack/svelte-query";
  import { createAmendmentMutationFn } from "$lib/queries/amendments.query";

  const queryClient = useQueryClient();

  const amendmentMutation = createMutation({
    mutationFn: createAmendmentMutationFn,
    onSuccess: () => {
      // Invalidate so the UI re-fetches confirmed backend state
      queryClient.invalidateQueries({ queryKey: ["amendments"] });
    },
  });

  function handleSubmit() {
    $amendmentMutation.mutate({
      target_system_id: "sys-001",
      description: "Upgrade sovereignty level after audit",
    });
  }
</script>

<button onclick={handleSubmit} disabled={$amendmentMutation.isPending}>
  {$amendmentMutation.isPending ? "Submitting..." : "Submit Amendment"}
</button>
```

---

## 5. PATCH Mutation Pattern

For status updates (APPROVE / REJECT), the URL includes a path parameter.
Build the URL at call time and pass it to `mutateJSON` directly.

```ts
import { mutateJSON } from "$lib/api/fetcher";
import { SingleAmendmentSchema } from "$lib/schemas/api.schemas";
import type { UpdateAmendmentStatusRequest } from "$lib/types/api.types";

export function updateAmendmentStatus(
  amendmentId: string,
  payload: UpdateAmendmentStatusRequest
) {
  return mutateJSON(
    `/api/internal/amendments/${amendmentId}`,
    "PATCH",
    payload,
    SingleAmendmentSchema
  );
}
```

In `createMutation`:

```ts
const updateMutation = createMutation({
  mutationFn: ({ id, payload }: { id: string; payload: UpdateAmendmentStatusRequest }) =>
    updateAmendmentStatus(id, payload),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["amendments"] });
  },
});
```

---

## 6. Type + Schema Pairing Rule

Every API structure must exist in both `api.types.ts` and `api.schemas.ts`.
Update both files together — they must never drift from each other.

`api.types.ts`:
```ts
export interface ApiSystem {
  system_id: string;
  system_name: string;
  layer_id: number;
  sovereignty_level: SovereigntyLevel;
  zero_cloud_required: boolean;
  is_active: boolean;
}
```

`api.schemas.ts` (matching Zod schema):
```ts
export const ApiSystemSchema = z.object({
  system_id: z.string(),
  system_name: z.string(),
  layer_id: z.number(),
  sovereignty_level: SovereigntyLevelSchema,
  zero_cloud_required: z.boolean(),
  is_active: z.boolean(),
});
```

---

## 7. Forbidden Patterns

Never do any of these.

```ts
// ❌ Direct fetch in a component or query file
const res = await fetch("/api/internal/systems");

// ❌ Skipping schema validation
const data = await res.json(); // unvalidated

// ❌ Optimistic update on a governance mutation
onMutate: async (payload) => {
  queryClient.setQueryData(["amendments"], (old) => applyLocalUpdate(old, payload));
}

// ❌ useQuery — this is the React API, not Svelte
import { useQuery } from "@tanstack/svelte-query";

// ❌ Computing governance outcomes in the frontend
const isViolation = system.critical_count > 0 && system.layer_id < 3; // never
```

All governance logic belongs exclusively to the backend.
