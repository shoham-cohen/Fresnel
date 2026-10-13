-- Van Damme (event management) – section DB schema, v0.2 (2026-10-12)
-- Lives in the section DB of מדור Fresnel (מדור תמונת מצב: שו"ב, Van Damme, mobile), schema "fresnel" (one schema for the whole section).
-- Stores events, actions, approvals, chat and an audit log.
-- Anyone who can open an event can write in its chat; there is no participant list.
-- Items are NOT stored here, not even their ids: an event's items are fetched live from
-- Anomalies by the event's origin_ref_id (anomaly/narrative id). Items follow item.v1.
-- User ids are the Keycloak/Mirage subject (text). Names and job titles come from Mirage.
-- v0.2: aligned with the Figma screens – documented actions, a two-stage approval
-- (field, then HQ) followed by publication, chat attachments, reopening.
-- The "ניטור אירוע" panel shows the event's items from Anomalies; Akinator chats are not stored here.

CREATE EXTENSION IF NOT EXISTS pg_trgm;       -- title search on the event lists

CREATE SCHEMA IF NOT EXISTS fresnel;
SET search_path = fresnel, public;

-- Keeps updated_at current on every UPDATE
CREATE FUNCTION set_updated_at() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END $$;

-- Rejects UPDATE and DELETE on append-only tables
CREATE FUNCTION forbid_change() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION '% is append-only', TG_TABLE_NAME;
END $$;

------------------------------------------------------------------------------
-- event: one row per event opened from an anomaly or narrative in the שו"ב
------------------------------------------------------------------------------
CREATE TABLE event (
  event_id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title            text NOT NULL CHECK (title <> ''),
  description      text,                         -- "תיאור כללי"
  arena            text NOT NULL CHECK (arena IN ('IL', 'ARAB', 'INTL')),   -- same codes as item.v1
  severity         text NOT NULL DEFAULT 'medium'
                   CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status           text NOT NULL DEFAULT 'open'
                   CHECK (status IN ('open', 'in_progress', 'awaiting_approval', 'closed')),
  -- where it came from: an anomaly or a narrative from Anomalies (via the שו"ב), or opened by hand
  origin_kind      text NOT NULL CHECK (origin_kind IN ('anomaly', 'narrative', 'manual')),
  origin_ref_id    text,                         -- anomaly/narrative id in Anomalies; the key for fetching
                                                 -- the event's items. NULL when manual (no items)
  detected_at      timestamptz,                  -- "זיהוי האירוע": when Anomalies detected it
  owner_id         text NOT NULL,                -- who handles the event
  created_by       text NOT NULL,                -- "נפתח על ידי": who turned it into an event in the שו"ב
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),   -- "עדכון אחרון"
  closed_at        timestamptz,                  -- cleared on reopen; the history stays in event_log
  closed_by        text,
  closure_summary  text,                         -- sent to the debrief team on close
  CHECK ((origin_kind = 'manual') = (origin_ref_id IS NULL)),
  CHECK ((status = 'closed') = (closed_at IS NOT NULL)),
  CHECK (status <> 'closed' OR (closed_by IS NOT NULL AND closure_summary IS NOT NULL))
);

-- At most one open event per anomaly/narrative, so the שו"ב cannot open it twice
CREATE UNIQUE INDEX event_open_origin_uq ON event (origin_kind, origin_ref_id)
  WHERE status <> 'closed' AND origin_ref_id IS NOT NULL;
CREATE INDEX event_board_idx ON event (status, created_at DESC);              -- open list / closed list
CREATE INDEX event_closed_idx ON event (closed_at DESC) WHERE status = 'closed';  -- closed list date filter
CREATE INDEX event_title_trgm_idx ON event USING gin (title gin_trgm_ops);    -- "חיפוש לפי כותרת"
CREATE TRIGGER event_updated_at BEFORE UPDATE ON event
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

------------------------------------------------------------------------------
-- action_type: the action bank. 'other' takes a free description.
------------------------------------------------------------------------------
CREATE TABLE action_type (
  code               text PRIMARY KEY,
  label_he           text NOT NULL,
  requires_approval  boolean NOT NULL DEFAULT false,
  active             boolean NOT NULL DEFAULT true,
  sort_order         smallint NOT NULL DEFAULT 0
);

-- Draft bank, taken from the names in the Figma screens. Only the spokesperson message needs
-- approval (decided 2026-10-12). The rest is to confirm with the client.
INSERT INTO action_type (code, label_he, requires_approval, sort_order) VALUES
  ('official_response',  'הודעת דו"צ',            true,  10),
  ('consultation',       'התייעצות',              false, 20),
  ('reporter_contact',   'תיאום עם כתב',          false, 30),
  ('external_contact',   'פנייה לגורם חיצוני',     false, 40),
  ('field_collection',   'איסוף מידע מהשטח',       false, 50),
  ('source_analysis',    'ניתוח מקורות',           false, 60),
  ('fact_check',         'בדיקת אמינות מידע',      false, 70),
  ('monitor',            'מעקב אחר התפתחות',       false, 80),
  ('other',              'אחר',                   false, 99);

------------------------------------------------------------------------------
-- action: an action documented inside an event ("פעולות שבוצעו").
-- A regular action is recorded after it was done. A spokesperson message
-- (official_response) goes through approval and then publication.
------------------------------------------------------------------------------
CREATE TABLE action (
  action_id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id       uuid NOT NULL REFERENCES event,
  action_type    text NOT NULL REFERENCES action_type,
  title          text NOT NULL CHECK (title <> '' AND char_length(title) <= 100),
  description    text CHECK (char_length(description) <= 500),   -- "תיאור קצר" of a regular action
  content        text CHECK (char_length(content) <= 2000),      -- the message text, for official_response
  status         text NOT NULL DEFAULT 'done'
                 CHECK (status IN ('done',                 -- regular action, documented
                                   'awaiting_approval',    -- message waiting for the current approval stage
                                   'rejected',             -- message sent back; can be fixed and resent
                                   'approved',             -- every stage approved, not yet published
                                   'published',            -- "ההודעה פורסמה"
                                   'cancelled')),
  performed_by   text NOT NULL,                  -- "בוצע על ידי"
  performed_at   timestamptz NOT NULL DEFAULT now(),
  published_by   text,
  published_at   timestamptz,
  publish_note   text,                           -- e.g. "ההודעה פורסמה בכל הערוצים"
  updated_at     timestamptz NOT NULL DEFAULT now(),
  CHECK (action_type <> 'official_response' OR coalesce(content, '') <> ''),
  CHECK (action_type = 'official_response' OR coalesce(description, '') <> ''),
  CHECK ((status = 'published') = (published_at IS NOT NULL AND published_by IS NOT NULL))
);
CREATE INDEX action_event_idx ON action (event_id, performed_at);
CREATE INDEX action_pending_idx ON action (status) WHERE status = 'awaiting_approval';
CREATE TRIGGER action_updated_at BEFORE UPDATE ON action
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

------------------------------------------------------------------------------
-- action_approval: one row per stage decision. A message passes 'field' (אישור שטח)
-- and then 'hq' (אישור מטה). A rejection sends it back; the next submission starts
-- again at 'field', so an action can have several rows per stage.
------------------------------------------------------------------------------
CREATE TABLE action_approval (
  approval_id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_id         uuid NOT NULL REFERENCES action,
  stage             text NOT NULL CHECK (stage IN ('field', 'hq')),
  content_snapshot  text NOT NULL,               -- the exact text that was approved or rejected
  requested_by      text NOT NULL,
  requested_at      timestamptz NOT NULL DEFAULT now(),
  decision          text CHECK (decision IN ('approved', 'rejected')),   -- NULL while pending
  decided_by        text,                        -- must hold that stage's approver role in Mirage
  decided_at        timestamptz,
  note              text,                        -- e.g. "תקין, ניתן להעביר לאישור מטה"
  client            text CHECK (client IN ('web', 'mobile')),            -- where the decision was made
  CHECK ((decision IS NULL) = (decided_by IS NULL) AND (decision IS NULL) = (decided_at IS NULL)),
  CHECK (decided_by IS NULL OR decided_by <> requested_by),             -- no self-approval
  CHECK (decision IS DISTINCT FROM 'rejected' OR coalesce(note, '') <> '')  -- a rejection says why
);
-- One open request per action at a time
CREATE UNIQUE INDEX action_approval_pending_uq ON action_approval (action_id) WHERE decision IS NULL;
CREATE INDEX action_approval_inbox_idx ON action_approval (stage, requested_at) WHERE decision IS NULL;

------------------------------------------------------------------------------
-- chat_message: the chat inside an event
------------------------------------------------------------------------------
CREATE TABLE chat_message (
  message_id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id             uuid NOT NULL REFERENCES event,
  author_id            text NOT NULL,
  body                 text NOT NULL DEFAULT '',  -- may be empty when the message is only an attachment
  reply_to_message_id  uuid REFERENCES chat_message,
  client               text NOT NULL DEFAULT 'web' CHECK (client IN ('web', 'mobile')),
  created_at           timestamptz NOT NULL DEFAULT now(),
  edited_at            timestamptz,
  deleted_at           timestamptz               -- soft delete: the message stays for the debrief
);
CREATE INDEX chat_event_idx ON chat_message (event_id, created_at);

-- Files attached to a chat message (the paperclip). The file is in object storage, not in the DB.
CREATE TABLE chat_attachment (
  attachment_id  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id     uuid NOT NULL REFERENCES chat_message,
  file_name      text NOT NULL,
  content_type   text NOT NULL,
  size_bytes     bigint NOT NULL CHECK (size_bytes > 0),
  storage_uri    text NOT NULL,                  -- s3://... in the section's bucket
  uploaded_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX chat_attachment_message_idx ON chat_attachment (message_id);

------------------------------------------------------------------------------
-- event_log: append-only audit trail of every change. It feeds the timeline in the
-- closed-event view (פתיחת אירוע ... סגירת אירוע) and, with the chat, the debrief.
------------------------------------------------------------------------------
CREATE TABLE event_log (
  log_id      bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_id    uuid NOT NULL REFERENCES event,
  action_id   uuid REFERENCES action,
  kind        text NOT NULL CHECK (kind IN (
                'event_created', 'event_updated', 'event_status_changed',
                'event_closed', 'event_reopened',
                'action_created', 'action_updated', 'action_cancelled',
                'approval_requested', 'approval_decided', 'action_published')),
  actor_id    text NOT NULL,                     -- user id, or 'system'
  from_value  text,
  to_value    text,
  details     jsonb NOT NULL DEFAULT '{}',
  client      text NOT NULL DEFAULT 'web' CHECK (client IN ('web', 'mobile', 'system')),
  at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX event_log_event_idx ON event_log (event_id, at);
CREATE TRIGGER event_log_append_only BEFORE UPDATE OR DELETE ON event_log
  FOR EACH ROW EXECUTE FUNCTION forbid_change();
