# PrepNex Environment Check Script
# Verifies all prerequisites are installed and configured

Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "  PrepNex Environment Check" -ForegroundColor Cyan
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check .NET
Write-Host "Checking .NET SDK..." -ForegroundColor Yellow
try {
	$dotnetVersion = & dotnet --version 2>&1
	if ($LASTEXITCODE -eq 0) {
		Write-Host "  [OK] .NET SDK installed: $dotnetVersion" -ForegroundColor Green
	} else {
		Write-Host "  [FAIL] .NET SDK not found" -ForegroundColor Red
		Write-Host "         Install from: https://dotnet.microsoft.com/download" -ForegroundColor Yellow
		$allGood = $false
	}
} catch {
	Write-Host "  [FAIL] .NET SDK not found" -ForegroundColor Red
	$allGood = $false
}
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
	$nodeVersion = & node --version 2>&1
	if ($LASTEXITCODE -eq 0) {
		Write-Host "  [OK] Node.js installed: $nodeVersion" -ForegroundColor Green
	} else {
		Write-Host "  [FAIL] Node.js not found" -ForegroundColor Red
		Write-Host "         Install from: https://nodejs.org/" -ForegroundColor Yellow
		$allGood = $false
	}
} catch {
	Write-Host "  [FAIL] Node.js not found" -ForegroundColor Red
	$allGood = $false
}
Write-Host ""

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
	$npmVersion = & npm --version 2>&1
	if ($LASTEXITCODE -eq 0) {
		Write-Host "  [OK] npm installed: $npmVersion" -ForegroundColor Green
	} else {
		Write-Host "  [FAIL] npm not found" -ForegroundColor Red
		$allGood = $false
	}
} catch {
	Write-Host "  [FAIL] npm not found" -ForegroundColor Red
	$allGood = $false
}
Write-Host ""

# Check SQL Server
Write-Host "Checking SQL Server..." -ForegroundColor Yellow
$sqlServerFound = $false
try {
	$null = & sqlcmd -S localhost -Q "SELECT 1" -b 2>&1
	if ($LASTEXITCODE -eq 0) {
		Write-Host "  [OK] SQL Server accessible at localhost" -ForegroundColor Green
		$sqlServerFound = $true
	} else {
		Write-Host "  [FAIL] SQL Server not accessible at localhost" -ForegroundColor Red
		Write-Host "         Trying SQL Server Express..." -ForegroundColor Yellow
		$null = & sqlcmd -S "localhost\SQLEXPRESS" -Q "SELECT 1" -b 2>&1
		if ($LASTEXITCODE -eq 0) {
			Write-Host "  [OK] SQL Server Express found at localhost\SQLEXPRESS" -ForegroundColor Green
			Write-Host "       NOTE: Update connection string to use: Server=localhost\SQLEXPRESS" -ForegroundColor Yellow
			$sqlServerFound = $true
		} else {
			Write-Host "  [FAIL] SQL Server not found" -ForegroundColor Red
			Write-Host "         Install from: https://www.microsoft.com/sql-server/sql-server-downloads" -ForegroundColor Yellow
			$allGood = $false
		}
	}
} catch {
	Write-Host "  [FAIL] SQL Server check failed" -ForegroundColor Red
	Write-Host "         sqlcmd tool not found - install SQL Server Command Line Utilities" -ForegroundColor Yellow
	$allGood = $false
}
Write-Host ""

