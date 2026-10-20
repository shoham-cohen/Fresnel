import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/api/client';
import { queryKeys } from '@/api/queryKeys';

export function useDeleteAction(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (actionId: string) =>
      apiFetch<void>(`/api/actions/${actionId}`, { method: 'DELETE' }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.timeline(eventId) }),
  });
}
