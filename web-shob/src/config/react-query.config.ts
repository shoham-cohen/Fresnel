import { QueryClient } from '@tanstack/react-query';
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

export const narrativeKeys = {
  all: ['narratives'] as const,
  update: () => [...narrativeKeys.all, 'update'] as const,
  recent: (hours: number) => [...narrativeKeys.all, 'recent', hours] as const,
  histories: () => [...narrativeKeys.all, 'history'] as const,
  history: (query: NarrativesQuery) => [...narrativeKeys.histories(), query] as const,
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
