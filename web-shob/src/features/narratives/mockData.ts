
export type Arena = 'IL' | 'ARAB' | 'INTL';

export interface NarrativeMetrics {
  publications: number;
  sources: number;
  views: number;
  shares: number;
}

export interface NarrativeDetails {
  narrativeId: string;
  title: string;
  summary: string | null;
  isAnomaly: boolean;
  arena: Arena | null;
  locationName: string | null;
  detectedAt: string;
  metrics: NarrativeMetrics;
}

export const MOCK_CREATE_EVENT_URL =
  'http://localhost:5174/events/new';

export const MOCK_NARRATIVES: Record<string, NarrativeDetails> = {
  'nar-0001': {
    narrativeId: 'nar-0001',
    title: 'עלייה חריגה בשיח סביב פעילות צה״ל בגבול הצפון',
    summary: 'עלייה חדה בהיקף הפרסומים ברשת X',
    isAnomaly: true,
    arena: 'IL',
    locationName: 'גבול הצפון',
    detectedAt: '2026-10-18T14:32:00.000Z',
    metrics: {
      publications: 2847,
      sources: 126,
      views: 63221,
      shares: 5432,
    },
  },

  'nar-0002': {
    narrativeId: 'nar-0002',
    title: 'סרטון מזויף של פגיעה בבסיס',
    summary: 'סרטון ישן מסוריה מופץ כאילו צולם אתמול בבסיס בדרום',
    isAnomaly: true,
    arena: 'ARAB',
    locationName: 'הנגב',
    detectedAt: '2026-10-18T16:15:00.000Z',
    metrics: {
      publications: 1420,
      sources: 54,
      views: 38400,
      shares: 2190,
    },
  },
};

export async function fetchNarrativeById(
  id: string,
): Promise<NarrativeDetails | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));

  return MOCK_NARRATIVES[id] ?? null;
}
