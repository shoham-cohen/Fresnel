#!/bin/sh
# Applies every db/*.sql file not applied yet, in version order (1, 2, ... 10).
# Runs as the db-migrate service on every `docker compose up`. Applied files are
# recorded in public.schema_migrations, so each file runs once per database.
set -eu

psql() { command psql -X -q -v ON_ERROR_STOP=1 "$@"; }

psql -c "CREATE TABLE IF NOT EXISTS public.schema_migrations (
  filename    text PRIMARY KEY,
  applied_at  timestamptz NOT NULL DEFAULT now()
)"

# A database created before this service existed already has 1.ddl.sql
# (Postgres ran it on the first start). Record it so it is not run again.
if [ "$(psql -tAc "SELECT count(*) FROM public.schema_migrations")" = 0 ] &&
   [ "$(psql -tAc "SELECT to_regclass('fresnel.narrative') IS NOT NULL")" = t ]; then
  psql -c "INSERT INTO public.schema_migrations (filename) VALUES ('1.ddl.sql')"
fi

for path in $(ls /db/*.sql | sort -V); do
  file=$(basename "$path")
  if [ "$(psql -tAc "SELECT count(*) FROM public.schema_migrations WHERE filename = '$file'")" = 1 ]; then
    continue
  fi
  echo "applying $file"
  psql -f "$path"
  psql -c "INSERT INTO public.schema_migrations (filename) VALUES ('$file')"
done
echo "database is up to date"
