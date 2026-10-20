import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { useIsFocused } from 'expo-router';

import { apiFetch } from '@/api/client';
import { POLL } from '@/api/polling';
import { queryKeys } from '@/api/queryKeys';
import type { OpenEvent, Page } from '@/api/types';

const PAGE_SIZE = 20;

// The open real events in the user's arena, newest first. Refetched every 15 seconds while the
// screen is focused, so an event closed on the web leaves the list on its own.
export function useOpenEvents(search: string) {
  const isFocused = useIsFocused();

  const query = useInfiniteQuery({
    queryKey: queryKeys.events(search),
    queryFn: ({ pageParam }) => {
      const params = new URLSearchParams({ page: String(pageParam), pageSize: String(PAGE_SIZE) });
      if (search) params.set('search', search);
      return apiFetch<Page<OpenEvent>>(`/api/mobile/events?${params}`);
    },
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page * last.pageSize < last.total ? last.page + 1 : undefined),
    refetchInterval: isFocused ? POLL.list : false,
    // A new search keeps the previous rows on screen until its results arrive.
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
    events: query.data?.pages.flatMap((p) => p.items) ?? [],
    total: query.data?.pages[0]?.total ?? 0,
  };
}
