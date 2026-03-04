/**
 * Systems TanStack Query hooks
 *
 * Usage in a Svelte component:
 *   import { systemsQuery, systemQuery } from '$lib/queries/systems.query';
 *   const result = createQuery(systemsQuery());
 *   // access via $result.data, $result.isPending, $result.isError
 *
 * See frontend/EXAMPLE_PATTERNS.md for full usage examples.
 */

import { createQueryFn } from '$lib/api/fetcher';
import { PaginatedSystemsSchema, SingleSystemSchema } from '$lib/schemas/api.schemas';
import type { ListSystemsParams } from '$lib/types/api.types';

export function systemsQuery(params: ListSystemsParams = {}) {
  const qs = new URLSearchParams();
  if (params.page !== undefined)              qs.set('page', String(params.page));
  if (params.page_size !== undefined)         qs.set('page_size', String(params.page_size));
  if (params.layer_id !== undefined)          qs.set('layer_id', String(params.layer_id));
  if (params.sovereignty_level !== undefined) qs.set('sovereignty_level', params.sovereignty_level);
  if (params.is_active !== undefined)         qs.set('is_active', String(params.is_active));

  const url = qs.toString()
    ? `/api/internal/systems?${qs}`
    : '/api/internal/systems';

  return {
    queryKey: ['systems', params],
    queryFn: createQueryFn(url, PaginatedSystemsSchema),
  };
}

export function systemQuery(systemId: string) {
  return {
    queryKey: ['systems', systemId],
    queryFn: createQueryFn(`/api/internal/systems/${systemId}`, SingleSystemSchema),
  };
}
