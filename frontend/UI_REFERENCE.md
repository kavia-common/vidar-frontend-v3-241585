# Vidar Governance Frontend v3 — UI Reference

This document describes all screens, their layouts, data fields, color conventions,
and API endpoints. It is derived from the v2.2 frontend and serves as the authoritative
visual and structural reference for v3.

AI tools and developers must use this document when generating route pages and components.
Do not invent screens, fields, or layout patterns not documented here.

---

## Application Shell

### Layout

- Dark background: `bg-[#09090e]`
- Fixed left sidebar: `w-56`, `border-r border-slate-800`, `bg-[#0d0d14]`
- Main content area: `flex-1 overflow-y-auto`
- Full viewport height: `h-screen overflow-hidden`

### Sidebar

**Wordmark:**
- Icon: `ShieldCheck` (lucide), `text-indigo-400`
- Text: "Vidar", `text-sm font-semibold tracking-widest uppercase`
- Version label: "v1.0", `text-[10px] text-slate-500 font-mono`, right-aligned

**Navigation items (in order):**

| Label              | Route               | Icon        |
|--------------------|---------------------|-------------|
| Estate Overview    | `/`                 | LayoutGrid  |
| System Explorer    | `/systems`          | Server      |
| Governance Trace   | `/governance-trace` | ShieldAlert |
| Amendment Console  | `/amendments`       | FilePen     |

Active nav item: `bg-indigo-600/20 text-indigo-300`
Inactive nav item: `text-slate-400 hover:text-slate-200 hover:bg-slate-800/60`

**Footer:** "internal governance dashboard", `text-[10px] text-slate-600 font-mono`

---

## Screen 1 — Estate Overview

**Route:** `/`
**API endpoint:** `GET /api/internal/governance/estate-health`
**Type:** `ApiEstateHealth` (single response, not paginated)

### Purpose
Dashboard of estate-wide governance health metrics. No user interaction beyond a Refresh button.

### Layout
Three metric card sections stacked vertically, each with a section label and a responsive grid of `MetricCard` components.

**MetricCard structure:**
- Small uppercase label: `text-[11px] text-slate-500 uppercase tracking-widest font-mono`
- Large number value: `text-3xl font-bold tabular-nums`
- Optional subtitle: `text-[11px] text-slate-600`
- Card background: `bg-[#111118] border border-slate-800 rounded-lg p-4`

### Sections and fields

**Section: Systems**
| Card label      | Field                  | Accent  |
|-----------------|------------------------|---------|
| Total Systems   | `total_systems`        | slate   |
| Active          | `active_systems`       | emerald |
| Inactive        | `inactive_systems`     | amber   |

Active card subtitle: `{pct}% of total` (computed from active/total — display only, no governance logic)

**Section: Last 30 Days**
| Card label          | Field                                    | Accent  |
|---------------------|------------------------------------------|---------|
| Evaluations         | `total_evaluations_last_30_days`         | slate   |
| Systems w/ DENY     | `systems_with_deny_last_30_days`         | red     |
| Systems w/ FLAG     | `systems_with_flag_last_30_days`         | amber   |
| Critical Violations | `total_critical_violations_last_30_days` | red     |
| Warning Violations  | `total_warning_violations_last_30_days`  | amber   |

**Section: Advisory (All Time)**
| Card label             | Field                                        | Accent                     |
|------------------------|----------------------------------------------|----------------------------|
| Product Advisory       | `systems_with_product_advisory_violations`   | amber if > 0, else emerald |
| Sovereignty Advisory   | `systems_with_sovereignty_advisory_violations` | amber if > 0, else emerald |

Product Advisory subtitle: "systems w/ PROD-001/002"
Sovereignty Advisory subtitle: "systems w/ SOVR-* warning"

### Accent color map (for MetricCard value text)
```
red     → text-red-300
amber   → text-amber-300
emerald → text-emerald-300
indigo  → text-indigo-300
blue    → text-blue-300
slate   → text-slate-200
```

### Header
- Title: "Estate Overview"
- Subtitle: "Last refreshed {time}" or "Loading…"
- Refresh button: top-right, `RefreshCw` icon, animates while loading

---

## Screen 2 — System Explorer

**Route:** `/systems`
**API endpoint:** `GET /api/internal/systems`
**Type:** `PaginatedResponse<ApiSystem>`

