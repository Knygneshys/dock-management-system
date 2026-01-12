[CmdletBinding()]
param()

Write-Host "Updating Development database (SQLite)..."
dotnet ef database update --context JWPDevDbContext -- --environment Development

Write-Host "Updating Production database (PostgreSQL)..."
dotnet ef database update --context JWPDbContext -- --environment Production

Write-Host "Both databases updated!"