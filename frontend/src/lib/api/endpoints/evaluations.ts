/**
 * Evaluations API endpoints
 *
 * See frontend/API_CONTRACT.md → Evaluations for endpoint specs.
 */

import { fetchJSON, mutateJSON } from '$lib/api/fetcher';
import {
  PaginatedEvaluationsSchema,
  SingleResponseSchema,
  ApiEvaluationEventSchema,
} from '$lib/schemas/api.schemas';
import type {
  PaginatedResponse,
  SingleResponse,
  ApiEvaluationEvent,
  ListEvaluationsParams,
  TriggerEvaluationRequest,
} from '$lib/types/api.types';

const BASE = '/api/internal/evaluations';

export async function getEvaluations(
  params: ListEvaluationsParams = {}
): Promise<PaginatedResponse<ApiEvaluationEvent>> {
  const qs = new URLSearchParams();
  if (params.page !== undefined)              qs.set('page', String(params.page));
  if (params.page_size !== undefined)         qs.set('page_size', String(params.page_size));
  if (params.target_system_id !== undefined)  qs.set('target_system_id', params.target_system_id);
  if (params.outcome !== undefined)           qs.set('outcome', params.outcome);
  if (params.from !== undefined)              qs.set('from', params.from);
  if (params.to !== undefined)                qs.set('to', params.to);

  const url = qs.toString() ? `${BASE}?${qs}` : BASE;
  return fetchJSON(url, PaginatedEvaluationsSchema);
}

export async function triggerEvaluation(
  payload: TriggerEvaluationRequest
): Promise<SingleResponse<ApiEvaluationEvent>> {
  return mutateJSON(
    `${BASE}/trigger`,
    'POST',
    payload,
    SingleResponseSchema(ApiEvaluationEventSchema)
  );
}
