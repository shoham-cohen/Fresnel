# Palantir (web)

ה-frontend של Palantir, מערכת תמונת המצב של מדור Fresnel (לשעבר ״שו״ב״). זה פרויקט פתיחה: יש בו תשתית, טוקנים, ניווט ו-Navbar. את המסכים עצמם אתם בונים.

## הרצה

דרישות: Node 24 (ראו `.nvmrc`) ו-npm.

```bash
npm install
npm run dev          # שרת פיתוח: http://localhost:5173
```

| סקריפט                            | מה הוא עושה                                |
| --------------------------------- | ------------------------------------------ |
| `npm run dev`                     | שרת פיתוח עם hot reload                    |
| `npm run build`                   | בדיקת טיפוסים (`tsc -b`) ו-build ל-`dist/` |
| `npm run preview`                 | מגיש את ה-build המקומי                     |
| `npm run typecheck`               | בדיקת טיפוסים בלבד                         |
| `npm run lint`                    | ESLint                                     |
| `npm run format` / `format:check` | Prettier: מתקן / רק בודק                   |
| `npm test` / `test:watch`         | Vitest: ריצה אחת / מצב watch               |

לפני push: `npm run lint && npm test && npm run build`.

## הסטאק

React 19, TypeScript 6 (strict), Vite 8, React Router 8 (data router), CSS Modules, Vitest + React Testing Library, ESLint + Prettier. הפונט Rubik נטען מקומית דרך `@fontsource/rubik` (בלי CDN).

אין ספריית state, אין ספריית UI ואין Tailwind. אם צריך אחת מהן, מעלים את זה לדיון לפני שמתקינים.

## מבנה התיקיות

```
src/
├── main.tsx              # נקודת כניסה: פונטים, סגנונות גלובליים, RouterProvider
├── app/                  # מעטפת האפליקציה: router.tsx, RootLayout
├── routes/
│   ├── paths.ts          # נתיבי URL ופריטי ה-Navbar
│   └── routes.tsx        # קונפיגורציית הנתיבים המרכזית
├── pages/                # עמוד אחד לכל נתיב, דק ככל האפשר: מרכיב רכיבים מ-features
├── features/             # קוד לפי תחום (narratives וכו'): רכיבים, API, טיפוסים
├── components/           # רכיבים משותפים שלא שייכים לתחום מסוים (layout, כפתורים...)
├── lib/                  # פונקציות עזר טהורות, בלי React
├── assets/               # אייקונים ותמונות שהורדו מ-Figma
├── styles/               # tokens.css (טוקנים) ו-global.css
└── test/                 # setup ו-helpers לבדיקות
```

הייבוא הוא דרך ה-alias `@/` שמצביע על `src/`, למשל `import { paths } from '@/routes/paths'`.

## מוסכמות

- **שפה וכיוון:** הממשק בעברית וב-RTL (`<html lang="he" dir="rtl">`). ב-CSS משתמשים ב-logical properties (`margin-inline-start`, `padding-inline`, `inline-size`) ולא ב-`left`/`right`.
- **narrative מול התראה:** בקוד, ב-API ובשמות קבצים הישות נקראת `narrative`. בטקסט שהמשתמש רואה כותבים ״התראה / התראות״.
- **שמות:** רכיבים ב-`PascalCase` (`NarrativesTable.tsx`), תיקיית רכיב בשם הרכיב, hooks ב-`useCamelCase`, תיקיות שאינן רכיב ב-`kebab-case`. רק named exports, בלי `export default`.
- **רכיב = תיקייה:** `Component.tsx`, `Component.module.css`, `Component.test.tsx` ו-`index.ts` שמייצא את ה-API הציבורי. ראו `components/layout/Navbar/` כדוגמה.
- **איפה רכיב נמצא:** שייך לתחום אחד? אז ב-`features/<תחום>/components/`. משותף לכמה תחומים? אז ב-`components/`. עמוד לא מכיל לוגיקה משלו.
- **עיצוב:** רק CSS Modules ורק דרך הטוקנים ב-`styles/tokens.css`. בלי צבעים או גדלי פונט קשיחים בקוד. ערך שחסר ב-Figma לא ממציאים: מבקשים מהמעצב.
- **נגישות:** משתמשים באלמנטים סמנטיים (`<nav>`, `<button>`, `<main>`) וב-ARIA רק כשאין אלמנט מתאים.

## הוספת נתיב

1. יוצרים עמוד: `src/pages/<name>/<Name>Page.tsx`.
2. מוסיפים את הנתיב ל-`paths` ב-`src/routes/paths.ts`.
3. רושמים אותו ב-`children` ב-`src/routes/routes.tsx`.
4. אם הוא צריך להופיע ב-Navbar, מוסיפים אותו ל-`navItems` באותו קובץ. ה-Navbar קורא משם.

## כתיבת בדיקה

הבדיקה יושבת ליד הרכיב (`Component.test.tsx`). בודקים מה שהמשתמש רואה ועושה: שאילתות לפי role וטקסט (`getByRole`, `getByText`) ולא לפי class. אינטראקציות עוברות דרך `userEvent`. רכיב שמשתמש בקישורים או ב-hooks של הנתב מרנדרים עם `renderWithRouter` מ-`@/test/renderWithRouter`.

הדוגמה המלאה: `src/components/layout/Navbar/Navbar.test.tsx`.

## משיכת עיצוב מ-Figma

- הקובץ: ״מדור פרנל״. **העמוד שלנו: ״מערכת שו״ב״** (node `0:1`): https://www.figma.com/design/kk7LQbGpv8rm9OAYr7fTG8?node-id=0-1
- שאר העמודים בקובץ שייכים לצוותים אחרים. לא עורכים אותם ולא מממשים מהם.
- **ב-Dev Mode** בוחרים Frame ורואים בפאנל צבעים, פונטים ומידות. מעתיקים מהם רק ערכים שכבר קיימים ב-`tokens.css`. ערך חדש מוסיפים קודם לטוקנים, עם הערה מאיזה node הוא הגיע.
- **עם Claude Code** (שרת ה-MCP של Figma): מעתיקים את הקישור ל-Frame (״Copy link to selection״) ומבקשים לממש אותו. הקוד שחוזר הוא רפרנס בלבד: ממירים אותו ל-CSS Modules ולטוקנים שלנו, ובלי מיקום אבסולוטי.
- **אייקונים ותמונות** מורידים מ-Figma ל-`src/assets/`. לא מציירים אותם מחדש ולא מחליפים אותם באייקון ״דומה״.
- כרגע אין ב-Figma auto-layout ואין variables, ולכן המרווחים ב-`Navbar.module.css` נמדדו ממיקומים. כשהמעצב יוסיף variables, הם יהפכו לטוקנים.
