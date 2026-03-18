#!/bin/bash
set -e

echo "=========================================="
echo "Initializing E-Bike Database..."
echo "=========================================="

# Export PostgreSQL connection info
export PGPASSWORD=$POSTGRES_PASSWORD

# Run initialization SQL files
echo "1. Creating extensions..."
psql -h localhost -U $POSTGRES_USER -d $POSTGRES_DB -f /docker-entrypoint-initdb.d/01-init-extensions.sql

echo "2. Creating schemas..."
psql -h localhost -U $POSTGRES_USER -d $POSTGRES_DB -f /docker-entrypoint-initdb.d/02-create-extensions.sql

echo "=========================================="
echo "Database initialization complete!"
echo "=========================================="