# Fresnel mobile (`mobile/`)

אפליקציית React Native (Expo) ל-Android ול-iOS, לניהול אירוע תודעתי מהטלפון. התיקייה של **צוות Marconi** במונורפו של מדור Fresnel (תמונת מצב).
עונים בעברית. מזהים, קוד ו-commits באנגלית.
**לא ממציאים:** שדה, endpoint או התנהגות שלא מופיעים כאן, ב-`db/schema.sql`, ב-OpenAPI או באפיונים מסומנים כשאלה פתוחה. לא מנחשים.
**Expo SDK 58.** ה-API של Expo משתנה בין גרסאות. לפני קוד שנוגע ב-Expo, קוראים את `AGENTS.md` ואת התיעוד של v58, ולא סומכים על הזיכרון.

> **עדכון 17.10:** השלד (BEN-7) במאגר. routes לכל המסכים תחת `src/app/`, מסכים ריקים, ותיקייה לכל תחום ב-`src/features/`. פירוט בסעיף מבנה.

> **עדכון 16.10:** Push עובר דרך **שירות ה-Push של Expo**, כדי שיהיה הכי פשוט לפתח. קוד אחד ל-Android ול-iOS: `getExpoPushTokenAsync` באפליקציה ו-`expo-server-sdk` בשרת. **בלי firebase-admin, בלי `apns2` ובלי מפתחות Push בשרת.** פירוט בסעיף Push.

> **עדכון 15.10 (אחה״צ):**
> - **אקינטור הוחלף ב-Oracle**: מערכת חיצונית שמוטמעת. בווב iframe, אצלנו **WebView** (`react-native-webview`). אין לנו API לממש בשבילה.
> - **אין אמת/תרגילית במובייל ב-MVP.** המובייל מציג רק אירועים אמיתיים (`is_simulation = false`).
> - **אין אירועים סגורים במובייל.** רק פתוחים ובטיפול. אפשר לסגור אירוע מהטלפון, ואז הוא נעלם מהרשימה.
> - **מחיקת פעולה במובייל:** לחיצה ארוכה או כפתור בצד. רק מי שביצע את הפעולה יכול למחוק.
> - **מבזקים מה-Data Lake** (צוות טל בן שושן, Artemis), לא מדורון. ה-route שלהם עוד לא מוגדר.
> - **תחקור אצל בן**, לפי הצרכים של ניתאי.
> - **מיראז׳:** מזהה משתמש וגזרה אחת (`IL`/`ARAB`/`INTL`).
> - **תשתיות:** אין חסמים בפיירוול.

## המערכת בשורה אחת
המדור מחליף את קבוצת הוואטסאפ של הדוברות:
1. צוות אנומליות (דורון) שולח נרטיבים. השו״ב שומר כל אחד בטבלת `narrative`. נרטיב עם `is_anomaly = true` הוא אנומליה.
2. משתמש בשו״ב פותח אירוע על נרטיב (השו״ב חוסם פתיחה על נרטיב בלי זירה). צוות הסימולציות (אושר) יכול גם לשלוח אירוע עם `is_simulation = true` על נרטיב קיים. **המובייל לא מציג אותם.**
3. הטלפונים של הגזרה מקבלים Push (רק על אירוע אמיתי).
4. בטלפון: תמונת מצב (פרטים, נתונים מצטברים, מקורות עיקריים), Oracle, מקורות מידע, ותיעוד פעולות (הוספה ומחיקה של פעולה שלי).
5. האירוע נסגר עם סיכום (מהווב או מהטלפון), נעלם מהטלפון ועובר לסגורים בווב. צוות התחקור (ניתאי) מקבל אותו דרך API של בן.

## המונורפו
`https://gitlab.com/fresnel3/fresnel`, branch `dev`.

| תיקייה | מה | בעלים |
|---|---|---|
| `api/` | `fresnel-api`, backend משותף: מודולים `shob`, `vandamme`, ו**`mobile`** (שלנו) | כל צוות על המודול שלו |
| `web-shob/` | שו״ב (React) | שחר צברי (PALANTIR) |
| `web-vandamme/` | ואן דאם, ניהול אירוע בווב (React) | עדן טולקין |
| `mobile/` | **התיקייה הזו** | צוות Marconi (בן נתנזון) |
| `db/` | `schema.sql` ו-migrations, schema `fresnel` | ואן דאם. migration שלנו עובר review של עדן |

