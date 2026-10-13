# Fresnel

המונורפו של מדור Fresnel (מדור תמונת מצב, ענף מגדלור): backend משותף, ה-frontends של הצוותים וה-DB.

| תיקייה | מה יש בה | בעלים |
| --- | --- | --- |
| `api/` | backend משותף (fresnel-api): מודול shob ומודול vandamme | שו״ב + ואן דאם |
| `web-vandamme/` | frontend של ניהול אירוע | ואן דאם |
| `web-shob/` | frontend של השו״ב | שו״ב |
| `db/` | `schema.sql` ו-migrations, schema `fresnel` | ואן דאם |

## עקרונות
- כל job ב-CI רץ רק כשמשהו השתנה בתיקייה שלו.
- כל צוות מאשר שינויים בתיקייה שלו (CODEOWNERS).
- שינוי ב-DB רק דרך migration ב-`db/`.
- הקפאת תצורה: ה׳ 22/10, 12:00.

האפיון של ה-DB: https://claude.ai/code/artifact/7facdec2-4234-4388-bd0b-b310c38ae7df
