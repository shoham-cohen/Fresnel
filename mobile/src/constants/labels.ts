export const STATUS_LABEL = {
  open: 'פתוח',
  in_progress: 'בטיפול',
  closed: 'סגור',
} as const;

export const ANOMALY_LABEL = 'אנומליה';

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
  forbidden: 'אין לך הרשאה לצפות באירוע הזה.',
  notFound: 'האירוע לא נמצא.',
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

export const ADD_ACTION_LABEL = {
  button: 'הוסף פעולה',
  title: 'הוספת פעולה',
  type: 'סוג פעולה',
  actionTitle: 'כותרת לפעולה',
  actionTitlePlaceholder: 'הזן/י כותרת לפעולה...',
  description: 'תיאור קצר',
  descriptionPlaceholder: 'הזן/י תיאור קצר של מה שבוצע...',
  submit: 'הוסף פעולה',
  typePlaceholder: 'בחר/י סוג פעולה',
  typesError: 'לא הצלחנו לטעון את סוגי הפעולות.',
  eventClosed: 'האירוע נסגר, ולא ניתן להוסיף בו פעולות.',
} as const;

export const CLOSE_EVENT_LABEL = {
  button: 'סגור אירוע',
  title: 'סגירת אירוע',
  warning: 'האירוע ייסגר ולא יופיע יותר בטלפון.',
  summary: 'סיכום',
  summaryPlaceholder: 'סכמ/י את הטיפול באירוע...',
  submit: 'סגירת האירוע',
  alreadyClosed: 'האירוע כבר נסגר.',
} as const;

export const COMMON_LABEL = {
  loading: 'טוען נתונים...',
  retry: 'נסו שוב',
  empty: '—',
  back: 'חזרה',
  backHome: 'חזרה לבית',
  yesterday: 'אתמול',
} as const;

export const SNAPSHOT_LABEL = {
  eventTitle: 'כותרת האירוע',
  detectedAt: 'זיהוי האירוע',
  updatedAt: 'עדכון אחרון',
  totalPosts: 'סה״כ פרסומים',
  totalViews: 'סה״כ צפיות',
  topSources: 'מקורות מידע',
  noData: 'אין נתונים לאירוע',
  errorLoading: 'שגיאה בטעינת נתוני האירוע',
} as const;

export const ERROR_TEXT = {
  network: 'אין חיבור לשרת. בדקו את החיבור ונסו שוב.',
  generic: 'משהו השתבש. נסו שוב.',
} as const;