- כל job ב-CI רץ רק כשמשהו השתנה בתיקייה שלו. CODEOWNERS: כל צוות מאשר את התיקייה שלו.
- שינוי ב-DB רק דרך migration ב-`db/`.

## מושגים
- **נרטיב (`narrative`):** מה שדורון שולח, נשמר על ידי השו״ב. `is_anomaly = true` היא **אנומליה**. ממנו מגיעים כותרת (`title`), תיאור (`summary`), זירה (`arena`) וזמן זיהוי (`detected_at`) של האירוע.
- **אירוע (`event`):** נפתח על נרטיב. אין אירוע בלי נרטיב ואין אירוע ידני. לכל היותר אירוע אמיתי אחד פתוח לנרטיב. **`event` ו-`narrative` הן שתי טבלאות נפרדות, בלי `event_view`.** ה-API מחבר ביניהן.
- **סטטוס:** `open` (נפתח ולא נגעו בו) → `in_progress` (תועדה לפחות פעולה אחת, תגית "בטיפול") → `closed` (נסגר עם סיכום). פתיחה מחדש רק מהווב.
- **תרגילית (`is_simulation`):** אירוע ששלח אושר על נרטיב קיים, עם `event_id` חדש. המבזקים נמשכים כרגיל לפי `narrative_id`. **בווב בלבד. במובייל לא ב-MVP.**
- **מבזק (item):** פורמט `item.v1`. **לא נשמר אצלנו**, אפילו לא המזהה. נשלף בכל הצגה מה-**Data Lake** (Artemis, צוות טל בן שושן) לפי `narrative_id`.
- **נתונים מצטברים:** סה״כ פרסומים, צפיות ושיתופים, ומקורות עיקריים. נשלפים בכל הצגה ולא נשמרים. ⬜ המקור המדויק (Data Lake או חישוב מהמבזקים).
- **גזרה:** `IL` / `ARAB` / `INTL`. גזרת האירוע מהנרטיב. גזרת המשתמש **ממיראז׳** (מזהה + גזרה אחת). כל משתמש רואה רק את הגזרה שלו. **זו ההרשאה היחידה במערכת.**
- **פעולה:** תיעוד של משהו שכבר בוצע. סוג מהבנק (`action_type`), כותרת עד 100 (חובה), תיאור עד 500 (רשות). **מחיקה רכה, רק על ידי מי שביצע.**
- **Oracle:** מערכת חיצונית (מודל שפה) שמוטמעת בתמונת המצב. אנחנו לא שולחים לה בקשות ולא שומרים שיחות. במובייל: WebView.

## מה המובייל עושה (MVP, ה׳ 22.10)
- **Push:** רק על אירוע **אמיתי** חדש, לכל משתמשי הגזרה.
- **מסכים** (פירוט ב-`team-spec.md`):
  - **כניסה:** SSO מול Keycloak.
  - **בית:** רשימת אירועים פתוחים (כולל "בטיפול"), חיפוש לפי כותרת, ואייקון פרופיל בכותרת. **בלי לשונית סגורים ובלי מתג אמת/תרגילית.**
  - **אירוע:** כותרת "ניהול אירוע", חזרה, ושלוש לשוניות: **תמונת מצב** (ברירת מחדל, כולל Oracle ב-WebView), **פעולות שבוצעו**, **מקורות מידע**.
  - **גיליונות:** הוספת פעולה, סגירת אירוע, אישור מחיקת פעולה.
  - **פרופיל** לקריאה בלבד.
