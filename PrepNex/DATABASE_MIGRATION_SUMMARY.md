# PrepNex - Database Migration Summary

## Changes Made to Fix Your Application

### 🎯 Problem Identified
You pulled from main which had:
1. New SQL Server database schema (schema.sql)
2. New frontend
3. Old code still configured for SQLite with Entity Framework Core

### ✅ Solutions Implemented

#### 1. **NuGet Package Updates**
Added the following packages to support SQL Server:
- `Microsoft.Data.SqlClient` (v7.0.1) - Modern SQL Server client
- `Microsoft.EntityFrameworkCore.SqlServer` (v10.0.7) - EF Core SQL Server provider

#### 2. **Connection String Updates**
Updated both configuration files to use SQL Server:

**API/appsettings.json** & **API/appsettings.Development.json**:
```json
{
  "ConnectionStrings": {
	"DefaultConnection": "Server=localhost;Database=PrepNex;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

Previously: `"Data Source=prepnex.db"` (SQLite)

#### 3. **Program.cs Updates**
Changed Entity Framework provider from SQLite to SQL Server:

**Before:**
```csharp
options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=prepnex.db")
```

**After:**
```csharp
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Server=localhost;Database=PrepNex;Trusted_Connection=True;TrustServerCertificate=True;")
```

#### 4. **DBConnection.cs Fix**
Updated namespace from legacy `System.Data.SqlClient` to modern `Microsoft.Data.SqlClient`:

**Before:**
```csharp
using System.Data.SqlClient;
```

**After:**
```csharp
using Microsoft.Data.SqlClient;
```

#### 5. **Helper Scripts Created**

Created three PowerShell scripts to make your life easier:

##### **setup-database.ps1**
- Checks SQL Server connectivity
- Applies schema.sql (creates tables)
- Applies seed.sql (inserts 11 questions)
- Simple database setup

##### **start-prepnex.ps1** (⭐ Recommended)
- All-in-one script
- Sets up database
- Builds backend
- Installs frontend dependencies
- Starts both backend and frontend
- Monitors both services

##### **check-environment.ps1**
- Verifies all prerequisites (.NET, Node.js, SQL Server)
- Checks database status
- Validates configuration
- Helpful diagnostics

#### 6. **Documentation**

##### **QUICK_START.md**
Comprehensive guide covering:
- Prerequisites
- Quick start (one command)
- Manual setup steps
- Configuration details
- Troubleshooting guide
- Project structure

---

## 🚀 How to Use

### Simplest Method (Recommended)
```powershell
.\start-prepnex.ps1
```

This does everything:
1. ✅ Sets up database
2. ✅ Builds API
3. ✅ Installs frontend deps
4. ✅ Starts both services

### If You Need to Check First
```powershell
.\check-environment.ps1
```

### Manual Database Setup Only
```powershell
.\setup-database.ps1
```

---

## 📊 Database Schema Overview

Your new database has these tables:

### Core Tables
- **Questions** - Interview questions with metadata
- **QuestionOptions** - Multiple choice options
- **QuestionHints** - Ordered hints
- **QuestionExamples** - Input/output examples
- **QuestionConstraints** - Algorithmic constraints

### Session Management
- **Sessions** - Interview session tracking
- **SessionSkills** - User-selected skills
- **SessionQuestions** - Questions in a session
- **Answers** - User responses
- **SessionFeedback** - Overall AI feedback
- **QuestionFeedback** - Per-question AI feedback

**Total: 11 tables** with proper foreign keys and constraints

---

## 🔧 Configuration Details

### Backend (API)
- **Framework**: .NET 10
- **Port**: 5047 (HTTP), 7278 (HTTPS)
- **Database**: SQL Server (localhost/PrepNex)
- **Swagger**: http://localhost:5047/swagger

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Port**: 5173 (auto-increments if busy)
- **API Endpoint**: http://localhost:5047
- **Config**: Frontend/.env

---

## 🐛 Troubleshooting Quick Reference

### "Cannot connect to SQL Server"

**Option 1: Install SQL Server Express**
```
https://www.microsoft.com/sql-server/sql-server-downloads
```

**Option 2: Use SQL Server LocalDB**
```powershell
sqllocaldb create MSSQLLocalDB
sqllocaldb start MSSQLLocalDB
```
Update connection string to: `Server=(localdb)\\MSSQLLocalDB;...`

**Option 3: Use SQL Server Express instance**
Update connection string to: `Server=localhost\\SQLEXPRESS;...`

### Build Errors
```powershell
# Clean and rebuild
cd API
dotnet clean
dotnet restore
dotnet build
```

### Port Conflicts
- Backend: Update `API/Properties/launchSettings.json`
- Frontend: Vite will auto-select next available port

### Database Issues
```powershell
# Rebuild database
sqlcmd -S localhost -Q "DROP DATABASE PrepNex"
.\setup-database.ps1
```

---

## ✅ What's Working Now

- ✅ Backend builds successfully
- ✅ SQL Server integration configured
- ✅ Modern NuGet packages installed
- ✅ Connection strings updated
- ✅ Frontend configuration preserved
- ✅ Database schema ready to apply
- ✅ Seed data with 11 questions ready
- ✅ Automated setup scripts
- ✅ Comprehensive documentation

---

## 📁 Files Modified

### Modified Files:
1. `API/appsettings.json` - Connection string
2. `API/appsettings.Development.json` - Connection string
3. `API/Program.cs` - SQLite → SQL Server
4. `API/DataAccess/DBConnection.cs` - Namespace update
5. `API/PrepNex.csproj` - NuGet packages added

### New Files:
1. `setup-database.ps1` - Database setup script
2. `start-prepnex.ps1` - All-in-one startup script
3. `check-environment.ps1` - Environment verification
4. `QUICK_START.md` - User guide
5. `DATABASE_MIGRATION_SUMMARY.md` - This file

---

## 🎉 Next Steps

1. **Check your environment:**
   ```powershell
   .\check-environment.ps1
   ```

2. **Start the application:**
   ```powershell
   .\start-prepnex.ps1
   ```

3. **Open in browser:**
   - Frontend: http://localhost:5173
   - Swagger: http://localhost:5047/swagger

4. **Start interviewing!** 🚀

---

## 💡 Pro Tips

- Use `start-prepnex.ps1 -SkipDatabase` if database is already set up
- Use `start-prepnex.ps1 -SkipNpmInstall` if dependencies are installed
- Press Ctrl+C to stop all services cleanly
- Check `QUICK_START.md` for detailed troubleshooting

---

**Your PrepNex application is now fully configured and ready to run!** 🎊
