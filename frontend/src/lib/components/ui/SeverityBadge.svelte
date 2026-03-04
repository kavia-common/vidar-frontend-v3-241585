<script lang="ts">
  import type { RuleSeverity } from "$lib/types/api.types";

  interface Props {
    severity: RuleSeverity | null | undefined;
  }

  const { severity }: Props = $props();

  const COLOURS: Record<RuleSeverity, string> = {
    CRITICAL:      "bg-red-500/15 text-red-300 border-red-500/30",
    WARNING:       "bg-amber-500/15 text-amber-300 border-amber-500/30",
    INFORMATIONAL: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  };

  const cls = $derived(
    severity ? (COLOURS[severity] ?? "bg-slate-700 text-slate-300 border-slate-600")
             : "bg-slate-700 text-slate-300 border-slate-600"
  );
</script>

<span class="inline-flex px-2 py-0.5 rounded border text-[10px] font-mono font-semibold {cls}">
  {severity ?? "—"}
</span>