- **לא ב-MVP:** אמת/תרגילית, אירועים סגורים, קבצים, עריכת פרופיל, עריכת פעולה, פתיחה מחדש.
- **ה-Figma הוא כיוון, לא חוזה.** כשיש סתירה, האפיון קובע.

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
      (auth)/login.tsx                # כניסה (SSO)
      (app)/_layout.tsx               # Stack, כותרות, אייקון פרופיל
      (app)/index.tsx                 # בית: פתוחים, חיפוש
      (app)/profile.tsx
      (app)/events/[id]/_layout.tsx   # בורר לשוניות + Slot
      (app)/events/[id]/index.tsx     # תמונת מצב + Oracle (WebView)
      (app)/events/[id]/actions.tsx   # ציר, הוספה, מחיקה, סגירה
      (app)/events/[id]/sources.tsx   # מקורות מידע
    features/                         # קומפוננטות ו-hooks לפי תחום
      events/  snapshot/  actions/  sources/  oracle/  profile/
    components/                       # משותפות: Screen, Sheet, EventTabs
    api/                              # API client, queryClient, טיפוסים מה-OpenAPI
    auth/                             # AuthProvider, useAuth
    realtime/                         # socket.io
    notifications/                    # Push
    hooks/                            # hooks משותפים
    constants/labels.ts               # תוויות בעברית
    config.ts                         # משתני EXPO_PUBLIC_*
    theme.ts                          # צבעים, ריווח, גדלים
  app.config.ts  eas.json  .env.example
