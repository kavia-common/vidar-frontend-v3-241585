/**
 * Estate Health API endpoint
 *
 * Returns aggregated estate-wide governance metrics for the overview dashboard.
 * Single response — not paginated.
 *
 * See frontend/API_CONTRACT.md → Estate Health for endpoint spec.
 */

import { fetchJSON } from '$lib/api/fetcher';
import { ApiEstateHealthSchema } from '$lib/schemas/api.schemas';
import type { ApiEstateHealth } from '$lib/types/api.types';

export async function getEstateHealth(): Promise<ApiEstateHealth> {
  return fetchJSON('/api/internal/governance/estate-health', ApiEstateHealthSchema);
}
