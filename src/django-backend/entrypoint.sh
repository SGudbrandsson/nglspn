#!/bin/sh
set -e

BOOT_START=$(date +%s)
echo "[entrypoint] Starting at $(date -u '+%Y-%m-%d %H:%M:%S UTC')"

echo "[entrypoint] Running migrations..."
MIGRATE_START=$(date +%s)
uv run python manage.py migrate --noinput
MIGRATE_END=$(date +%s)
echo "[entrypoint] Migrations completed in $((MIGRATE_END - MIGRATE_START))s"

echo "[entrypoint] Starting server... (total boot time so far: $((MIGRATE_END - BOOT_START))s)"
exec "$@"