```
- **`src/app/` מכיל רק routes.** קומפוננטות, hooks ולוגיקה נמצאים מחוץ לו, ונכנסים דרך `@/` (למשל `@/features/actions/...`).
- **מסך ב-`src/app/` דק:** מרכיב קומפוננטות מ-`src/features/<תחום>/`. כל חייל עובד בעיקר בתיקיית התחום שלו.
- **בורר הלשוניות** (`EventTabs`) הוא קומפוננטה שלנו עם `router.replace`, **בלי** material-top-tabs.
- **גיליונות** בנויים על `Sheet` (Modal של React Native), לא routes.
- **כניסה בפיתוח:** `EXPO_PUBLIC_AUTH_BYPASS=true` מדלג על מסך הכניסה.
- **הספריות הנייטיב כבר בשלד:** `react-native-webview`, `expo-notifications`, `expo-auth-session`, `expo-secure-store`, `expo-web-browser`, `expo-crypto`, `expo-localization`. ה-dev client נבנה איתן פעם אחת.
- **אחר כך, מחוץ ל-`mobile/`:** `api/src/modules/` (me, devices, push, debrief) ו-`db/migrations/` (device_token). mock-server יתווסף בהמשך (MOB-2).

## סטאק
- **אפליקציה:** Expo SDK 58 (dev build, **לא Expo Go**), TypeScript, expo-router, TanStack Query, socket.io-client, expo-notifications, expo-auth-session (OIDC עם PKCE), expo-secure-store, react-native-webview.
- **טיפוסים:** openapi-typescript מה-OpenAPI שב-`api/`. **הטיפוסים הם מקור האמת.**
- **תוויות בעברית:** סטטוס, זירה, חומרה וסוג רשומה בלוג נשמרים ב-DB כקוד באנגלית. התווית בעברית רק ב-`src/constants/labels.ts`. בנק הפעולות מגיע עם `label_he` מהשרת.
- **שרת (`api/`):** NestJS על Express. אימות וגזרה ב-Guard גלובלי, DTO עם `class-validator` ו-`@nestjs/swagger`, ו-socket.io ב-Gateway. כללים: `react-native-standards.md` סעיף 12.
- **בשרת, ל-Push:** `expo-server-sdk` בלבד (שירות ה-Push של Expo). **אין firebase-admin ואין `apns2`.**

## חוזים

**כל קריאה מהטלפון שולחת header `X-Client: mobile`.** השרת כותב אותו ל-`event_log.client`. זה בתוך ה-API client.
ה-routes של ואן דאם ושו״ב מוגדרים תחת `/api/...`. השמות כאן בלי הקידומת. ה-OpenAPI קובע.

### מה אנחנו צורכים
| קריאה | מה | בעלים |
|---|---|---|
| `GET /events?status=active&simulation=false&q=&cursor=` | רשימת הפתוחים. `active` = `open` + `in_progress`. הגזרה מהמשתמש. מחזיר גם את שדות הנרטיב (`title`, `is_anomaly`). **המובייל תמיד שולח `simulation=false` ולא מבקש `closed`** | עדן |
| `GET /events/{id}` | כרטיס האירוע, כולל שדות הנרטיב ושמות (`created_by`) | עדן |
| `GET /events/{id}/timeline` | פעולות שלא נמחקו (כולל מזהה המבצע) + `event_created` / `event_reopened`, לפי זמן | עדן |
| `GET /action-types` | הבנק הפעיל: `code`, `label_he` | עדן |
| `POST /events/{id}/actions` | `{action_type, title, description?}`. מעביר `open` ל-`in_progress`. 409 על אירוע סגור | עדן (VD-05) |
| `DELETE /actions/{id}` | מחיקה רכה. **403 אם המשתמש לא המבצע** | עדן (VD-05) |
| `POST /events/{id}/close` | `{closure_summary}` חובה, בלי מגבלת אורך. 409 אם כבר סגור | עדן |
| `GET /events/{id}/items?q=&cursor=&limit=20` | מבזקים מה-Data Lake לפי `narrative_id`, לפי `published_at` יורד | עדן (VD-06) |
| `GET /events/{id}/stats` | `{posts, views, shares, top_sources[], partial, as_of}`. `null` לשדה חסר | עדן (VD-06) |

**Oracle:** לא route. WebView לכתובת של Oracle עם הקשר האירוע. ⬜ כתובת, פרמטרים ואימות.

### ה-routes שלנו (מודול `mobile` ב-`api/`)
| route | מה |
|---|---|
| Guard אימות וגזרה (גלובלי) | בודק טוקן Keycloak, מביא את גזרת המשתמש ממיראז׳, ומוודא שהיא = גזרת הנרטיב של האירוע (join בין `event` ל-`narrative`). משמש את **כל** ה-routes. ⬜ תיאום מול [14] של שחר |
| `GET /me` | מזהה, גזרה (ושם/תפקיד ⬜) |
| `POST /devices`, `DELETE /devices/{token}` | רישום טלפון ל-Push. `{platform, push_token}`, כש-`push_token` הוא טוקן Expo |
| שולח Push (מודול פנימי) | נקרא כשנפתח אירוע **אמיתי**. שולח דרך Expo עם `expo-server-sdk` |
| API לתחקור | אירועים סגורים עם סיכום וציר, לפי הצרכים של ניתאי. ⬜ פורמט |

### socket.io
- מתחברים עם הטוקן. השרת מצרף לחדר `arena:{arena}`. במסך אירוע: `event.join` / `event.leave` עם `event_id`, עם בדיקת גזרה.
- אירועים: `event.created`, `event.updated` (סטטוס/סגירה), `action.created`, `action.deleted`. **ה-payload כולל רק מזהים ו-`is_simulation`**, והאפליקציה מרעננת את השאילתות (`invalidateQueries`).
- **המובייל מתעלם מכל אירוע socket עם `is_simulation = true`.**
- **מבזקים ונתונים לא עוברים ב-socket.** הם במשיכה (סעיף "זמנים").

### זמנים
| מה | איך |
|---|---|
| רשימה, כרטיס, ציר | ב-socket. רענון גם כשהאפליקציה חוזרת לחזית |
| `stats`, `items` | משיכה כל **60 שניות** כשהמסך בפוקוס, ומשיכה ידנית (pull-to-refresh) |
| socket מנותק | רשימה וציר במשיכה כל **20 שניות** עד שהחיבור חוזר |

## DB (PostgreSQL, schema `fresnel`, גרסה 0.6, לא סופית)
- **`narrative`** (של השו״ב): `narrative_id` (text, המזהה אצל דורון), `title`, `summary`, `is_anomaly`, `arena`, `location_name`, `detected_at`, `embedding`, `payload`, `received_at`.
- **`event`:** `event_id`, `narrative_id`, `severity` (`low`/`medium`/`high`/`critical`), `status` (`open`/`in_progress`/`closed`), `is_simulation`, `created_by`, `created_at`, `updated_at`, `closed_at`, `closed_by`, `closure_summary` (בלי מגבלת אורך).
  - סגור ⇔ `closed_at`, ואז `closed_by` ו-`closure_summary` חובה.
  - unique חלקי: אירוע אמיתי לא סגור אחד לנרטיב. תרגילית לא בכלל.
  - אין `event_view`: `event` ו-`narrative` נפרדות.
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
- **`action`:** `action_type`, `title` (≤100, חובה), `description` (≤500, רשות), `performed_by`, `performed_at`, `deleted_at`/`deleted_by` (מחיקה רכה, **גם מהמובייל**, רק המבצע).
- **`event_log`:** append-only. `kind`, `actor_id`, `from_value`, `to_value`, `details`, `client` (`web`/`mobile`/`system`).
- **`device_token` (migration שלנו):** `device_id`, `user_id`, `platform` (`android`/`ios`), `push_token` (unique, טוקן Expo בצורה `ExponentPushToken[...]`), `created_at`, `last_seen_at`. טוקן שנכשל נמחק.
- **לא נשמר אצלנו:** מבזקים, נתונים מצטברים, שיחות Oracle, משתמשים וגזרות (Keycloak ומיראז׳).
- **DB מקומי:** `docker compose up -d` מהשורש, פורט 5433. `.env` לא נכנס ל-git. אחרי שינוי schema: `docker compose down -v` ואז `up -d`.

## Oracle (WebView)
- `react-native-webview` כבר בשלד. ספרייה נייטיב: שינוי בה דורש בנייה מחדש של ה-dev client.
- הכתובת מ-`config.oracleUrl` (`EXPO_PUBLIC_ORACLE_URL`), לא קשיחה. הקשר האירוע (`event_id`, `narrative_id`) עובר כמו ב-iframe של הווב (VD-18). ⬜ הפרמטרים.
- `originWhitelist` רק לדומיין של Oracle. קישור החוצה (מקור) נפתח בדפדפן (`onShouldStartLoadWithRequest` + `Linking.openURL`).
- מצב טעינה, ושגיאה עם "נסה שוב" (`onError`, `onHttpError`).
- **אין טוקן ב-URL.** ⬜ איך Oracle מזהה את המשתמש: ה-SSO של expo-auth-session **לא משותף** עם ה-WebView.
- **הגזרה:** הטלפון פונה ל-Oracle ישירות, ולא דרך `api/`. Oracle צריך לאכוף את הגזרה בעצמו. ⬜
- השיחה לא נשמרת. מעבר לשונית או יציאה מהאירוע טוענים את ה-WebView מחדש.

## Push
- **דרך שירות ה-Push של Expo** (החלטה 16.10: הכי פשוט לפתח). Expo מעביר את ההתראה ל-FCM ב-Android ול-APNs ב-iOS. **קוד אחד לשתי הפלטפורמות**, באפליקציה ובשרת.
- **טוקן באפליקציה:** `Notifications.getExpoPushTokenAsync({ projectId })`, כש-`projectId` נלקח מ-`Constants.expoConfig?.extra?.eas?.projectId`. הטוקן נראה כמו `ExponentPushToken[...]`, ונשלח ל-`POST /devices`. **לא** משתמשים ב-`getDevicePushTokenAsync` ולא ב-Firebase SDK.
- **שליחה מהשרת:** `expo-server-sdk`. `chunkPushNotifications` ואז `sendPushNotificationsAsync` לכל המכשירים של הגזרה. אין מפתחות Push בשרת.
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
- **טוקן שנכשל:** ticket עם `DeviceNotRegistered` נמחק מ-`device_token`. בדיקת receipts לא ב-MVP.
- **מפתחות (פעם אחת, בן):** פרויקט EAS (`eas init`). ה-`projectId` נכנס כקבוע `EAS_PROJECT_ID` בראש `app.config.ts`, שמכניס אותו ל-`extra.eas.projectId`. `google-services.json` נכנס ל-git ב-`mobile/` (לפי Expo הוא לא סוד), ו-`app.config.ts` מזהה אותו לבד. מפתח FCM V1 (service account של Firebase) ומפתח APNs (`.p8`) הם סודות: רק ב-EAS, עם `eas credentials`, ולא ב-git. החיילים לא צריכים חשבון Expo.
- **רק התראה אחת:** אירוע אמיתי חדש בגזרה. לא על תרגילית.
- **אין תוכן ב-Push.** הטקסט הוא "אירוע חדש בגזרה", וה-payload כולל רק `event_id`.
- **ניווט:** `events/[id]`, לשונית תמונת מצב.
- **שני channels ב-Android לפי `is_anomaly`:** `setNotificationChannelAsync` בעליית האפליקציה: `anomaly` (עם צליל) ו-`narrative` (שקט). השרת שולח `channelId`.
- **פתיחה מאפס:** `getLastNotificationResponseAsync`.
- **פיתוח בלי שרת:**
  - **מסך וניווט (MOB-11):** התראה מקומית, `scheduleNotificationAsync({ content: { title, data: { event_id } }, trigger: null })`. ה-handler של הלחיצה זהה ל-Push אמיתי.
  - **Push אמיתי מול ה-mock-server:** ה-mock שומר את הטוקנים מ-`POST /devices` בזיכרון, ו-`POST /dev/push {event_id, is_anomaly}` שולח Push אמיתי דרך Expo לכל המכשירים שנרשמו.
  - **ידנית:** כלי הבדיקה של Expo (`https://expo.dev/notifications`) או `curl` ל-`https://exp.host/--/api/v2/push/send`.
  - **סימולטור iOS:** `xcrun simctl push`.

