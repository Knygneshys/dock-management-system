[CmdletBinding()]
param(
    [string]$Name
);

Write-Host "Adding migration for production (PostgreSQL)";
dotnet ef migrations add "${Name}_Postgres" `
    --context "JWPDbContext" `
    --output-dir "Data/Migrations/PostgresMigrations" `
    -- --environment Production
        
Write-Host "Adding migration for development (SQLite)";
dotnet ef migrations add "${Name}_Sqlite" `
    --context "JWPDevDbContext" `
    --output-dir "Data/Migrations/SqliteMigrations" `
    -- --environment Development