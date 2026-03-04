/**
 * Evaluations TanStack Query hooks
 */

import { createQueryFn } from '$lib/api/fetcher';
import { PaginatedEvaluationsSchema } from '$lib/schemas/api.schemas';
import type { ListEvaluationsParams } from '$lib/types/api.types';

export function evaluationsQuery(params: ListEvaluationsParams = {}) {
  const qs = new URLSearchParams();
  if (params.page !== undefined)             qs.set('page', String(params.page));
  if (params.page_size !== undefined)        qs.set('page_size', String(params.page_size));
  if (params.target_system_id !== undefined) qs.set('target_system_id', params.target_system_id);
  if (params.outcome !== undefined)          qs.set('outcome', params.outcome);
  if (params.from !== undefined)             qs.set('from', params.from);
  if (params.to !== undefined)               qs.set('to', params.to);

  const url = qs.toString()
    ? `/api/internal/evaluations?${qs}`
    : '/api/internal/evaluations';

  return {
    queryKey: ['evaluations', params],
    queryFn: createQueryFn(url, PaginatedEvaluationsSchema),
  };
}