## תשתית
- **ענן:** AWS. לכל יחידה חשבון נפרד ו-cluster אחד של EKS.
- **CI/CD:** GitLab ו-Registry. push → CI → Registry → Argo CD → EKS. סודות דרך Sealed Secrets.
- **DB:** PostgreSQL על CloudNativePG, עם PostGIS ו-pgvector.
- **סביבות:** Prod ו-PreProd לכל מדור, עם DB נפרד. שמות ה-Namespaces ⬜.
- **זהות:** Keycloak עם SSO מול AD. realm אחד לשלוש המערכות. למובייל client ציבורי. גזרה ממיראז׳.
- **רשת:** אין חסמים בפיירוול ל-Expo Push (`exp.host`), FCM, APNs ולסביבת הבנייה. ⬜ האם טלפון אמיתי מגיע ל-Ingress הפרטי, או שההדגמה על אמולטורים.

## בנייה והרצה
- **דרישות:** **Node 22.13 ומעלה** (Expo SDK 58 לא רץ על Node 20, ראו `.nvmrc`), JDK 17, Android SDK, `ANDROID_HOME`. ב-Mac גם Xcode ו-CocoaPods.
- **הרצה ראשונה:** `npm install`, `cp .env.example .env`, ואז `npm run android`.
- **dev client:** נבנה פעם אחת לכל פלטפורמה. אחריו `npm start`, ושינויי JS נטענים בלי בנייה. בונים מחדש רק אחרי שינוי ב-`app.config.ts` או ספרייה נייטיב.
- **Android:** `npm run android` (`expo run:android`). APK: `cd android && ./gradlew assembleRelease`. האמולטור מתמונת **Google Play**, אחרת אין Push.
- **iOS:** רק על Mac. `npm run ios` (או `npx expo run:ios --device`). בדיקת Push בסימולטור: `xcrun simctl push`. Push אמיתי דרך Expo נבדק על אייפון.
- **לפני MR:** `npm run lint` ו-`npm run typecheck`.
- **mock-server:** עוד לא קיים (MOB-2).
- כל הפקודות רצות מתוך `mobile/`. `android/` ו-`ios/` נוצרים בבנייה ולא נכנסים ל-git. לא עורכים אותם ידנית, רק דרך `app.config.ts`.

