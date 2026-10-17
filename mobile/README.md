# Fresnel mobile

אפליקציית React Native (Expo SDK 58) ל-Android ול-iOS. צוות Marconi.
מה בונים: `CLAUDE.md`. איך כותבים קוד: `react-native-standards.md`.

## דרישות

- **Node 22** (לפחות 22.13, ראו `.nvmrc`). Expo SDK 58 לא רץ על Node 20.
- JDK 17, Android Studio ו-Android SDK, ומשתנה `ANDROID_HOME`.
- אמולטור Android מתמונת **Google Play**, אחרת אין Push.
- iOS: רק על Mac, עם Xcode ו-CocoaPods.

## הרצה ראשונה

כל הפקודות רצות מתוך `mobile/`.

```bash
npm install
cp .env.example .env        # למלא לפי הצורך
npm run android             # בונה את ה-dev client ומתקין על האמולטור
```

הבנייה הראשונה לוקחת כמה דקות. אחריה מספיק:

```bash
npm start                   # Metro בלבד. שינויי JS נטענים בלי בנייה
```

בונים מחדש (`npm run android`) רק אחרי שינוי ב-`app.config.ts` או הוספת ספרייה נייטיב.
ספרייה נייטיב חדשה דורשת אישור של בן.

## פקודות

| פקודה                             | מה                           |
| --------------------------------- | ---------------------------- |
| `npm start`                       | Metro ל-dev client           |
| `npm run android` / `npm run ios` | בנייה והתקנה של ה-dev client |
| `npm run lint`                    | ESLint                       |
| `npm run typecheck`               | TypeScript                   |
| `npm run format`                  | Prettier                     |

לפני כל MR: `npm run lint` ו-`npm run typecheck` עוברים נקי.

## כניסה בפיתוח

כש-`EXPO_PUBLIC_AUTH_BYPASS=true` ב-`.env`, האפליקציה נכנסת ישר לבית בלי מסך הכניסה.

## פתיחת מסך ישירות

למשל מסך אירוע, בלי לעבור דרך הבית:

```bash
adb shell am start -W -a android.intent.action.VIEW -d "fresnel://events/demo"
adb shell am start -W -a android.intent.action.VIEW -d "fresnel://events/demo/actions"
```

## מבנה

```
src/
  app/                    # routes בלבד (expo-router). כל קובץ הוא מסך
    _layout.tsx           # providers, ומעבר בין כניסה לאפליקציה
    (auth)/login.tsx      # כניסה (SSO)
    (app)/_layout.tsx     # Stack וכותרות
    (app)/index.tsx       # בית: אירועים פתוחים
    (app)/profile.tsx
    (app)/events/[id]/_layout.tsx   # בורר לשוניות
    (app)/events/[id]/index.tsx     # תמונת מצב
    (app)/events/[id]/actions.tsx   # פעולות שבוצעו
    (app)/events/[id]/sources.tsx   # מקורות מידע
  features/               # קומפוננטות ו-hooks לפי תחום
    events/ snapshot/ actions/ sources/ oracle/ profile/
  components/             # קומפוננטות משותפות (Screen, Sheet, EventTabs)
  api/                    # API client ו-TanStack Query
  auth/  realtime/  notifications/  hooks/
  constants/labels.ts     # תוויות בעברית
  config.ts               # משתני סביבה
  theme.ts                # צבעים, ריווח וגדלים
```

- `src/app/` מכיל רק routes. כל השאר מחוץ לו.
- import דרך `@/`, למשל `import { Screen } from '@/components/Screen'`.

## Push: הגדרות חד-פעמיות (בן)

ההתראות עוברות דרך שירות ה-Push של Expo. הקוד באפליקציה זהה ל-Android ול-iOS.

| מה                                                  | איפה                                                         | ב-git?      |
| --------------------------------------------------- | ------------------------------------------------------------ | ----------- |
| מזהי האפליקציה (`ANDROID_PACKAGE`, `IOS_BUNDLE_ID`) | קבועים בראש `app.config.ts`                                  | כן          |
| `EAS_PROJECT_ID` (מ-`eas init`)                     | קבוע בראש `app.config.ts`                                    | כן, לא סוד  |
| `google-services.json` (Firebase, Android)          | `mobile/google-services.json`. `app.config.ts` מזהה אותו לבד | כן, לא סוד  |
| מפתח service account של Firebase (FCM V1)           | מועלה ל-EAS עם `eas credentials`                             | **לא. סוד** |
| מפתח APNs (`.p8`, iOS)                              | נוצר או מועלה ב-EAS עם `eas credentials`                     | **לא. סוד** |

אחרי כל שינוי בקבצים האלה בונים מחדש את ה-dev client (`npm run android`).
