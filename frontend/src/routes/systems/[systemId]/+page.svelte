<script lang="ts">
  /**
   * System Detail — /systems/[systemId]
   *
   * BUILD INSTRUCTIONS FOR KAVIA:
   * See frontend/UI_REFERENCE.md → "Screen 2 — System Explorer" (detail panel section)
   *
   * API: GET /api/internal/systems/:system_id
   * Type: SingleResponse<ApiSystem> (from $lib/types/api.types)
   * Schema: SingleSystemSchema (from $lib/schemas/api.schemas)
   *
   * Can also be rendered as a panel within /systems rather than a separate route.
   * Discuss with the team which approach fits the layout better.
   */

  import { page } from '$app/stores';
  const systemId = $page.params.systemId;
</script>

<div class="p-6">
  <p class="text-slate-500 text-sm font-mono">System detail {systemId} — to be implemented</p>
</div>
