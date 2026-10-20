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

export const COMMON_LABEL = {
  retry: 'נסה שוב',
  empty: '—',
  loading: 'טוען נתונים...',
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

export const LOGIN_LABEL = {
  signIn: 'כניסה עם SSO',
  signingIn: 'מתחבר...',
  failed: 'הכניסה נכשלה. בדקו ש-openport מחובר ונסו שוב.',
  notConfigured: 'חסרים EXPO_PUBLIC_KEYCLOAK_ISSUER ו-EXPO_PUBLIC_KEYCLOAK_CLIENT_ID ב-.env',
} as const;

export const PUSH_STATUS_LABEL = {
  idle: '—',
  registered: 'פעיל',
  denied: 'אין הרשאה להתראות',
  unsupported: 'לא נתמך במכשיר הזה',
  error: 'הרישום להתראות נכשל',
} as const;
