/**
 * Display formatting utilities
 * Pure functions only — no governance logic.
 */

/** Format an ISO 8601 datetime string for display */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

/** Truncate a string to n characters with ellipsis */
export function truncate(value: string, n: number): string {
  return value.length > n ? value.slice(0, n) + '…' : value;
}
