-- Dev seed data for the local DB only. Never run on PreProd or Prod.
-- Wipes narrative, event, action, event_log and device_token, then inserts sample data.
-- Times are relative to now(), so the data always looks fresh.
-- Embeddings are random: good for testing the column and index, meaningless for search.
--
-- Run: docker exec -i fresnel-db psql -U fresnel -d fresnel -v ON_ERROR_STOP=1 < db/seed-dev.sql

BEGIN;
SET search_path = fresnel, public;

TRUNCATE event_log, action, event, narrative, device_token RESTART IDENTITY;

------------------------------------------------------------------------------
-- narrative: 10 narratives, 6 of them anomalies
------------------------------------------------------------------------------
INSERT INTO narrative (narrative_id, title, summary, is_anomaly, arena, location_name, detected_at, payload) VALUES
  ('nar-0001', 'שמועה על פינוי יישובים בגבול הצפון',        'פוסטים רבים טוענים שהוחלט על פינוי כפוי של יישובי קו העימות',      true,  'IL',   'גבול הצפון',  now() - interval '5 hours',  '{"source_count": 42}'),
  ('nar-0002', 'סרטון מזויף של פגיעה בבסיס',                 'סרטון ישן מסוריה מופץ כאילו צולם אתמול בבסיס בדרום',                true,  'ARAB', 'הנגב',        now() - interval '3 hours',  '{"source_count": 17}'),
  ('nar-0003', 'טענה על הסתרת נפגעים',                       'חשבונות זרים מפיצים מספרי נפגעים שאינם תואמים את הפרסומים הרשמיים', true,  'INTL', null,          now() - interval '26 hours', '{"source_count": 63}'),
  ('nar-0004', 'קמפיין נגד חיסון חיילים',                    'גל פוסטים שטוען שחיילים מחוסנים בכפייה בחיסון ניסיוני',             true,  'IL',   null,          now() - interval '2 days',   '{"source_count": 25}'),
  ('nar-0005', 'דיווח כוזב על הפסקת אש',                     'ציוצים בערבית מדווחים על הסכם הפסקת אש שלא נחתם',                   true,  'ARAB', 'רצועת עזה',   now() - interval '4 days',   '{"source_count": 88}'),
  ('nar-0006', 'הדלפה מזויפת של מסמך מבצעי',                  'מסמך עם לוגו מזויף מופץ בטלגרם כאילו הוא פקודת מבצע',              true,  'INTL', null,          now() - interval '6 days',   '{"source_count": 9}'),
  ('nar-0007', 'דיון ער על תקציב הביטחון',                    'שיח רגיל ברשתות בעקבות הצעת התקציב',                                 false, 'IL',   null,          now() - interval '1 hour',   '{}'),
  ('nar-0008', 'תמונות מתרגיל של צה״ל',                       'תמונות אמיתיות מתרגיל מופצות בלי הקשר שגוי',                          false, 'IL',   'רמת הגולן',   now() - interval '7 hours',  '{}'),
  ('nar-0009', 'כתבה בתקשורת זרה על אזור הגבול',             'כתבה של רשת בינלאומית, שיתופים רגילים',                               false, 'INTL', 'גבול הצפון',  now() - interval '12 hours', '{}'),
  ('nar-0010', 'עליה בשיח על מחירי הדלק',                     'שיח אזרחי שלא קשור לביטחון',                                          false, 'IL',   null,          now() - interval '30 minutes', '{}');

-- 100 more generated narratives (nar-1001 .. nar-1100), spread over the last ~12 days. Each gets an event below.
SELECT setseed(0.21);
INSERT INTO narrative (narrative_id, title, summary, is_anomaly, arena, location_name, detected_at, payload)
SELECT
  'nar-' || (1000 + g),
  (ARRAY['שמועה על', 'סרטון מזויף של', 'טענה כוזבת על', 'קמפיין נגד', 'דיווח מוטעה על', 'הדלפה מזויפת על'])[1 + floor(random() * 6)::int]
    || ' ' ||
  (ARRAY['פינוי יישובים', 'פגיעה בבסיס', 'מספר הנפגעים', 'גיוס מילואים', 'הפסקת אש', 'תקיפה בעורף', 'מחסור במקלטים', 'פעולה מבצעית'])[1 + floor(random() * 8)::int],
  'נרטיב שנוצר לבדיקות #' || g,
  g % 10 <> 0,
  (ARRAY['IL', 'ARAB', 'INTL'])[1 + floor(random() * 3)::int],
  (ARRAY['גבול הצפון', 'רצועת עזה', 'הנגב', 'רמת הגולן', 'יהודה ושומרון', NULL, NULL])[1 + floor(random() * 7)::int],
  now() - g * interval '3 hours' - floor(random() * 120) * interval '1 minute',
  jsonb_build_object('source_count', 5 + floor(random() * 95)::int)
