# Fresnel mobile (`mobile/`)

אפליקציית React Native (Expo) ל-Android ול-iOS, לניהול אירוע תודעתי מהטלפון. התיקייה של **צוות Marconi** במונורפו של מדור Fresnel (תמונת מצב).
עונים בעברית. מזהים, קוד ו-commits באנגלית.
**לא ממציאים:** שדה, endpoint או התנהגות שלא מופיעים כאן, ב-`db/1.ddl.sql`, בקוד של `api/` או באפיונים מסומנים כשאלה פתוחה. לא מנחשים.
**Expo SDK 58.** ה-API של Expo משתנה בין גרסאות. לפני קוד שנוגע ב-Expo, קוראים את `AGENTS.md` ואת התיעוד של v58, ולא סומכים על הזיכרון.

> **עדכון 18.10 (ערב):**
> - **אין socket.** כל הרענון במשיכה מחזורית (polling) עם TanStack Query. אין Gateway בשרת ואין socket באפליקציה. פירוט בסעיף "זמנים".
> - **אין mock-server.** עובדים מול `api/` אמיתי שרץ מקומית, מעל ה-DB המקומי: `db/1.ddl.sql` (ה-schema) ו-`db/2.dml.sql` (נתוני פיתוח). פירוט בסעיף "בנייה והרצה".
> - **ה-routes שלנו ב-`api/`:** `timeline`, `items`, `stats`, התחקור, `/devices`, ושליחת ה-Push (שמתחברת ל-`POST /events` של שחר). כל השאר של עדן ושחר.
> - **כניסה דרך מיראז׳:** צוות מיראז׳ (נועה הרשקו) חושף עמוד כניסה (iframe בווב, WebView אצלנו) שכבר מתממשק ל-Keycloak ומחזיר משתמש עם הפרטים שלו. ⬜ החוזה.
> - **האימות והגזרה בשרת של שחר** ([14]). אין לנו Guard ואין `/me`.
> - **החוזה לפי הקוד הקיים ב-`api/`:** JSON ב-camelCase, דפדוף ב-`page`/`pageSize`, וחיפוש ב-`search`.
> - **המשימות ב-GitHub** (#53 עד #72), משימה לכל פיצ׳ר, מחולקת לפרונט ובק, בארבעה מסלולים.

> **עדכון 18.10 (schema 0.7):** `device_token` כבר ב-`db/1.ddl.sql`, עם CHECK על צורת טוקן Expo. אין בה גזרה: השולח מוצא במיראז׳ את משתמשי הגזרה, ואת הטלפונים שלהם לפי `user_id`.

> **עדכון 16.10:** Push עובר דרך **שירות ה-Push של Expo**. קוד אחד ל-Android ול-iOS: `getExpoPushTokenAsync` באפליקציה ו-`expo-server-sdk` בשרת. **בלי firebase-admin, בלי `apns2` ובלי מפתחות Push בשרת.**

> **עדכון 15.10 (אחה״צ):** Oracle במקום אקינטור (WebView). אין אמת/תרגילית ואין אירועים סגורים במובייל. מחיקת פעולה של המבצע בלבד. מבזקים מה-Data Lake (טל בן שושן). מיראז׳ מחזיר מזהה וגזרה אחת. אין חסמים בפיירוול.

## המערכת בשורה אחת
המדור מחליף את קבוצת הוואטסאפ של הדוברות:
1. צוות אנומליות (דורון) שולח נרטיבים. השו״ב שומר כל אחד בטבלת `narrative`. נרטיב עם `is_anomaly = true` הוא אנומליה.
2. משתמש בשו״ב פותח אירוע על נרטיב (השו״ב חוסם פתיחה על נרטיב בלי זירה). צוות הסימולציות (אושר) יכול גם לשלוח אירוע עם `is_simulation = true` על נרטיב קיים. **המובייל לא מציג אותם.**
3. הטלפונים של הגזרה מקבלים Push (רק על אירוע אמיתי).
4. בטלפון: תמונת מצב (פרטים, נתונים מצטברים, מקורות עיקריים), Oracle, מקורות מידע, ותיעוד פעולות (הוספה ומחיקה של פעולה שלי).
5. האירוע נסגר עם סיכום (מהווב או מהטלפון), נעלם מהטלפון ועובר לסגורים בווב. צוות התחקור (ניתאי) מקבל אותו דרך API שלנו.

## המונורפו
`https://github.com/shoham-cohen/fresnel`, branch `dev`. המשימות ב-GitHub Issues (תגיות `MARCONI`, ו-`NATIVE CLIENT` או `SERVER`).

| תיקייה | מה | בעלים |
|---|---|---|
| `api/` | `fresnel-api`, backend משותף ב-NestJS עם TypeORM. כל צוות במודול שלו ב-`api/src/modules/`, ו**`mobile`** שלנו | כל צוות על המודול שלו |
| `web-shob/` | שו״ב (React) | שחר צברי (PALANTIR) |
| `web-vandamme/` | ואן דאם, ניהול אירוע בווב (React) | עדן טולקין |
| `mobile/` | **התיקייה הזו** | צוות Marconi (בן נתנזון) |
| `db/` | `1.ddl.sql` (schema `fresnel`, גרסה 0.7) ו-`2.dml.sql` (נתוני פיתוח) | ואן דאם. `device_token` שלנו, וכל שינוי שלנו עובר review של עדן |

- כל job ב-CI רץ רק כשמשהו השתנה בתיקייה שלו. CODEOWNERS: כל צוות מאשר את התיקייה שלו.
- שינוי ב-DB רק דרך `db/`, עם review של עדן.

## מושגים
- **נרטיב (`narrative`):** מה שדורון שולח, נשמר על ידי השו״ב. `is_anomaly = true` היא **אנומליה**. ממנו מגיעים כותרת (`title`), תיאור (`summary`), זירה (`arena`) וזמן זיהוי (`detected_at`) של האירוע.
- **אירוע (`event`):** נפתח על נרטיב. אין אירוע בלי נרטיב ואין אירוע ידני. לכל היותר אירוע אמיתי אחד פתוח לנרטיב. **`event` ו-`narrative` הן שתי טבלאות נפרדות, בלי `event_view`.** ה-API מחבר ביניהן.
- **סטטוס:** `open` (נפתח ולא נגעו בו) → `in_progress` (תועדה לפחות פעולה אחת, תגית "בטיפול") → `closed` (נסגר עם סיכום). פתיחה מחדש רק מהווב.
- **תרגילית (`is_simulation`):** אירוע ששלח אושר על נרטיב קיים, עם `event_id` חדש. **בווב בלבד. במובייל לא ב-MVP.**
- **מבזק (item):** פורמט `item.v1`. **לא נשמר אצלנו**, אפילו לא המזהה. נשלף בכל הצגה מה-**Data Lake** (Artemis, צוות טל בן שושן) לפי `narrative_id`.
- **נתונים מצטברים:** סה״כ פרסומים, צפיות ושיתופים, ומקורות עיקריים. נשלפים בכל הצגה ולא נשמרים. ⬜ המקור המדויק (Data Lake או חישוב מהמבזקים).
- **גזרה:** `IL` / `ARAB` / `INTL`. גזרת האירוע מהנרטיב. גזרת המשתמש **ממיראז׳** (מזהה + גזרה אחת). כל משתמש רואה רק את הגזרה שלו. **זו ההרשאה היחידה במערכת.**
- **פעולה:** תיעוד של משהו שכבר בוצע. סוג מהבנק (`action_type`), כותרת עד 100 (חובה, לא ריקה), תיאור עד 500 (רשות). **מחיקה רכה, רק על ידי מי שביצע.**
- **Oracle:** מערכת חיצונית (מודל שפה) שמוטמעת בתמונת המצב. אנחנו לא שולחים לה בקשות ולא שומרים שיחות. במובייל: WebView.

## מה המובייל עושה (MVP, ה׳ 22.10)
- **Push:** רק על אירוע **אמיתי** חדש, לכל משתמשי הגזרה.
- **מסכים** (פירוט ב-`team-spec.md`):
  - **כניסה:** עמוד הכניסה של מיראז׳ ב-WebView.
  - **בית:** רשימת אירועים פתוחים (כולל "בטיפול"), חיפוש לפי כותרת, ואייקון פרופיל בכותרת. **בלי לשונית סגורים ובלי מתג אמת/תרגילית.**
  - **אירוע:** כותרת "ניהול אירוע", חזרה, ושלוש לשוניות: **תמונת מצב** (ברירת מחדל, כולל Oracle ב-WebView), **פעולות שבוצעו**, **מקורות מידע**.
  - **גיליונות:** הוספת פעולה, סגירת אירוע, אישור מחיקת פעולה.
  - **פרופיל** לקריאה בלבד.
- **לא ב-MVP:** אמת/תרגילית, אירועים סגורים, קבצים, עריכת פרופיל, עריכת פעולה, פתיחה מחדש.
- **ה-Figma הוא כיוון, לא חוזה.** כשיש סתירה, האפיון קובע. Figma: `https://www.figma.com/design/WhkwpjcwF6Uc21D1yOcUNs` (node 43-188).

תסריט ההדגמה:
1. אירוע נפתח בשו״ב.
2. Push מגיע לטלפון, ולחיצה פותחת את תמונת המצב.
3. בטלפון: פרטים, נתונים מצטברים, מקורות עיקריים, ואז לשונית המקורות.
4. שאלה ל-Oracle מתוך תמונת המצב.
5. פעולה מהטלפון: האירוע עובר ל"בטיפול", והפעולה מופיעה בציר בווב. מחיקה שלה (לחיצה ארוכה) נעלמת גם בווב.
6. סגירה מהטלפון עם סיכום: האירוע נעלם מהטלפון ומופיע בסגורים בווב.

## מבנה
```
mobile/
  src/
    app/                              # routes בלבד (expo-router). כל קובץ הוא מסך
      _layout.tsx                     # providers (Query, Auth) ו-Stack.Protected לפי התחברות
      login.tsx                       # כניסה (WebView של מיראז׳)
      (app)/_layout.tsx               # Stack, כותרות, אייקון פרופיל
      (app)/index.tsx                 # בית: פתוחים, חיפוש
      (app)/profile.tsx
      (app)/events/[id]/_layout.tsx   # בורר לשוניות + Slot
      (app)/events/[id]/index.tsx     # תמונת מצב + Oracle (WebView)
      (app)/events/[id]/actions.tsx   # ציר, הוספה, מחיקה, סגירה
      (app)/events/[id]/sources.tsx   # מקורות מידע
    features/                         # קומפוננטות ו-hooks לפי תחום
      events/  snapshot/  actions/  sources/  oracle/  profile/
    components/                       # משותפות: Screen, Sheet, EventTabs, ומצבי מסך
    api/                              # apiFetch, queryClient, queryKeys, polling, טיפוסים
    auth/                             # AuthProvider, useAuth
    notifications/                    # Push
    hooks/                            # hooks משותפים
    constants/labels.ts               # תוויות בעברית
    config.ts                         # משתני EXPO_PUBLIC_*
    theme.ts                          # צבעים, ריווח, גדלים
  app.config.ts  eas.json  .env.example
api/src/modules/mobile/               # שלנו: timeline, items, stats (Data Lake), debrief, devices, push
db/1.ddl.sql  db/2.dml.sql            # ה-schema ונתוני הפיתוח. device_token כבר בפנים
```
- **`src/app/` מכיל רק routes.** קומפוננטות, hooks ולוגיקה נמצאים מחוץ לו, ונכנסים דרך `@/` (למשל `@/features/actions/...`).
- **מסך ב-`src/app/` דק:** מרכיב קומפוננטות מ-`src/features/<תחום>/`. כל חייל עובד בעיקר בתיקיית התחום שלו.
- **בורר הלשוניות** (`EventTabs`) הוא קומפוננטה שלנו עם `router.replace`, **בלי** material-top-tabs.
- **גיליונות** בנויים על `Sheet` (Modal של React Native), לא routes.
- **כניסה בפיתוח:** `EXPO_PUBLIC_AUTH_BYPASS=true` מדלג על מסך הכניסה, עם משתמש קבוע מה-seed.
- **הספריות הנייטיב כבר בשלד:** `react-native-webview`, `expo-notifications`, `expo-auth-session`, `expo-secure-store`, `expo-web-browser`, `expo-crypto`, `expo-localization`. ה-dev client נבנה איתן פעם אחת.
- **`src/realtime/` ו-`socket.io-client` כבר לא בשימוש** (אין socket). לא כותבים בהם קוד.

## סטאק
- **אפליקציה:** Expo SDK 58 (dev build, **לא Expo Go**), TypeScript, expo-router, TanStack Query, expo-notifications, expo-secure-store, react-native-webview.
- **טיפוסים:** ב-`src/api/types.ts`, לפי סעיף החוזים כאן. ⬜ אין OpenAPI ב-`api/` (אין `@nestjs/swagger`). כשיתווסף, עוברים ל-openapi-typescript.
- **תוויות בעברית:** סטטוס, זירה, חומרה וסוג רשומה בלוג נשמרים ב-DB כקוד באנגלית. התווית בעברית רק ב-`src/constants/labels.ts`. בנק הפעולות מגיע עם `labelHe` מהשרת.
- **שרת (`api/`):** NestJS על Express, TypeORM מעל PostgreSQL, `ValidationPipe` גלובלי ו-DTO עם `class-validator`. קידומת `/api`. כללים: `react-native-standards.md` סעיף 12.
- **בשרת, ל-Push:** `expo-server-sdk` בלבד. **אין firebase-admin ואין `apns2`.**

## חוזים

**כל קריאה מהטלפון שולחת header `X-Client: mobile`.** השרת כותב אותו ל-`event_log.client` (ברירת המחדל ב-DB היא `web`). זה בתוך `apiFetch`.
**כללי החוזה (לפי הקוד הקיים ב-`api/`):** כל ה-routes תחת `/api`. JSON ב-camelCase (`eventId`, `createdAt`). דפדוף ב-`page` (מ-1) ו-`pageSize`, חיפוש ב-`search`, ורשימה מחזירה `{ items, total, page, pageSize }`.

### מה אנחנו צורכים
| קריאה | מה | בעלים |
|---|---|---|
| `GET /api/events?isSimulation=false&search=&page=&pageSize=20` | הפתוחים (`open` + `in_progress`), מהחדש לישן. מחזיר `{ items: [{ eventId, title, status, severity, createdAt }], total, page, pageSize }`. **המובייל תמיד שולח `isSimulation=false`.** ⬜ חסר `isAnomaly` | עדן (VD-03, ב-dev) |
| `GET /api/events/:id` | כרטיס האירוע, כולל שדות הנרטיב (`summary`, `arena`, `detectedAt`, `isAnomaly`), `createdBy`, `updatedAt` ו-`status`. ⬜ עוד לא ב-dev | עדן (VD-03) |
| `GET /api/action-types` | הבנק הפעיל: `[{ code, labelHe, active }]` | עדן (ב-dev) |
| `POST /api/events/:id/actions` | `{ actionType, title, description? }`. מעביר `open` ל-`in_progress`. 409 על אירוע סגור. ⬜ עוד לא ב-dev | עדן (VD-05) |
| `DELETE /api/actions/:id` | מחיקה רכה. 403 אם המשתמש לא המבצע ⬜ | עדן (VD-05) |
| `POST /api/events/:id/close` | `{ closureSummary }` חובה, בלי מגבלת אורך. 409 אם כבר סגור | עדן (VD-04) |
| `POST /api/events` | פתיחת אירוע. אחרי commit של אירוע אמיתי חדש קורא ל-`PushService.notifyNewEvent` שלנו | שחר ([07]) |
| אימות וגזרה | המשתמש המאומת (מזהה וגזרה) בכל route, ו-403 על אירוע מגזרה אחרת. ⬜ איך זה נחשף ל-routes | שחר ([14]) |

**Oracle:** לא route. WebView לכתובת של Oracle עם הקשר האירוע. ⬜ כתובת, פרמטרים ואימות.
**כניסה:** לא route שלנו. עמוד הכניסה של מיראז׳ ב-WebView מחזיר משתמש. ⬜ החוזה.

### ה-routes שלנו (מודול `mobile` ב-`api/`)
| route | מה | משימה |
|---|---|---|
| `GET /api/events/:id/stats` | `{ posts, views, shares, topSources: [{ platform, count }], partial, asOf }`. `topSources` עד 3. `null` לשדה חסר, אף פעם לא 0 | MAR-06 |
| `GET /api/events/:id/items?search=&page=&pageSize=20` | `{ items: item.v1[], total, page, pageSize }`, מהחדש לישן, מה-Data Lake לפי `narrative_id` | MAR-09 |
| `GET /api/events/:id/timeline` | `[{ kind, at, actorId, action? }]`, מהחדש לישן. `kind` הוא `action`, `event_created` או `event_reopened`. `action` הוא `{ actionId, actionType, actionTypeLabel, title, description, performedBy }`. בלי פעולות מחוקות | MAR-11 |
| `GET /api/debrief/events?closedFrom=&page=&pageSize=` | הצעה: אירועי אמת סגורים עם שדות הנרטיב, חומרה, מי פתח וסגר, `closureSummary` והציר. ⬜ מול ניתאי | MAR-16 |
| `POST /api/devices`, `DELETE /api/devices/:token` | `{ platform, pushToken }`. upsert על `push_token` ועדכון `last_seen_at`. טוקן שאינו `ExponentPushToken[...]` מחזיר 400. `user_id` מהמשתמש המאומת בלבד | MAR-17 |
| `PushService.notifyNewEvent(eventId)` (פנימי) | משתמשי הגזרה ממיראז׳, הטלפונים שלהם לפי `user_id`, ושליחה דרך Expo | MAR-19 |

- **Data Lake:** `stats` ו-`items` עוברים דרך ממשק אחד, `DataLakeClient`. עד שה-route של טל בן שושן מוגדר, המימוש מקומי מקובץ fixtures ב-`api/`.
- **גזרה:** כל route שלנו על אירוע מחזיר 404 על אירוע שלא קיים ו-403 על אירוע מגזרה אחרת, לפי מנגנון האימות של שחר. עד שהוא ב-dev, משתמש קבוע מה-seed.

### ממשקים משותפים באפליקציה (קבועים מראש, כדי שאף אחד לא יחכה)
| מה | איפה | משימה |
|---|---|---|
| `apiFetch<T>(path, init?)` ו-`ApiError { status }` | `src/api/client.ts` | MAR-01 |
| מפתחות שאילתות: `['events', search]`, `['event', id]`, `['timeline', id]`, `['stats', id]`, `['items', id, search]`, `['action-types']` | `src/api/queryKeys.ts` | MAR-01 |
| `POLL` (זמני המשיכה) | `src/api/polling.ts` | MAR-01 |
| `Loading`, `EmptyState`, `ErrorState`, `Tag` | `src/components/` | MAR-02 |
| `useAuth()` עם `user { id, arena, name?, role? }`, `getAccessToken()` ו-`signOut()` | `src/auth/` | MAR-03 |
| `<OracleView eventId narrativeId />` | `src/features/oracle/` | MAR-08 |
| `<CloseEventButton eventId />` עם הגיליון | `src/features/actions/close/` | MAR-15 |
| `usePushStatus()` | `src/notifications/` | MAR-18 |

עד שממשק נכנס, עובדים מול fixtures ב-`src/features/<תחום>/fixtures.ts`, לפי החוזים למעלה.

### זמנים (במקום socket)
| מה | איך |
|---|---|
| רשימה, כרטיס, ציר | משיכה כל **15 שניות** כשהמסך בפוקוס |
| `stats`, `items` | משיכה כל **60 שניות** כשהמסך בפוקוס |
| חזרה לחזית | רענון של המסך הפתוח (`focusManager` מחובר ל-`AppState`) |
| אחרי פעולה מהטלפון | `invalidateQueries` למפתחות שהשתנו, מיד |
| הכול | pull-to-refresh ידני |

- משיכה מחזורית רק ב-`refetchInterval` של TanStack Query, לא ב-`setInterval`.
- אירוע שנסגר מהווב: נעלם מהבית במשיכה הבאה. אם המסך שלו פתוח, הכרטיס רואה `closed`, מציג "האירוע נסגר" וחוזר לבית.

## DB (PostgreSQL, schema `fresnel`, גרסה 0.7, לא סופית)
- **`narrative`** (של השו״ב): `narrative_id` (text), `title`, `summary`, `is_anomaly`, `arena` (יכול להיות `NULL`), `location_name`, `detected_at`, `embedding`, `payload`, `received_at`.
- **`event`:** `event_id`, `narrative_id`, `severity` (`low`/`medium`/`high`/`critical`), `status` (`open`/`in_progress`/`closed`), `is_simulation`, `created_by`, `created_at`, `updated_at`, `closed_at`, `closed_by`, `closure_summary` (בלי מגבלת אורך).
  - סגור ⇔ `closed_at`, ואז `closed_by` ו-`closure_summary` חובה.
  - unique חלקי: אירוע אמיתי לא סגור אחד לנרטיב. תרגילית לא בכלל.
- **`action_type`:** `code`, `label_he`, `active`. הבנק (טיוטה, לאישור הלקוח):

  | `code` | `label_he` |
  |---|---|
  | `official_response` | הודעת דו"צ |
  | `consultation` | התייעצות |
  | `reporter_contact` | תיאום עם כתב |
  | `external_contact` | פנייה לגורם חיצוני |
  | `field_collection` | איסוף מידע מהשטח |
  | `source_analysis` | ניתוח מקורות |
  | `fact_check` | בדיקת אמינות מידע |
  | `monitor` | מעקב אחר התפתחות |
  | `other` | אחר |
- **`action`:** `action_id`, `event_id`, `action_type`, `title` (≤100, חובה), `description` (≤500, רשות), `performed_by`, `performed_at`, `updated_at`, `deleted_at`/`deleted_by` (מחיקה רכה, **גם מהמובייל**, רק המבצע).
- **`event_log`:** append-only. `kind`, `actor_id`, `from_value`, `to_value`, `details`, `client` (`web`/`mobile`/`system`), `at`.
- **`device_token` (שלנו):** `device_id`, `user_id`, `platform` (`android`/`ios`), `push_token` (unique, עם CHECK לצורה `ExponentPushToken[...]`), `created_at`, `last_seen_at`. אינדקס על `user_id`. **אין גזרה.** טוקן שנכשל נמחק.
- **לא נשמר אצלנו:** מבזקים, נתונים מצטברים, שיחות Oracle, משתמשים, שמות, תפקידים וגזרות (מיראז׳).
- **נתוני פיתוח (`db/2.dml.sql`):** 110 נרטיבים, אירועי אמת (פתוח, בטיפול וסגור) ותרגילית, פעולות (אחת מחוקה), רשומות `event_log` וטלפונים רשומים ב-`device_token`. מנקה את הטבלאות בכל הרצה. **רק ל-DB המקומי.**

## Oracle (WebView)
- `react-native-webview` כבר בשלד. ספרייה נייטיב: שינוי בה דורש בנייה מחדש של ה-dev client.
- הכתובת מ-`config.oracleUrl` (`EXPO_PUBLIC_ORACLE_URL`), לא קשיחה. הקשר האירוע (`eventId`, `narrativeId`) עובר כמו ב-iframe של הווב (VD-18). ⬜ הפרמטרים.
- `originWhitelist` רק לדומיין של Oracle. קישור החוצה נפתח בדפדפן (`onShouldStartLoadWithRequest` + `Linking.openURL`).
- מצב טעינה, ושגיאה עם "נסה שוב" (`onError`, `onHttpError`).
- **אין טוקן ב-URL.** ⬜ איך Oracle מזהה את המשתמש ב-WebView.
- **הגזרה:** הטלפון פונה ל-Oracle ישירות, ולא דרך `api/`. Oracle צריך לאכוף את הגזרה בעצמו. ⬜
- השיחה לא נשמרת. מעבר לשונית או יציאה מהאירוע טוענים את ה-WebView מחדש.

## כניסה (מיראז׳)
- צוות מיראז׳ (נועה הרשקו) אחראי על ההרשאות ומסווג כל משתמש לפי גזרה (ישראל, מדינות ערב, עולם).
- הם חושפים עמוד כניסה (iframe בווב, WebView אצלנו) שכבר מתממשק ל-Keycloak, ומחזיר משתמש עם הפרטים שלו. אנחנו עוברים רק דרכו.
- `AuthProvider` שומר את ההתחברות ב-`expo-secure-store` בלבד, וחושף `user`, `getAccessToken()` ו-`signOut()`. 401 מהשרת מחזיר לכניסה.
- ⬜ כתובת העמוד, איך הוא מחזיר לאפליקציה את המשתמש והטוקן, מה השרת מצפה לקבל (מול שחר, [14]), והאם שם ותפקיד מגיעים.

## Push
- **דרך שירות ה-Push של Expo.** Expo מעביר את ההתראה ל-FCM ב-Android ול-APNs ב-iOS. **קוד אחד לשתי הפלטפורמות**, באפליקציה ובשרת.
- **טוקן באפליקציה:** `Notifications.getExpoPushTokenAsync({ projectId })`, כש-`projectId` נלקח מ-`Constants.expoConfig?.extra?.eas?.projectId`. הטוקן נראה כמו `ExponentPushToken[...]`, ונשלח ל-`POST /api/devices` אחרי הכניסה. **לא** משתמשים ב-`getDevicePushTokenAsync`.
- **למי שולחים:** משתמשי הגזרה של הנרטיב ממיראז׳, ואז כל הטוקנים שלהם מ-`device_token` לפי `user_id`. ⬜ איך שואלים את מיראז׳ על כל משתמשי גזרה.
- **מתי:** שחר קורא ל-`PushService.notifyNewEvent(eventId)` אחרי commit של פתיחת אירוע **אמיתי** חדש ב-`POST /api/events`. לא על תרגילית ולא על אירוע קיים שהוחזר. כשל בשליחה לא מכשיל את הפתיחה.
- **שליחה מהשרת:** `expo-server-sdk`. `chunkPushNotifications` ואז `sendPushNotificationsAsync`. אין מפתחות Push בשרת.
  ```ts
  const expo = new Expo();
  const messages = tokens.filter(Expo.isExpoPushToken).map(to => ({
    to,
    title: 'אירוע חדש בגזרה',
    data: { event_id },
    channelId: isAnomaly ? 'anomaly' : 'narrative',
    sound: isAnomaly ? 'default' : null,
  }));
  for (const chunk of expo.chunkPushNotifications(messages)) {
    const tickets = await expo.sendPushNotificationsAsync(chunk);
    // ticket עם details.error === 'DeviceNotRegistered' → מחיקת הטוקן מ-device_token
  }
  ```
- **אין תוכן ב-Push.** הטקסט הוא "אירוע חדש בגזרה", וה-payload כולל רק `event_id`. בדיקת receipts לא ב-MVP.
- **ניווט:** `events/[id]`, לשונית תמונת מצב. פתיחה מאפס: `getLastNotificationResponseAsync`.
- **שני channels ב-Android לפי `is_anomaly`:** `anomaly` (עם צליל) ו-`narrative` (שקט). השרת שולח `channelId`.
- **מפתחות (פעם אחת, בן):** פרויקט EAS. ה-`projectId` נכנס כקבוע `EAS_PROJECT_ID` בראש `app.config.ts`. `google-services.json` ב-git (לא סוד). מפתח FCM V1 ומפתח APNs (`.p8`) רק ב-EAS (`eas credentials`). החיילים לא צריכים חשבון Expo.
- **פיתוח:**
  - **מסך וניווט:** התראה מקומית, `scheduleNotificationAsync({ content: { title, data: { event_id } }, trigger: null })`. ה-handler של הלחיצה זהה ל-Push אמיתי.
  - **טוקן ו-channels:** כלי הבדיקה של Expo (`https://expo.dev/notifications`) או `curl` ל-`https://exp.host/--/api/v2/push/send`.
  - **השולח:** `notifyNewEvent` נבדק ישירות עם `event_id` מה-seed, לפני החיבור לשחר.
  - **סימולטור iOS:** `xcrun simctl push`.

## תשתית
- **ענן:** AWS. לכל יחידה חשבון נפרד ו-cluster אחד של EKS.
- **CI/CD:** push → CI → Registry → Argo CD → EKS. סודות דרך Sealed Secrets.
- **DB:** PostgreSQL על CloudNativePG, עם PostGIS ו-pgvector.
- **סביבות:** Prod ו-PreProd לכל מדור, עם DB נפרד. שמות ה-Namespaces ⬜.
- **זהות:** Keycloak עם SSO מול AD, דרך מיראז׳. גזרה ממיראז׳.
- **רשת:** אין חסמים בפיירוול ל-Expo Push (`exp.host`), FCM, APNs ולסביבת הבנייה. ⬜ האם טלפון אמיתי מגיע ל-Ingress הפרטי, או שההדגמה על אמולטורים.

## בנייה והרצה
- **דרישות:** **Node 22.13 ומעלה** (Expo SDK 58 לא רץ על Node 20, ראו `.nvmrc`), JDK 17, Android SDK, `ANDROID_HOME`, Docker Desktop. ב-Mac גם Xcode ו-CocoaPods.
- **DB מקומי (מהשורש):** `cp .env.example .env`, ואז `docker compose up -d` (פורט 5433). בהרמה הראשונה רצים `db/1.ddl.sql` ואז `db/2.dml.sql`. לנתונים טריים: `docker compose down -v` ואז `up -d`.
- **השרת (מ-`api/`):** `npm install` ואז `npm run start:dev`. רץ על פורט 3000 (`API_PORT`), וקורא את `DATABASE_URL` מה-`.env` שבשורש.
- **האפליקציה (מ-`mobile/`):** `npm install`, `cp .env.example .env`, ואז `npm run android`. ב-`.env`: `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000` לאמולטור Android (הכתובת של המחשב מתוך האמולטור), ו-`EXPO_PUBLIC_AUTH_BYPASS=true`.
- **dev client:** נבנה פעם אחת לכל פלטפורמה. אחריו `npm start`, ושינויי JS נטענים בלי בנייה. בונים מחדש רק אחרי שינוי ב-`app.config.ts` או ספרייה נייטיב.
- **Android:** `npm run android`. האמולטור מתמונת **Google Play**, אחרת אין Push.
- **iOS:** רק על Mac. `npm run ios` (או `npx expo run:ios --device`). Push אמיתי דרך Expo נבדק על אייפון.
- **לפני MR:** `npm run lint` ו-`npm run typecheck` ב-`mobile/`, ו-`npm run lint` ב-`api/`.
- `android/` ו-`ios/` נוצרים בבנייה ולא נכנסים ל-git. לא עורכים אותם ידנית, רק דרך `app.config.ts`.

## כללי קוד
- **RTL מהיום הראשון:** `supportsRTL` ו-`forcesRTL` ב-plugin של `expo-localization` (`app.config.ts`).
- **מצבי מסך:** לכל מסך מצב טעינה, ריק ושגיאה.
- **שדות חסרים:** שדה ריק מוצג "—", לא 0. סכום עם `partial: true` מסומן "חלקי".
- **רק אמת:** כל רשימה נמשכת עם `isSimulation=false`. אין קוד של תרגילית במובייל.
- **מחיקת פעולה:** הכפתור והלחיצה הארוכה מופיעים רק כש-`performedBy` = `useAuth().user.id`. השרת אוכף בכל מקרה.
- **אבטחה:** אין באפליקציה סודות, כתובות פנימיות קשיחות או טוקנים בלוג או ב-URL. הכתובות מ-`src/config.ts`. מפתחות FCM ו-APNs רק ב-EAS. הטלפון לא פונה לדורון או ל-Data Lake ישירות, רק דרך `api/`. החריגים: עמוד הכניסה של מיראז׳ ו-Oracle, ב-WebView.
- **הרשאות נאכפות בשרת.** כל route שלנו מגיע עם בדיקה שמוכיחה:
  - משתמש `ARAB` לא רואה את המבזקים, הנתונים והציר של אירוע `IL`.
  - משתמש לא מוחק טוקן של משתמש אחר.
- **ספרייה נייטיב חדשה** דורשת אישור של בן ובנייה מחדש של ה-dev client. מתקינים תמיד עם `npx expo install`.
- **Git:** `feature/<MAR-id>-short-name` מ-`dev` (למשל `feature/MAR-05-home`). כל שינוי דרך PR עם review. אין push ישיר ל-`dev` או ל-`main`. כל route מגיע עם בדיקה.
- **בק משותף:** שינוי ב-route של צוות אחר או ב-`db/` עובר review של הבעלים.

## התממשקויות
| מערכת / צוות | איש קשר | מה עובר |
|---|---|---|
| אנומליות | דורון קבאלה | נרטיבים לשו״ב |
| Data Lake (Artemis) | טל בן שושן | מבזקים `item.v1` (ונתונים?) לפי `narrative_id`, ל-`items` ו-`stats` שלנו. route ⬜ |
| סימולציות | אושר | אירועי תרגילית על נרטיב קיים. ווב בלבד |
| תחקור | ניתאי שער | אירועים סגורים עם סיכום וציר, מ-API שלנו. פורמט ⬜ |
| שו״ב | שחר צברי | `narrative`, `POST /events` (קורא לשולח ה-Push שלנו), אימות וגזרה ([14]) |
| ואן דאם | עדן טולקין | אירועים, פעולות (כולל מחיקה), סגירה, `db/` |
| Oracle | ⬜ | WebView בתמונת המצב |
| Expo Push | בן (חשבון EAS) | Push ל-Android ול-iOS, מעל FCM ו-APNs |
| מיראז׳ | נועה הרשקו | עמוד הכניסה (מעל Keycloak), משתמש עם גזרה, ומשתמשי גזרה לשולח ה-Push ⬜ |
| Network, Identity & Access | עידו אלון | Keycloak, גישה מטלפון |
| Platform & Delivery | רון להב | Namespaces, Pipeline, Ingress |
| Data & AI | ליה אלפנדרי | schema `fresnel` |
| Observability | תמר חאמי | דשבורד מצב והתראות |
| סייבר | נגה בנו, SOC: אומי חרמש | לוגים ל-SOC, בדיקות אבטחה |
| CTO | ניב שיין | ארכיטקטורה וסטנדרטים |

## שאלות פתוחות: לא לנחש
- ⬜ **כניסה (מיראז׳):** כתובת העמוד, איך הוא מחזיר את המשתמש והטוקן לאפליקציה, מה השרת מצפה לקבל, ושם ותפקיד.
- ⬜ **אימות בשרת (שחר, [14]):** איך המשתמש המאומת והגזרה נחשפים ל-routes שלנו.
- ⬜ **Oracle:** כתובת, פרמטרי ההקשר, זיהוי המשתמש ב-WebView, אכיפת גזרה, התאמה לטלפון ו-RTL, ואיש קשר.
- ⬜ **Data Lake:** route, אימות, `item.v1`, נתונים מצטברים ושיתופים. עד אז fixtures מקומיים.
- ⬜ **Push לפי גזרה:** איך שואלים את מיראז׳ על כל משתמשי גזרה (חוסם את MAR-19).
- ⬜ **עדן:** `isAnomaly` ברשימה, `GET /api/events/:id`, `POST` ו-`DELETE` של פעולות (כולל 403 למי שלא ביצע), ותיאום על `items` ו-`stats` (היו ב-VD-06).
- ⬜ **תחקור:** מה ניתאי צריך (push או pull, שדות, תדירות).
- ⬜ **OpenAPI:** אין `@nestjs/swagger` ב-`api/`, ולכן הטיפוסים ידניים.
- ⬜ **גישה מטלפון אמיתי ל-API.**
- ⬜ **חשבון Apple, Firebase ו-Expo (EAS).**

## מסמכים
- `README.md`: הרצה ופקודות.
- `AGENTS.md`: כללי Expo SDK 58 לסוכני AI.
- `section-spec.md`: אפיון המדור, workflow, DB ו-API.
- `team-spec.md`: אפיון צוות Marconi, מסכים, Push, חלוקה ומסלולים.
- `react-native-standards.md`: איך כותבים קוד.
- `db/1.ddl.sql` במונורפו: ה-DB.
