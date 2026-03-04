<script lang="ts">
  import type { EvaluationOutcome } from "$lib/types/api.types";

  interface Props {
    outcome: EvaluationOutcome | null | undefined;
  }

  const { outcome }: Props = $props();

  const COLOURS: Record<EvaluationOutcome, string> = {
    ALLOW: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    FLAG:  "bg-amber-500/15 text-amber-300 border-amber-500/30",
    DENY:  "bg-red-500/15 text-red-300 border-red-500/30",
  };

  const cls = $derived(
    outcome ? (COLOURS[outcome] ?? "bg-slate-700 text-slate-300 border-slate-600")
            : "bg-slate-700 text-slate-300 border-slate-600"
  );
</script>

<span class="inline-flex px-2 py-0.5 rounded border text-[10px] font-mono font-semibold {cls}">
  {outcome ?? "—"}
</span>
