// Query keys shared by every screen, so an invalidate in one place refreshes the others.
export const queryKeys = {
  eventsAll: ['events'] as const,
  events: (search: string) => ['events', search] as const,
  event: (id: string) => ['event', id] as const,
  timeline: (id: string) => ['timeline', id] as const,
  stats: (id: string) => ['stats', id] as const,
  items: (id: string) => ['items', id] as const,
  actionTypes: ['action-types'] as const,
};
