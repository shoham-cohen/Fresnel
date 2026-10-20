import type { SourceItem } from './types';

// Sample data for the sources screen until the items route is wired up.

const SAMPLES: Omit<SourceItem, 'itemId' | 'publishedAt'>[] = [
  {
    platform: 'telegram',
    url: 'https://t.me/news_channel/12345',
    title: null,
    contentText: 'דיווחים ראשונים על פינוי יישובים בקו העימות. התושבים מתבקשים להישאר בבתים עד להודעה חדשה',
    authorName: 'חדשות הצפון',
    sourceId: 'news_channel',
  },
  {
    platform: 'x',
    url: 'https://x.com/someone/status/1',
    title: null,
    contentText: 'שמעתי ממקור אמין שכבר הוחלט על פינוי. למה לא מספרים לנו כלום?',
    authorName: 'דני כהן',
    sourceId: 'dani_c',
  },
  {
    platform: 'facebook',
    url: 'https://facebook.com/groups/123/posts/456',
    title: null,
    contentText: 'מישהו יודע משהו על הפינוי? הילדים לא הלכו היום לבית הספר',
    authorName: 'קבוצת תושבי הגליל',
    sourceId: null,
  },
  {
    platform: 'news',
    url: 'https://example.com/article/789',
    title: 'גורם רשמי: "אין כל החלטה על פינוי יישובים"',
    contentText: 'בתגובה לשמועות ברשתות החברתיות, גורם רשמי הבהיר כי לא התקבלה החלטה',
    authorName: null,
    sourceId: 'example.com',
  },
  {
    platform: 'instagram',
    url: 'https://instagram.com/p/abc',
    title: null,
    contentText: 'תמונות מהכביש הראשי, תנועה כבדה לכיוון דרום',
    authorName: 'north_life',
    sourceId: 'north_life',
  },
  {
    platform: 'tiktok',
    url: 'https://tiktok.com/@user/video/1',
    title: null,
    contentText: 'סרטון שמראה כאילו שיירת אוטובוסים מגיעה לפנות את היישוב',
    authorName: 'user_2041',
    sourceId: null,
  },
  {
    platform: 'youtube',
    url: null,
    title: 'ניתוח: מאחורי השמועה על הפינוי',
    contentText: null,
    authorName: null,
    sourceId: null,
  },
];

const MINUTE = 60 * 1000;

function buildItems(count: number): SourceItem[] {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => ({
    ...SAMPLES[i % SAMPLES.length],
    itemId: `0:${SAMPLES[i % SAMPLES.length].platform}:${1000 + i}`,
    // Newest first, about 40 minutes apart, so the list crosses into earlier days.
    publishedAt: new Date(now - (i * 40 + 3) * MINUTE).toISOString(),
  }));
}

export const SOURCES_FIXTURE = {
  items: buildItems(40),
  total: 124,
};
