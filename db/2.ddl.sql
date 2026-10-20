-- Migration: 1729339200000-new-narratives-entity
-- Branch: feat/fetch-narratives
-- Apply to an existing DB (after 1.ddl.sql):
--   psql $DATABASE_URL -f db/2.ddl.sql

SET search_path = fresnel, public;

-- ---------------------------------------------------------------------------
-- 1. narrative: reshape the table to match the updated entity
-- ---------------------------------------------------------------------------

-- 1a. Drop columns that no longer exist in the entity.
ALTER TABLE narrative
  DROP COLUMN IF EXISTS location_name,
  DROP COLUMN IF EXISTS payload;

-- 1b. narrative_id: text -> uuid (event.narrative_id references it, so both change together).
--     Existing ids must be valid UUIDs, otherwise the cast fails.
ALTER TABLE event
  DROP CONSTRAINT IF EXISTS event_narrative_id_fkey;

ALTER TABLE narrative
  ALTER COLUMN narrative_id TYPE uuid USING narrative_id::uuid;

ALTER TABLE event
  ALTER COLUMN narrative_id TYPE uuid USING narrative_id::uuid;

ALTER TABLE event
  ADD CONSTRAINT event_narrative_id_fkey
  FOREIGN KEY (narrative_id) REFERENCES narrative (narrative_id);

-- 1c. arena: widen from text (single value) to text[] (multi-arena) and move
--     from the old codes (IL / ARAB / INTL) to the entity's Arena enum values
--     (israel / arab / intl).
ALTER TABLE narrative
  DROP CONSTRAINT IF EXISTS narrative_arena_check;

ALTER TABLE narrative
  ALTER COLUMN arena TYPE text[]
    USING CASE arena
            WHEN 'IL'   THEN ARRAY['israel']
            WHEN 'ARAB' THEN ARRAY['arab']
            WHEN 'INTL' THEN ARRAY['intl']
            ELSE '{}'::text[]
          END;

-- 1d. Add the new aggregate / metadata columns. Added nullable, backfilled,
--     then made NOT NULL to match the entity.
ALTER TABLE narrative
  ADD COLUMN IF NOT EXISTS item_list    text[],
  ADD COLUMN IF NOT EXISTS platforms    text[],
  ADD COLUMN IF NOT EXISTS shares_count bigint,
  ADD COLUMN IF NOT EXISTS views_count  bigint,
  ADD COLUMN IF NOT EXISTS languages    text[],
  ADD COLUMN IF NOT EXISTS is_flagged   boolean NOT NULL DEFAULT false;

UPDATE narrative SET
  summary      = COALESCE(summary, ''),
  item_list    = COALESCE(item_list, '{}'),
  platforms    = COALESCE(platforms, '{}'),
  shares_count = COALESCE(shares_count, 0),
  views_count  = COALESCE(views_count, 0),
  languages    = COALESCE(languages, '{}');

ALTER TABLE narrative
  ALTER COLUMN summary      SET NOT NULL,
  ALTER COLUMN arena        SET NOT NULL,
  ALTER COLUMN item_list    SET NOT NULL,
  ALTER COLUMN platforms    SET NOT NULL,
  ALTER COLUMN shares_count SET NOT NULL,
  ALTER COLUMN views_count  SET NOT NULL,
  ALTER COLUMN languages    SET NOT NULL;

-- received_at stays NOT NULL DEFAULT now() (entity: required Date).

-- ---------------------------------------------------------------------------
-- 2. simulated_narrative: new table for simulation runs
--    Composite PK (narrative_id, simulation_id) so the same source narrative
--    can appear in multiple simulation runs.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS simulated_narrative (
  narrative_id   uuid NOT NULL REFERENCES narrative (narrative_id) ON DELETE CASCADE,
  simulation_id  uuid NOT NULL,
  PRIMARY KEY (narrative_id, simulation_id)
);

CREATE INDEX IF NOT EXISTS simulated_narrative_simulation_idx
  ON simulated_narrative (simulation_id);
