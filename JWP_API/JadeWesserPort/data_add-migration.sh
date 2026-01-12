#!/bin/bash

if [ -z "$1" ]; then
    echo "Error: Insert Name"
    echo "Use: $0 <migration_name>"
    exit 1
fi

NAME="$1"

export JWPDB="Host=jadeweserport-db.c5eu0wokuj8v.eu-north-1.rds.amazonaws.com;Port=5432;Database=jadeweserport-db;Username=master;Password=isepLapr5"
echo "Adding migration for production (PostgreSQL)..."
dotnet ef migrations add "${NAME}_Postgres" \
    --context "JWPDbContext" \
    --output-dir "Data/Migrations/PostgresMigrations" \
    -- --environment Production

echo "Adding migration for development (SQLite)..."
dotnet ef migrations add "${NAME}_Sqlite" \
    --context "JWPDevDbContext" \
    --output-dir "Data/Migrations/SqliteMigrations" \
    -- --environment Development