<script lang="ts">
  /** Reusable loading spinner/state for query pending states */
</script>

<div class="flex items-center gap-2 text-slate-500 text-sm py-4">
  <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
  </svg>
  <slot>Loading…</slot>
</div>
