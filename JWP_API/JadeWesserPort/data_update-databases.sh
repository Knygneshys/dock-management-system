#!/bin/bash

export JWPDB="Host=jadeweserport-db.c5eu0wokuj8v.eu-north-1.rds.amazonaws.com;Port=5432;Database=jadeweserport-db;Username=master;Password=isepLapr5"

echo "Updating Development database (SQLite)..."
dotnet ef database update --context JWPDevDbContext -- --environment Development

echo "Updating Production database (PostgreSQL)..."
dotnet ef database update --context JWPDbContext -- --environment Production

echo "Both databases updated!"