### Purpose
Browse all registered systems. Left panel is a system list; right panel shows system detail including evaluation history and associated rule metadata labels.

### Layout
Two-panel split:
- Left: scrollable system list `w-72` with search/filter
- Right: system detail panel, fills remaining space

### System list item fields
- `system_name` — primary label
- `sovereignty_level` — displayed as `SovereigntyBadge`
- `layer_id` — `text-[10px] font-mono text-slate-500`
- `is_active` — shown as a small indicator

### System detail panel
When a system is selected, fetch `GET /api/internal/systems/:system_id` and `GET /api/internal/evaluations?target_system_id={id}`.

**Fields displayed:**
- `system_id` (mono)
- `system_name`
- `layer_id`
- `sovereignty_level` — `SovereigntyBadge`
- `zero_cloud_required` — boolean indicator
- `is_active` — boolean indicator

**Evaluation history table columns:**
| Column      | Field             | Notes                        |
|-------------|-------------------|------------------------------|
| Outcome     | `outcome`         | `OutcomeBadge`               |
| Event Type  | `event_type`      | mono                         |
| Triggered   | `triggered_at`    | formatted datetime           |
| Triggered By| `triggered_by`    |                              |
| Critical    | `critical_count`  | red if > 0                   |
| Warning     | `warning_count`   | amber if > 0                 |
| Info        | `informational_count` |                          |
| Hash        | `rules_snapshot_hash` | truncated mono           |

**Rule metadata section** (display only — metadata from API `/rules`, not client-computed):
Shows which rules are associated with this system's layer. Labels only — no evaluation logic.

### Shared UI atoms used
- `SovereigntyBadge.svelte`
- `OutcomeBadge.svelte`

---

## Screen 3 — Governance Trace

**Route:** `/governance-trace`
**API endpoint:** `GET /api/internal/evaluations`
**Type:** `PaginatedResponse<ApiEvaluationEvent>`

### Purpose
Display the full estate-wide evaluation event history as a flat list. Read-only.

### Layout
Full-width page with header and a card containing the event list.

### Header
- Title: "Governance Evaluation History"
- Subtitle: "Backend-evaluated governance events and evaluation results."
- Refresh button: top-right

### Event list item fields
Each event displayed as a row:

| Field                | Display                              |
|----------------------|--------------------------------------|
| `event_type`         | `text-xs font-mono text-slate-200`   |
| `outcome`            | colored text (see outcome colors)    |
| `critical_count`     | red badge if > 0                     |
| `warning_count`      | amber badge if > 0                   |
| `informational_count`| blue badge if > 0                    |
| `event_id`           | truncated to 8 chars, mono           |
| `target_system_id`   | mono                                 |
| `target_system_name` | plain text                           |
| `triggered_by`       | plain text, fallback "—"             |
| `triggered_at`       | formatted datetime, right-aligned    |

### Outcome color map (text only, no background)
```
ALLOW → text-green-400
FLAG  → text-yellow-400
DENY  → text-red-400
```

### Empty state
Shield icon (`lucide Shield`, `text-slate-700`), "No evaluation events available."

---

## Screen 4 — Amendment Console

**Route:** `/amendments`
**API endpoint (list):** `GET /api/internal/amendments`
**API endpoint (detail):** `GET /api/internal/amendments/:amendment_id`
**Type:** `PaginatedResponse<ApiAmendment>`

### ⚠️ Amendment States
See the ⚠️ note in `API_CONTRACT.md`. Confirm v3 backend states before building this screen.

States used in v2.2 (reference only):
`PROPOSED | UNDER_REVIEW | APPROVED | EXECUTED | REJECTED | WITHDRAWN`

### Purpose
Two-panel interface: left lists amendments with state filter tabs, right shows full amendment detail with lifecycle actions.

### Layout
- Left panel: `w-80 flex-shrink-0 border-r border-slate-800`
- Right panel: `flex-1 min-w-0`

### Left panel — amendment list

**State filter tabs** (horizontal pill filters, one per status + "ALL"):
Active filter: `bg-indigo-600/20 text-indigo-300 border-indigo-500/40`
Inactive filter: `text-slate-500 border-slate-800`

**List item fields:**
- `amendment_code` (or `amendment_id`) — primary mono label
- `status` — `StatusBadge`
- `amendment_type` (if present) — `TypeBadge`
- `created_by` / `proposed_by` — with user icon
- `created_at` / `proposed_at` — with clock icon

