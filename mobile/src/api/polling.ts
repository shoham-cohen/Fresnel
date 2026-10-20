// How often each screen refetches while it is focused (there is no socket).
export const POLL = {
  list: 15_000,
  events: 15_000,
  event: 15_000,
  timeline: 15_000,
  stats: 60_000,
  items: 60_000,
  dataLake: 60_000,
} as const;
