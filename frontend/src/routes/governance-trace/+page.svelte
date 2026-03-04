<script lang="ts">
  /**
   * Governance Trace — /governance-trace
   *
   * BUILD INSTRUCTIONS FOR KAVIA:
   * See frontend/UI_REFERENCE.md → "Screen 3 — Governance Trace"
   *
   * API: GET /api/internal/evaluations
   * Type: PaginatedResponse<ApiEvaluationEvent> (from $lib/types/api.types)
   * Schema: PaginatedEvaluationsSchema (from $lib/schemas/api.schemas)
   * Query: use ListEvaluationsParams for filter params
   *
   * Layout: full-width list of evaluation events, read-only.
   * Components to use: OutcomeBadge, SeverityBadge (from $lib/components/ui)
   * Note: target_system_name is included on each event for display.
   * No governance logic. Display backend data only.
   */
</script>

<div class="p-6 max-w-6xl">
  <p class="text-slate-500 text-sm font-mono">Governance Trace — to be implemented</p>
</div>