# Check if database exists
if ($sqlServerFound) {
	Write-Host "Checking PrepNex Database..." -ForegroundColor Yellow
	try {
		$dbCheck = & sqlcmd -S localhost -d master -Q "SELECT name FROM sys.databases WHERE name = 'PrepNex'" -h -1 -W 2>&1
		if ($dbCheck -match "PrepNex") {
			Write-Host "  [OK] PrepNex database exists" -ForegroundColor Green

			# Check if tables exist
			$tableCount = & sqlcmd -S localhost -d PrepNex -Q "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'" -h -1 -W 2>&1
			$tableCountNum = ($tableCount | Select-String -Pattern '\d+').Matches[0].Value
			Write-Host "  [OK] Database has $tableCountNum tables" -ForegroundColor Green

			# Check if questions exist
			$questionCount = & sqlcmd -S localhost -d PrepNex -Q "SELECT COUNT(*) FROM Questions" -h -1 -W 2>&1
			if ($questionCount -match "\d+") {
				$questionCountNum = ($questionCount | Select-String -Pattern '\d+').Matches[0].Value
				Write-Host "  [OK] Database has $questionCountNum questions seeded" -ForegroundColor Green
			}
		} else {
			Write-Host "  [WARN] PrepNex database not found" -ForegroundColor Yellow
			Write-Host "         Run: .\setup-database.ps1" -ForegroundColor Gray
		}
	} catch {
		Write-Host "  [WARN] Could not check database (may not exist yet)" -ForegroundColor Yellow
	}
	Write-Host ""
}

# Check project files
Write-Host "Checking Project Files..." -ForegroundColor Yellow
$apiProject = Test-Path "API\PrepNex.csproj"
$frontendPackage = Test-Path "Frontend\package.json"

if ($apiProject) {
	Write-Host "  [OK] Backend project found" -ForegroundColor Green
} else {
	Write-Host "  [FAIL] Backend project not found" -ForegroundColor Red
	$allGood = $false
}

if ($frontendPackage) {
	Write-Host "  [OK] Frontend project found" -ForegroundColor Green
} else {
	Write-Host "  [FAIL] Frontend project not found" -ForegroundColor Red
	$allGood = $false
}

$frontendModules = Test-Path "Frontend\node_modules"
if ($frontendModules) {
	Write-Host "  [OK] Frontend dependencies installed" -ForegroundColor Green
} else {
	Write-Host "  [WARN] Frontend dependencies not installed" -ForegroundColor Yellow
	Write-Host "         Run: cd Frontend; npm install" -ForegroundColor Gray
}
Write-Host ""

# Check configuration files
Write-Host "Checking Configuration..." -ForegroundColor Yellow
$appsettings = Test-Path "API\appsettings.json"
$frontendEnv = Test-Path "Frontend\.env"

if ($appsettings) {
	Write-Host "  [OK] Backend configuration found" -ForegroundColor Green
	try {
		$config = Get-Content "API\appsettings.json" -Raw | ConvertFrom-Json
		$connString = $config.ConnectionStrings.DefaultConnection
		Write-Host "       Connection: $connString" -ForegroundColor Gray
	} catch {
		Write-Host "       Could not read connection string" -ForegroundColor Gray
	}
} else {
	Write-Host "  [FAIL] Backend configuration missing" -ForegroundColor Red
	$allGood = $false
}

if ($frontendEnv) {
	Write-Host "  [OK] Frontend configuration found" -ForegroundColor Green
	try {
		$envContent = Get-Content "Frontend\.env" | Where-Object { $_ -match "VITE_API_BASE_URL" }
		Write-Host "       $envContent" -ForegroundColor Gray
	} catch {
		Write-Host "       Could not read .env file" -ForegroundColor Gray
	}
} else {
	Write-Host "  [FAIL] Frontend configuration missing" -ForegroundColor Red
	$allGood = $false
}
Write-Host ""

# Summary
Write-Host "===========================================================" -ForegroundColor Cyan
if ($allGood) {
	Write-Host "  [SUCCESS] All prerequisites met!" -ForegroundColor Green
	Write-Host ""
	Write-Host "  Ready to start PrepNex!" -ForegroundColor White
	Write-Host "  Run: .\start-prepnex.ps1" -ForegroundColor Cyan
} else {
	Write-Host "  [WARNING] Some prerequisites are missing" -ForegroundColor Yellow
	Write-Host ""
	Write-Host "  Please install missing components and try again." -ForegroundColor White
	Write-Host "  See QUICK_START.md for detailed instructions." -ForegroundColor Gray
}
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host ""