## כללי קוד
- **RTL מהיום הראשון:** `supportsRTL` ו-`forcesRTL` ב-plugin של `expo-localization` (`app.config.ts`).
- **מצבי מסך:** לכל מסך מצב טעינה, ריק ושגיאה.
- **שדות חסרים:** שדה ריק מוצג "—", לא 0. סכום עם `partial: true` מסומן "חלקי".
- **רק אמת:** כל רשימה נמשכת עם `simulation=false`. אין קוד של תרגילית במובייל.
- **מחיקת פעולה:** הכפתור והלחיצה הארוכה מופיעים רק כש-`performed_by` = המשתמש מ-`/me`. השרת אוכף בכל מקרה.
- **אבטחה:** אין באפליקציה סודות, כתובות פנימיות קשיחות או טוקנים בלוג או ב-URL. הכתובות מ-`src/config.ts`. מפתחות FCM ו-APNs רק ב-EAS (מועלים עם `eas credentials`), לא באפליקציה, לא בשרת ולא ב-git. הטלפון לא פונה לדורון או ל-Data Lake ישירות, רק דרך `api/`. החריג היחיד: Oracle ב-WebView.
- **הרשאות נאכפות בשרת**, ב-Guard. צריך בדיקות שמוכיחות:
  - משתמש `ARAB` לא רואה אירוע `IL`, לא את המבזקים, הנתונים והציר שלו.
  - משתמש `ARAB` לא מוסיף פעולה לאירוע `IL`, לא מוחק בו פעולה ולא סוגר אותו.
  - משתמש לא מוחק פעולה של משתמש אחר.
  - משתמש `ARAB` לא מצטרף לחדר socket של אירוע `IL`.
