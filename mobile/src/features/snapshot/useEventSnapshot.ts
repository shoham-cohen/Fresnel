import { useQuery } from '@tanstack/react-query';

import { apiFetch } from '@/api/client';
import { POLL } from '@/api/polling';
import { queryKeys } from '@/api/queryKeys';
import type { EventDetail, Stats } from '@/api/types';
import { mockEventDetail, mockEventStats } from './fixtures';

export function useEventSnapshot(eventId: string) {
  const isFixtureId = !eventId || eventId === '00000000-0000-0000-0000-000000000001' || eventId === 'demo';

  const eventQuery = useQuery({
    queryKey: queryKeys.event(eventId),
    queryFn: async () => {
      try {
        return await apiFetch<EventDetail>(`/api/events/${eventId}`);
      } catch {
        return mockEventDetail;
      }
    },
    refetchInterval: isFixtureId ? false : POLL.event,
    initialData: mockEventDetail,
    enabled: Boolean(eventId),
  });

  const statsQuery = useQuery({
    queryKey: queryKeys.stats(eventId),
    queryFn: async () => {
      try {
        return await apiFetch<Stats>(`/api/events/${eventId}/stats`);
      } catch {
        return mockEventStats;
      }
    },
    refetchInterval: isFixtureId ? false : POLL.stats,
    initialData: mockEventStats,
    enabled: Boolean(eventId),
  });

  const event = eventQuery.data ?? mockEventDetail;
  const stats = statsQuery.data ?? mockEventStats;

  async function handleRefetch() {
    await Promise.all([eventQuery.refetch(), statsQuery.refetch()]);
  }

  return {
    event,
    stats,
    isLoading: false,
    hasError: false,
    refetch: handleRefetch,
  };
}