FROM generate_series(1, 100) g;

-- A random 1024-dim vector per row (the WHERE ties the subquery to the row so it runs per row)
UPDATE narrative n SET embedding = (
  SELECT array_agg(random() - 0.5)::vector(1024)
  FROM generate_series(1, 1024)
  WHERE n.narrative_id IS NOT NULL
);

------------------------------------------------------------------------------
-- event: real events (open, in progress, closed) and simulation events
------------------------------------------------------------------------------
INSERT INTO event (event_id, narrative_id, severity, status, is_simulation, created_by, created_at, closed_at, closed_by, closure_summary) VALUES
  -- real
  ('00000000-0000-0000-0000-000000000001', 'nar-0001', 'high',     'open',        false, 'shob.operator1', now() - interval '4 hours',  null, null, null),
  ('00000000-0000-0000-0000-000000000002', 'nar-0002', 'critical', 'in_progress', false, 'shob.operator2', now() - interval '150 minutes', null, null, null),
  ('00000000-0000-0000-0000-000000000003', 'nar-0003', 'medium',   'in_progress', false, 'shob.operator1', now() - interval '25 hours', null, null, null),
  ('00000000-0000-0000-0000-000000000004', 'nar-0004', 'low',      'closed',      false, 'shob.operator2', now() - interval '47 hours',
     now() - interval '30 hours', 'vandamme.handler1', 'השמועה הופרכה בהודעת דו"צ. השיח דעך תוך 12 שעות.'),
  ('00000000-0000-0000-0000-000000000005', 'nar-0005', 'high',     'closed',      false, 'shob.operator1', now() - interval '4 days',
     now() - interval '3 days', 'vandamme.handler2', 'תואם מול הכתבים, פורסמה הכחשה. מעקב הסתיים.'),
  -- simulation ("תרגילית"): past narratives sent again for training. nar-0005 twice, which the unique index allows.
  ('00000000-0000-0000-0000-000000000011', 'nar-0005', 'high',     'open',        true,  'shob.trainee1',  now() - interval '40 minutes', null, null, null),
  ('00000000-0000-0000-0000-000000000012', 'nar-0005', 'high',     'in_progress', true,  'shob.trainee2',  now() - interval '35 minutes', null, null, null),
  ('00000000-0000-0000-0000-000000000013', 'nar-0006', 'medium',   'closed',      true,  'shob.trainee1',  now() - interval '1 day',
     now() - interval '20 hours', 'vandamme.trainee1', 'תרגול: המסמך זוהה כמזויף ודווח.');

