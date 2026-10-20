import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/api/client';
import { queryKeys } from '@/api/queryKeys';
import type { ActionType } from '@/api/types';

const ONE_HOUR = 60 * 60 * 1000;

export function useActionTypes() {
  return useQuery({
    queryKey: queryKeys.actionTypes,
    queryFn: () => apiFetch<ActionType[]>('/api/action-types'),
    select: (types) => types.filter((type) => type.active),
    staleTime: ONE_HOUR,
  });
}
