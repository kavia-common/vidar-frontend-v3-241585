<script lang="ts">
  import type { SovereigntyLevel } from "$lib/types/api.types";

  interface Props {
    level: SovereigntyLevel | null | undefined;
  }

  const { level }: Props = $props();

  const COLOURS: Record<SovereigntyLevel, string> = {
    SOVEREIGN:   "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    APPROVED:    "bg-blue-500/15 text-blue-300 border-blue-500/30",
    CONDITIONAL: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    RESTRICTED:  "bg-orange-500/15 text-orange-300 border-orange-500/30",
    PROHIBITED:  "bg-red-500/15 text-red-300 border-red-500/30",
  };

  const cls = $derived(
    level ? (COLOURS[level] ?? "bg-slate-500/15 text-slate-300 border-slate-500/30")
           : "bg-slate-500/15 text-slate-300 border-slate-500/30"
  );
</script>

<span class="inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-mono font-semibold tracking-wide {cls}">
  {level ?? "—"}
</span>
