[CmdletBinding()]
param()

Write-Host "Dropping Development database (SQLite)..."
dotnet ef database drop --context JWPDevDbContext -- --environment Development

Write-Host "Dropping Production database (PostgreSQL)..."
dotnet ef database drop --context JWPDbContext -- --environment Production

Write-Host "Both databases deleted!"