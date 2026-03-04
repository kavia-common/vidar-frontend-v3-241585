/**
 * Systems API endpoints
 *
 * Implement these functions using fetchJSON / mutateJSON from $lib/api/fetcher.
 * See frontend/EXAMPLE_PATTERNS.md for the required pattern.
 * See frontend/API_CONTRACT.md → Systems for endpoint specs.
 */

import { fetchJSON } from '$lib/api/fetcher';
import {
  PaginatedSystemsSchema,
  SingleSystemSchema,
} from '$lib/schemas/api.schemas';
import type {
  PaginatedResponse,
  SingleResponse,
  ApiSystem,
  ListSystemsParams,
} from '$lib/types/api.types';

const BASE = '/api/internal/systems';

export async function getSystems(
  params: ListSystemsParams = {}
): Promise<PaginatedResponse<ApiSystem>> {
  const qs = new URLSearchParams();
  if (params.page !== undefined)              qs.set('page', String(params.page));
  if (params.page_size !== undefined)         qs.set('page_size', String(params.page_size));
  if (params.layer_id !== undefined)          qs.set('layer_id', String(params.layer_id));
  if (params.sovereignty_level !== undefined) qs.set('sovereignty_level', params.sovereignty_level);
  if (params.is_active !== undefined)         qs.set('is_active', String(params.is_active));

  const url = qs.toString() ? `${BASE}?${qs}` : BASE;
  return fetchJSON(url, PaginatedSystemsSchema);
}

export async function getSystem(systemId: string): Promise<SingleResponse<ApiSystem>> {
  return fetchJSON(`${BASE}/${systemId}`, SingleSystemSchema);
}
