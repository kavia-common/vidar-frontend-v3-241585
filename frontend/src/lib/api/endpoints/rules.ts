/**
 * Rules API endpoints
 *
 * Rules are metadata only — they are executed exclusively by the backend.
 * The frontend fetches and displays rule metadata. It never executes rules.
 *
 * See frontend/API_CONTRACT.md → Rules for endpoint specs.
 */

import { fetchJSON } from '$lib/api/fetcher';
import { PaginatedRulesSchema } from '$lib/schemas/api.schemas';
import type {
  PaginatedResponse,
  ApiRuleMetadata,
  ListRulesParams,
} from '$lib/types/api.types';

const BASE = '/api/internal/rules';

export async function getRules(
  params: ListRulesParams = {}
): Promise<PaginatedResponse<ApiRuleMetadata>> {
  const qs = new URLSearchParams();
  if (params.page !== undefined)      qs.set('page', String(params.page));
  if (params.page_size !== undefined) qs.set('page_size', String(params.page_size));
  if (params.severity !== undefined)  qs.set('severity', params.severity);
  if (params.scope !== undefined)     qs.set('scope', params.scope);
  if (params.domain !== undefined)    qs.set('domain', params.domain);

  const url = qs.toString() ? `${BASE}?${qs}` : BASE;
  return fetchJSON(url, PaginatedRulesSchema);
}
