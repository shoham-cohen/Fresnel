import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/api/client';
import { queryKeys } from '@/api/queryKeys';
import type { CloseEventBody } from '@/api/types';

export function useCloseEvent(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CloseEventBody) =>
      apiFetch<void>(`/api/events/${eventId}/close`, { method: 'POST', body }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.eventsAll }),
        queryClient.invalidateQueries({ queryKey: queryKeys.event(eventId) }),
      ]),
  });
}
