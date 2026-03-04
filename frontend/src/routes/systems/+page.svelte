<script lang="ts">
  /**
   * System Explorer — /systems
   *
   * BUILD INSTRUCTIONS FOR KAVIA:
   * See frontend/UI_REFERENCE.md → "Screen 2 — System Explorer"
   *
   * API (list):   GET /api/internal/systems
   * API (detail): GET /api/internal/systems/:system_id
   * API (evals):  GET /api/internal/evaluations?target_system_id={id}
   * Types: ApiSystem, ApiEvaluationEvent (from $lib/types/api.types)
   * Schemas: PaginatedSystemsSchema, PaginatedEvaluationsSchema (from $lib/schemas/api.schemas)
   *
   * Layout: two-panel split — system list (left w-72) + system detail (right)
   * Components to use: SovereigntyBadge, OutcomeBadge (from $lib/components/ui)
   * No governance logic. Display backend data only.
   */
</script>

<div class="p-6">
  <p class="text-slate-500 text-sm font-mono">System Explorer — to be implemented</p>
</div>
