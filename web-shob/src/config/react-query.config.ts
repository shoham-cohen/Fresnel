import { QueryClient } from '@tanstack/react-query';
import type { Reality } from '@/types';
import type { NarrativesQuery } from '@/interfaces/narrative-api.interface';

const DAY_MS = 24 * 60 * 60 * 1000;
const RECENT_REFETCH_MS = 30_000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

// Lists are cached per reality, so switching modes never shows the other mode's data.
export const narrativeKeys = {
  all: ['narratives'] as const,
  update: () => [...narrativeKeys.all, 'update'] as const,
  reality: (reality: Reality) => [...narrativeKeys.all, reality] as const,
  recent: (reality: Reality, hours: number) =>
    [...narrativeKeys.reality(reality), 'recent', hours] as const,
  histories: (reality: Reality) => [...narrativeKeys.reality(reality), 'history'] as const,
  history: (reality: Reality, query: NarrativesQuery) =>
    [...narrativeKeys.histories(reality), query] as const,
};

export const RECENT_NARRATIVES_OPTIONS = {
  staleTime: 0,
  refetchInterval: RECENT_REFETCH_MS,
  refetchIntervalInBackground: true,
} as const;

export const HISTORY_NARRATIVES_OPTIONS = {
  gcTime: DAY_MS,
  staleTime: DAY_MS,
} as const;
