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

export const TIMELINE_EVENT_LABEL = {
  event_created: 'האירוע נפתח',
  event_reopened: 'האירוע נפתח מחדש',
} as const;

export const ACTIONS_LABEL = {
  empty: 'עוד לא תועדו פעולות',
} as const;

export const DELETE_ACTION_LABEL = {
  button: 'מחיקת הפעולה',
  title: 'למחוק את הפעולה?',
  message: 'הפעולה תימחק מציר הפעולות.',
  confirm: 'מחיקה',
  cancel: 'ביטול',
  notMine: 'אפשר למחוק רק פעולה שתיעדת.',
  alreadyDeleted: 'הפעולה כבר נמחקה.',
  eventClosed: 'האירוע נסגר, ולא ניתן למחוק בו פעולות.',
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
