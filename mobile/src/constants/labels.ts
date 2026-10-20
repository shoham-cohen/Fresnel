export const STATUS_LABEL = {
  open: 'פתוח',
  in_progress: 'בטיפול',
  closed: 'סגור',
} as const;

export const SCREEN_TITLE = {
  login: 'כניסה',
  home: 'ניהול אירוע',
  profile: 'פרופיל',
  event: 'ניהול אירוע',
} as const;

export const EVENT_TAB_LABEL = {
  snapshot: 'תמונת מצב',
  actions: 'פעולות שבוצעו',
  sources: 'מקורות מידע',
} as const;

export const COMMON_LABEL = {
  loading: 'טוען…',
  retry: 'נסו שוב',
  yesterday: 'אתמול',
} as const;

export const ERROR_TEXT = {
  network: 'אין חיבור לשרת. בדקו את החיבור ונסו שוב.',
  generic: 'משהו השתבש. נסו שוב.',
} as const;
