
export type Arena = 'IL' | 'ARAB' | 'INTL';

export interface NarrativeDetails {
  narrativeId: string;
  title: string;
  summary: string | null;
  isAnomaly: boolean;
  arena: Arena[] | null;
  detectedAt: string;
  itemList: string[] | null;
  platforms: string[] | null;
  sharesCount: number | null;
  viewsCount: number | null;
  languages: string[] | null;
  isFlagged: boolean;
  embedding?: number[] | null;
}

export const MOCK_CREATE_EVENT_URL =
  'http://localhost:5174/events/new';

export const MOCK_NARRATIVES: Record<string, NarrativeDetails> = {
  'nar-0001': {
    narrativeId: 'nar-0001',
    title: 'עלייה חריגה בשיח סביב פעילות צה״ל בגבול הצפון',
    summary: 'עלייה חדה בהיקף הפרסומים ברשת X',
    isAnomaly: true,
    arena: ['IL'],
    detectedAt: '2026-10-18T14:32:00.000Z',
    itemList: [
      'item-0001',
      'item-0002',
      'item-0003',
    ],
    platforms: ['X'],
    sharesCount: 5432,
    viewsCount: 63221,
    languages: ['he'],
    isFlagged: false,
  },

  'nar-0002': {
    narrativeId: 'nar-0002',
    title: 'סרטון מזויף של פגיעה בבסיס',
    summary: 'סרטון ישן מסוריה מופץ כאילו צולם אתמול בבסיס בדרום',
    isAnomaly: true,
    arena: ['ARAB'],
    detectedAt: '2026-10-18T16:15:00.000Z',
    itemList: [
      'item-0004',
      'item-0005',
    ],
    platforms: ['X', 'Telegram'],
    sharesCount: 2190,
    viewsCount: 38400,
    languages: ['ar'],
    isFlagged: true,
  },
};

export async function fetchNarrativeById(
  id: string,
): Promise<NarrativeDetails | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));

  return MOCK_NARRATIVES[id] ?? null;
}