Selected item: `bg-indigo-600/10 border-l-indigo-500`

**Pagination:** prev/next buttons, total count, page number — bottom of panel

### Right panel — amendment detail

**Meta grid (2-column):**
| Label         | Field               |
|---------------|---------------------|
| Amendment ID  | `amendment_id`      |
| Target System | `target_system_id`  |
| Created By    | `created_by`        |
| Created At    | `created_at`        |
| Resolved By   | `resolved_by`       |
| Resolved At   | `resolved_at`       |

**Lifecycle action buttons** (shown based on current status — backend enforces validity):
- Approve → `bg-emerald-600/20 text-emerald-300`
- Reject → `bg-red-600/20 text-red-300`

Action confirmation form fields: actor/reason (required), notes (optional)

**Transition history list:**
Each entry: `from_state → to_state`, `transitioned_by`, `transitioned_at`, optional notes

### Status badge color map
```
PENDING / PROPOSED    → bg-indigo-500/15 text-indigo-300 border-indigo-500/30
UNDER_REVIEW          → bg-amber-500/15 text-amber-300 border-amber-500/30
APPROVED              → bg-emerald-500/15 text-emerald-300 border-emerald-500/30
APPLIED / EXECUTED    → bg-teal-500/15 text-teal-300 border-teal-500/30
REJECTED              → bg-red-500/15 text-red-300 border-red-500/30
WITHDRAWN             → bg-slate-500/15 text-slate-400 border-slate-600
```

### Empty right panel state
`FileText` icon, "Select an amendment to inspect"
Subtitle: "Full history · Lifecycle actions"

---

## Shared Badge Components

All badges live in `src/lib/components/ui/`.

### SovereigntyBadge.svelte
Props: `level: SovereigntyLevel | null | undefined`

| Value       | Classes                                              |
|-------------|------------------------------------------------------|
| SOVEREIGN   | `bg-emerald-500/15 text-emerald-300 border-emerald-500/30` |
| APPROVED    | `bg-blue-500/15 text-blue-300 border-blue-500/30`   |
| CONDITIONAL | `bg-amber-500/15 text-amber-300 border-amber-500/30`|
| RESTRICTED  | `bg-orange-500/15 text-orange-300 border-orange-500/30` |
| PROHIBITED  | `bg-red-500/15 text-red-300 border-red-500/30`      |
| unknown/null| `bg-slate-500/15 text-slate-300 border-slate-500/30`|

### OutcomeBadge.svelte
Props: `outcome: EvaluationOutcome | null | undefined`

| Value | Classes                                                   |
|-------|-----------------------------------------------------------|
| ALLOW | `bg-emerald-500/15 text-emerald-300 border-emerald-500/30`|
| FLAG  | `bg-amber-500/15 text-amber-300 border-amber-500/30`     |
| DENY  | `bg-red-500/15 text-red-300 border-red-500/30`           |

### SeverityBadge.svelte
Props: `severity: RuleSeverity | null | undefined`

| Value         | Classes                                                   |
|---------------|-----------------------------------------------------------|
| CRITICAL      | `bg-red-500/15 text-red-300 border-red-500/30`           |
| WARNING       | `bg-amber-500/15 text-amber-300 border-amber-500/30`     |
| INFORMATIONAL | `bg-blue-500/15 text-blue-300 border-blue-500/30`        |

### Common badge base classes
```
inline-flex px-2 py-0.5 rounded border text-[10px] font-mono font-semibold
```

---

## Global Design Tokens

| Token             | Value               | Usage                          |
|-------------------|---------------------|--------------------------------|
| Page background   | `bg-[#09090e]`      | App root                       |
| Card background   | `bg-[#0d0d14]`      | Panels, cards                  |
| Card background 2 | `bg-[#111118]`      | Metric cards                   |
| Inner card        | `bg-[#0a0a10]`      | Nested panels                  |
| Border            | `border-slate-800`  | Most borders                   |
| Body text         | `text-slate-200`    | Primary content                |
| Secondary text    | `text-slate-400`    | Labels, descriptions           |
| Muted text        | `text-slate-500`    | Timestamps, subtitles          |
| Faint text        | `text-slate-600`    | Placeholders, disabled         |
| Accent            | `text-indigo-400`   | Icons, active states           |
| Error             | `text-red-400`      | Error messages                 |
| Mono label        | `font-mono text-[10px] uppercase tracking-widest` | Section headers |
