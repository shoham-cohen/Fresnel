import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/api/client';
import { queryKeys } from '@/api/queryKeys';
import type { CreateActionBody } from '@/api/types';

export function useCreateAction(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateActionBody) =>
      apiFetch<void>(`/api/actions-performed/events/${eventId}/actions`, { method: 'POST', body }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.timeline(eventId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.event(eventId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.eventsAll }),
      ]),
  });
}