- **ספרייה נייטיב חדשה** דורשת אישור של בן ובנייה מחדש של ה-dev client. מתקינים תמיד עם `npx expo install`.
- **Git:** `feature/<jira-id>-short-name` מ-`dev`. כל שינוי דרך MR עם review. אין push ישיר ל-`dev` או ל-`main`. כל route מגיע עם בדיקה.
- **בק משותף:** שינוי ב-route של צוות אחר או ב-`db/` עובר review של הבעלים.

## התממשקויות
| מערכת / צוות | איש קשר | מה עובר |
|---|---|---|
| אנומליות | דורון קבאלה | נרטיבים לשו״ב |
| Data Lake (Artemis) | טל בן שושן | מבזקים `item.v1` (ונתונים?) לפי `narrative_id`. route ⬜ |
| סימולציות | אושר | אירועי תרגילית על נרטיב קיים. ווב בלבד |
| תחקור | ניתאי שער | אירועים סגורים עם סיכום וציר, מ-API של בן. פורמט ⬜ |
| שו״ב | שחר צברי | `narrative`, פתיחת אירוע (מפעילה Push), חסימת אירוע בלי זירה |
| ואן דאם | עדן טולקין | אירועים, פעולות (כולל מחיקה), ציר, סגירה, items, stats, `db/` |
| Oracle | ⬜ | WebView בתמונת המצב |
| Expo Push | בן (חשבון EAS) | Push ל-Android ול-iOS, מעל FCM ו-APNs |
| מיראז׳ | נועה הרשקו | מזהה משתמש וגזרה |
| Network, Identity & Access | עידו אלון | Keycloak, גישה מטלפון |
| Platform & Delivery | רון להב | Namespaces, Pipeline, Ingress עם WebSocket |
| Data & AI | ליה אלפנדרי | schema `fresnel` |
| Observability | תמר חאמי | דשבורד מצב והתראות |
| סייבר | נגה בנו, SOC: אומי חרמש | לוגים ל-SOC, בדיקות אבטחה |
| CTO | ניב שיין | ארכיטקטורה וסטנדרטים |

## שאלות פתוחות: לא לנחש
- ⬜ **Oracle:** כתובת, פרמטרי ההקשר, איך מזהה את המשתמש ב-WebView, האם אוכף גזרה, האם מותאם לטלפון ו-RTL, ואיש קשר.
- ⬜ **Data Lake:** route, אימות, `item.v1`? נתונים מצטברים ושיתופים? (ו-VD-06 של עדן עדיין כתוב "מדורון").
- ⬜ **מיראז׳:** מאיפה שם ותפקיד (לציר, ל"נפתח על ידי" ולפרופיל), אם מיראז׳ מחזיר רק מזהה וגזרה.
- ⬜ **מחיקת פעולה:** האם הבדיקה "רק המבצע" נכנסת ל-`DELETE /actions/{id}` של עדן. האם מחיקת הפעולה האחרונה מחזירה ל-`open`. emit של `action.deleted`.
- ⬜ **תחקור:** מה ניתאי צריך (push או pull, שדות, תדירות).
- ⬜ **Push לפי גזרה:** איך מוצאים את המכשירים של גזרה (גזרה ב-`device_token`, או שאילתה למיראז׳).
- ⬜ **גישה מטלפון אמיתי ל-API.**
- ⬜ **חומרה:** מי קובע בפתיחה (השו״ב או דורון)?
- ⬜ **חשבון Apple, Firebase ו-Expo (EAS).**

## מסמכים
- `README.md`: הרצה ופקודות.
- `AGENTS.md`: כללי Expo SDK 58 לסוכני AI.
- `section-spec.md`: אפיון המדור, workflow, DB ו-API.
- `team-spec.md`: אפיון צוות Marconi, מסכים, Push ובנייה.
- `react-native-standards.md`: איך כותבים קוד.
- `db/schema.sql` במונורפו: ה-DB.
