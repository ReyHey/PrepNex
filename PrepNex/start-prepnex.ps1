# PrepNex Complete Setup and Run Script
# This script sets up the database and starts both backend and frontend

param(
	[switch]$SkipDatabase,
	[switch]$SkipNpmInstall
)

$ErrorActionPreference = "Stop"

Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "  PrepNex - Interview Preparation Platform Setup & Run" -ForegroundColor Cyan
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host ""

# ===== DATABASE SETUP =====
if (-not $SkipDatabase) {
	Write-Host "[1/4] Setting up SQL Server Database..." -ForegroundColor Yellow
	Write-Host ""

	# Check if SQL Server is accessible
	try {
		$testConnection = sqlcmd -S localhost -Q "SELECT @@VERSION" -b 2>&1
		if ($LASTEXITCODE -ne 0) {
			Write-Host "ERROR: Cannot connect to SQL Server at localhost" -ForegroundColor Red
			Write-Host ""
			Write-Host "Options:" -ForegroundColor Yellow
			Write-Host "1. Install SQL Server Express: https://www.microsoft.com/sql-server/sql-server-downloads" -ForegroundColor White
			Write-Host "2. Or install SQL Server LocalDB (comes with Visual Studio)" -ForegroundColor White
			Write-Host "3. Update connection string in appsettings.json if using different server" -ForegroundColor White
			Write-Host ""
			$continue = Read-Host "Press Enter to skip database setup and continue, or Ctrl+C to exit"
			$SkipDatabase = $true
		} else {
			Write-Host "  ✓ SQL Server is accessible" -ForegroundColor Green
		}
	} catch {
		Write-Host "ERROR: Cannot connect to SQL Server: $_" -ForegroundColor Red
		$continue = Read-Host "Press Enter to skip database setup and continue, or Ctrl+C to exit"
		$SkipDatabase = $true
	}

	if (-not $SkipDatabase) {
		# Apply schema
		Write-Host "  → Applying database schema..." -ForegroundColor Gray
		try {
			$schemaResult = sqlcmd -S localhost -d master -i "API\Database\schema.sql" -b 2>&1
			if ($LASTEXITCODE -eq 0) {
				Write-Host "  ✓ Schema applied" -ForegroundColor Green
			} else {
				Write-Host "  ⚠ Schema application had warnings (may already exist)" -ForegroundColor Yellow
			}
		} catch {
			Write-Host "  ⚠ Schema error: $_" -ForegroundColor Yellow
		}

		# Apply seed data
		Write-Host "  → Applying seed data..." -ForegroundColor Gray
		try {
			$seedResult = sqlcmd -S localhost -d PrepNex -i "API\Database\seed.sql" -b 2>&1
			if ($LASTEXITCODE -eq 0) {
				Write-Host "  ✓ Seed data applied" -ForegroundColor Green
			} else {
				Write-Host "  ⚠ Seed data had warnings (may already exist)" -ForegroundColor Yellow
			}
		} catch {
			Write-Host "  ⚠ Seed data error: $_" -ForegroundColor Yellow
		}
	}
	Write-Host ""
} else {
	Write-Host "[1/4] Skipping database setup (--SkipDatabase flag)" -ForegroundColor Gray
	Write-Host ""
}

# ===== BACKEND BUILD =====
Write-Host "[2/4] Building Backend API..." -ForegroundColor Yellow
try {
	Push-Location API
	dotnet build --nologo -v q
	if ($LASTEXITCODE -eq 0) {
		Write-Host "  ✓ Backend built successfully" -ForegroundColor Green
	} else {
		Write-Host "  ✗ Backend build failed" -ForegroundColor Red
		Pop-Location
		exit 1
	}
	Pop-Location
} catch {
	Write-Host "  ✗ Backend build error: $_" -ForegroundColor Red
	Pop-Location
	exit 1
}
Write-Host ""

