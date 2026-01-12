#!/bin/bash
export JWPDB="Host=jadeweserport-db.c5eu0wokuj8v.eu-north-1.rds.amazonaws.com;Port=5432;Database=jadeweserport-db;Username=master;Password=isepLapr5"

echo "Dropping Development database (SQLite)..."
dotnet ef database drop --context JWPDevDbContext -- --environment Development

echo "Dropping Production database (PostgreSQL)..."
dotnet ef database drop --context JWPDbContext -- --environment Production

echo "Both databases deleted!"