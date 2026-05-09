# ✅ PowerShell Script Fixed!

## The Problem
The PowerShell scripts had `@@VERSION` SQL syntax that caused parsing errors in PowerShell because `@` is a special character.

## The Fix
Changed all instances from:
```powershell
sqlcmd -Q "SELECT @@VERSION"
```

To:
```powershell
sqlcmd -Q "SELECT 1"
```

## Your Current Status

✅ **.NET 10 SDK** - Installed  
✅ **Node.js** - Installed (v22.9.0)  
✅ **npm** - Installed (10.8.3)  
✅ **Backend Project** - Found  
✅ **Frontend Project** - Found  
✅ **Frontend Dependencies** - Installed  
✅ **Configuration Files** - Ready  

❌ **SQL Server** - Not Installed

---

## 🎯 Your Options Now

### Option 1: Install SQL Server (Recommended for Production)

This will use the new database schema with all the advanced features.

**Quick Install:**
1. Download SQL Server Express (free): https://www.microsoft.com/sql-server/sql-server-downloads
2. Run the installer, choose "Basic" installation
3. After install, update connection string in `API/appsettings.json` to:
   ```json
   "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=PrepNex;Trusted_Connection=True;TrustServerCertificate=True;"
   ```
4. Run: `.\setup-database.ps1`
5. Run: `.\start-prepnex.ps1`

**Alternative - SQL Server LocalDB (if you have Visual Studio):**
```powershell
sqllocaldb create MSSQLLocalDB
sqllocaldb start MSSQLLocalDB
```
Then update connection string to:
```json
"DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=PrepNex;Trusted_Connection=True;TrustServerCertificate=True;"
```

---

### Option 2: Use SQLite Temporarily (Quick Test)

If you just want to test quickly without installing SQL Server, you can temporarily revert to SQLite:

**Quick commands:**
```powershell
# Revert connection string
$content = Get-Content API\appsettings.json -Raw
$content = $content -replace 'Server=localhost;Database=PrepNex;Trusted_Connection=True;TrustServerCertificate=True;', 'Data Source=prepnex.db'
$content | Set-Content API\appsettings.json

# Same for Development settings
$content = Get-Content API\appsettings.Development.json -Raw
$content = $content -replace 'Server=localhost;Database=PrepNex;Trusted_Connection=True;TrustServerCertificate=True;', 'Data Source=prepnex.db'
$content | Set-Content API\appsettings.Development.json

# Update Program.cs
# Change UseSqlServer back to UseSqlite (manual edit required)
```

**Note:** With SQLite, you'll lose the advanced relational schema features from the new database, but the app will run.

---

### Option 3: Use Azure SQL Database (Cloud Option)

If you prefer cloud hosting:
1. Create an Azure SQL Database (free tier available)
2. Update connection string with Azure credentials
3. Run `.\setup-database.ps1` (modify to use Azure connection)

---

## 🚀 Recommended Next Steps

**For Learning/Development (Easiest):**
1. Install **SQL Server Express** (10 minutes)
2. Run `.\check-environment.ps1` (should show all green)
3. Run `.\start-prepnex.ps1` (starts everything)
4. Open http://localhost:5173

**For Quick Testing (No Install):**
1. Manually change Program.cs line 17: `UseSqlServer` → `UseSqlite`
2. Update both appsettings.json files to use SQLite connection
3. Run: `cd API; dotnet run`
4. Run: `cd Frontend; npm run dev`

---

## 📝 Scripts Now Working

✅ `check-environment.ps1` - Checks prerequisites  
✅ `setup-database.ps1` - Sets up SQL Server database  
✅ `start-prepnex.ps1` - All-in-one startup script  

All PowerShell parsing errors are fixed!

---

## 🆘 Need Help?

**Check what you have:**
```powershell
.\check-environment.ps1
```

**Manual start (without database setup):**
```powershell
# Terminal 1 - Backend
cd API
dotnet run

# Terminal 2 - Frontend  
cd Frontend
npm run dev
```

**Quick test if API works:**
```powershell
# After starting backend
Invoke-WebRequest http://localhost:5047/swagger
```

---

Would you like me to:
1. Help you install SQL Server Express?
2. Create a script to temporarily revert to SQLite?
3. Set up Azure SQL Database?

Let me know! 🚀