# ===== FRONTEND DEPENDENCIES =====
if (-not $SkipNpmInstall) {
	Write-Host "[3/4] Installing Frontend Dependencies..." -ForegroundColor Yellow
	try {
		Push-Location Frontend
		if (-not (Test-Path "node_modules")) {
			Write-Host "  → Running npm install..." -ForegroundColor Gray
			npm install --silent 2>&1 | Out-Null
			Write-Host "  ✓ Frontend dependencies installed" -ForegroundColor Green
		} else {
			Write-Host "  ✓ Frontend dependencies already installed" -ForegroundColor Green
		}
		Pop-Location
	} catch {
		Write-Host "  ✗ Frontend dependency installation error: $_" -ForegroundColor Red
		Pop-Location
		exit 1
	}
} else {
	Write-Host "[3/4] Skipping npm install (--SkipNpmInstall flag)" -ForegroundColor Gray
}
Write-Host ""

# ===== START SERVICES =====
Write-Host "[4/4] Starting Services..." -ForegroundColor Yellow
Write-Host ""

# Start Backend
Write-Host "  → Starting Backend API..." -ForegroundColor Gray
$backendJob = Start-Job -ScriptBlock {
	Set-Location $using:PWD
	Set-Location API
	dotnet run --no-build
}

Start-Sleep -Seconds 3

# Check if backend started
if ($backendJob.State -eq "Running") {
	Write-Host "  ✓ Backend API starting at http://localhost:5047" -ForegroundColor Green
	Write-Host "    Swagger UI: http://localhost:5047/swagger" -ForegroundColor Cyan
} else {
	Write-Host "  ✗ Backend failed to start" -ForegroundColor Red
	Receive-Job $backendJob
	Stop-Job $backendJob
	Remove-Job $backendJob
	exit 1
}

# Start Frontend
Write-Host "  → Starting Frontend..." -ForegroundColor Gray
$frontendJob = Start-Job -ScriptBlock {
	Set-Location $using:PWD
	Set-Location Frontend
	npm run dev
}

Start-Sleep -Seconds 3

# Check if frontend started
if ($frontendJob.State -eq "Running") {
	Write-Host "  ✓ Frontend starting at http://localhost:5173" -ForegroundColor Green
} else {
	Write-Host "  ✗ Frontend failed to start" -ForegroundColor Red
	Receive-Job $frontendJob
	Stop-Job $frontendJob
	Remove-Job $frontendJob
	Stop-Job $backendJob
	Remove-Job $backendJob
	exit 1
}

Write-Host ""
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "  ✓ PrepNex is running!" -ForegroundColor Green
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  Backend:  http://localhost:5047" -ForegroundColor White
Write-Host "  Swagger:  http://localhost:5047/swagger" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop all services..." -ForegroundColor Yellow
Write-Host ""

# Keep script running and show logs
try {
	while ($true) {
		$backendOutput = Receive-Job $backendJob -Keep | Select-Object -Last 5
		$frontendOutput = Receive-Job $frontendJob -Keep | Select-Object -Last 5

		if ($backendOutput) {
			Write-Host "[Backend] " -ForegroundColor Cyan -NoNewline
			$backendOutput | ForEach-Object { Write-Host $_ }
		}
		if ($frontendOutput) {
			Write-Host "[Frontend] " -ForegroundColor Magenta -NoNewline
			$frontendOutput | ForEach-Object { Write-Host $_ }
		}

		Start-Sleep -Seconds 2

		# Check if jobs are still running
		if ($backendJob.State -ne "Running") {
			Write-Host "Backend stopped unexpectedly!" -ForegroundColor Red
			break
		}
		if ($frontendJob.State -ne "Running") {
			Write-Host "Frontend stopped unexpectedly!" -ForegroundColor Red
			break
		}
	}
} finally {
	Write-Host ""
	Write-Host "Stopping services..." -ForegroundColor Yellow
	Stop-Job $backendJob -ErrorAction SilentlyContinue
	Stop-Job $frontendJob -ErrorAction SilentlyContinue
	Remove-Job $backendJob -ErrorAction SilentlyContinue
	Remove-Job $frontendJob -ErrorAction SilentlyContinue
	Write-Host "Services stopped." -ForegroundColor Green
}
