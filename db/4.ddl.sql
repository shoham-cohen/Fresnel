-- v0.8 (20/10): the arenas of the phone's user, for mobile Push. Owned by Marconi.
-- The Keycloak token carries the user's arenas (claim `compartment`). POST /api/devices copies them
-- here on every registration, so the Push sender finds the phones of an arena without asking
-- Keycloak. They refresh every time the app registers its token (each sign-in and app start).
-- Values follow the Arena enum of narrative.arena (israel / arab / intl).
-- Touches device_token only.

SET search_path = fresnel, public;

ALTER TABLE device_token
  ADD COLUMN IF NOT EXISTS arenas text[] NOT NULL DEFAULT '{}'
    CONSTRAINT device_token_arenas_check CHECK (arenas <@ ARRAY['israel', 'arab', 'intl']::text[]);

-- The phones of an arena: WHERE arenas && ARRAY['israel']
CREATE INDEX IF NOT EXISTS device_token_arenas_idx ON device_token USING gin (arenas);
