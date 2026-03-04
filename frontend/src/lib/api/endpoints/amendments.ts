/**
 * Amendments API endpoints
 *
 * ⚠️  BEFORE IMPLEMENTING: confirm amendment lifecycle states with backend team.
 * See the ⚠️ note in frontend/API_CONTRACT.md → "Open Decision — Amendment States"
 *
 * See frontend/API_CONTRACT.md → Amendments for endpoint specs.
 */

import { fetchJSON, mutateJSON } from '$lib/api/fetcher';
import {
  PaginatedAmendmentsSchema,
  SingleAmendmentSchema,
} from '$lib/schemas/api.schemas';
import type {
  PaginatedResponse,
  SingleResponse,
  ApiAmendment,
  ListAmendmentsParams,
  CreateAmendmentRequest,
  UpdateAmendmentStatusRequest,
} from '$lib/types/api.types';

const BASE = '/api/internal/amendments';

export async function getAmendments(
  params: ListAmendmentsParams = {}
): Promise<PaginatedResponse<ApiAmendment>> {
  const qs = new URLSearchParams();
  if (params.page !== undefined)             qs.set('page', String(params.page));
  if (params.page_size !== undefined)        qs.set('page_size', String(params.page_size));
  if (params.target_system_id !== undefined) qs.set('target_system_id', params.target_system_id);
  if (params.status !== undefined)           qs.set('status', params.status);

  const url = qs.toString() ? `${BASE}?${qs}` : BASE;
  return fetchJSON(url, PaginatedAmendmentsSchema);
}

export async function createAmendment(
  payload: CreateAmendmentRequest
): Promise<SingleResponse<ApiAmendment>> {
  return mutateJSON(BASE, 'POST', payload, SingleAmendmentSchema);
}

export async function updateAmendmentStatus(
  amendmentId: string,
  payload: UpdateAmendmentStatusRequest
): Promise<SingleResponse<ApiAmendment>> {
  return mutateJSON(`${BASE}/${amendmentId}`, 'PATCH', payload, SingleAmendmentSchema);
}
