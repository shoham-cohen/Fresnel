import { useInfiniteQuery } from '@tanstack/react-query';
import { useIsFocused } from 'expo-router';

import { apiFetch } from '@/api/client';
import { POLL } from '@/api/polling';
import { queryKeys } from '@/api/queryKeys';

import type { SourceItem } from './types';

const PAGE_SIZE = 20;

type ItemsPage = {
  items: SourceItem[];
  total: number; // the length of the narrative's item id list
  page: number;
  pageSize: number;
};

// The event's items, 20 at a time, refetched every 60 seconds while the tab is open.
export function useSources(eventId: string) {
  const isFocused = useIsFocused();

  const query = useInfiniteQuery({
    queryKey: queryKeys.items(eventId),
    queryFn: ({ pageParam }) =>
      apiFetch<ItemsPage>(
        `/api/events/${encodeURIComponent(eventId)}/items?page=${pageParam}&pageSize=${PAGE_SIZE}`,
      ),
    initialPageParam: 1,
    // Items missing from the Data Lake are not returned, so the last page is found by page count, not by rows.
    getNextPageParam: (last) => (last.page * last.pageSize < last.total ? last.page + 1 : undefined),
    refetchInterval: isFocused ? POLL.dataLake : false,
  });

  return {
    ...query,
    items: query.data?.pages.flatMap((p) => p.items) ?? [],
    total: query.data?.pages[0]?.total ?? 0,
  };
}
