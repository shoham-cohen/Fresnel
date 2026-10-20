import { useQuery } from '@tanstack/react-query';
import { useIsFocused } from 'expo-router';
import { apiFetch } from '@/api/client';
import { POLL } from '@/api/polling';
import { queryKeys } from '@/api/queryKeys';
import type { TimelineEntry } from '@/api/types';

export function useTimeline(eventId: string) {
  const isFocused = useIsFocused();

  return useQuery({
    queryKey: queryKeys.timeline(eventId),
    queryFn: () => apiFetch<TimelineEntry[]>(`/api/actions-performed/events/${eventId}/timeline`),
    refetchInterval: POLL.timeline,
    subscribed: isFocused,
  });
}