------------------------------------------------------------------------------
-- action: documented actions. One mistaken entry is soft-deleted.
------------------------------------------------------------------------------
INSERT INTO action (action_id, event_id, action_type, title, description, performed_by, performed_at, deleted_at, deleted_by) VALUES
  ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-000000000002', 'source_analysis',   'זוהה מקור הסרטון',              'הסרטון פורסם לראשונה ב-2019 בחשבון סורי',         'vandamme.handler1', now() - interval '2 hours',   null, null),
  ('00000000-0000-0000-0000-0000000000a2', '00000000-0000-0000-0000-000000000002', 'consultation',      'התייעצות עם רמ״ד',              null,                                               'vandamme.handler1', now() - interval '100 minutes', null, null),
  ('00000000-0000-0000-0000-0000000000a3', '00000000-0000-0000-0000-000000000002', 'reporter_contact',  'פנייה לכתב צבאי',               'נשלח לו המקור המקורי של הסרטון',                   'vandamme.handler2', now() - interval '80 minutes',  null, null),
  ('00000000-0000-0000-0000-0000000000a4', '00000000-0000-0000-0000-000000000002', 'other',             'רישום שגוי',                    'נרשם באירוע הלא נכון',                             'vandamme.handler2', now() - interval '70 minutes',
     now() - interval '65 minutes', 'vandamme.handler2'),
  ('00000000-0000-0000-0000-0000000000a5', '00000000-0000-0000-0000-000000000003', 'fact_check',        'השוואה לנתוני דו"צ',            'המספרים בפוסטים גבוהים פי 4 מהפרסום הרשמי',        'vandamme.handler1', now() - interval '22 hours',  null, null),
  ('00000000-0000-0000-0000-0000000000a6', '00000000-0000-0000-0000-000000000003', 'monitor',           'מעקב אחר התפשטות',              null,                                               'vandamme.handler1', now() - interval '10 hours',  null, null),
  ('00000000-0000-0000-0000-0000000000a7', '00000000-0000-0000-0000-000000000004', 'official_response', 'פורסמה הודעת דו"צ',             'הכחשה רשמית בערוצי דו"צ',                          'vandamme.handler1', now() - interval '40 hours',  null, null),
  ('00000000-0000-0000-0000-0000000000a8', '00000000-0000-0000-0000-000000000004', 'monitor',           'מעקב אחרי ההודעה',              'השיח ירד ב-80%',                                   'vandamme.handler1', now() - interval '32 hours',  null, null),
  ('00000000-0000-0000-0000-0000000000a9', '00000000-0000-0000-0000-000000000005', 'external_contact',  'תיאום מול משרד החוץ',           null,                                               'vandamme.handler2', now() - interval '90 hours',  null, null),
  ('00000000-0000-0000-0000-0000000000aa', '00000000-0000-0000-0000-000000000005', 'official_response', 'הכחשה רשמית',                   null,                                               'vandamme.handler2', now() - interval '80 hours',  null, null),
  ('00000000-0000-0000-0000-0000000000b1', '00000000-0000-0000-0000-000000000012', 'source_analysis',   'תרגול: ניתוח מקורות',           null,                                               'vandamme.trainee2', now() - interval '20 minutes', null, null),
  ('00000000-0000-0000-0000-0000000000b2', '00000000-0000-0000-0000-000000000013', 'fact_check',        'תרגול: בדיקת הלוגו במסמך',      'הלוגו לא תואם לגרסה הרשמית',                       'vandamme.trainee1', now() - interval '22 hours',  null, null);

------------------------------------------------------------------------------
-- 100 generated events, one per generated narrative. Every 5th is a simulation.
-- Newest 15 are open, the next 30 in progress, the rest closed.
------------------------------------------------------------------------------
INSERT INTO event (narrative_id, severity, status, is_simulation, created_by, created_at, closed_at, closed_by, closure_summary)
SELECT
  n.narrative_id,
  (ARRAY['low', 'medium', 'medium', 'high', 'high', 'critical'])[1 + floor(random() * 6)::int],
  s.status,
  g % 5 = 0,
  (ARRAY['shob.operator1', 'shob.operator2', 'shob.operator3'])[1 + floor(random() * 3)::int],
  c.created_at,
  CASE WHEN s.status = 'closed' THEN c.created_at + (6 + floor(random() * 42)) * interval '1 hour' END,
  CASE WHEN s.status = 'closed' THEN (ARRAY['vandamme.handler1', 'vandamme.handler2', 'vandamme.handler3'])[1 + floor(random() * 3)::int] END,
  CASE WHEN s.status = 'closed' THEN (ARRAY[
    'השמועה הופרכה בהודעת דו"צ והשיח דעך.',
    'זוהה מקור המידע, הועבר לגורמים הרלוונטיים.',
    'הנרטיב לא התפשט מעבר לקהל מצומצם. אין צורך בפעולה נוספת.',
    'תואם מול כתבים, פורסמה הכחשה.',
    'הסרטון זוהה כישן, הממצאים פורסמו.'])[1 + floor(random() * 5)::int] END
FROM generate_series(1, 100) g
JOIN narrative n ON n.narrative_id = 'nar-' || (1000 + g)
CROSS JOIN LATERAL (SELECT CASE WHEN g <= 15 THEN 'open' WHEN g <= 45 THEN 'in_progress' ELSE 'closed' END AS status) s
CROSS JOIN LATERAL (SELECT n.detected_at + (10 + floor(random() * 50)) * interval '1 minute' AS created_at) c;

