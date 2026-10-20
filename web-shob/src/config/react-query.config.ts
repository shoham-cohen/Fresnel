import { QueryClient } from '@tanstack/react-query';

const DAY_MS = 24 * 60 * 60 * 1000;
export const RECENT_REFETCH_MS = 30_000;

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
  history: () => [...narrativeKeys.all, 'history'] as const,
};

// Main screen: a request every time it opens and every 30s after, in a background tab too:
// today's narratives are the point of the system.
// TODO: replace polling with a server push (SSE / WebSocket) once the API has one.
export const RECENT_NARRATIVES_OPTIONS = {
  staleTime: 0,
  refetchInterval: RECENT_REFETCH_MS,
  refetchIntervalInBackground: true,
} as const;

export const HISTORY_NARRATIVES_OPTIONS = {
  gcTime: DAY_MS,
  staleTime: DAY_MS,
} as const;
