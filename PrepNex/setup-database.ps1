# PrepNex Database Setup Script
# This script sets up the SQL Server database for PrepNex

Write-Host "=== PrepNex Database Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if SQL Server is accessible
Write-Host "Checking SQL Server connection..." -ForegroundColor Yellow
try {
	$testConnection = sqlcmd -S localhost -Q "SELECT @@VERSION" -b 2>&1
	if ($LASTEXITCODE -ne 0) {
		Write-Host "ERROR: Cannot connect to SQL Server at localhost" -ForegroundColor Red
		Write-Host "Please ensure SQL Server is installed and running." -ForegroundColor Red
		Write-Host ""
		Write-Host "Download SQL Server Express: https://aka.ms/ssmsfullsetup" -ForegroundColor Yellow
		exit 1
	}
	Write-Host "✓ SQL Server is accessible" -ForegroundColor Green
} catch {
	Write-Host "ERROR: Cannot connect to SQL Server: $_" -ForegroundColor Red
	exit 1
}

Write-Host ""

# Apply schema
Write-Host "Applying database schema..." -ForegroundColor Yellow
try {
	$schemaResult = sqlcmd -S localhost -d master -i "API\Database\schema.sql" -b 2>&1
	if ($LASTEXITCODE -ne 0) {
		Write-Host "ERROR: Failed to apply schema" -ForegroundColor Red
		Write-Host $schemaResult
		exit 1
	}
	Write-Host "✓ Schema applied successfully" -ForegroundColor Green
} catch {
	Write-Host "ERROR applying schema: $_" -ForegroundColor Red
	exit 1
}

Write-Host ""

# Apply seed data
Write-Host "Applying seed data..." -ForegroundColor Yellow
try {
	$seedResult = sqlcmd -S localhost -d PrepNex -i "API\Database\seed.sql" -b 2>&1
	if ($LASTEXITCODE -ne 0) {
		Write-Host "ERROR: Failed to apply seed data" -ForegroundColor Red
		Write-Host $seedResult
		exit 1
	}
	Write-Host "✓ Seed data applied successfully" -ForegroundColor Green
} catch {
	Write-Host "ERROR applying seed data: $_" -ForegroundColor Red
	exit 1
}

Write-Host ""
Write-Host "=== Database setup complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Build and run the API:" -ForegroundColor White
Write-Host "   cd API" -ForegroundColor Gray
Write-Host "   dotnet run" -ForegroundColor Gray
Write-Host ""
Write-Host "2. In a new terminal, start the frontend:" -ForegroundColor White
Write-Host "   cd Frontend" -ForegroundColor Gray
Write-Host "   npm install" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Open your browser to http://localhost:5173" -ForegroundColor White
Write-Host ""
