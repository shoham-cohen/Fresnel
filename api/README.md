# fresnel-api

ה-backend המשותף של המדור (NestJS + TypeScript + TypeORM + PostgreSQL). שו״ב, ואן דאם ומובייל עובדים על אותו שרת ועל אותם מודולים.

## הרצה מקומית
1. ה-DB המקומי רץ מה-root של ה-repo: `docker compose up -d` (פרטים ב-README הראשי).
2. `npm install`
3. `npm run start:dev` – השרת עולה על `http://localhost:3000/api` (או `API_PORT`).

ההגדרות נקראות מה-`.env` שב-root של ה-repo (`DATABASE_URL`).

## מבנה התיקיות
המודולים מחולקים לפי ישות / טבלה, לא לפי צוות. כל endpoint יושב במודול של הישות שהוא מחזיר.

```
api/src/
├── main.ts                 נקודת הכניסה: prefix /api, port
├── app.module.ts           מחבר את כל המודולים
├── database/               חיבור ל-PostgreSQL דרך TypeORM
├── entities/               entity אחת לכל טבלה ב-schema fresnel (המיפוי מ-snake_case ל-camelCase)
├── common/                 קוד משותף לכל המודולים: pipes, filters, guards, קבועים
└── modules/
    ├── health/             GET /api/health
    ├── narratives/         טבלת narrative (השו״ב כותב)
    ├── events/             טבלת event: רשימות, פרטים, פתיחה, סגירה ופתיחה מחדש
    ├── actions/            טבלת action: תיעוד פעולות באירוע
    ├── action-types/       טבלת action_type: בנק הפעולות
    ├── event-log/          טבלת event_log: כתיבה לוג וקריאה לציר הזמן
    └── items/              אייטמים וסטטיסטיקות מדורון (לא נשמרים ב-DB)
```

מה שקיים כרגע: `database/`, `entities/` (כל 5 הטבלאות) ו-`modules/action-types/`. השאר נוצר כשמגיעים למשימה שלו.

## מבנה של מודול
```
modules/actions/
├── actions.module.ts
├── actions.controller.ts   ה-routes בלבד: קורא ל-service ומחזיר תשובה
├── actions.service.ts      הלוגיקה העסקית (למשל: פעולה ראשונה מעבירה את האירוע ל-in_progress), בלי SQL
├── actions.repository.ts   הגישה ל-DB בלבד (TypeORM), בלי לוגיקה
└── dto/                    גוף הבקשות והוולידציה שלהן
```

כללים:
- controller → service → repository. ה-controller לא ניגש ל-repository, והגישה ל-DB נמצאת רק ב-repository.
- service שצריך כמה כתיבות באותה טרנזקציה (פעולה + שינוי סטטוס + event_log) מנהל את הטרנזקציה ומעביר אותה ל-repositories.
- route מקונן נשאר במודול של מה שהוא מחזיר: `GET /api/events/:id/actions` יושב ב-`actions/`.
- מודול שצריך service של מודול אחר מייבא את המודול שלו (`imports`), ולא ניגש לטבלה שלו ישירות.
- שמות שדות ב-JSON ב-camelCase (`labelHe`), ב-DB ב-snake_case. המיפוי נעשה ב-entity (`@Column({ name: 'label_he' })`).
- ה-schema מגיע מ-`db/schema.sql` וה-migrations, לא מה-entities: `synchronize` כבוי. שינוי בטבלה = migration + עדכון ה-entity.
- כל entity חדשה נכנסת לרשימה ב-`entities/index.ts`.