-- 1 to 5 actions on each generated event that is in progress or closed, 40 minutes apart
INSERT INTO action (event_id, action_type, title, description, performed_by, performed_at)
SELECT
  e.event_id,
  t.code,
  CASE t.code
    WHEN 'official_response' THEN 'פורסמה הודעת דו"צ'
    WHEN 'consultation'      THEN 'התייעצות עם רמ״ד'
    WHEN 'reporter_contact'  THEN 'פנייה לכתב'
    WHEN 'external_contact'  THEN 'פנייה לגורם חיצוני'
    WHEN 'field_collection'  THEN 'איסוף מידע מהשטח'
    WHEN 'source_analysis'   THEN 'ניתוח מקורות הפרסום'
    WHEN 'fact_check'        THEN 'בדיקת אמינות הטענה'
    WHEN 'monitor'           THEN 'מעקב אחר התפשטות'
    ELSE 'פעולה אחרת'
  END,
  CASE WHEN random() < 0.5 THEN 'תיאור קצר של הפעולה #' || k END,
  (ARRAY['vandamme.handler1', 'vandamme.handler2', 'vandamme.handler3'])[1 + floor(random() * 3)::int],
  e.created_at + k * interval '40 minutes'
FROM event e
CROSS JOIN LATERAL generate_series(1, 1 + abs(hashtext(e.event_id::text)) % 5) k
CROSS JOIN LATERAL (
  SELECT code FROM action_type WHERE e.event_id IS NOT NULL ORDER BY random() LIMIT 1
) t
WHERE e.narrative_id LIKE 'nar-1%' AND e.status <> 'open';

------------------------------------------------------------------------------
-- event_log: generated from the rows above, so it always matches them
------------------------------------------------------------------------------
-- event_created for every event
INSERT INTO event_log (event_id, kind, actor_id, to_value, at)
SELECT event_id, 'event_created', created_by, 'open', created_at FROM event;

-- action_created for every action
INSERT INTO event_log (event_id, action_id, kind, actor_id, details, at)
SELECT event_id, action_id, 'action_created', performed_by,
       jsonb_build_object('action_type', action_type, 'title', title), performed_at
FROM action;

-- open -> in_progress at each event's first action
INSERT INTO event_log (event_id, kind, actor_id, from_value, to_value, at)
SELECT DISTINCT ON (event_id) event_id, 'event_status_changed', 'system', 'open', 'in_progress', performed_at
FROM action ORDER BY event_id, performed_at;

-- soft deletes
INSERT INTO event_log (event_id, action_id, kind, actor_id, at)
SELECT event_id, action_id, 'action_deleted', deleted_by, deleted_at FROM action WHERE deleted_at IS NOT NULL;

-- closes
INSERT INTO event_log (event_id, kind, actor_id, from_value, to_value, details, at)
SELECT event_id, 'event_closed', closed_by, 'in_progress', 'closed',
       jsonb_build_object('closure_summary', closure_summary), closed_at
FROM event WHERE status = 'closed';

-- updated_at = last change. The trigger would overwrite it with now(), so it is off for this update.
ALTER TABLE event DISABLE TRIGGER event_updated_at;
UPDATE event e SET updated_at = (SELECT max(at) FROM event_log l WHERE l.event_id = e.event_id);
ALTER TABLE event ENABLE TRIGGER event_updated_at;

------------------------------------------------------------------------------
-- device_token: registered phones. handler1 has two (Android and iPhone), trainee1 one that was
-- not seen for weeks. The tokens are fake, so Expo rejects them as DeviceNotRegistered.
------------------------------------------------------------------------------
INSERT INTO device_token (device_id, user_id, platform, push_token, created_at, last_seen_at) VALUES
  ('00000000-0000-0000-0000-0000000000d1', 'vandamme.handler1', 'android', 'ExponentPushToken[dev-handler1-android]', now() - interval '5 days',  now() - interval '10 minutes'),
  ('00000000-0000-0000-0000-0000000000d2', 'vandamme.handler1', 'ios',     'ExponentPushToken[dev-handler1-ios]',     now() - interval '3 days',  now() - interval '2 hours'),
  ('00000000-0000-0000-0000-0000000000d3', 'vandamme.handler2', 'ios',     'ExponentPushToken[dev-handler2-ios]',     now() - interval '4 days',  now() - interval '1 day'),
  ('00000000-0000-0000-0000-0000000000d4', 'vandamme.handler3', 'android', 'ExponentPushToken[dev-handler3-android]', now() - interval '2 days',  now() - interval '30 minutes'),
  ('00000000-0000-0000-0000-0000000000d5', 'vandamme.trainee1', 'android', 'ExponentPushToken[dev-trainee1-android]', now() - interval '30 days', now() - interval '21 days');

COMMIT;
