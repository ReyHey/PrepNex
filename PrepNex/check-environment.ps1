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
	$dotnetVersion = dotnet --version 2>&1
	if ($LASTEXITCODE -eq 0) {
		Write-Host "  ✓ .NET SDK installed: $dotnetVersion" -ForegroundColor Green
	} else {
		Write-Host "  ✗ .NET SDK not found" -ForegroundColor Red
		Write-Host "    Install from: https://dotnet.microsoft.com/download" -ForegroundColor Yellow
		$allGood = $false
	}
} catch {
	Write-Host "  ✗ .NET SDK not found" -ForegroundColor Red
	$allGood = $false
}
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
	$nodeVersion = node --version 2>&1
	if ($LASTEXITCODE -eq 0) {
		Write-Host "  ✓ Node.js installed: $nodeVersion" -ForegroundColor Green
	} else {
		Write-Host "  ✗ Node.js not found" -ForegroundColor Red
		Write-Host "    Install from: https://nodejs.org/" -ForegroundColor Yellow
		$allGood = $false
	}
} catch {
	Write-Host "  ✗ Node.js not found" -ForegroundColor Red
	$allGood = $false
}
Write-Host ""

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
	$npmVersion = npm --version 2>&1
	if ($LASTEXITCODE -eq 0) {
		Write-Host "  ✓ npm installed: $npmVersion" -ForegroundColor Green
	} else {
		Write-Host "  ✗ npm not found" -ForegroundColor Red
		$allGood = $false
	}
} catch {
	Write-Host "  ✗ npm not found" -ForegroundColor Red
	$allGood = $false
}
Write-Host ""

# Check SQL Server
Write-Host "Checking SQL Server..." -ForegroundColor Yellow
try {
	$sqlVersion = sqlcmd -S localhost -Q "SELECT @@VERSION" -h -1 -W 2>&1 | Select-Object -First 1
	if ($LASTEXITCODE -eq 0) {
		Write-Host "  ✓ SQL Server accessible at localhost" -ForegroundColor Green
		Write-Host "    $sqlVersion" -ForegroundColor Gray
	} else {
		Write-Host "  ✗ SQL Server not accessible at localhost" -ForegroundColor Red
		Write-Host "    Trying SQL Server Express..." -ForegroundColor Yellow
		$sqlVersion = sqlcmd -S localhost\SQLEXPRESS -Q "SELECT @@VERSION" -h -1 -W 2>&1 | Select-Object -First 1
		if ($LASTEXITCODE -eq 0) {
			Write-Host "  ✓ SQL Server Express found at localhost\SQLEXPRESS" -ForegroundColor Green
			Write-Host "    ⚠ Update connection string to use: Server=localhost\SQLEXPRESS" -ForegroundColor Yellow
		} else {
			Write-Host "  ✗ SQL Server not found" -ForegroundColor Red
			Write-Host "    Install from: https://www.microsoft.com/sql-server/sql-server-downloads" -ForegroundColor Yellow
			$allGood = $false
		}
	}
} catch {
	Write-Host "  ✗ SQL Server check failed" -ForegroundColor Red
	Write-Host "    sqlcmd tool not found - install SQL Server Command Line Utilities" -ForegroundColor Yellow
	$allGood = $false
}
Write-Host ""

# Check if database exists
Write-Host "Checking PrepNex Database..." -ForegroundColor Yellow
try {
	$dbCheck = sqlcmd -S localhost -d master -Q "SELECT name FROM sys.databases WHERE name = 'PrepNex'" -h -1 -W 2>&1
	if ($dbCheck -match "PrepNex") {
		Write-Host "  ✓ PrepNex database exists" -ForegroundColor Green

		# Check if tables exist
		$tableCount = sqlcmd -S localhost -d PrepNex -Q "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'" -h -1 -W 2>&1
		Write-Host "  ✓ Database has $($tableCount.Trim()) tables" -ForegroundColor Green

		# Check if questions exist
		$questionCount = sqlcmd -S localhost -d PrepNex -Q "SELECT COUNT(*) FROM Questions" -h -1 -W 2>&1
		if ($questionCount -match "\d+") {
			Write-Host "  ✓ Database has $($questionCount.Trim()) questions seeded" -ForegroundColor Green
		}
	} else {
		Write-Host "  ⚠ PrepNex database not found" -ForegroundColor Yellow
		Write-Host "    Run: .\setup-database.ps1" -ForegroundColor Gray
	}
} catch {
	Write-Host "  ⚠ Could not check database (may not exist yet)" -ForegroundColor Yellow
}
Write-Host ""

# Check project files
Write-Host "Checking Project Files..." -ForegroundColor Yellow
$apiProject = Test-Path "API\PrepNex.csproj"
$frontendPackage = Test-Path "Frontend\package.json"

if ($apiProject) {
	Write-Host "  ✓ Backend project found" -ForegroundColor Green
} else {
	Write-Host "  ✗ Backend project not found" -ForegroundColor Red
	$allGood = $false
}

if ($frontendPackage) {
	Write-Host "  ✓ Frontend project found" -ForegroundColor Green
} else {
	Write-Host "  ✗ Frontend project not found" -ForegroundColor Red
	$allGood = $false
}

$frontendModules = Test-Path "Frontend\node_modules"
if ($frontendModules) {
	Write-Host "  ✓ Frontend dependencies installed" -ForegroundColor Green
} else {
	Write-Host "  ⚠ Frontend dependencies not installed" -ForegroundColor Yellow
	Write-Host "    Run: cd Frontend; npm install" -ForegroundColor Gray
}
Write-Host ""

# Check configuration files
Write-Host "Checking Configuration..." -ForegroundColor Yellow
$appsettings = Test-Path "API\appsettings.json"
$frontendEnv = Test-Path "Frontend\.env"

if ($appsettings) {
	Write-Host "  ✓ Backend configuration found" -ForegroundColor Green
	$config = Get-Content "API\appsettings.json" | ConvertFrom-Json
	$connString = $config.ConnectionStrings.DefaultConnection
	Write-Host "    Connection: $connString" -ForegroundColor Gray
} else {
	Write-Host "  ✗ Backend configuration missing" -ForegroundColor Red
	$allGood = $false
}

if ($frontendEnv) {
	Write-Host "  ✓ Frontend configuration found" -ForegroundColor Green
	$envContent = Get-Content "Frontend\.env" | Where-Object { $_ -match "VITE_API_BASE_URL" }
	Write-Host "    $envContent" -ForegroundColor Gray
} else {
	Write-Host "  ✗ Frontend configuration missing" -ForegroundColor Red
	$allGood = $false
}
Write-Host ""

# Summary
Write-Host "===========================================================" -ForegroundColor Cyan
if ($allGood) {
	Write-Host "  ✓ All prerequisites met!" -ForegroundColor Green
	Write-Host ""
	Write-Host "  Ready to start PrepNex!" -ForegroundColor White
	Write-Host "  Run: .\start-prepnex.ps1" -ForegroundColor Cyan
} else {
	Write-Host "  ⚠ Some prerequisites are missing" -ForegroundColor Yellow
	Write-Host ""
	Write-Host "  Please install missing components and try again." -ForegroundColor White
	Write-Host "  See QUICK_START.md for detailed instructions." -ForegroundColor Gray
}
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host ""
