<script lang="ts">
  /**
   * Amendment Console — /amendments
   *
   * BUILD INSTRUCTIONS FOR KAVIA:
   * See frontend/UI_REFERENCE.md → "Screen 4 — Amendment Console"
   *
   * ⚠️  BEFORE BUILDING: confirm amendment lifecycle states with backend team.
   * See the ⚠️ note in frontend/API_CONTRACT.md → "Open Decision — Amendment States"
   * Update AmendmentStatus in api.types.ts and api.schemas.ts once confirmed.
   *
   * API (list):   GET /api/internal/amendments
   * API (detail): GET /api/internal/amendments/:amendment_id
   * API (create): POST /api/internal/amendments
   * API (update): PATCH /api/internal/amendments/:amendment_id
   * Types: ApiAmendment, CreateAmendmentRequest, UpdateAmendmentStatusRequest
   * Schemas: PaginatedAmendmentsSchema, SingleAmendmentSchema
   *
   * Layout: two-panel split — amendment list w-80 (left) + detail (right)
   * Mutations: use createMutationFn from $lib/api/fetcher
   * After mutation: invalidateQueries({ queryKey: ['amendments'] }) — no optimistic updates
   * No governance logic. Display backend data only.
   */
</script>

<div class="flex h-full">
  <p class="text-slate-500 text-sm font-mono p-6">Amendment Console — to be implemented</p>
</div>
