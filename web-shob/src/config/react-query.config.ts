import { QueryClient } from '@tanstack/react-query';

const DAY_MS = 24 * 60 * 60 * 1000;
const RECENT_REFETCH_MS = 30_000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

export const QUERY_KEYS = {
  NARRATIVES: 'narratives',
} as const;

// TODO: replace polling with a server push (SSE / WebSocket) once the API has one.
export const RECENT_NARRATIVES_OPTIONS = {
  staleTime: RECENT_REFETCH_MS,
  refetchInterval: RECENT_REFETCH_MS,
} as const;

export const HISTORY_NARRATIVES_OPTIONS = {
  gcTime: DAY_MS,
  staleTime: DAY_MS,
} as const;
