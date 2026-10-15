# web-vandamme

ה-frontend של ניהול אירוע (ואן דאם). React + TypeScript + MUI + Vite, RTL ועברית.

## הרצה מקומית
1. להרים את ה-API: `cd ../api && npm run start:dev` (פרטים ב-`api/README.md`).
2. `npm install`
3. `npm run dev` – האפליקציה עולה על `http://localhost:5173`.

Vite מעביר כל קריאה ל-`/api` אל `http://localhost:3000` (ב-`vite.config.ts`), כך שאין צורך ב-CORS או בכתובת שרת בקוד.

## מבנה התיקיות
```
src/
├── main.tsx                  נקודת הכניסה: RTL, theme, פונטים
├── App.tsx                   המעטפת: Header, ניווט, והעמוד הנוכחי
├── theme.ts                  צבעים, פונט, scrollbars
├── pages/                    עמוד לכל פריט בניווט. מחבר hooks לקומפוננטות ומחזיק את ה-state של המסך
│   ├── ActiveEventsPage.tsx  אירועים פתוחים
│   └── ClosedEventsPage.tsx  אירועים שנסגרו
├── components/               קומפוננטות לתצוגה: מקבלות props, בלי קריאות ל-API
│   ├── layout/               שלד המסך: AppHeader, NavDrawer, ListDetailLayout
│   ├── ActiveEventList.tsx   רשימת האירועים הפתוחים: חיפוש, infinite scroll
│   └── NoEventSelected.tsx   המצב הריק של פאנל האירוע
├── hooks/                    טעינת נתונים ולוגיקה שאפשר לשתף
│   ├── useActiveEvents.ts    האירועים הפתוחים מה-API, עמוד אחרי עמוד
│   └── useDebouncedValue.ts
├── api/                      הקריאות לשרת והטיפוסים של התשובות, קובץ לכל משאב
│   └── events.ts             GET /api/events
├── constants/                (כשיהיה צורך) התוויות בעברית לקודים מה-DB: סטטוס, חומרה, זירה
└── assets/                   לוגואים ותמונות
```

כללים:
- `pages/` → `hooks/` → `api/`. עמוד טוען נתונים דרך hook, ה-hook קורא ל-`api/`, ו-`fetch` רק ב-`api/`.
- `components/` לא טוענות נתונים ולא מכירות את ה-API: הכל מגיע ב-props, כך שאפשר להשתמש בהן בכמה עמודים.
- הטיפוסים של תשובות השרת מוגדרים ב-`api/` ותואמים ל-DTO בשרת (camelCase).
- התווית בעברית של קוד מה-DB (למשל `in_progress` → "בטיפול") רק ב-`constants/`, לא בשרת ולא ב-DB.
