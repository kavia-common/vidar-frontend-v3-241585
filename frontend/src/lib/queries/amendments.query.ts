/**
 * Amendments TanStack Query hooks
 *
 * ⚠️  Confirm amendment lifecycle states before building mutation UI.
 * See frontend/API_CONTRACT.md → "Open Decision — Amendment States"
 */

import { createQueryFn, createMutationFn } from '$lib/api/fetcher';
import { PaginatedAmendmentsSchema, SingleAmendmentSchema } from '$lib/schemas/api.schemas';
import type {
  ListAmendmentsParams,
  CreateAmendmentRequest,
  ApiAmendment,
} from '$lib/types/api.types';

export function amendmentsQuery(params: ListAmendmentsParams = {}) {
  const qs = new URLSearchParams();
  if (params.page !== undefined)             qs.set('page', String(params.page));
  if (params.page_size !== undefined)        qs.set('page_size', String(params.page_size));
  if (params.target_system_id !== undefined) qs.set('target_system_id', params.target_system_id);
  if (params.status !== undefined)           qs.set('status', params.status);

  const url = qs.toString()
    ? `/api/internal/amendments?${qs}`
    : '/api/internal/amendments';

  return {
    queryKey: ['amendments', params],
    queryFn: createQueryFn(url, PaginatedAmendmentsSchema),
  };
}

// Mutation function — bind once, use in createMutation({ mutationFn })
// After success: invalidateQueries({ queryKey: ['amendments'] })
// Never use optimistic updates for amendment mutations.
export const createAmendmentMutationFn =
  createMutationFn<CreateAmendmentRequest, ApiAmendment>(
    '/api/internal/amendments',
    'POST',
    SingleAmendmentSchema
  );
