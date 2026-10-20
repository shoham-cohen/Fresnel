import { useQuery } from '@tanstack/react-query';
import { useIsFocused } from 'expo-router';

import { apiFetch } from '@/api/client';
import { POLL } from '@/api/polling';
import { queryKeys } from '@/api/queryKeys';
import type { EventDetail, Stats } from '@/api/types';

// The event card (every 15 seconds) and its stats (every 60 seconds), while the tab is open.
export function useEventSnapshot(eventId: string) {
  const isFocused = useIsFocused();
  const path = `/api/mobile/events/${encodeURIComponent(eventId)}`;

  const eventQuery = useQuery({
    queryKey: queryKeys.event(eventId),
    queryFn: () => apiFetch<EventDetail>(path),
    refetchInterval: isFocused ? POLL.list : false,
    enabled: Boolean(eventId),
  });

  const statsQuery = useQuery({
    queryKey: queryKeys.stats(eventId),
    queryFn: () => apiFetch<Stats>(`${path}/stats`),
    refetchInterval: isFocused ? POLL.dataLake : false,
    enabled: Boolean(eventId),
  });

  async function refetch() {
    await Promise.all([eventQuery.refetch(), statsQuery.refetch()]);
  }

  return {
    event: eventQuery.data,
    // A stats failure does not hide the card: its numbers show "—".
    stats: statsQuery.data,
    isLoading: eventQuery.isPending,
    isError: eventQuery.isError,
    refetch,
  };
}
