<script lang="ts">
  interface Props { message: string }
  const { message }: Props = $props();
</script>

<div class="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded px-3 py-2 my-2">
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <path d="M12 9v4"/><path d="M12 17h.01"/>
  </svg>
  {message}
</div>
