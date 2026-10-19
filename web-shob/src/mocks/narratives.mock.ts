import type { NarrativeDto, NarrativesQuery, Page } from '@/interfaces/narrative-api.interface';

const HOUR = 60 * 60 * 1000;
const MOCK_LATENCY_MS = 300;

const hoursAgo = (hours: number): string => {
  return new Date(Date.now() - hours * HOUR).toISOString();
};

const mockNarrative = (
  fields: Pick<NarrativeDto, 'narrativeId' | 'title' | 'summary' | 'locationName' | 'arena'> & {
    hoursAgo: number;
    viewsCount: number;
  },
): NarrativeDto => {
  const detectedAt = hoursAgo(fields.hoursAgo);

  return {
    detectedAt,
    payload: {},
    isAnomaly: true,
    title: fields.title,
    arena: fields.arena,
    receivedAt: detectedAt,
    summary: fields.summary,
    narrativeId: fields.narrativeId,
    locationName: fields.locationName,
    viewsCount: fields.viewsCount,
  };
};

const seedNarratives: NarrativeDto[] = [
  mockNarrative({
    narrativeId: 'nar-0010',
    title: 'עליה בשיח על מחירי הדלק',
    summary: 'שיח אזרחי שלא קשור לביטחון',
    locationName: null,
    arena: 'IL',
    hoursAgo: 0.5,
    viewsCount: 12_000,
  }),
  mockNarrative({
    narrativeId: 'nar-0007',
    title: 'דיון ער על תקציב הביטחון',
    summary: 'שיח רגיל ברשתות בעקבות הצעת התקציב',
    locationName: null,
    arena: 'IL',
    hoursAgo: 1,
    viewsCount: 30_000,
  }),
  mockNarrative({
    narrativeId: 'nar-0002',
    title: 'סרטון מזויף של פגיעה בבסיס',
    summary: 'סרטון ישן מסוריה מופץ כאילו צולם אתמול בבסיס בדרום',
    locationName: 'הנגב',
    arena: 'ARAB',
    hoursAgo: 3,
    viewsCount: 17_000,
  }),
  mockNarrative({
    narrativeId: 'nar-0001',
    title: 'שמועה על פינוי יישובים בגבול הצפון',
    summary: 'פוסטים רבים טוענים שהוחלט על פינוי כפוי של יישובי קו העימות',
    locationName: 'גבול הצפון',
    arena: 'IL',
    hoursAgo: 5,
    viewsCount: 42_000,
  }),
  mockNarrative({
    narrativeId: 'nar-0008',
    title: 'תמונות מתרגיל של צה״ל',
    summary: 'תמונות אמיתיות מתרגיל מופצות בלי הקשר שגוי',
    locationName: 'רמת הגולן',
    arena: 'IL',
    hoursAgo: 7,
    viewsCount: 8_000,
  }),
  mockNarrative({
    narrativeId: 'nar-0009',
    title: 'כתבה בתקשורת זרה על אזור הגבול',
    summary: 'כתבה של רשת בינלאומית, שיתופים רגילים',
    locationName: 'גבול הצפון',
    arena: 'INTL',
    hoursAgo: 12,
    viewsCount: 21_000,
  }),
  mockNarrative({
    narrativeId: 'nar-0003',
    title: 'טענה על הסתרת נפגעים',
    summary: 'חשבונות זרים מפיצים מספרי נפגעים שאינם תואמים את הפרסומים הרשמיים',
    locationName: null,
    arena: 'INTL',
    hoursAgo: 26,
    viewsCount: 63_000,
  }),
  mockNarrative({
    narrativeId: 'nar-0004',
    title: 'קמפיין נגד חיסון חיילים',
    summary: 'גל פוסטים שטוען שחיילים מחוסנים בכפייה בחיסון ניסיוני',
    locationName: null,
    arena: 'IL',
    hoursAgo: 48,
    viewsCount: 25_000,
  }),
  mockNarrative({
    narrativeId: 'nar-0005',
    title: 'דיווח כוזב על הפסקת אש',
    summary: 'ציוצים בערבית מדווחים על הסכם הפסקת אש שלא נחתם',
    locationName: 'רצועת עזה',
    arena: 'ARAB',
    hoursAgo: 96,
    viewsCount: 88_000,
  }),
  mockNarrative({
    narrativeId: 'nar-0006',
    title: 'הדלפה מזויפת של מסמך מבצעי',
    summary: 'מסמך עם לוגו מזויף מופץ בטלגרם כאילו הוא פקודת מבצע',
    locationName: null,
    arena: 'INTL',
    hoursAgo: 144,
    viewsCount: 9_000,
  }),
];

