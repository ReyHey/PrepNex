# PrepNex Development Server Startup Script

Write-Host "Starting PrepNex Development Servers..." -ForegroundColor Green

# Start Backend API
Write-Host "`nStarting Backend API..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\API'; Write-Host 'Backend API Server' -ForegroundColor Green; dotnet run"

# Wait a moment for backend to start
Start-Sleep -Seconds 2

# Start Frontend
Write-Host "Starting Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\Frontend'; Write-Host 'Frontend Development Server' -ForegroundColor Green; npm run dev"

Write-Host "`n✅ Both servers are starting in separate windows..." -ForegroundColor Green
Write-Host "Backend API: http://localhost:5047" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "`nPress any key to exit this script (servers will continue running)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
