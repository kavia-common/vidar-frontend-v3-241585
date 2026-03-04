<script lang="ts">
  import { page } from '$app/stores';
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
      },
    },
  });

  const navItems = [
    { href: '/',                 label: 'Estate Overview',   icon: 'LayoutGrid'  },
    { href: '/systems',          label: 'System Explorer',   icon: 'Server'      },
    { href: '/governance-trace', label: 'Governance Trace',  icon: 'ShieldAlert' },
    { href: '/amendments',       label: 'Amendment Console', icon: 'FilePen'     },
  ];

  function isActive(href: string): boolean {
    if (href === '/') return $page.url.pathname === '/';
    return $page.url.pathname.startsWith(href);
  }
</script>

<QueryClientProvider client={queryClient}>
  <div class="flex h-screen bg-[#09090e] text-slate-200 overflow-hidden">

    <!-- Sidebar -->
    <aside class="w-56 flex-shrink-0 flex flex-col border-r border-slate-800 bg-[#0d0d14]">

      <!-- Wordmark -->
      <div class="flex items-center gap-2 px-5 py-5 border-b border-slate-800">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round" class="text-indigo-400">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
        <span class="text-sm font-semibold tracking-widest uppercase text-slate-100">Vidar</span>
        <span class="ml-auto text-[10px] text-slate-500 font-mono">v3</span>
      </div>

      <!-- Nav -->
      <nav class="flex flex-col gap-1 px-2 pt-4">
        {#each navItems as item}
          <a
            href={item.href}
            class="flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors {
              isActive(item.href)
                ? 'bg-indigo-600/20 text-indigo-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }"
          >
            {item.label}
          </a>
        {/each}
      </nav>

      <div class="mt-auto px-5 pb-4 text-[10px] text-slate-600 font-mono">
        internal governance dashboard
      </div>
    </aside>

    <!-- Main -->
    <main class="flex-1 overflow-y-auto">
      <slot />
    </main>

  </div>
</QueryClientProvider>
