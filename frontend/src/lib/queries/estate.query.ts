/**
 * Estate Health TanStack Query hook
 */

import { createQueryFn } from '$lib/api/fetcher';
import { ApiEstateHealthSchema } from '$lib/schemas/api.schemas';

export function estateHealthQuery() {
  return {
    queryKey: ['estate-health'],
    queryFn: createQueryFn('/api/internal/governance/estate-health', ApiEstateHealthSchema),
  };
}
