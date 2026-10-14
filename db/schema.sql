-- Fresnel section DB schema (שו"ב + Van Damme), v0.5 (2026-10-14)
-- Lives in the section DB of מדור Fresnel (מדור תמונת מצב: שו"ב, Van Damme, mobile), schema "fresnel" (one schema for the whole section).
-- Stores every narrative Anomalies sends (written by the שו"ב), the events opened on them,
-- the actions documented in events, and an audit log.
-- Items are NOT stored here, not even their ids: an event's items are fetched live from
-- Anomalies by its narrative's id. Items follow item.v1.
-- User ids are the Keycloak/Mirage subject (text). Names and job titles come from Mirage.
-- v0.3 (spec change 14/10): no chat, no approvals. Actions only document what was already done.
-- The event screen has an Akinator tab; Akinator conversations are not stored here.
-- v0.4: simulation events. Osher's simulation system can send past events to train users.
-- They get is_simulation = true and are handled like any other event. The אמת / תרגילית
-- switch in the UI picks which kind is shown.
-- v0.5: narratives. The שו"ב stores every narrative from Anomalies in `narrative`; an anomaly is
-- a narrative with is_anomaly = true (recommended to open an event on). An event points to its
-- narrative instead of origin_kind / origin_ref_id. Narratives carry an embedding for
-- natural-language search.

CREATE EXTENSION IF NOT EXISTS pg_trgm;       -- title search on the event lists
CREATE EXTENSION IF NOT EXISTS vector;        -- pgvector, narrative embeddings

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
-- narrative: every narrative Anomalies sends to the שו"ב. Owned and written by the שו"ב.
-- Columns beyond the id, flag and embedding follow the שו"ב screens and are to confirm with Anomalies.
------------------------------------------------------------------------------
CREATE TABLE narrative (
  narrative_id   text PRIMARY KEY,               -- the narrative id in Anomalies; also the key for fetching its items
  title          text NOT NULL,                  -- "נושא ההתראה"
  summary        text,                           -- the line under the title
  is_anomaly     boolean NOT NULL DEFAULT false, -- Anomalies recommends opening an event on it
  arena          text CHECK (arena IN ('IL', 'ARAB', 'INTL')),   -- same codes as item.v1
  category       text,                           -- בטחוני / מדיני / הסברה / פנים / אחר
  location_name  text,                           -- "מיקום", e.g. גבול הצפון
  detected_at    timestamptz NOT NULL,           -- when Anomalies detected it
  post_count     bigint,                         -- "כמות פרסומים"
  view_count     bigint,                         -- "סה"כ צפיות"
  share_count    bigint,                         -- "סה"כ שיתופים"
  source_count   bigint,                         -- "כמות מקורות"
  embedding      vector(1024),                   -- the narrative in vector space, for natural-language search.
                                                 -- Same model and dimension as Artemis embeddings (Cohere / BGE-M3, both 1024).
  payload        jsonb NOT NULL DEFAULT '{}',    -- the message as Anomalies sent it, for fields not mapped to columns
  received_at    timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX narrative_list_idx ON narrative (detected_at DESC);                                -- "כל ההתראות", history
CREATE INDEX narrative_anomaly_idx ON narrative (detected_at DESC) WHERE is_anomaly;
CREATE INDEX narrative_title_trgm_idx ON narrative USING gin (title gin_trgm_ops);              -- search by topic / word
CREATE INDEX narrative_embedding_idx ON narrative USING hnsw (embedding vector_cosine_ops);      -- natural-language search
CREATE TRIGGER narrative_updated_at BEFORE UPDATE ON narrative
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

------------------------------------------------------------------------------
-- event: one row per event opened on a narrative in the שו"ב, sent by the simulation system, or opened by hand
------------------------------------------------------------------------------
CREATE TABLE event (
  event_id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title            text NOT NULL CHECK (title <> ''),
  description      text,                         -- "תיאור כללי"
  arena            text NOT NULL CHECK (arena IN ('IL', 'ARAB', 'INTL')),   -- same codes as item.v1
  severity         text NOT NULL DEFAULT 'medium'
                   CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status           text NOT NULL DEFAULT 'open'
                   CHECK (status IN ('open', 'in_progress', 'closed')),     -- in_progress once an action is documented
  narrative_id     text REFERENCES narrative,    -- the narrative it was opened on; its items come from Anomalies
                                                 -- by this id. NULL when opened by hand (no items).
                                                 -- A simulation event points to the original narrative.
  is_simulation    boolean NOT NULL DEFAULT false,   -- sent by the simulation system ("תרגילית"), not the שו"ב.
                                                 -- Gets its own event_id, returned in the create response.
  detected_at      timestamptz,                  -- "זיהוי האירוע": when Anomalies detected it
  owner_id         text NOT NULL,                -- who handles the event
  created_by       text NOT NULL,                -- "נפתח על ידי": who turned it into an event in the שו"ב
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),   -- "עדכון אחרון"
  closed_at        timestamptz,                  -- cleared on reopen; the history stays in event_log
  closed_by        text,
  closure_summary  text,                         -- sent to the debrief team on close
  CHECK ((status = 'closed') = (closed_at IS NOT NULL)),
  CHECK (status <> 'closed' OR (closed_by IS NOT NULL AND closure_summary IS NOT NULL))
);

-- At most one open real event per narrative, so the שו"ב cannot open it twice.
-- Simulation events are left out: they reuse past narratives, and the same one can be
-- sent again for another training run.
CREATE UNIQUE INDEX event_open_narrative_uq ON event (narrative_id)
  WHERE status <> 'closed' AND narrative_id IS NOT NULL AND NOT is_simulation;
CREATE INDEX event_narrative_idx ON event (narrative_id);                      -- "is there an event on this narrative?"
CREATE INDEX event_board_idx ON event (is_simulation, status, created_at DESC);   -- open list / closed list, per אמת / תרגילית
CREATE INDEX event_closed_idx ON event (is_simulation, closed_at DESC) WHERE status = 'closed';  -- closed list date filter
CREATE INDEX event_title_trgm_idx ON event USING gin (title gin_trgm_ops);    -- "חיפוש לפי כותרת"
CREATE TRIGGER event_updated_at BEFORE UPDATE ON event
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

------------------------------------------------------------------------------
-- action_type: the action bank, chosen from a dropdown. With 'other' the title says what was done.
------------------------------------------------------------------------------
CREATE TABLE action_type (
  code        text PRIMARY KEY,
  label_he    text NOT NULL,
  active      boolean NOT NULL DEFAULT true
);

-- Draft bank, taken from the names in the Figma screens. To confirm with the client.
INSERT INTO action_type (code, label_he) VALUES
  ('official_response',  'הודעת דו"צ'),
  ('consultation',       'התייעצות'),
  ('reporter_contact',   'תיאום עם כתב'),
  ('external_contact',   'פנייה לגורם חיצוני'),
  ('field_collection',   'איסוף מידע מהשטח'),
  ('source_analysis',    'ניתוח מקורות'),
  ('fact_check',         'בדיקת אמינות מידע'),
  ('monitor',            'מעקב אחר התפתחות'),
  ('other',              'אחר');

------------------------------------------------------------------------------
-- action: an action documented inside an event ("פעולות שבוצעו"), after it was done.
-- No approvals and no workflow. A mistaken entry is soft-deleted, so the record stays.
------------------------------------------------------------------------------
CREATE TABLE action (
  action_id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id       uuid NOT NULL REFERENCES event,
  action_type    text NOT NULL REFERENCES action_type,
  title          text NOT NULL CHECK (title <> '' AND char_length(title) <= 100),
  description    text CHECK (char_length(description) <= 500),   -- "תיאור קצר", optional
  performed_by   text NOT NULL,                  -- "בוצע על ידי"
  performed_at   timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  deleted_at     timestamptz,
  deleted_by     text,
  CHECK ((deleted_at IS NULL) = (deleted_by IS NULL))
);
CREATE INDEX action_event_idx ON action (event_id, performed_at) WHERE deleted_at IS NULL;
CREATE TRIGGER action_updated_at BEFORE UPDATE ON action
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

------------------------------------------------------------------------------
-- event_log: append-only audit trail of every change. It feeds the timeline in the
-- closed-event view (פתיחת אירוע ... סגירת אירוע) and the debrief.
------------------------------------------------------------------------------
CREATE TABLE event_log (
  log_id      bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_id    uuid NOT NULL REFERENCES event,
  action_id   uuid REFERENCES action,
  kind        text NOT NULL CHECK (kind IN (
                'event_created', 'event_updated', 'event_status_changed',
                'event_closed', 'event_reopened',
                'action_created', 'action_updated', 'action_deleted')),
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