const prefixes = ['שמועה על', 'סרטון מזויף של', 'טענה כוזבת על', 'קמפיין נגד', 'דיווח מוטעה על'];
const subjects = ['פינוי יישובים', 'פגיעה בבסיס', 'מספר הנפגעים', 'גיוס מילואים', 'הפסקת אש'];
const locations = ['גבול הצפון', 'רצועת עזה', 'הנגב', 'רמת הגולן', 'יהודה ושומרון', null];
const arenas = ['IL', 'ARAB', 'INTL'] as const;

const pick = <T>(list: readonly T[], i: number): T => {
  return list[i % list.length] as T;
};

// 100 more, one every 3 hours, like nar-1001..nar-1100 in the seed. Deterministic on purpose.
const generatedNarratives: NarrativeDto[] = Array.from({ length: 100 }, (_, index) => {
  const g = index + 1;

  return mockNarrative({
    narrativeId: `nar-${String(1000 + g)}`,
    title: `${pick(prefixes, g)} ${pick(subjects, g * 3)}`,
    summary: `נרטיב שנוצר לבדיקות #${String(g)}`,
    locationName: pick(locations, g * 7),
    arena: pick(arenas, g * 5),
    hoursAgo: g * 3,
    viewsCount: (5 + ((g * 37) % 95)) * 10_000,
  });
});

/** Every mock narrative, newest first. */
export const mockNarrativeDtos: readonly NarrativeDto[] = [
  ...seedNarratives,
  ...generatedNarratives,
].sort((a, b) => Date.parse(b.detectedAt) - Date.parse(a.detectedAt));

const collator = new Intl.Collator('he', { numeric: true, sensitivity: 'base' });

const matches = (dto: NarrativeDto, query: NarrativesQuery): boolean => {
  const search = query.search?.trim();
  const detectedAt = Date.parse(dto.detectedAt);

  return (
    (!search || dto.title.includes(search) || Boolean(dto.summary?.includes(search))) &&
    (!query.from || detectedAt >= Date.parse(query.from)) &&
    (!query.to || detectedAt <= Date.parse(query.to)) &&
    (!query.locationName || dto.locationName === query.locationName)
  );
};

const compare = (a: NarrativeDto, b: NarrativeDto, sortBy: NarrativesQuery['sortBy']): number => {
  switch (sortBy) {
    case 'locationName':
      return collator.compare(a.locationName ?? '', b.locationName ?? '');
    case 'viewsCount':
      return a.viewsCount - b.viewsCount;
    default:
      return Date.parse(a.detectedAt) - Date.parse(b.detectedAt);
  }
};

/** Answers a narratives query the way the endpoint should: filter, sort, then page. */
export const getMockNarrativesPage = async (
  query: NarrativesQuery,
): Promise<Page<NarrativeDto>> => {
  const { page = 1, pageSize = 20, sortBy = 'detectedAt', sortDir = 'desc' } = query;
  const factor = sortDir === 'asc' ? 1 : -1;

  const filtered = mockNarrativeDtos
    .filter((dto) => matches(dto, query))
    .sort((a, b) => {
      // Like the table's own sort: narratives without a location stay last in both directions.
      if (sortBy === 'locationName') {
        const missing = Number(a.locationName === null) - Number(b.locationName === null);
        if (missing !== 0) return missing;
      }
      return factor * compare(a, b, sortBy);
    });

  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));

  return {
    items: filtered.slice((page - 1) * pageSize, page * pageSize),
    total: filtered.length,
    page,
    pageSize,
  };
};
