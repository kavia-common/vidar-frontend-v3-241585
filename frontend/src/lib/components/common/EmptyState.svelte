<script lang="ts">
  interface Props { message?: string; subtext?: string }
  const { message = 'No data available.', subtext }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center py-12 text-center px-8">
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    class="text-slate-700 mb-3">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
  <p class="text-sm text-slate-500">{message}</p>
  {#if subtext}
    <p class="text-xs text-slate-700 mt-1">{subtext}</p>
  {/if}
</div>
