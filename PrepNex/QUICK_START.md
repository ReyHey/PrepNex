# 🚀 PrepNex - Quick Start Guide

PrepNex is now configured to use SQL Server with the new database schema!

## Prerequisites

1. **SQL Server** - One of the following:
   - SQL Server Express (recommended): https://www.microsoft.com/sql-server/sql-server-downloads
   - SQL Server LocalDB (comes with Visual Studio)
   - SQL Server Developer Edition

2. **.NET 10 SDK** - Already configured ✅

3. **Node.js** - For the frontend: https://nodejs.org/

## 🎯 Quick Start (Easiest Method)

Run this single command in PowerShell from the solution root:

```powershell
.\start-prepnex.ps1
```

This will:
- ✅ Set up the SQL Server database
- ✅ Build the backend API
- ✅ Install frontend dependencies
- ✅ Start both backend and frontend
- ✅ Open them in your browser

**After running, access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5047
- Swagger UI: http://localhost:5047/swagger

Press `Ctrl+C` to stop all services.

---

## 📋 Manual Setup (Step by Step)

### Step 1: Set Up the Database

```powershell
.\setup-database.ps1
```

This creates the `PrepNex` database and seeds it with 11 interview questions.

**Alternative (if script doesn't work):**
```powershell
sqlcmd -S localhost -d master -i API\Database\schema.sql
sqlcmd -S localhost -d PrepNex -i API\Database\seed.sql
```

### Step 2: Start the Backend

```powershell
cd API
dotnet run
```

The API will start at http://localhost:5047

### Step 3: Start the Frontend

Open a **new terminal**:

```powershell
cd Frontend
npm install
npm run dev
```

The frontend will start at http://localhost:5173

---

## ⚙️ Configuration

### Database Connection

The connection string is configured in:
- `API/appsettings.json`
- `API/appsettings.Development.json`

**Current setting:**
```json
"DefaultConnection": "Server=localhost;Database=PrepNex;Trusted_Connection=True;TrustServerCertificate=True;"
```

**If using a different SQL Server instance**, update the `Server` value:
- SQL Server Express: `localhost\SQLEXPRESS`
- Named instance: `localhost\INSTANCENAME`
- Remote server: `servername` or `ip_address`

### Frontend API Endpoint

The frontend is configured in `Frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5047
VITE_USE_MOCK_DATA=false
```

---

## 🛠️ Troubleshooting

### "Cannot connect to SQL Server"

**Solution 1 - SQL Server Express:**
1. Download: https://www.microsoft.com/sql-server/sql-server-downloads
2. Install SQL Server Express
3. During setup, choose "Basic" installation
4. Update connection string to: `Server=localhost\\SQLEXPRESS;...`

**Solution 2 - SQL Server LocalDB (if you have Visual Studio):**
```powershell
sqllocaldb create MSSQLLocalDB
sqllocaldb start MSSQLLocalDB
```
Update connection string to: `Server=(localdb)\\MSSQLLocalDB;...`

### "Database already exists" error

This is normal if you've run the setup before. The script will skip or update as needed.

### "Port already in use"

**Backend (port 5047):**
- Stop any other API running on this port
- Or update `API/Properties/launchSettings.json`

**Frontend (port 5173):**
- Vite will automatically use the next available port (5174, 5175, etc.)

### Frontend can't connect to backend

1. Ensure the backend is running at http://localhost:5047
2. Check `Frontend/.env` has correct `VITE_API_BASE_URL`
3. Restart the frontend after changing `.env`

---

## 🔧 Advanced Commands

### Rebuild Database from Scratch

```powershell
# Drop and recreate
sqlcmd -S localhost -Q "DROP DATABASE PrepNex"
.\setup-database.ps1
```

### Clean Build

```powershell
# Backend
cd API
dotnet clean
dotnet build

# Frontend
cd Frontend
Remove-Item -Recurse -Force node_modules
npm install
```

### Check Database

```powershell
sqlcmd -S localhost -d PrepNex -Q "SELECT COUNT(*) as QuestionCount FROM Questions"
```

Should show: `11` (the seeded questions)

---

## 📁 Project Structure

```
PrepNex/
├── API/                      # .NET 10 Backend
│   ├── Controllers/          # API endpoints
│   ├── Data/                 # EF Core DbContext & Seeder
│   ├── Database/             # SQL scripts
│   │   ├── schema.sql       # Creates tables
│   │   └── seed.sql         # Inserts questions
│   ├── Models/              # Data models
│   └── Program.cs           # API startup
├── Frontend/                # React + TypeScript + Vite
│   ├── src/
│   │   ├── pages/          # Main pages
│   │   ├── components/     # React components
│   │   └── api/            # API client
│   └── .env                # Frontend config
├── setup-database.ps1      # Database setup script
└── start-prepnex.ps1       # All-in-one startup script
```

---

## 🎯 What Changed

✅ Migrated from **SQLite** to **SQL Server**  
✅ Added proper **relational database schema**  
✅ Updated **Entity Framework** to use SQL Server  
✅ Fixed all **package dependencies**  
✅ Created **automated setup scripts**  
✅ Updated **connection strings**  

---

## 🚀 You're Ready!

Run `.\start-prepnex.ps1` and start interviewing! 🎉
