export const queryKeys = {
  events: (search?: string) => ['events', search ?? ''] as const,
  event: (id: string) => ['event', id] as const,
  stats: (id: string) => ['stats', id] as const,
  items: (id: string) => ['items', id] as const,
  timeline: (id: string) => ['timeline', id] as const,
  actionTypes: () => ['action-types'] as const,
};

