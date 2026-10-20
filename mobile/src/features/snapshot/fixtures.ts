import type { EventDetail, Stats } from '@/api/types';

export const mockEventDetail: EventDetail = {
  eventId: '00000000-0000-0000-0000-000000000001',
  narrativeId: 'nar-001',
  title: 'כותרת האירוע',
  summary: 'תיאור תמונת מצב של האירוע',
  arena: ['IL'],
  detectedAt: '2026-04-10T12:34:00.000Z',
  isAnomaly: true,
  severity: 'high',
  status: 'in_progress',
  isSimulation: false,
  createdBy: 'user',
  createdAt: '2026-04-10T12:34:00.000Z',
  updatedAt: '2026-04-10T12:34:00.000Z',
  closedAt: null,
  closedBy: null,
  closureSummary: null,
};

export const mockEventStats: Stats = {
  posts: 2546,
  views: 63232,
  shares: 1200,
  comments: 450,
  topSources: [
    { platform: 'instagram', count: 120 },
    { platform: 'twitter', count: 85 },
    { platform: 'ynet', count: 42 },
  ],
  basedOn: 100,
  asOf: '2026-04-10T12:34:00.000Z',
};

