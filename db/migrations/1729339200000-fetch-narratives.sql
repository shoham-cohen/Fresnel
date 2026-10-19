-- Migration: 1729339200000-fetch-narratives
-- Branch: feat/fetch-narratives
-- Apply to an existing DB:
--   psql $DATABASE_URL -f db/migrations/1729339200000-fetch-narratives.sql
-- Fresh local DB: docker compose down -v && docker compose up -d
--   (docker mounts db/ but not db/migrations/, so this file must be applied manually)

SET search_path = fresnel, public;

-- ---------------------------------------------------------------------------
-- 1. narrative: reshape the table to match the agreed field list (v0.8)
-- ---------------------------------------------------------------------------

-- 1a. Drop columns that no longer exist in the entity.
ALTER TABLE narrative
  DROP COLUMN IF EXISTS location_name,
  DROP COLUMN IF EXISTS payload,
  DROP COLUMN IF EXISTS received_at,
  DROP COLUMN IF EXISTS is_event;

-- 1b. arena: widen from text (single value) to text[] (multi-arena).
--     Drop the inline CHECK constraint first (PostgreSQL auto-names it).
ALTER TABLE narrative
  DROP CONSTRAINT IF EXISTS narrative_arena_check;

ALTER TABLE narrative
  ALTER COLUMN arena TYPE text[]
    USING CASE WHEN arena IS NULL THEN NULL ELSE ARRAY[arena] END;

-- 1c. Add the new aggregate / metadata columns (all nullable so existing rows are safe).
ALTER TABLE narrative
  ADD COLUMN IF NOT EXISTS item_list    text[],
  ADD COLUMN IF NOT EXISTS platforms    text[],
  ADD COLUMN IF NOT EXISTS shares_count bigint,
  ADD COLUMN IF NOT EXISTS views_count  bigint,
  ADD COLUMN IF NOT EXISTS languages    text[],
  ADD COLUMN IF NOT EXISTS is_flagged   boolean NOT NULL DEFAULT false;

-- ---------------------------------------------------------------------------
-- 2. simulated_narrative: new table for simulation runs
--    Composite PK (narrative_id, simulation_id) so the same source narrative
--    can appear in multiple simulation runs.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS simulated_narrative (
  narrative_id   text NOT NULL REFERENCES narrative (narrative_id),
  simulation_id  uuid NOT NULL,
  PRIMARY KEY (narrative_id, simulation_id)
);
